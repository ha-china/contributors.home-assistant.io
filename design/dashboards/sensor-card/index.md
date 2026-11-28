# 传感器卡片

> 传感器卡片以大号字体显示一个数值传感器的值，并在下方可选显示其近期历史的折线图。

Source: https://www.hasscn.top/contributors/design/dashboards/sensor-card/

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
        "type": "sensor",
        "entity": "sensor.living_room_temperature",
        "graph": "line"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

传感器卡片适用于人们想要一目了然地读取并查看其趋势的某个数值：温度、设备使用的功率、房间里的湿度。它在顶部显示名称和图标，以大号字体显示数值，并在底部显示过去 24 小时的折线图。

它支持传感器（sensor）、数字（number）、输入数字（input number）和计数器（counter）。数值必须是数字，折线图才有意义。

当数值只是某个区域中的众多数值之一、且趋势不重要时，请使用[磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)。当数值在某个范围内的位置比其历史更重要时，请使用[仪表盘卡片](https://www.hasscn.top/contributors/design/dashboards/gauge-card/)。要比较多个实体（entity），或者当人们需要坐标轴和过去的确切数值时，请使用[历史图表卡片](https://www.hasscn.top/contributors/design/dashboards/history-graph-card/)。

### 有图或无图

设置 `graph: line` 时，卡片会添加折线图。不设置时，卡片只显示数值。这个纯数值版本与[实体卡片](https://www.hasscn.top/contributors/design/dashboards/entity-card/)相同，所以如果你不想要折线图，请改用那张卡片。

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
        "type": "sensor",
        "entity": "sensor.desk_plug_power",
        "graph": "line"
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "sensor",
        "entity": "sensor.outdoor_humidity"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

折线图是一种迷你图（sparkline）：没有坐标轴、没有标签、没有工具提示。它显示的是趋势的形状，而不是具体数字。这让卡片保持简洁，而且由于当前数值就显示在图的上方，所以这样设计是可行的。

### 时间范围和细节

`hours_to_show` 设置折线图回溯的时间长度。较短的范围显示快速变化，比如刚开启的设备的功率。较长的范围显示规律，比如一整天的温度。

设置 `detail: 2` 时，折线图使用更多的数据点，并跟随每一次变化。默认值 `detail: 1` 会对每小时的数值取平均，从而得到更平滑的曲线。除非峰值本身才是重点，否则请选择平滑曲线。

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
        "type": "sensor",
        "entity": "sensor.desk_plug_power",
        "graph": "line",
        "hours_to_show": 6,
        "detail": 2
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "sensor",
        "entity": "sensor.desk_plug_power",
        "graph": "line",
        "hours_to_show": 6
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 名称来自实体。请保持简短，卡片只占半个区域的宽度。
- 不要改动单位。单位由实体提供，卡片会根据用户的语言对数值进行格式化。仅当实体本身没有单位时才覆盖 `unit`。
- 仅当折线图的默认刻度隐藏了重要信息时才设置 `limits`，比如温度从不低于 18 度时的微小变化。

## 配置

- `entity`（字符串，必填）：传感器、数字、输入数字或计数器实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `icon`（字符串）：要显示的图标。默认为实体的图标。
- `graph`（字符串）：`line` 添加折线图，`none` 则不显示。默认为 `none`。
- `unit`（字符串）：要显示的单位。默认为实体的单位。
- `detail`（数字）：`1` 为每小时平均值，`2` 为更多细节。默认为 `1`。
- `hours_to_show`（数字）：折线图显示多少小时。默认为 `24`。
- `limits`（映射）：折线图垂直刻度的 `min` 和 `max`。默认情况下，刻度跟随数值变化。
- `theme`（字符串）：仅用于此卡片的主题。

```yaml
type: sensor
entity: sensor.desk_plug_power
graph: line
hours_to_show: 6
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-sensor-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-sensor-card.ts)，元素为 `<hui-sensor-card>`。它继承自实体卡片（`hui-entity-card.ts`）：将自己的选项转换为实体卡片配置，并将折线图作为页脚添加。折线图是图表页眉和页脚元素，位于 [`src/panels/lovelace/header-footer/hui-graph-header-footer.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/header-footer/hui-graph-header-footer.ts)，实体卡片也可以将其用作页脚。

在区域（sections）视图中，该卡片占 12 列中的 6 列，以及 2 行。它不能比这更小。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-sensor-card.ts)
