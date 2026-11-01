---
title: 区域注册表
description: Home Assistant 对区域的了解，以及你的集成如何为设备建议区域。
sidebarGroup: Devices and registries
order: 3
---

区域注册表（area registry）记录[区域](/glossary/area/)（area）：即家中的物理位置，例如厨房或车库。用户将设备（device）和实体（entity）放入区域，并将区域归入[楼层](/glossary/floor/)（floor）。

区域属于用户。你的集成不会创建或更改它们。它所能做的是为新设备建议一个区域，通过 `DeviceInfo` 中的 `suggested_area` 或[设备注册表](/core/integrations/device-registry/)中的 `async_get_or_create` 来实现。当设备或服务知道它位于哪个房间时（例如在其自己的应用中设置了房间名称），请使用此功能。

## 区域属性

| 属性 | 说明 |
| --- | --- |
| `id` | Home Assistant 为该区域生成的 ID |
| `name` | 区域的名称 |
| `aliases` | 区域的其他名称，例如用于语音命令 |
| `floor_id` | 区域所在的楼层 |
| `icon` | 区域的图标 |
| `picture` | 区域的图片 |
| `labels` | 区域的标签 |
| `temperature_entity_id` | 提供该区域温度的实体 |
| `humidity_entity_id` | 提供该区域湿度的实体 |
| `created_at`, `modified_at` | 区域的创建时间和最后更改时间 |

## 读取区域

```python
from homeassistant.helpers import area_registry as ar

area_registry = ar.async_get(hass)
area = area_registry.async_get_area(area_id)
```

没有自己所属区域的实体位于其设备所在的区域。要获取实际生效的区域，对于实体可使用 `er.async_get_effective_area_id(hass, entity_entry)`，对于设备可使用 `dr.async_get_effective_area_id(hass, device)`。
