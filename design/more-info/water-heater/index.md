# 热水器

> 热水器的更多信息视图，带有一个用于目标温度的圆形表盘，以及用于运行模式和离家模式的菜单。

Source: https://www.hasscn.top/contributors/design/more-info/water-heater/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="water_heater.water_heater"></ha-demo-more-info>
```

## 显示内容

主要控件是水的目标温度，位于[气候](https://www.hasscn.top/contributors/design/more-info/climate/)和[加湿器](https://www.hasscn.top/contributors/design/more-info/humidifier/)视图也使用的圆形表盘上：即[圆形滑块控件](https://www.hasscn.top/contributors/design/components/controls/)。圆环上的一个点标记当前温度。

表盘内部有 **Target**（目标）标签、以大号数字显示的目标温度，以及一个减号按钮和一个加号按钮。当前温度以小标签的形式显示在表盘上方。

表盘下方是一排菜单，包含次要设置。每个菜单仅在该热水器支持时才会显示：

- **Mode**（模式），包含设备的运行模式，例如 **Eco**（节能）、**Electric**（电加热）、**Heat pump**（热泵）和 **Performance**（高性能）。上方显示的热水器处于节能模式，因此这就是它的状态。
- 离家模式（away mode），开或关，带有一个小人图标，开启时小人会走开。

## 设计说明

- 热水器的模式就是它的状态。菜单会改变状态，菜单上的标签会显示该状态。
- **Mode**（模式）选项按固定顺序排序，而不是设备报告的顺序。
- 当设备不支持目标温度时，表盘会变成一个只读的圆环，显示当前温度和状态，且没有按钮。
- 表盘采用状态对应的颜色，当热水器关闭时变为灰色。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-water_heater.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-water_heater.ts) 中的 `more-info-water_heater`。表盘是 [`src/state-control/water_heater/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/water_heater) 中的 `ha-state-control-water_heater-temperature`。`WaterHeaterEntityFeature` 枚举和模式的排序规则位于 [`src/data/water_heater.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/water_heater.ts) 中。

源码：[`more-info-water_heater.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-water_heater.ts)
