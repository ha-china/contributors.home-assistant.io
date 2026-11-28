# 天气预报卡片

> 天气预报卡片显示当前天气以及来自天气实体（entity）的未来几天或几小时的预报。

Source: https://www.hasscn.top/contributors/design/dashboards/weather-forecast-card/

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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

## 用法

天气预报卡片显示一个天气实体。顶部显示当前天气状况，包括一个图标、温度以及另一个数值，例如今天的最高和最低温度。底部显示预报：每天或每小时一列，带有图标和温度。

在仪表盘（dashboard）上使用一次，放在人们查看天气的位置。如果只需要室外温度，使用天气实体或温度传感器的[瓷砖卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)占用的空间更少。要查看过去一天的温度，请使用[历史图表卡片（history graph card）](https://www.hasscn.top/contributors/design/dashboards/history-graph-card/)。

### 每日或每小时

`forecast_type` 设置卡片显示哪种预报：`daily`、`hourly` 或 `twice_daily`（白天和夜间）。可用的类型取决于天气服务。卡片编辑器只提供该实体支持的类型。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "weather-forecast",
        "entity": "weather.home",
        "forecast_type": "hourly"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

`forecast_slots` 设置卡片显示多少天或多少小时，默认为 5。

### 仅显示当前天气或仅显示预报

`show_current: false` 会省略当前天气，`show_forecast: false` 会省略预报。只包含其中之一的卡片会更矮。当旁边的卡片已经显示当前温度时，可以使用仅显示预报的版本。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "weather-forecast",
        "entity": "weather.home",
        "forecast_type": "daily",
        "show_current": false
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "weather-forecast",
        "entity": "weather.home",
        "show_forecast": false
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 窄卡片

卡片会根据自身宽度进行调整。随着宽度变窄，当前天气会使用更小的图标和更小的字号，在最窄的尺寸下名称和额外数值会消失。当卡片较矮时，预报也会变得紧凑。因此该卡片可以在半个区块中使用，但在全宽时能显示更多内容。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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
  <ha-embed-card style="grid-column: span 6">
    <script type="application/json">
      {
        "type": "weather-forecast",
        "entity": "weather.home",
        "forecast_type": "daily",
        "forecast_slots": 3,
        "grid_options": {
          "columns": 6
        }
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 名称默认为天气实体的名称，通常就是家的名称。只有在显示多个位置时才需要修改它。
- `secondary_info_attribute` 设置温度下方的数值，例如 `humidity` 或 `wind_speed`。默认情况下，它是当天的最高和最低温度、降水量或湿度，取决于实体首先拥有哪一项。
- `round_temperature: true` 会去掉小数。反正大多数预报的精度也不足以体现小数。

## 配置

- `entity`（字符串，必填）：要显示的天气实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `forecast_type`（字符串）：`daily`、`hourly` 或 `twice_daily`。
- `show_current`（布尔值）：显示当前天气。默认为 `true`。
- `show_forecast`（布尔值）：显示预报。默认为 `true`。
- `forecast_slots`（数字）：预报显示多少天或多少小时。默认为 `5`。
- `secondary_info_attribute`（字符串）：显示在温度下方的属性。
- `round_temperature`（布尔值）：将温度四舍五入为整数。默认为 `false`。
- `theme`（字符串）：仅用于此卡片的主题。
- `tap_action`、`hold_action`、`double_tap_action`（动作）：选择、长按或双击卡片时发生的事情。默认情况下，选择卡片会打开更多信息对话框。

```yaml
type: weather-forecast
entity: weather.home
forecast_type: hourly
show_current: false
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-weather-forecast-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-weather-forecast-card.ts)，元素为 `<hui-weather-forecast-card>`。它通过 `weather/subscribe_forecast` WebSocket 命令订阅预报，因此预报会自动更新。天气相关的辅助功能（如图标和属性格式化）位于 [`src/data/weather.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/weather.ts)。

一个 `ResizeController` 会测量卡片，并添加诸如 `narrow`、`very-narrow` 和 `short` 之类的类。样式使用这些类而不是媒体查询，因为卡片的宽度与屏幕宽度无关。

在区块视图中，卡片占据区块的整个宽度。它的高度取决于显示的内容：一行，加上当前天气的一行，加上预报的一行，如果是每日预报则再加一行。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-weather-forecast-card.ts)
