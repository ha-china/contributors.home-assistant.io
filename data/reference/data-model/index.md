# 数据模型

> 事件、状态、上下文和动作，是 Home Assistant 记录的一切的基础构件。

Source: https://www.hasscn.top/contributors/data/reference/data-model/

Home Assistant 功能繁多，但其底层建立在一个小巧简单的数据模型之上：事件、状态和上下文。了解了这些，数据库中的数据就一目了然了。

## 事件

Home Assistant 是事件驱动的。发生的一切都是事件：一盏灯被打开、一个运动传感器检测到运动、一个自动化被触发。每个事件都有一个类型、一些数据、一个时间和一个上下文。

你会经常看到的一些内置事件：

| 事件类型 | 触发时机 | 数据 |
| --- | --- | --- |
| `state_changed` | 实体（entity）的状态发生变化。 | `entity_id`、`old_state` 和 `new_state`。当缺少 `old_state` 时，表示该实体是新出现的。当缺少 `new_state` 时，表示该实体已被移除。 |
| `call_service` | 执行了一个动作（action），例如 `light.turn_on`。 | `domain`、以 `service` 表示的动作，以及以 `service_data` 表示的数据。 |
| `automation_triggered` | 一个自动化（automation）被触发。 | 自动化的 `name` 和 `entity_id`。 |
| `script_started` | 一个脚本开始运行。 | 脚本的 `name` 和 `entity_id`。 |
| `service_registered` | 一个集成（integration）注册了新的动作。 | `domain`，以及以 `service` 表示的动作。 |
| `homeassistant_start` 和 `homeassistant_stop` | Home Assistant 启动和停止。 | 无。 |

事件名称和字段中仍然使用旧词 "service" 来指代现在所谓的[动作](https://www.hasscn.top/contributors/glossary/action/)。

不要依赖 `homeassistant_stop` 来判断 Home Assistant 何时停止：如果没有正常关机，该事件将永远不会被触发。`recorder_runs` 表更可靠。参见[数据库模式](https://www.hasscn.top/contributors/data/reference/database-schema/#recorder-runs)。

## 状态

每个[实体](https://www.hasscn.top/contributors/glossary/entity/)都有一个[状态](https://www.hasscn.top/contributors/glossary/state/)。一个状态包含：

- 实体 ID，格式为 `<domain>.<object_id>`，例如 `light.kitchen`。域（domain）告诉你它是什么类型的实体，以及应该有哪些属性。
- 状态本身，例如 `on` 或 `21.5`。
- 进一步描述它的属性，例如一盏灯的亮度和颜色。
- 时间戳：`last_changed`、`last_updated` 和 `last_reported`。

这三个时间戳的含义各不相同：

- `last_changed` 仅在状态值发生变化时更新。一盏灯被打开会改变它；一盏灯改变颜色则不会。
- `last_updated` 在状态值或任何属性发生变化时更新。一盏灯被打开，以及一盏灯改变颜色，都会改变它。
- `last_reported` 在集成每次上报状态时更新，即使什么都没有变化。

通过 `last_changed`，你可以知道一盏灯已经开了多久。通过 `last_updated`，你可以知道它保持当前颜色多久了。

## 上下文

上下文将事件和状态联系在一起。每当有东西发起一个变更时，例如 UI 中的人、一个自动化或一个设备，就会创建一个新的上下文。由它引发的每个事件和状态变更都携带该上下文。因此，你总能将一个变更追溯到它的起因。

一个上下文有三个字段：

| 字段 | 含义 |
| --- | --- |
| `id` | 上下文的唯一 ID。 |
| `user_id` | 发起变更的用户（如果 Home Assistant 知道的话）。通常在变更来自 UI 时才会填充。 |
| `parent_id` | 导致此上下文的父上下文。一个自动化会创建自己的上下文，即使它的触发器已经有一个上下文，并在这里指向触发器的上下文。这样可以将自动化的动作与触发它的用户的权限分离开来。 |

例如，当 Paulus 回到家时：

1. `device_tracker.paulus_phone` 从 `not_home` 变为 `home`。
2. 自动化 "Paulus is home" 被触发，并带着一个新的上下文触发 `automation_triggered` 事件，该上下文以步骤 1 的上下文作为父上下文。
3. 该自动化执行 `light.turn_on`，并以步骤 2 的上下文触发 `call_service` 事件。
4. `light.living_room` 被打开，其新状态同样携带步骤 2 的上下文。

日志簿（logbook）利用这一点来显示是什么导致了变更。目前并非每个触发器都会创建上下文，而且也没有内置的方法可以在自动化或模板中查找某个上下文的最初起因。

## 动作

集成提供动作，例如 `light.turn_on` 或 `notify.send_message`。一个动作由其域和名称标识，并接受说明要做什么的数据，例如要打开哪盏灯。

动作不会存储在单独的表中。你可以从 `service_registered` 事件中找到存在哪些动作，从 `call_service` 事件中找到执行了哪些动作。

## 存储位置

[记录器](https://www.hasscn.top/contributors/glossary/recorder/)（recorder）将事件和状态写入数据库。[数据库模式](https://www.hasscn.top/contributors/data/reference/database-schema/)解释了各个表，[统计信息](https://www.hasscn.top/contributors/data/reference/statistics/)解释了 Home Assistant 为长期保存而保留的汇总数据。
