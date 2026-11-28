# 数字（Number）

> 设备的数字（number）实体的更多信息视图，即状态行中的滑块或数字输入框。

Source: https://www.hasscn.top/contributors/design/more-info/number/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="number.living_room_speaker_bass"></ha-demo-more-info>
```

## 显示内容

数字（number）实体是设备中接受数字的设置项，例如扬声器的低音或运动传感器的灵敏度。与[输入数字](https://www.hasscn.top/contributors/design/more-info/input-number/)辅助元素（helper）一样，它们没有采用较新的更多信息设计。控件位于对话框顶部的状态行中：左侧是图标和名称，右侧是控件。

集成会决定数字的模式：

- **滑块（Slider）**：一个[滑块](https://www.hasscn.top/contributors/design/components/slider/)，旁边显示数值。上面客厅扬声器的低音以滑块形式从 -10 到 10。
- **输入框（Box）**：一个数字[文本输入框](https://www.hasscn.top/contributors/design/components/input/)，末尾显示单位。
- **自动（Auto）**：当取值范围的步数有限时显示滑块，当步数太多、不适合用滑块选择时显示输入框。

在状态行下方，对话框会显示该实体的历史记录及其活动。演示中仅显示状态行。

## 设计说明

- 滑块和输入框使用设备报告的最小值、最大值和步长。
- 新值会在你松开滑块时，或在输入框中确认时发送。
- 当实体不可用时，滑块和输入框将被禁用。

## 代码实现

状态行是 [`src/state-summary/state-card-number.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-number.ts) 中的 `state-card-number`。是否显示滑块由 [`src/data/number.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/number.ts) 中的 `showNumberSlider` 决定。没有 `more-info-number`：该域名位于 [`src/dialogs/more-info/const.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/const.ts) 的 `DOMAINS_HIDE_DEFAULT_MORE_INFO` 中。

源码：[`state-card-number.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-number.ts)
