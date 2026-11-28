# 控件

> 用于操作设备的大型、触控友好的控件，例如更多信息对话框中的开关和滑块。

Source: https://www.hasscn.top/contributors/design/components/controls/

Live demo of `ha-control-switch`, `ha-svg-icon`, `ha-control-slider`, `ha-control-circular-slider`.

```html
<ha-control-switch vertical reversed checked label="Light" style="height: 280px; --control-switch-thickness: 110px; --control-switch-border-radius: var(--ha-border-radius-6xl); --control-switch-padding: 6px; --mdc-icon-size: 24px">
  <ha-svg-icon slot="icon-on" path="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"></ha-svg-icon>
  <ha-svg-icon slot="icon-off" path="M12,2C9.76,2 7.78,3.05 6.5,4.68L16.31,14.5C17.94,13.21 19,11.24 19,9A7,7 0 0,0 12,2M3.28,4L2,5.27L5.04,8.3C5,8.53 5,8.76 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H14.73L18.73,22L20,20.72L3.28,4M9,20V21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9Z"></ha-svg-icon>
</ha-control-switch>
<ha-control-slider vertical value="60" unit="%" label="Brightness" style="height: 280px; --control-slider-thickness: 110px; --control-slider-border-radius: var(--ha-border-radius-6xl)"></ha-control-slider>
<ha-control-circular-slider value="21" current="19" min="10" max="30" step="0.5" label="Target temperature" style="width: 240px"></ha-control-circular-slider>
```

## 概述

控件（control）系列专为手动操作设备而设计，无论是用手指还是用鼠标都能轻松使用。这些控件体积大、点击区域大，并且对拖动和滑动都有响应，而不仅仅是点按。你可以在两个地方找到它们：

- 在**更多信息对话框**中，一个大型控件占据中心位置：灯的垂直亮度滑块、圆形恒温器转盘、开关的切换按钮。
- 在**磁贴卡片（tile card）的功能区**中，一个更小的水平版本位于实体（entity）下方，例如亮度滑块或一排模式按钮。

## 何时使用

在以下情况使用控件：

- 屏幕的主要任务是改变设备的状态
- 磁贴卡片的一项功能

不要在以下情况使用控件：

- 表单和设置。请改用常规的表单控件，例如[按钮](https://www.hasscn.top/contributors/design/components/button/)、[开关](https://www.hasscn.top/contributors/design/components/switch/)或[滑块](https://www.hasscn.top/contributors/design/components/slider/)。这一系列的控件放在设置表单中会显得格格不入，而且占用的空间远超所需。
- 选项繁多的设备的次要设置。请使用[选择菜单](https://www.hasscn.top/contributors/design/components/select-menu/)。

## 结构

所有控件共享相同的外观：

1. **轨道**：圆角形状，带有颜色的浅色调
2. **活动部分**：全色部分，例如滑块的填充、开关的旋钮，或选中的选项
3. **内容**：图标、数值或标签，取决于具体的控件

它们的颜色可以设置，以便与实体的状态相匹配，例如灯的颜色。

## 变体

### 控件按钮

一个带图标的方形按钮，用于单一操作，例如**打开**、**停止**或**上锁**。它是构建操作行的基础模块，例如卷帘的打开、停止和关闭按钮。

Live demo of `ha-control-button`, `ha-svg-icon`.

```html
<ha-control-button label="Open" style="width: 64px; height: 64px; --control-button-border-radius: var(--ha-border-radius-xl); --mdc-icon-size: 24px">
  <ha-svg-icon path="M7,15L12,10L17,15H7Z"></ha-svg-icon>
</ha-control-button>
<ha-control-button label="Stop" style="width: 64px; height: 64px; --control-button-border-radius: var(--ha-border-radius-xl); --mdc-icon-size: 24px">
  <ha-svg-icon path="M18,18H6V6H18V18Z"></ha-svg-icon>
</ha-control-button>
<ha-control-button label="Close" style="width: 64px; height: 64px; --control-button-border-radius: var(--ha-border-radius-xl); --mdc-icon-size: 24px">
  <ha-svg-icon path="M7,10L12,15L17,10H7Z"></ha-svg-icon>
</ha-control-button>
<ha-control-button label="Disabled" disabled style="width: 64px; height: 64px; --control-button-border-radius: var(--ha-border-radius-xl); --mdc-icon-size: 24px">
  <ha-svg-icon path="M18,18H6V6H18V18Z"></ha-svg-icon>
</ha-control-button>
```

前端有一个单独的分组组件，用于将控件按钮排成一行或一列。这些演示中不可用。

### 控件开关

一个大型的开和关切换开关。用于设备的主开关。在更多信息对话框中，它竖立放置并且方向反转，因此“开”位于顶部。在磁贴卡片功能区中，它平放。

Live demo of `ha-control-switch`, `ha-svg-icon`.

```html
<ha-control-switch label="Power" style="width: 240px; height: 42px">
  <ha-svg-icon slot="icon-on" path="M7,2V13H10V22L17,10H13L17,2H7Z"></ha-svg-icon>
  <ha-svg-icon slot="icon-off" path="M17,10H13L17,2H7V4.18L15.46,12.64M3.27,3L2,4.27L7,9.27V13H10V22L13.58,15.86L17.73,20L19,18.73L3.27,3Z"></ha-svg-icon>
</ha-control-switch>
<ha-control-switch checked label="Power" style="width: 240px; height: 42px">
  <ha-svg-icon slot="icon-on" path="M7,2V13H10V22L17,10H13L17,2H7Z"></ha-svg-icon>
  <ha-svg-icon slot="icon-off" path="M17,10H13L17,2H7V4.18L15.46,12.64M3.27,3L2,4.27L7,9.27V13H10V22L13.58,15.86L17.73,20L19,18.73L3.27,3Z"></ha-svg-icon>
</ha-control-switch>
```

### 控件滑块

一个粗滑块，用于表示某个范围内的数值，例如亮度、音量或卷帘的位置。当有人拖动它时，工具提示会显示该数值。

模式（mode）决定了数值的绘制方式：

- **Start**（默认）：从起点开始填充。用于表示数量，例如亮度。
- **End**：从终点开始填充。卷帘位置滑块使用它，因此进度条从顶部向下延伸，就像卷帘本身一样。
- **Cursor**：只显示一个标记，没有填充。当没有“更多”或“更少”的概念时使用，例如色温或倾斜角度。

Live demo of `ha-control-slider`.

```html
<ha-control-slider vertical value="70" label="Start" style="height: 240px; --control-slider-thickness: 90px; --control-slider-border-radius: var(--ha-border-radius-6xl)"></ha-control-slider>
<ha-control-slider vertical mode="end" value="70" label="End" style="height: 240px; --control-slider-thickness: 90px; --control-slider-border-radius: var(--ha-border-radius-6xl)"></ha-control-slider>
<ha-control-slider vertical mode="cursor" value="70" label="Cursor" style="height: 240px; --control-slider-thickness: 90px; --control-slider-border-radius: var(--ha-border-radius-6xl)"></ha-control-slider>
```

水平版本是磁贴卡片功能区所使用的：

Live demo of `ha-control-slider`.

```html
<ha-control-slider value="40" unit="%" label="Brightness" style="width: 320px; --control-slider-thickness: 42px"></ha-control-slider>
```

### 控件圆形滑块

一个圆形转盘，底部开口，用于目标值，例如温度或湿度。它还可以在轨道上以一个小圆点显示当前值，让人们看到自己当前的位置和目标位置。

转盘本身不显示任何文字。在更多信息对话框中，目标值和当前值由周围的组件打印在转盘中央。

模式决定了轨道的哪一部分被填充，与滑块相同。恒温器在制热时从起点填充，在制冷时从终点填充，在方向无关紧要时填充整个轨道。在双模式版本中，转盘有两个手柄，一个低值手柄和一个高值手柄，用于同时制热和制冷这样的范围。

Live demo of `ha-control-circular-slider`.

```html
<ha-control-circular-slider value="21" current="19" min="10" max="30" step="0.5" label="Heat to" style="width: 200px; --control-circular-slider-color: var(--state-climate-heat-color, #ff8100)"></ha-control-circular-slider>
<ha-control-circular-slider mode="end" value="23" current="26" min="10" max="30" step="0.5" label="Cool to" style="width: 200px; --control-circular-slider-color: var(--state-climate-cool-color, #2b9af9)"></ha-control-circular-slider>
<ha-control-circular-slider dual low="19" high="24" current="21" min="10" max="30" step="0.5" low-label="Heat to" high-label="Cool to" style="width: 200px; --control-circular-slider-low-color: var(--state-climate-heat-color, #ff8100); --control-circular-slider-high-color: var(--state-climate-cool-color, #2b9af9)"></ha-control-circular-slider>
```

### 控件数字按钮

一个带有减号和加号按钮的数值，用于小幅度、精确的调整。磁贴卡片的目标温度功能就使用它。当人们只需将数值调整一两步，而不是在整个范围内跳转时，请使用它。

Live demo of `ha-control-number-buttons`.

```html
<ha-control-number-buttons value="21" min="10" max="30" step="0.5" unit="°C" label="Target temperature" style="width: 220px; height: 42px"></ha-control-number-buttons>
<ha-control-number-buttons value="21" min="10" max="30" step="0.5" unit="°C" label="Target temperature" disabled style="width: 220px; height: 42px"></ha-control-number-buttons>
```

### 控件选择

一行或一列选项，其中一个是选中状态，例如风扇的速度或警报面板的模式。每个选项显示一个图标、一个标签，或两者兼有。选中的选项以该颜色填充。

用于人们经常切换的少量选项。在更多信息对话框中，它竖立放置，每步一个选项。对于选项更多的次要设置，例如恒温器的预设或摆动模式，更多信息对话框会改用[选择菜单](https://www.hasscn.top/contributors/design/components/select-menu/)。

选项只能通过代码设置，因此这里没有实时演示。

## 行为

- **悬停**：控件开关轨道的色调会加深，从 20% 到 40%。控件选择的选项会获得 20% 的颜色色调。
- **聚焦**：键盘聚焦会在控件周围显示一个 2px 的圆环。控件开关、滑块和选择使用它们自己的颜色作为圆环颜色。控件按钮和数字按钮使用次要文字颜色。圆形滑块通过加粗聚焦的弧线来显示聚焦状态，从 24px 到 28px。
- **按下**：当有人拖动滑块时，会显示带数值的工具提示。松开时隐藏。使用键盘时，按键期间显示，按键释放半秒后隐藏。
- **滑动**：控件开关可以通过沿其方向的滑动来打开或关闭，点按则切换状态。
- **禁用**：每个控件都有自己的处理方式：
  - 控件按钮将其图标变为禁用文字颜色，背景为禁用颜色的 20% 色调。
  - 控件开关变暗至 50% 不透明度。
  - 控件选择将其文字和选中选项变为禁用颜色。
  - 数字按钮将其文字变为禁用颜色。减号和加号按钮变暗至 40%。
  - 圆形滑块只显示其轨道和当前值圆点，不显示彩色弧线和手柄。
  - 控件滑块忽略拖动和点按，但没有单独的外观。
- **限制**：减号和加号按钮在最小值和最大值处自行禁用。当数字按钮宽度小于 100 像素时，单位会被隐藏。
- **未激活**：对于已关闭的设备，圆形滑块可以隐藏彩色弧线。
- **只读**：只读的圆形滑块显示其数值，但忽略拖动和点按。键盘仍然可以更改数值。

大多数过渡耗时 180ms，缓动方式为 ease-in-out。圆形滑块的弧线移动耗时 300ms。

## 规格

### 默认尺寸

所有控件都会填满其容器。以下默认值是在未设置尺寸时的效果。

| 控件 | 默认尺寸 | 圆角 | Token |
| --- | --- | --- | --- |
| 控件按钮 | 40px × 40px，8px 内边距 | 8px | `--ha-border-radius-md`，通过 `--control-button-border-radius` |
| 控件开关 | 40px 粗 | 12px | `--ha-border-radius-lg`，通过 `--control-switch-border-radius` |
| 控件滑块 | 40px 粗 | 8px | `--ha-border-radius-md`，通过 `--control-slider-border-radius` |
| 控件圆形滑块 | 320px 宽 | 圆形轨道端点 | 无 |
| 控件数字按钮 | 卡片功能区的高度，按钮 35px 宽 | 8px | `--ha-border-radius-md`，通过 `--control-number-buttons-border-radius` |
| 控件选择 | 40px 粗，4px 内边距 | 10px | `--control-select-border-radius` |

在更多信息对话框中，垂直控件厚度为 130 像素，高度最高 320 像素，圆角为 36px（`--ha-border-radius-6xl`）。在磁贴卡片功能区中，水平控件厚度为 42 像素。位于磁贴卡片图标旁边的内联功能区保持图标的高度，即 36 像素，除非卡片为它保留了一行。

### 颜色

| 部分 | 颜色 | Token |
| --- | --- | --- |
| 轨道色调 | 禁用颜色，20% 不透明度（圆形滑块为 30%） | `--disabled-color` |
| 活动部分 | 主颜色 | `--primary-color`，通过每个控件的 color 属性 |
| 控件按钮的图标 | 主要文字颜色 | `--primary-text-color`，通过 `--control-button-icon-color` |
| 控件开关的旋钮图标 | 白色 | 无 |
| 控件选择选中选项的文字 | 白色 | 无 |
| 滑块和圆形滑块的手柄 | 白色 | 无 |
| 圆形滑块的当前值圆点 | 主要文字颜色，50% 不透明度 | `--primary-text-color` |
| 滑块工具提示 | 透明背景、主要文字颜色、12px 圆角 | `--clear-background-color`、`--ha-border-radius-lg` |

### 其他部分

| 属性 | 值 | Token |
| --- | --- | --- |
| 图标大小 | 20px，数字按钮为 16px | `--mdc-icon-size` |
| 开关旋钮 | 轨道的一半，内缩 4px | `--control-switch-padding` |
| 开关的最小触控区域 | 40px | `--control-switch-min-touch-size` |
| 圆形滑块轨道 | 24px 宽，270 度，底部开口 | 无 |
| 圆形滑块周围的额外点击区域 | 12px | `--control-circular-slider-interaction-margin` |
| 滑块手柄 | 4px 宽，需启用 `show-handle` | 无 |

## 指南

为每个控件提供标签。大多数控件只显示图标或数值，而标签是屏幕阅读器播报的内容。

## 无障碍

### 键盘

| 控件 | 按键 |
| --- | --- |
| 控件按钮 | <kbd>Tab</kbd> 聚焦，<kbd>Enter</kbd> 或 <kbd>Space</kbd> 选择。它是一个原生按钮。 |
| 控件开关 | <kbd>Enter</kbd> 或 <kbd>Space</kbd> 切换。沿其方向的箭头键将其打开或关闭，遵循开关的朝向和文字方向。 |
| 控件滑块 | 箭头键移动一步。<kbd>Page up</kbd> 和 <kbd>Page down</kbd> 移动范围的 10%。<kbd>Home</kbd> 和 <kbd>End</kbd> 跳到最小值和最大值。在从右到左的语言中，左右方向互换。 |
| 控件圆形滑块 | 与控件滑块相同的按键，作用于每个手柄。 |
| 控件数字按钮 | 与控件滑块相同的按键。减号和加号按钮不在 Tab 顺序中：键盘直接作用于数值。 |
| 控件选择 | <kbd>Tab</kbd> 聚焦选中的选项，若未选中任何选项则聚焦第一个。箭头键在选项之间移动焦点，<kbd>Enter</kbd> 或 <kbd>Space</kbd> 选中当前聚焦的选项。 |

只有控件滑块会在从右到左的语言中互换左右箭头键。圆形滑块和数字按钮不会。

### 聚焦

键盘聚焦会在控件周围显示一个 2px 的圆环，或在圆形滑块上显示更粗的弧线。颜色请参见[行为](https://www.hasscn.top/contributors/design/components/controls/#behavior)。

禁用的控件开关或数字按钮会退出 Tab 顺序。禁用的控件选择会保留一个选项在 Tab 顺序中，但忽略按键和选择。控件滑块在禁用时仍可聚焦，并继续响应键盘。

### 目标尺寸

控件按钮、开关、滑块和选择在最小方向上默认为 40px。控件开关保持至少 40px × 40px 的触控区域。圆形滑块在其轨道周围增加 12px 的点击区域。

### 屏幕阅读器

每个控件都通过其标签播报，并附带其类型和数值：一个按钮、一个开或关的开关、一个带格式化数值的滑块、一个带数值和单位的数字输入框，或一个带选中选项的单选按钮组。数字按钮的减号和加号按钮以英文播报，为 "decrement" 和 "increment"。在双模式圆形滑块上，两个手柄都以低值标签播报。

### 在代码中

| 控件 | 角色 | 名称和状态 |
| --- | --- | --- |
| 控件按钮 | `button` | `label` 作为 `aria-label`，并作为原生工具提示 |
| 控件开关 | `switch` | `label` 作为 `aria-label`，`aria-checked`。旋钮及其图标对屏幕阅读器隐藏。 |
| 控件滑块 | `slider` | `label` 作为 `aria-label`，`aria-valuenow`、`aria-valuemin`、`aria-valuemax`、`aria-orientation`，以及带格式化数值的 `aria-valuetext` |
| 控件圆形滑块 | 每个手柄上为 `slider` | `low-label`，或在没有 `low-label` 时使用 `label`，作为两个手柄的 `aria-label`（不使用 `high-label`），`aria-valuenow` 来自 `value`（使用 `dual` 时没有），`aria-valuemin`、`aria-valuemax`、`aria-disabled`，以及 `aria-readonly` |
| 控件数字按钮 | `spinbutton` | `label` 作为 `aria-label`，`aria-valuenow`、`aria-valuemin`、`aria-valuemax`，以及带数值和单位的 `aria-valuetext`。减号和加号按钮命名为 "decrement" 和 "increment"。 |
| 控件选择 | `radiogroup`，每个选项一个 `radio` | `label` 命名该组。每个选项由其 `ariaLabel` 或 `label` 命名，并具有 `aria-checked`。 |

## 相关内容

- [选择菜单](https://www.hasscn.top/contributors/design/components/select-menu/)：控件系列中的下拉菜单
- [控件拖动条](https://www.hasscn.top/contributors/design/components/control-scrubber/)：控件系列中用于循环范围的成员，例如色相
- [滑块](https://www.hasscn.top/contributors/design/components/slider/)、[开关](https://www.hasscn.top/contributors/design/components/switch/)和[按钮](https://www.hasscn.top/contributors/design/components/button/)：常规表单控件
- [磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)：较小控件作为功能区出现的地方

## 在代码中

所有控件默认填满其容器。使用 CSS 设置尺寸：在元素上设置 `height` 和 `width`，并在有厚度自定义属性的地方设置它。垂直控件的宽度来自厚度，需要另外设置高度。

在更多信息对话框中，垂直控件厚度为 130 像素，高度最高 320 像素，圆角为 `--ha-border-radius-6xl`。在磁贴卡片功能区中，水平控件厚度为 42 像素。

### ha-control-button

```html
<ha-control-button label="Open">
  <ha-svg-icon path="..."></ha-svg-icon>
</ha-control-button>
```

属性：

- `label`：无障碍名称，也显示为原生工具提示。
- `disabled`：禁用按钮。

插槽：

- 默认：内容，通常是一个 `ha-svg-icon`。

事件：监听常规的 `click` 事件。

样式：

- `--control-button-icon-color`：默认为 `var(--primary-text-color)`。
- `--control-button-background-color`：默认为 `var(--disabled-color)`。
- `--control-button-background-opacity`：默认为 `0.2`。
- `--control-button-border-radius`：默认为 `var(--ha-border-radius-md)`。
- `--control-button-focus-color`：聚焦圆环。默认为 `var(--secondary-text-color)`。
- `--control-button-padding`：默认为 `8px`。
- `--control-button-font-weight`：用于文字标签。默认为 `var(--ha-font-weight-medium)`。
- `--mdc-icon-size`：图标大小。默认为 `20px`。

默认尺寸为 40 × 40 像素。

### ha-control-switch

```html
<ha-control-switch vertical reversed checked label="Light">
  <ha-svg-icon slot="icon-on" path="..."></ha-svg-icon>
  <ha-svg-icon slot="icon-off" path="..."></ha-svg-icon>
</ha-control-switch>
```

属性：

- `checked`：开关处于打开状态。
- `label`：无障碍名称。
- `vertical`：将开关竖立放置。
- `reversed`：翻转方向。竖立且反转时，“开”位于顶部。
- `disabled`：禁用开关。
- `touch-action`：用于滑动的 CSS `touch-action`。默认为 `pan-y`，垂直时为 `pan-x`。

这些只能作为属性（property）设置：

- `pathOn` 和 `pathOff`：图标的 SVG 路径数据。使用这些或插槽。

插槽：

- `icon-on`：打开时的图标。
- `icon-off`：关闭时的图标。

事件：

- `change`：开关被切换，通过点按、滑动或键盘。从 `checked` 读取新状态。

样式：

- `--control-switch-on-color`：默认为 `var(--primary-color)`。
- `--control-switch-off-color`：默认为 `var(--disabled-color)`。
- `--control-switch-background-opacity`：轨道的色调。默认为 `0.2`。
- `--control-switch-hover-background-opacity`：悬停时的色调。默认为 `0.4`。
- `--control-switch-thickness`：默认为 `40px`。
- `--control-switch-min-touch-size`：默认为 `40px`。
- `--control-switch-border-radius`：默认为 `var(--ha-border-radius-lg)`。
- `--control-switch-padding`：旋钮周围的空间。默认为 `4px`。
- `--mdc-icon-size`：图标大小。默认为 `20px`。

### ha-control-slider

```html
<ha-control-slider vertical value="60" unit="%" label="Brightness"></ha-control-slider>
```

属性：

- `value`：当前值。
- `min`：默认为 `0`。
- `max`：默认为 `100`。
- `step`：默认为 `1`。
- `label`：无障碍名称。
- `unit`：显示在工具提示中数值之后。
- `mode`：`start`（默认）、`end` 或 `cursor`。
- `vertical`：将滑块竖立放置。
- `inverted`：翻转数值的方向。
- `show-handle`：在填充末端显示一个手柄。
- `tooltip-mode`：`interaction`（默认）在拖动时显示数值，`always` 保持可见，`never` 隐藏。
- `tooltip-position`：`top`、`bottom`、`left` 或 `right`。默认为 `top`，垂直时为 `left`。
- `round-value`：将显示和播报的数值四舍五入为整数，而手柄仍按 `step` 吸附。当 `step` 是小数但实际数值是整数时使用。
- `touch-action`：CSS `touch-action`。默认为 `pan-y`，垂直时为 `pan-x`。
- `disabled`：禁用滑块。

`locale` 属性用于格式化数值，只能通过代码设置。

插槽：

- `background`：绘制在轨道上、填充下方的内容。色温滑块用它来显示渐变。

事件：

- `value-changed`：数值已设定，在释放时触发。`detail.value` 是新值。
- `slider-moved`：拖动时手柄移动。`detail.value` 是手柄下的数值，释放时为 `undefined`。

样式：

- `--control-slider-color`：填充。默认为 `var(--primary-color)`。
- `--control-slider-background`：轨道。默认为 `var(--disabled-color)`。
- `--control-slider-background-opacity`：默认为 `0.2`。
- `--control-slider-thickness`：默认为 `40px`。
- `--control-slider-border-radius`：默认为 `var(--ha-border-radius-md)`。
- `--control-slider-inset-shadow`：默认为 `none`。
- `--control-slider-tooltip-font-size`：默认为 `var(--ha-font-size-m)`。

### ha-control-circular-slider

```html
<ha-control-circular-slider value="21" current="19" min="10" max="30" step="0.5" label="Target temperature"></ha-control-circular-slider>

<ha-control-circular-slider dual low="19" high="24" min="10" max="30" low-label="Heat to" high-label="Cool to"></ha-control-circular-slider>
```

属性：

- `value`：目标值，用于单手柄。
- `low` 和 `high`：两个数值，配合 `dual` 使用。
- `current`：当前值，显示为轨道上的一个圆点。
- `min`：默认为 `0`。
- `max`：默认为 `100`。
- `step`：默认为 `1`。
- `mode`：`start`、`end` 或 `full`。决定轨道的哪一部分被填充。
- `dual`：显示两个手柄，分别对应 `low` 和 `high`。
- `label`：手柄的无障碍名称。
- `low-label`：设置后，将代替 `label` 作为两个手柄的无障碍名称。
- `high-label`：可接受，但不使用。
- `inactive`：隐藏彩色弧线，用于已关闭的设备。
- `readonly`：显示数值，但人们无法用指针更改。键盘仍然有效。
- `disabled`：禁用转盘。
- `prevent-interaction-on-scroll`：在触摸屏上，只有手柄响应操作，且需短按之后，因此滑过转盘的滑动会滚动页面而不是更改数值。

事件，每个事件都在 `detail.value` 中携带新值：

- `value-changing` 和 `value-changed`：拖动期间和释放时。
- `low-changing` 和 `low-changed`：低值手柄的相同事件。
- `high-changing` 和 `high-changed`：高值手柄的相同事件。

样式：

- `--control-circular-slider-color`：填充。默认为 `var(--primary-color)`。
- `--control-circular-slider-low-color` 和 `--control-circular-slider-high-color`：配合 `dual` 使用的两个填充。默认为上述颜色。
- `--control-circular-slider-background`：轨道。默认为 `var(--disabled-color)`。
- `--control-circular-slider-background-opacity`：默认为 `0.3`。
- `--control-circular-slider-interaction-margin`：轨道周围的额外点击区域。默认为 `12px`。

默认宽度为 320 像素。

### ha-control-number-buttons

```html
<ha-control-number-buttons value="21" min="10" max="30" step="0.5" unit="°C" label="Target temperature"></ha-control-number-buttons>
```

属性：

- `value`：当前值。
- `min` 和 `max`：范围。两者都是可选的。
- `step`：默认为 `1`。
- `unit`：显示在数值之后。
- `label`：无障碍名称。
- `disabled`：禁用该控件。

这些只能作为属性（property）设置：

- `locale`：用于格式化数值的区域设置数据。
- `formatOptions`：`Intl.NumberFormatOptions`，例如始终显示一位小数。

事件：

- `value-changed`：数值已更改，来自按钮或键盘。`detail.value` 是新值。

样式：

- `--control-number-buttons-background-color`：默认为 `var(--disabled-color)`。
- `--control-number-buttons-background-opacity`：默认为 `0.2`。
- `--control-number-buttons-border-radius`：默认为 `var(--ha-border-radius-md)`。
- `--control-number-buttons-focus-color`：聚焦圆环。默认为 `var(--secondary-text-color)`。
- `--mdc-icon-size`：减号和加号图标的大小。默认为 `16px`。

高度来自 `--feature-height`，即磁贴卡片功能区的高度。在卡片功能区之外，请设置 `height`。

### ha-control-select

```ts
html`<ha-control-select
  .options=${[
    { value: "low", label: "Low", path: mdiFanSpeed1 },
    { value: "high", label: "High", path: mdiFanSpeed3 },
  ]}
  .value=${"low"}
  .label=${"Fan speed"}
  @value-changed=${this._speedChanged}
></ha-control-select>`
```

属性：

- `value`：选中选项的 `value`。
- `label`：该组的无障碍名称。
- `vertical`：将选项显示为一列。
- `hide-option-label`：只显示图标。标签仍用作无障碍名称。
- `disabled`：禁用该控件。

这些只能作为属性（property）设置：

- `options`：选项数组。每个选项有一个 `value`，以及可选的 `label`、`ariaLabel`、作为 SVG `path` 的图标，或一个 `icon` 模板。

事件：

- `value-changed`：一个选项被选中。`detail.value` 是它的 `value`。

样式：

- `--control-select-color`：选中选项。默认为 `var(--primary-color)`。
- `--control-select-background`：轨道。默认为 `var(--disabled-color)`。
- `--control-select-background-opacity`：默认为 `0.2`。
- `--control-select-selected-opacity`：默认为 `1`。
- `--control-select-focused-opacity`：默认为 `0.2`。
- `--control-select-thickness`：默认为 `40px`。
- `--control-select-border-radius`：默认为 `10px`。
- `--control-select-padding`：选项周围的空间。默认为 `4px`。
- `--control-select-button-border-radius`：每个选项的圆角。跟随边框圆角和内边距。
- `--mdc-icon-size`：默认为 `20px`。

源代码：[`ha-control-button.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-button.ts)、[`ha-control-switch.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-switch.ts)、[`ha-control-slider.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-slider.ts)、[`ha-control-circular-slider.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-circular-slider.ts)、[`ha-control-number-buttons.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-number-buttons.ts) 和 [`ha-control-select.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-select.ts)，均位于 [`src/components/`](https://github.com/home-assistant/frontend/tree/dev/src/components) 中。
