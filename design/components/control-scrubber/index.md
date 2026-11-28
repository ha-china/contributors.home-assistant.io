# 控制滚动条

> 一种水平控件，数值位于固定窗口下方，你拖动其后的条带。专为循环范围设计，例如灯光的色相。

Source: https://www.hasscn.top/contributors/design/components/control-scrubber/

## 概述

控制滚动条（control scrubber）是[控制](https://www.hasscn.top/contributors/design/components/controls/)系列的一员。在常规滑块中，手柄沿固定轨道移动。而在滚动条中，情况正好相反：窗口固定在中间，其后的条带移动。拖动条带来更改数值，或点击条带上的某一点，将其移到窗口下方。

条带可以比控件更宽，因此一次只能看到范围的一部分。这使得拖动的每个像素对数值的改变更小，有助于在狭小空间内进行精确选择。条带还可以循环重复，适用于循环范围，例如色相。

[瓷砖卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)的**灯光颜色**功能使用它来选择灯光的色相。

它尚未成为本站在线组件的一部分，因此这里没有演示。

## 何时使用

在以下情况使用控制滚动条：

- 循环范围内的数值，例如色相，其终点与起点相接
- 狭小空间内的大范围数值，常规控制滑块会过于粗糙

在以下情况不要使用控制滚动条：

- 表示数量，例如亮度或音量。请使用[控制滑块](https://www.hasscn.top/contributors/design/components/controls/#control-slider)，其填充部分可以显示数量。
- 表单和设置。请使用常规[滑块](https://www.hasscn.top/contributors/design/components/slider/)。

## 结构

1. **轨道（Rail）**：控件的背景，浅色调
2. **条带（Strip）**：移动的背景，例如所有色相的渐变
3. **窗口（Window）**：中间的边框，指向当前数值。它是可选的。

## 变体

### 循环

开启循环后，条带会重复，数值在两端循环。拖动超过 360 度色相后会回到 0。不开启循环时，数值会停在最小值和最大值处。

### 有窗口和无窗口

当有当前数值需要指向时，显示窗口。当没有时，例如灯光已关闭或尚无颜色时，则不显示。

### 条带宽度

默认情况下，条带与控件一样宽。将其加宽可以一次只显示范围的一部分。灯光颜色功能使色相条带的宽度至少是控件高度的三倍。

## 行为

- **拖动**：拖动条带会更改数值。向左拖动会使条带随之移动，让更高的数值来到窗口下方。拖动在水平移动 10px 后才开始，因此页面的垂直滚动仍然有效。
- **点击**：点击条带上的某一点会将该点移到窗口下方。
- **步进**：拖动时，数值跟随手指。松开时，它会吸附到最近的步长。
- **取消**：当系统取消拖动时，数值会恢复原状。
- **动效**：条带在 180ms 内以 ease-in-out 方式移动到新数值。拖动时，它无延迟地跟随。
- **禁用**：拖动、点击和键盘均无效。光标显示为不允许操作。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 高度 | 40px | `--control-scrubber-thickness` |
| 圆角半径 | 8px | `--ha-border-radius-md`，通过 `--control-scrubber-border-radius` |
| 轨道 | 20% 不透明度的禁用颜色 | `--disabled-color`，通过 `--control-scrubber-rail-color` 和 `--control-scrubber-rail-opacity` |
| 条带 | 禁用颜色，或你设置的背景 | `--control-scrubber-background` |
| 条带宽度 | 控件的宽度 | `--control-scrubber-track-width` |
| 窗口 | 2px 白色边框，宽度为高度除以 2.5（默认 16px），带小阴影 | 无 |
| 焦点环 | 2px，使用控件的颜色 | `--control-scrubber-color`，默认为 `--primary-color` |
| 动画 | 180ms，ease-in-out | 无 |

## 指南

- 为其提供标签，如有单位也一并提供，例如色相的度数。数值没有可见文本，因此标签和单位是屏幕阅读器播报的内容。
- 当没有当前数值时隐藏窗口，而不是指向一个不存在的数值。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移到滚动条 |
| <kbd>Right</kbd> 或 <kbd>Up</kbd> | 将数值增加一个步长 |
| <kbd>Left</kbd> 或 <kbd>Down</kbd> | 将数值减少一个步长 |
| <kbd>Page up</kbd> 和 <kbd>Page down</kbd> | 移动范围的 10%，如果不足一个步长则移动一个步长 |
| <kbd>Home</kbd> | 跳到最小值 |
| <kbd>End</kbd> | 跳到最大值。开启循环时，跳到其前一个步长，因为最大值与最小值相同。 |

数值在按键释放时发送。在从右到左的语言中，方向键不会互换。

### 焦点

键盘焦点会在控件周围显示一个 2px 的环，使用其自身颜色。滚动条在禁用时仍可聚焦。

### 目标尺寸

整个控件都是目标区域，默认高 40px。

### 屏幕阅读器

滚动条以滑块的形式播报，包含其标签和数值，数值带有单位格式化，例如“200°”。

### 在代码中

滚动条具有 `slider` 角色，包含来自 `label` 的 `aria-label`、`aria-valuenow`、`aria-valuemin`、`aria-valuemax`、带有格式化数值和单位的 `aria-valuetext`、`aria-orientation="horizontal"` 以及 `aria-disabled`。

## 相关内容

- [控制](https://www.hasscn.top/contributors/design/components/controls/)：控制系列的其他成员，例如控制滑块
- [颜色选择器](https://www.hasscn.top/contributors/design/components/color-picker/)：同时用于色相和饱和度的色轮
- [瓷砖卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)：滚动条出现的地方，位于灯光颜色功能中

## 代码实现

该元素为 `<ha-control-scrubber>`。通过 CSS 自定义属性设置条带的背景：

```html
<ha-control-scrubber
  wrap
  show-handle
  min="0"
  max="360"
  unit="°"
  label="Hue"
  style="--control-scrubber-track-width: 200%"
></ha-control-scrubber>
```

```css
ha-control-scrubber {
  --control-scrubber-background: linear-gradient(
    to right,
    hsl(0 100% 50%),
    hsl(120 100% 50%),
    hsl(240 100% 50%),
    hsl(360 100% 50%)
  );
}
```

### 属性（Attributes）

- `value`：当前数值。
- `min` 和 `max`：范围。默认为 `0` 和 `100`。
- `step`：步长。默认为 `1`。
- `wrap`：重复条带，并使数值在两端循环。
- `show-handle`：显示窗口。
- `round-value`：对屏幕阅读器播报的数值进行四舍五入。
- `label`：无障碍名称。
- `unit`：单位，用于屏幕阅读器播报的数值中。
- `disabled`：忽略拖动、点击和键盘操作。
- `touch-action`：条带的触摸操作。默认为 `pan-y`，因此页面仍可垂直滚动。

### 属性（Properties）

- `locale`：用于格式化数值的区域设置。

### 事件

- `value-changed`：数值已被选定，在拖动、点击之后，或在按键释放时触发。
- `slider-moved`：拖动或按住按键时的数值。松开时，它会在无数值的情况下触发。

### 样式

- `--control-scrubber-color`：焦点环。默认为 `var(--primary-color)`。
- `--control-scrubber-background`：条带。默认为 `var(--disabled-color)`。
- `--control-scrubber-rail-color` 和 `--control-scrubber-rail-opacity`：轨道。默认为 `var(--disabled-color)` 和 `0.2`。
- `--control-scrubber-thickness`：高度。默认为 `40px`。
- `--control-scrubber-border-radius`：圆角。默认为 `var(--ha-border-radius-md)`。
- `--control-scrubber-track-width`：条带的宽度。默认为 `100%`，且不能更小。
- `--control-scrubber-inset-shadow`：内阴影。默认为 `none`。

Source: [`src/components/ha-control-scrubber.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-scrubber.ts)
