# 按钮

> 按钮用于启动一个操作，例如保存表单或打开对话框。

Source: https://www.hasscn.top/contributors/design/components/button/

Live demo of `ha-button`.

```html
<ha-button>Save</ha-button>
<ha-button appearance="filled">Filled</ha-button>
<ha-button appearance="outlined">Outlined</ha-button>
<ha-button appearance="plain">Cancel</ha-button>
```

## 概述

按钮用于启动一个操作：当你选择它时会发生某些事情，例如保存表单、打开对话框或删除条目。它的外观表明该操作的重要程度，它的颜色表明该操作属于哪种类型。

## 何时使用

在以下情况使用按钮：

- 会改变某些内容的操作，例如**保存**、**删除**或**启用**
- 确认或关闭[对话框](https://www.hasscn.top/contributors/design/components/dialog/)
- 打开对话框或菜单

不要在以下情况使用按钮：

- 前往其他地方。请改用链接。
- 需要较长时间且需要展示进展的操作。请使用[进度按钮](https://www.hasscn.top/contributors/design/components/progress-button/)。
- 一组操作。请将它们放入[下拉菜单](https://www.hasscn.top/contributors/design/components/dropdown/)中。
- 开启或关闭某个设置。请使用[开关](https://www.hasscn.top/contributors/design/components/switch/)。

## 结构

1. **容器**：背景、边框和圆角
2. **起始**：标签之前的可选内容，通常是一个图标
3. **标签**：按钮的文本
4. **结束**：标签之后的可选内容，通常是一个图标
5. **加载指示器**：在按钮加载时替换起始、标签和结束

## 变体

### 外观

按钮有四种外观。它们决定了按钮吸引注意力的程度：

- **Accent** 是默认外观，填充最醒目。
- **Filled** 填充较柔和。当某个操作需要强调时使用它。
- **Outlined** 没有填充，只有边框。
- **Plain** 没有填充也没有边框，最不引人注意。用于取消和关闭操作。

Live demo of `ha-button`. 主要操作使用 accent，退出途径使用 plain。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button>Save</ha-button>
```

### 变体

变体决定了颜色，以及随之而来的含义：

- **Brand** 是默认变体，用于大多数操作。
- **Danger** 用于破坏性操作，例如删除某些内容。
- **Warning** 和 **success** 用于与警告或成功状态相关的操作。
- **Neutral** 用于不应通过颜色传达任何含义的操作。

Live demo of `ha-button`.

```html
<ha-button>Brand</ha-button>
<ha-button variant="danger">Danger</ha-button>
<ha-button variant="warning">Warning</ha-button>
<ha-button variant="success">Success</ha-button>
<ha-button variant="neutral">Neutral</ha-button>
```

### 尺寸

按钮有四种尺寸：超小、小、中和大。中是默认尺寸。

Live demo of `ha-button`.

```html
<ha-button size="xs">Extra small</ha-button>
<ha-button size="s">Small</ha-button>
<ha-button size="m">Medium</ha-button>
<ha-button size="l">Large</ha-button>
```

## 行为

- **启用**：静止状态，使用其外观和变体对应的颜色。
- **悬停**：在具有可悬停指针的设备上，背景会变为该变体的悬停填充色。颜色变化耗时 150 毫秒。
- **聚焦**：键盘聚焦时显示 2px 实线聚焦环，位于按钮外侧 2px 处。
- **按下**：按下期间，背景会变为该变体的激活填充色。
- **禁用**：按钮使用禁用颜色，无法被选择，并且在用键盘在页面上移动时会被跳过。
- **加载中**：加载指示器替换标签和图标。按钮保持其尺寸，选择它不会有任何效果。

Live demo of `ha-button`.

```html
<ha-button loading>Saving</ha-button>
<ha-button disabled>Disabled</ha-button>
<ha-button appearance="outlined" disabled>Disabled</ha-button>
```

过长的标签会换行。当标签无法换行时，会以省略号截断。

## 规格

### 尺寸

| 尺寸 | 高度 | 左右内边距 | 字体大小 |
| --- | --- | --- | --- |
| 超小 | 24px | 8px (`--ha-space-2`) | 14px (`--ha-font-size-m`) |
| 小 | 32px | 12px (`--ha-space-3`) | 14px (`--ha-font-size-m`) |
| 中 | 40px | 16px (`--ha-space-4`) | 14px (`--ha-font-size-m`) |
| 大 | 48px | 16px (`--ha-space-4`) | 16px (`--ha-font-size-l`) |

高度可以通过 `--ha-button-height` 更改。在代码中还有一个超大尺寸，但它没有自己的样式，外观与中等尺寸相同。

### 形状与内容

| 属性 | 值 | 令牌 |
| --- | --- | --- |
| 圆角半径 | 9999px，完全圆角 | `--ha-border-radius-pill`，通过 `--ha-button-border-radius` |
| 边框宽度 | 1px | `--ha-border-width-sm` |
| 字体粗细 | 500 | `--ha-font-weight-medium` |
| 起始或结束图标旁边的内边距 | 8px | `--ha-space-2` |
| 图标与标签之间的间距 | 4px | `--ha-space-1` |
| 标签上下内边距 | 4px | `--ha-space-1` |
| 超小尺寸下的图标大小 | 16px | `--mdc-icon-size` |
| 聚焦环 | 2px 实线，偏移 2px | `--ha-color-focus` |
| 悬停过渡 | 150ms，ease-out | `--ha-animation-duration-fast` |

### 颜色

以下令牌适用于 brand 变体。其他变体使用相同的令牌，只是将 `primary` 替换为 `neutral`、`success`、`warning` 或 `danger`。

| 外观 | 状态 | 背景 | 文本 | 边框 |
| --- | --- | --- | --- | --- |
| Accent | 静止 | `--ha-color-fill-primary-loud-resting` | `--ha-color-on-primary-loud` | 透明 |
| Accent | 悬停 | `--ha-color-fill-primary-loud-hover` | `--ha-color-on-primary-loud` | 透明 |
| Accent | 按下 | `--ha-color-fill-primary-loud-active` | `--ha-color-on-primary-loud` | 透明 |
| Accent | 禁用 | `--ha-color-fill-disabled-loud-resting` | `--ha-color-on-disabled-loud` | 透明 |
| Filled | 静止 | `--ha-color-fill-primary-normal-resting` | `--ha-color-on-primary-normal` | 透明 |
| Filled | 悬停 | `--ha-color-fill-primary-normal-hover` | `--ha-color-on-primary-normal` | 透明 |
| Filled | 按下 | `--ha-color-fill-primary-normal-active` | `--ha-color-on-primary-normal` | 透明 |
| Filled | 禁用 | `--ha-color-fill-disabled-normal-resting` | `--ha-color-on-disabled-normal` | 透明 |
| Outlined | 静止 | 透明 | `--ha-color-on-primary-quiet` | `--ha-color-border-primary-loud` |
| Outlined | 悬停 | `--ha-color-fill-primary-quiet-hover` | `--ha-color-on-primary-quiet` | `--ha-color-border-primary-loud` |
| Outlined | 禁用 | 透明 | `--ha-color-on-disabled-quiet` | `--ha-color-on-disabled-quiet` |
| Plain | 静止 | 透明 | `--ha-color-on-primary-normal` | 透明 |
| Plain | 悬停 | `--ha-color-fill-primary-quiet-hover` | `--ha-color-on-primary-normal` | 透明 |
| Plain | 按下 | `--ha-color-fill-primary-quiet-active` | `--ha-color-on-primary-quiet` | 透明 |
| Plain | 禁用 | 透明 | `--ha-color-on-disabled-quiet` | 透明 |

中性 plain 按钮是唯一的例外：按下时，它使用 `--ha-color-fill-neutral-normal-active`。通过属性禁用的按钮还会被 Web Awesome 基础样式整体调暗至 50% 不透明度。

## 指南

### 强调

Do and don't, as live demos.

**Do:** 使用 plain 按钮来取消或关闭。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button>Save</ha-button>
```

**Don't:** 给退出途径与主要操作同等的分量。

```html
<ha-button appearance="filled">Cancel</ha-button>
<ha-button>Save</ha-button>
```

Do and don't, as live demos.

**Do:** 对破坏性操作使用 danger 变体。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button variant="danger">Delete</ha-button>
```

**Don't:** 对删除某些内容的操作使用 brand 颜色。

```html
<ha-button appearance="plain">Cancel</ha-button>
<ha-button>Delete</ha-button>
```

### 标签

Do and don't, as live demos.

**Do:** 说明选择按钮后会发生什么。

```html
<ha-button>Save</ha-button>
```

**Don't:** 使用含义模糊的标签。

```html
<ha-button>OK</ha-button>
<ha-button>Submit</ha-button>
```

Do and don't, as live demos.

**Do:** 使用句首大写。

```html
<ha-button>Create automation</ha-button>
```

**Don't:** 每个单词都首字母大写。

```html
<ha-button>Create Automation</ha-button>
```

Do and don't, as live demos.

**Do:** 对可以重新添加的内容使用 remove，例如仪表盘上的卡片。

```html
<ha-button appearance="filled">Remove from dashboard</ha-button>
```

**Don't:** 对并非永久消失的内容使用 delete。

```html
<ha-button appearance="filled">Delete from dashboard</ha-button>
```

更多信息请参阅 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)和 [remove、delete、add 或 create](https://www.hasscn.top/contributors/design/ui-text/remove-delete/)。

### 图标

避免在超小按钮中使用图标。在 24px 的尺寸下，标签本身已足以传达含义，旁边的 16px 图标只会增加噪音而不增加信息。仅当按钮需要在密集布局中一眼被识别时才使用图标，并且只使用人们仅凭形状就能认出的常见图标，例如关闭、添加或设置。

Do and don't, as live demos.

**Do:** 让标签在超小按钮中传达含义。

```html
<ha-button size="xs">Delete</ha-button>
```

**Don't:** 在超小按钮中添加细节图标。

```html
<ha-button size="xs"><ha-svg-icon slot="start" path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></ha-svg-icon>Delete</ha-button>
```

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至按钮，以及从按钮移开。禁用的按钮会被跳过。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 选择按钮。加载期间无任何效果。 |

### 焦点

聚焦环仅在键盘聚焦时显示，用鼠标或触摸选择按钮时不会显示。

### 目标尺寸

超小尺寸高度为 24px，小尺寸为 32px，中尺寸为 40px，大尺寸为 48px。宽度随标签而定，再加上内边距。

### 屏幕阅读器

屏幕阅读器会连同其标签一起播报按钮。仅有图标的按钮没有可播报的文本，因此需要在代码中为其指定名称。加载期间，按钮会被播报为忙碌。禁用的按钮会被播报为已禁用。

### 在代码中

- 焦点被委托给组件内部的原生 `<button>`，因此在 `<ha-button>` 上调用 `focus()` 会聚焦该按钮。聚焦环使用 `:focus-visible`。
- 角色是 `button`。可访问名称是标签文本。在 `<ha-button>` 上设置 `aria-label` 可以为它指定另一个名称：它会被传递给原生按钮。
- 仅有图标而没有文本的按钮需要 `aria-label`。
- 加载期间，按钮具有 `aria-busy="true"`。
- 禁用的按钮是一个原生禁用的 `<button>`。

## 相关内容

- [进度按钮](https://www.hasscn.top/contributors/design/components/progress-button/)：展示其操作结果的按钮
- [下拉菜单](https://www.hasscn.top/contributors/design/components/dropdown/)：打开操作菜单的按钮
- [对话框](https://www.hasscn.top/contributors/design/components/dialog/)：大多数按钮对所在之处
- [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)：如何编写标签

## 在代码中

该元素是 `<ha-button>`。它基于 [Web Awesome 按钮](https://webawesome.com/docs/components/button/)。

```html
<ha-button>Save</ha-button>
<ha-button appearance="plain">Cancel</ha-button>
<ha-button variant="danger">Delete</ha-button>
<ha-button size="s">Small</ha-button>
```

在对话框中，将主要操作放入 `ha-dialog-footer` 的 `primaryAction` 插槽，将次要操作放入 `secondaryAction` 插槽。

### 属性

- `appearance`：`accent`（默认）、`filled`、`outlined` 或 `plain`。
- `variant`：`brand`（默认）、`neutral`、`success`、`warning` 或 `danger`。
- `size`：`xs`、`s`、`m`（默认）或 `l`。也接受 `xl` 值，外观与 `m` 相同。
- `loading`：显示加载指示器而不是标签，并阻止选择按钮。
- `disabled`：禁用按钮。

### 插槽

- 默认：标签。
- `start`：标签之前的内容，通常是一个图标。
- `end`：标签之后的内容，通常是一个图标。

### 样式

- `--ha-button-height`：按钮的高度。
- `--ha-button-border-radius`：圆角半径。默认为 `var(--ha-border-radius-pill)`。

来源：[`src/components/ha-button.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-button.ts)
