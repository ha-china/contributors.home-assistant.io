# 阀门

> 水阀或气阀的更多信息视图，包含开和关的开关、按钮或位置滑块。

Source: https://www.hasscn.top/contributors/design/more-info/valve/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="valve.garden_irrigation"></ha-demo-more-info>
```

## 显示内容

阀门（valve）的工作方式与[卷帘（cover）](https://www.hasscn.top/contributors/design/more-info/cover/)非常相似，其视图遵循相同的规则。主要控件取决于阀门支持的功能：

- **仅支持开和关**：一个大的垂直[控制开关](https://www.hasscn.top/contributors/design/components/controls/)，带有打开和关闭阀门的图标。上面的花园灌溉阀门就是这样工作的。
- **停止**：能够中途停止的阀门会改为显示一列[控制按钮](https://www.hasscn.top/contributors/design/components/controls/)，分别为**打开**、**停止**和**关闭**。
- **位置**：可以设置位置的阀门会显示一个高大的垂直[控制滑块](https://www.hasscn.top/contributors/design/components/controls/)。

同时支持位置和按钮的阀门会两者都显示，在主控件下方有两个圆形按钮，用于在位置模式和按钮模式之间切换。

顶部的状态将状态和位置组合在一起，例如**打开 · 40%**，当没有可附加的信息时则省略位置。

## 设计说明

- 图标遵循阀门的设备类型（device class），例如水或气。
- 阀门没有倾斜功能，因此没有像卷帘那样的十字形按钮。
- 支持位置的阀门可以在控件下方显示常用位置。这些位置来自实体（entity）设置，不属于这些演示的一部分。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-valve.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-valve.ts) 中的 `more-info-valve`。主要控件位于 [`src/state-control/valve/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/valve) 中：`ha-state-control-valve-toggle`、`ha-state-control-valve-buttons` 和 `ha-state-control-valve-position`。常用位置位于 [`src/dialogs/more-info/components/valves/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components/valves) 中。`ValveEntityFeature` 枚举位于 [`src/data/valve.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/valve.ts) 中。

源码：[`more-info-valve.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-valve.ts)
