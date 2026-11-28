# 图片元素卡片

> 图片元素卡片可将图标、标签、徽章和按钮放置在图片上的任意位置，例如平面图上的灯具。

Source: https://www.hasscn.top/contributors/design/dashboards/picture-elements-card/

## 用法

图片元素卡片（picture elements card）是一张图片，上面叠加了各种元素。每个元素都位于你选择的位置上，以图片的百分比表示：客厅角落台灯的图标、窗户旁边的温度、一个关闭所有设备的按钮。人们常用它来制作平面图，或者在房间照片上标注设备的位置。

本页面没有实时示例。本网站的演示之家（demo home）中没有可展示的图片或摄像头。

它也是现有卡片中最自由的一种。布局完全由你自己决定，因此效果的好坏取决于构建它的人。当图片上的位置本身具有含义时（例如设备在房子中的位置），就可以使用它。如果没有这种含义，使用[图片概览卡片](https://www.hasscn.top/contributors/design/dashboards/picture-glance-card/)或一组[磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)会更容易制作，并且在各种屏幕尺寸上也更易用。

### 元素

- `state-icon`：实体的图标，根据其状态着色。点击它会打开更多信息对话框。
- `state-label`：以文本形式显示实体的状态或其某个属性，可带可选的 `prefix` 和 `suffix`。
- `state-badge`：以圆形标签徽章的形式显示实体的状态。
- `icon`：一个固定图标，用于与实体状态无关的操作。
- `image`：叠加在图片之上的图像，可以通过 `state_image` 和 `state_filter` 跟随实体的状态。可以用它绘制一盏点亮的灯。
- `action-button`：执行操作的文本按钮，例如 `light.turn_off`。旧名称 `service-button` 仍然可用。
- `conditional`：一组仅在条件满足时才显示的元素。

每个元素都可以接受一个 `style`，即一组 CSS 属性。使用 `top` 和 `left` 来定位。元素以该点为中心，因此 `top: 50%` 和 `left: 50%` 会把它放在图片的正中央。样式还可以对元素进行缩放、旋转或着色。

### 点击元素

图标和标签都很小，在元素密集的平面图上很难用手指点中。因此，卡片会将点击路由到最近的图标或标签，最远可达 24 像素。点击两盏灯之间的空隙会作用于距离最近的那盏，两个重叠的元素也不会再互相抢夺点击。

默认情况下，点击或长按元素会打开其实体的更多信息对话框。对于人们当作开关使用的元素（例如平面图上的灯），可将 `tap_action` 设置为 `toggle`。

### 深色模式

为浅色背景绘制的平面图在深色主题下会显得刺眼。使用 `dark_mode_image`，卡片会在深色主题下显示另一张图片。使用 `dark_mode_filter`，则会对同一张图片应用 CSS 滤镜，例如 `invert(1) hue-rotate(180deg)`。

### 内容

- 使用固定宽高比的图片，并以百分比放置元素。这样元素在任何屏幕尺寸上都能保持原位。
- 尽量让状态直接显示在图片上，例如使用状态图标或会点亮的图像。满是文字标签的平面图只是一张伪装成图片的表格。
- 保持元素足够大以便点击。在样式中使用 `--mdc-icon-size` 放大图标，而不是把它们放得更近。
- 为图标和按钮设置 `title`。它既是工具提示，也是屏幕阅读器使用的名称。

## 配置

- `elements`（列表，必填）：要放置的元素，每个元素包含一个 `type` 和一个 `style`。
- `image`（字符串或媒体）：图片。`image`、`image_entity`、`camera_image` 或 `state_image` 中必须提供其一。
- `image_entity`（字符串）：用于获取图片的图像实体（image）或人物实体（person）。
- `camera_image`（字符串）：作为图片显示的摄像头实体。
- `camera_view`（字符串）：`auto` 表示快照，`live` 表示实时流。默认为 `auto`。
- `entity`（字符串）：图片跟随的实体，用于 `state_image` 和 `state_filter`。
- `state_image`（映射）：`entity` 的每个状态对应的图片。需要设置 `entity`。
- `state_filter`（映射）：`entity` 的每个状态对应的 CSS 滤镜。
- `dark_mode_image`（字符串或媒体）：深色主题下使用的图片。
- `dark_mode_filter`（字符串）：深色主题下图片的 CSS 滤镜。
- `aspect_ratio`（字符串）：图片的形状，例如 `16x9` 或 `50%`。
- `title`（字符串）：图片上方的标题。
- `theme`（字符串）：应用于卡片的主题。

```yaml
type: picture-elements
image: "/local/floor_plan.png"
dark_mode_filter: "invert(1) hue-rotate(180deg)"
elements:
  - type: state-icon
    entity: light.living_room_lamp
    tap_action:
      action: toggle
    style:
      top: "30%"
      left: "20%"
  - type: state-label
    entity: sensor.living_room_temperature
    style:
      top: "40%"
      left: "20%"
  - type: action-button
    title: "All off"
    action: light.turn_off
    target:
      entity_id: all
    style:
      top: "90%"
      left: "85%"
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-picture-elements-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-elements-card.ts)，元素为 `<hui-picture-elements-card>`。图片是一个 `<hui-image>`。各元素位于 [`src/panels/lovelace/elements/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace/elements) 中，每种类型一个，例如 `<hui-state-icon-element>`，`create-styled-hui-element.ts` 会应用它们的 `style`。`action-button` 会创建为 `<hui-service-button-element>`。每个元素都通过 `transform: translate(-50%, -50%)` 进行绝对定位，这就是它以 `top` 和 `left` 为中心的原因。

将点击路由到最近元素的逻辑位于 [`src/panels/lovelace/cards/picture-elements/nearest-hit.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/picture-elements/nearest-hit.ts)。参与该机制的元素会设置 `delegatedActions`，并通过 `getHitInfo()` 报告其点击区域。

在没有图片来源时，卡片会抛出 `Image required`；在没有元素列表时，会抛出 `Elements required`。它没有自己的网格选项：在分区（sections）视图中，它会占据全部 12 列，其高度随图片而定。

[源码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-elements-card.ts)
