# 选择框

> 选择框让人们从几个选项中挑选一个，选项以卡片形式并排显示，可容纳描述或图片。

Source: https://www.hasscn.top/contributors/design/components/select-box/

Live demo of `ha-select-box`.

```html
<ha-select-box data-props='{"options": [{"value": "single", "label": "Single", "description": "Do not start a new run. Issue a warning."}, {"value": "restart", "label": "Restart", "description": "Start a new run after first stopping the previous run."}, {"value": "queued", "label": "Queued", "description": "Start a new run after all previous runs complete."}], "value": "single"}' style="display: block; width: 100%"></ha-select-box>
```

## 概述

选择框（select box）让人们从少量选项中挑选一个，适用于需要对选项进行解释的场景。每个选项是一张卡片，包含一个单选按钮、一个标签，还可以有描述和图片。所有选项同时可见，人们可以在选择前进行比较。

前端在以下场景中使用它：

- 通用设置中的单位制：公制或美制，并附带各自单位的示例。
- 自动化（automation）的模式，每种模式都描述了当自动化仍在运行时再次触发会发生什么。
- 语音助手处理语音的方式，在设置过程中使用。

## 何时使用

在以下情况使用选择框：

- 从少量选项中挑选一个，且选项需要描述或图片

在以下情况不要使用选择框：

- 选项本身一目了然。选择框占用的空间超出所需。请改用普通下拉选择或单选列表。
- 长列表。请使用下拉选择。
- 仅仅是开或关的设置。请使用[开关](https://www.hasscn.top/contributors/design/components/switch/)。
- 选择多个选项。请使用复选框。

## 结构

1. **卡片**：选项的带边框容器。整张卡片都可以被选中。
2. **单选按钮**：显示哪个选项被选中
3. **标签**：选项的名称
4. **描述**：可选，标签下方的简短说明
5. **图片**：可选，位于文字下方，或在单列布局中位于文字旁边

## 变体

### 多列

默认情况下，选项并排显示，每行最多三个。选项更多时会换到下一行。可设置最大列数以适应内容：列数越少，较长的描述就有越多的空间。

### 单列

单列布局时，每个选项成为一行，图片位于文字旁边。当图片需要占满整个宽度时（例如宽幅预览图），可改为将图片堆叠在文字下方。

Live demo of `ha-select-box`.

```html
<ha-select-box max_columns="1" data-props='{"options": [{"value": "single", "label": "Single", "description": "Do not start a new run. Issue a warning."}, {"value": "restart", "label": "Restart", "description": "Start a new run after first stopping the previous run."}], "value": "restart"}' style="display: block; width: 100%"></ha-select-box>
```

## 行为

- **悬停**：卡片呈现分隔线颜色的浅色调。
- **已选中**：单选按钮被勾选，卡片呈现主色调 20% 的色调。
- **禁用**：禁用的选项以 50% 不透明度显示其内容和图片，且无法被选中。你也可以禁用整个选择框。
- 选择某个选项本身不会改变值。页面通过事件来设置新值。
- 过长的标签会以省略号截断。描述会换行。
- 在深色主题中，选项可以使用自己的图片。在从右到左的语言中，图片可以镜像显示。

## 规格参数

| 属性 | 值 | Token |
| --- | --- | --- |
| 选项之间的间距 | 12px | `--ha-space-3` |
| 卡片内边距 | 12px | 无 |
| 卡片边框 | 1px | `--divider-color` |
| 卡片圆角 | 12px | `--ha-border-radius-lg`，通过 `--ha-card-border-radius` |
| 单选按钮与文字之间、内容与图片之间的间距 | 8px | `--ha-space-2` |
| 标签与描述之间的间距 | 4px | `--ha-space-1` |
| 标签 | 14px，字重 400，`--primary-text-color` | `--ha-font-size-m`，`--ha-font-weight-normal` |
| 描述 | 12px，字重 400，`--secondary-text-color` | `--ha-font-size-s`，`--ha-font-weight-normal` |
| 行高 | 1.2 | `--ha-line-height-condensed` |
| 图片尺寸 | 最大 96px × 96px。堆叠时：全宽，最高 96px。 | `--ha-select-box-image-size` |
| 最大列数 | 3 | `max_columns` |

| 状态 | 卡片色调 |
| --- | --- |
| 静止 | 无 |
| 悬停 | `--divider-color`，20% 不透明度 |
| 已选中 | `--primary-color`，20% 不透明度 |
| 禁用 | `--disabled-color`，5% 不透明度，内容 50% 不透明度 |

色调变化耗时 180ms，缓动方式为 ease-in-out。

## 指南

- 标签保持简短：用一两个词命名选项，例如 **Single** 或 **Restart**。
- 用描述来解释这个选择意味着什么，用一两句话即可。
- 当图片比文字更快解释选项时使用图片，例如卡片的布局。图片是装饰性的：标签本身仍必须能表达清楚含义。

Do and don't, as live demos.

**Do:** 用一两个词命名选项，并在描述中加以解释。

```html
<ha-select-box max_columns="1" data-props='{"options": [{"value": "single", "label": "Single", "description": "Do not start a new run. Issue a warning."}], "value": "single"}' style="display: block; width: 100%"></ha-select-box>
```

**Don't:** 把整个解释都放在标签里。

```html
<ha-select-box max_columns="1" data-props='{"options": [{"value": "single", "label": "Do not start a new run and issue a warning"}], "value": "single"}' style="display: block; width: 100%"></ha-select-box>
```

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移入选项组，定位到已选中的选项，再移出选项组。 |
| 方向键 | 移动到下一个或上一个选项并选中它。会跳过禁用的选项。 |
| <kbd>Space</kbd> | 选中当前获得焦点的选项。 |

### 焦点

焦点会移动到选项组中已选中的选项。方向键会同时移动焦点和选中项。

### 目标尺寸

整张卡片都是点击目标，而不仅仅是单选按钮。

### 屏幕阅读器

选项会作为一组单选按钮播报，每个选项包含其标签和描述，以及是否被选中或禁用。选项组本身没有名称，因此请在其上方放置一个标题或标签来命名这个选择。图片会被跳过。

### 代码层面

- 选项位于一个 role 为 `radiogroup` 的组中。每个单选按钮的 role 为 `radio`，并带有 `aria-checked` 和 `aria-disabled`。
- 每个单选按钮通过其标签命名，并通过其描述进行说明，分别通过 `aria-labelledby` 和 `aria-describedby` 实现。
- 选择框自身没有标签，因此该组没有可访问名称。
- 图片的 `alt` 为空。

## 相关内容

- [开关](https://www.hasscn.top/contributors/design/components/switch/)：开或关的设置
- [选择菜单](https://www.hasscn.top/contributors/design/components/select-menu/)：为设备选择一个选项
- [选择器](https://www.hasscn.top/contributors/design/components/selector/)：选择框在表单中出现的位置

## 代码实现

该元素是 `<ha-select-box>`。选项和选中的值只能通过代码以属性（property）的形式设置：

```ts
html`
  <ha-select-box
    .options=${[
      {
        value: "single",
        label: "Single",
        description: "Do not start a new run. Issue a warning.",
      },
      {
        value: "restart",
        label: "Restart",
        description: "Start a new run after first stopping the previous run.",
      },
    ]}
    .value=${this._mode}
    @value-changed=${this._modeChanged}
  ></ha-select-box>
`;
```

选择框自身没有标签。请在其上方放置一个标题或标签来命名这个选择。

### 属性（Properties）

这些只能通过代码设置：

- `options`：选项列表。每个选项包含：
  - `value`：选项的值。必填。
  - `label`：标签。
  - `description`：简短描述，位于标签下方。
  - `image`：图片的 URL，或一个包含 `src`、`src_dark`（在深色主题中使用）和 `flip_rtl`（在从右到左的语言中镜像图片）的对象。
  - `disabled`：禁用此选项。
- `value`：选中选项的值。

### 特性（Attributes）

- `disabled`：禁用所有选项。
- `max_columns`：每行选项的最大数量。默认为 `3`。设为 `1` 时，每个选项占一行，图片位于文字旁边。
- `stacked_image`：当 `max_columns="1"` 时，将图片以全宽显示在文字下方，而不是旁边。

注意下划线：这两个特性是 `max_columns` 和 `stacked_image`，而不是 `max-columns` 和 `stacked-image`。

### 事件

- `value-changed`：当用户选择某个选项时触发。新值位于 `event.detail.value` 中。选择框不会更新自身的 `value`：需要从事件中重新设置。

### 样式

- `--ha-select-box-image-size`：图片的最大宽度和高度。默认为 `96px`。

Source: [`src/components/ha-select-box.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-select-box.ts)
