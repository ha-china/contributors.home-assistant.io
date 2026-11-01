---
title: "引入子设备"
description: 子设备为集成提供了一种一等公民的方式，用于建模一个物理产品的各个部分，例如插线板的插座，而不是将其拆分为多个通过 via_device 关联的设备。
date: 2026-10-22
authors:
  - Erik Montnémery
areas:
  - core
---

## 摘要

Home Assistant 现在提供了一种一等公民的方式，用于建模由多个逻辑部分组成的设备：**子设备（child device）**。子设备是一种轻量级子设备，归属于单个父设备。可以想象智能插线板的各个插座，或多联墙壁开关的各个开关单元。

到目前为止，集成通过将产品拆分为多个设备，并使用 `via_device` 将各部分关联回父设备来表达这种关系。这种方式可行，但 `via_device` 的设计初衷是描述_连接性_：Home Assistant 如何访问设备，例如通过协调器访问的 Zigbee 灯泡，或通过 Hue 桥接器访问的飞利浦 Hue 灯。将其用于_组合关系_（即逻辑部分属于哪个物理产品）会过度使用该字段，并阻止 Home Assistant 区分这两种关系。

子设备将这两个概念分开。**目前使用 `via_device` 建模子设备的集成应迁移到子设备。** 真正的网关或集线器关系（涉及独立的物理产品）继续使用 `via_device_id`。

此功能已在核心 [PR #178666](https://github.com/home-assistant/core/pull/178666) 中实现，其理由在架构提案 [home-assistant/architecture#1414](https://github.com/home-assistant/architecture/discussions/1414) 中进行了描述。子设备自 Home Assistant Core 2026.9 起可用。[设备注册表](/core/integrations/device-registry/#child-devices) 页面记录了它们。

## 子设备与 via 设备

`via_device` 链接的两端是**独立的物理产品**，其中一个作为另一个的网关。删除网关不应删除其背后的设备。它们仍然存在，只是不再可达。

子设备关系的各部分属于**一个物理产品**。插线板是单一产品，其插座本身没有独立意义。因此，子设备：

- 归属于其父设备，并与父设备属于同一配置条目和配置子条目。
- 没有自己的连接性或硬件身份：没有 `connections`、`via_device`、`manufacturer`、`model`、固件版本或序列号。这些属于物理父设备。
- 继承父设备的区域，除非为其指定了独立区域。车库中的插线板默认将其所有插座放在车库中，但为花园灯供电的插座可以移动到花园。
- 在父设备被删除时被删除，在父设备被禁用时被禁用。

子设备是单层的：子设备不能成为另一个子设备的父设备。

## 创建子设备

设备通过两种方式之一被采纳为子设备，这与任何设备注册的两种方式相对应：通过实体，或直接在设备注册表上。无论哪种方式，子设备都通过 `parent_device_id` 指向其父设备。这是父设备的 Home Assistant 设备 ID（`DeviceEntry.id`），而不是其标识符，因此父设备必须已经注册且其 ID 已知。

### 从实体的 `device_info`

对于由其实体隐式创建设备的情况，从实体的 `device_info` 返回一个 `ChildDeviceInfo`，其中 `parent_device_id` 指向父设备。`ChildDeviceInfo` 是 `DeviceInfo` 的轻量级对应物，仅包含对子设备有意义的字段：`identifiers`、`name`、`parent_device_id`、`suggested_area`、`translation_key` 和 `translation_placeholders`。`identifiers` 和 `parent_device_id` 是必需的。与 `DeviceInfo` 一样，它是一个数据类，请参阅 [DeviceInfo 现在是数据类](/blog/2026/10/13/device-info-class/)。

```python
from homeassistant.helpers.device_registry import ChildDeviceInfo


class OutletSwitch(SwitchEntity):
    @property
    def device_info(self) -> ChildDeviceInfo:
        """Return the child device info."""
        return ChildDeviceInfo(
            identifiers={(DOMAIN, f"{self._strip_id}_outlet_{self._outlet}")},
            name=f"Outlet {self._outlet}",
            parent_device_id=self._parent_device_id,
        )
```

实体的 `device_info` 可以返回 `DeviceInfo` 或 `ChildDeviceInfo`。返回 `ChildDeviceInfo` 是将其路由到子设备注册的方式。

### 手动使用 `async_get_or_create_child`

对于不由实体表示的设备，使用 `async_get_or_create_child` 方法直接在设备注册表上注册子设备：

```python
def async_get_or_create_child(
    self,
    *,
    config_entry_id: str,
    config_subentry_id: str | UndefinedType | None = UNDEFINED,
    disabled_by: DeviceEntryDisabler | UndefinedType | None = UNDEFINED,
    identifiers: set[tuple[str, str]],
    name: str | UndefinedType | None = UNDEFINED,
    parent_device_id: str,
    suggested_area: str | UndefinedType | None = UNDEFINED,
    translation_key: str | None = None,
    translation_placeholders: Mapping[str, str] | None = None,
) -> ChildDeviceEntry:
    """Get child device. Create if it doesn't exist."""
```

`config_entry_id`、`identifiers` 和 `parent_device_id` 是必需的。故意没有 `via_device_id`、`connections`、`manufacturer`、`model` 或固件参数，因为子设备不携带这些。

```python
from homeassistant.helpers import device_registry as dr

device_registry = dr.async_get(hass)

# The parent device must be registered first
parent = device_registry.async_get_or_create(
    config_entry_id=entry.entry_id,
    identifiers={(DOMAIN, strip_id)},
    manufacturer="Example",
    name="Power strip",
)

# Register each outlet as a child of the power strip
outlet = device_registry.async_get_or_create_child(
    config_entry_id=entry.entry_id,
    parent_device_id=parent.id,
    identifiers={(DOMAIN, f"{strip_id}_outlet_1")},
    name="Outlet 1",
)
```

当您已经持有 `ChildDeviceInfo`（例如与您的实体共享的）时，请将其原样传递给 `async_get_or_create_child_from_info`，而不是解包它。

父设备必须已经存在（注册表永远不会为您创建它），必须由同一配置条目注册，并且必须属于同一配置子条目。如果父设备属于配置子条目，请显式传递其 `config_subentry_id`。它不会被继承，省略它默认为无子条目并引发 `DeviceInfoError`。父设备本身必须是主设备，因为子设备不能成为另一个子设备的父设备。

## 将现有设备转换为子设备

迁移已经将产品拆分为多个设备的集成应保留现有设备 ID，以便基于设备的自动化继续工作。这会自动发生：如果传递给 `async_get_or_create_child` 的 `identifiers`（或子设备 `device_info` 的 `identifiers`）与同一配置条目的现有设备匹配，则该设备将**就地转换为子设备，并保留其 ID**。使用与之前独立设备相同的标识符注册上述插座，会将其转换为插线板的子设备，而不会更改其 ID。

如果自配置条目设置以来，同一配置条目已将该设备注册为主设备，则转换会被拒绝并引发 `DeviceInfoError`。Home Assistant 仅在配置条目卸载时才会忘记该注册。因此，在迁移后的下一次配置条目设置时，仅将部分注册为子设备，通过其实体的 `ChildDeviceInfo` 或使用 `async_get_or_create_child`。不要先将其注册为主设备，例如通过留在其某个实体上的 `DeviceInfo`。

迁移时，这也是删除子设备名称中嵌入的父名称前缀的好时机。例如，将 _"Power strip Outlet 3"_ 重命名为仅 _"Outlet 3"_，因为前端可以在需要时将父名称组合到显示名称中。

## 子设备无法转换回主设备

反向转换，即将子设备转回独立的主设备，**不直接支持**。`async_update_child_device` 上没有 `parent_device_id` 参数，重新指定父设备会被拒绝，并且使用活动子设备的标识符调用 `async_get_or_create` 会引发错误而不是提升它。

您可以通过**删除子设备，然后使用 `async_get_or_create` 将其重新创建为主设备**来间接实现，传递与已删除子设备相同的标识符：

```python
# Remove the child device first...
device_registry.async_remove_device(child.id)

# ...then recreate it as a main device with the same identifiers
device_registry.async_get_or_create(
    config_entry_id=entry.entry_id,
    # Same identifiers the child had
    identifiers={(DOMAIN, outlet_id)},
    name="Outlet 1",
)
```

顺序很重要：必须先删除子设备，然后其标识符才能自由注册为主设备。

此方法适用于没有实体的子设备。删除子设备也会删除其配置条目和子条目的实体注册表条目，重新创建设备不会恢复它们。只有当您的集成再次添加实体（现在带有主设备的 `DeviceInfo`）时，它们才会返回。Home Assistant 随后会恢复其设置，如实体 ID 和名称。因此，对于带有实体的子设备，迁移还必须重新注册其实体。

## 生命周期

子设备跟随其父设备：

- **删除级联。** 删除父设备会同时删除其子设备。子设备在没有其拆分出的物理设备时没有意义。
- **禁用级联。** 禁用父设备会禁用其子设备，启用父设备会重新启用其禁用的子设备。禁用父设备的子设备无法单独启用。
- **区域继承。** 没有独立区域的子设备报告其父设备的区域。在子设备上设置区域会覆盖该继承。
- **标签不继承。** 标签保持每个设备的显式设置。
- **有子设备的父设备无法移动**到另一个配置条目或子条目。子设备始终与其父设备位于同一条目和子条目上。
- **以父设备为目标也会以其子设备为目标。** 当父设备用作操作的目标时，该操作会解析为父设备_以及_其所有子设备的实体。以子设备为目标仅针对该子设备。

## 迁移指南

将产品拆分为多个设备并使用 `via_device` 链接各部分的集成，应将这些部分迁移到子设备：

- 使用 `parent_device_id` 设置为父设备 ID 来注册每个部分，可以从实体的 `device_info`（作为 `ChildDeviceInfo`）或使用 `async_get_or_create_child`。
- 保留该部分现有的 `identifiers`，以便现有设备就地转换为子设备并保留其 ID，从而保持自动化正常工作。
- 仅将部分注册为子设备。在当前设置期间，配置条目已注册为主设备的设备无法转换。
- 移除部分与父设备之间的 `via_device` 或 `via_device_id` 链接。父关系现在由 `parent_device_id` 表达。
- 从子设备名称中删除任何父名称前缀。

另一个常见的迁移是将实体从单个组合设备拆分到每个部分的子设备上。例如，将每个通道的实体从一个共享设备移动到每个通道的子设备上。保留原始设备作为父设备，其 ID 不变，并将每个部分的实体移动到新的子设备上。将实体移动到子设备会更改其 `device_id`，但以设备为目标的自动化和脚本无需用户干预即可继续工作：因为以设备为目标也会以子设备的实体为目标，任何以父设备为目标的操作仍会作用于已移动的实体。

对于独立物理产品之间的真正连接性（例如集线器及其通信的设备），请继续使用 `via_device_id`。
