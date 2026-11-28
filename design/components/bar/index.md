# 条形图（Bar）

> 条形图显示某物的使用量，以水平轨道上填充部分的比例表示。

Source: https://www.hasscn.top/contributors/design/components/bar/

Live demo of `ha-bar`.

```html
<ha-bar value="42"></ha-bar>
```

## 概述

条形图（bar）相对于已知的最大值显示某个级别，以水平轨道上填充部分的比例表示。它在设置行和列表中、紧挨着它所代表的数字时，阅读效果很好。

## 何时使用

在以下情况使用条形图：

- 相对于已知最大值的级别，例如应用的 CPU 或内存使用率
- 某物的充满程度，例如磁盘

不要在以下情况使用条形图：

- 显示某物正在加载，但没有已知的百分比。请使用 [spinner](https://www.hasscn.top/contributors/design/components/spinner/)。
- 仪表盘（dashboard）上的传感器数值。请使用 [gauge](https://www.hasscn.top/contributors/design/components/gauge/)。

## 结构

1. **轨道（Track）**：整个宽度的背景，代表整个范围
2. **填充（Fill）**：轨道中代表数值的部分，从轨道的起点开始

## 变体

条形图本身没有变体。要显示警告和严重级别，请在数值超过阈值时更改填充的颜色，使问题更加醒目。前端在超过第一个阈值时将填充切换为警告颜色，超过第二个阈值时切换为错误颜色。请选择适合数据的阈值：系统指标在 50% 和 85% 时切换，磁盘使用率在 85% 和 95% 时切换。低于第一个阈值时，两者都使用成功颜色。

Live demo of `ha-bar`.

```html
<ha-bar value="35"></ha-bar>
<ha-bar value="70" style="--ha-bar-primary-color: var(--warning-color)"></ha-bar>
<ha-bar value="92" style="--ha-bar-primary-color: var(--error-color)"></ha-bar>
```

## 行为

- 条形图不可交互。它没有悬停、聚焦、按下或禁用状态。
- 填充是数值占最小值到最大值范围的比例，四舍五入到一位小数。超出范围的数值会被钳制，因此填充绝不会超出轨道的两端。
- 条形图占据其容器的全部宽度。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 高度 | 12px | 无 |
| 宽度 | 容器的 100% | 无 |
| 圆角半径 | 4px | `--ha-border-radius-sm`，通过 `--ha-bar-border-radius` |
| 轨道颜色 | 浅色主题中为 `#e5e5e5`，深色主题中为 `#282828` | `--secondary-background-color`，通过 `--ha-bar-background-color` |
| 填充颜色 | 主颜色 | `--primary-color`，通过 `--ha-bar-primary-color` |

## 指南

单独的条形图并不精确。请始终在旁边显示数值，例如 **42 %**，或类似 **12 GB used of 64 GB** 的句子。

Do and don't, as live demos.

**Do:** 在条形图旁边显示数字。

```html
<span>42 %</span>
<ha-bar value="42" style="display: block; width: 100%"></ha-bar>
```

**Don't:** 显示没有数值的条形图。

```html
<ha-bar value="42" style="display: block; width: 100%"></ha-bar>
```

## 无障碍

### 键盘

条形图不获取焦点，也没有键盘交互。

### 屏幕阅读器

屏幕阅读器无法从条形图中获取任何信息，因此旁边的数值是它们了解级别的唯一途径。仅凭颜色也无法让任何人知道某个数值处于警告或严重范围。条形图旁边的数字可以。

### 在代码中

条形图是一个没有 role、标签或辅助技术可用数值的 SVG。

## 相关

- [Gauge](https://www.hasscn.top/contributors/design/components/gauge/)：仪表盘上的数值
- [Spinner](https://www.hasscn.top/contributors/design/components/spinner/)：某物正在加载
- [Color](https://www.hasscn.top/contributors/design/foundations/color/)：警告和错误颜色

## 在代码中

该元素是 `<ha-bar>`。它占据其容器的全部宽度。

```html
<ha-bar value="42"></ha-bar>
<ha-bar min="-10" max="40" value="21"></ha-bar>
```

### 属性

- `value`：当前数值。超出范围的数值会被钳制。
- `min`：范围的起点。默认为 `0`。
- `max`：范围的终点。默认为 `100`。

### 样式

- `--ha-bar-primary-color`：填充部分。默认为 `var(--primary-color)`。
- `--ha-bar-background-color`：轨道。默认为 `var(--secondary-background-color)`。
- `--ha-bar-border-radius`：圆角半径。默认为 `var(--ha-border-radius-sm)`。

高度固定为 12 像素。

Source: [`src/components/ha-bar.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-bar.ts)
