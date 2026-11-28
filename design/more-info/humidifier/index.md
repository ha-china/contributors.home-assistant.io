# 加湿器

> 加湿器或除湿器的更多信息视图，带有一个用于设定目标湿度的圆形转盘。

Source: https://www.hasscn.top/contributors/design/more-info/humidifier/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="humidifier.bedroom_humidifier"></ha-demo-more-info>
```

## 显示内容

主控件是目标湿度，位于与[气候（climate）](https://www.hasscn.top/contributors/design/more-info/climate/)视图相同的圆形转盘上：即[圆形滑块控件](https://www.hasscn.top/contributors/design/components/controls/)。所有“将房间保持在此数值”的设备都使用同一种形状，意味着人们只需学习一次。

在转盘内部，你可以看到设备当前正在执行的操作（例如加湿或除湿）、以大号数字显示的目标值，以及一个减号按钮和一个加号按钮。圆环上的一个圆点标记当前湿度，当前湿度也会以小标签的形式显示在转盘上方。

在转盘下方，一排菜单承载着次要设置：

- **状态（state）**，用于打开或关闭设备。它始终存在。
- **模式（mode）**，例如普通、节能、睡眠或强力。仅当设备支持模式时才会显示。

## 设计说明

- 与气候视图一样，加湿器没有大的开和关开关。打开或关闭设备是一个菜单项，这样转盘就能保持其作为主控件的位置。
- 转盘会采用状态和当前操作的颜色，当设备关闭时变为灰色。
- 加湿器从起点填充圆环至目标值。除湿器则从目标值填充到终点，因为它的工作是把湿度降下来。
- 当设备不报告当前湿度时，转盘上方的标签和圆环上的圆点会被省略。
- 模式菜单列出设备报告的模式，每个模式都有各自的图标。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-humidifier.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-humidifier.ts) 中的 `more-info-humidifier`。转盘是 [`src/state-control/humidifier/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/humidifier) 中的 `ha-state-control-humidifier-humidity`。`HumidifierEntityFeature` 枚举位于 [`src/data/humidifier.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/humidifier.ts) 中。

源码：[`more-info-humidifier.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-humidifier.ts)
