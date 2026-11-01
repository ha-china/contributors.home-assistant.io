---
title: 设备注册表
description: 注册集成的设备，将它们链接到集线器，把产品拆分为子设备，并允许用户删除设备。
sidebarGroup: Devices and registries
order: 1
---

设备注册表（device registry）是 Home Assistant 跟踪[设备（device）](/glossary/device/)的地方。设备将属于一体的实体（entity）组合在一起：一个带电池的温湿度传感器就是一个包含三个实体的设备。用户可以在设备专属页面上查看设备、把它们放入区域（area），并在自动化（automation）中指定它们。

## 什么是设备

设备可以是拥有自己控制单元的物理设备，也可以是一个服务（service）。控制单元不必是智能的，但必须能够控制所发生的事情。

- 一个带有四个房间传感器的温控器是五个设备：一个对应温控器及其内置传感器，每个房间传感器各一个。
- 连接到另一个设备以读取其数据的传感器，是与该设备分开的独立设备。该传感器之后可以被移去读取另一个设备。
- 具有多个独立部件的产品，例如每个插座都可以独立开关的电源插排，可以拆分为一个父设备和若干[子设备（child device）](#child-devices)。

设备属于注册它们的配置条目（config entry）。由两个集成（integration）设置的物理设备是两个设备，每个配置条目各一个。

## 设备属性

| 属性 | 含义 |
| --- | --- |
| `id` | Home Assistant 为该设备生成的 ID |
| `identifiers` | 一组 `(DOMAIN, identifier)` 元组，例如序列号。每个元组在配置条目内是唯一的。 |
| `connections` | 一组 `(connection_type, value)` 元组，例如 MAC 地址。每个元组在配置条目内是唯一的。类型包括 `CONNECTION_NETWORK_MAC`、`CONNECTION_BLUETOOTH`、`CONNECTION_UPNP` 和 `CONNECTION_ZIGBEE`。 |
| `config_entry_id` | 该设备所属的配置条目 |
| `config_subentry_id` | 该设备所属的[子条目](/core/integrations/subentries/)，或 `None` |
| `name` | 设备的名称 |
| `name_by_user` | 用户为其指定的名称 |
| `manufacturer` | 制造商 |
| `model` | 型号名称 |
| `model_id` | 型号标识符 |
| `serial_number` | 序列号。与 `identifiers` 中的序列号不同，它不必是唯一的。 |
| `sw_version` | 固件版本 |
| `hw_version` | 硬件版本 |
| `configuration_url` | 设备或服务的配置位置。使用 `homeassistant://<path>` 链接到 Home Assistant 内的页面。 |
| `entry_type` | `None`，或对于服务为 `DeviceEntryType.SERVICE` |
| `via_device_id` | Home Assistant 通过该设备访问此设备，例如集线器 |
| `parent_device_id` | 对于子设备：其父设备。只有子设备（`ChildDeviceEntry`）具有此属性。WebSocket API 对其他设备将其报告为 `null`。 |
| `area_id` | 设备所在的区域 |
| `labels` | 设备的标签 |
| `disabled_by` | 禁用设备的对象，作为 `DeviceEntryDisabler`，或 `None` |
| `created_at`, `modified_at` | 设备的创建时间和最后更改时间。由注册表管理。 |

## 通过实体注册设备

最常见的方式：为你的实体提供 `device_info`。当实体被添加时，Home Assistant 会创建或更新设备。这只适用于从配置条目添加的、具有[唯一 ID](/glossary/unique-id/) 的实体。

```python
from homeassistant.helpers.device_registry import DeviceInfo


class ExampleEntity(CoordinatorEntity[ExampleCoordinator]):
    """Base entity of the Example integration."""

    _attr_has_entity_name = True

    def __init__(self, coordinator: ExampleCoordinator) -> None:
        """Initialize the entity."""
        super().__init__(coordinator)
        device = coordinator.data.device
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.serial_number)},
            manufacturer="Example",
            model=device.model_name,
            model_id=device.model_id,
            name=device.name,
            sw_version=device.firmware_version,
        )
```

`DeviceInfo` 接受 `identifiers`、`connections`、`name`、`manufacturer`、`model`、`model_id`、`serial_number`、`sw_version`、`hw_version`、`configuration_url`、`entry_type`、`suggested_area`、`via_device_id`，以及用于翻译名称的 `translation_key` 和 `translation_placeholders`。

注册表会查找同一配置条目下的现有设备，先按标识符查找，再按连接信息查找。匹配到一个就足够了：你传递的其他标识符和连接信息随后会被添加到该设备。如果它们已经属于同一配置条目的另一个设备，那就是冲突，注册表会抛出错误。

## 自行注册设备

A device without entities, like a hub, is registered directly. Do this in `async_setup_entry`:

```python
from homeassistant.helpers import device_registry as dr

device_registry = dr.async_get(hass)

hub = device_registry.async_get_or_create(
    config_entry_id=entry.entry_id,
    connections={(dr.CONNECTION_NETWORK_MAC, dr.format_mac(info.mac))},
    identifiers={(DOMAIN, info.bridge_id)},
    manufacturer="Signify",
    model=info.model_name,
    model_id=info.model_id,
    name=info.name,
    sw_version=info.sw_version,
)
```

It returns the `DeviceEntry`, with its `id`.

When you already hold a `DeviceInfo`, for example one built by a helper or shared with your entities, pass it as it is to `async_get_or_create_from_info`:

```python
hub = device_registry.async_get_or_create_from_info(
    config_entry_id=entry.entry_id, device_info=hub_device_info
)
```

## 将设备链接到集线器

`via_device_id` 告诉 Home Assistant 它通过哪个设备到达另一个设备，例如网桥后面的灯泡。它展示了网络的拓扑结构。它接受集线器设备的 Home Assistant ID，因此集线器必须先被注册。

如果你自行注册了集线器，你已经拥有它的 ID：将 `hub.id` 传递给你的实体。否则，请从集线器的标识符中查找它：

```python
via_device_id = dr.async_get_device_id_by_identifier(
    hass, (DOMAIN, bridge_id), config_entry_id=entry.entry_id
)
```

当集线器尚不存在时，会抛出 `ValueError`。

## 子设备

A child device is a lightweight device for a logical part of one physical product, like one outlet of a power strip or one gang of a wall switch. The parent device holds what belongs to the whole product, like the network connection and firmware updates. Each child holds the entities of its part, like a switch and an energy sensor per outlet. Users can put each part in a different area.

不要将此与 `via_device_id` 混淆：那是关于独立产品之间的连接关系。子设备针对的是一个产品的各个部分。

子设备：

- 属于一个父设备，通过父设备的设备 ID（`parent_device_id`）引用。
- 与其父设备属于相同的配置条目和子条目。
- 没有自己的身份标识：没有 `connections`、`via_device_id`、`manufacturer`、`model`、固件版本或序列号。这些都属于父设备。
- 获取其父设备的区域，除非它有自己的区域。
- 不能拥有自己的子设备。

### 注册子设备

通过实体，返回一个带有 `identifiers` 和 `parent_device_id` 的 `ChildDeviceInfo`。父设备必须已经注册：

```python
from homeassistant.helpers.device_registry import ChildDeviceInfo

self._attr_device_info = ChildDeviceInfo(
    identifiers={(DOMAIN, f"{strip_id}_outlet_{number}")},
    name=f"Outlet {number}",
    parent_device_id=parent_device_id,
)
```

或者直接注册：

```python
outlet = device_registry.async_get_or_create_child(
    config_entry_id=entry.entry_id,
    parent_device_id=parent.id,
    identifiers={(DOMAIN, f"{strip_id}_outlet_1")},
    name="Outlet 1",
)
```

Besides the required `config_entry_id`, `parent_device_id`, and `identifiers`, `async_get_or_create_child` takes `config_subentry_id`, `name`, `suggested_area`, `disabled_by`, `translation_key`, and `translation_placeholders`. There is deliberately no `via_device_id`, `connections`, `manufacturer`, `model`, or firmware argument: a child device doesn't have those. When you already hold a `ChildDeviceInfo`, pass it as it is to `async_get_or_create_child_from_info`.

如果父设备属于某个子条目，请同时传递其 `config_subentry_id`。它不会被继承。注册表永远不会为你创建父设备：当父设备不存在、本身是子设备，或属于另一个配置条目或子条目时，它会抛出 `DeviceInfoError`。

### 将现有设备迁移为子设备

如果子设备的标识符与同一配置条目下的某个现有设备匹配，该设备就会变成子设备，并保留其 ID。使用该设备的自动化将继续正常工作。这使得已经把产品拆分为独立设备的集成可以轻松迁移。

This only works if the config entry has not registered the device as a normal device since the entry was set up: the registry raises a `DeviceInfoError` then. It forgets those registrations when the config entry unloads. So register the part only as a child device, and don't leave a `DeviceInfo` for it on one of its entities.

The other way around is not supported directly. `async_update_child_device` can't change the parent, and `async_get_or_create` with the identifiers of an existing child device raises an error instead of turning it into a normal device. To turn a child device back into a normal device, remove it with `async_remove_device`, then register it again with `async_get_or_create`, with the same identifiers. The order matters: the identifiers are only free once the child device is removed. Removing a device also removes the entity registry entries of its entities, so this fits a child device without entities. Entities only come back when your integration adds them again, with their settings, like the entity ID and name, restored.

### 随父设备联动的行为

- 移除父设备会移除其子设备。
- 禁用父设备会禁用其子设备，启用父设备会再次启用它禁用的子设备。已禁用父设备的子设备不能单独启用。
- 没有自己区域的子设备位于其父设备的区域中。`dr.async_get_effective_area_id(hass, device)` 返回适用的区域。
- 标签不会被继承。
- 有子设备的父设备不能移动到另一个配置条目或子条目。
- 针对父设备的操作也会针对其子设备的实体。针对子设备的操作只针对该子设备的实体。这样，当集成将设备的实体移动到子设备时，针对设备的自动化仍然可以正常工作。

## 查找设备

在实体内部，使用 `self.device_entry`。在其他地方，请将查找范围限定在配置条目内：标识符和连接信息只在单个配置条目内是唯一的。

```python
device_registry = dr.async_get(hass)

# By the ID Home Assistant gave it
device = device_registry.async_get(device_id)

# By one of its identifiers or connections
device = device_registry.async_get_device_by_identifier(
    (DOMAIN, serial_number), entry.entry_id
)
device = device_registry.async_get_device_by_connection(
    (dr.CONNECTION_NETWORK_MAC, mac), entry.entry_id
)

# All devices of a config entry
devices = dr.async_entries_for_config_entry(device_registry, entry.entry_id)
```

`async_get` 返回普通设备和子设备。传递 `include_child_devices=False` 以仅获取普通设备。要仅获取子设备，请同时传递 `include_main_devices=False` 和 `include_composite_devices=False`：默认情况下，`async_get` 也会为[拆分为每个配置条目一个设备的设备](/blog/2026/07/21/device-registry-single-config-entry/#backwards-compatibility)返回一个只读替身，而该替身不是子设备。其他查找返回普通设备，而不是子设备。对于子设备，请使用 `async_get_child_device_by_identifier(identifier, config_entry_id)`，或使用 `dr.async_entries_for_parent_device(device_registry, parent_device_id)` 获取设备的所有子设备。要获取跨配置条目具有某个标识符或连接的每个设备，请使用 `device_registry.async_get_devices()`。

要获取设备及其所属集成配置条目，例如在操作中，请使用 `dr.async_get_device_and_config_entry_for_domain(hass, device_id, domain=DOMAIN)`。当设备未知时，它返回 `(None, None)`；当你的域没有配置条目拥有它时，返回 `(device, None)`。它接受与 `async_get` 相同的 `include_child_devices` 和 `include_main_devices` 参数。

## 更新设备

当某些内容发生变化时，例如更新之后的固件版本，请更新该设备：

```python
device_registry.async_update_device(device.id, sw_version=new_version)
```

## 允许用户删除设备

只有当你的集成允许时，用户才能从 UI 中删除设备。请在 `__init__.py` 中实现 `async_remove_config_entry_device`。在完成所需的清理工作后，如果该设备可以被删除，则返回 `True`：

```python
from homeassistant.helpers.device_registry import DeviceEntry


async def async_remove_config_entry_device(
    hass: HomeAssistant, entry: ExampleConfigEntry, device_entry: DeviceEntry
) -> bool:
    """Allow removing a device that is no longer connected."""
    return not any(
        identifier
        for identifier in device_entry.identifiers
        if identifier[0] == DOMAIN
        and identifier[1] in entry.runtime_data.data.devices
    )
```

此示例仅允许删除集线器不再报告的设备。如果更方便的话，集成也可以改为响应 `EVENT_DEVICE_REGISTRY_UPDATED`。

能够察觉到设备消失的集成也应该自行删除过期的设备：这是[质量标准（quality scale）](/core/quality-scale/)黄金等级（Gold tier）的规则之一。
