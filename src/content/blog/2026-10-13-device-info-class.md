---
title: "DeviceInfo 现已成为数据类"
description: DeviceInfo 和 ChildDeviceInfo 不再是 TypedDict。它们是带有类型字段的数据类，作为属性进行读写。
date: 2026-10-13
authors:
  - epenet
areas:
  - core
---

## 变更摘要

`DeviceInfo` 和 `ChildDeviceInfo` 不再是 `TypedDict`。它们是带有类型字段的数据类，作为属性进行读写：

```python
device_info = DeviceInfo(identifiers={(DOMAIN, unique_id)}, name="My device")
device_info.sw_version = "1.2.3"
name = device_info.name
```

此变更包含在 Home Assistant Core 2026.11 中。

目前，使用 `[]`、`.get()` 和 `.update()` 读写字段仍然有效，但这只是一个兼容层，将在后续版本中被弃用并移除。集成（integration）应改用属性。其他一些字典行为已经失效，如[不再支持的功能](#what-no-longer-works)中所述。

## 迁移您的集成

```python
# Old
device_info["sw_version"] = "1.2.3"
device_info.update({"model": "My model", "manufacturer": "My manufacturer"})

# New
device_info.sw_version = "1.2.3"
device_info.model = "My model"
device_info.manufacturer = "My manufacturer"
```

读取未设置的字段会返回 `UNDEFINED`，而以前 `.get()` 会返回 `None`。请参阅[未设置的字段](#unset-fields)。

```python
# Old
name = device_info.get("name")

# New
name = device_info.name
```

```python
# Old
self._attr_device_info: DeviceInfo = {
    ATTR_IDENTIFIERS: {(DOMAIN, unique_id)},
    ATTR_NAME: "My device",
}

# New
self._attr_device_info = DeviceInfo(
    identifiers={(DOMAIN, unique_id)},
    name="My device",
)
```

```python
import copy

# Old
new_device_info = device_info.copy()
new_device_info["name"] = "Other name"

# New
new_device_info = copy.copy(device_info)
new_device_info.name = "Other name"
```

要自行在设备注册表中注册设备，请像以前一样将设备字段作为关键字参数传递给 `async_get_or_create`。当您已经持有一个 `DeviceInfo`（例如由辅助元素（helper）构建或与您的实体（entity）共享的）时，请将其原样传递给新的 `async_get_or_create_from_info`，而不是解包它：

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

## 未设置的字段

未设置的字段读取为 `UNDEFINED`，而不是 `None`，并且 `None` 与其他值一样是有效值。例如，`via_device_id=None` 会移除与上游设备的链接。请注意，`UNDEFINED` 为真值，因此请显式测试：

```python
from homeassistant.helpers.typing import UNDEFINED

# Old
if "name" not in device_info:
    device_info["name"] = "My device"

# New
if device_info.name is UNDEFINED:
    device_info.name = "My device"
```

通过将 `UNDEFINED` 赋值给字段，可以再次取消设置该字段：

```python
# Old
del device_info["name"]

# New
device_info.name = UNDEFINED
```

只有已设置的字段才会传递给设备注册表，因此未设置的字段会使设备上对应的值保持不变。

## 序列化设备信息

数据类会逐字段进行序列化，包括未设置的字段。Home Assistant JSON 辅助元素（helper）使用的 orjson 会将每个未设置的字段写为 `0`。`dataclasses.asdict` 会将它们保留为 `UNDEFINED`。每当设备信息被存储、在事件数据或 WebSocket 消息中发送，或者由被序列化的数据类持有时，请使用 `device_info.as_dict()`，它会返回已设置的字段：

```python
# Old
await store.async_save({"device_info": device_info})

# New
await store.async_save({"device_info": device_info.as_dict()})
```

## 不再支持的功能

### 非设备信息字段的键

非设备信息字段的键会被拒绝。以前它们会被静默保留，并在稍后调用设备注册表时被忽略或引发 `TypeError`：

```python
# Raises TypeError: unexpected keyword argument 'id'
device_info = DeviceInfo(**device_payload)

# Raises KeyError: 'config_entry_id' is not a valid DeviceInfo field
device_info["config_entry_id"] = entry.entry_id
```

`async_get_or_create` 中不属于设备信息字段的参数（例如 `config_entry_id`）会直接传递给该方法。

### 从映射构建

`DeviceInfo({...})` 会引发 `TypeError`：请将字段作为关键字参数传递。

### 字典行为

一些很少使用的字典行为已移除：`copy`、`setdefault`、`values`、`clear`、`popitem`、`pop`、`del device_info[key]`、使用 `|` 或 `|=` 合并、遍历设备信息以及 `len()`。使用 `in` 测试字段仍然有效。

设备信息不再是 `dict`：`isinstance(device_info, dict)` 返回 `False`。请使用 `isinstance(device_info, DeviceInfo)`，或者在需要纯字典的地方使用 `device_info.as_dict()`。空的 `DeviceInfo()` 也不再是假值（falsy）。

要检查字段是否存在（例如为了支持较旧版本的 Home Assistant），请使用 `"via_device_id" in DeviceInfo.__annotations__`。`__optional_keys__` 和 `__required_keys__` 仍然有效，但它们属于兼容层。

### 修改转换后的传感器设备信息

`sensor_device_info_to_hass_device_info()` 现在返回一个缓存的设备信息，该信息可以与其他设备共享。它不能被修改，如果尝试修改会引发 `TypeError`。请先使用 `copy.copy(device_info)` 进行复制。如果为每个广播（advertisement）添加相同的字段，请改为构建并缓存您自己的 `DeviceInfo`，这样就不必每次都进行复制。

## 已弃用的字段

`created_at`、`default_manufacturer`、`default_model`、`default_name`、`modified_at` 和 `via_device` 仍然被接受，并且在创建设备时仍会记录弃用警告。它们不属于类型字段，并将在 Home Assistant Core 2027.8（`via_device`）和 2027.9（其他字段）中移除。请改用 `manufacturer`、`model`、`name` 和 `via_device_id`。

## 子设备

`ChildDeviceInfo` 同样是一个数据类。实体（entity）通过返回 `ChildDeviceInfo` 来注册子设备，而不是向 `DeviceInfo` 添加 `parent_device_id` 键：

```python
self._attr_device_info = ChildDeviceInfo(
    identifiers={(DOMAIN, unique_id)},
    name="Outlet 1",
    parent_device_id=parent.id,
)
```

要自行在设备注册表中注册子设备，请像以前一样将字段作为关键字参数传递给 `async_get_or_create_child`。当您已经持有一个 `ChildDeviceInfo` 时，请将其传递给新的 `async_get_or_create_child_from_info`：

```python
device_registry.async_get_or_create_child_from_info(
    config_entry_id=entry.entry_id, device_info=child_device_info
)
```
