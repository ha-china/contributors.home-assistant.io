# 徽章（Badge）

> 徽章以紧凑的胶囊形显示一小段状态信息，例如温度或灯的状态。

Source: https://www.hasscn.top/contributors/design/components/badge/

Live demo of `ha-badge`, `ha-svg-icon`.

```html
<ha-badge label="Living room">
  <ha-svg-icon slot="icon" path="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"></ha-svg-icon>
  21.5 °C
</ha-badge>
<ha-badge type="button">
  <ha-svg-icon slot="icon" path="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"></ha-svg-icon>
  On
</ha-badge>
<ha-badge icon-only type="button">
  <ha-svg-icon slot="icon" path="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"></ha-svg-icon>
</ha-badge>
```

## 概述

徽章（badge）让人一眼就能看到一件事：一个状态、一个数值、一个计数。仪表盘顶部的徽章就是由它实现的，例如实体（entity）徽章和能源总量徽章。它是一个紧凑的胶囊形组件，带有可选的图标、可选的标签和值。

## 何时使用

在以下情况使用徽章：

- 单一事实，例如温度、灯的状态或一个计数
- 指向更多详情的紧凑快捷方式，例如打开实体的更多信息对话框

不要在以下情况使用徽章：

- 超过一个事实。请使用卡片。
- 需要被阅读的消息，例如错误。请使用[警报（alert）](https://www.hasscn.top/contributors/design/components/alert/)。
- 与所显示的值无关的操作。请使用[按钮（button）](https://www.hasscn.top/contributors/design/components/button/)。

## 结构

1. **容器**：胶囊形，带有卡片的背景、边框和阴影
2. **图标**：可选，使用徽章颜色着色。此处的图片会显示为圆形图片。
3. **标签**：可选，位于内容上方的小号次要文本
4. **内容**：值或状态

## 变体

### 带或不带标签

标签位于内容上方，以小号次要文本显示。用它说明值是关于_什么_的，例如区域（area）或实体名称。当图标和值已经能说明清楚时，可以省略它。

Live demo of `ha-badge`.

```html
<ha-badge>21.5 °C</ha-badge>
<ha-badge label="Living room">21.5 °C</ha-badge>
```

### 徽章或按钮

默认情况下，徽章是静态的。当选中它会执行某个操作时（例如打开实体的更多信息对话框），将其设为按钮徽章。按钮徽章具有悬停和按下反馈、指针光标和键盘焦点，并且屏幕阅读器会将其播报为按钮。

Live demo of `ha-badge`.

```html
<ha-badge>Static</ha-badge>
<ha-badge type="button">Selectable</ha-badge>
```

### 仅图标

仅图标徽章会去掉标签和内容，变成一个圆形图标。仅当人们无需文字即可识别该图标时才使用。否则，请保留文字。

## 行为

- **静态**：默认类型的徽章没有悬停、焦点或按下状态。
- **悬停**：按钮徽章会获得一层徽章颜色、4% 不透明度的覆盖层。
- **按下**：按钮徽章会获得一层徽章颜色、12% 不透明度的覆盖层。
- **焦点**：获得焦点的按钮徽章会获得徽章颜色的边框和 1px 的光环。此变化耗时 180ms。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 高度和最小宽度 | 36px | `--ha-badge-size` |
| 左右内边距 | 12px | 无 |
| 左右内边距，仅图标 | 0 | 无 |
| 圆角半径 | 高度的一半，18px | `--ha-badge-border-radius` |
| 图标与文字之间的间距 | 8px | `--ha-space-2` |
| 图标大小 | 18px | `--ha-badge-icon-size` |
| 图标插槽中的图片 | 30px，圆形 | `--ha-border-radius-circle` |
| 边框宽度 | 1px | `--ha-card-border-width` |
| 标签 | 10px，字重 500，行高 10px | `--ha-font-size-xs`, `--ha-font-weight-medium` |
| 内容 | 12px，字重 500，行高 1.2 | `--ha-font-size-s`, `--ha-font-weight-medium`, `--ha-line-height-condensed` |

| 部分 | 颜色 |
| --- | --- |
| 背景 | `--ha-card-background`，回退到 `--card-background-color` |
| 边框 | `--ha-card-border-color`，回退到 `--divider-color` |
| 阴影 | `--ha-card-box-shadow`，默认无 |
| 图标、焦点边框和焦点光环 | `--badge-color`，默认为 `--secondary-text-color` |
| 标签 | `--secondary-text-color` |
| 内容 | `--primary-text-color` |

## 指南

Do and don't, as live demos.

**Do:** 内容保持为带单位的值或一个状态。

```html
<ha-badge label="Living room"><ha-svg-icon slot="icon" path="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"></ha-svg-icon>21.5 °C</ha-badge>
```

**Don't:** 在徽章中放一整句话。

```html
<ha-badge><ha-svg-icon slot="icon" path="M15 13V5A3 3 0 0 0 9 5V13A5 5 0 1 0 15 13M12 4A1 1 0 0 1 13 5V8H11V5A1 1 0 0 1 12 4Z"></ha-svg-icon>The living room is 21.5 °C</ha-badge>
```

- 徽章只保留一个事实。如果需要更多空间，请使用卡片。
- 只有当选中徽章会执行某个操作时，才将其设为按钮徽章。不要让徽章看起来可选中而实际不可。
- 关于如何书写状态和单位，请参阅 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至按钮徽章。静态徽章不可聚焦。 |

徽章本身没有按键处理器。<kbd>Enter</kbd> 或 <kbd>Space</kbd> 在按钮徽章上的行为取决于页面添加的处理器。

### 焦点

获得焦点的按钮徽章会获得徽章颜色的边框和细光环，且仅在使用键盘时显示。

### 目标大小

徽章高 36px，宽至少 36px。

### 屏幕阅读器

屏幕阅读器会读取标签和内容。按钮徽章会被播报为按钮。仅图标徽章自身没有文字，因此需要使用它的页面为其提供名称。

### 在代码中

- 按钮徽章具有 `button` 角色和 `tabindex="0"`。静态徽章没有角色，且不可聚焦。
- 焦点样式使用 `:focus-visible`。

## 相关内容

- [标签徽章（Label badge）](https://www.hasscn.top/contributors/design/components/label-badge/)：较旧的圆形徽章
- [状态图标（State icon）](https://www.hasscn.top/contributors/design/components/state-icon/)：实体徽章显示的图标
- [警报（Alert）](https://www.hasscn.top/contributors/design/components/alert/)：用于显示消息而非值

## 在代码中

该元素是 `<ha-badge>`。内容放在默认插槽中，图标放在 `icon` 插槽中。

```html
<ha-badge label="Living room">
  <ha-svg-icon slot="icon" path="..."></ha-svg-icon>
  21.5 °C
</ha-badge>

<ha-badge type="button">On</ha-badge>
```

### 属性

- `type`：`badge`（默认）或 `button`。
- `label`：内容上方的小号文字。
- `icon-only`：仅显示图标。隐藏标签和内容。

### 插槽

- 默认：徽章的内容。
- `icon`：图标，通常是 `ha-svg-icon` 或 `ha-state-icon`。此插槽中的 `img` 会显示为 30 像素的圆形图片，例如实体图片。

### 样式

- `--badge-color`：图标颜色和焦点光环颜色。默认为 `var(--secondary-text-color)`。仪表盘徽章会将其设为实体的状态颜色。
- `--ha-badge-size`：高度和最小宽度。默认为 `36px`。
- `--ha-badge-border-radius`：圆角半径。默认为尺寸的一半，使其呈胶囊形。
- `--ha-badge-font-size`：内容文字的大小。默认为 `var(--ha-font-size-s)`。
- `--ha-badge-icon-size`：图标大小。默认为 `18px`。

背景、边框和阴影遵循卡片变量（`--ha-card-background`、`--ha-card-border-color`、`--ha-card-border-width`、`--ha-card-box-shadow`），因此徽章与主题的卡片保持一致。

Source: [`src/components/ha-badge.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-badge.ts)
