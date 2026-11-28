# 割草机

> 机器人割草机的更多信息视图，带有动画状态图片以及启动、停止和回充电座的按钮。

Source: https://www.hasscn.top/contributors/design/more-info/lawn-mower/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="lawn_mower.lawn_mower"></ha-demo-more-info>
```

## 显示内容

割草机视图是[吸尘器](https://www.hasscn.top/contributors/design/more-info/vacuum/)视图的姊妹视图。两者都是能自主完成工作的机器人，因此都显示机器人的图片，并在图片下方显示一排命令，而不是滑块或开关。

图片是一幅机器人割草机的绘图，会随状态变化：割草中、返回中、已暂停、已停靠或出现错误。它会采用相应状态的颜色。

图片下方是一组[控制按钮](https://www.hasscn.top/contributors/design/components/controls/)，包含各种命令。每个按钮仅在割草机支持相应功能时才会显示：

- **开始割草**或**暂停**，合并在一个按钮中。当割草机正在割草且可以暂停时显示暂停，否则显示开始。
- **停止**。
- **返回充电座**。

顶部的状态是割草机的状态，例如**已停靠**。当设备带有电池传感器时，电池电量会显示在时间旁边，与吸尘器一样。这个模拟家庭中的割草机没有电池传感器，所以在这里看不到。

## 设计说明

- 当前无意义的按钮会被禁用。上方的割草机已停靠，因此**停止**和**返回充电座**呈灰色。
- 与吸尘器不同，割草机视图在按钮下方没有次要设置。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-lawn_mower.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-lawn_mower.ts) 中的 `more-info-lawn_mower`。图片是 [`src/state-control/lawn_mower/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/lawn_mower) 中的 `ha-state-control-lawn_mower-status`。`LawnMowerEntityFeature` 枚举以及 `canDock` 等辅助函数位于 [`src/data/lawn_mower.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/lawn_mower.ts) 中。

源码：[`more-info-lawn_mower.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-lawn_mower.ts)
