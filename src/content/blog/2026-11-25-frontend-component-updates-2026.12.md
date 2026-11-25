---
title: "2026.12 前端组件更新"
description: ha-list、ha-list-item、ha-check-list-item 和 ha-radio-list-item 已被移除，因此前端不再使用 Material Web Components。
date: 2026-11-25
authors:
  - Wendelin Peleska
areas:
  - frontend
---

## 组件更新

### 移除了 ha-list、ha-list-item、ha-check-list-item 和 ha-radio-list-item

`ha-list`、`ha-list-item`、`ha-check-list-item` 和 `ha-radio-list-item` 已被移除。它们是最后一批基于 Material Web Components 构建的组件，因此前端不再包含 `@material/mwc-list` 或任何其他 `mwc-*` 元素。

请使用在 2026.11 中同样取代了 `ha-md-list` 的列表系列。根据列表的含义选择容器，根据行的功能选择行：

- `ha-list-base` 搭配 `ha-list-item-base` 用于仅显示信息的行，或搭配 `ha-list-item-button` 用于可点击的行。当带有 `href` 时，`ha-list-item-button` 会渲染为链接。
- `ha-list-nav` 用于链接列表。它会将列表包裹在 `<nav>` 地标中。
- `ha-list-selectable` 搭配 `ha-list-item-option` 用于供人们选择的列表。设置 `multi` 以允许多选，并在选项上使用 `appearance="checkbox"` 代替 `ha-check-list-item`。如果不设置 `multi`，它取代 `ha-radio-list-item`：选中的选项会高亮显示，没有单选按钮。

行的插槽（slot）和属性映射如下：

```text
graphic="…" + slot="graphic"  →  slot="start"
hasMeta + slot="meta"         →  slot="end"
twoline + slot="secondary"    →  slot="supporting-text",
                                 or the supporting-text attribute
default slot                  →  slot="headline",
                                 or the headline attribute
noninteractive                →  ha-list-item-base
```

```diff
-<ha-list>
-  <ha-list-item graphic="icon" twoline hasMeta @request-selected=${this._open}>
-    <ha-svg-icon slot="graphic" .path=${mdiWifi}></ha-svg-icon>
-    Network
-    <span slot="secondary">Connected over Wi-Fi</span>
-    <ha-icon-next slot="meta"></ha-icon-next>
-  </ha-list-item>
-</ha-list>
+<ha-list-base aria-label="Settings">
+  <ha-list-item-button
+    headline="Network"
+    supporting-text="Connected over Wi-Fi"
+    @click=${this._open}
+  >
+    <ha-svg-icon slot="start" .path=${mdiWifi}></ha-svg-icon>
+    <ha-icon-next slot="end"></ha-icon-next>
+  </ha-list-item-button>
+</ha-list-base>
```

事件也发生了变化。可点击的行触发常规的 `click` 事件，而不是 `request-selected`。`ha-list-selectable` 触发 `ha-list-item-selected` 和 `ha-list-item-deselected` 事件，而不是 `action` 和 `selected`：

- 索引现在是 `detail` 本身，是一个数字，而不是 `detail.index`。
- 在不设置 `multi` 的情况下，`selected` 包含选中行的索引。请监听 `ha-list-item-selected` 事件。
- 在设置 `multi` 的情况下，`selected` 包含所有选中索引的集合。新事件一次只命名一个选项，因此您需要自行跟踪选择状态，或读取选项的 `selected` 属性。

`--mdc-list-*` CSS 属性不再有任何效果；请改用 `--ha-list-padding`、`--ha-list-gap` 和 `--ha-row-item-*` 属性。新列表本身没有内边距，因此请设置 `--ha-list-padding: 8px 0` 以保持旧列表的间距。

有关所有属性、插槽和事件，请参阅列表页面上的[新列表系列](/design/components/list/#in-code)。
