# 选择菜单

> 一种紧凑的下拉菜单，用于选择一个选项，例如风扇的预设模式或恒温器的模式。

Source: https://www.hasscn.top/contributors/design/components/select-menu/

Live demo of `ha-control-select-menu`, `ha-svg-icon`.

```html
<ha-control-select-menu label="Preset" value="eco" data-props='{"options": [{"value": "auto", "label": "Auto"}, {"value": "eco", "label": "Eco"}, {"value": "sleep", "label": "Sleep"}]}' style="width: 160px">
  <ha-svg-icon slot="icon" path="M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z"></ha-svg-icon>
</ha-control-select-menu>
<ha-control-select-menu label="Oscillate" value="false" data-props='{"options": [{"value": "true", "label": "On", "iconPath": "M6 14H9L5 18L1 14H4C4 11.3 5.7 6.6 11 6.1V8.1C7.6 8.6 6 11.9 6 14M20 14C20 11.3 18.3 6.6 13 6.1V8.1C16.4 8.7 18 11.9 18 14H15L19 18L23 14H20Z"}, {"value": "false", "label": "Off", "iconPath": "M13 8.1V6.1C18.3 6.6 20 11.4 20 14H23L20.1 16.9L17.2 14H18C18 11.9 16.4 8.6 13 8.1M7.8 7.1L2.4 1.7L1.1 3L6.3 8.2C4.7 10 4 12.4 4 14H1L5 18L9 14H6C6 12.7 6.6 11 7.9 9.7L20.9 22.7L22.2 21.4L9.3 8.7L7.8 7.1M11 6.1L9.5 6.4L11 7.8V6.1Z"}]}' style="width: 160px"></ha-control-select-menu>
```

## 概述

选择菜单是一个按钮，用于显示某个设置及其当前值。点击它会打开一个包含各选项的菜单。它属于[控件（controls）](https://www.hasscn.top/contributors/design/components/controls/)家族：同样采用圆角、着色的外观，专为操作设备而非填写表单而设计。

它出现在两个地方：

- 在**更多信息对话框**中，位于主控件下方，用于设备的次要设置。例如风扇的预设模式、风向和摆动，或恒温器的风扇和扫风模式。多个选择菜单并排显示在一行中，每个宽度为 120 到 160 像素。
- 在**磁贴卡片（tile card）的功能**中，作为模式功能的下拉菜单样式。在那里它会横跨卡片的整个宽度。

## 何时使用

在以下情况使用选择菜单：

- 设备的某个设置选项较多，一行放不下
- 用户不常更改的设置

不要在以下情况使用选择菜单：

- 用户频繁切换的少量选项。请使用控件选择器（control select），它会同时显示所有选项，参见[控件](https://www.hasscn.top/contributors/design/components/controls/)。
- 表单和设置页面。请改用普通的选择器。
- 操作列表。请使用[下拉菜单（dropdown）](https://www.hasscn.top/contributors/design/components/dropdown/)。

## 结构剖析

1. **容器**：带有着色背景的圆角按钮
2. **图标**：所选选项的图标，或该设置的默认图标
3. **标签**：设置的名称，以小号文字显示
4. **值**：所选选项的标签，位于标签下方
5. **箭头**：可选，位于末尾的下拉箭头
6. **菜单**：在按钮下方打开的选项列表，每个选项都有自己的图标。所选选项会高亮显示。

## 变体

### 标签和值

默认样式。标签显示设置的名称，其下方的值显示当前的选择。

当没有值时，标签会单独显示，并使用值的大小。

Live demo of `ha-control-select-menu`, `ha-svg-icon`.

```html
<ha-control-select-menu label="Swing mode" data-props='{"options": [{"value": "off", "label": "Off"}, {"value": "vertical", "label": "Vertical"}, {"value": "horizontal", "label": "Horizontal"}]}' style="width: 160px">
  <ha-svg-icon slot="icon" path="M6 14H9L5 18L1 14H4C4 11.3 5.7 6.6 11 6.1V8.1C7.6 8.6 6 11.9 6 14M20 14C20 11.3 18.3 6.6 13 6.1V8.1C16.4 8.7 18 11.9 18 14H15L19 18L23 14H20Z"></ha-svg-icon>
</ha-control-select-menu>
```

### 在磁贴卡片功能中

在磁贴卡片中，选择菜单会隐藏其标签并显示一个箭头。卡片已经说明了该功能的用途，因此只显示值，末尾的箭头表示点击会打开菜单。高度跟随功能，为 42 像素。

Live demo of `ha-control-select-menu`, `ha-svg-icon`.

```html
<ha-control-select-menu label="Fan mode" value="medium" hide-label show-arrow data-props='{"options": [{"value": "low", "label": "Low"}, {"value": "medium", "label": "Medium"}, {"value": "high", "label": "High"}]}' style="display: block; width: 320px; --control-select-menu-height: 42px">
  <ha-svg-icon slot="icon" path="M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z"></ha-svg-icon>
</ha-control-select-menu>
```

## 行为

- **悬停**：背景的色调变为更深的中性色。
- **聚焦**：键盘聚焦时，按钮周围会显示一个 2px 的圆环，颜色为次要文字颜色。
- **打开**：点击按钮会在其下方打开菜单。菜单的宽度至少与按钮相同。
- **选中**：在菜单中，所选选项以中等字重和主色显示，背景为浅色主色背景。
- **禁用**：按钮的文字以禁用颜色显示，且无法打开。当实体（entity）不可用时，更多信息对话框会将其禁用。

Live demo of `ha-control-select-menu`, `ha-svg-icon`.

```html
<ha-control-select-menu label="Preset" value="eco" disabled data-props='{"options": [{"value": "eco", "label": "Eco"}]}' style="width: 160px">
  <ha-svg-icon slot="icon" path="M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z"></ha-svg-icon>
</ha-control-select-menu>
```

选择一个选项本身不会改变值。由页面来设置新值，通常是在实体发生变化之后。

过长的标签和值会以省略号截断。起始处的图标会显示所选选项的图标（如果有的话）。否则会显示该设置的默认图标。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 高度 | 48px | `--control-select-menu-height` |
| 内边距 | 上下 6px，左右 10px | `--control-select-menu-padding` |
| 圆角半径 | 12px | `--ha-border-radius-lg`，通过 `--control-select-menu-border-radius` |
| 图标、文字和箭头之间的间距 | 10px | 无 |
| 图标大小 | 20px | `--mdc-icon-size` |
| 标签大小 | 12px，字间距 0.4px | `--ha-font-size-s` |
| 值大小 | 14px | `--ha-font-size-m` |
| 字重 | 400 | `--ha-font-weight-normal` |
| 行高 | 1.4 | 无 |
| 过渡 | 180ms，ease-in-out | 无 |
| 菜单选项的高度 | 至少 40px | `--ha-space-10` |

| 状态 | 背景 | 文字 |
| --- | --- | --- |
| 静止 | `--disabled-color`，20% 不透明度 | `--primary-text-color` |
| 悬停 | `--ha-color-on-neutral-quiet`，20% 不透明度 | `--primary-text-color` |
| 聚焦 | 静止背景，带有一个 2px 的 `--secondary-text-color` 圆环 | `--primary-text-color` |
| 禁用 | `--disabled-color`，20% 不透明度 | `--disabled-color` |
| 菜单中的选中选项 | `--ha-color-fill-primary-quiet-resting`，悬停时为 `--ha-color-fill-primary-quiet-hover` | `--primary-color` |

## 准则

Do and don't, as live demos.

**Do:** 保持标签和值简短。

```html
<ha-control-select-menu label="Preset" value="eco" data-props='{"options": [{"value": "eco", "label": "Eco"}]}' style="width: 160px">
    <ha-svg-icon slot="icon" path="M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z"></ha-svg-icon>
  </ha-control-select-menu>
```

**Don't:** 使用会在狭窄按钮中被截断的长文本。

```html
<ha-control-select-menu label="Energy saving preset" value="eco" data-props='{"options": [{"value": "eco", "label": "Energy saving mode"}]}' style="width: 160px">
    <ha-svg-icon slot="icon" path="M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z"></ha-svg-icon>
  </ha-control-select-menu>
```

- 仅在周围环境已经说明了设置名称的情况下才隐藏标签，例如磁贴卡片。

## 无障碍

### 键盘

该按钮会打开一个[下拉菜单](https://www.hasscn.top/contributors/design/components/dropdown/)，菜单遵循其键盘行为：

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移至按钮。禁用的选择菜单会被跳过。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 打开菜单。在菜单中，选中当前聚焦的选项。 |
| <kbd>Arrow down</kbd> 和 <kbd>Arrow up</kbd> | 移动到下一个或上一个选项。 |
| <kbd>Home</kbd> 和 <kbd>End</kbd> | 移动到第一个或最后一个选项。 |
| 字母键 | 移动到第一个以所输入文字开头的选项。 |
| <kbd>Escape</kbd> | 关闭菜单，并将焦点移回按钮。 |

### 聚焦

键盘聚焦时，按钮周围会显示一个 2px 的圆环，颜色为次要文字颜色。

### 目标大小

按钮高度为 48px。其宽度由页面设置，在更多信息对话框中为 120 到 160 像素。

### 屏幕阅读器

按钮会连同其标签和值一起播报，并被识别为一个打开菜单的按钮。没有标签时，只播报值。各选项会被播报为菜单项。所选选项在视觉上显示为选中状态，但不会被播报为已选中。

### 在代码中

- 该按钮是一个原生 `<button>`，带有 `aria-haspopup="menu"`，`aria-expanded` 由下拉菜单设置。
- 无障碍名称是按钮内的文字：标签和值。使用 `hide-label` 时，标签完全不会被渲染，因此屏幕阅读器只能获取到值。
- SVG 图标对屏幕阅读器隐藏。
- 菜单具有 `menu` 角色，每个选项具有 `menuitem` 角色。所选选项仅在视觉上进行标记。

## 相关内容

- [控件](https://www.hasscn.top/contributors/design/components/controls/)：选择菜单所属的家族
- [下拉菜单](https://www.hasscn.top/contributors/design/components/dropdown/)：它打开的菜单
- [磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)：它作为功能出现的地方

## 代码实现

该元素是 `<ha-control-select-menu>`。菜单是一个 [`ha-dropdown`](https://www.hasscn.top/contributors/design/components/dropdown/)，在按钮下方打开，宽度至少与按钮相同。

```ts
html`<ha-control-select-menu
  .label=${"Preset"}
  .value=${this.stateObj.attributes.preset_mode}
  .options=${[
    { value: "eco", label: "Eco" },
    { value: "sleep", label: "Sleep" },
  ]}
  @wa-select=${this._presetChanged}
>
  <ha-svg-icon slot="icon" .path=${mdiTuneVariant}></ha-svg-icon>
</ha-control-select-menu>`
```

该组件在选中选项时不会自行更改其值。它会触发 `wa-select` 事件，由你在那里设置 `value`，通常是在实体发生变化之后。这也是本页上的演示保持其值不变的原因。

### 属性（Attributes）

- `label`：设置的名称。
- `value`：所选选项的 `value`。
- `hide-label`：只显示值，不显示标签。
- `show-arrow`：在末尾显示一个下拉箭头。
- `disabled`：禁用选择菜单。它将无法打开。

### 特性（Properties）

这些只能作为特性设置：

- `options`：选项数组。每个选项包含一个 `value` 和一个 `label`，还可以选择包含一个图标：`iconPath` 用于 SVG 路径数据，或 `icon` 用于图标名称（如 `mdi:fan`）。
- `renderIcon`：一个为值返回图标的函数。用于没有 `iconPath` 或 `icon` 的选项，在菜单和按钮上均适用。

### 插槽（Slots）

- `icon`：按钮上的图标，当所选选项没有自己的图标时使用。

### 事件

- `wa-select`：选中了一个选项。`detail.item.value` 是其 `value`。

### 样式

- `--control-select-menu-height`：默认为 `48px`。
- `--control-select-menu-padding`：默认为 `6px 10px`。
- `--control-select-menu-border-radius`：默认为 `var(--ha-border-radius-lg)`。
- `--control-select-menu-background-color`：默认为 `var(--disabled-color)`。
- `--control-select-menu-background-opacity`：默认为 `0.2`。
- `--control-select-menu-focus-color`：聚焦圆环。默认为 `var(--secondary-text-color)`。
- `--mdc-icon-size`：图标大小。默认为 `20px`。

该元素是 `inline-block`，宽度与其内容相同。可以设置 `width`，或使用 `display: block` 来填满容器，就像磁贴卡片功能那样。

源码：[`src/components/ha-control-select-menu.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-control-select-menu.ts)
