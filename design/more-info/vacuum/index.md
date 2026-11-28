# 吸尘器

> 扫地机器人的更多信息视图，带有动态状态图片和一排命令按钮。

Source: https://www.hasscn.top/contributors/design/more-info/vacuum/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="vacuum.robot_vacuum"></ha-demo-more-info>
```

## 展示内容

扫地机器人（robot vacuum）大多自主运行。你不需要操控它，只需要向它发送命令。因此这个视图的主体部分不是滑块或开关，而是一张显示机器人正在做什么的图片，下方是一排命令按钮。

这张图片是一个俯视视角的扫地机器人绘图。它会随状态变化：清扫时它会移动并且刷子旋转，而在停靠、返程、暂停或出错时看起来不同。它会呈现该状态的颜色。当有人要求系统减少动态效果时，图片会保持静止。

在图片下方，一组[控制按钮](https://www.hasscn.top/contributors/design/components/controls/)承载着各种命令。每个按钮只在该吸尘器支持时才显示：

- **开始**或**暂停**，合并在一个按钮中，可在两者之间切换。
- **停止**。
- **返回基站**。
- **定位**，让机器人发出提示音。
- **定点清扫**。

在按钮下方，一行放置次要设置：一个**风速**菜单，以及一个供支持清扫特定区域的吸尘器使用的**清扫：按区域**按钮。该按钮会打开一个视图，你可以在其中选择要清扫的区域。

顶部的状态显示吸尘器报告的状态（如果它有报告的话）。在时间旁边，当设备有电池传感器时，会以图标显示电池电量。上方的吸尘器已停靠且电量已充满。

## 设计说明

- 当前无意义的按钮会被禁用。上方的吸尘器已停靠，因此**停止**按钮呈灰色。已经在返程中的吸尘器无法再次被发送返程。
- 不报告自身状态的旧款吸尘器会得到一个合并的开始和暂停按钮，带有播放和暂停图标。
- 电池信息来自同一设备的电池传感器，而不是吸尘器实体（entity）本身。当设备有充电传感器时，图标也会显示充电状态。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-vacuum.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-vacuum.ts) 中的 `more-info-vacuum`。图片是 [`src/state-control/vacuum/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/vacuum) 中的 `ha-state-control-vacuum-status`。按区域清扫视图位于 [`src/dialogs/more-info/components/vacuum/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components/vacuum)。`VacuumEntityFeature` 枚举以及 `canReturnHome` 等辅助函数位于 [`src/data/vacuum.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/vacuum.ts) 中。

源码：[`more-info-vacuum.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-vacuum.ts)
