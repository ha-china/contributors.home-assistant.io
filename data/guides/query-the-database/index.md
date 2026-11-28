# 查询数据库

> 用于从 Home Assistant 数据库读取状态、事件和上下文的 SQL 查询示例，适用于 SQLite、MariaDB 和 PostgreSQL。

Source: https://www.hasscn.top/contributors/data/guides/query-the-database/

记录器（recorder）将您家中的历史数据存储在 SQL 数据库中。您可以使用任何 SQL 工具查询它，例如电脑上的数据库客户端或 JupyterLab 中的笔记本。本页面提供了一些可供起步的查询。

在开始之前：

- 阅读[数据模型](https://www.hasscn.top/contributors/data/reference/data-model/)和[数据库模式](https://www.hasscn.top/contributors/data/reference/database-schema/)。这些表是规范化的：实体 ID、属性和事件数据分别存储在各自的表中，因此大多数查询都需要连接（join）。
- 只读不写。在 Home Assistant 运行时写入数据库可能会损坏您的历史数据。
- 时间以 Unix 时间戳的形式存储，即自 1970 年以来的秒数，采用 UTC。下面的查询会将它们转换为可读的日期。

示例使用 SQLite，即默认数据库。当 MariaDB、MySQL 或 PostgreSQL 需要不同的函数时，会特别说明。

## 状态

### 单个实体的状态

```sql
SELECT
  states.state,
  DATETIME(states.last_updated_ts, 'unixepoch', 'localtime') AS updated
FROM states
JOIN states_meta ON states.metadata_id = states_meta.metadata_id
WHERE states_meta.entity_id = 'sensor.living_room_temperature'
ORDER BY states.last_updated_ts DESC
LIMIT 100;
```

在其他数据库中转换时间戳的方法：

- MariaDB 和 MySQL：`FROM_UNIXTIME(states.last_updated_ts)`
- PostgreSQL：`TO_TIMESTAMP(states.last_updated_ts)`

### 仅真正的状态变化

每次更新都会写入一行状态记录，即使只有属性发生了变化，例如媒体播放器上播放的歌曲或灯光的颜色。当状态值本身发生变化时，`last_changed_ts` 与 `last_updated_ts` 相同，为了节省空间，此时它会被存储为 `NULL`。因此，要只获取状态值发生变化的行：

```sql
SELECT states_meta.entity_id, states.state, states.last_updated_ts
FROM states
JOIN states_meta ON states.metadata_id = states_meta.metadata_id
WHERE states.last_changed_ts IS NULL;
```

### 填充最后变化时间

由于 `last_changed_ts` 在等于 `last_updated_ts` 时为 `NULL`，可以回退到 `last_updated_ts` 来获取真实的值：

```sql
SELECT
  states_meta.entity_id,
  states.state,
  COALESCE(states.last_changed_ts, states.last_updated_ts) AS last_changed_ts
FROM states
JOIN states_meta ON states.metadata_id = states_meta.metadata_id;
```

`COALESCE` 在 SQLite、MariaDB、MySQL 和 PostgreSQL 中都可用。

### 属性

属性在 `state_attributes` 中只存储一次，并由具有相同属性的每个状态行共享：

```sql
SELECT states_meta.entity_id, states.state, state_attributes.shared_attrs
FROM states
JOIN states_meta ON states.metadata_id = states_meta.metadata_id
LEFT JOIN state_attributes
  ON states.attributes_id = state_attributes.attributes_id
WHERE states_meta.entity_id = 'light.kitchen';
```

`shared_attrs` 是一个 JSON 字符串。

### 前一个状态

每个状态行都通过 `old_state_id` 指向它之前的状态：

```sql
SELECT
  states_meta.entity_id,
  old_states.state AS old_state,
  states.state AS new_state,
  states.last_updated_ts
FROM states
JOIN states_meta ON states.metadata_id = states_meta.metadata_id
LEFT JOIN states AS old_states
  ON states.old_state_id = old_states.state_id;
```

## 事件

### 所有事件及其数据

`state_changed` 事件不存储在 `events` 表中：`states` 表已经包含该信息。所有其他事件都存储在 `events` 表中。

```sql
SELECT
  events.event_id,
  DATETIME(events.time_fired_ts, 'unixepoch', 'localtime') AS fired,
  event_types.event_type,
  event_data.shared_data
FROM events
LEFT JOIN event_types
  ON events.event_type_id = event_types.event_type_id
LEFT JOIN event_data ON events.data_id = event_data.data_id
ORDER BY events.time_fired_ts DESC
LIMIT 100;
```

### 事件与状态变化合并查看

要按顺序查看所有内容，可以合并这两个表：

```sql
SELECT event_types.event_type, events.time_fired_ts AS fired_ts
FROM events
JOIN event_types ON events.event_type_id = event_types.event_type_id
UNION ALL
SELECT 'state_changed', states.last_updated_ts
FROM states
ORDER BY fired_ts;
```

## 上下文

上下文（context）将因同一原因而发生的所有事情联系在一起。这些 ID 以二进制值的形式存储。在 SQLite、MariaDB 和 MySQL 中，可以使用 `HEX()` 使它们变得可读。PostgreSQL 则直接显示它们。

### 状态变化的上下文

```sql
SELECT
  states_meta.entity_id,
  states.state,
  HEX(states.context_id_bin) AS context_id,
  HEX(states.context_user_id_bin) AS user_id,
  HEX(states.context_parent_id_bin) AS parent_id
FROM states
JOIN states_meta ON states.metadata_id = states_meta.metadata_id;
```

### 具有相同上下文的所有内容

从上一个查询中选取一个上下文 ID，查找共享该上下文的所有事件和状态：

```sql
SELECT 'event', event_types.event_type, events.time_fired_ts
FROM events
JOIN event_types ON events.event_type_id = event_types.event_type_id
WHERE HEX(events.context_id_bin) = '0190A1B2C3D4E5F60718293A4B5C6D7E'
UNION ALL
SELECT 'state', states_meta.entity_id, states.last_updated_ts
FROM states
JOIN states_meta ON states.metadata_id = states_meta.metadata_id
WHERE HEX(states.context_id_bin) = '0190A1B2C3D4E5F60718293A4B5C6D7E';
```

## 统计数据

具有长期统计数据的传感器的每小时平均值：

```sql
SELECT
  DATETIME(statistics.start_ts, 'unixepoch', 'localtime') AS hour,
  statistics.mean,
  statistics.min,
  statistics.max
FROM statistics
JOIN statistics_meta ON statistics.metadata_id = statistics_meta.id
WHERE statistics_meta.statistic_id = 'sensor.living_room_temperature'
ORDER BY statistics.start_ts DESC
LIMIT 48;
```

对于能耗和其他计量类传感器，请使用 `state` 和 `sum` 代替 `mean`、`min` 和 `max`。参见[统计数据](https://www.hasscn.top/contributors/data/reference/statistics/)。
