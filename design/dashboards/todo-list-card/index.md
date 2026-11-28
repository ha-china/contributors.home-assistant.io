# 待办事项列表卡片

> 待办事项列表卡片显示待办事项列表中的条目，可以勾选完成、添加新条目以及重新排序。

Source: https://www.hasscn.top/contributors/design/dashboards/todo-list-card/

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "todo-list",
        "entity": "todo.shopping_list"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

待办事项列表卡片显示一个待办事项列表，例如购物清单。顶部是一个用于添加条目的输入框。下方按分组显示条目：待完成的条目显示在**进行中**下，已完成的条目显示在**已完成**下。没有状态的条目会有自己的分组。每个条目都有一个复选框。选中条目即可打开进行编辑，包括其描述和截止日期。

分组标题旁边的菜单包含该分组的操作，例如对进行中的条目重新排序，或清除所有已完成的条目。卡片提供的功能取决于列表本身：无法创建或移动条目的列表不会显示添加条目的输入框，也没有重新排序的选项。

待办事项列表卡片适合用于人们每天都会使用的列表，例如购物清单或家务清单。如果只想显示还剩多少条目，使用待办事项实体（entity）的[磁贴卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)就足够了。它的状态就是尚未完成的条目数量。

### 隐藏已完成项

设置 `hide_completed: true` 后，卡片只显示尚未完成的条目。适用于会不断变长的列表，例如从不清理的购物清单。设置 `hide_create: true` 后，添加条目的输入框会消失，适用于在壁挂平板上更多是查看而非编辑的列表。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "todo-list",
        "entity": "todo.shopping_list",
        "hide_completed": true,
        "hide_create": true
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 排序

默认情况下，条目保持列表中的顺序，人们可以通过拖拽来改变顺序。使用 `display_order` 可以改为按名称或截止日期排序。使用 `due_date_period` 可以只显示在某个时间段内到期的条目，例如今天或本周。

### 内容

- 当仪表盘（dashboard）中有多个列表时，请设置 `title`。列表的名称本身不会显示在卡片上。
- 对于有明确归属者或位置的列表，请将卡片放在对应的分区中，这样人们就能在预期的位置找到它。

## 配置

- `entity`（字符串，必填）：要显示的待办事项列表。仅支持 `todo` 域（domain）的实体。
- `title`（字符串）：列表上方的标题。
- `hide_completed`（布尔值）：隐藏已完成的条目。默认为 `false`。
- `hide_create`（布尔值）：隐藏添加条目的输入框。默认为 `false`。
- `hide_section_headers`（布尔值）：隐藏**进行中**和**已完成**标题。默认为 `false`。
- `display_order`（字符串）：`none`、`alpha_asc`、`alpha_desc`、`duedate_asc` 或 `duedate_desc`。默认为 `none`，即列表的顺序。
- `due_date_period`（时间段）：只显示在此时间段内到期的条目，例如今天或未来 7 天。
- `item_tap_action`（字符串）：选中条目时的操作：`edit` 或 `toggle`。默认为 `edit`。
- `theme`（字符串）：仅应用于此卡片的主题。

```yaml
type: todo-list
entity: todo.shopping_list
title: "Groceries"
hide_completed: true
display_order: "alpha_asc"
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-todo-list-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-todo-list-card.ts)，元素为 `<hui-todo-list-card>`。它通过 [`src/data/todo.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/todo.ts) 中的 `subscribeItems` 订阅列表的条目，因此来自其他地方的更改会立即显示出来。重新排序使用 `<ha-sortable>`，编辑条目会打开 [`src/panels/todo/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/todo) 中的待办事项对话框。

显示哪些控件取决于实体支持的功能，例如 [`src/data/todo.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/todo.ts) 中的 `CREATE_TODO_ITEM` 和 `MOVE_TODO_ITEM`。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-todo-list-card.ts)
