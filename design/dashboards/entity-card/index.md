# 实体卡片（entity card）

> 实体卡片以大号数值显示一个实体的状态，并附带其名称和图标。它专为希望一目了然读取的数字而设计。

Source: https://www.hasscn.top/contributors/design/dashboards/entity-card/

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
        "type": "entity",
        "entity": "sensor.outdoor_temperature"
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "entity",
        "entity": "sensor.desk_plug_power"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

实体卡片将一个实体的状态置于最显眼的位置：名称在顶部，图标在角落，数值以大号字体显示在下方。它最适合展示人们经常查看的读数，比如室外温度或设备当前的用电功率。

实体卡片仅用于展示。它没有任何控件，选中它会打开更多信息对话框。要展示人们还会操作的实体（entity），比如灯，请使用[平铺卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)。要展示数值随时间的变化，请使用[传感器卡片（sensor card）](https://www.hasscn.top/contributors/design/dashboards/sensor-card/)，它会在数值下方添加一个图表。

### 属性

使用 `attribute`，卡片将显示一个属性（attribute）而不是状态。当该属性本身没有单位时，请添加 `unit`。自定义单位始终显示在数值之后。

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
        "type": "entity",
        "entity": "climate.thermostat",
        "attribute": "current_temperature",
        "name": "Living room",
        "unit": "°C"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 状态颜色

对于灯，图标会采用状态对应的颜色，比如灯打开时为琥珀色，或者灯本身的颜色。对于其他实体，图标保持默认的图标颜色。设置 `state_color: true` 可以让这些实体的图标也按状态着色，或设置 `state_color: false` 为灯关闭该功能。

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
        "type": "entity",
        "entity": "light.living_room_lamp"
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "entity",
        "entity": "lock.front_door",
        "state_color": true
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 页脚

卡片可以带有页脚（footer），比如实体的图表或一排按钮。使用图表时，卡片会变成一个小型传感器卡片，因此这种情况建议使用[传感器卡片](https://www.hasscn.top/contributors/design/dashboards/sensor-card/)。

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
        "type": "entity",
        "entity": "sensor.living_room_temperature",
        "footer": {
          "type": "graph",
          "entity": "sensor.living_room_temperature"
        }
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 用于数字和简短的状态。过长的状态会被截断。
- 名称保持简短。卡片上方的区域或标题通常已经说明了数值的来源，因此“Temperature”可能就足够了。

## 配置

- `entity`（字符串，必填）：要显示的实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `icon`（字符串）：要显示的图标。默认为实体的图标。
- `attribute`（字符串）：显示此属性而不是状态。
- `unit`（字符串）：显示在数值之后的单位。默认为实体的单位。
- `state_color`（布尔值）：按实体状态为图标着色。灯默认为 `true`，其他实体默认为 `false`。
- `theme`（字符串）：此卡片使用的主题。
- `footer`（映射）：页脚，类型为 `graph`、`buttons` 或 `picture`。
- `tap_action`、`hold_action`、`double_tap_action`（动作）：选中、长按或双击卡片时发生的行为。默认情况下，选中会打开更多信息对话框。

```yaml
type: entity
entity: climate.thermostat
attribute: current_temperature
name: "Living room"
unit: "°C"
```

## 代码位置

该卡片位于 [`src/panels/lovelace/cards/hui-entity-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-entity-card.ts)，元素为 `<hui-entity-card>`。页脚由 `createHeaderFooterElement` 创建，[实体卡片（entities card）](https://www.hasscn.top/contributors/design/dashboards/entities-card/)的页眉和页脚也使用同一个函数。

在分区（sections）视图中，该卡片占据 12 列中的 6 列和两行，且不能小于此尺寸。

[源码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-entity-card.ts)
