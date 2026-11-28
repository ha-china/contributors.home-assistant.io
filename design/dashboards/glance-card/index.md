# 概览卡片（Glance card）

> 概览卡片并排显示多个实体的状态，每个实体包括名称、图标和状态。它是一眼就能读完的概览。

Source: https://www.hasscn.top/contributors/design/dashboards/glance-card/

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
        "type": "glance",
        "entities": [
          "binary_sensor.front_door",
          "lock.front_door",
          "binary_sensor.hallway_motion",
          "light.hallway"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

概览卡片将若干实体排成多列：名称在上方，图标在中间，状态在下方。它一眼就能回答一个问题，比如“房子关好了吗？”或“谁在家？”。

概览卡片没有控件。选中一个实体会打开其更多信息对话框，长按也是如此。当人们需要操作实体时，请使用[磁贴卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)或[实体卡片（entities card）](https://www.hasscn.top/contributors/design/dashboards/entities-card/)。对于单个重要的值，请使用[实体卡片（entity card）](https://www.hasscn.top/contributors/design/dashboards/entity-card/)。

### 列数

卡片每行最多容纳五个实体，其余的换到下一行。设置 `columns` 可以自行指定列数。列数越少，较长的名称就有更多空间。

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
        "type": "glance",
        "title": "Climate",
        "columns": 3,
        "entities": [
          "sensor.living_room_temperature",
          "sensor.living_room_humidity",
          "sensor.monstera_temperature",
          "sensor.outdoor_temperature",
          "sensor.outdoor_humidity"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 显示更少的内容

使用 `show_name`、`show_icon` 和 `show_state` 可以为所有实体隐藏某一部分。当图标本身已经足够说明问题（比如门窗）时，一行不带名称、只带状态的图标效果很好。

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
        "type": "glance",
        "show_name": false,
        "entities": [
          "binary_sensor.front_door",
          "binary_sensor.kitchen_window",
          "cover.garage_door",
          "lock.front_door"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 上次更改

在实体上设置 `show_last_changed: true` 后，将显示状态在多久之前发生了更改，而不是状态本身。适用于门之类的对象，因为“什么时候”往往比“是什么”更值得关注。

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
        "type": "glance",
        "entities": [
          {
            "entity": "binary_sensor.front_door",
            "show_last_changed": true
          },
          {
            "entity": "binary_sensor.hallway_motion",
            "show_last_changed": true
          },
          "person.alex",
          "person.sam"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 名称保持在一两个词以内。每列都很窄，名称过长会被截断。
- 将回答同一问题的实体分组在一起。一张混合了电池、门和天气的卡片，不是一眼就能读懂的。
- 当实体本身不足以说明问题时，使用 `title`。

## 配置

- `entities`（列表，必填）：要显示的实体。每个条目可以是实体 ID，也可以是包含 `entity` 和选项的映射。
- `title`（字符串）：卡片标题栏中的标题。
- `columns`（数字）：列数。默认为实体数量，最多五个。
- `show_name`（布尔值）：显示名称。默认为 `true`。
- `show_icon`（布尔值）：显示图标。默认为 `true`。
- `show_state`（布尔值）：显示状态。默认为 `true`。
- `color`（字符串）：图标的着色方式。默认为 `state`，即状态的颜色。使用 `none` 表示默认图标颜色。
- `theme`（字符串）：此卡片使用的主题。

实体的选项：

- `entity`（字符串，必填）：要显示的实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `icon`（字符串）：要显示的图标。默认为实体的图标。
- `image`（字符串）：代替图标显示的图片。
- `show_state`（布尔值）：显示此实体的状态。默认为 `true`。
- `show_last_changed`（布尔值）：显示距上次更改的时间，而不是状态。默认为 `false`。
- `color`（字符串）：图标的颜色。会覆盖卡片的颜色。
- `tap_action`、`hold_action`、`double_tap_action`（动作）：选中、长按或双击实体时发生的事情。默认情况下，选中和长按会打开更多信息对话框。

```yaml
type: glance
title: "Climate"
columns: 3
entities:
  - sensor.living_room_temperature
  - sensor.living_room_humidity
  - entity: sensor.outdoor_temperature
    name: "Outside"
```

## 代码位置

该卡片位于 [`src/panels/lovelace/cards/hui-glance-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-glance-card.ts)，元素为 `<hui-glance-card>`。列宽通过 `--glance-column-width` 自定义属性设置，由 `columns` 计算得出。图标是一个 `<state-badge>`。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-glance-card.ts)
