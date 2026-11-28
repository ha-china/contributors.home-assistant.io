# 工具提示（Tooltip）

> 工具提示（tooltip）在您悬停或聚焦某个元素时显示关于该元素的简短提示。

Source: https://www.hasscn.top/contributors/design/components/tooltip/

Live demo of `ha-button`, `ha-tooltip`.

```html
<ha-button id="tooltip-demo-restart" appearance="filled">Restart</ha-button>
<ha-tooltip for="tooltip-demo-restart">Restarts Home Assistant. This takes about a minute.</ha-tooltip>
```

## 概述

工具提示（tooltip）在您悬停在某个元素上或将键盘焦点移到该元素上时，显示关于该元素的简短提示。它用于那些有则更好、但并非完成任务所必需的额外信息。最常见的场景：为图标按钮命名，或显示相对时间（如 **5 分钟前**）背后的完整日期。

## 何时使用

在以下情况使用工具提示：

- 为没有可见标签的图标命名
- 为简短的值提供额外细节，例如相对时间背后的完整日期

不要在以下情况使用工具提示：

- 任何必不可少的内容，例如说明或错误信息。工具提示仅在悬停和键盘聚焦时显示，而在触摸屏上很难或无法触达。请将这些内容直接放在屏幕上，以文本或[警告（alert）](https://www.hasscn.top/contributors/design/components/alert/)的形式呈现。
- 链接、按钮或其他交互内容。用户无法触达它们。

## 结构

1. **目标（Target）**：工具提示所指向的元素，通过 `for` 指定
2. **主体（Body）**：承载工具提示文本的表面。默认没有箭头。

## 变体

### 位置

工具提示默认位于其目标上方。也可以放置在其他侧面，例如下方或右侧。当空间不足时，它会翻转到另一侧或进行偏移。

Live demo of `ha-svg-icon`, `ha-tooltip`.

```html
<ha-svg-icon id="tooltip-demo-info" path="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" tabindex="0"></ha-svg-icon>
<ha-tooltip for="tooltip-demo-info" placement="right">Measured every 30 seconds</ha-tooltip>
```

## 行为

- **悬停（Hover）**：指针进入目标 350 毫秒后显示工具提示，离开 150 毫秒后隐藏。将指针从目标移动到工具提示上会使其保持打开。
- **聚焦（Focus）**：目标获得焦点时显示工具提示，失去焦点时隐藏。
- **关闭（Dismiss）**：按 <kbd>Escape</kbd> 可隐藏已打开的工具提示。在目标之外的任意位置按下也同样有效。
- **禁用（Disabled）**：被禁用的工具提示不会显示。
- 工具提示的出现和消失没有动画。
- 文本在 30 个字符宽度处换行。

## 规格参数

| 属性 | 值 | 令牌（Token） |
| --- | --- | --- |
| 背景 | 默认表面颜色 | `--ha-color-surface-default`，通过 `--ha-tooltip-background-color` |
| 文本颜色 | 主要文本颜色 | `--primary-text-color`，通过 `--ha-tooltip-text-color` |
| 字体大小 | 14px | `--ha-font-size-m`，通过 `--ha-tooltip-font-size` |
| 字体粗细 | 500 | `--ha-font-weight-medium`，通过 `--ha-tooltip-font-weight` |
| 行高 | 1.2 | `--ha-line-height-condensed`，通过 `--ha-tooltip-line-height` |
| 内边距 | 上下 0.25em，左右 0.5em | 无 |
| 圆角半径 | 8px | `--ha-border-radius-md`，通过 `--ha-tooltip-border-radius` |
| 阴影 | 中等阴影 | `--ha-box-shadow-m`，通过 `--ha-tooltip-box-shadow` |
| 边框 | 无，0px | 无 |
| 箭头 | 无，0px | `--ha-tooltip-arrow-size` |
| 与目标的距离 | 8px | 无 |
| 最大宽度 | 30ch | 无 |
| 堆叠顺序 | 1000 | 无 |
| 显示和隐藏延迟 | 350 毫秒和 150 毫秒 | 无 |

## 指南

Do and don't, as live demos.

**Do:** Use a tooltip to name an icon without a label.

```html
<ha-svg-icon id="tooltip-do-info" path="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" tabindex="0"></ha-svg-icon>
<ha-tooltip for="tooltip-do-info">Measured every 30 seconds</ha-tooltip>
```

**Don't:** Repeat the visible label. It adds nothing.

```html
<ha-button id="tooltip-dont-save">Save</ha-button>
<ha-tooltip for="tooltip-dont-save">Save</ha-tooltip>
```

- 保持为一句话或几个词。
- 绝不要在工具提示中放置必不可少的内容，例如说明或错误信息。
- 不要包含链接、按钮或其他交互内容。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移到目标上会显示工具提示。将焦点移开则隐藏它。 |
| <kbd>Escape</kbd> | 隐藏已打开的工具提示。 |

目标元素必须可聚焦，键盘用户才能看到工具提示。图标本身是不可聚焦的。

### 屏幕阅读器

工具提示的文本会成为其目标的名称。这对于没有标签的图标非常有效。对于带有可见标签的目标，屏幕阅读器会读取工具提示文本而不是该标签。

### 在代码中

- 本页的演示为图标添加了 `tabindex="0"` 以使其可聚焦。
- 工具提示会将自己的 `id` 添加到目标的 `aria-labelledby` 中。这使工具提示文本成为目标的无障碍名称，这对于没有标签的图标非常有效。对于带有可见标签的目标，屏幕阅读器会读取工具提示文本而不是该标签。
- 工具提示主体本身没有 role。

## 相关内容

- [警告（Alert）](https://www.hasscn.top/contributors/design/components/alert/)：用于用户需要了解的信息
- [按钮（Button）](https://www.hasscn.top/contributors/design/components/button/)：工具提示的常见目标

## 在代码中

该元素是 `<ha-tooltip>`。它基于 [Web Awesome tooltip](https://webawesome.com/docs/components/tooltip/)。为目标指定一个 `id`，并通过 `for` 将工具提示指向它：

```html
<ha-svg-icon id="help-icon" path="..."></ha-svg-icon>
<ha-tooltip for="help-icon">Measured every 30 seconds</ha-tooltip>
```

### 属性

- `for`：目标元素的 `id`。目标必须位于同一文档或 shadow root 中。
- `placement`：`top`（默认）、`bottom`、`left`、`right`，或这些值加上 `-start` 或 `-end`，例如 `top-start`。
- `distance`：工具提示与目标之间的间距，以像素为单位。默认为 `8`。
- `show-delay`：显示前的毫秒数。默认为 `350`。
- `hide-delay`：隐藏前的毫秒数。默认为 `150`。
- `trigger`：什么操作会打开工具提示。默认为 `hover focus`。也接受 `click` 和 `manual`。
- `disabled`：阻止工具提示显示。
- `open`：显示工具提示。

### 插槽（Slot）

- 默认：工具提示文本。

### 样式

- `--ha-tooltip-background-color`：默认为 `var(--ha-color-surface-default)`。
- `--ha-tooltip-text-color`：默认为 `var(--primary-text-color)`。
- `--ha-tooltip-font-size`：默认为 `var(--ha-font-size-m)`。
- `--ha-tooltip-line-height`：默认为 `var(--ha-line-height-condensed)`。
- `--ha-tooltip-border-radius`：默认为 `var(--ha-border-radius-md)`。
- `--ha-tooltip-arrow-size`：默认为 `0px`，因此没有箭头。
- `--ha-tooltip-box-shadow`：默认为 `var(--ha-box-shadow-m)`。
- `--ha-tooltip-animation-duration`：默认为 `0`，因此出现时没有动画。

`ha-tooltip` 还会在 Web Awesome tooltip 上设置 `--ha-tooltip-font-family`、`--ha-tooltip-font-weight` 和 `--ha-tooltip-padding`。当前使用的 Web Awesome 版本不会读取这些变量所提供的值，因此它们没有可见效果。

源码：[`src/components/ha-tooltip.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-tooltip.ts)
