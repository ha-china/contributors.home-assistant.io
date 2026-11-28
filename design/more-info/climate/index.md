# 温控

> 恒温器或空调的更多信息视图，围绕圆形温度转盘构建。

Source: https://www.hasscn.top/contributors/design/more-info/climate/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="climate.thermostat"></ha-demo-more-info>
<ha-demo-more-info entity="climate.bedroom_air_conditioner"></ha-demo-more-info>
```

## 显示内容

温控（climate）实体的主要控制是目标温度，显示在一个圆形转盘上：即[圆形滑块控件](https://www.hasscn.top/contributors/design/components/controls/)。转盘的读法就像墙上的恒温器一样，它用一个形状同时呈现范围、当前值和目标值。圆环上的一个小圆点标记当前温度。

转盘内部从上到下依次是：

- 设备当前正在执行的操作，例如制热或制冷，并带有相应的颜色。当设备未报告任何操作时，标签会显示模式。
- 目标温度，以大号数字显示。
- 一个减号按钮和一个加号按钮，用于每次一步地调整目标温度。

转盘上方，以小标签的形式显示当前温度，以及设备报告时的当前湿度。此视图顶部没有大号状态显示：转盘已经说明了一切。

转盘下方，一排菜单承载着次要设置。**模式**始终存在，显示设备的 HVAC 模式，例如**关闭**、**制热**和**制冷**，每种模式都有自己的图标。其他菜单仅在设备支持时才显示：

- 预设，例如节能或离家。
- 风扇模式。
- 摆风模式，以及水平摆风模式。

恒温器正在制热，所以圆环是橙色的，并且已设置目标温度。空调支持风扇模式和摆风模式，所以它多了两个菜单。它处于关闭状态，所以转盘是灰色的且不可操作。

## 变体

- **目标温度范围**：将温度保持在低值和高值之间的设备会得到一个带有两个手柄的转盘。两个值都显示在中心，你可以选择其中一个，然后用按钮进行调整。低值手柄使用制热颜色，高值手柄使用制冷颜色。
- **目标湿度**：还能保持湿度水平的设备会在转盘下方得到两个圆形按钮，分别对应温度和湿度。它们可以在两个转盘之间切换主控制。
- **无目标**：仅报告温度的设备会得到一个只读的圆环，显示当前温度且没有按钮。

## 设计说明

- 颜色来自状态：制热是橙色，制冷是蓝色，设备关闭时圆环变为灰色。当前操作（例如制热中）会给转盘着色。
- 圆环的填充与模式相匹配。制热时从起点填充到目标值，制冷时从目标值填充到终点，这样你就能看到设备在目标值的哪一侧工作。仅制热或仅制冷的设备在**关闭**和**自动**模式下也保持这种填充。
- 小数位数遵循设备的步长。步长为半度的设备显示 **21.0**，而绝不会是 **21**。
- **模式**选项按固定顺序排序，而不是设备报告的顺序，这样每个恒温器都以相同的方式列出其模式。
- 转盘在你松手时发送新目标，而不是在拖动过程中。减号和加号按钮会在最后一次点击后等待一秒，因此连点三次加号只会发送一次更改，而不是三次。
- 使用范围时，低目标永远不会超过高目标，反之亦然。

## 代码实现

该视图位于 [`src/dialogs/more-info/controls/more-info-climate.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-climate.ts) 中的 `more-info-climate`。转盘是 [`src/state-control/climate/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/climate) 中的 `ha-state-control-climate-temperature` 和 `ha-state-control-climate-humidity`。菜单是 `ha-more-info-control-select-container` 中的[选择菜单](https://www.hasscn.top/contributors/design/components/select-menu/)。功能位于 [`src/data/feature/climate_entity_feature.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/feature/climate_entity_feature.ts)。

源码：[`more-info-climate.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-climate.ts)
