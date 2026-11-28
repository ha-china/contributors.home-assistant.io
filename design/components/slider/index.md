# 滑块

> 滑块让人们通过拖动，从一段范围中选取一个数值。

Source: https://www.hasscn.top/contributors/design/components/slider/

Live demo of `ha-slider`.

```html
<ha-slider min="0" max="100" value="60"></ha-slider>
```

## 概述

滑块让人们通过拖动，从一段范围中选取一个数值。人们可以立刻看到数值位于最小值和最大值之间的位置，并且只需一次拖动就能更改它。

## 何时使用

在以下情况使用滑块：

- 数值的范围比精确数字更重要的场景，例如音量、速度或百分比

在以下情况不要使用滑块：

- 没有明确最小值和最大值的数值，或者人们需要精确输入的数值。请使用 `type="number"` 的[文本输入框](https://www.hasscn.top/contributors/design/components/input/)。
- 在仪表盘或更多信息对话框中控制设备。前端为此提供了更大的 `<ha-control-slider>`，参见[控件](https://www.hasscn.top/contributors/design/components/controls/)。本页介绍的滑块用于设置、表单和紧凑的行。

前端中的数字选择器两者兼顾：它显示一个滑块，旁边带有数字输入框，人们可以拖动以获得大致数值，也可以输入以获得精确数值。当没有最小值或最大值时，它会退化为仅显示输入框。

## 结构

1. **标签（Label）**：可选，位于滑块上方
2. **轨道（Track）**：完整范围，从最小值到最大值
3. **指示器（Indicator）**：轨道中已填充的部分，直到当前数值
4. **刻度点（Markers）**：可选，轨道上每个步进对应的一个圆点
5. **滑块钮（Thumb）**：人们拖动的圆形，位于当前数值处
6. **工具提示（Tooltip）**：当人们拖动或聚焦滑块时，在滑块钮上方显示当前数值
7. **提示（Hint）**：可选，位于滑块下方的帮助文本

## 变体

### 尺寸

有两种尺寸：小（默认）和中。它们的区别在于滑块钮的大小。小尺寸适合放在行和表单中，这也是前端中大多数滑块所在的位置。

Live demo of `ha-slider`.

```html
<ha-slider size="s" min="0" max="100" value="40"></ha-slider>
<ha-slider size="m" min="0" max="100" value="40"></ha-slider>
```

### 步进与刻度点

步进（step）决定了数值的精细程度。当步进较少时，滑块可以在轨道上为每个步进显示一个刻度点。

Live demo of `ha-slider`.

```html
<ha-slider min="0" max="8" step="1" value="4" with-markers></ha-slider>
```

### 带标签

滑块旁边不显示数字。它可以在上方带有一个标签。

Live demo of `ha-slider`.

```html
<ha-slider label="Volume" min="0" max="100" value="30"></ha-slider>
```

## 行为

- **启用**：指示器和滑块钮为主色，轨道的其余部分为禁用色。
- **聚焦**：键盘聚焦时，滑块钮周围会显示 2px 的实线聚焦环，并打开显示数值的工具提示。
- **拖动**：滑块钮跟随指针，数值吸附到最近的步进，工具提示显示该数值。
- **禁用**：轨道的不透明度降低到一半。滑块显示数值，但无法更改或聚焦。
- **只读**：显示数值，但不允许人们更改它。

Live demo of `ha-slider`.

```html
<ha-slider min="0" max="100" value="60" disabled></ha-slider>
```

滑块遵循页面的文本方向：在从右到左的语言中，最小值位于右侧。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 宽度 | 200px，至少 100px | 无 |
| 轨道厚度 | 4px | `--ha-slider-track-size` |
| 轨道圆角半径 | 9999px，完全圆角 | 无 |
| 滑块钮尺寸，小 | 16px | 无 |
| 滑块钮尺寸，中 | 20px | 无 |
| 滑块钮边框 | 无 | 无 |
| 刻度点尺寸 | 2px，轨道厚度的一半 | 无 |
| 禁用轨道不透明度 | 0.5 | 无 |
| 聚焦环 | 2px 实线，围绕滑块钮 | `--ha-color-focus` |
| 工具提示与滑块钮的距离 | 8px | `tooltip-distance` |

| 部件 | 颜色 |
| --- | --- |
| 轨道 | `--disabled-color`，通过 `--ha-slider-track-color` |
| 指示器 | `--primary-color`，通过 `--ha-slider-indicator-color` |
| 滑块钮 | `--primary-color`，通过 `--ha-slider-thumb-color` |
| 刻度点 | `--card-background-color` |

工具提示没有箭头，并使用与[工具提示](https://www.hasscn.top/contributors/design/components/tooltip/)组件相同的 token：

| 属性 | 值 | Token |
| --- | --- | --- |
| 背景 | 次要背景 | `--secondary-background-color`，通过 `--ha-tooltip-background-color` |
| 文本 | 主要文本 | `--primary-text-color`，通过 `--ha-tooltip-text-color` |
| 字体大小 | 12px | `--ha-font-size-s` |
| 内边距 | 8px | `--ha-space-2` |
| 圆角半径 | 4px | `--ha-border-radius-sm` |

## 指南

- 为滑块添加一个说明其控制内容的标签，例如**音量**或**速度**。
- 当数值很重要时，确保当前数值在其他地方可见，例如在行中或旁边的输入框中。工具提示只在人们拖动或聚焦滑块时显示。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移到滑块上，以及从滑块移开。禁用的滑块会被跳过。 |
| <kbd>右箭头</kbd> 或 <kbd>上箭头</kbd> | 将数值增加一个步进。在从右到左的语言中，<kbd>左箭头</kbd> 为增加。 |
| <kbd>左箭头</kbd> 或 <kbd>下箭头</kbd> | 将数值减少一个步进。在从右到左的语言中，<kbd>右箭头</kbd> 为减少。 |
| <kbd>Page up</kbd> | 将数值增加范围的十分之一，至少一个步进。 |
| <kbd>Page down</kbd> | 将数值减少范围的十分之一，至少一个步进。 |
| <kbd>Home</kbd> | 设为最小值。 |
| <kbd>End</kbd> | 设为最大值。 |

当滑块被禁用或只读时，这些按键不起作用。

### 聚焦

键盘聚焦时，滑块钮周围会显示 2px 的实线聚焦环，并打开显示数值的工具提示。

### 目标尺寸

滑块在轨道上方和下方各有 14px 的额外触摸区域，形成 32px 高的触摸目标。

### 屏幕阅读器

滑块会连同其标签和数值一起播报，数值按用户的语言格式化。没有标签时，它没有名称。提示文本会作为其描述被朗读。

### 在代码中

- 滑块具有 `slider` 角色，带有 `aria-valuemin`、`aria-valuemax`、`aria-valuenow` 和 `aria-valuetext`。数值文本是按用户语言格式化的数字，或者在设置了 `valueFormatter` 时为其结果。
- 可访问名称来自标签，通过 `aria-labelledby` 提供。没有标签时，滑块没有名称。
- 提示文本通过 `aria-describedby` 关联。
- 工具提示中的数值对屏幕阅读器隐藏。它们改为从数值文本中获取。
- `aria-disabled` 跟随 `disabled`。`aria-readonly` 也跟随 `disabled`，而不是 `readonly`。

## 相关内容

- [控件](https://www.hasscn.top/contributors/design/components/controls/)：用于仪表盘上设备的更大滑块
- [文本输入框](https://www.hasscn.top/contributors/design/components/input/)：用于精确数字
- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：数字选择器显示一个滑块，旁边带有输入框
- [工具提示](https://www.hasscn.top/contributors/design/components/tooltip/)：与数值工具提示相同的外观

## 在代码中

该元素是 `<ha-slider>`。它基于 [Web Awesome slider](https://webawesome.com/docs/components/slider/)。

```html
<ha-slider min="0" max="100" value="60"></ha-slider>
<ha-slider min="0" max="8" step="1" value="4" with-markers></ha-slider>
<ha-slider size="m" label="Volume"></ha-slider>
```

### 属性

- `value`：当前数值。默认为 `0`。
- `min`：最小值。默认为 `0`。
- `max`：最大值。默认为 `100`。
- `step`：数值的粒度。默认为 `1`。
- `size`：`s`（默认）或 `m`。
- `with-markers`：在每个步进处显示一个刻度点。
- `with-tooltip`：在拖动或聚焦时，在工具提示中显示数值。在 `<ha-slider>` 中默认开启，因此若要隐藏它，需从代码中将 `withTooltip` 属性设置为 `false`。
- `tooltip-placement`：`top`（默认）、`right`、`bottom` 或 `left`。
- `tooltip-distance`：工具提示与滑块钮的距离，以像素为单位。默认为 `8`。
- `label`：滑块上方的标签。
- `hint`：滑块下方的帮助文本。
- `disabled`：禁用滑块。
- `readonly`：显示数值，但不允许人们更改它。
- `orientation`：`horizontal`（默认）或 `vertical`。
- `indicator-offset`：轨道着色部分起始的数值。当范围跨越零的两侧时很有用。
- `range`、`min-value` 和 `max-value`：将滑块变成带有两个滑块钮的范围滑块。前端尚未使用。
- `name`：随表单一起提交。

工具提示显示纯数字。若要格式化它，例如添加单位，需从代码中将 `valueFormatter` 属性设置为一个函数。

### 插槽

- `label`：带标记的标签。仅在未设置 `label` 属性时使用。
- `hint`：带标记的提示。仅在未设置 `hint` 属性时使用。
- `reference`：显示在轨道下方的标签，例如最小值和最大值。

### 事件

- `input`：在人们拖动时持续触发。
- `change`：在人们松开、数值被提交时触发。

从元素的 `value` 读取新数值。前端中的大多数滑块只响应 `change`，并在人们松开后才应用数值。

### 样式

- `--ha-slider-track-size`：轨道的厚度。默认为 `4px`。
- `--ha-slider-track-color`：轨道的颜色。默认为 `var(--disabled-color)`。
- `--ha-slider-indicator-color`：轨道已填充部分的颜色。默认为 `var(--primary-color)`。
- `--ha-slider-thumb-color`：滑块钮的颜色。默认为 `var(--primary-color)`。

滑块默认宽 200 像素，且至少 100 像素。设置元素上的 `width` 可以更改此值。

源代码：[`src/components/ha-slider.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-slider.ts)
