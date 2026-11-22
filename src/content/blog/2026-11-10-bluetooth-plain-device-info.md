---
title: "纯设备信息字典在蓝牙数据更新中已弃用"
description: "在 PassiveBluetoothDataUpdate 中传递纯字典作为设备信息将在 Home Assistant Core 2027.12 中停止工作。以下是需要更改的内容，以及如何保持广播快速。"
date: 2026-11-10
authors:
  - epenet
areas:
  - core
---

自 Home Assistant Core 2026.12 起，在 `PassiveBluetoothDataUpdate(devices=...)` 中传递纯字典作为设备信息已被弃用。它将在 Home Assistant Core 2027.12 中停止工作。在此之前，Home Assistant 会将字典转换为 `DeviceInfo` 并记录警告。

这仅涉及使用 [蓝牙处理器协调器](/core/integrations/bluetooth-data/#processor-coordinators) 的集成，即 `PassiveBluetoothProcessorCoordinator` 或 `ActiveBluetoothProcessorCoordinator`。如果您的集成不使用这些，您可以在此停止阅读。

## 您需要更改的内容

查看您的集成传递给 `devices` 的内容：

| 您传递给 `devices` 的内容 | 需要做什么 |
| --- | --- |
| `sensor_device_info_to_hass_device_info()` 的结果，未修改 | 无需操作。它已经为您缓存。 |
| 您构建一次或缓存的 `DeviceInfo` | 无需操作。 |
| 每次广播都创建新的 `DeviceInfo` | 无需操作，但 [缓存它](#为什么缓存很重要) 值得做。 |
| 纯字典 | 在 Home Assistant Core 2027.12 之前 [替换它](#替换纯字典)。 |
| `sensor_device_info_to_hass_device_info()` 的结果，但字段已更改 | [立即修复](#更改辅助函数的结果)。自 Home Assistant Core 2026.11 起，它已引发 `TypeError`。 |

要检查您是否受到弃用影响，请在日志中搜索 `passes a plain dict as a device info in a PassiveBluetoothDataUpdate`。警告仅在首次收到包含纯字典的更新时记录，因此您的设备需要发送过广播。您不会在每次广播时都收到警告。

## 替换纯字典

用 `DeviceInfo` 替代字典正是弃用所要求的。我们还建议缓存它，在一个接受可能变化值的函数中：

```python
from functools import lru_cache

from homeassistant.helpers.device_registry import DeviceInfo


# Old
def sensor_update_to_bluetooth_data_update(
    parsed: ExampleUpdate,
) -> PassiveBluetoothDataUpdate:
    return PassiveBluetoothDataUpdate(
        devices={
            None: {
                "name": parsed.name,
                "manufacturer": "Acme",
                "model": parsed.model,
            }
        },
        # The other fields of the update
    )


# New
@lru_cache(maxsize=64)
def _device_info(name: str, model: str) -> DeviceInfo:
    return DeviceInfo(name=name, manufacturer="Acme", model=model)


def sensor_update_to_bluetooth_data_update(
    parsed: ExampleUpdate,
) -> PassiveBluetoothDataUpdate:
    return PassiveBluetoothDataUpdate(
        devices={None: _device_info(parsed.name, parsed.model)},
        # The other fields of the update
    )
```

转换会静默丢弃不是设备信息字段的键，但 `DeviceInfo(...)` 会对它们引发 `TypeError`。如果您的字典中有任何此类键，请在迁移时移除它们。

## 为什么缓存很重要

设备每秒可能发送许多广播，每个广播都会经过您的代码和 `PassiveBluetoothDataUpdate.update()`，后者会将设备信息与其存储的信息进行比较。如果两者是同一个对象，该检查会立即结束。如果不是，它会比较每个字段，即使几乎每个广播都携带相同的值。

纯字典是绕过此问题的慢速方式：每次广播都会生成一个新的 `DeviceInfo`，因此它永远不会通过快速检查。

以下是一个带有四个实体的温度计在 [`DeviceInfo` 成为数据类](https://github.com/home-assistant/core/pull/180251) 时测量的结果。机器较慢，因此请比较比率而不是绝对数字：

| 设备信息，每次未更改的广播 | 整个更新的时间 |
| --- | --- |
| 缓存，使用 `sensor_device_info_to_hass_device_info()` | 约 6.7 µs |
| 新的 `DeviceInfo(...)` | 约 9.3 µs |
| 缓存副本，设置了 `sw_version` | 约 12.4 µs |

这些是微秒，因此单个设备不会产生您能注意到的差异。但它们会累积，因为 Home Assistant 会对范围内的每个设备执行此操作。您自己缓存的 `DeviceInfo` 会通过与辅助函数生成的相同的快速检查。

当您自己缓存设备信息时，请记住以下几点：

- 相同的对象会被具有这些值的每个广播共享，因此不要在您的函数返回后更改它。`PassiveBluetoothProcessorEntity` 会复制它需要的字段，因此框架也不会修改它。
- 将每个可能变化的值作为参数传递，否则更改不会到达设备注册表。`lru_cache` 函数的参数必须是可哈希的。字符串是可哈希的，但集合不是，因此请在函数内部构建 `connections` 和 `identifiers`。
- 将 `maxsize` 设置为高于您预期的不同设备数量。如果设备数量超过该值，条目会不断被逐出，您将付出重建它们的代价。

> [!IMPORTANT]
> `sensor_device_info_to_hass_device_info()` 会保留值为 `None` 的字段未设置。`DeviceInfo(name=None)` 则不会：它会将名称设置为 `None`，您的实体将失去对协调器名称的回退。如果某个值可能为 `None`，请仅在该值存在时设置该字段。

## 更改辅助函数的结果

`sensor_device_info_to_hass_device_info()` [返回一个共享的、只读的设备信息](/blog/2026/10/13/device-info-class/#modifying-a-converted-sensor-device-info)，因此在其上设置字段会引发 `TypeError`。错误消息建议先复制它。这可行，但每次广播都这样做是上表中速度最慢的选项。请改为构建并缓存您自己的，将额外字段作为参数：

```python
# Old: raises a TypeError
device_info = sensor_device_info_to_hass_device_info(parsed.device_info)
device_info.sw_version = parsed.sw_version


# New
@lru_cache(maxsize=64)
def _device_info(
    name: str | None,
    manufacturer: str | None,
    model: str | None,
    sw_version: str,
) -> DeviceInfo:
    # Leave the fields without a value unset, like the helper does
    device_info = DeviceInfo(sw_version=sw_version)
    if name is not None:
        device_info.name = name
    if manufacturer is not None:
        device_info.manufacturer = manufacturer
    if model is not None:
        device_info.model = model
    return device_info


device_info = _device_info(
    parsed.device_info.name,
    parsed.device_info.manufacturer,
    parsed.device_info.model,
    parsed.sw_version,
)
```

新的固件版本会为您提供具有不同 `sw_version` 的不同对象，因此 `update()` 仍然会看到设备的变化。
