# 实体卡片

> 实体卡片以列表形式显示实体，每行一个，每行都带有适合该实体的控件。它是在一张卡片中紧凑地显示多个实体的方式。

Source: https://www.hasscn.top/contributors/design/dashboards/entities-card/

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
        "type": "entities",
        "title": "Living room",
        "entities": [
          "light.living_room_lamp",
          "media_player.living_room_speaker",
          "climate.thermostat",
          "sensor.living_room_temperature",
          "sensor.living_room_humidity"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

实体卡片是一个列表。每个实体占一行，包含其图标、名称，右侧则是其状态或适合该域（domain）的控件：灯用开关，输入数字用滑块，选择用下拉框，锁或窗帘用按钮。点击名称或图标会打开更多信息对话框。

当你想在很小的空间内显示多个实体时可以使用它，例如设备的设置，或某个例程的所有辅助元素（helper）。对于人们经常使用的少数实体，[瓷砖卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)更易于阅读和点击。对于一排没有控件的状态，请使用[概览卡片（glance card）](https://www.hasscn.top/contributors/design/dashboards/glance-card/)。

### 适合实体的行

行由实体的域决定。你无需配置，实体卡片会自动为你完成。

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
        "type": "entities",
        "entities": [
          "input_boolean.guest_mode",
          "input_number.comfort_temperature",
          "input_select.house_mode",
          "lock.front_door",
          "cover.bedroom_blinds",
          "scene.movie_night",
          "timer.laundry"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 标题和头部开关

设置了 `title` 后，卡片会有一个头部。当卡片中至少有两个可切换的实体时，头部会出现一个可一次性切换所有实体的开关。当这个开关没有意义时，可以设置 `show_header_toggle: false`，例如列表中同时包含灯和锁的情况。

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
        "type": "entities",
        "title": "Lights",
        "entities": [
          "light.living_room_lamp",
          "light.hallway",
          "light.kitchen_ceiling"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 特殊行

并非每一行都是实体。特殊行具有 `type`，用于组织列表结构，或添加非实体的内容：

- `divider`：行组之间的分隔线。
- `section`：带有标签的线，用于开始一个新分组。
- `attribute`：实体的一个属性，单独占一行。
- `weblink`：指向某个页面的链接。
- `buttons`：一排小按钮，每个实体一个。
- `text`：带有固定文本的名称。
- `button`：带有可执行操作的按钮的行。
- `conditional`：仅在满足条件时才显示的行。
- `cast`：开始将仪表盘投屏到 Google Cast 设备。

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
        "type": "entities",
        "title": "Hallway",
        "show_header_toggle": false,
        "entities": [
          "light.hallway",
          "lock.front_door",
          {
            "type": "divider"
          },
          {
            "type": "attribute",
            "entity": "lock.front_door",
            "attribute": "changed_by",
            "name": "Last locked by"
          },
          {
            "type": "section",
            "label": "Sensors"
          },
          "binary_sensor.front_door",
          "binary_sensor.hallway_motion",
          {
            "type": "weblink",
            "name": "Smart lock manual",
            "url": "https://www.home-assistant.io/integrations/nuki/"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

请谨慎使用分隔线和分组。如果一个列表需要很多分组，它可能应该拆分成多张卡片。

### 头部和底部

卡片可以有头部和底部。`graph` 显示一个实体的历史记录，`buttons` 显示一排按钮，`picture` 显示一张图片。图形底部可以将一列读数变成一个小型概览。

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
        "type": "entities",
        "title": "Office",
        "entities": [
          "switch.desk_plug",
          "sensor.desk_plug_power",
          "sensor.desk_plug_energy"
        ],
        "footer": {
          "type": "graph",
          "entity": "sensor.desk_plug_power",
          "hours_to_show": 12
        }
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "entities",
        "entities": [
          "input_select.house_mode",
          "input_boolean.guest_mode"
        ],
        "header": {
          "type": "buttons",
          "entities": [
            "scene.movie_night",
            "scene.good_night"
          ]
        }
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 行选项

一行可以覆盖其实体的名称和图标，并在名称下方显示 `secondary_info`，例如上次更改的时间或某个属性。设置 `color: none` 后，行的图标不再跟随状态变化。

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
        "type": "entities",
        "entities": [
          {
            "entity": "light.living_room_lamp",
            "secondary_info": "brightness"
          },
          {
            "entity": "binary_sensor.front_door",
            "secondary_info": "last_changed"
          },
          {
            "entity": "sensor.living_room_temperature",
            "name": "Temperature",
            "icon": "mdi:sofa"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 将属于一起的行分组。混合了房间和设备的列表很难浏览。
- 保持名称简短。右侧的控件会占用空间，过长的名称会被截断。
- 让卡片自动选择行。仅在需要特殊行时才覆盖类型。

## 配置

- `entities`（列表，必填）：各行。每行可以是一个实体 ID，也可以是包含 `entity` 和选项的映射，还可以是带有 `type` 的特殊行。
- `title`（字符串）：卡片头部中的标题。
- `icon`（字符串）：标题前的图标。
- `show_header_toggle`（布尔值）：在头部显示一个可切换所有实体的开关。默认情况下，当卡片有标题且至少有两个可切换的实体时会显示它。
- `color`（字符串）：如何为各行的图标着色。默认为 `state`，即状态的颜色。使用 `none` 表示默认的图标颜色。
- `header`（映射）：类型为 `graph`、`buttons` 或 `picture` 的头部。
- `footer`（映射）：类型为 `graph`、`buttons` 或 `picture` 的底部。
- `theme`（字符串）：此卡片使用的主题。

实体行的选项：

- `entity`（字符串，必填）：该行的实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `icon`（字符串）：要显示的图标。默认为实体的图标。
- `image`（字符串）：代替图标显示的图片。
- `secondary_info`（字符串或列表）：名称下方的额外信息。它接受与[瓷砖卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)的 `state_content` 相同的值：`state`、`last_changed`、`last_updated`、`area_name`，或某个属性的名称。较旧的值（如 `last-changed` 和 `position`）仍然有效。
- `color`（字符串）：图标的颜色。会覆盖卡片的颜色。
- `tap_action`、`hold_action`、`double_tap_action`（操作）：点击、长按或双击该行时会发生什么。并非所有行类型都支持它们。

```yaml
type: entities
title: "Hallway"
show_header_toggle: false
entities:
  - light.hallway
  - lock.front_door
  - type: section
    label: "Sensors"
  - binary_sensor.front_door
  - entity: binary_sensor.hallway_motion
    secondary_info: last_changed
footer:
  type: graph
  entity: sensor.hallway_illuminance
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-entities-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-entities-card.ts)，元素为 `<hui-entities-card>`。各行由 [`src/panels/lovelace/create-element/create-row-element.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/create-element/create-row-element.ts) 中的 `createRowElement` 创建，它将每个域映射到一行。实体行位于 [`src/panels/lovelace/entity-rows/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace/entity-rows)，特殊行位于 [`src/panels/lovelace/special-rows/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace/special-rows)，头部和底部位于 [`src/panels/lovelace/header-footer/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace/header-footer)。

实体行共享 `<hui-generic-entity-row>`，它渲染图标、名称和次要信息，并将右侧留给各行使用。新的实体行可以从这里开始。

在分区视图中，该卡片占据全部 12 列，并随其行数增长。它可以缩小到 3 列。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-entities-card.ts)
