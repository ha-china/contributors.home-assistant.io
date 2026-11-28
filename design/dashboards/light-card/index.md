# 灯光卡片

> 灯光卡片将一盏灯显示为一个大的圆形按钮，周围有一个用于设置亮度的圆环。

Source: https://www.hasscn.top/contributors/design/dashboards/light-card/

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
        "type": "light",
        "entity": "light.living_room_lamp"
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "light",
        "entity": "light.kitchen_ceiling"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

灯光卡片是针对一盏灯的大型控件。中间是一个带有灯的图标的按钮，周围的圆环用于设置亮度。按钮下方显示亮度和名称。点按按钮可切换灯的开关状态，长按会打开更多信息对话框。角落的菜单按钮也会打开更多信息对话框。

图标会采用灯光的颜色，并随灯光变亮或变暗。关闭的灯显示为灰色。拖动圆环时，移动过程中亮度会显示在卡片中间。

当一盏灯是仪表盘（dashboard）或某个分区中的主要内容时，可以使用灯光卡片，例如门旁的壁挂平板。对于大多数灯，带有亮度功能的[瓷砖卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)更合适：它只占用四分之一的空间，并且可以与同一区域（area）中的其他灯很好地并排放置。

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
        "type": "tile",
        "entity": "light.living_room_lamp",
        "features": [
          {
            "type": "light-brightness"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 不支持亮度的灯

只能开和关的灯没有圆环。卡片仍会显示按钮和名称，因此在更换实体（entity）时不会发生跳动。对于这样的灯，瓷砖卡片或[按钮卡片（button card）](https://www.hasscn.top/contributors/design/dashboards/button-card/)能用更少的空间表达相同的内容。

### 内容

- 名称要简短。它位于按钮下方、卡片中间，名称过长会换行或被截断。
- 仅在灯的默认图标无法说明其类型时才设置图标，例如落地灯或灯带。
- 保留默认操作。人们期望点按可以切换灯的开关，拖动圆环可以调节亮度。

## 配置

- `entity`（字符串，必填）：要显示的灯。仅支持 `light` 域的实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `icon`（字符串）：按钮中的图标。默认为实体的图标。
- `theme`（字符串）：仅应用于此卡片的主题。
- `tap_action`（操作）：点按按钮时发生的操作。默认为 `toggle`。
- `hold_action`（操作）：长按按钮时发生的操作。默认为 `more-info`。
- `double_tap_action`（操作）：双击按钮时发生的操作。默认为 `none`。

```yaml
type: light
entity: light.living_room_lamp
name: "Reading lamp"
icon: "mdi:floor-lamp"
```

## 代码位置

该卡片位于 [`src/panels/lovelace/cards/hui-light-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-light-card.ts)，元素为 `<hui-light-card>`。圆环是 [`<ha-control-circular-slider>`](https://www.hasscn.top/contributors/design/components/controls/)，与恒温器卡片使用的控件相同，处于 `start` 模式，范围为 1 到 100 百分比。它仅在灯支持亮度时显示。设置亮度会调用带有 `brightness_pct` 的 `light.turn_on`。

该卡片没有自己的网格选项，因此在分区视图中它会占据分区的全部宽度，并根据需要占用高度。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-light-card.ts)
