# 空气质量实体

> 已弃用的空气质量实体，以及应使用的替代方案。

Source: https://www.hasscn.top/contributors/core/entities/air-quality/

空气质量实体将多项空气质量读数（如颗粒物和臭氧）打包到一个实体（entity）中。它派生自 `AirQualityEntity`，该类从 `homeassistant.components.air_quality` 导入。

> [!WARNING]
> 空气质量实体已被弃用。请勿在新代码中使用它。请改为为每项读数创建一个[传感器](https://www.hasscn.top/contributors/core/entities/sensor/)，并使用诸如 `PM25`、`OZONE`、`CO2` 或 `AQI` 之类的设备类（device class）。仍在使用空气质量实体的集成（integration）应迁移到传感器。

独立的传感器可以获得单位换算、长期统计以及各自的历史记录，而这些是这个实体从未具备的。

## 属性

此实体不支持 `_attr_` 简写。请将每个值实现为属性（property）。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `particulate_matter_2_5` | `str \| int \| float \| None` | 必需 | 2.5 μm 及以下的颗粒物。这是状态（state）。 |
| `particulate_matter_10` | `str \| int \| float \| None` | `None` | 10 μm 及以下的颗粒物。 |
| `particulate_matter_0_1` | `str \| int \| float \| None` | `None` | 0.1 μm 及以下的颗粒物。 |
| `air_quality_index` | `str \| int \| float \| None` | `None` | 空气质量指数。 |
| `ozone` | `str \| int \| float \| None` | `None` | 臭氧（O3）。 |
| `carbon_monoxide` | `str \| int \| float \| None` | `None` | 一氧化碳（CO）。 |
| `carbon_dioxide` | `str \| int \| float \| None` | `None` | 二氧化碳（CO2）。 |
| `sulphur_dioxide` | `str \| int \| float \| None` | `None` | 二氧化硫（SO2）。 |
| `nitrogen_oxide` | `str \| int \| float \| None` | `None` | 氧化亚氮（N2O）。 |
| `nitrogen_monoxide` | `str \| int \| float \| None` | `None` | 一氧化氮（NO）。 |
| `nitrogen_dioxide` | `str \| int \| float \| None` | `None` | 二氧化氮（NO2）。 |

每个不为 `None` 的值都会成为一个状态属性。每个实体都具有的通用属性请参见[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)。

## 支持的功能

此实体没有支持的功能。

## 方法

没有需要实现的方法。请在 `update` 或 `async_update` 中保持属性为最新。

## 状态

状态为 `particulate_matter_2_5`，单位始终为 µg/m³。

## 示例

请使用传感器来描述每项读数，而不是使用空气质量实体：

```python
from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import UnitOfDensity

SENSORS = (
    SensorEntityDescription(
        key="pm25",
        device_class=SensorDeviceClass.PM25,
        state_class=SensorStateClass.MEASUREMENT,
        native_unit_of_measurement=UnitOfDensity.MICROGRAMS_PER_CUBIC_METER,
    ),
    SensorEntityDescription(
        key="aqi",
        device_class=SensorDeviceClass.AQI,
        state_class=SensorStateClass.MEASUREMENT,
    ),
)
```

完整信息请参见[传感器实体](https://www.hasscn.top/contributors/core/entities/sensor/)。
