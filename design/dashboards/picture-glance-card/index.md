# 图片概览卡片

> 图片概览卡片显示一张图片，底部有一排实体图标，可一目了然地查看和控制一个房间或摄像头画面。

Source: https://www.hasscn.top/contributors/design/dashboards/picture-glance-card/

## 用法

图片概览卡片（picture glance card）将一张图片（通常是一个房间或摄像头画面）作为一排实体图标的背景。图标栏位于图片底部，如果你设置了标题，标题会显示在左侧。当实体处于非活动状态时，图标显示为灰色，活动时变为白色，这样你无需阅读任何文字就能看到哪些灯是开着的。

本页面没有实时示例。本网站的演示家庭中没有可展示的图片或摄像头。

当图片是识别某个地点的最佳方式，且人们希望对该地点进行一些快速控制时，可以使用它：例如在客厅照片上叠加客厅的灯光控制，或在门铃摄像头画面上叠加前门锁控制。

当图片对应单个实体时，请使用[图片实体卡片](https://www.hasscn.top/contributors/design/dashboards/picture-entity-card/)。当图标需要位于图片上的特定位置（例如平面图上）时，请使用[图片元素卡片](https://www.hasscn.top/contributors/design/dashboards/picture-elements-card/)。如果没有图片，[概览卡片](https://www.hasscn.top/contributors/design/dashboards/glance-card/)可以显示一排实体，[区域卡片](https://www.hasscn.top/contributors/design/dashboards/area-card/)可以为一个房间提供概览。

### 切换和对话框图标

该卡片将实体分为两组。可切换的实体（如灯、开关和风扇）归为一组：选择它们的图标即可切换状态。所有其他实体（如传感器和锁）归为另一组：选择它们的图标会打开更多信息对话框。每组在图标栏中各占一行，中间留有间隔，因此切换类图标总是集中在图标栏的末端。长按任一图标都会打开更多信息对话框。

设置 `force_dialog: true` 后，每个图标都会打开更多信息对话框。当误触切换会带来问题时（例如加热器），可以使用此选项。

### 状态

图标默认不显示文字。设置 `show_state`（在卡片上或针对单个实体）后，状态会显示在图标下方。针对单个实体设置 `attribute` 可以显示属性，并可选配 `prefix` 和 `suffix`。请谨慎使用：图标栏很小，几个带文字的图标很快就会占满它。

### 图片

图片的工作方式与图片实体卡片相同。它可以是固定的 `image`、`image_entity`、带快照或 `live` 流的 `camera_image`，或者是通过 `state_image` 为 `entity` 的每种状态指定图片。当 `entity` 处于关闭状态且该状态没有对应图片时，图片会变灰。选择图片会打开 `entity`、`image_entity` 或摄像头的更多信息对话框，除非你设置了其他 `tap_action`。

### 内容

- 实体数量保持在五个以内。在较窄的卡片上，图标栏只有一行。
- 仅在图片本身不足以说明情况时才使用标题。
- 选择底部区域较为简洁的图片。图标栏是半透明的。

## 配置

- `entities`（列表，必填）：要显示为图标的实体。每一项可以是实体 ID，也可以是包含 `entity`、`name`、`icon`、`show_state`、`attribute`、`prefix`、`suffix` 和操作（action）的映射。
- `title`（字符串）：图标栏中的标题。
- `image`（字符串或媒体）：要显示的图片。`image`、`image_entity`、`camera_image` 或 `state_image` 中必须提供其一。
- `image_entity`（字符串）：用于获取图片的图片实体或人物实体。
- `camera_image`（字符串）：要显示为图片的摄像头实体。
- `camera_view`（字符串）：`auto` 表示快照，`live` 表示实时流。默认为 `auto`。
- `entity`（字符串）：图片跟随的实体，用于 `state_image`、`state_filter` 和灰色滤镜。
- `state_image`（映射）：`entity` 的每种状态对应的图片。需要设置 `entity`。
- `state_filter`（映射）：`entity` 的每种状态对应的 CSS 滤镜。
- `aspect_ratio`（字符串）：图片的形状，例如 `16x9` 或 `50%`。
- `fit_mode`（字符串）：`cover`、`contain` 或 `fill`。默认为 `cover`。
- `show_state`（布尔值）：在每个图标下方显示状态。默认为 `false`。
- `force_dialog`（布尔值）：让每个图标都打开更多信息对话框。默认为 `false`。
- `theme`（字符串）：应用于卡片的主题。
- `tap_action`、`hold_action`、`double_tap_action`（操作）：选择、长按或双击图片时发生的行为。

```yaml
type: picture-glance
title: "Living room"
image: "/local/living_room.jpg"
entities:
  - light.living_room_lamp
  - media_player.living_room_speaker
  - sensor.living_room_temperature
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-picture-glance-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-glance-card.ts)，元素为 `<hui-picture-glance-card>`。图片是一个 `<hui-image>`，每个图标是一个内含 `<ha-state-icon>` 的 `<ha-icon-button>`。实体是否可切换取决于 [`src/common/const.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/const.ts) 中的 `DOMAINS_TOGGLE`。当实体处于活动状态时，图标会获得 `state-on` 类。颜色来自 `--ha-picture-icon-button-color` 和 `--ha-picture-icon-button-on-color`，图标栏来自 `--ha-picture-card-background-color` 和 `--ha-picture-card-text-color`。

在没有 `entities`、没有任何图片来源，或者设置了 `state_image` 但没有设置 `entity` 的情况下，卡片会抛出 `Invalid configuration`。它没有自己的网格选项：在分区（sections）视图中，它会占据全部 12 列，其高度随图片而定。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-glance-card.ts)
