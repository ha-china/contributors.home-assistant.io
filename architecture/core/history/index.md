# 历史与统计

> 记录器（recorder）如何将每次状态变更写入数据库，以及历史、日志簿和长期统计如何读取这些数据。

Source: https://www.hasscn.top/contributors/architecture/core/history/

Home Assistant 中发生的一切都可以回溯查看：门是什么时候打开的、昨天有多暖和、上个月家里用了多少电。[记录器（recorder）](https://www.hasscn.top/contributors/glossary/recorder/)让这一切成为可能。它将状态和事件写入数据库，其他集成再从中读取。

## 简而言之

- 记录器运行在自己的线程中，因此写入数据库不会阻塞[事件循环（event loop）](https://www.hasscn.top/contributors/core/internals/asyncio/)。
- 它存储每一次状态变更和事件，默认保留 10 天。
- 对于具有[状态类（state class）](https://www.hasscn.top/contributors/glossary/state-class/)的传感器，它还会保存统计数据：五分钟汇总与历史数据保留同样长的时间，小时汇总则永久保留。
- 历史图表、日志簿和能源仪表盘都从记录器的数据库中读取数据。

## 记录器

记录器监听事件总线上的每一个事件，并每 5 秒批量写入数据库。它的数据库默认为 SQLite，即配置文件夹中名为 `home-assistant_v2.db` 的文件。同时也支持 MariaDB、MySQL 和 PostgreSQL，参见 [ADR-0018](https://github.com/home-assistant/architecture/blob/master/adr/0018-supported-databases.md)。

状态及其属性分开存储，相同的属性只存储一次。这样即使同一盏灯一天内多次上报相同的属性，数据库也能保持较小。

每天晚上，记录器会删除早于 `purge_keep_days` 的数据，默认为 10 天。

## 统计

10 天的历史数据不足以比较今年冬天和去年冬天，而永久保留每一次状态变更又会填满磁盘。统计解决了这个问题。对于每个具有状态类的传感器，记录器会汇总：

- **短期统计**，每五分钟一次：平均值、最小值和最大值，对于计量表则是总和。它们随历史数据一起清理。
- **长期统计**，每小时一次，永久保留。

没有状态类的传感器不会生成任何统计。这就是状态类对传感器如此重要，也是能源仪表盘只支持具有状态类的传感器的原因。

## 谁在读取它

| 集成 | 显示内容 |
| --- | --- |
| `history` | 随时间变化的状态，用于图表 |
| `logbook` | 用文字描述发生的事情：“前门已打开” |
| `energy` | 能源使用和生产情况，来自长期统计 |

## 不应记录的内容

并非所有内容都适合存入数据库。频繁变化或体积较大的属性（例如所有支持的效果的列表）会让数据库快速增长。实体（entity）可以通过 `_unrecorded_attributes` 排除某些属性，各类实体类型也会对从不变化的属性做同样处理。

用户可以在其配置中排除整个实体。

## 代码位置

| 内容 | 位置 |
| --- | --- |
| 记录器 | [`homeassistant/components/recorder/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/recorder) |
| 数据库表 | 记录器中的 `db_schema.py` |
| 统计汇总 | 记录器中的 `statistics.py` |
| 历史与日志簿 | [`homeassistant/components/history/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/history)、[`homeassistant/components/logbook/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/logbook) |

## 参与开发

- 刚接触 Core？从[你的第一个 Core 贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。
- [传感器实体（sensor entity）](https://www.hasscn.top/contributors/core/entities/sensor/)：状态类决定了传感器是否能生成统计。
- 想查看自己家庭的数据？请在数据区域[探索你自己的数据](https://www.hasscn.top/contributors/data/guides/explore-your-data/)。
