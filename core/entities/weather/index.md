# 天气实体

> 报告当前天气状况，并提供每日、每小时或每日两次的天气预报。

Source: https://www.hasscn.top/contributors/core/entities/weather/

天气实体（weather entity）报告某个位置的当前天气状况：天气状况、温度，以及湿度和风速等读数。它还可以提供天气预报。继承自 `WeatherEntity`，从 `homeassistant.components.weather` 导入。如果您使用[协调器](https://www.hasscn.top/contributors/glossary/coordinator/)，请改为继承自 `CoordinatorWeatherEntity` 或 `SingleCoordinatorWeatherEntity`（参见[使用协调器](https://www.hasscn.top/contributors/core/entities/weather/#using-coordinators)）。

要了解前端如何显示天气实体，请参阅[天气更多信息视图](https://www.hasscn.top/contributors/design/more-info/weather/)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. A weather entity with daily and hourly forecasts, in a tile card and a weather forecast card. The forecasts are made up by the demo from the current condition and temperature.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <script type="application/json">
    [
      {
        "entity_id": "weather.home",
        "state": "partlycloudy",
        "attributes": {
          "friendly_name": "Home",
          "temperature": 14,
          "temperature_unit": "°C",
          "humidity": 72,
          "wind_speed": 12,
          "wind_speed_unit": "km/h",
          "supported_features": 3
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "weather.home",
        "features": [
          {
            "type": "temperature-forecast"
          }
        ]
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "weather-forecast",
        "entity": "weather.home",
        "forecast_type": "daily"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 属性

将每个值设置为其_原生_单位，并告知 Home Assistant 该单位是什么。基类会将这些值转换为用户单位系统对应的单位，或用户在实体设置中选择的单位。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `condition` | `str \| None` | `None` | 当前天气状况。这就是状态。请使用[天气状况](https://www.hasscn.top/contributors/core/entities/weather/#conditions)中的其中一种。 |
| `native_temperature` | `float \| None` | `None` | 当前温度。 |
| `native_temperature_unit` | `str \| None` | `None` | 所有温度的单位：°C 或 °F。 |
| `native_apparent_temperature` | `float \| None` | `None` | 当前视温度（体感温度）。 |
| `native_dew_point` | `float \| None` | `None` | 露点。 |
| `humidity` | `float \| None` | `None` | 相对湿度，单位为 %。 |
| `native_pressure` | `float \| None` | `None` | 气压。 |
| `native_pressure_unit` | `str \| None` | `None` | 气压的单位：hPa、kPa、mbar、inHg 或 mmHg。设置 `native_pressure` 时应同时设置该项。 |
| `native_wind_speed` | `float \| None` | `None` | 风速。 |
| `native_wind_gust_speed` | `float \| None` | `None` | 阵风风速。 |
| `native_wind_speed_unit` | `str \| None` | `None` | 两种风速的单位：蒲福风级（Beaufort）、ft/s、km/h、kn、m/s 或 mph。设置任何风速时应同时设置该项。 |
| `wind_bearing` | `float \| str \| None` | `None` | 风向，以度数或 1 到 3 个字母的罗盘方位表示。 |
| `native_visibility` | `float \| None` | `None` | 能见度。 |
| `native_visibility_unit` | `str \| None` | `None` | 能见度的单位：km 或 mi。设置 `native_visibility` 时应同时设置该项。 |
| `native_precipitation_unit` | `str \| None` | `None` | 天气预报中降水量的单位：mm 或 in。 |
| `cloud_coverage` | `int \| None` | `None` | 云量，单位为 %。 |
| `uv_index` | `float \| None` | `None` | 紫外线指数。 |
| `ozone` | `float \| None` | `None` | 臭氧浓度。 |
| `precision` | `float` | °C 为十分位，°F 为整数 | 转换后温度的精度。 |

当某个 `native_*_unit` 为 `None` 时，基类会假定该值已经是用户单位系统的默认单位，并在用户为该实体选择了其他单位时从该单位进行转换。因此，请为所报告的每一类值都设置单位。

每个实体都具有的通用属性，例如 `name` 或 `available`，记录在[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)页面上。实际上，每个天气实体至少都会设置 `condition`、`native_temperature` 和 `native_temperature_unit`。

## 支持的功能

每种预报类型都是 `WeatherEntityFeature` 中的一个标志。使用 `|` 组合它们，并实现与每个标志对应的方法。

| 功能 | 需实现的方法 |
| --- | --- |
| `FORECAST_DAILY` | `async_forecast_daily` |
| `FORECAST_HOURLY` | `async_forecast_hourly` |
| `FORECAST_TWICE_DAILY` | `async_forecast_twice_daily` |

有关标志的一般工作原理，请参阅[支持的功能](https://www.hasscn.top/contributors/glossary/supported-features/)。

## 天气状况

请为 `condition` 使用以下值之一。前端会自动翻译这些值并显示匹配的图标，因此您的集成（integration）无需自行翻译。

| 天气状况 | 含义 |
| --- | --- |
| `clear-night` | 晴朗的夜晚 |
| `cloudy` | 多云 |
| `exceptional` | 异常 |
| `fog` | 雾 |
| `hail` | 冰雹 |
| `lightning` | 雷电或雷暴 |
| `lightning-rainy` | 雷电或雷暴，并伴有降雨 |
| `partlycloudy` | 局部多云 |
| `pouring` | 倾盆大雨 |
| `rainy` | 降雨 |
| `snowy` | 降雪 |
| `snowy-rainy` | 雨夹雪 |
| `sunny` | 晴朗 |
| `windy` | 有风 |
| `windy-variant` | 有风且多云 |

它们以 `ATTR_CONDITION_*` 常量的形式提供于 `homeassistant.components.weather` 中，例如 `ATTR_CONDITION_SUNNY`。

## 天气预报

预报数据不属于状态的一部分。前端等消费者通过单独的 API 订阅这些数据，`weather.get_forecasts` 动作会返回它们。基类会将预报值转换为用户的单位，就像处理当前值一样。

### `Forecast` 字典

每个预报方法都会返回一个 `Forecast` 字典列表，值为原生单位：

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `datetime` | `str` | 必需。预报的时间，采用 UTC，格式为 RFC 3339 字符串。 |
| `is_daytime` | `bool \| None` | 表示是白天部分还是夜间部分。每日两次的预报必需此项。 |
| `condition` | `str \| None` | 天气状况。 |
| `native_temperature` | `float \| None` | （最高）温度。 |
| `native_templow` | `float \| None` | 最低温度。 |
| `native_apparent_temperature` | `float \| None` | 视温度（体感温度）。 |
| `native_dew_point` | `float \| None` | 露点。 |
| `humidity` | `float \| None` | 相对湿度，单位为 %。 |
| `native_pressure` | `float \| None` | 气压。 |
| `native_precipitation` | `float \| None` | 降水量。 |
| `precipitation_probability` | `int \| None` | 降水概率，单位为 %。 |
| `native_wind_speed` | `float \| None` | 风速。 |
| `native_wind_gust_speed` | `float \| None` | 阵风风速。 |
| `wind_bearing` | `float \| str \| None` | 风向。 |
| `cloud_coverage` | `int \| None` | 云量，单位为 %。 |
| `uv_index` | `float \| None` | 紫外线指数。 |

这些单位与当前值一样，由同样的 `native_*_unit` 属性指定。

### 更新预报

请缓存您获取的预报数据，以免每次有人请求时都要调用 API。当您有新的预报数据时，可 await `self.async_update_listeners(None)` 将其推送给所有订阅者，或者传入预报类型列表（如 `["daily"]`）以仅推送这些类型。当没有任何人订阅时，它根本不会调用您的预报方法。

### 使用协调器

`CoordinatorWeatherEntity` 将天气实体连接到[协调器](https://www.hasscn.top/contributors/glossary/coordinator/)：一个用于当前观测数据，另外每个预报类型可选择各用一个。将它们作为 `daily_coordinator`、`hourly_coordinator` 和 `twice_daily_coordinator` 传递给 `__init__`。您需要实现的不是异步预报方法，而是回调函数 `_async_forecast_daily`、`_async_forecast_hourly` 和 `_async_forecast_twice_daily`，这些回调从协调器数据中读取。当协调器更新时，监听器会得到更新。

预报协调器必须是 `TimestampDataUpdateCoordinator`。只有在有人订阅该预报类型时，实体才会监听对应的预报协调器。当请求某个预报且其协调器的数据早于其 `update_interval` 时，实体会先刷新该协调器。将 `daily_forecast_valid`、`hourly_forecast_valid` 或 `twice_daily_forecast_valid` 传递给 `__init__`，用于设置预报最多可以有多旧，超过后实体将改为返回 `None`。其默认值为协调器的 `update_interval`。没有 `update_interval` 的协调器（例如仅接收推送数据的协调器）会跳过这两项检查：实体从不刷新它，也从不以其预报过旧为由拒绝。

`SingleCoordinatorWeatherEntity` 是使用单个协调器同时保存观测数据和预报数据的快捷方式。

## 方法

### 天气预报

```python
async def async_forecast_daily(self) -> list[Forecast] | None:
async def async_forecast_hourly(self) -> list[Forecast] | None:
async def async_forecast_twice_daily(self) -> list[Forecast] | None:
```

只需实现您在支持的功能中声明的那些方法。没有同步变体。

## 状态

状态即为 `condition`。当前值会成为状态属性，并采用用户的单位。请勿自行设置 `state`。

## 示例

一个带有每日天气预报的天气实体：

```python
from homeassistant.components.weather import (
    Forecast,
    WeatherEntity,
    WeatherEntityFeature,
)
from homeassistant.const import UnitOfSpeed, UnitOfTemperature


class ExampleWeather(WeatherEntity):
    """Weather from an example service."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_native_temperature_unit = UnitOfTemperature.CELSIUS
    _attr_native_wind_speed_unit = UnitOfSpeed.METERS_PER_SECOND
    _attr_supported_features = WeatherEntityFeature.FORECAST_DAILY

    def __init__(self, client: ExampleClient, location_id: str) -> None:
        """Initialize the weather entity."""
        self._client = client
        self._attr_unique_id = location_id

    async def async_update(self) -> None:
        """Fetch the current weather."""
        current = await self._client.get_current()
        self._attr_condition = current.condition
        self._attr_native_temperature = current.temperature
        self._attr_native_wind_speed = current.wind_speed

    async def async_forecast_daily(self) -> list[Forecast] | None:
        """Return the daily forecast."""
        days = await self._client.get_daily_forecast()
        return [
            Forecast(
                datetime=day.date.isoformat(),
                condition=day.condition,
                native_temperature=day.high,
                native_templow=day.low,
            )
            for day in days
        ]
```
