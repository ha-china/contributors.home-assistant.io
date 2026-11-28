# 地理位置实体

> 在地图上显示来自外部数据源且带有位置的事件，例如地震或野火。

Source: https://www.hasscn.top/contributors/core/entities/geo-location/

地理位置实体（geolocation entity）表示一个带有位置信息的外部事件：例如地震、野火、洪水预警，或者数据源（feed）中的其他兴趣点。每个实体都具有坐标，前端会将其显示为地图上的一个标记。请继承 `GeolocationEvent`，该类从 `homeassistant.components.geo_location` 导入。

与大多数实体不同，地理位置实体并不代表某个设备（device）。只要事件还在数据源中，该实体就一直存在。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `source` | `str` | 必填 | 事件的来源，通常是你的集成的域（domain）。 |
| `distance` | `float \| None` | `None` | 从家庭位置到事件的距离，以 `unit_of_measurement` 为单位。此值即为状态。 |
| `latitude` | `float \| None` | `None` | 事件的纬度。 |
| `longitude` | `float \| None` | `None` | 事件的经度。 |

使用通用的 `unit_of_measurement` 属性设置距离的单位。`source`、`latitude` 和 `longitude` 会成为状态属性，其中坐标会四舍五入保留五位小数。每个实体都具备的通用属性记录在[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)中。

## 支持的功能

此实体不支持任何功能。

## 管理事件

集成会随着数据源的变化而添加和移除地理位置实体。一种常见的模式是使用一个管理器订阅数据源的更新，并在每次更新时：

1. 为每个新事件添加一个实体。
2. 更新仍然存在的事件所对应的实体。
3. 对于已消失的事件，通过调用 `await entity.async_remove(force_remove=True)` 移除其对应的实体。

`force_remove` 标志会彻底移除状态。如果没有它，已注册的实体会以不可用（unavailable）状态残留下来。如果你的实体具有唯一 ID，还应从[实体注册表（entity registry）](https://www.hasscn.top/contributors/core/entities/registry/)中移除它们的条目。

[GDACS 集成](https://github.com/home-assistant/core/blob/dev/homeassistant/components/gdacs/geo_location.py)遵循这一模式，[演示平台（demo platform）](https://github.com/home-assistant/core/blob/dev/homeassistant/components/demo/geo_location.py)则是它的一个最简版本。

## 方法

无需实现任何方法。当数据源变化时，更新属性并调用 `async_write_ha_state` 即可。参见[更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/)和[实体生命周期](https://www.hasscn.top/contributors/core/entities/lifecycle/)。

## 状态

状态为 `distance`，四舍五入保留一位小数；当没有距离时为 `unknown`。状态由基类设置：不要自行设置 `state`。

## 示例

表示数据源中一次地震的实体：

```python
from homeassistant.components.geo_location import GeolocationEvent
from homeassistant.const import UnitOfLength


class ExampleQuakeEvent(GeolocationEvent):
    """An earthquake from the example feed."""

    _attr_has_entity_name = True
    _attr_should_poll = False
    _attr_source = "example_quakes"
    _attr_unit_of_measurement = UnitOfLength.KILOMETERS

    def __init__(self, quake: ExampleQuake) -> None:
        """Initialize the event."""
        self._attr_unique_id = quake.id
        self._attr_name = quake.title
        self.update_from_feed(quake)

    def update_from_feed(self, quake: ExampleQuake) -> None:
        """Copy the latest data from the feed."""
        self._attr_distance = quake.distance_km
        self._attr_latitude = quake.latitude
        self._attr_longitude = quake.longitude
```

名称来自数据源，因此不会被翻译。参见[命名](https://www.hasscn.top/contributors/core/entities/naming/)。
