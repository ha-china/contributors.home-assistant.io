# 自适应对话框

> 在大屏幕上是对话框，在手机上是底部抽屉。它会自动选择合适的形式。

Source: https://www.hasscn.top/contributors/design/components/adaptive-dialog/

## 概述

自适应对话框是一种能适应所在屏幕的[对话框](https://www.hasscn.top/contributors/design/components/dialog/)。在大屏幕上，它是位于窗口中央的常规对话框。在手机或较矮的屏幕上，它会从底部向上滑出，成为底部抽屉（bottom sheet），便于拇指操作，也容易滑动关闭。

其他方面都与对话框一样：相同的页眉、正文和页脚，以及相同的标题和按钮准则。本页只介绍不同的部分。

它需要运行中的 Home Assistant 才能打开，因此这里没有在线演示。

## 何时使用

在以下情况使用自适应对话框：

- 需要在手机上良好工作的表单和其他输入
- 能受益于小屏幕全宽的内容
- 希望在桌面端和移动端表现一致的对话框

当不需要底部抽屉时，请使用常规的[对话框](https://www.hasscn.top/contributors/design/components/dialog/)，例如只在大屏幕上使用的对话框。前端的确认对话框就是常规对话框。

## 结构

在对话框模式下，结构与[对话框](https://www.hasscn.top/contributors/design/components/dialog/#anatomy)相同。在底部抽屉模式下：

1. **遮罩（Scrim）**：抽屉后面的覆盖层
2. **把手（Handle）**：顶部的小横条，提示你可以拖动抽屉
3. **表面（Surface）**：抽屉本身，顶部为圆角
4. **页眉（Header）**：关闭按钮、标题、可选的副标题，以及可选的操作按钮
5. **正文（Body）**：内容，放不下时会滚动
6. **页脚（Footer）**：按钮，位于底部

## 变体

### 对话框和底部抽屉

屏幕尺寸决定模式：

- **对话框**：在宽度大于 870px 且高度大于 500px 的屏幕上。
- **底部抽屉**：在宽度不超过 870px，或高度不超过 500px 的屏幕上。

### 宽度

在对话框模式下，自适应对话框与对话框一样有四种宽度：小（320px）、中（580px，默认）、大（1024px）和全宽。底部抽屉始终使用屏幕的全宽，并忽略宽度设置。

### 自适应弹出框

自适应弹出框（adaptive popover）是它的近亲。在大屏幕上，它会在打开它的元素旁边以弹出框的形式打开，而不是在窗口中央。在小屏幕上，或没有可锚定的元素时，它的行为与自适应对话框相同。日期选择器就使用了它。

## 行为

- **选择模式**：模式在对话框创建时选择一次，打开期间保持不变。调整窗口大小不会切换模式。这样可以避免填了一半的表单被重置。对话框可以选择在打开期间实时切换。
- **打开**：底部抽屉在 300ms 内向上滑出。开启减弱动态效果后，它会立即出现。焦点会移动到被标记为接收焦点的元素上。
- **关闭**：在两种模式下，关闭按钮、被标记为关闭按钮的按钮、<kbd>Escape</kbd> 键以及点击遮罩都可以关闭它。
- **滑动**：你可以向下拖动底部抽屉。快速下滑会关闭它。缓慢拖动时，松手时若超过其高度的一半则关闭，否则会弹回。在已向下滚动的内容中，或在自身可拖动的控件（如滑块、开关、色轮或地图）中开始的拖动，会移动该内容而不是抽屉。
- **受保护的关闭**：当关闭被阻止时（例如表单有更改），<kbd>Escape</kbd> 键和点击遮罩不会起作用。此时底部抽屉会隐藏其把手，并且无法滑动关闭。
- **高度**：底部抽屉与其内容一样高，最高为屏幕的 90%，并且始终在顶部留出至少 48px 的空间。

## 规格

在对话框模式下，规格与[对话框](https://www.hasscn.top/contributors/design/components/dialog/#specs)相同。在底部抽屉模式下：

| 属性 | 值 | Token |
| --- | --- | --- |
| 宽度 | 屏幕全宽，在安全区域内 | 无 |
| 最大高度 | 屏幕的 90%，顶部至少留出 48px | `--ha-bottom-sheet-max-height` |
| 圆角 | 20px，位于顶部 | `--ha-border-radius-2xl`，通过 `--ha-bottom-sheet-border-radius` |
| 背景 | 卡片背景 | `--card-background-color`，通过 `--ha-dialog-surface-background` |
| 正文内边距 | 顶部为 0，其他三边为 24px | `--ha-space-6`，通过 `--dialog-content-padding` |
| 打开和关闭动画 | 300ms，开启减弱动态效果时为 1ms | 无 |

## 准则

遵循[对话框](https://www.hasscn.top/contributors/design/components/dialog/#guidelines)的准则：清晰的标题、简短的正文，以及**取消**旁边的一个主要操作。

- 将按钮放在页脚，主要操作使用强调按钮，**取消**使用普通按钮。
- 页眉操作（如帮助或设置）使用图标按钮或菜单。
- 保持内容足够简短，以便在手机上使用。如果在小屏幕上需要大量滚动，它可能更适合做成一个页面。

## 无障碍

### 键盘

与[对话框](https://www.hasscn.top/contributors/design/components/dialog/#keyboard)相同：<kbd>Tab</kbd> 在内容间移动，<kbd>Escape</kbd> 关闭它，除非关闭受到保护。

### 焦点

打开时，焦点会移动到被标记为接收焦点的元素上。委托焦点的组件（如表单）会将其传递给它们的第一个字段。

### 目标尺寸

关闭按钮是 48px × 48px 的图标按钮。滑动绝不是关闭底部抽屉的唯一方式：关闭按钮始终存在，除非对话框有意将其隐藏。

### 屏幕阅读器

在两种模式下，自适应对话框都会被播报为对话框。底部抽屉的把手对屏幕阅读器隐藏。

### 代码中

- 无障碍名称是 `header-title`，或你通过 `aria-labelledby` 指向的元素。
- 使用 `aria-describedby` 关联描述。
- 关闭按钮的无障碍名称是翻译后的标签 `ui.common.close`。
- 自适应弹出框是一个角色为 `dialog` 且 `aria-modal="true"` 的弹出框，并会捕获焦点。

## 相关内容

- [对话框](https://www.hasscn.top/contributors/design/components/dialog/)：本组件所基于的对话框，包含内容和按钮的准则
- [按钮](https://www.hasscn.top/contributors/design/components/button/)：页脚中的按钮
- [表单](https://www.hasscn.top/contributors/design/components/form/)：对话框中的字段

## 代码中

该元素是 `<ha-adaptive-dialog>`。它会根据屏幕大小渲染 `ha-dialog` 或 `ha-bottom-sheet`。按照与[对话框](https://www.hasscn.top/contributors/design/components/dialog/#in-code)相同的方式，通过 `show-dialog` 事件打开它。

```html
<ha-adaptive-dialog open header-title="Dialog title">
  <ha-icon-button
    slot="headerActionItems"
    label="Help"
    path="..."
  ></ha-icon-button>
  <div>Dialog content</div>
  <ha-dialog-footer slot="footer">
    <ha-button slot="secondaryAction" appearance="plain" data-dialog="close">
      Cancel
    </ha-button>
    <ha-button slot="primaryAction">Submit</ha-button>
  </ha-dialog-footer>
</ha-adaptive-dialog>
```

### 属性

- `open`：打开对话框。
- `type`：`standard`（默认）或 `alert`。仅在对话框模式下使用。
- `width`：`small`、`medium`（默认）、`large` 或 `full`。仅在对话框模式下使用。
- `prevent-scrim-close`：阻止通过 Escape 键或点击遮罩关闭，以及滑动关闭底部抽屉。
- `header-title` 和 `header-subtitle`：页眉文本。
- `header-subtitle-position`：`below`（默认）或 `above` 标题。
- `allow-mode-change`：当屏幕大小变化时，在打开状态下于对话框和底部抽屉之间切换。表单请保持关闭，以免字段被重置。
- `flexcontent`：使正文成为 flex 容器。
- `without-header`：省略页眉。
- `hide-close-button`：省略关闭按钮。
- `aria-labelledby` 和 `aria-describedby`：传递给对话框或抽屉。

### 插槽

- 默认：正文。
- `header`：替换整个页眉。
- `headerNavigationIcon`：替换关闭按钮。
- `headerTitle` 和 `headerSubtitle`：在未设置相应属性时，使用你自己的标题和副标题。
- `headerActionItems`：右上角的图标按钮或菜单。
- `footer`：页脚，通常是 `ha-dialog-footer`。

### 事件

- `opened`：对话框或抽屉已显示。
- `after-show`：打开动画已完成。
- `closed`：对话框或抽屉已隐藏。

### 样式

- `--ha-dialog-surface-background`：背景，两种模式下均适用。
- `--ha-dialog-border-radius`：圆角，对话框模式下适用。
- `--ha-bottom-sheet-surface-background` 和 `--ha-bottom-sheet-scrim-color`：底部抽屉的背景和遮罩。
- `--ha-dialog-surface-backdrop-filter` 和 `--ha-dialog-scrim-backdrop-filter`：表面和遮罩的背景滤镜。

### 自适应弹出框

该元素是 `<ha-adaptive-popover>`。它接受与自适应对话框相同的属性和插槽。将 `dialogAnchor` 属性设置为它应在其旁边打开的元素。没有锚点或在 小屏幕上时，它会回退到自适应对话框。

来源：[`src/components/ha-adaptive-dialog.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-adaptive-dialog.ts)、[`src/components/ha-bottom-sheet.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-bottom-sheet.ts) 和 [`src/components/ha-adaptive-popover.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-adaptive-popover.ts)
