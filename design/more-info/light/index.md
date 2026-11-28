# 灯

> 灯的更多信息视图，带有一个大亮度滑块以及颜色和色温开关。

Source: https://www.hasscn.top/contributors/design/more-info/light/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="light.living_room_lamp"></ha-demo-more-info>
```

## 展示内容

灯的主要控制是亮度，因为这是人们最常调整的内容。它是一个高大的垂直[控制滑块](https://www.hasscn.top/contributors/design/components/controls/)，像玻璃杯一样从底部向上填充。当灯具有颜色时，滑块会采用该颜色，并略微调淡，以便非常浅的颜色仍然可见。

顶部的状态显示亮度，例如 **71%**，而不是仅仅显示 **On**。当灯处于关闭状态或没有亮度时，则显示常规状态。

视图显示的内容取决于灯支持的颜色模式（color modes）：

- **仅开和关**：没有滑块。取而代之的是一个大的开关，图标分别是点亮和未点亮的灯泡。
- **亮度**：滑块，其下方有一个 **Toggle** 按钮用于打开或关闭灯。
- **色温**：一个按钮，可将主控制切换为色温滑块，从暖色到冷色。
- **颜色**：一个按钮，可将主控制切换为色轮。带有额外白色通道（RGBW 或 RGBWW）的灯还会在色轮下方显示颜色亮度和白色亮度的滑块。
- **白色**：一个 **Set white** 按钮，适用于具有独立白色通道的灯。

上图的落地灯支持颜色和色温，因此它拥有全部三个按钮：亮度、颜色和色温。下图的走廊灯仅支持调光，因此它只有滑块和 **Toggle** 按钮。厨房吸顶灯也支持调光，但它处于关闭状态：滑块为空且没有滑块手柄。

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="light.hallway"></ha-demo-more-info>
<ha-demo-more-info entity="light.kitchen_ceiling"></ha-demo-more-info>
```

当灯支持效果（effects）时，控制项下方会出现一个 **Effect** 菜单。支持颜色或色温的灯还可以在按钮下方显示一行收藏颜色，只需轻点一下即可使用。这些颜色来自实体（entity）设置，不属于这些演示的一部分。

## 设计说明

- 主控制会变化，但其位置保持不变。一排圆形按钮在亮度、颜色和色温之间切换，选中的按钮会高亮显示。
- 颜色和色温按钮显示一个小的色轮和一个从暖到冷的渐变，而不是图标。你在阅读标签之前就能认出它们。
- 按钮行中的分隔符将切换按钮与模式按钮分开，也将模式按钮与 **Set white** 分开。
- 当灯不可用时，滑块和所有按钮都会被禁用，但它们仍保留在原位，因此布局不会跳动。
- 在灯组中，成员灯会以磁贴卡片（tile cards）的形式显示在控制项下方。它们的磁贴跟随主控制：亮度滑块、色温滑块，或者当组设置为颜色时没有控制项。

## 代码中

该视图是 [`src/dialogs/more-info/controls/more-info-light.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-light.ts) 中的 `more-info-light`。亮度滑块是 [`src/state-control/light/`](https://github.com/home-assistant/frontend/tree/dev/src/state-control/light) 中的 `ha-state-control-light-brightness`。色轮和色温滑块是 `light-color-rgb-picker` 和 `light-color-temp-picker`，收藏颜色是 `ha-more-info-light-favorite-colors`，它们都位于 [`src/dialogs/more-info/components/lights/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components/lights) 中。颜色模式和功能位于 [`src/data/light.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/light.ts) 中。

Source: [`more-info-light.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-light.ts)
