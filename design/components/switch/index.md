# 开关

> 开关用于将单个设置打开或关闭。

Source: https://www.hasscn.top/contributors/design/components/switch/

Live demo of `ha-switch`.

```html
<ha-switch checked></ha-switch>
<ha-switch></ha-switch>
<ha-switch checked disabled></ha-switch>
<ha-switch disabled></ha-switch>
```

## 概述

开关（switch）用于将单个设置打开或关闭，例如开机自启动应用，或启用自动更新。用户应该仅通过开关就能读出状态，因此该设置必须能明确地表示“开”或“关”。

## 何时使用

在以下情况使用开关：

- 具有两种状态的设置：开和关
- 立即生效的设置，这也是 Home Assistant 中大多数开关的工作方式

不要在以下情况使用开关：

- 在两个或多个非“开/关”选项之间做选择。请使用[选择框](https://www.hasscn.top/contributors/design/components/select-box/)或其他选择组件。
- 从列表中选取多个项目。请使用复选框。
- 执行操作，例如重启某物。请使用[按钮](https://www.hasscn.top/contributors/design/components/button/)。
- 在仪表盘（dashboard）或更多信息对话框中控制设备。前端为此提供了更大的 `<ha-control-switch>`，参见[控件](https://www.hasscn.top/contributors/design/components/controls/)。

## 结构

1. **轨道（Track）**：显示开关是否处于打开状态的圆角背景
2. **滑块（Thumb）**：开关打开时移动到末端的圆形，关闭时移回起点
3. **标签（Label）**：开关旁边的可选文本
4. **提示（Hint）**：开关下方的可选帮助文本

## 变体

开关没有变体。它可以自带标签，也可以放在负责标注的设置行中。

### 不带标签

在前端中，大多数开关位于设置行的末尾，设置的名称和简短描述在左侧。由该行负责标注，因此开关本身没有文本。

### 带标签

你也可以将标签作为开关自身的内容。这样，点击标签也会切换开关。

Live demo of `ha-switch`.

```html
<ha-switch checked>Start on boot</ha-switch>
<ha-switch>Automatic updates</ha-switch>
```

## 行为

- **关**：滑块位于轨道起点，轨道使用安静的中性填充色。
- **开**：滑块位于轨道末端，轨道使用主色。
- **悬停**：轨道和滑块变为各自的悬停颜色。键盘焦点使用相同的颜色。
- **焦点**：键盘焦点会在轨道周围显示 2px 实线焦点环，位于轨道外侧 2px 处。
- **禁用**：轨道和滑块变暗至 30% 不透明度，标签变为禁用文本颜色。标签本身不会变暗，因此仍保持可读。
- **必填**：必填的开关必须处于打开状态，表单才有效。其标签会带有一个 `*` 标记。

滑块在 150ms 内从一端滑动到另一端。在从右到左的语言中，开和关是镜像的：开在左侧。

开关暗示更改会立即生效。如果更改只有在点击**保存**后才生效，请明确说明，例如将开关保留在带有明显保存按钮的表单中。

在支持振动的设备上，开关在切换时也可以产生轻微振动。

Live demo of `ha-switch`.

```html
<ha-switch checked disabled>Start on boot</ha-switch>
<ha-switch disabled>Automatic updates</ha-switch>
```

## 规格

| 属性 | 值 | 令牌 |
| --- | --- | --- |
| 轨道高度 | 24px | `--ha-switch-size` |
| 轨道宽度 | 48px | `--ha-switch-width` |
| 轨道圆角半径 | 完全圆角，等于轨道高度 | 无 |
| 滑块大小 | 18px | `--ha-switch-thumb-size` |
| 滑块阴影 | 小阴影 | `--ha-box-shadow-s`，通过 `--ha-switch-thumb-box-shadow` |
| 轨道和滑块的边框宽度 | 1px | `--ha-border-width-sm` |
| 开关与标签之间的间距 | 0.5em | 无 |
| 触摸目标 | 至少 40px × 40px | `--ha-switch-min-touch-size` |
| 轨道和滑块禁用时的不透明度 | 0.3 | `--ha-switch-disabled-opacity` |
| 焦点环 | 2px 实线，偏移 2px | `--ha-color-focus` |
| 滑块动画 | 150ms，ease | `--ha-animation-duration-fast` |

| 状态 | 轨道 | 轨道边框 | 滑块及滑块边框 |
| --- | --- | --- | --- |
| 关 | `--ha-color-fill-disabled-quiet-resting` | `--ha-color-border-neutral-normal` | `--ha-color-on-neutral-normal` |
| 关，悬停或焦点 | `--ha-color-fill-disabled-quiet-hover` | `--ha-color-border-neutral-normal` | `--ha-color-on-neutral-normal` |
| 开 | `--ha-color-fill-primary-normal-resting` | `--ha-color-border-primary-loud` | `--ha-color-on-primary-normal` |
| 开，悬停或焦点 | `--ha-color-fill-primary-normal-hover` | `--ha-color-border-primary-loud` | `--ha-color-on-primary-normal` |

这些颜色中的每一个都可以通过 `--ha-switch-*` 属性覆盖，参见[样式](https://www.hasscn.top/contributors/design/components/switch/#styling)。

## 指南

- 仅当更改立即生效时才让开关振动。如果用户还需要保存，就不要振动。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移动到开关，或从开关移走。禁用的开关会被跳过。 |
| <kbd>Space</kbd> | 切换开关。 |
| <kbd>Arrow right</kbd> | 打开开关。在从右到左的语言中，它会关闭开关。 |
| <kbd>Arrow left</kbd> | 关闭开关。在从右到左的语言中，它会打开开关。 |

### 焦点

焦点环显示在轨道周围，且仅在使用键盘时显示。

### 目标大小

轨道为 48px × 24px。其周围一个不可见区域使触摸目标至少为 40px × 40px。

### 屏幕阅读器

屏幕阅读器会播报开关、其标签，以及它是开还是关。提示会作为其描述被朗读。没有自带标签的开关（例如位于设置行末尾的开关）需要在代码中提供名称，见下文。

### 在代码中

- 焦点被委托给组件内部的原生复选框。
- 原生复选框具有 `switch` 角色，并且 `aria-checked` 被设置为 `true` 或 `false`。
- 默认插槽中的文本是无障碍名称，因为它与复选框位于同一个 `<label>` 中。
- 如果默认插槽中没有文本，开关就没有自己的名称。`title` 属性会被传递给复选框，成为它唯一的名称。
- 提示通过 `aria-describedby` 连接到复选框。

## 相关内容

- [控件](https://www.hasscn.top/contributors/design/components/controls/)：用于仪表盘上设备的更大开关
- [选择框](https://www.hasscn.top/contributors/design/components/select-box/)：在选项之间做选择
- [按钮](https://www.hasscn.top/contributors/design/components/button/)：执行操作而非设置
- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：布尔选择器会显示一个开关

## 在代码中

该元素是 `<ha-switch>`。它基于 [Web Awesome 开关](https://webawesome.com/docs/components/switch/)。

```html
<ha-switch checked></ha-switch>
<ha-switch disabled></ha-switch>
<ha-switch haptic>Start on boot</ha-switch>
```

### 属性

- `checked`：打开开关。
- `disabled`：禁用开关。
- `required`：将开关设为必填：必须处于打开状态，表单才有效。
- `haptic`：在开关切换时产生轻微振动。仅当更改立即生效时才使用。
- `hint`：开关下方的帮助文本。
- `name` 和 `value`：随表单一起提交，类似于原生复选框。

### 插槽

- 默认：标签。
- `hint`：带标记的提示。此插槽中的内容会替换 `hint` 属性的文本。

### 事件

- `change`：在开关被切换时触发。从元素上的 `checked` 读取新状态。
- `input`：在开关接收输入时触发。

### 样式

默认颜色遵循主题，因此在大多数情况下你不需要这些。

- `--ha-switch-size`：轨道的高度。默认为 `24px`。
- `--ha-switch-width`：轨道的宽度。默认为 `48px`。
- `--ha-switch-thumb-size`：滑块的大小。默认为 `18px`。
- `--ha-switch-thumb-box-shadow`：滑块的阴影。默认为 `var(--ha-box-shadow-s)`。
- `--ha-switch-disabled-opacity`：开关禁用时的不透明度。默认为 `0.3`。
- `--ha-switch-min-touch-size`：开关周围触摸目标的最小大小。默认为 `40px`。
- `--ha-switch-required-marker`：必填开关标签后的标记。默认为 `"*"`。
- `--ha-switch-required-marker-offset`：必填标记前的间距。默认为 `0.1rem`。

轨道、滑块和边框的颜色。每种颜色都有一个 `-hover` 版本，用于指针悬停在开关上时，`--ha-switch-border-color` 除外：

- 关：`--ha-switch-background-color`、`--ha-switch-border-color`、`--ha-switch-thumb-background-color` 和 `--ha-switch-thumb-border-color`。
- 开：`--ha-switch-checked-background-color`、`--ha-switch-checked-border-color`、`--ha-switch-checked-thumb-background-color` 和 `--ha-switch-checked-thumb-border-color`。

源码：[`src/components/ha-switch.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-switch.ts)
