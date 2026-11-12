---
title: "已弃用的设备信息常量"
description: "homeassistant.const 中的设备信息常量在 Home Assistant Core 2026.12 中已弃用，并将在 2027.12 中移除。请改用 DeviceInfo 字段。"
date: 2026-11-10
authors:
  - epenet
areas:
  - core
---

自 Home Assistant Core 2026.12 起，`homeassistant.const` 中的设备信息常量已弃用，因为 Home Assistant Core 不再使用它们。它们将在 Home Assistant Core 2027.12 中被移除。在此之前，使用其中任何一个都会记录一条警告。如果您的自定义集成未导入这些常量中的任何一个，则无需执行任何操作：

- `ATTR_CONFIGURATION_URL`
- `ATTR_CONNECTIONS`
- `ATTR_DEFAULT_NAME`
- `ATTR_HW_VERSION`
- `ATTR_IDENTIFIERS`
- `ATTR_MANUFACTURER`
- `ATTR_MODEL`
- `ATTR_MODEL_ID`
- `ATTR_SERIAL_NUMBER`
- `ATTR_SUGGESTED_AREA`
- `ATTR_SW_VERSION`

自 Home Assistant Core 2026.11 起，[`DeviceInfo` 是一个带有类型字段的数据类](/blog/2026/10/13/device-info-class/)，因此您可以直接使用其字段，而无需这些常量。

## 迁移设备信息

请改用 `DeviceInfo` 的关键字参数和属性。每个字段的名称与其常量的值相同：

```python
# Old
device_info[ATTR_SW_VERSION] = "1.2.3"
model = device_info[ATTR_MODEL]

# New
device_info.sw_version = "1.2.3"
model = device_info.model
```

```python
# Old
device_registry.async_get_or_create(
    config_entry_id=entry.entry_id,
    **{
        ATTR_IDENTIFIERS: {(DOMAIN, unique_id)},
        ATTR_MANUFACTURER: "My manufacturer",
    },
)

# New
device_registry.async_get_or_create(
    config_entry_id=entry.entry_id,
    identifiers={(DOMAIN, unique_id)},
    manufacturer="My manufacturer",
)
```

有一个例外：`ATTR_DEFAULT_NAME`。`default_name` 字段也已弃用，并将在 Home Assistant Core 2027.9 中被移除。请改用 `name`。

## 迁移您自己的数据

如果您的集成将这些常量之一用于自身数据（如状态属性），请改用普通字符串或本地常量：

```python
# Old
from homeassistant.const import ATTR_MODEL

ATTRIBUTES = {ATTR_MODEL: "My model"}

# New
ATTR_MODEL = "model"

ATTRIBUTES = {ATTR_MODEL: "My model"}
```
