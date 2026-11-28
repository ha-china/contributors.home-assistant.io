# 区域卡片

> 区域卡片汇总家中的一个区域，包括其图片、传感器和警报，并可为其中的一切添加控制。

Source: https://www.hasscn.top/contributors/design/dashboards/area-card/

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
        "type": "area",
        "area": "living_room",
        "sensor_classes": [
          "temperature",
          "humidity"
        ]
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "area",
        "area": "living_room",
        "display_type": "compact",
        "sensor_classes": [
          "temperature",
          "humidity"
        ],
        "features": [
          {
            "type": "area-controls"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

区域卡片让您一目了然地查看一个区域：其名称和图标、传感器的读数，以及需要关注时的警报。在概览页面上使用它，每个区域一张卡片，选中它即可进入该区域的详情。

该卡片基于区域注册表工作。它会自行查找区域的实体（entity），因此在添加或移动设备时能保持最新状态。如果只想显示区域中的一个实体，请使用[磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)。

### 显示类型

`display_type` 决定卡片占用的空间大小：

- `picture`：默认值。区域的图片填满卡片顶部。如果没有图片，则区域的图标在纯色背景上代替图片的位置。
- `camera`：显示区域中摄像头的实时画面，而不是图片。
- `icon`：在纯色背景上显示区域的图标，大小与图片相同。
- `compact`：完全不显示图片。卡片小如磁贴，图标位于名称之前。

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
        "type": "area",
        "area": "hallway",
        "display_type": "icon"
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "area",
        "area": "hallway",
        "display_type": "compact"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

当人们能通过图片认出自己的房间时（例如在墙壁平板上），请使用图片。当概览页面包含许多区域时，请使用紧凑类型，以便它们能在一屏内显示。紧凑卡片可以是 `vertical`（垂直）的，就像垂直磁贴一样。

本页的演示没有区域图片，因此图片类型显示的是图标。

### 传感器和警报

通过 `sensor_classes`，卡片按设备类别显示区域传感器的读数。当一个区域有多个相同类别的传感器时，卡片显示它们的中位数；对于可累加的类别（如功率或能量），则显示它们的总和。气候设备也会通过其当前温度计入其中。在区域本身上设置的温度或湿度传感器优先于所有其他传感器。

通过 `alert_classes`，卡片为区域中每个处于开启状态的二进制传感器（binary sensor）类别显示一个图标，例如移动、打开的窗户或漏水。在较大的类型中，警报以一列的形式显示在图片上。在紧凑类型中，只显示第一个警报，作为图标上的徽章。警报只在实际发生情况时出现，因此空白处是好消息。

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
        "type": "area",
        "area": "kitchen",
        "display_type": "compact",
        "alert_classes": [
          "window",
          "moisture"
        ]
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "area",
        "area": "hallway",
        "display_type": "compact",
        "sensor_classes": [
          "illuminance"
        ],
        "alert_classes": [
          "motion",
          "door"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

如果没有 `sensor_classes` 或 `alert_classes`，卡片将不显示任何读数或警报。请选择对概览最重要的少数几个类别，例如温度和湿度，以及移动和漏水。

### 功能

区域卡片支持功能（feature），就像磁贴卡片一样。`area-controls` 功能添加按钮，可将区域的灯光、风扇和窗帘一起打开或关闭。默认情况下，它最多显示四个按钮，对应区域所拥有的设备类型。通过 `controls`，您可以自行选择。

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
        "type": "area",
        "area": "bedroom",
        "display_type": "compact",
        "features": [
          {
            "type": "area-controls",
            "controls": [
              "fan",
              "cover-blind"
            ]
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 名称和图标来自区域注册表。仅当仪表盘（dashboard）需要与 Home Assistant 其他部分不同的称呼时才覆盖它们。
- 使用 `exclude_entities` 排除会使读数不准确的实体，例如冰箱内的温度传感器。
- 默认情况下，选中卡片时不会执行任何操作。为它设置一个导航到该区域的 `tap_action`，让卡片成为进入详情的入口。

## 配置

- `area`（字符串，必填）：区域的 ID。
- `name`（字符串）：要显示的名称。默认为区域的名称。
- `color`（字符串）：图标的颜色。
- `display_type`（字符串）：`picture`、`camera`、`icon` 或 `compact`。默认为 `picture`。
- `vertical`（布尔值）：将图标放在名称上方。仅适用于 `compact` 类型。默认为 `false`。
- `camera_view`（字符串）：`auto` 或 `live`，用于 `camera` 类型。
- `aspect_ratio`（字符串）：图片的形状，例如 `16:9`。默认为 `16:9`。
- `sensor_classes`（列表）：要显示的传感器的设备类别。
- `alert_classes`（列表）：要显示为警报的二进制传感器的设备类别。
- `exclude_entities`（列表）：要从读数、警报和控制中排除的实体。
- `features`（列表）：要显示的功能，每个功能都有一个 `type`。
- `features_position`（字符串）：`bottom` 或 `inline`。默认为 `bottom`。
- `tap_action`（动作）：选中卡片时执行的操作。默认为 `none`。
- `image_tap_action`（动作）：选中图片时执行的操作。对于 `camera` 类型，它会打开摄像头。

```yaml
type: area
area: living_room
display_type: compact
sensor_classes:
  - temperature
  - humidity
alert_classes:
  - motion
features:
  - type: area-controls
tap_action:
  action: navigate
  navigation_path: "/dashboard-rooms/living-room"
```

## 代码位置

该卡片位于 [`src/panels/lovelace/cards/hui-area-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-area-card.ts)，元素为 `<hui-area-card>`。它由与磁贴卡片相同的磁贴部件构建，即 `<ha-tile-container>`、`<ha-tile-icon>` 和 `<ha-tile-info>`，警报则是磁贴徽章。区域控制功能位于 [`src/panels/lovelace/card-features/hui-area-controls-card-feature.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/card-features/hui-area-controls-card-feature.ts)。

在分区视图中，区域卡片占 12 列中的 6 列。紧凑类型占一行，就像磁贴一样。图片、摄像头和图标类型会为图片额外增加两行。功能的添加行数方式与磁贴卡片相同。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-area-card.ts)
