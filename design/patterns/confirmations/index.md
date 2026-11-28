# 确认与撤销

> 什么时候在执行操作前先询问，什么时候改为提供撤销，以及 Home Assistant 如何防止用户丢失未保存的更改。

Source: https://www.hasscn.top/contributors/design/patterns/confirmations/

有些操作无法撤回。删除仪表盘、删除备份、丢弃在自动化上花费一小时的工作成果。对于这些操作，Home Assistant 会先询问。对于可以撤销的操作，它则不打扰用户，并提供撤销功能。

## 何时使用

- **操作无法撤销**，比如删除某些东西：使用确认对话框进行询问。
- **操作可以立即撤销**：直接执行，并在 toast 中提供**撤销**。自动化编辑器在删除构建块时就是这样做的。
- **用户即将丢失未保存的更改**：询问是保存还是丢弃这些更改。

措辞在这里也很重要。**删除（Delete）**意味着永远消失，**移除（Remove）**意味着可以恢复。参见[移除、删除、添加或创建](https://www.hasscn.top/contributors/design/ui-text/remove-delete/)。

## 工作原理

### 确认对话框

确认对话框是一种[对话框](https://www.hasscn.top/contributors/design/components/dialog/)，包含标题、简短描述和两个按钮。

- **标题**：用户大多只读标题和按钮，所以要把重要的内容放在这里。如果没有标题，对话框会退回到“你确定吗？”，这完全没有说明会发生什么。
- **描述**：为不确定的用户解释将会发生什么。
- **按钮**：**取消**，以及一个说明其功能的主按钮：用**删除**，而不是**确定**。破坏性操作使用 danger 变体，因此按钮是红色的。
- **无法绕过**：确认对话框没有关闭按钮，点击对话框外部也不会关闭。用户必须在两个按钮中选择一个。

对话框指南中的示例：

> **删除仪表盘？**
>
> 仪表盘 Kitchen 将从 Home Assistant 中永久删除。
>
> **取消** / **删除**

Do and don't, as live demos.

**Do:** 按钮说明了会发生什么，红色表示该操作无法撤销。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button variant="danger">Delete</ha-button>
```

**Don't:** 一个通用的“确定”。用户必须阅读文字才能知道它会做什么。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button>OK</ha-button>
```

当操作具有破坏性时，焦点会落在**取消**上，这样条件反射地按下 <kbd>Enter</kbd> 也不会删除任何东西。对于其他确认操作，焦点会落在主按钮上。在操作执行期间，主按钮会显示忙碌状态。

### 撤销

有了撤销功能，用户可以一步完成想做的事，之后仍能改变主意。带有**撤销**的 [toast](https://www.hasscn.top/contributors/design/patterns/errors/#toasts) 至少会停留四秒钟。

### 未保存的更改

编辑器会跟踪自上次保存以来是否有更改。如果有：

- 离开编辑器时会先询问。例如，自动化编辑器会询问**保存更改？**：“你在此自动化中做了一些更改。你可以保存这些更改，或者丢弃它们并离开。此操作无法撤销。”
- 关闭或刷新浏览器标签页时会显示浏览器的警告。
- 包含已更改表单的对话框不会因按 Escape 或点击对话框外部而关闭，而是会轻微抖动一下。

## 无障碍

- 确认对话框会被播报为对话框，以其标题作为名称，并将其描述与之关联。
- 对话框打开时焦点会移入其中，对于破坏性操作，安全选项会获得焦点。
- danger 按钮的红色不是唯一的信号。按钮标签写的是**删除**。

## 组件

- [对话框](https://www.hasscn.top/contributors/design/components/dialog/)
- [按钮](https://www.hasscn.top/contributors/design/components/button/)，含 danger 变体
- [错误与消息](https://www.hasscn.top/contributors/design/patterns/errors/)，用于带撤销功能的 toast

## 代码实现

```ts
const confirmed = await showConfirmationDialog(this, {
  title: this.hass.localize("ui.example.delete_title"),
  text: this.hass.localize("ui.example.delete_text"),
  confirmText: this.hass.localize("ui.common.delete"),
  destructive: true,
});
```

`showConfirmationDialog()` 和 `showAlertDialog()` 位于 [`src/dialogs/generic/show-dialog-box.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/generic/show-dialog-box.ts) 中。当主按钮应在工作执行期间显示进度时，请传递 `action` 而不是等待结果。对于未保存的更改，编辑器使用 [`src/mixins/`](https://github.com/home-assistant/frontend/tree/dev/src/mixins) 中的 `DirtyStateProviderMixin` 和 `PreventUnsavedMixin`。
