# 网格卡片和堆叠卡片

> 网格卡片、水平堆叠卡片和垂直堆叠卡片用于容纳其他卡片，将它们并排或上下排列为一张卡片。

Source: https://www.hasscn.top/contributors/design/dashboards/grid-card/

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
        "type": "grid",
        "columns": 2,
        "square": false,
        "cards": [
          {
            "type": "button",
            "entity": "light.living_room_lamp"
          },
          {
            "type": "button",
            "entity": "light.hallway"
          },
          {
            "type": "button",
            "entity": "switch.desk_plug"
          },
          {
            "type": "button",
            "entity": "lock.front_door"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

这三种卡片本身没有内容。它们容纳其他卡片并对这些卡片进行布局：

- 网格卡片将卡片按列、逐行排列。
- 水平堆叠卡片将卡片并排放在一行中。
- 垂直堆叠卡片将卡片上下排列。

它们源自瀑布流（masonry）视图，在瀑布流视图中每张卡片占据一列，由视图决定卡片的位置。堆叠是在那里将卡片组合在一起的方式，例如一个标题加上其下方的卡片，或者两个仪表并排显示。

在分区（sections）视图中，你很少需要它们。分区本身已经是一个 12 列的网格，每张卡片在其中都有自己的尺寸。请直接将卡片放置在分区中，这样每张卡片都可以单独移动、调整大小和隐藏。只有当卡片必须在每种布局、每个屏幕上都保持在一起时，才使用堆叠。

### 网格

网格卡片默认有三列。可以通过设置 `columns` 来更改。默认情况下，每个单元格都是正方形，这适合像[按钮卡片](https://www.hasscn.top/contributors/design/dashboards/button-card/)这样的小卡片。设置 `square: false` 可以让每行的高度取决于该行中最高的卡片。

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
        "type": "grid",
        "cards": [
          {
            "type": "button",
            "entity": "light.living_room_lamp"
          },
          {
            "type": "button",
            "entity": "light.hallway"
          },
          {
            "type": "button",
            "entity": "light.kitchen_ceiling"
          }
        ]
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "grid",
        "columns": 2,
        "square": false,
        "cards": [
          {
            "type": "tile",
            "entity": "binary_sensor.front_door"
          },
          {
            "type": "tile",
            "entity": "lock.front_door"
          },
          {
            "type": "tile",
            "entity": "binary_sensor.kitchen_window"
          },
          {
            "type": "tile",
            "entity": "binary_sensor.bathroom_leak"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 水平堆叠

水平堆叠将其宽度平均分配给其中的卡片。请保持两到三张卡片。在窄屏幕上，堆叠中的每张卡片也会变窄，因为堆叠永远不会换行。

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
        "type": "horizontal-stack",
        "cards": [
          {
            "type": "gauge",
            "entity": "sensor.living_room_humidity",
            "name": "Inside"
          },
          {
            "type": "gauge",
            "entity": "sensor.outdoor_humidity",
            "name": "Outside"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 垂直堆叠

垂直堆叠将卡片上下排列为一张卡片。可以将其与水平堆叠结合，构建一个独立的小布局。

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
        "type": "vertical-stack",
        "cards": [
          {
            "type": "tile",
            "entity": "media_player.living_room_speaker"
          },
          {
            "type": "horizontal-stack",
            "cards": [
              {
                "type": "tile",
                "entity": "light.living_room_lamp"
              },
              {
                "type": "tile",
                "entity": "climate.thermostat"
              }
            ]
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 标题

这三种卡片都可以接受一个可选的 `title`，显示在卡片上方。在分区视图中，请改用[标题卡片](https://www.hasscn.top/contributors/design/dashboards/heading-card/)，这样标题的外观会与视图中的其他部分保持一致。

### 内容

- 堆叠中再嵌套堆叠、层层嵌套的堆叠既难以编辑，也难以修改。如果布局需要这样做，使用分区可能更合适。
- 网格或堆叠中的卡片保留各自的边框和背景。容器只负责添加它们之间的间距，不做其他事情。

## 配置

这三种卡片都接受：

- `cards`（列表，必填）：要显示的卡片，每张卡片都有自己的配置。
- `title`（字符串）：显示在卡片上方的标题。

网格卡片还接受：

- `columns`（数字）：列数。默认为 `3`。
- `square`（布尔值）：使每个单元格为正方形。默认为 `true`。

```yaml
type: grid
columns: 2
square: false
cards:
  - type: tile
    entity: binary_sensor.front_door
  - type: tile
    entity: lock.front_door
```

```yaml
type: horizontal-stack
cards:
  - type: gauge
    entity: sensor.living_room_humidity
  - type: gauge
    entity: sensor.outdoor_humidity
```

## 代码位置

这些卡片位于 [`src/panels/lovelace/cards/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace/cards) 中：`hui-grid-card.ts`、`hui-horizontal-stack-card.ts` 和 `hui-vertical-stack-card.ts`。对应的元素是 `<hui-grid-card>`、`<hui-horizontal-stack-card>` 和 `<hui-vertical-stack-card>`。这三种卡片都继承自 `hui-stack-card.ts` 中的共享基类，该基类为列表中的每张卡片创建一个 `<hui-card>` 并渲染标题。每种卡片只是在此基础上添加自己的布局样式。

堆叠的尺寸取决于其中的卡片：垂直堆叠将它们的尺寸相加，水平堆叠则取其中最大的尺寸。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-stack-card.ts)
