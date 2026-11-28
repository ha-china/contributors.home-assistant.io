# 实体图片卡片

> 实体图片卡片将一个实体显示为图片，并在底部的栏上显示其名称和状态。它是适用于摄像头的卡片。

Source: https://www.hasscn.top/contributors/design/dashboards/picture-entity-card/

## 用法

实体图片卡片（picture entity card）将一个实体显示为图片。图片填满整个卡片，底部一条深色半透明的栏在左侧显示实体的名称，在右侧显示其状态。选中卡片会打开实体的更多信息对话框。

本页面没有实时示例。本网站的演示之家没有可展示的图片或摄像头。

将其用于摄像头：卡片会显示其最新快照或实时视频流。将其用于图片实体，或带有头像的人物。也将其用于那些通过图片比通过图标更容易识别的实体，比如灯、门铃或花园。

对于其他情况，[平铺卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)能用更小的空间传达更多信息。当图片需要显示多个实体时，请使用[图片概览卡片（picture glance card）](https://www.hasscn.top/contributors/design/dashboards/picture-glance-card/)。对于不关联实体的图片，请使用[图片卡片（picture card）](https://www.hasscn.top/contributors/design/dashboards/picture-card/)。

### 图片从哪里来

卡片按以下顺序选择图片：

1. 实体自身的图片，当 `show_entity_picture` 开启且实体有图片时，比如媒体播放器的专辑封面。
2. 你设置的 `image`。
3. 图片实体的图片，或人物的头像。

摄像头实体始终显示摄像头画面，而 `camera_image` 可为其他任何实体显示摄像头画面。设置 `camera_view: live` 后，卡片会播放实时视频流，而不是刷新快照。实时视频流占用更多带宽，因此除非人们需要看到动态画面，否则请保持 `auto`。

### 状态图片和滤镜

图片可以随状态变化。`state_image` 将状态映射到图片，比如 `on` 时显示亮着的灯的照片，`off` 时显示黑暗中的照片。`state_filter` 将状态映射到 CSS 滤镜，比如 `brightness(50%)`。

当实体处于关闭或不可用状态，且该状态没有对应的图片时，卡片会将图片变灰。人们一眼就能看出灯已关闭，而无需阅读状态。

### 名称和状态

使用 `show_name` 和 `show_state` 可以隐藏底栏的任一部分。只显示其中之一时，文本会居中。两者都不显示时，底栏会消失，卡片就只剩图片。仅当图片本身已经展示了状态时才隐藏状态，比如摄像头。

### 内容

- 使用底部区域平静的照片。底栏是半透明的，其后面繁杂的细节会使文本难以阅读。
- 当多张卡片的图片尺寸不同时，设置 `aspect_ratio`，使卡片对齐。使用 `fit_mode` 决定图片如何填充该形状：`cover` 裁剪，`contain` 加黑边，`fill` 拉伸。

## 配置

- `entity`（字符串，必填）：要显示的实体。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `image`（字符串或媒体）：要显示的图片，可以是 URL 或媒体源条目。对大多数实体来说是必填的，见上文。
- `show_entity_picture`（布尔值）：使用实体自身的图片（如果有的话）。默认为 `false`。
- `camera_image`（字符串）：要显示为图片的摄像头实体。
- `camera_view`（字符串）：`auto` 表示快照，`live` 表示实时视频流。默认为 `auto`。
- `state_image`（映射）：每个状态对应的图片。
- `state_filter`（映射）：每个状态对应的 CSS 滤镜。
- `aspect_ratio`（字符串）：图片的形状，比如 `16x9` 或 `50%`。在分区视图中卡片具有固定行数时会被忽略。
- `fit_mode`（字符串）：`cover`、`contain` 或 `fill`。默认为 `cover`。
- `show_name`（布尔值）：显示名称。默认为 `true`。
- `show_state`（布尔值）：显示状态。默认为 `true`。
- `theme`（字符串）：应用于卡片的主题。
- `tap_action`（动作）：选中卡片时发生的行为。默认为 `more-info`。
- `hold_action`、`double_tap_action`（动作）：长按或双击时发生的行为。默认为 `none`。

```yaml
type: picture-entity
entity: light.living_room_lamp
image: "/local/floor_lamp.jpg"
tap_action:
  action: toggle
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-picture-entity-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-entity-card.ts)，元素为 `<hui-picture-entity-card>`。图片部分是一个 `<hui-image>`（[`src/panels/lovelace/components/hui-image.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/components/hui-image.ts)），与图片概览卡片和图片元素卡片共用。该元素负责处理摄像头快照和视频流、状态图片、滤镜、实体关闭时的灰色滤镜以及宽高比。

当实体不是摄像头、图片或人物，且没有设置 `image`、`state_image`、`camera_image` 或 `show_entity_picture` 时，卡片会抛出 `No image source configured`。

底栏的颜色来自 `--ha-picture-card-background-color` 和 `--ha-picture-card-text-color`。该卡片没有自己的网格选项：在分区视图中，它占据全部 12 列，其高度随图片而定。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-entity-card.ts)
