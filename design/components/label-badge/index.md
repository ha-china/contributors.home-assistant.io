# 标签徽章（label badge）

> 经典的圆形状态徽章，圆圈内显示数值，边缘显示简短标签。

Source: https://www.hasscn.top/contributors/design/components/label-badge/

Live demo of `ha-label-badge`, `ha-svg-icon`.

```html
<ha-label-badge label="°C" description="Living room">21</ha-label-badge>
<ha-label-badge label="%" description="Humidity" style="--ha-label-badge-color: var(--info-color)">48</ha-label-badge>
<ha-label-badge label="Error" description="Not found" style="--ha-label-badge-color: var(--error-color)">
  <ha-svg-icon path="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z"></ha-svg-icon>
</ha-label-badge>
```

## 概述

标签徽章是较旧的圆形徽章样式：圆圈内显示数值，底边显示简短标签，下方显示描述。如今它仅用于图片元素卡片的状态徽章元素。

## 何时使用

在以下情况使用标签徽章：

- 处理图片元素卡片的状态徽章元素时

在以下情况不要使用标签徽章：

- 仪表盘（dashboard）上的徽章。那些徽章使用[徽章（badge）](https://www.hasscn.top/contributors/design/components/badge/)，它具有当前的仪表盘样式。

## 结构

1. **圆圈**：圆形容器，带有彩色边框，可选背景图片
2. **数值**：圆圈内的内容，文本或图标
3. **标签**：可选，圆圈底边的彩色胶囊形标签，大写显示
4. **描述**：徽章下方的可选文本

## 变体

### 标签长度

超过五个字符的标签会使用更小的字体。

Live demo of `ha-label-badge`.

```html
<ha-label-badge label="kWh">3.2</ha-label-badge>
<ha-label-badge label="Unavailable">?</ha-label-badge>
<ha-label-badge description="Kitchen">22</ha-label-badge>
```

## 行为

- 标签徽章是静态的：它没有悬停、聚焦、按下或禁用状态。
- 对于圆圈来说过宽的数值会被省略号截断。比圆圈更宽的标签也是如此。
- 描述在 5em 宽度处被截断。
- 边框和标签颜色的变化会在 0.3 秒内淡入。

## 规格

所有尺寸都相对于字体大小，因此徽章会随周围的文本缩放。

| 属性 | 值 | Token |
| --- | --- | --- |
| 圆圈大小 | 2.5em | `--ha-label-badge-size` |
| 圆圈字体大小 | 1.5em | `--ha-label-badge-font-size` |
| 圆角半径 | 50%，圆形 | `--ha-label-badge-border-radius` |
| 边框 | 0.1em solid | `--ha-label-badge-color` |
| 标签字体大小 | 圆圈的 0.5em，超过五个字符时为其 90% | None |
| 标签圆角半径 | 12px | `--ha-border-radius-lg` |
| 标签字重 | 500 | `--ha-font-weight-medium` |
| 描述字体大小 | 0.9em | `--ha-label-badge-title-font-size` |
| 描述宽度 | 5em | `--ha-label-badge-title-width` |
| 描述上方的间距 | 1em | None |

| 部分 | 颜色 |
| --- | --- |
| 边框和标签背景 | `--ha-label-badge-color`，默认为 `--primary-color` |
| 标签文本 | `--ha-label-badge-label-color`，默认为白色 |
| 圆圈背景 | `--label-badge-background-color`，由主题设置为 `--card-background-color` |
| 数值 | `--label-badge-text-color`，由主题设置为透明度 80% 的主要文本颜色 |

## 准则

Do and don't, as live demos.

**Do:** 保持数值只有几个字符。

```html
<ha-label-badge label="°C">21</ha-label-badge>
```

**Don't:** 在圆圈内放入过长的数值。它会被截断。

```html
<ha-label-badge label="°C">21.5432</ha-label-badge>
```

Do and don't, as live demos.

**Do:** 使用简短的描述。

```html
<ha-label-badge description="Kitchen">22</ha-label-badge>
```

**Don't:** 使用过长的名称。描述会在大约五个字符宽度处被截断。

```html
<ha-label-badge description="Downstairs living room">22</ha-label-badge>
```

## 无障碍

### 键盘

标签徽章不可聚焦，也没有键盘交互。

### 屏幕阅读器

屏幕阅读器会将数值、标签和描述作为纯文本朗读。标签看起来是大写的，但会按原样朗读。作为数值的图标会被跳过。

### 在代码中

- 标签徽章没有角色（role）。
- 标签仅通过 CSS 显示为大写。
- 作为数值的图标在是 `ha-svg-icon` 时是装饰性的，它带有 `aria-hidden="true"`。

## 相关内容

- [徽章](https://www.hasscn.top/contributors/design/components/badge/)：当前的徽章
- [状态图标](https://www.hasscn.top/contributors/design/components/state-icon/)：实体（entity）的图标

## 在代码中

该元素是 `<ha-label-badge>`：

```html
<ha-label-badge label="°C" description="Living room">21</ha-label-badge>
```

### 属性

- `label`：圆圈边缘的简短文本。
- `description`：徽章下方的文本。
- `image`：圆圈背景图片的 URL，例如实体图片。

### 插槽

- 默认：圆圈内的数值。文本或图标。

### 样式

- `--ha-label-badge-color`：边框和标签背景。默认为 `var(--primary-color)`。
- `--ha-label-badge-label-color`：标签文本。默认为白色。
- `--ha-label-badge-size`：圆圈的大小。默认为 `2.5em`。
- `--ha-label-badge-font-size`：数值的字体大小。默认为 `1.5em`。
- `--ha-label-badge-border-radius`：默认为 `50%`，即圆形。
- `--ha-label-badge-padding`：整个徽章周围的内边距。
- `--ha-label-badge-label-text-transform`：默认为 `uppercase`。
- `--ha-label-badge-title-font-size`、`--ha-label-badge-title-font-weight` 和 `--ha-label-badge-title-width`：徽章下方的描述。
- `--label-badge-background-color` 和 `--label-badge-text-color`：圆圈背景和数值颜色。这些是主题变量。

Source: [`src/components/ha-label-badge.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-label-badge.ts)
