# 仪表盘（Gauge）

> 仪表盘在半圆形刻度盘上显示单个数值，并可通过可选的颜色表示该数值的好坏程度。

Source: https://www.hasscn.top/contributors/design/components/gauge/

Live demo of `ha-gauge`.

```html
<ha-gauge value="21" min="0" max="40" label="°C" style="width: 200px; --gauge-color: var(--success-color)"></ha-gauge>
<ha-gauge value="78" label="%" style="width: 200px; --gauge-color: var(--warning-color)"></ha-gauge>
```

## 概述

仪表盘（gauge）是仪表盘卡片（gauge card）以及能源类仪表盘卡片（如自给自足率卡片）中的刻度盘。它在半圆形上显示一个数值，数字印在中间。刻度盘提供了上下文：数值在其范围内的位置，以及这个位置代表的好坏程度。

## 何时使用

在以下情况使用仪表盘：

- 单个数值位于一个已知范围内，且该数值在范围内的位置很重要，例如温度、电池电量或百分比
- 具有严重程度的数值，例如良好、警告或异常

不要在以下情况使用仪表盘：

- 设置行或列表中的电平显示。请使用[条形图（bar）](https://www.hasscn.top/contributors/design/components/bar/)，它占用的空间要少得多。
- 没有有意义的最小值和最大值的数值。此时刻度盘没有任何可展示的内容。

## 结构

1. **轨道（Track）**：空白的半圆形，即从 `min` 到 `max` 的完整范围
2. **数值弧（Value arc）**：轨道中被填充的部分，填充至数值处
3. **分段（Levels）**：轨道上可选的彩色分段
4. **指针（Needle）**：在指针模式下，取代数值弧并指向数值
5. **数值文本（Value text）**：位于中间的格式化数值和单位，或当前分段的标签

## 变体

### 带严重程度颜色的填充弧

这是默认样式。弧线填充至数值处。刻度盘的颜色可以承载含义：根据数值所在的位置，使用成功（success）、警告（warning）或错误（error）颜色。如果未设置颜色，刻度盘的填充部分则没有颜色。当数值没有好坏之分时，请使用信息（info）颜色。

Live demo of `ha-gauge`.

```html
<ha-gauge value="30" style="width: 160px; --gauge-color: var(--info-color)"></ha-gauge>
<ha-gauge value="30" style="width: 160px; --gauge-color: var(--success-color)"></ha-gauge>
<ha-gauge value="60" style="width: 160px; --gauge-color: var(--warning-color)"></ha-gauge>
<ha-gauge value="90" style="width: 160px; --gauge-color: var(--error-color)"></ha-gauge>
```

### 带分段的指针

在指针版本中，刻度盘显示指针而不是填充弧，并且可以按分段着色，这些分段称为 levels。每个分段从其自身的数值开始，延伸到下一个分段的起始值。这样可以一次性显示整个刻度，让人们既能看到数值，也能看到它距离下一个分段有多近。

Live demo of `ha-gauge`.

```html
<ha-gauge value="62" needle levels='[{"level":0,"stroke":"var(--success-color)"},{"level":50,"stroke":"var(--warning-color)"},{"level":80,"stroke":"var(--error-color)"}]' label="%" style="width: 200px"></ha-gauge>
```

分段可以带有标签。当数值落在该分段内时，标签会取代仪表盘中间的数字。当一个词语比数字更能说明问题时可以使用它，例如**低**或**高**。

如果第一个分段的起始值不是最小值，仪表盘会以信息（info）颜色添加一个从最小值到第一个分段的分段。

## 行为

- 仪表盘不可交互。它没有悬停、聚焦、按下或禁用状态。
- 当数值变化时，弧线或指针会在 1 秒内以缓动曲线移动到新位置。
- 低于最小值或高于最大值的数值会显示在刻度盘的起点或终点。文本仍显示真实数值。
- 数值文本会缩放以适应刻度盘内部的空间：最大不超过仪表盘宽度的 55% 和高度的 40%。
- 百分号会根据用户的语言采用合适的间距。其他任何单位都会显示在空格之后。
- 数值文本始终从左到右排版，即使在从右到左的语言中也是如此。

## 规格

仪表盘是一个随其宽度缩放的 SVG。以下尺寸以 SVG 单位表示，绘图区域宽 100 单位、高 55 单位。

| 属性 | 值 | Token |
| --- | --- | --- |
| 宽度 | 跟随你为元素设置的宽度，高度随之变化 | 无 |
| 弧线半径 | 40 单位 | 无 |
| 弧线和分段厚度 | 12 单位 | 无 |
| 弧线端点 | 方形 | 无 |
| 缩放前的数值文本大小 | 16px | `--ha-font-size-l` |
| 数值文本区域 | 最大为宽度的 55% 和高度的 40%，距底部 10% | 无 |
| 动画 | 1 秒，缓动 | 无 |

| 部分 | 颜色 |
| --- | --- |
| 轨道 | `--primary-background-color` |
| 数值弧 | `--gauge-color` |
| 补充的第一个分段 | `--info-color` |
| 指针 | `--primary-text-color`，带有 1 单位的 `--card-background-color` 轮廓 |
| 数值文本 | `--primary-text-color` |

## 指南

Do and don't, as live demos.

**Do:** 根据严重程度为刻度盘着色，让颜色具有含义。

```html
<ha-gauge value="78" label="%" style="width: 160px; --gauge-color: var(--warning-color)"></ha-gauge>
```

**Don't:** 省略仪表盘颜色。这样刻度盘的填充部分就没有颜色了。

```html
<ha-gauge value="78" label="%" style="width: 160px"></ha-gauge>
```

Do and don't, as live demos.

**Do:** 将单位放在 label 中。

```html
<ha-gauge value="21" min="0" max="40" label="°C" style="width: 160px; --gauge-color: var(--info-color)"></ha-gauge>
```

**Don't:** 当数值带有单位时，只显示没有单位的数字。

```html
<ha-gauge value="21" min="0" max="40" style="width: 160px; --gauge-color: var(--info-color)"></ha-gauge>
```

## 无障碍

### 键盘

仪表盘不可聚焦，也没有键盘交互。

### 屏幕阅读器

屏幕阅读器可以将数值和单位作为文本朗读。刻度盘本身及其所表示的严重程度没有文本替代：严重程度仅通过颜色显示。数值文本是不依赖颜色的部分。

### 在代码中

仪表盘没有 role，也没有 ARIA 属性。数值和单位是 SVG 文本。

## 相关内容

- [条形图（Bar）](https://www.hasscn.top/contributors/design/components/bar/)：适用于行和列表的紧凑电平显示
- [控件（Controls）](https://www.hasscn.top/contributors/design/components/controls/)：当数值可以被更改时
- [仪表盘卡片（Gauge card）](https://www.hasscn.top/contributors/design/dashboards/gauge-card/)：基于此刻度盘构建的卡片
- [颜色（Color）](https://www.hasscn.top/contributors/design/foundations/color/)：严重程度颜色

## 代码实现

该元素是 `<ha-gauge>`。请为其设置宽度；高度会随之变化。

```html
<ha-gauge
  value="21"
  min="0"
  max="40"
  label="°C"
  style="width: 200px; --gauge-color: var(--success-color)"
></ha-gauge>
```

数值会使用用户的 `locale` 进行格式化，因此请从 `hass.locale` 设置 `locale` 属性。

### 属性

- `value`：当前数值。默认为 `0`。
- `min`：刻度的起点。默认为 `0`。
- `max`：刻度的终点。默认为 `100`。
- `label`：单位，显示在数值之后。
- `needle`：显示指针而不是填充弧。
- `levels`：一个 JSON 数组，表示各个分段，每个分段包含一个 `level`、一个 `stroke` 颜色以及一个可选的 `label`。如果第一个分段的起始值不是 `min`，仪表盘会添加一个从 `min` 开始的信息颜色分段。

以下属性只能通过 property 设置：

- `locale`：用于格式化数值的区域设置数据。
- `valueText`：代替格式化数值显示的文本。仪表盘卡片使用它来显示由 Home Assistant 格式化的状态。
- `formatOptions`：用于格式化数值的 `Intl.NumberFormatOptions`。

### 样式

- `--gauge-color`：填充弧的颜色。在指针模式下不使用。
- `--primary-background-color`：刻度盘的空白部分。
- `--primary-text-color`：数值文本和指针。

来源：[`src/components/ha-gauge.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-gauge.ts)
