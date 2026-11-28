# 统计数据

> Home Assistant 如何将传感器数据汇总为 5 分钟和每小时的统计数据，以及这些数据是如何存储的。

Source: https://www.hasscn.top/contributors/data/reference/statistics/

`states` 表会完整保留每一次状态变化，但仅限有限时间：默认为 10 天。为了更长久地保存历史记录，Home Assistant 还会编译[统计数据](https://www.hasscn.top/contributors/glossary/statistics/)（statistics）：即每个时间段内传感器数值的汇总。这些数据为能源仪表盘、统计图表卡片和长期历史图表提供支持。用户文档在[长期统计数据](https://www.home-assistant.io/docs/configuration/long-term-statistics/)中对它们进行了说明。

## 短期与长期

- **短期统计数据**每 5 分钟编译一次，数据来源于该时间段内的状态。它们会与状态一起被清除。
- **长期统计数据**每小时编译一次，数据来源于该小时内的短期统计数据。它们永远不会被清除。每个传感器每天 24 行数据，因此体积足够小，可以永久保留。

## 哪些实体会生成统计数据

只有具有[状态类](https://www.hasscn.top/contributors/glossary/state-class/)（state class）的传感器才会保留统计数据。存储的内容取决于该状态类：

| 状态类 | 示例 | 每个时间段存储的内容 |
| --- | --- | --- |
| `measurement` | 温度，或当前用电功率。 | `mean`、`min` 和 `max`。 |
| `measurement_angle` | 风向。 | 圆形 `mean`（平均值），因此 350 度和 10 度的平均值是 0，而不是 180。 |
| `total` 或 `total_increasing` | 电表，或水表。 | `state`、`sum` 和 `last_reset_ts`。 |

对于计量表：

- `state` 是该时间段结束时传感器的数值。
- `sum` 是自该传感器首次编译统计数据以来的累计总量。两个时间段的 `sum` 之差就是这期间的使用量，即使期间计量表被重置过也是如此。
- `last_reset_ts` 是计量表上次开始新周期的时刻（如果已知）。

集成如何为其传感器启用统计数据，在[传感器实体](https://www.hasscn.top/contributors/core/entities/sensor/#long-term-statistics)中有说明。

统计数据也可以从外部来源导入，例如能源供应商的历史记录。这些统计数据的 ID 中使用 `:` 而不是 `.`，例如 `energy_provider:electricity_import`。

## 相关数据表

### `statistics_meta`

每个统计数据一行，描述它是什么。

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `id` | 整数，主键 | 数据表使用的 ID。 |
| `statistic_id` | 字符串 | 对于实体，即实体 ID。对于导入的统计数据，则是类似 `domain:name` 的 ID。重命名实体会更新它。 |
| `source` | 字符串 | 数据来源：实体为 `recorder`，或导入它的集成的域名。 |
| `unit_of_measurement` | 字符串 | 统计数据的单位。 |
| `unit_class` | 字符串 | 单位的类别，例如 `energy` 或 `temperature`，用于单位之间的换算。 |
| `mean_type` | 整数 | `0` 表示无平均值，`1` 表示普通平均值，`2` 表示圆形平均值。 |
| `has_sum` | 布尔值 | 该统计数据是否有 `sum`。 |
| `name` | 字符串 | 名称，主要用于导入的统计数据。 |

还有一个 `has_mean` 列，它正在被 `mean_type` 取代。

### `statistics` 和 `statistics_short_term`

这两个表具有相同的列。`statistics` 每小时一行，`statistics_short_term` 每 5 分钟一行。

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `id` | 整数，主键 | 该行的 ID。 |
| `metadata_id` | 整数，指向 `statistics_meta` | 对应哪个统计数据。 |
| `start_ts` | 时间戳 | 时间段的开始时间。 |
| `created_ts` | 时间戳 | 该行的写入时间。 |
| `mean` | 数值 | 该时间段内按时间加权的平均值。 |
| `mean_weight` | 数值 | 用于合并圆形平均值的权重。 |
| `min` | 数值 | 该时间段内的最小值。 |
| `max` | 数值 | 该时间段内的最大值。 |
| `state` | 数值 | 对于计量表：该时间段结束时的数值。 |
| `sum` | 数值 | 对于计量表：累计总量。 |
| `last_reset_ts` | 时间戳 | 对于计量表：上一个周期开始的时间。 |

每个表都在 `metadata_id` 和 `start_ts` 上建立了索引。

### `statistics_runs`

记录哪些时间段已经编译过统计数据，从而避免重复编译，并在重启后补齐遗漏的时间段。

| 列 | 类型 | 说明 |
| --- | --- | --- |
| `run_id` | 整数，主键 | 该行的 ID。 |
| `start` | 日期和时间 | 已编译时间段的开始时间。 |

## 在哪里可以查看统计数据

- [历史](https://www.home-assistant.io/integrations/history/)面板，用于查看早于所保留状态的时间段。
- [统计图表卡片](https://www.home-assistant.io/dashboards/statistics-graph/)和[统计卡片](https://www.home-assistant.io/dashboards/statistic/)。
- [能源仪表盘](https://www.home-assistant.io/docs/energy/)。
- `recorder.get_statistics` 动作，可在脚本和自动化中使用这些数据。
