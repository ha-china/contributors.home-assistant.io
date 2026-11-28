# 进度按钮

> 一种按钮，能显示其操作正在运行，以及运行是否成功。

Source: https://www.hasscn.top/contributors/design/components/progress-button/

Live demo of `ha-progress-button`.

```html
<ha-progress-button>Restart</ha-progress-button>
<ha-progress-button progress>Restart</ha-progress-button>
```

## 概述

进度按钮是一种[按钮](https://www.hasscn.top/contributors/design/components/button/)，用于需要一点时间并在原地完成的操作：保存设置、运行测试、调用动作（action）。当操作运行时，它会显示一个加载指示器（spinner）。完成后，它会在绿色按钮上短暂显示一个对勾图标，或在红色按钮上显示一个警告图标。两秒后，它会恢复正常。

## 何时使用

在以下情况使用进度按钮：

- 需要一点时间的操作，且结果没有其他地方可以显示，例如**测试连接**或**重启**

在以下情况不要使用进度按钮：

- 会打开对话框或跳转到其他页面的操作。使用普通的[按钮](https://www.hasscn.top/contributors/design/components/button/)即可。
- 显示需要用户阅读的错误。红色闪烁只表示操作*失败*了，而不是*为什么*失败。请同时显示错误，例如在[警告框（alert）](https://www.hasscn.top/contributors/design/components/alert/)中。

## 结构

进度按钮是一个普通按钮外加一层额外的层：

1. **按钮**：普通按钮，包含其容器、可选图标和标签
2. **加载指示器**：在操作运行时替代标签
3. **结果图标**：操作结束后显示在按钮之上，成功时为对勾图标，出错时为警告图标

## 变体

进度按钮具有与普通按钮相同的外观（appearance）、变体（variant）和尺寸，因此可以与普通按钮并排使用。在进度进行和显示结果期间，它会切换为强调（accent）外观。

Live demo of `ha-progress-button`.

```html
<ha-progress-button appearance="filled">Test</ha-progress-button>
<ha-progress-button appearance="plain">Skip</ha-progress-button>
<ha-progress-button variant="danger">Delete</ha-progress-button>
<ha-progress-button size="s">Check</ha-progress-button>
```

## 行为

- **静止**：外观和行为与具有相同外观、变体和尺寸的普通按钮一样。
- **进行中**：按钮切换为强调（accent）外观，并显示加载指示器替代其标签。它会忽略指针输入，因此用户无法重复启动该操作。
- **成功**：按钮变为成功（success）变体，一个白色对勾图标覆盖已淡化的标签，持续两秒。
- **错误**：按钮变为危险（danger）变体，一个白色警告图标覆盖已淡化的标签，持续两秒。
- **禁用**：与被禁用的普通按钮一样。

成功和错误状态只能通过代码触发，因此这里没有展示。

悬停、聚焦和按下状态与[按钮](https://www.hasscn.top/contributors/design/components/button/#behavior)相同。

## 规格

尺寸、间距和颜色与[按钮](https://www.hasscn.top/contributors/design/components/button/#specs)相同。除此之外：

| 属性 | 值 | Token |
| --- | --- | --- |
| 进行中和结果期间的外观 | Accent | None |
| 成功时的变体 | Success | `--ha-color-fill-success-loud-resting` |
| 出错时的变体 | Danger | `--ha-color-fill-danger-loud-resting` |
| 结果图标颜色 | 白色 | `--white-color` |
| 结果图标尺寸 | 24px | None |
| 超小和小尺寸下的图标尺寸 | 16px | `--mdc-icon-size` |
| 结果持续时间 | 2 秒 | None |

## 指南

Do and don't, as live demos.

**Do:** 说明选择按钮后会发生什么。

```html
<ha-progress-button>Test connection</ha-progress-button>
```

**Don't:** 使用含义不明的标签。

```html
<ha-progress-button>OK</ha-progress-button>
```

- 保持标签简短，并说明会发生什么：**保存**、**重启**、**测试连接**。参见 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。
- 当操作可能因需要用户阅读的错误而失败时，请同时显示该错误，例如在[警告框（alert）](https://www.hasscn.top/contributors/design/components/alert/)中。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移到按钮上，或从按钮移开。被禁用的按钮会被跳过。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 选择按钮。在显示进度时不执行任何操作。 |

### 目标尺寸

与[按钮](https://www.hasscn.top/contributors/design/components/button/#target-size)相同：默认尺寸下高度为 40px。

### 屏幕阅读器

按钮会连同其标签一起被播报，在显示结果时也是如此。在进度进行期间，它会被播报为忙碌。成功和错误状态只改变外观：不会有任何播报，因此对于用户需要了解的错误，请同时以文本形式显示。

### 代码层面

- 角色为 `button`，来自内部的 `<ha-button>`。
- 当结果图标显示时，标签是淡出而不是隐藏，因此按钮保留其可访问名称。
- 在进度进行期间，内部按钮具有 `aria-busy="true"`。

## 相关内容

- [按钮](https://www.hasscn.top/contributors/design/components/button/)：本组件所包装的普通按钮
- [加载指示器](https://www.hasscn.top/contributors/design/components/spinner/)：独立显示进度
- [警告框](https://www.hasscn.top/contributors/design/components/alert/)：显示需要用户阅读的错误

## 代码

该元素为 `<ha-progress-button>`。它包装了 `<ha-button>`。在操作运行期间设置 `progress`，完成后调用 `actionSuccess()` 或 `actionError()`：

```html
<ha-progress-button>Restart</ha-progress-button>
```

```ts
private async _restart(ev) {
  const button = ev.currentTarget;
  button.progress = true;
  try {
    await doTheThing();
    button.actionSuccess();
  } catch (err) {
    button.actionError();
  } finally {
    button.progress = false;
  }
}
```

当设置了 `progress` 时，按钮会忽略指针输入，因此用户无法重复启动该操作。

### 属性

- `progress`：显示加载指示器。以属性（attribute）形式反映。
- `disabled`：禁用按钮。
- `appearance`：`accent`（默认）、`filled`、`outlined` 或 `plain`。
- `variant`：`brand`（默认）、`neutral`、`success`、`warning` 或 `danger`。
- `size`：`xs`、`s`、`m`（默认）、`l` 或 `xl`。
- `label`：标签，在默认插槽为空时使用。

以下只能作为属性（property）设置：

- `iconPath`：标签前图标的 SVG 路径数据。

### 插槽

- 默认：标签。

### 方法

- `actionSuccess()`：显示成功状态两秒。
- `actionError()`：显示错误状态两秒。

源码：[`src/components/buttons/ha-progress-button.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/buttons/ha-progress-button.ts)
