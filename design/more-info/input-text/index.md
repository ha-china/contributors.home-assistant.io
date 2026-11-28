# 文本输入辅助元素

> 文本辅助元素（text helper）的更多信息视图，即状态行中的一个文本输入框。

Source: https://www.hasscn.top/contributors/design/more-info/input-text/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="input_text.welcome_message"></ha-demo-more-info>
```

## 显示内容

文本辅助元素（`input_text`）保存一段简短的文本，例如上方的欢迎消息。它没有采用较新的更多信息（more-info）设计。它的控件位于对话框顶部的状态行中：左侧是图标和名称，右侧是一个包含当前文本的[文本输入框](https://www.hasscn.top/contributors/design/components/input/)。

在状态行下方，对话框显示该辅助元素的历史记录及其活动。此演示仅显示状态行。

## 设计说明

- 该输入框遵循辅助元素的设置：最小和最大长度、文本必须匹配的模式，以及模式类型。在密码模式下，文本会被隐藏。
- 当文本为空时，输入框会显示占位符，因此看起来不会像是出了问题。
- 新文本会在你确认输入框时保存，且仅在其发生更改时保存。仅输入内容不会发送任何东西。

## 代码实现

状态行是 [`src/state-summary/state-card-input_text.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-input_text.ts) 中的 `state-card-input_text`。不存在 `more-info-input_text`：该域（domain）位于 [`src/dialogs/more-info/const.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/const.ts) 的 `DOMAINS_HIDE_DEFAULT_MORE_INFO` 中，因此对话框仅显示状态行和历史记录。

源码：[`state-card-input_text.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-input_text.ts)
