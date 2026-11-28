# 获取数据

> 集成如何通过推送或轮询从设备和服务获取新数据，以及协调器（coordinator）如何让这一过程保持高效。

Source: https://www.hasscn.top/contributors/architecture/core/data-updates/

集成必须知道设备上何时发生了变化：一盏灯被它自己的开关打开了，温度升高了。有两种方法可以获知这些变化，而两者的差异对集成的响应速度和资源占用影响很大。

本页是概览。如何通过代码实现，请参阅核心与集成部分的[获取数据](https://www.hasscn.top/contributors/core/integrations/fetching-data/)。

## 简而言之

- **推送（push）**：设备或服务在发生变化时主动告知 Home Assistant。速度快，而且在没有变化时不产生任何开销。只要设备支持，就应使用它。
- **轮询（polling）**：Home Assistant 按固定间隔请求新数据。简单，但速度较慢，并且会给设备和网络带来负担。
- **协调器（coordinator）**为设备的所有实体（entity）只获取一次数据，然后分发给它们。大多数轮询集成都使用它。
- 当获取数据失败时，实体会变为[不可用（unavailable）](https://www.hasscn.top/contributors/glossary/unavailable/)。它们绝不会显示编造的或过期的值。

## 推送还是轮询

使用推送时，集成会保持一个连接打开，或监听消息，并在有数据到达时写入实体的新状态。推送集成的 [IoT 类别](https://www.hasscn.top/contributors/glossary/iot-class/)为 `local_push` 或 `cloud_push`。

当设备只能被询问时，Home Assistant 会按计划进行询问。如果所有实体都来自同一台设备，那么逐个轮询每个实体就很浪费：一台有十个传感器的设备会被就同样的数据询问十次。

## 协调器

`DataUpdateCoordinator` 为整台设备或整个账户获取数据，每个间隔只获取一次，并在新数据到达时通知其实体。实体从协调器读取数据，它们自己不获取任何东西。它还将错误处理集中在一处：当获取失败时，其所有实体都会变为不可用，直到下一次成功；而登录问题则会启动[重新认证（reauthentication）](https://www.hasscn.top/contributors/glossary/reauthentication/)流程。

协调器也适用于推送：接收数据的集成可以将数据交给协调器，实体会以同样的方式更新。

## 做一个好邻居

尽可能少地轮询、限制同时运行的请求数量、在服务中断时只记录一次日志而不是每次尝试都记录，这些都是[集成质量标准（integration quality scale）](https://www.hasscn.top/contributors/glossary/quality-scale/)的规则。请参阅[合理的轮询](https://www.hasscn.top/contributors/core/quality-scale/appropriate-polling/)、[并行更新](https://www.hasscn.top/contributors/core/quality-scale/parallel-updates/)和[不可用时只记录一次日志](https://www.hasscn.top/contributors/core/quality-scale/log-when-unavailable/)。

## 代码位置

| 内容 | 位置 |
| --- | --- |
| `DataUpdateCoordinator`、`CoordinatorEntity`、`UpdateFailed` | [`homeassistant/helpers/update_coordinator.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/update_coordinator.py) |
| 轮询、`SCAN_INTERVAL`、`PARALLEL_UPDATES` | [`homeassistant/helpers/entity_platform.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/entity_platform.py) |

## 参与贡献

- 刚接触 Core？从[你的第一次 Core 贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。
- [获取数据](https://www.hasscn.top/contributors/core/integrations/fetching-data/)：推送、轮询和协调器，附代码。
- [更新状态](https://www.hasscn.top/contributors/core/entities/state-updates/)：实体如何写入其新状态。
