---
title: "2026.11 前端组件更新"
description: ha-md-list 和 ha-md-list-item 已被移除，主题现在可以为每个面板设置背景。
date: 2026-10-28
authors:
  - Wendelin Peleska
  - Bram Kragten
areas:
  - frontend
---

## 组件更新

### 移除 ha-md-list 和 ha-md-list-item

`ha-md-list` 和 `ha-md-list-item` 已被移除。对于静态行，请使用 `ha-list-base` 搭配 `ha-list-item-base`；对于可点击的行，请使用 `ha-list-item-button`。`--md-list-item-*` CSS 属性不再生效；请改用 `--ha-row-item-*` 和 `--ha-list-*`。

### ha-outlined-icon-button

`ha-outlined-icon-button` 现在基于 `ha-icon-button` 构建，而非 Material Web。使用 `--ha-icon-button-size` 设置大小（默认 `40px`），并使用新的 `--ha-outlined-icon-button-outline-color` 设置轮廓。`--md-outlined-icon-button-*` 和 `--md-sys-color-outline` 属性不再生效。

### Chip CSS 属性

Chip 不再使用 Material Web 的属性名称。请重命名您在 `ha-assist-chip`、`ha-input-chip` 和 `ha-filter-chip` 上设置的属性：

```css
--md-assist-chip-*  →  --ha-assist-chip-*
--md-input-chip-*   →  --ha-input-chip-*
--md-filter-chip-*  →  --ha-filter-chip-*
```

`--md-sys-color-on-surface` 不再为 assist chip 标签着色；请使用 `--ha-assist-chip-label-text-color`。

### 移除 ha-formfield

`ha-formfield` 已被移除，因此残留的 `ha-formfield` 不再渲染其标签。`ha-switch` 和 `ha-checkbox` 会渲染自己的标签，因此请将标签放入控件的默认插槽中：

```diff
-<ha-formfield .label=${label}>
-  <ha-switch .checked=${checked}></ha-switch>
-</ha-formfield>
+<ha-switch .checked=${checked}>${label}</ha-switch>
```

标签现在是一个包裹输入的真正的 `<label>`，因此点击它会切换控件。当 `ha-switch` 被禁用时，只有控件会变暗；标签使用 `--disabled-text-color`。

### 移除 --mdc-typography-* 属性

前端已停止读取 `--mdc-typography-*` CSS 属性。在主题或组件上设置它们不再生效；请改用 `--ha-font-*` 主题变量，例如 `--ha-font-size-m` 和 `--ha-font-family-body`。

## 每个面板的主题背景

主题现在可以为每个面板设置背景，而不仅仅是仪表盘。前端会在所有面板后面绘制一次背景，因此面板和布局（如 `hass-subpage` 和 `hass-tabs-subpage`）不再自行绘制背景。如果您的自定义面板在其宿主上设置了 `background-color: var(--primary-background-color)`，请将其移除，否则它会覆盖主题背景。

三个新的主题变量控制此功能。它们接受任何 CSS `background` 值，因此渐变和图片也可以使用：

- `--ha-panel-background`：所有面板后面的背景。默认为 `--primary-background-color`。当主题未设置 `--lovelace-background` 时，仪表盘会使用它。
- `--ha-panel-toolbar-background`：工具栏和粘性搜索栏，例如数据表格上方的那些。默认为 `--primary-background-color`。
- `--ha-data-table-background`：数据表格。默认为 `--data-table-background-color`。
