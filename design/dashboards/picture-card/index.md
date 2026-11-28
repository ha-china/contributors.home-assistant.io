# 图片卡片

> 图片卡片显示一张图片，并且可以在你选中它时执行操作，比如打开另一个视图。

Source: https://www.hasscn.top/contributors/design/dashboards/picture-card/

## 用法

图片卡片显示一张单独的图片，铺满边缘，带有圆角，没有其他内容：没有标题、没有名称、没有状态。它是最简单的卡片。可以用它为仪表盘（dashboard）增添一些个性，比如在某个区域（area）的分区上方放一张房间的照片，或者制作一个指向另一个视图的大尺寸可视化链接。

本页面没有实时示例。本网站的演示之家没有可展示的图片或摄像头。

默认情况下，选中图片不会执行任何操作。为它设置一个 `tap_action`，可以把它变成链接或按钮，比如用 `navigate` 打开某个房间的视图。只有这样，卡片才会显示指针光标，并可以通过键盘访问。

当图片需要显示某个实体（entity）的相关信息时，请选择其他卡片：

- [图片实体卡片](https://www.hasscn.top/contributors/design/dashboards/picture-entity-card/) 在图片上方显示一个实体的名称和状态。
- [图片速览卡片](https://www.hasscn.top/contributors/design/dashboards/picture-glance-card/) 在底部添加一排实体图标。
- [图片元素卡片](https://www.hasscn.top/contributors/design/dashboards/picture-elements-card/) 可以在图片的任意位置放置图标、标签和按钮，比如在平面图上。

### 图片实体

卡片可以使用 `image_entity` 从实体获取图片，而不是使用固定图片。这适用于图片实体（image entity，许多集成都提供），也适用于人员（person）实体，卡片会显示其头像。图片会跟随实体：当图片实体获得新图片时，卡片会显示它。使用图片实体时，选中卡片会打开其更多信息对话框，除非你设置了其他 `tap_action`。

### 内容

- 当图片有含义或作为链接时，务必设置 `alt_text`。屏幕阅读器没有其他信息可依据。使用 `image_entity` 时，实体的名称是备选内容。
- 选择在浅色和深色主题下都能正常显示的图片。卡片会按原样显示图片。
- 图片会占据其分区的全部宽度，高度由图片决定。非常高的图片会把下方的所有内容都推下去，所以使用前请先裁剪。

## 配置

- `image`（字符串或媒体）：要显示的图片，可以是 URL 或媒体源项目。必填，除非你设置了 `image_entity`。
- `image_entity`（字符串）：用于获取图片的图片实体或人员实体。
- `alt_text`（字符串）：图片的替代文本。默认为 `image_entity` 的名称（如果有的话）。
- `theme`（字符串）：应用于卡片的主题。
- `tap_action`（操作）：选中卡片时发生的事情。有 `image_entity` 时默认为 `more-info`，没有时默认为 `none`。
- `hold_action`、`double_tap_action`（操作）：长按或双击时发生的事情。默认为 `none`。

```yaml
type: picture
image: "/local/living_room.jpg"
alt_text: "Living room"
tap_action:
  action: navigate
  navigation_path: "/lovelace/living-room"
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-picture-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-card.ts)，元素为 `<hui-picture-card>`。它是一个 `<ha-card>` 内的普通 `<img>`，通过 `overflow: hidden` 实现圆角。与其他图片卡片不同，它不使用 `<hui-image>`，因此没有状态图片、滤镜或宽高比功能。

该卡片没有自己的网格选项。在分区视图中，它会占据全部 12 列，高度由图片决定。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-picture-card.ts)
