# 文本域（Textarea）

> 文本域（textarea）让人们输入可以跨越多行的文本，例如描述或消息。

Source: https://www.hasscn.top/contributors/design/components/textarea/

Live demo of `ha-textarea`.

```html
<ha-textarea label="Description" value="Turns on the hallway lights when someone comes home after sunset." resize="auto"></ha-textarea>
```

## 概述

文本域（textarea）让人们输入可以超过一行的自由文本：自动化的描述、标签、日历事件，或要发送给语音助手的消息。

## 何时使用

在以下情况使用文本域：

- 可以跨越多行的自由文本，例如描述、备注或消息

不要在以下情况使用文本域：

- 简短的单行值，例如名称。请使用[文本输入框](https://www.hasscn.top/contributors/design/components/input/)。
- 代码或 YAML。前端有专门的代码编辑器。

## 结构

1. **容器**：填充的字段，底部有一条线
2. **标签**：为文本命名。它位于字段内部，当字段获得焦点或有值时会向上移动。
3. **文本**：人们输入内容的原生文本域
4. **提示**：字段下方的可选帮助文本，当文本无效时会被校验消息取代

## 变体

### 随内容增长

前端的大多数文本域会随内容增长：字段开始时很小，随着人们输入而增长，达到最大高度（默认 200 像素）后开始滚动。这样既能让短文本保持紧凑，又不会隐藏长文本。

Live demo of `ha-textarea`.

```html
<ha-textarea label="Notes" resize="auto"></ha-textarea>
```

### 固定高度

不随内容增长的文本域具有固定高度，以文本行数计算（默认 4 行）。当你大致知道预期的文本量，并希望从一开始就预留好空间时，可以使用这种方式。

Live demo of `ha-textarea`.

```html
<ha-textarea label="Message" rows="6"></ha-textarea>
```

### 带提示

使用提示来提供任何有助于人们编写文本的信息，例如是否支持格式化。

Live demo of `ha-textarea`.

```html
<ha-textarea label="Description" hint="Supports Markdown." resize="auto"></ha-textarea>
```

## 行为

- **空**：标签位于字段内部，大小与文本相同。
- **悬停**：字段变为悬停背景色。
- **聚焦**：底部的线变粗并变为主色调，标签也是如此。
- **已填写**：一旦字段有值或获得焦点，标签就会向上移动并变小。有占位符时，标签始终处于上方。标签具有字段的背景色，因此滚动的文本在其下方仍保持可读。
- **必填**：标签会带有一个 `*` 标记。字段必须包含文本，表单才有效。
- **禁用**：字段使用禁用背景色，不透明度减半，文本无法更改或聚焦。
- **只读**：显示人们可以阅读和复制的文本，但不能更改。
- **无效**：标签和底部的线变为危险色，校验消息取代提示。当代码将字段标记为无效、表单检查发现文本无效，或者（对于自校验的字段）失去焦点时，字段变为无效。一旦人们输入了有效的文本，它就会立即恢复为有效。

Live demo of `ha-textarea`.

```html
<ha-textarea label="Description" required resize="auto"></ha-textarea>
<ha-textarea label="Disabled" value="Can't change this." disabled resize="auto"></ha-textarea>
<ha-textarea label="Message" invalid validation-message="Enter a message to send." resize="auto"></ha-textarea>
```

## 规格

### 尺寸

| 属性 | 值 | Token |
| --- | --- | --- |
| 最小高度 | 56px | 无 |
| 增长时的最大高度 | 200px | `--ha-textarea-max-height` |
| 固定高度时的行数 | 4 | 无 |
| 文本上方的间距 | 24px，无标签时为 12px | `--ha-space-6`, `--ha-space-3` |
| 文本下方的间距 | 8px | `--ha-space-2` |
| 文本左右内边距 | 16px | `--ha-space-4` |
| 圆角半径 | 顶部 4px，底部 0 | `--ha-border-radius-sm`, `--ha-border-radius-square` |
| 底部的线 | 1px，聚焦时 2px | 无 |

### 字体

| 部分 | 大小 | Token |
| --- | --- | --- |
| 文本 | 14px | `--ha-font-size-m` |
| 标签，位于字段内部 | 14px | `--ha-font-size-m` |
| 标签，上移后 | 10px | `--ha-font-size-xs` |
| 标签上方的间距 | 16px，上移后为 8px | `--ha-space-4`, `--ha-space-2` |
| 标签左右内边距 | 12px | `--ha-space-3` |
| 提示和校验消息 | 12px | `--ha-font-size-s` |

文本使用 `--ha-font-family-body`。颜色、线条和标签位置的变化耗时 150ms。

### 颜色

| 部分 | 状态 | Token |
| --- | --- | --- |
| 背景和标签背景 | 静止 | `--ha-color-form-background` |
| 背景和标签背景 | 悬停 | `--ha-color-form-background-hover` |
| 背景和标签背景 | 禁用 | `--ha-color-form-background-disabled` |
| 底部的线 | 静止 | `--ha-color-border-neutral-loud` |
| 底部的线 | 聚焦 | `--primary-color` |
| 底部的线 | 无效 | `--ha-color-border-danger-normal` |
| 标签 | 静止 | `--secondary-text-color` |
| 标签 | 聚焦 | `--primary-color` |
| 标签 | 无效 | `--ha-color-fill-danger-loud-resting` |
| 提示 | 所有 | `--ha-color-text-secondary` |
| 校验消息 | 无效 | `--ha-color-on-danger-quiet` |

## 指南

Do and don't, as live demos.

**Do:** 始终为文本域提供一个简短的标签。

```html
<ha-textarea label="Description" resize="auto"></ha-textarea>
```

**Don't:** 将占位符用作标签。一旦人们开始输入，它就会消失。

```html
<ha-textarea placeholder="Description" resize="auto"></ha-textarea>
```

Do and don't, as live demos.

**Do:** 说明哪里出错了，以及如何修复。

```html
<ha-textarea label="Message" invalid validation-message="Enter a message to send." resize="auto"></ha-textarea>
```

**Don't:** 只说文本是错的。

```html
<ha-textarea label="Message" invalid validation-message="Invalid value." resize="auto"></ha-textarea>
```

- 保持标签简短：**Description**、**Notes**、**Message**。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至文本域，以及从文本域移出。禁用的文本域会被跳过。 |
| <kbd>Enter</kbd> | 开始新的一行。 |

在文本域中的按键操作不会触发其周围的键盘快捷键。

### 焦点

焦点以主色调显示在底部的线和标签上，而不是使用单独的焦点环。

### 目标尺寸

字段高度至少为 56px，宽度与其容器相同。

### 屏幕阅读器

屏幕阅读器会连同其标签一起播报文本域，并将提示作为其描述朗读。当字段变为无效时，会播报校验消息。必填、禁用和只读状态也会被播报。如果没有标签，则只有占位符来描述它，因此请始终为其提供标签。

### 在代码中

- 焦点会移到组件内部的原生文本域上。
- 组件会阻止 `keydown` 事件向外传播。

- 标签是一个连接到文本域的原生 `<label>`，因此它是可访问名称。
- 没有标签时，`<label>` 为空并对辅助技术隐藏。此时占位符是描述文本域的唯一文本。
- 提示和校验消息通过 `aria-describedby` 连接到文本域，因此屏幕阅读器会将它们作为描述朗读。
- 校验消息位于一个实时区域（live region）中，并在字段无效时获得 `alert` 角色，因此屏幕阅读器会在它出现时播报。
- 必填、禁用和只读状态设置在原生文本域上，因此辅助技术会按原样获取它们。

## 相关内容

- [文本输入框](https://www.hasscn.top/contributors/design/components/input/)：单行文本
- [表单](https://www.hasscn.top/contributors/design/components/form/)：根据 schema 构建字段
- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：带 `multiline` 的文本选择器会显示文本域
- [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)：如何编写标签、提示和错误信息

## 代码实现

该元素是 `<ha-textarea>`。它基于 [Web Awesome textarea](https://webawesome.com/docs/components/textarea/)。

```html
<ha-textarea label="Description" resize="auto"></ha-textarea>
<ha-textarea label="Message" rows="6"></ha-textarea>
<ha-textarea label="Notes" hint="Supports Markdown." required></ha-textarea>
```

### 属性

- `label`：标签。
- `value`：当前值。
- `hint`：文本域下方的帮助文本。
- `placeholder`：文本域为空时显示的文本。
- `rows`：可见行数。默认为 `4`。
- `resize`：`none`（默认）、`vertical`、`horizontal`、`both` 或 `auto`。设为 `auto` 时，文本域会随内容增长，最大不超过 `--ha-textarea-max-height`。
- `required`：将字段设为必填，并在标签后添加标记。
- `disabled`：禁用文本域。
- `readonly`：将文本域设为只读。
- `invalid`：将文本域标记为无效。
- `validation-message`：文本域无效时显示的消息。未设置时，显示浏览器自带的消息。
- `auto-validate`：在文本域失去焦点时进行校验，而不是等待表单提交。
- `minlength` 和 `maxlength`：值的最小和最大长度。
- `name`、`autocomplete`、`autocapitalize`、`autofocus`、`spellcheck`、`inputmode` 和 `enterkeyhint`：传递给原生文本域，与普通 `<textarea>` 上的用法相同。

`resize="auto"` 的最大高度仅在 `resize` 作为属性设置时生效。该属性不会反射（reflect），因此仅从代码设置 `.resize` 会得到一个无限增长的文本域。

### 插槽

- `label`：带标记的标签。此插槽中的内容会取代 `label` 属性的文本，包括必填标记。
- `hint`：带标记的提示，例如链接。仅在未设置 `hint` 属性时使用。

### 事件

- `input`：在人们输入时，值的每次变化都会触发。
- `change`：在值被提交时触发，例如文本域失去焦点时。

从元素的 `value` 读取新值。按键操作不会从文本域冒泡出去：它会阻止 `keydown` 事件，因此输入文字或按 Enter 换行都不会触发其周围的键盘处理器。

### 样式

- `--ha-textarea-max-height`：`resize="auto"` 时的最大高度。默认为 `200px`。
- `--ha-textarea-padding-bottom`：文本域下方的间距。
- `--ha-textarea-required-marker`：必填字段标签后的标记。默认为 `"*"`。

源码：[`src/components/ha-textarea.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-textarea.ts)
