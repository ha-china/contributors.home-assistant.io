# 协调器（Coordinator）

> 一种辅助元素（helper），按计划一次性为多个实体（entity）获取数据，从而只需向设备或 API 请求一次，而不是每个实体各请求一次。

Source: https://www.hasscn.top/contributors/glossary/coordinator/

- In code: `DataUpdateCoordinator`, `CoordinatorEntity`
- Also: data update coordinator, update coordinator

由协调器获取数据的实体会一起更新，即在协调器有新数据时更新。协调器还将错误处理集中在一处：当获取数据失败时，其实体会变为[不可用（unavailable）](https://www.hasscn.top/contributors/glossary/unavailable/)。

## Related terms

- [轮询（Polling）](https://www.hasscn.top/contributors/glossary/polling/): 按固定时间间隔向设备或服务请求新数据。与之相反的是推送（push），即设备在发生变化时主动发送更新。
- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [不可用（Unavailable）](https://www.hasscn.top/contributors/glossary/unavailable/): 实体（entity）的一种特殊状态，表示 Home Assistant 目前无法访问它。与之相对的 unknown 状态表示可以访问但尚无值。
