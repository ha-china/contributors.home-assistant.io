---
title: 实体注册表
description: 为实体提供一个唯一 ID，让实体注册表能够记住它们、将它们关联到设备，并决定它们初始时是否启用、是否可见或是否分类。
sidebarLabel: Entity registry
sidebarGroup: Basics
order: 7
---

本页从实体这一侧介绍实体是如何进入实体注册表的。若要在您的集成代码中查找或迁移注册表条目，请参阅构建集成文档中的[实体注册表](/core/integrations/entity-registry/)。

实体[注册表](/glossary/registry/)（registry）是 Home Assistant 记住它见过的每个实体的地方。它保存实体 ID、实体所属的设备和区域，以及用户更改过的所有内容：名称、图标、实体 ID、是否启用，以及首选单位等选项。这些设置能够在重启、重新安装设备以及集成更新后保留下来。

实体只有拥有[唯一 ID](/glossary/unique-id/)（unique ID）时才会获得注册表条目。如果没有唯一 ID，用户就无法在界面上重命名它、更改它的图标、把它放进某个区域或禁用它。因此，请为每个实体提供唯一 ID。

## 唯一 ID

注册表通过三样东西的组合来查找实体：它的域（domain，如 `sensor`）、提供它的集成（如 `hue`），以及它的唯一 ID。唯一 ID 只需在该组合内唯一即可。不要把您的集成域或实体域包含进去，Home Assistant 已经会跟踪这些信息。

唯一 ID 绝不能改变，用户也不能更改它。一旦改变，Home Assistant 会把它当作一个全新的实体，用户为旧实体所做的一切设置都会丢失。

适合作为唯一 ID 的来源：

- 设备的序列号
- 设备的 MAC 地址，使用 `homeassistant.helpers.device_registry` 中的 `format_mac` 进行格式化。请从设备 API 或发现（discovery）过程中读取，绝不要从网络的 ARP 表中读取
- 印在设备上或存储在其固件中的唯一标识符
- 对于描述某个地点的实体，可以使用固定位置，例如经纬度

作为最后手段，对于由[配置条目](/glossary/config-entry/)（config entry）设置的实体，可以使用配置条目 ID。

绝不要使用这些：IP 地址、主机名、URL、设备名称、电子邮件地址或用户名。它们都会改变。

当一个设备有多个实体时，将设备的唯一 ID 与能够区分这些实体的信息组合起来，例如[实体描述](/glossary/entity-description/)（entity description）的键：`f"{serial}_{description.key}"`。

## 关联到设备

设置 `device_info` 可以将实体关联到[设备](/glossary/device/)。Home Assistant 第一次看到该设备时会在设备注册表中创建它，并在信息发生变化时更新它。所有具有相同标识符（identifiers）的实体最终都会归属于同一台设备。

```python
from homeassistant.helpers.device_registry import DeviceInfo

self._attr_device_info = DeviceInfo(
    identifiers={(DOMAIN, device.serial)},
    manufacturer="Example",
    model="Pump 3000",
    name=device.name,
    sw_version=device.firmware,
)
```

只有拥有唯一 ID 且属于某个配置条目的实体才能关联到设备。其他尝试这样做的实体会收到警告，并且该关联将在 Home Assistant 2027.8 中停止工作。

`DeviceInfo` 的字段都是可选的，但设备至少需要 `identifiers` 或 `connections` 中的一项：

| 字段 | 描述 |
| --- | --- |
| `identifiers` | 在您的集成中标识该设备的 `(domain, id)` 元组集合。 |
| `connections` | `(type, id)` 元组的集合，例如 MAC 地址，其他集成可以据此进行匹配。 |
| `name` | 设备的名称。 |
| `manufacturer`, `model`, `model_id` | 制造商，以及型号名称和型号编号。 |
| `serial_number` | 序列号。 |
| `sw_version`, `hw_version` | 固件和硬件版本。 |
| `configuration_url` | 用于配置设备的 URL，例如它的 Web 界面。 |
| `suggested_area` | 设备首次创建时应归入的区域。 |
| `entry_type` | `DeviceEntryType.SERVICE`，用于非物理设备的事物，例如 Web 服务。 |
| `via_device_id` | 本设备所经由连接的设备的设备注册表 ID，例如集线器。 |
| `translation_key`, `translation_placeholders` | 翻译后的设备名称，来自 `strings.json` 的 `device` 部分。 |

`via_device_id` 取代了旧的 `via_device` 字段，后者接受一个标识符元组，并将在 Home Assistant 2027.8 中被移除。

### 子设备

有些设备由逻辑部件组成，例如插线板上的插座。使用 `ChildDeviceInfo` 可以把这样的部件注册为您已注册设备的子设备。它接受子设备的 `identifiers`、`parent_device_id`（父设备的设备注册表 ID），以及可选的 `name`、`suggested_area` 和带占位符的翻译键。父设备必须由同一个配置条目注册，并属于同一个配置子条目（config subentry）。

## 实体类别

Not every entity is a main feature of its device. Mark the others with an [entity category](/glossary/entity-category/) from `homeassistant.const`. The value column is what you put in YAML, for example as `entity_category` of an [MQTT switch](https://www.home-assistant.io/integrations/switch.mqtt/).

| Entity category | Value | Use it for |
| --- | --- | --- |
| `EntityCategory.CONFIG` | `config` | The entity changes a setting of the device, like a switch for the status LED, or a number for the sensitivity of a motion sensor. |
| `EntityCategory.DIAGNOSTIC` | `diagnostic` | The entity shows information about the device without changing it, like the signal strength or the IP address. Also use it for a button that makes a device identify itself. |

已分类的实体会显示在设备页面各自的分区中，不会被添加到自动生成的仪表盘，默认不会暴露给语音助手，并且当操作面向整个设备或区域时也不会成为目标。传感器和二进制传感器不能使用 `CONFIG` 类别。

## 默认启用和可见

有些实体只对少数人有用，而对其他人来说只是干扰，例如信号强度传感器或每秒都在变化的传感器。对于这些实体，请将 `entity_registry_enabled_default` 设置为 `False`。该实体注册时即为禁用状态：在用户启用它之前，它不会运行、不会写入状态，也不会填充数据库。

将 `entity_registry_visible_default` 设置为 `False` 则会将实体注册为隐藏。它仍然会运行，但不会出现在自动生成的仪表盘中，默认不会暴露给语音助手，并且当操作面向整个设备或区域时也不会成为目标。对于作为某个更大整体一部分的实体，例如分组的成员，可以使用此选项。

这两个选项都只在实体首次注册时应用。之后，由用户决定。

## 已禁用的实体

注册表条目的 `disabled_by` 字段说明了实体被禁用的原因。当您的集成把已禁用的实体传递给 `async_add_entities` 时，该实体不会被添加到 Home Assistant。

| 值 | 含义 |
| --- | --- |
| `user` | 用户在界面中禁用了它。 |
| `integration` | 集成通过 `entity_registry_enabled_default` 将其注册为禁用，或者用户为该配置条目关闭了**启用新添加的实体**。 |
| `config_entry` | 配置条目被禁用。 |
| `device` | 实体所属的设备被禁用。 |
| `hass` | Home Assistant 禁用了它。 |

当用户禁用实体时，Home Assistant 会立即将其移除。当用户启用某个配置条目的实体时，Home Assistant 会重新加载该配置条目来添加它。它会等待到最后一个实体启用后 30 秒，这样启用多个实体的用户只会触发一次重新加载。您的集成必须支持卸载，这样才能在无需重启的情况下正常工作。

请确保您的集成能够应对从未被添加的实体。如果您保留了对实体对象的引用，请在 `async_added_to_hass` 中注册它们，该回调只会在实体实际被添加时运行。请参阅[实体生命周期](/core/entities/lifecycle/)。

如果您的集成允许用户选择要创建哪些实体，例如在[选项流程](/glossary/options-flow/)（options flow）中，请不要为此使用 `disabled_by`。不要创建用户未选择的实体，并将其从实体注册表和设备注册表中移除。

单个配置条目最多可拥有 10,000 个已启用的实体。超过该数量后，Home Assistant 不会添加新实体并会记录警告，因此行为异常的集成无法拖垮整个系统。少数管理大型网络的集成（例如 Z-Wave 和 Matter）可豁免此限制。

## 实体选项

注册表还会按实体存储选项，并按域分组。用户大多在实体设置中设置它们，例如传感器的显示精度或单位，或者日历的颜色。平台基类会从 `self.registry_entry.options` 读取这些选项并为您处理。您的集成通常不需要读取或写入这些选项。
