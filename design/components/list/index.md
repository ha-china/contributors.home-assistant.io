# 列表

> 列表显示一组行，每行包含一行文本，并可选地带一个图标、第二行文本以及末尾的内容。

Source: https://www.hasscn.top/contributors/design/components/list/

Live demo of `ha-list-base`, `ha-list-item-button`, `ha-svg-icon`.

```html
<ha-list-base aria-label="设置" style="width: 100%">
  <ha-list-item-button headline="网络" supporting-text="已通过 Wi-Fi 连接">
    <ha-svg-icon slot="start" path="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z"></ha-svg-icon>
    <ha-svg-icon slot="end" path="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></ha-svg-icon>
  </ha-list-item-button>
  <ha-list-item-button headline="位置" supporting-text="家">
    <ha-svg-icon slot="start" path="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"></ha-svg-icon>
    <ha-svg-icon slot="end" path="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></ha-svg-icon>
  </ha-list-item-button>
  <ha-list-item-button headline="系统" supporting-text="更新、备份和日志">
    <ha-svg-icon slot="start" path="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"></ha-svg-icon>
    <ha-svg-icon slot="end" path="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"></ha-svg-icon>
  </ha-list-item-button>
</ha-list-base>
```

## 概述

列表显示一组相似的内容，供人们浏览、选择或打开：用于登录的提供方、菜单选项、某个区域（area）中的设备。每一行的结构都相同，因此视线可以沿着左边缘快速找到所需内容。

列表由两部分组成。根据列表的含义选择容器，然后根据其功能选择行：

- **容器**：`ha-list-base` 用于普通列表，`ha-list-selectable` 用于供人们选择的列表，`ha-list-nav` 用于链接列表。
- **行**：`ha-list-item-base` 用于仅显示信息的行，`ha-list-item-button` 用于执行操作的行，`ha-list-item-option` 用于供人们选择的行。

## 何时使用

在以下情况使用列表：

- 一组相似的内容，供人们浏览、选择或打开
- 导航到下一层级，每行末尾带一个箭头图标
- 仅显示信息的行，例如一个值或一条消息

不要在以下情况使用列表：

- 针对单个项目的操作。请使用[下拉菜单](https://www.hasscn.top/contributors/design/components/dropdown/)。
- 从少数几个需要解释的选项中选择一个。请使用[选择框](https://www.hasscn.top/contributors/design/components/select-box/)。
- 人们需要展开和收起的内容。请使用[折叠面板](https://www.hasscn.top/contributors/design/components/expansion-panel/)。

## 结构剖析

1. **列表**：容器。它本身没有内边距。
2. **行**：列表中的一个项目
3. **起始内容**：可选，行首的图标、图片或头像
4. **标题**：行的主要文本
5. **辅助文本**：可选，标题下方的简短详情
6. **末尾内容**：可选，末尾的内容，如箭头、短值或按钮

## 变体

### 行

以文本为主，只添加有助于人们识别该行的内容：

- 行首的**图标**。
- **辅助文本**，用于简短详情，如状态或描述。
- **末尾**的内容，如行打开某物时的箭头，或一个短值。

Live demo of `ha-list-base`, `ha-list-item-base`, `ha-svg-icon`.

```html
<ha-list-base aria-label="行" style="width: 100%">
  <ha-list-item-base headline="仅文本"></ha-list-item-base>
  <ha-list-item-base headline="两行" supporting-text="带有第二行详情"></ha-list-item-base>
  <ha-list-item-base headline="带图标">
    <ha-svg-icon slot="start" path="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21A1,1 0 0,0 10,22H14A1,1 0 0,0 15,21V20H9V21Z"></ha-svg-icon>
  </ha-list-item-base>
  <ha-list-item-base headline="末尾有内容">
    <span slot="end">3</span>
  </ha-list-item-base>
  <ha-list-item-base headline="已禁用" disabled></ha-list-item-base>
</ha-list-base>
```

### 仅显示信息的行

`ha-list-item-base` 是选中时不执行任何操作的行，例如仅显示值或消息的行。它没有涟漪效果，也没有键盘焦点。设置 `interactive` 可将其纳入列表的键盘导航，例如用于可排序的行。

### 执行操作的行

`ha-list-item-button` 打开某物或运行操作。带有 `href` 时，它渲染为链接，否则渲染为按钮。整行都是目标。

### 供人们选择的列表

在 `ha-list-selectable` 中，行是 `ha-list-item-option`。列表拥有选择状态：人们选择一个选项，或使用 `multi` 选择多个选项。

默认外观 `line` 会高亮选中的行。使用 `appearance="checkbox"` 时，行会显示复选框，位于起始位置，或使用 `selection-position="end"` 位于末尾。

Live demo of `ha-list-selectable`, `ha-list-item-option`.

```html
<ha-list-selectable aria-label="天" multi style="width: 100%">
  <ha-list-item-option appearance="checkbox" selection-position="end" headline="星期一" selected></ha-list-item-option>
  <ha-list-item-option appearance="checkbox" selection-position="end" headline="星期二"></ha-list-item-option>
  <ha-list-item-option appearance="checkbox" selection-position="end" headline="星期三" selected></ha-list-item-option>
</ha-list-selectable>
```

Live demo of `ha-list-selectable`, `ha-list-item-option`.

```html
<ha-list-selectable aria-label="视图" style="width: 100%">
  <ha-list-item-option headline="概览" selected></ha-list-item-option>
  <ha-list-item-option headline="能源"></ha-list-item-option>
  <ha-list-item-option headline="地图"></ha-list-item-option>
</ha-list-selectable>
```

### 链接列表

`ha-list-nav` 将列表包裹在 `<nav>` 地标中，用于人们前往的位置列表。其行是带有 `href` 的 `ha-list-item-button`。使用 `aria-label` 为其命名，以便人们区分页面上的地标。

## 行为

- **悬停和按下**：执行操作或供人们选择的行会显示涟漪效果。
- **焦点**：一次只有一个行在 Tab 顺序中。箭头键在行之间移动焦点。获得焦点的行会显示焦点颜色的轮廓和浅色背景。
- **选中**：在 `line` 外观中，选中的行会获得主色调背景，其文本变为主色。在 `checkbox` 外观中，复选框显示状态。
- **禁用**：文本变为禁用文本颜色，该行无法被选中或聚焦。
- **长文本**：标题和辅助文本在无法容纳时以省略号截断。
- **列表外焦点**：使用 `virtual-focus` 时，焦点保持在另一个元素中，例如选择器的搜索字段。列表使用 `active` 标记键盘指向的行，并将其滚动到视图中。

## 规格参数

| 属性 | 值 | Token |
| --- | --- | --- |
| 行高，最小值 | 48px | `--ha-row-item-min-height` |
| 行的上下内边距 | 12px | `--ha-row-item-padding-block` |
| 行的左右内边距 | 16px | `--ha-row-item-padding-inline` |
| 起始内容、文本和末尾内容之间的间距 | 16px | `--ha-row-item-gap` |
| 列表内边距 | 0 | `--ha-list-padding` |
| 行之间的间距 | 0 | `--ha-list-gap` |
| 标题字体大小 | 14px | `--ha-font-size-m` |
| 辅助文本字体大小 | 12px | `--ha-font-size-s` |
| 辅助文本颜色 | 次要文本颜色 | `--secondary-text-color` |
| 禁用文本颜色 | 浅色主题中为 `#bdbdbd`，深色主题中为 `#6f6f6f` | `--disabled-text-color` |
| 焦点轮廓 | 2px，使用焦点颜色 | `--ha-list-item-focus-width` |
| 选中背景，`line` 外观 | 主色调背景 | `--ha-list-item-selected-background` |

## 准则

Do and don't, as live demos.

**Do:** 保持标题简短，将详情放在辅助文本中。

```html
<ha-list-base aria-label="正确做法" style="width: 100%">
    <ha-list-item-base headline="网络" supporting-text="已通过 Wi-Fi 连接"></ha-list-item-base>
  </ha-list-base>
```

**Don't:** 将所有内容放在标题中，导致被截断。

```html
<ha-list-base aria-label="错误做法" style="width: 100%">
    <ha-list-item-base headline="网络设置，已通过 Wi-Fi 连接到您的家庭网络"></ha-list-item-base>
  </ha-list-base>
```

关于如何撰写标签，参见 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| <kbd>Tab</kbd> | 将焦点移入列表，移到某一行，然后移出列表。 |
| <kbd>向下箭头</kbd> 和 <kbd>向上箭头</kbd> | 将焦点移到下一行或上一行。使用 `wrap-focus` 时，焦点从最后一行循环到第一行，反之亦然。 |
| <kbd>Home</kbd> 和 <kbd>End</kbd> | 将焦点移到第一行或最后一行。 |
| <kbd>Page down</kbd> 和 <kbd>Page up</kbd> | 将焦点向下或向上移动一页。 |
| <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 激活聚焦的行，或选择聚焦的选项。 |

### 焦点

一次只有一个行在 Tab 顺序中。箭头键在行之间移动焦点。仅显示信息的行会被跳过，除非它们是 `interactive`。

### 目标尺寸

行的高度至少为 48px，宽度与列表相同。

### 屏幕阅读器

- `ha-list-base` 具有 `list` 角色，其行具有 `listitem` 角色。
- `ha-list-selectable` 具有 `listbox` 角色，设置 `multi` 时带有 `aria-multiselectable`。其选项具有 `option` 角色和 `aria-selected`。
- `ha-list-nav` 是导航地标，内部包含一个列表。
- 禁用的选项具有 `aria-disabled="true"`。禁用的链接行在其链接上设置 `aria-disabled="true"`，禁用的按钮行使用禁用的原生按钮。普通的 `ha-list-item-base` 行不会告知屏幕阅读器其已禁用。

### 在代码中

- 为每个列表使用 `aria-label` 命名，除非可见标题已为其命名。
- 仅在 `ha-list-selectable` 中使用 `ha-list-item-option`，并使用带有 `href` 的 `ha-list-item-button` 作为链接。

## 相关内容

- [下拉菜单](https://www.hasscn.top/contributors/design/components/dropdown/)：一组操作的菜单
- [选择框](https://www.hasscn.top/contributors/design/components/select-box/)：从少数选项中选择一个
- [折叠面板](https://www.hasscn.top/contributors/design/components/expansion-panel/)：人们需要展开和收起的内容

## 代码实现

元素是 `<ha-list-base>`、`<ha-list-selectable>` 和 `<ha-list-nav>`，行是 `<ha-list-item-base>`、`<ha-list-item-button>` 和 `<ha-list-item-option>`。

```html
<ha-list-base aria-label="Settings">
  <ha-list-item-button
    headline="Network"
    supporting-text="Connected over Wi-Fi"
  >
    <ha-svg-icon slot="start" path="..."></ha-svg-icon>
    <ha-icon-next slot="end"></ha-icon-next>
  </ha-list-item-button>
</ha-list-base>
```

```html
<ha-list-selectable multi aria-label="Days">
  <ha-list-item-option
    appearance="checkbox"
    value="monday"
    headline="Monday"
  ></ha-list-item-option>
  <ha-list-item-option
    appearance="checkbox"
    value="tuesday"
    headline="Tuesday"
  ></ha-list-item-option>
</ha-list-selectable>
```

### ha-list-base 的属性

- `wrap-focus`：箭头键在两端循环。
- `virtual-focus`：焦点保持在列表外部。列表使用 `active` 标记键盘指向的行，而不是聚焦它。
- `aria-label`：列表的可访问名称。

### ha-list-base 的插槽

- 默认：行。

### ha-list-base 的事件

- `ha-list-activated`：在聚焦的行上按下 <kbd>Enter</kbd> 或 <kbd>Space</kbd>。`detail` 包含 `index` 和 `item`。

### ha-list-base 的方法

- `moveActiveItem()`：将活动行移动到 `next`、`previous`、`first`、`last`、`next-page` 或 `previous-page`。与 `virtual-focus` 一起使用。
- `getActiveItemIndex()`：活动行的索引。
- `focusItemAtIndex()`：聚焦指定索引的行。

### ha-list-base 的样式

- `--ha-list-gap`：行之间的间距。默认为 `0`。
- `--ha-list-padding`：行周围的内边距。默认为 `0`。

### ha-list-selectable 的属性

- `multi`：人们可以选择多个选项。
- `controlled`：点击仅触发事件，不更改 `selected`。当选择状态来自您自己的状态时设置此属性。

`ha-list-selectable` 也具有 `ha-list-base` 的属性。

### ha-list-selectable 的事件

- `ha-list-item-selected`：选择了某个选项。`detail` 是选项的索引。
- `ha-list-item-deselected`：取消选择了某个选项，仅适用于 `multi`。`detail` 是选项的索引。

### ha-list-selectable 的方法

- `clearSelection()`：取消选择所有选项。

### ha-list-nav 的属性

- `aria-label`：`<nav>` 地标的名称。

### ha-list-item-base 的插槽

- `start`：起始位置的图标、图片或头像。
- `end`：末尾的内容，如箭头、值或按钮。
- `headline`：第一行。覆盖 `headline` 属性。
- `supporting-text`：第二行。覆盖 `supporting-text` 属性。
- `content`：替换标题和辅助文本。

`ha-list-item-button` 和 `ha-list-item-option` 具有相同的插槽。

### ha-list-item-base 的属性

- `headline`：第一行。
- `supporting-text`：第二行。
- `disabled`：禁用该行。
- `interactive`：将该行纳入列表的键盘导航，但不执行操作。
- `active`：由具有 `virtual-focus` 的列表在键盘指向的行上设置。

### ha-list-item-base 的样式

- `--ha-row-item-min-height`：行的最小高度。默认为 `48px`。
- `--ha-row-item-padding-block` 和 `--ha-row-item-padding-inline`：行的内边距。默认为 `12px` 和 `16px`。
- `--ha-row-item-gap`：起始内容、文本和末尾内容之间的间距。默认为 `16px`。
- `--ha-list-item-focus-background`：键盘焦点时的背景。
- `--ha-list-item-active-background`：`active` 行的背景。
- `--ha-list-item-focus-radius`、`--ha-list-item-focus-width`、`--ha-list-item-focus-width-start` 和 `--ha-list-item-focus-offset`：焦点轮廓。

### ha-list-item-button 的属性

- `href`：该行渲染为指向此 URL 的链接。
- `target`、`rel` 和 `download`：链接的属性，与 `href` 一起使用。

### ha-list-item-option 的属性

- `selected`：该选项已被选中。由列表设置，或在 `controlled` 时由您设置。
- `indeterminate`：复选框显示部分选中状态，例如用于组。
- `value`：标识选项的值。
- `appearance`：`line` 高亮选中的行，`checkbox` 显示复选框。默认为 `line`。
- `selection-position`：`start` 或 `end`，复选框的位置。默认为 `start`。

### ha-list-item-option 的样式

- `--ha-list-item-selected-background`：在 `line` 外观中，选中选项的背景。

来源：[`src/components/list/ha-list-base.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/list/ha-list-base.ts)、[`src/components/list/ha-list-selectable.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/list/ha-list-selectable.ts)、[`src/components/list/ha-list-nav.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/list/ha-list-nav.ts)、[`src/components/item/ha-list-item-base.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/item/ha-list-item-base.ts)、[`src/components/item/ha-list-item-button.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/item/ha-list-item-button.ts) 和 [`src/components/item/ha-list-item-option.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/item/ha-list-item-option.ts)
