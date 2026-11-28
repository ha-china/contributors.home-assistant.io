# 警告（Alert）

> 警告用于显示简短的重要信息，且不会打断用户正在进行的操作。

Source: https://www.hasscn.top/contributors/design/components/alert/

Live demo of `ha-alert`.

```html
<ha-alert alert-type="error">Could not connect to the device.</ha-alert>
<ha-alert alert-type="warning">This update requires a restart.</ha-alert>
<ha-alert alert-type="info">You can change this later in the settings.</ha-alert>
<ha-alert alert-type="success">Backup created.</ha-alert>
```

## 概述

警告（alert）用于将注意力吸引到页面本身的一条消息上。它不会阻塞任何操作：用户可以阅读它并继续操作。它的类型通过颜色和图标显示，表明消息的严重程度。

## 何时使用

在以下情况使用警告：

- 用户需要知道的错误，以及如何处理
- 关于需要注意或可能出错的事情的警告
- 有用的上下文信息，例如提示或需要知晓的变更
- 确认某项操作已成功

不要在以下情况使用警告：

- 用户必须先做出决定才能继续操作。请使用[对话框（dialog）](https://www.hasscn.top/contributors/design/components/dialog/)。
- 某个元素旁边的简短标签或状态。请使用[徽章（badge）](https://www.hasscn.top/contributors/design/components/badge/)。
- 仅在悬停时显示的额外帮助。请使用[工具提示（tooltip）](https://www.hasscn.top/contributors/design/components/tooltip/)。

## 结构

1. **容器**：带有色调的背景，颜色与类型对应
2. **图标**：该类型的图标，或你自己的图标
3. **标题**：可选，以粗体显示在消息上方
4. **消息**：警告的文本内容
5. **操作**：可选，一个关闭按钮或你自己的操作，例如一个按钮

## 变体

### 类型

共有四种类型，每种都有自己的颜色和图标：

- **错误（Error）**：出了问题。说明是什么问题，以及如何处理。
- **警告（Warning）**：某事需要注意，或可能出错。
- **信息（Info）**：有用的上下文信息，例如提示或需要知晓的变更。这是默认类型。
- **成功（Success）**：某项操作按预期完成。

### 带标题

标题会在消息上方添加一行粗体文字。标题必须与消息一起使用，切勿单独使用。

Live demo of `ha-alert`.

```html
<ha-alert alert-type="warning" title="Restart required">This update requires a restart.</ha-alert>
```

### 可关闭或带操作

可关闭的警告会带有一个关闭按钮。你也可以在警告中放置自己的操作，例如一个撤销按钮。

Live demo of `ha-alert`, `ha-button`, connected to a demo Home Assistant.

```html
<ha-alert alert-type="info" dismissable>You can change this later in the settings.</ha-alert>
<ha-alert alert-type="success">Backup created.<ha-button slot="action" appearance="plain">Undo</ha-button></ha-alert>
```

### 窄版

在窄版中，操作会移动到消息下方而不是旁边。这适用于狭小的空间，例如卡片中。

## 行为

- 警告本身没有悬停、聚焦或按下状态。只有其中的操作（例如关闭按钮）才具有这些状态。
- 选择关闭按钮并不会移除警告。它会发送一个事件，由显示警告的页面决定后续处理，通常是将其隐藏。
- 长文本会换行，长单词会断行，因此消息总能完整显示。
- 没有标题时，图标会在消息旁边居中显示。有标题时，图标会与标题对齐。
- 警告从左到右排版，除非其标题以希伯来语或阿拉伯语开头。此时它会遵循页面的文字方向。

## 规格参数

| 属性 | 值 | Token |
| --- | --- | --- |
| 内边距 | 8px | `--ha-alert-padding` |
| 图标大小 | 24px | `--ha-alert-icon-size` |
| 图标与消息之间的间距 | 8px | 无 |
| 圆角半径 | 4px | `--ha-border-radius-sm` |
| 背景 | 类型颜色，12% 不透明度 | 见下文 |
| 标题字重 | 700 | `--ha-font-weight-bold` |
| 关闭按钮大小 | 36px | `--ha-icon-button-size` |

| 类型 | 图标 | 图标和背景颜色 |
| --- | --- | --- |
| 错误 | Alert circle outline | `--error-color`, `#db4437` |
| 警告 | Alert outline | `--warning-color`, `#ffa600` |
| 信息 | Information outline | `--info-color`, `#039be5` |
| 成功 | Checkbox marked circle outline | `--success-color`, `#43a047` |

消息文本本身没有颜色：它使用周围页面的文本颜色。

## 指南

Do and don't, as live demos.

**Do:** 说明出了什么问题，以及如何处理。

```html
<ha-alert alert-type="error">Could not connect to the device. Check that it is turned on and connected to your network.</ha-alert>
```

**Don't:** 只说出错了，而不说明细节。

```html
<ha-alert alert-type="error">An error occurred.</ha-alert>
```

Do and don't, as live demos.

**Do:** 标题与消息一起使用。

```html
<ha-alert alert-type="warning" title="Restart required">This update requires a restart.</ha-alert>
```

**Don't:** 只使用标题而不使用消息。

```html
<ha-alert alert-type="warning" title="Restart required"></ha-alert>
```

## 无障碍

### 键盘

警告本身不接收焦点。它的操作可以接收焦点：

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移动到关闭按钮或你自己的操作。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 选择当前聚焦的按钮。 |

### 目标尺寸

关闭按钮为 36px × 36px。

### 屏幕阅读器

- 当警告出现在已经打开的页面上时，大多数屏幕阅读器会立即朗读它。页面加载时已经存在的警告则不会被播报。
- 颜色和图标无法传达给使用屏幕阅读器的用户，因此文本本身必须能清楚地表明类型。
- 关闭按钮会被播报为“Dismiss alert”，使用用户的语言。

### 代码层面

- 警告具有 `alert` 角色。
- 图标是一个 `ha-svg-icon`，通过 `aria-hidden="true"` 对屏幕阅读器隐藏。
- 关闭按钮是一个图标按钮，其无障碍名称为翻译后的标签 `ui.common.dismiss_alert`。

## 相关内容

- [对话框（Dialog）](https://www.hasscn.top/contributors/design/components/dialog/)：当用户必须先做出响应才能继续时
- [徽章（Badge）](https://www.hasscn.top/contributors/design/components/badge/)：某物旁边的简短状态
- [颜色（Color）](https://www.hasscn.top/contributors/design/foundations/color/)：各类型背后的颜色
- [UI 文本（UI text）](https://www.hasscn.top/contributors/design/ui-text/)：如何撰写消息

## 代码实现

该元素为 `<ha-alert>`，通过 `alert-type` 设置类型：

```html
<ha-alert alert-type="error">Could not connect to the device.</ha-alert>
<ha-alert alert-type="warning" title="Restart required">
  This update requires a restart.
</ha-alert>
<ha-alert alert-type="success" dismissable>Backup created.</ha-alert>
```

### 属性

- `alert-type`：`info`（默认）、`warning`、`error` 或 `success`。
- `title`：标题，以粗体显示在消息上方。
- `dismissable`：显示关闭按钮。
- `narrow`：将操作放置在消息下方。

### 插槽

- 默认：消息。
- `icon`：替换该类型的图标。
- `action`：你自己的操作，例如一个按钮。它会替换关闭按钮。

### 事件

- `alert-dismissed-clicked`：选择关闭按钮时触发。在响应中移除或隐藏警告。

### 样式

- `--ha-alert-padding`：内边距。默认为 8px。
- `--ha-alert-icon-size`：图标大小。默认为 24px。

Source: [`src/components/ha-alert.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-alert.ts)
