# 数据库模式

> recorder 数据库中的各个表、表中的内容，以及它们之间的关联方式。

Source: https://www.hasscn.top/contributors/data/reference/database-schema/

[recorder](https://www.hasscn.top/contributors/glossary/recorder/) 集成将 Home Assistant 的历史记录存储在 SQL 数据库中。默认情况下，这是一个位于配置文件夹中名为 `home-assistant_v2.db` 的 SQLite 文件。也可以使用 MariaDB、MySQL 或 PostgreSQL。如何进行设置，以及数据保留多长时间，请参阅 [recorder 文档](https://www.home-assistant.io/integrations/recorder/)。

数据库模式会随时间变化。发生变化时，Home Assistant 会在更新过程中自动迁移数据库。本页描述的是模式版本 53。权威来源是 core 中的 [`db_schema.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/recorder/db_schema.py)。

> [!NOTE]
> 一些表仍然保留着来自旧模式版本的列，例如 `states` 中的 `entity_id` 或 `events` 中的 `event_type`。它们不再被填充，因此未包含在本页中。请使用此处列出的列。

## 概览

| 表 | 存储内容 |
| --- | --- |
| `states` | 实体（entity）每次状态（state）更新对应一行。 |
| `states_meta` | 实体 ID，只存储一次。 |
| `state_attributes` | 状态的属性，每个唯一集合只存储一次。 |
| `events` | 每个事件对应一行，`state_changed` 除外。 |
| `event_types` | 事件类型，只存储一次。 |
| `event_data` | 事件的数据，每个唯一集合只存储一次。 |
| `statistics` | 每小时统计。 |
| `statistics_short_term` | 5 分钟统计。 |
| `statistics_meta` | 每个统计所针对的对象。 |
| `statistics_runs` | 已为哪些时间段编译了统计。 |
| `recorder_runs` | recorder 每次启动和停止的记录。 |
| `schema_changes` 和 `migration_changes` | 模式迁移的历史。仅供 Home Assistant 自身使用。 |

重复次数很多的值，例如实体 ID、属性和事件类型，会存放在各自的表中，并通过 ID 引用。这使数据库小得多，但也意味着大多数查询需要进行连接（join）。示例请参阅[查询数据库](https://www.hasscn.top/contributors/data/guides/query-the-database/)。

所有以 `_ts` 结尾的时间戳都是以秒为单位的 Unix 时间戳，采用 UTC，以浮点数存储。以 `_bin` 结尾的上下文 ID 是 16 字节的二进制数据。

## 状态

### `states`

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `state_id` | 整数，主键 | 这一行的 ID。 |
| `metadata_id` | 整数，引用 `states_meta` | 哪个实体。 |
| `state` | 字符串，最多 255 个字符 | 状态值。 |
| `last_updated_ts` | 时间戳 | 状态或其属性上次更改的时间。 |
| `last_changed_ts` | 时间戳 | 状态值上次更改的时间。当它与 `last_updated_ts` 相同时为 `NULL`。 |
| `last_reported_ts` | 时间戳 | 集成上次报告该状态的时间。当它与 `last_updated_ts` 相同时为 `NULL`。 |
| `old_state_id` | 整数，引用 `states` | 该实体的上一个状态。 |
| `attributes_id` | 整数，引用 `state_attributes` | 属性。 |
| `context_id_bin` | 二进制 | 此次更改的上下文。 |
| `context_user_id_bin` | 二进制 | 发起此次更改的用户（如果已知）。 |
| `context_parent_id_bin` | 二进制 | 父上下文（如果有）。 |
| `origin_idx` | 整数 | 更改的来源：`0` 表示本地，`1` 表示远程。 |

索引：`metadata_id` 与 `last_updated_ts`，以及 `context_id_bin`。

### `states_meta`

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `metadata_id` | 整数，主键 | `states` 使用的 ID。 |
| `entity_id` | 字符串 | 实体 ID，例如 `light.kitchen`。 |

当实体被重命名时，此表中的对应行会被更新，因此其历史记录会随之保留。

### `state_attributes`

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `attributes_id` | 整数，主键 | `states` 使用的 ID。 |
| `hash` | 整数 | 属性的哈希值，用于快速查找重复项。 |
| `shared_attrs` | 文本 | 属性，以 JSON 格式存储。 |

## 事件

### `events`

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `event_id` | 整数，主键 | 这一行的 ID。 |
| `event_type_id` | 整数，引用 `event_types` | 事件的类型。 |
| `data_id` | 整数，引用 `event_data` | 事件的数据。 |
| `time_fired_ts` | 时间戳 | 事件触发的时间。 |
| `origin_idx` | 整数 | 事件的来源：`0` 表示本地，`1` 表示远程。 |
| `context_id_bin` | 二进制 | 事件的上下文。 |
| `context_user_id_bin` | 二进制 | 发起事件的用户（如果已知）。 |
| `context_parent_id_bin` | 二进制 | 父上下文（如果有）。 |

索引：`event_type_id` 与 `time_fired_ts`，以及 `context_id_bin`。

`state_changed` 事件不在此表中。`states` 表包含了它们的全部信息，其 `last_updated_ts` 就是事件触发的时间。

### `event_types`

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `event_type_id` | 整数，主键 | `events` 使用的 ID。 |
| `event_type` | 字符串 | 事件类型，例如 `automation_triggered`。 |

### `event_data`

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `data_id` | 整数，主键 | `events` 使用的 ID。 |
| `hash` | 整数 | 数据的哈希值，用于快速查找重复项。 |
| `shared_data` | 文本 | 事件数据，以 JSON 格式存储。 |

## recorder 运行记录

### `recorder_runs`

Home Assistant 每次启动时，recorder 都会开始一次新的运行。该运行在 Home Assistant 关闭时结束。在分析数据时，这能告诉你 Home Assistant 何时没有运行，从而避免把数据缺口误认为是没有变化的时期。

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `run_id` | 整数，主键 | 运行的 ID。 |
| `start` | 日期和时间 | 运行开始的时间。 |
| `end` | 日期和时间 | 运行结束的时间。 |
| `closed_incorrect` | 布尔值 | Home Assistant 是否在未正常关闭的情况下停止。 |
| `created` | 日期和时间 | 该行创建的时间。 |

当 `closed_incorrect` 为 true 时，说明 Home Assistant 未正常关闭，且 `end` 被设置为它再次启动的时间。那可能是几分钟或几天之后，因此在这种情况下不要相信 `end`。该运行中最后一个事件或状态更改的时间，是它实际停止时间的更好估计。

## 统计

统计相关的表在其专属页面中描述：[统计](https://www.hasscn.top/contributors/data/reference/statistics/)。
