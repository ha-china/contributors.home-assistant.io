---
title: "对设备信息的字典式访问已弃用"
description: "在 Home Assistant Core 2026.12 中，像使用字典一样使用 DeviceInfo 或 ChildDeviceInfo 已被弃用，并将在 2027.12 中停止工作。请改为读取和设置属性。"
date: 2026-11-19
authors:
  - epenet
areas:
  - core
---

自 Home Assistant Core 2026.12 起，像使用字典一样使用 `DeviceInfo` 或 `ChildDeviceInfo` 已被弃用。它将在 Home Assistant Core 2027.12 中停止工作。在此之前，它会记录一条警告。这是 [DeviceInfo 现在是一个数据类](/blog/2026/10/13/device-info-class/) 中宣布的兼容层。以下用法已被弃用：

- 按键读取或设置字段，如 `device_info["name"]`
- 使用 `in` 测试字段是否存在
- `get()`、`keys()`、`items()` 和 `update()`
- `dict(device_info)` 和 `**device_info` 解包
- 将设备信息与普通字典进行比较
- `__required_keys__` 和 `__optional_keys__` 属性

自 Home Assistant Core 2026.11 起，`DeviceInfo` 是一个具有类型字段的数据类。保留字典式访问是为了让集成有时间迁移，而 Home Assistant Core 不再使用它。如果你的自定义集成已经以属性的方式读取和设置设备信息字段，则无需进行任何更改。

要检查你是否受到影响，请在日志中搜索 `which is deprecated as device infos are dataclasses`。每条警告都会指出它发现的用法，以及应使用的替代方法。

`as_dict()`、比较两个设备信息以及设备信息的表示形式并未弃用。实体仍然可以返回普通字典作为其 `device_info`：只有像字典一样使用 `DeviceInfo` 或 `ChildDeviceInfo` 才会受到影响。

## 读取和设置字段

请改为读取和设置属性：

```python
# Old
device_info["sw_version"] = "1.2.3"
name = device_info["name"]
model = device_info.get("model")

# New
device_info.sw_version = "1.2.3"
name = device_info.name
model = device_info.model
```

未设置的字段读取为 `UNDEFINED`，而 `get()` 返回 `None`，如 [未设置字段](/blog/2026/10/13/device-info-class/#unset-fields) 中所述。要测试字段是否已设置，请将其与 `UNDEFINED` 进行比较，而不是使用 `in`：

```python
from homeassistant.helpers.typing import UNDEFINED

# Old
if "name" not in device_info:
    device_info["name"] = "My device"

# New
if device_info.name is UNDEFINED:
    device_info.name = "My device"
```

请逐个设置字段，而不是使用 `update()`：

```python
# Old
device_info.update({"model": "My model", "manufacturer": "My manufacturer"})

# New
device_info.model = "My model"
device_info.manufacturer = "My manufacturer"
```

## 获取已设置的字段

使用 `as_dict()`，而不是 `keys()`、`items()` 或 `dict(device_info)`。它返回已设置的字段：

```python
# Old
data = dict(device_info)

# New
data = device_info.as_dict()
```

要从设备信息注册设备，请将其传递给 `async_get_or_create_from_info`，或对于 `ChildDeviceInfo` 传递给 `async_get_or_create_child_from_info`，而不是解包它：

```python
# Old
device_registry.async_get_or_create(
    config_entry_id=entry.entry_id, **device_info
)

# New
device_registry.async_get_or_create_from_info(
    config_entry_id=entry.entry_id, device_info=device_info
)
```

## 与字典进行比较

将设备信息与普通字典进行比较已被弃用。这在测试中很常见。请改为比较 `as_dict()`，或与另一个 `DeviceInfo` 进行比较：

```python
# Old
assert device_info == {"identifiers": {(DOMAIN, "1234")}, "name": "My device"}

# New
assert device_info == DeviceInfo(
    identifiers={(DOMAIN, "1234")}, name="My device"
)
```

## 检查哪些字段存在

`__required_keys__` 和 `__optional_keys__` 来自 `DeviceInfo` 还是 `TypedDict` 的时代。要检查字段是否存在，例如为了支持旧版 Home Assistant，请使用 `__annotations__`。它既适用于数据类，也适用于 Home Assistant Core 2026.11 之前版本的 `TypedDict`：

```python
# Old
has_via_device_id = "via_device_id" in DeviceInfo.__optional_keys__

# New
has_via_device_id = "via_device_id" in DeviceInfo.__annotations__
```

如果你的集成仅支持 Home Assistant Core 2026.11 及更高版本，你也可以使用 `dataclasses.fields(DeviceInfo)`，这是警告建议的方法。在旧版本上，它会引发 `TypeError`。
