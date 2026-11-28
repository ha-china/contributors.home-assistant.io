# 窗帘（Cover）

> 百叶窗、卷帘、车库门及其他窗帘类设备的更多信息视图，带有位置滑块或打开和关闭按钮。

Source: https://www.hasscn.top/contributors/design/more-info/cover/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="cover.bedroom_blinds"></ha-demo-more-info>
<ha-demo-more-info entity="cover.garage_door"></ha-demo-more-info>
```

## 显示内容

窗帘（cover）有多种类型，从可以停在任意位置的百叶窗到只能上下运行的车库门。该视图会根据窗帘的能力选择其主要控制方式。

- **位置**：可以设置位置的窗帘会显示一个高大的垂直[控制滑块](https://www.hasscn.top/contributors/design/components/controls/)。滑块从顶部向下填充，就像窗帘本身一样：完全关闭的百叶窗是一个完整的条。第一个演示中的卧室百叶窗就是这样工作的。
- **倾斜位置**：叶片可以倾斜到某个位置的窗帘会在旁边显示第二个滑块。它在类似叶片的条纹背景上显示一个标记，而不是填充。
- **按钮**：没有位置功能的窗帘会显示一列[控制按钮](https://www.hasscn.top/contributors/design/components/controls/)，包括**打开**、**停止**和**关闭**。第二个演示中的车库门就是这样工作的。还支持倾斜功能的窗帘会以十字形排列按钮，倾斜按钮在两侧，**停止**在中间。
- **仅打开和关闭**：可以打开和关闭但不能停止或倾斜的窗帘会显示一个大开关，带有打开和关闭窗帘的图标。

支持位置和按钮的窗帘会同时显示两者。主控件下方的两个圆形按钮可在位置模式和按钮模式之间切换。该视图默认从位置模式开始。

顶部的状态会结合状态和位置，例如**打开 · 70%**。当窗帘完全打开或关闭时，会省略位置，因此你看到的是**已关闭**，而不是**已关闭 · 0%**。

## 设计说明

- 图标遵循窗帘的设备类（device class），因此车库门显示车库图标，百叶窗显示百叶窗图标。
- 当前无意义的按钮会被禁用。上面的车库门是关闭的，因此**关闭**按钮呈灰色。
- 当集成（integration）无法得知窗帘的真实状态（假定状态）时，打开和关闭开关会变成两个独立的按钮，以便你始终可以发送这两种命令。
- 支持位置的窗帘可以在控件下方显示常用位置，一键即可到达。这些位置来自实体（entity）设置，不属于这些演示的一部分。
- 在窗帘组中，成员窗帘会以卡片（tile card）的形式显示在控件下方，每个都有自己的位置滑块。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-cover.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-cover.ts) 中的 `more-info-cover`。主要控件位于 [`src/state-control/cover/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/cover) 中：`ha-state-control-cover-position`、`ha-state-control-cover-tilt-position`、`ha-state-control-cover-buttons` 和 `ha-state-control-cover-toggle`。常用位置位于 [`src/dialogs/more-info/components/covers/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components/covers) 中。功能特性位于 [`src/data/feature/cover_entity_feature.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/feature/cover_entity_feature.ts) 中，位置辅助函数位于 [`src/data/cover.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/cover.ts) 中。

Source: [`more-info-cover.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-cover.ts)
