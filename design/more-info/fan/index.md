# 风扇

> 风扇的更多信息视图，包含速度控制以及用于预设、风向和摆头的菜单。

Source: https://www.hasscn.top/contributors/design/more-info/fan/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="fan.bedroom_fan"></ha-demo-more-info>
```

## 显示内容

风扇的主要控制是它的速度。具体呈现的形态取决于风扇有多少档速度：

- **超过 5 档速度**：显示一个高大的垂直[控制滑块](https://www.hasscn.top/contributors/design/components/controls/)用于调节百分比，下方有一个电源按钮。上方的卧室风扇以 10% 为步进移动，因此它使用滑块。
- **5 档或更少**：显示一个垂直的[控制选择器](https://www.hasscn.top/contributors/design/components/controls/)，其中一个按钮用于关闭，其余每个速度各一个按钮。最多 3 档速度的风扇会显示名称和图标，例如**关闭**、**低速**、**中速**和**高速**。4 或 5 档速度的风扇则显示数字。
- **无速度控制**：显示一个大的开/关开关，开启时显示风扇图标，关闭时显示划掉的风扇图标。

当风扇开启且有速度时，顶部的状态会显示它，例如 **40%**。当它关闭时，则显示**关闭**。

在主控制下方，有一排菜单用于存放次要设置。每个菜单仅在风扇支持相应功能时才会显示：

- 预设模式，例如 auto 或 sleep。
- 风向，**正向**或**反向**。
- 摆头，开启或关闭。

## 设计说明

- 风扇滑块和速度按钮采用状态的颜色，因此运行中的风扇是有颜色的，而关闭的风扇是灰色的。
- 滑块会吸附到风扇支持的步进上，因此不会停留在风扇不具备的速度上。
- 电源按钮仅显示在滑块旁边，且仅在风扇可以开启和关闭时显示。使用速度按钮时，**关闭**本身就是其中一个档位，因此单独的按钮会重复表达同样的意思。
- 摆头菜单使用两个图标：开启时为来回摆动的箭头，关闭时为划掉的箭头。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-fan.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-fan.ts) 中的 `more-info-fan`。速度控制是 [`src/state-control/fan/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/fan) 中的 `ha-state-control-fan-speed`，无速度时的开关是 [`src/state-control/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control) 中的 `ha-state-control-toggle`。速度相关的辅助函数，如 `computeFanSpeedCount` 和 `FAN_SPEED_COUNT_MAX_FOR_BUTTONS`，以及 `FanEntityFeature` 枚举位于 [`src/data/fan.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/fan.ts) 中。

源码：[`more-info-fan.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-fan.ts)
