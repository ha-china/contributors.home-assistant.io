# 错误与消息

> Home Assistant 如何告知用户发生了问题或一切正常。警报（alert）、Toast 提示和修复（repair），以及何时使用哪一种。

Source: https://www.hasscn.top/contributors/design/patterns/errors/

智能家居中总会出现问题：设备离线、密码被更改、数值超出范围。界面如何表达这些问题，决定了用户是短暂困惑还是能快速修复。好消息也是如此：用户希望知道他们的更改已保存。

## 何时使用

根据消息需要停留的时间长短，以及需要与问题有多近的距离来选择消息类型：

- **关于某个字段**：在该字段处显示错误。参见[表单与校验](https://www.hasscn.top/contributors/design/patterns/forms/)。
- **关于用户正在查看的页面或对话框**，且在问题解决前一直显示：使用[警报（alert）](https://www.hasscn.top/contributors/design/components/alert/)。
- **对已发生事情的简短确认**，例如“已成功保存”：使用屏幕底部的 Toast 提示。它会自动消失。
- **需要用户做出决定后才能继续**：使用[对话框（dialog）](https://www.hasscn.top/contributors/design/components/dialog/)。参见[确认与撤销](https://www.hasscn.top/contributors/design/patterns/confirmations/)。
- **设置中需要用户修复的问题**，即使用户当前没有查看：使用由集成（integration）发起的修复（repair）。它会显示在**设置** > **系统** > **修复**下。

## 工作原理

### 警报

警报有四种类型之一。每种类型都有自己的颜色和图标，因此即使没有颜色也能清楚区分类型。

Live demo of `ha-alert`.

```html
<ha-alert alert-type="error">设备没有响应。请检查它是否已通电。</ha-alert>
<ha-alert alert-type="warning">此集成将在未来的版本中停止工作。</ha-alert>
<ha-alert alert-type="info">更改将在重启后生效。</ha-alert>
<ha-alert alert-type="success">备份已完成。</ha-alert>
```

- 警报可以有标题。不要只使用标题而不附描述。
- 警报可以是可关闭的，或者带有一个操作，例如立即修复问题的按钮。

Live demo of `ha-alert`, `ha-button`.

```html
<ha-alert alert-type="warning">
  此账户的令牌已过期。
  <ha-button slot="action">重新认证</ha-button>
</ha-alert>
```

### Toast 提示

Toast 提示是屏幕底部的简短消息。它至少停留四秒钟，并且可以带有一个操作，例如**撤销**。当用户无需对其采取行动时，用它来对用户刚刚执行的操作提供反馈。

例如，在自动化编辑器中，删除一个构建块时会显示**已成功删除**，并带有**撤销**按钮。

Toast 提示会消失。绝不要把用户必须阅读才能修复问题的内容放在 Toast 提示中。

### 修复

当出现用户可以修复的问题时，集成会发起一个[修复（repair）](https://www.hasscn.top/contributors/glossary/repair/)。修复会：

- 说明问题是什么，以及为什么重要
- 提供修复问题的确切步骤，如果有多个步骤则使用编号列表
- 说明按照步骤操作后会有什么结果
- 只针对用户真正能够解决的问题发起

修复的文本来自集成。[Core](https://www.hasscn.top/contributors/core/) 部分介绍了如何发起修复。

### 来自操作的错误

当操作失败时，例如打开一盏没有响应的灯，集成会引发一个错误，其消息会显示在界面中。集成可以像翻译其他文本一样翻译该消息。

## 编写消息

一条好的消息会说明发生了什么，以及用户可以如何处理。此模式中的每种消息类型都遵循相同的 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/messages/)指南。

## 无障碍

- 警报具有 `role="alert"`。大多数屏幕阅读器会在它出现时立即播报。页面加载时已经存在的警报通常不会被播报。
- Toast 提示具有 `role="status"`，播报时不会打断用户。
- 仅凭颜色绝不能表示这是错误。图标和文本也要能表达这一点。
- 警报中的操作必须可以通过键盘访问。

## 组件

- [警报](https://www.hasscn.top/contributors/design/components/alert/)
- [对话框](https://www.hasscn.top/contributors/design/components/dialog/)
- [表单](https://www.hasscn.top/contributors/design/components/form/)，用于字段处的错误
- [进度按钮](https://www.hasscn.top/contributors/design/components/progress-button/)，用于单个操作的结果

## 代码实现

```ts
html`
  <ha-alert alert-type="error">
    ${this.hass.localize("ui.example.error")}
  </ha-alert>
`;

showToast(this, {
  message: this.hass.localize("ui.common.successfully_saved"),
});
```

`showToast()` 位于 [`src/util/toast.ts`](https://github.com/home-assistant/frontend/blob/dev/src/util/toast.ts) 中。低于四秒的持续时间会被提升为四秒。传入一个带有 `text` 和 `action` 回调的 `action` 即可添加类似**撤销**的按钮。
