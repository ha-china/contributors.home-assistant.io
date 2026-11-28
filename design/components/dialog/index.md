# 对话框

> 对话框在您正在进行的操作之上，请求做出决定或输入内容。

Source: https://www.hasscn.top/contributors/design/components/dialog/

## 概述

对话框会打断用户。请将其用于需要立即关注的事项：确认、简短表单或选择。对于更大的内容，请使用页面。

前端的对话框基于 [Material Design 3](https://m3.material.io/components/dialogs/overview)，并包含本页所述的调整。

## 何时使用

在以下情况使用对话框：

- 确认某个操作，尤其是无法撤销的操作
- 简短的表单，例如重命名某个项目
- 用户必须做出选择才能继续

不要在以下情况使用对话框：

- 不会阻塞任何操作的消息。请使用[提醒（alert）](https://www.hasscn.top/contributors/design/components/alert/)。
- 需要比对话框更多空间的内容。请使用专用页面。
- 用户在页面上显示和隐藏的内容。请使用[展开面板（expansion panel）](https://www.hasscn.top/contributors/design/components/expansion-panel/)。

## 结构

1. **遮罩（Scrim）**：对话框背后的覆盖层
2. **表面（Surface）**：对话框本身，带有圆角和阴影
3. **关闭按钮**：位于标题栏左上角
4. **标题**：标题栏文本，其下方或上方可以有可选的副标题
5. **标题栏操作**：右上角可选的图标按钮，例如帮助或设置
6. **主体**：内容，当内容放不下时会滚动
7. **页脚**：按钮，位于右下角

当主体滚动时，标题栏下方会出现一条细线。

## 变体

### 标准对话框和提醒对话框

标准对话框带有带关闭按钮的标题栏。在小屏幕上，它会填满整个屏幕。

提醒对话框用于提醒和确认。在小屏幕上它仍保持为对话框，并保留其圆角。按照设计，它只有按钮，没有关闭按钮。将对话框设为提醒对话框本身并不会移除关闭按钮：前端的确认对话框自带不带关闭按钮的标题栏。

### 宽度

有四种宽度：小、中（默认）、大和全屏。请使用其中之一，除非有明确需要，否则避免自定义尺寸。

## 行为

- **打开**：对话框在 200 毫秒内以动画形式出现在遮罩之上。开启减弱动态效果后，它会立即出现。焦点会移动到被标记为接收焦点的元素，或对话框本身。
- **关闭**：关闭按钮、对话框中被标记为关闭按钮的按钮、<kbd>Escape</kbd> 键以及点击遮罩都会关闭对话框。随后焦点会返回到打开它的元素。
- **受保护的关闭**：当用户修改了对话框中的表单时，它不会因 <kbd>Escape</kbd> 键或点击遮罩而关闭。相反，它会轻微抖动（一个 250 毫秒的脉冲）。这可以防止意外丢失工作。确认对话框的工作方式相同。
- **滚动**：当内容放不下时主体会滚动，而对话框背后的页面不会滚动。
- **小屏幕**：当宽度不超过 450px 或高度不超过 500px 时，标准对话框会填满屏幕，且没有圆角。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 宽度，小 | 320px | `--ha-dialog-width-sm` |
| 宽度，中 | 580px | `--ha-dialog-width-md` |
| 宽度，大 | 1024px | `--ha-dialog-width-lg` |
| 宽度，全屏 | 屏幕的 95%，在安全区域内 | `--ha-dialog-width-full` |
| 最大高度 | 安全高度减去 80px | `--ha-space-20`，通过 `--ha-dialog-max-height` |
| 圆角 | 24px，小屏幕上的标准对话框为 0 | `--ha-border-radius-3xl`，通过 `--ha-dialog-border-radius` |
| 背景 | 卡片背景 | `--card-background-color`，通过 `--ha-dialog-surface-background` |
| 阴影 | 大阴影 | `--wa-shadow-l`，通过 `--dialog-box-shadow` |
| 标题栏最小高度 | 48px | `--ha-space-12` |
| 标题栏内边距 | 左右各 4px，较大屏幕上为 8px | `--ha-space-1`、`--ha-space-2` |
| 标题 | 20px，字重 500，行高 1.2 | `--ha-font-size-xl`、`--ha-font-weight-medium`、`--ha-line-height-condensed` |
| 副标题 | 14px，行高 1.6 | `--ha-font-size-m`、`--ha-line-height-normal` |
| 副标题颜色 | 次要文本颜色 | `--secondary-text-color` |
| 主体内边距 | 顶部为 0，其他各边为 24px | `--ha-space-6`，通过 `--dialog-content-padding` |
| 页脚内边距 | 顶部为 12px，其他各边为 16px | `--ha-space-3`、`--ha-space-4` |
| 页脚按钮之间的间距 | 12px | `--ha-space-3` |
| 打开和关闭动画 | 200 毫秒，减弱动态效果时为 0 毫秒 | `--ha-dialog-show-duration`、`--ha-dialog-hide-duration` |

## 指南

### 布局

- 保持对话框窄一些。设计指南规定宽度最多 560 像素，提醒对话框和确认对话框固定为 320 像素。代码并没有那么严格：默认宽度是 580 像素，确认对话框也使用该宽度。需要更多空间？请使用专用页面。
- 关闭按钮位于左上角，适用于所有屏幕尺寸。
- 额外的图标按钮，例如帮助、设置或展开，位于右上角。超过两个时，它们会进入溢出菜单。
- 主要操作与**取消**按钮一起分组在右下角。在移动设备上，全屏对话框会将这些按钮固定在底部。
- 提醒对话框和确认对话框只有按钮，没有关闭按钮。

### 关闭

- 每个带操作的对话框都有退出途径：在桌面端有**取消**按钮和关闭按钮，在移动端有关闭按钮。
- 当用户修改了对话框中的表单时，它不会因 Escape 键或点击对话框外部而关闭。这可以防止意外丢失工作。

### 按钮

Do and don't, as live demos.

**Do:** 将一个普通的取消按钮与一个主要操作组合在一起。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button>Save</ha-button>
```

**Don't:** 添加一个让任务未完成的第三个按钮。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button appearance="outlined">Save for later</ha-button>
<ha-button>Save</ha-button>
```

Do and don't, as live demos.

**Do:** 对破坏性操作使用 danger 变体。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button variant="danger">Delete</ha-button>
```

**Don't:** 对删除内容的操作使用品牌色。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button>Delete</ha-button>
```

- 保持标签简短：**保存**、**删除**、**启用**。
- 避免在一个对话框中使用三个按钮，尤其是当其中一个会让任务未完成时。

### 内容

人们主要阅读标题和按钮。把重要的内容放在那里。

- 始终为对话框提供标题。
- 避免在标题中使用用户输入的内容，例如名称。这可能会使标题长到难以阅读。
- 为不确定的用户使用描述：解释将会发生什么。
- 保持简短。

一个用于删除仪表盘（dashboard）的确认对话框：

> **删除仪表盘？**
>
> 仪表盘 Kitchen 将从 Home Assistant 中被永久删除。
>
> **取消** / **删除**

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 在对话框内移动焦点。对话框打开时，焦点保持在对话框内。 |
| <kbd>Escape</kbd> | 关闭对话框，除非关闭受到保护。此时对话框会抖动并保持打开。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 选中获得焦点的按钮，与任何按钮一样。 |

### 焦点

对话框打开时，焦点会移入其中：移到表单的第一个字段，或对话框本身。对话框关闭时，焦点会返回到之前拥有它的元素。对话框打开时，页面的其余部分无法被访问。

### 目标尺寸

关闭按钮是一个 48px × 48px 的图标按钮。

### 屏幕阅读器

对话框会被播报为对话框，其标题作为其名称。确认对话框还会朗读其描述。关闭按钮会以用户的语言播报为“关闭”。

### 在代码中

- 对话框是一个原生的 `<dialog>` 元素，以模态方式打开，因此它具有 `dialog` 角色，其背后的页面是惰性的。
- 焦点会移动到带有 `autofocus` 的元素。委托焦点的组件（例如 `<ha-form autofocus>`）会将其传递给它们的第一个字段。
- 可访问名称是 `header-title`，对于将标题放在插槽中的对话框，则是 `accessibleLabel`。
- 使用 `aria-describedby` 连接描述，就像确认对话框所做的那样。
- 关闭按钮以翻译后的标签 `ui.common.close` 作为其可访问名称。

## 相关内容

- [自适应对话框](https://www.hasscn.top/contributors/design/components/adaptive-dialog/)：在手机上变为底部弹层的对话框
- [按钮](https://www.hasscn.top/contributors/design/components/button/)：页脚中的按钮
- [提醒](https://www.hasscn.top/contributors/design/components/alert/)：不会阻塞任何操作的消息
- [表单](https://www.hasscn.top/contributors/design/components/form/)：对话框中的字段
- [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)：如何撰写标题和标签

## 代码实现

该元素是 `<ha-dialog>`。它基于 [Web Awesome dialog](https://webawesome.com/docs/components/dialog/)。在构建新对话框之前，请查看[前端仓库](https://github.com/home-assistant/frontend/tree/dev/src/dialogs)中现有的对话框。

通过触发 `show-dialog` 事件打开对话框，并让它自行加载：

```ts
fireEvent(this, "show-dialog", {
  dialogTag: "dialog-example",
  dialogImport: () => import("./dialog-example"),
  dialogParams: { title: "Example", data: someData },
});
```

- 为新对话框使用 `DialogMixin`（[`src/dialogs/dialog-mixin.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/dialog-mixin.ts)）。从其 `params` 属性读取参数，并调用 `closeDialog()` 来关闭它。
- 对于简单的标题栏文本，使用 `header-title` 和 `header-subtitle`，需要更多内容时使用标题栏插槽。
- 将按钮放在 `ha-dialog-footer` 中，位于其 `primaryAction` 和 `secondaryAction` 插槽内。
- 为第一个可获得焦点的元素添加 `autofocus`，例如 `<ha-form autofocus>`。

```html
<ha-dialog open header-title="Rename" width="small">
  <ha-form autofocus></ha-form>
  <ha-dialog-footer slot="footer">
    <ha-button slot="secondaryAction" appearance="plain" data-dialog="close">
      Cancel
    </ha-button>
    <ha-button slot="primaryAction">Rename</ha-button>
  </ha-dialog-footer>
</ha-dialog>
```

### 属性

- `open`：打开对话框。
- `type`：`standard`（默认）或 `alert`。标准对话框在小屏幕上会填满屏幕，提醒对话框则保持为对话框。
- `width`：`small`、`medium`（默认）、`large` 或 `full`。
- `prevent-scrim-close`：阻止通过 Escape 键或点击遮罩关闭。对话框会改为抖动。
- `header-title` 和 `header-subtitle`：标题栏文本。
- `header-subtitle-position`：位于标题的 `below`（默认）或 `above`。
- `flexcontent`：使主体成为 flex 容器。
- `without-header`：省略标题栏。
- `aria-labelledby` 和 `aria-describedby`：传递给对话框。

### 插槽

- 默认：主体。
- `header`：替换整个标题栏。
- `headerNavigationIcon`：替换关闭按钮。
- `headerTitle` 和 `headerSubtitle`：当未设置相应属性时，使用您自己的标题和副标题。
- `headerActionItems`：右上角的图标按钮。
- `footer`：页脚，通常是一个 `ha-dialog-footer`。

### 事件

- `opened`：对话框已显示。
- `after-show`：打开动画已完成。
- `closed`：对话框已隐藏。

### 样式

- `--dialog-content-padding`：主体的内边距。
- `--ha-dialog-show-duration` 和 `--ha-dialog-hide-duration`：动画时长。
- `--ha-dialog-surface-background`：背景。
- `--ha-dialog-border-radius`：圆角。
- `--dialog-box-shadow`：阴影。
- `--ha-dialog-surface-backdrop-filter` 和 `--ha-dialog-scrim-backdrop-filter`：表面和遮罩的背景滤镜。
- `--dialog-surface-margin-top`：表面的上外边距。

源码：[`src/components/ha-dialog.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-dialog.ts)
