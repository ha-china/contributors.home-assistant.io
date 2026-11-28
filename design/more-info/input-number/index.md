# 数字输入辅助元素

> 数字辅助元素（number helper）、滑块或数字输入框在状态行中的更多信息视图。

Source: https://www.hasscn.top/contributors/design/more-info/input-number/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="input_number.comfort_temperature"></ha-demo-more-info>
<ha-demo-more-info entity="input_number.vacation_days"></ha-demo-more-info>
```

## 显示内容

数字辅助元素（`input_number`）没有采用较新的更多信息设计。它的控件位于对话框顶部的状态行中：左侧是图标和名称，右侧是控件。

控件遵循辅助元素上设置的显示模式：

- **滑块**：一个[滑块](https://www.hasscn.top/contributors/design/components/slider/)，旁边显示数值和单位。舒适温度使用滑块，范围为 15 到 25 °C，步长为 0.5。
- **输入框**：一个数字[文本输入框](https://www.hasscn.top/contributors/design/components/input/)，末尾显示单位。假期天数使用输入框。

在状态行下方，对话框会显示该辅助元素的历史记录和活动，就像任何没有自己视图的实体（entity）一样。这些演示仅显示状态行。

## 设计说明

- 滑块和输入框使用辅助元素的最小值、最大值和步长。
- 新值会在你松开滑块或确认输入框时发送，而不是在每次按键时发送。
- 当辅助元素不可用时，滑块和输入框将被禁用。
- 设备的[数字](https://www.hasscn.top/contributors/design/more-info/number/)实体会获得相同的状态行。

## 代码实现

状态行是 [`src/state-summary/state-card-input_number.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-input_number.ts) 中的 `state-card-input_number`。没有 `more-info-input_number`：该域（domain）位于 [`src/dialogs/more-info/const.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/const.ts) 的 `DOMAINS_HIDE_DEFAULT_MORE_INFO` 中，因此对话框仅显示状态行和历史记录。

源码：[`state-card-input_number.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-input_number.ts)
