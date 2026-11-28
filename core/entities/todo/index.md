# 待办事项列表实体

> 为购物清单、任务列表或任何其他带有状态的有序项目列表构建待办事项列表实体。

Source: https://www.hasscn.top/contributors/core/entities/todo/

待办事项列表实体（entity）表示一个项目列表，每个项目都有状态：未完成或已完成。可以想象一下购物清单、任务管理器中的任务，或扫地机器人应用跟踪的家务。继承自 `homeassistant.components.todo` 中的 `TodoListEntity`。

用户可以在待办事项面板中查看该列表，自动化、脚本和 Assist 可以读取它并向其中添加内容。它们能修改什么取决于您设置的[支持的功能](https://www.hasscn.top/contributors/core/entities/todo/#supported-features)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. A read-only shopping list in a tile card and a to-do list card. The state is the number of open items. The items are sample items of the demo.

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
  <script type="application/json">
    [
      {
        "entity_id": "todo.shopping_list",
        "state": "3",
        "attributes": {
          "friendly_name": "Shopping list"
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "todo.shopping_list"
      }
    </script>
  </ha-embed-card>
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

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `todo_items` | `list[TodoItem] \| None` | `None` | 列表中的项目，按顺序排列。`None` 表示列表未知。 |

每个实体都具有的通用属性（如 `name`、`available` 和 `unique_id`）位于[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)中。

## 支持的功能

将 `TodoListEntityFeature` 的标志用 `|` 组合起来，并通过 `_attr_supported_features` 进行设置。如果不设置任何标志，列表将为只读。请参阅[支持的功能](https://www.hasscn.top/contributors/glossary/supported-features/)。

| 常量 | 启用的功能 |
| --- | --- |
| `CREATE_TODO_ITEM` | 添加项目。需实现 `async_create_todo_item`。 |
| `DELETE_TODO_ITEM` | 删除项目，以及一次性删除所有已完成的项目。需实现 `async_delete_todo_items`。 |
| `UPDATE_TODO_ITEM` | 修改项目，例如重命名或将其标记为已完成。需实现 `async_update_todo_item`。 |
| `MOVE_TODO_ITEM` | 重新排列项目顺序。需实现 `async_move_todo_item`。 |
| `SET_DUE_DATE_ON_ITEM` | 在创建或更新项目时将 `due` 设置为日期。 |
| `SET_DUE_DATETIME_ON_ITEM` | 在创建或更新项目时将 `due` 设置为日期和时间。 |
| `SET_DESCRIPTION_ON_ITEM` | 在创建或更新项目时设置 `description`。 |

当操作使用了您不支持的字段（例如截止日期）时，该操作会在您的方法被调用之前因验证错误而失败。

## 待办事项项目

每个项目都是一个 `TodoItem`，它是 `homeassistant.components.todo` 中的一个数据类（dataclass）。

| 字段 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `uid` | `str \| None` | `None` | 项目的唯一 ID。更新、删除或移动项目时需要用到。 |
| `summary` | `str \| None` | `None` | 项目的文本内容。 |
| `status` | `TodoItemStatus \| None` | `None` | `TodoItemStatus.NEEDS_ACTION` 或 `TodoItemStatus.COMPLETED`。 |
| `due` | `datetime.date \| datetime.datetime \| None` | `None` | 项目的截止时间。`datetime` 必须包含时区信息。 |
| `description` | `str \| None` | `None` | 比摘要更详细的描述。 |
| `completed` | `datetime.datetime \| None` | `None` | 项目最近一次被标记为已完成的时间。 |

您返回的每个项目都必须包含 `uid`、`summary` 和 `status`。

## 方法

所有方法均为仅异步方法。每种方法只需在实现了对应功能时才需要提供。

### 创建项目

```python
async def async_create_todo_item(self, item: TodoItem) -> None:
    """Add an item to the list."""
```

新项目具有 `summary` 和状态 `NEEDS_ACTION`，以及您支持的任何可选字段。它还没有 `uid`：需要由您的服务或集成（integration）为其分配。

### 更新项目

```python
async def async_update_todo_item(self, item: TodoItem) -> None:
    """Update an item on the list."""
```

该项目始终带有其 `uid`。它是您上次返回的项目的副本，其中已更改的字段会被填入。设置为 `None` 的字段表示被有意清除，因此您也需要在自己的数据中将其清除。

### 删除项目

```python
async def async_delete_todo_items(self, uids: list[str]) -> None:
    """Delete items from the list."""
```

您会收到一个 ID 列表。请删除所有项目，而不仅仅是第一个。

### 移动项目

```python
async def async_move_todo_item(
    self, uid: str, previous_uid: str | None = None
) -> None:
    """Move an item on the list."""
```

将具有 `uid` 的项目移动到紧随具有 `previous_uid` 的项目之后。当 `previous_uid` 为 `None` 时，将其移动到列表顶部。

在任何更改之后，更新 `todo_items` 并写入状态（state），或者从您的服务中刷新它。基类会在每次写入状态时将新项目发送到前端。

## 状态

状态是具有 `NEEDS_ACTION` 状态的项目数量。当 `todo_items` 为 `None` 时，状态为 `unknown`。

## 示例

```python
from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)


class ExampleShoppingList(TodoListEntity):
    """A shopping list kept by a cloud service."""

    _attr_has_entity_name = True
    _attr_translation_key = "shopping_list"
    _attr_supported_features = (
        TodoListEntityFeature.CREATE_TODO_ITEM
        | TodoListEntityFeature.DELETE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
    )

    def __init__(self, client: ExampleClient) -> None:
        """Initialize the list."""
        self._client = client
        self._attr_unique_id = f"{client.account_id}_shopping_list"

    async def async_update(self) -> None:
        """Fetch the items from the service."""
        self._attr_todo_items = [
            TodoItem(
                uid=entry.id,
                summary=entry.text,
                status=(
                    TodoItemStatus.COMPLETED
                    if entry.done
                    else TodoItemStatus.NEEDS_ACTION
                ),
            )
            for entry in await self._client.get_items()
        ]

    async def async_create_todo_item(self, item: TodoItem) -> None:
        """Add an item to the list."""
        await self._client.add_item(item.summary)
        await self.async_update_ha_state(force_refresh=True)

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Update an item on the list."""
        done = item.status == TodoItemStatus.COMPLETED
        await self._client.update_item(item.uid, item.summary, done)
        await self.async_update_ha_state(force_refresh=True)

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Delete items from the list."""
        await self._client.delete_items(uids)
        await self.async_update_ha_state(force_refresh=True)
```

此示例采用轮询方式。当您的服务会推送更改，或者您使用了[协调器（coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/)时，请改用这种方式进行刷新。请参阅[更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/)。
