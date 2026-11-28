# 下拉菜单

> 下拉菜单将一组操作或选项收纳在按钮之后，以菜单形式展示。

Source: https://www.hasscn.top/contributors/design/components/dropdown/

Live demo of `ha-dropdown`, `ha-button`, `ha-dropdown-item`, `ha-svg-icon`.

```html
<ha-dropdown>
  <ha-button slot="trigger" appearance="outlined" with-caret>操作</ha-button>
  <ha-dropdown-item value="edit">
    <ha-svg-icon slot="icon" path="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></ha-svg-icon>
    编辑
  </ha-dropdown-item>
  <ha-dropdown-item value="duplicate">
    <ha-svg-icon slot="icon" path="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></ha-svg-icon>
    复制
  </ha-dropdown-item>
  <ha-dropdown-item value="download">
    <ha-svg-icon slot="icon" path="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"></ha-svg-icon>
    下载
  </ha-dropdown-item>
  <ha-dropdown-item value="delete" variant="danger">
    <ha-svg-icon slot="icon" path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"></ha-svg-icon>
    删除
  </ha-dropdown-item>
</ha-dropdown>
```

## 概述

下拉菜单（dropdown）将那些不需要一直显示的操作收纳到一个按钮之后。在 Home Assistant 中最常见的例子是溢出菜单：页面、卡片或行右上角的三点按钮，其中包含对该条目可以执行的所有操作。它让界面保持简洁，同时这些操作也只需一次点击即可触达。

## 何时使用

在以下情况使用下拉菜单：

- 条目上不常用的操作，例如**复制**或**下载**
- 视图选项，例如显示哪些列或排序方式
- 子菜单中一组相关的简短列表，例如可以将某个对象移动到的区域（area）

不要在以下情况使用下拉菜单：

- 屏幕的主要操作。如果用户来到某个屏幕是为了保存，那么**保存**[按钮](https://www.hasscn.top/contributors/design/components/button/)应该直接放在屏幕上。
- 在表单中选择一个值。下拉菜单是菜单，不是表单字段。请使用选择器（select），或者当少数几个选项需要解释说明时使用[选择框（select box）](https://www.hasscn.top/contributors/design/components/select-box/)。

## 结构

1. **触发器（Trigger）**：打开菜单的元素，例如图标按钮或带下拉箭头的按钮
2. **菜单（Menu）**：承载各条目的浮起表面
3. **条目（Item）**：一个操作或选项，带有标签
4. **图标（Icon）**：可选，位于条目标签之前
5. **勾选标记（Checkmark）**：在复选框条目上，显示该选项是否开启
6. **详情（Details）**：标签之后的可选附加内容，例如键盘快捷键
7. **子菜单指示器和子菜单（Submenu indicator and submenu）**：在带有子菜单的条目上，末尾有一个箭头，条目旁边还有第二个菜单

## 变体

### 触发器

在前端中，触发器通常是带有三点图标的图标按钮，菜单在其下方打开，并与其末端对齐。当标签能让菜单更容易被找到时，也可以使用带下拉箭头的[按钮](https://www.hasscn.top/contributors/design/components/button/)。

### 操作条目

标签应保持简短，当条目执行某个操作时以动词开头：**编辑**、**复制**、**下载**。标签前的图标有助于用户快速浏览较长的菜单。

破坏性操作（例如**删除**）使用 danger 变体：标签和图标变为红色。

### 选项和开关

下拉菜单也可以承载选项。复选框条目用于开或关的设置，例如显示哪些列。选中条目用于标记一组选项中的当前选择，例如排序方式。

Live demo of `ha-dropdown`, `ha-button`, `ha-dropdown-item`.

```html
<ha-dropdown>
  <ha-button slot="trigger" appearance="plain" with-caret>视图</ha-button>
  <ha-dropdown-item type="checkbox" checked>显示区域</ha-dropdown-item>
  <ha-dropdown-item type="checkbox" checked>显示集成</ha-dropdown-item>
  <ha-dropdown-item type="checkbox">显示状态</ha-dropdown-item>
</ha-dropdown>
<ha-dropdown>
  <ha-button slot="trigger" appearance="plain" with-caret>排序方式</ha-button>
  <ha-dropdown-item value="name" selected>名称</ha-dropdown-item>
  <ha-dropdown-item value="area">区域</ha-dropdown-item>
  <ha-dropdown-item value="modified">最后修改时间</ha-dropdown-item>
</ha-dropdown>
```

### 子菜单和禁用条目

将相关条目放入子菜单，例如可以将某个对象移动到的区域列表，这样主菜单就能保持简短。

当操作存在但目前无法执行时，禁用该条目。

Live demo of `ha-dropdown`, `ha-button`, `ha-dropdown-item`.

```html
<ha-dropdown>
  <ha-button slot="trigger" appearance="plain" with-caret>更多</ha-button>
  <ha-dropdown-item value="rename">重命名</ha-dropdown-item>
  <ha-dropdown-item value="paste" disabled>粘贴</ha-dropdown-item>
  <ha-dropdown-item>
    移动到
    <ha-dropdown-item slot="submenu" value="living-room">客厅</ha-dropdown-item>
    <ha-dropdown-item slot="submenu" value="kitchen">厨房</ha-dropdown-item>
    <ha-dropdown-item slot="submenu" value="bedroom">卧室</ha-dropdown-item>
  </ha-dropdown-item>
</ha-dropdown>
```

## 行为

- **打开**：选择触发器会打开菜单，再次选择则关闭。打开一个下拉菜单会关闭其他已打开的下拉菜单。菜单从 90% 的比例放大并淡入。
- **位置**：默认情况下，菜单在触发器下方打开，并与其起始端对齐。如果没有空间，它会翻转到另一侧，并会移动以保持与屏幕边缘至少 10px 的距离。过长的菜单会有最大高度并可以滚动，在手机上它会避开刘海屏和导航栏。
- **悬停**：在指针可以悬停的设备上，条目会显示普通的中性填充。danger 条目会显示普通的 danger 填充。
- **聚焦**：获得焦点的条目会显示与悬停时相同的填充，以及一个焦点环。
- **选中**：选中的条目会显示淡雅的主色填充、中等字重，其标签和图标使用主色。
- **勾选**：复选框条目在开启时显示已勾选的复选框图标，关闭时显示空的复选框图标。
- **禁用**：禁用的条目以 50% 的不透明度显示，选择它不会有任何效果。
- **选择**：选择一个条目会关闭菜单，并将焦点移回触发器。复选框条目会先切换状态。页面可以通过代码让菜单保持打开。
- **关闭**：菜单也可以通过 <kbd>Escape</kbd>、<kbd>Tab</kbd> 或选择其外部任意位置来关闭。
- **子菜单**：将指针从条目移动到其子菜单时，子菜单会保持打开，即使指针在途中经过其他条目。

当触发器是图标按钮时，菜单打开期间它会显示为选中状态。

## 规格

| 属性 | 值 | Token |
| --- | --- | --- |
| 菜单内边距 | 4px | `--ha-space-1` |
| 菜单圆角 | 8px | `--ha-border-radius-md` |
| 菜单边框 | 1px solid | `--ha-border-width-sm`, `--ha-color-border-neutral-quiet` |
| 菜单背景 | 卡片背景 | `--card-background-color` |
| 菜单阴影 | 中等阴影 | `--ha-box-shadow-m` |
| 字体大小 | 14px | `--ha-font-size-m`, 通过 `--ha-dropdown-font-size` |
| 条目最小高度 | 40px | `--ha-space-10` |
| 条目内边距 | 上下 0.5em，左右 1em | 无 |
| 条目圆角 | 4px | `--ha-border-radius-sm` |
| 条目行高 | 1.2 | `--ha-line-height-condensed` |
| 图标与标签之间的间距 | 0.75em | 无 |
| 打开和关闭动画 | 75ms, ease | `--ha-animation-duration-instant` |
| 与屏幕边缘的距离 | 至少 10px | 无 |
| 焦点环 | 2px solid | `--ha-color-focus` |

| 条目 | 状态 | 背景 | 标签 | 图标 |
| --- | --- | --- | --- | --- |
| 默认 | 静止 | 透明 | `--primary-text-color` | `--ha-color-on-neutral-normal` |
| 默认 | 悬停或聚焦 | `--ha-color-fill-neutral-normal-resting` | `--primary-text-color` | `--ha-color-on-neutral-normal` |
| 危险 | 静止 | 透明 | `--ha-color-on-danger-quiet` | `--ha-color-on-danger-quiet` |
| 危险 | 悬停或聚焦 | `--ha-color-fill-danger-normal-resting` | `--ha-color-on-danger-normal` | `--ha-color-on-danger-quiet` |
| 选中 | 静止 | `--ha-color-fill-primary-quiet-resting` | `--primary-color` | `--primary-color` |
| 选中 | 悬停 | `--ha-color-fill-primary-quiet-hover` | `--primary-color` | `--primary-color` |

## 指南

- 操作的标签以动词开头：**编辑**、**复制**、**下载**。
- 将破坏性操作（例如**删除**）放在菜单末尾，并使用 danger 变体。
- 当破坏性操作无法撤销时，先通过[对话框](https://www.hasscn.top/contributors/design/components/dialog/)请求确认。关于如何选择合适的词，请参阅[移除、删除、添加或创建](https://www.hasscn.top/contributors/design/ui-text/remove-delete/)。
- 使用子菜单将较长的相关条目列表移出主菜单。
- 当操作存在但目前无法执行时，禁用该条目，而不是将其隐藏。

## 无障碍

### 键盘

| 按键 | 操作 |
| --- | --- |
| 在触发器上按 <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 打开或关闭菜单。打开时，焦点移动到第一个条目。 |
| <kbd>Arrow down</kbd> 和 <kbd>Arrow up</kbd> | 将焦点移动到下一个或上一个条目。到达末尾时，焦点循环。 |
| <kbd>Home</kbd> 和 <kbd>End</kbd> | 将焦点移动到第一个或最后一个条目。 |
| 输入字母 | 将焦点移动到标签以所输入文本开头的第一个条目。 |
| 在条目上按 <kbd>Enter</kbd> 或 <kbd>Space</kbd> | 选择该条目，或打开其子菜单。 |
| <kbd>Arrow right</kbd> | 打开当前聚焦条目的子菜单。在从右到左的语言中，这是 <kbd>Arrow left</kbd>。 |
| <kbd>Arrow left</kbd> | 关闭子菜单并返回其条目。在从右到左的语言中，这是 <kbd>Arrow right</kbd>。 |
| <kbd>Escape</kbd> | 关闭菜单，并将焦点移回触发器。 |
| <kbd>Tab</kbd> | 关闭菜单。 |

### 焦点

同一时间只有一个条目可以获得焦点，因此 <kbd>Tab</kbd> 不会遍历每个条目。而是使用方向键在条目之间移动。获得焦点的条目会显示焦点环。

### 目标尺寸

每个条目高度至少为 40px。

### 屏幕阅读器

菜单会被播报为菜单，每个条目会连同其位置一起播报，例如“5 个中的第 2 个”。复选框条目会被播报为已勾选或未勾选，禁用的条目会被播报为已禁用，带有子菜单的条目会被播报为拥有子菜单。选中的条目看起来是选中的，但不会被播报为已选中。

### 在代码中

- 菜单具有 `menu` 角色，方向为垂直。
- 条目具有 `menuitem` 角色。复选框条目具有 `menuitemcheckbox` 角色，并带有 `aria-checked`。
- 每个条目通过 `aria-posinset` 和 `aria-setsize` 获得其在菜单中的位置。
- 禁用的条目具有 `aria-disabled="true"`。
- 带有子菜单的条目具有 `aria-haspopup="menu"`，并且在其子菜单打开时具有 `aria-expanded`。
- 触发器获得 `aria-haspopup="menu"`，并且 `aria-expanded` 被设置为 `true` 或 `false`。
- `selected` 属性会改变条目的外观，但不会设置任何 ARIA 状态。
- 用作触发器的图标按钮需要一个 `label`，它会成为该按钮的无障碍名称。

## 相关组件

- [按钮](https://www.hasscn.top/contributors/design/components/button/)：用于主要操作，以及作为触发器
- [选择框](https://www.hasscn.top/contributors/design/components/select-box/)：在表单中选择一个值
- [对话框](https://www.hasscn.top/contributors/design/components/dialog/)：确认来自菜单的破坏性操作
- [UI 文案](https://www.hasscn.top/contributors/design/ui-text/)：如何撰写标签

## 代码实现

这些元素是 `<ha-dropdown>` 和 `<ha-dropdown-item>`。它们基于 [Web Awesome dropdown](https://webawesome.com/docs/components/dropdown/) 和 [dropdown item](https://webawesome.com/docs/components/dropdown-item/)。

```html
<ha-dropdown placement="bottom-end">
  <ha-button slot="trigger" with-caret>Actions</ha-button>
  <ha-dropdown-item value="edit">
    <ha-svg-icon slot="icon" path="..."></ha-svg-icon>
    Edit
  </ha-dropdown-item>
  <ha-dropdown-item value="delete" variant="danger">Delete</ha-dropdown-item>
</ha-dropdown>
```

### 属性

`<ha-dropdown>`：

- `placement`：菜单相对于触发器打开的位置。`bottom-start`（默认）、`bottom`、`bottom-end`、`top-start`、`top`、`top-end`、`left-start`、`left`、`left-end`、`right-start`、`right` 或 `right-end`。如果没有空间，菜单会翻转到另一侧。
- `distance`：触发器与菜单之间的距离，以像素为单位。
- `skidding`：沿触发器方向移动菜单的距离，以像素为单位。
- `open`：打开菜单。

`<ha-dropdown-item>`：

- `value`：在 `wa-select` 事件中标识该条目。
- `variant`：`default` 或 `danger`。
- `type`：`normal`（默认）或 `checkbox`。
- `checked`：开启复选框条目。
- `selected`：将该条目标记为当前选择。这是 Home Assistant 中的新增功能，不属于 Web Awesome。
- `disabled`：禁用该条目。
- `href`、`target`、`rel` 和 `download`：将条目变为链接。

当触发器是 `<ha-icon-button>` 时，菜单打开期间下拉菜单会将其标记为选中状态。你也可以通过在代码中设置 `anchorElement` 属性，从另一个元素打开菜单。

### 插槽

`<ha-dropdown>`：

- 默认：各条目。
- `trigger`：打开菜单的元素，例如按钮或图标按钮。

`<ha-dropdown-item>`：

- 默认：标签。
- `icon`：标签之前的图标。
- `details`：标签之后的附加内容，例如键盘快捷键。
- `submenu`：子菜单的条目。

### 事件

- `wa-select`：当用户选择某个条目时在 `<ha-dropdown>` 上触发。该条目位于 `event.detail.item` 中，读取 `event.detail.item.value` 即可知道是哪一个。复选框条目在事件触发时已经切换了状态。调用 `event.preventDefault()` 可以让菜单保持打开。
- `wa-show` 和 `wa-after-show`：在菜单打开时以及动画结束后触发。
- `wa-hide` 和 `wa-after-hide`：在菜单关闭时以及动画结束后触发。

### 样式

- `--ha-dropdown-font-size`：菜单的字体大小。默认为 `var(--ha-font-size-m)`。
- `--show-duration` 和 `--hide-duration`：打开和关闭动画的时长。

源码：[`src/components/ha-dropdown.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-dropdown.ts) 和 [`src/components/ha-dropdown-item.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-dropdown-item.ts)
