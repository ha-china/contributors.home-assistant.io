# 太阳

> 太阳的更多信息视图，包含下一次日出和日落、高度角和方位角。

Source: https://www.hasscn.top/contributors/design/more-info/sun/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="sun.sun"></ha-demo-more-info>
```

## 显示内容

太阳实体（entity）会告诉你太阳的位置，以及它接下来会做什么。其视图是状态行下方的一个简短列表，显示太阳是**在地平线以上**还是**在地平线以下**。

- **日出**和**日落**：下一次日出和日落的时间，左侧是距离发生的剩余时间，右侧是具体时间。先发生的排在前面。
- **高度角**：太阳在地平线以上的高度，以度为单位。
- **方位角**：太阳的罗盘方向，以度为单位。

图中的太阳将在几小时后落下，因此**日落**排在**日出**之前。

## 设计说明

- 时间遵循用户的时间格式，例如 24 小时制或上午/下午。
- 按接下来发生的事情排序，可以将最有用的信息放在最上面，这样你就不会在今晚的日落之前先读到明天的日出。
- 太阳没有较新的更多信息设计，因此对话框在顶部显示状态行，与[人员（person）](https://www.hasscn.top/contributors/design/more-info/person/)视图类似。

## 代码实现

该视图位于 [`src/dialogs/more-info/controls/more-info-sun.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-sun.ts) 中的 `more-info-sun`。

源码：[`more-info-sun.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-sun.ts)
