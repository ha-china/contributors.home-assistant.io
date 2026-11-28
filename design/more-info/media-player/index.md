# 媒体播放器

> 扬声器、电视或其他媒体播放器的更多信息视图，布局类似音乐应用。

Source: https://www.hasscn.top/contributors/design/more-info/media-player/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="media_player.living_room_speaker"></ha-demo-more-info>
<ha-demo-more-info entity="media_player.living_room_tv"></ha-demo-more-info>
```

## 显示内容

媒体播放器视图看起来像音乐应用的正在播放界面，因为人们在控制播放内容时最熟悉这种样式。从上到下依次为：

- **封面图**：正在播放内容的图片，例如专辑封面。如果没有封面，则显示一个带音符的灰色方块。
- **标题和艺术家**：媒体的标题，下方一行显示艺术家或其他详细信息。当内容过长无法完整显示时，两者会缓慢滚动，使用[跑马灯文本](https://www.hasscn.top/contributors/design/components/marquee-text/)。
- **进度**：一个[滑块](https://www.hasscn.top/contributors/design/components/slider/)，下方显示当前进度和总时长。当播放器支持时，可以拖动它来跳转。只有当媒体有时长信息时才会显示。
- **播放控制**：上一曲和下一曲，中间是一个大的实心播放或暂停[按钮](https://www.hasscn.top/contributors/design/components/button/)。当播放器支持时，重复和随机播放位于两端。
- **音量**：一个静音按钮和一个音量滑块。只支持步进调节音量的播放器则显示音量减小和音量增大按钮。
- **更多操作**：一排图标按钮，用于浏览媒体、加入其他扬声器、选择音源和声音模式，以及打开或关闭播放器。

扬声器正在播放音乐。电视处于关闭状态：只显示空的封面，以及选择音源和打开电源的按钮。

## 设计说明

- 此视图顶部没有大的状态显示。封面图、标题和播放按钮已经足以说明当前状况。
- 每个控件都会检查播放器支持的功能。播放器不支持的功能会被省略。在播放按钮周围，缺失的控件会留出空位，因此播放和暂停始终保持在中心位置。
- 音量控件只在播放器开启时显示，因为关闭时没有声音可听。
- 音源和声音模式按钮会打开一个[下拉菜单](https://www.hasscn.top/contributors/design/components/dropdown/)，并选中当前选项。
- 当一个扬声器与其他扬声器分组时，加入按钮会显示一个小徽标，标明组内扬声器的数量。
- 当播放器不可用时，视图只显示带有状态的空封面，不显示任何控件。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-media_player.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-media_player.ts) 中的 `more-info-media_player`。显示哪些播放按钮由 [`src/data/media-player.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/media-player.ts) 中的 `computeMediaControls` 决定。相关功能定义在 [`src/data/feature/media-player_entity_feature.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/feature/media-player_entity_feature.ts) 中。

源码：[`more-info-media_player.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-media_player.ts)
