# 状态类（state class）

> 传感器的值如何表现，例如 `measurement` 或 `total_increasing`，以便 Home Assistant 能为其保留长期统计信息。

Source: https://www.hasscn.top/contributors/glossary/state-class/

- In code: `state_class`, `SensorStateClass`
- Also: state classes

没有状态类（state class）的传感器不会获得[长期统计信息](https://www.hasscn.top/contributors/glossary/statistics/)。能源仪表盘仅适用于具有状态类的传感器。

## Related terms

- [长期统计](https://www.hasscn.top/contributors/glossary/statistics/): 记录器永久保存的传感器数值每小时汇总，例如平均值、最小值和最大值，或累计总量，用于长时间跨度的图表和能源仪表盘。
- [设备类别](https://www.hasscn.top/contributors/glossary/device-class/): 实体（entity）测量什么或是什么，例如 `temperature` 或 `door`。它决定了图标、单位，以及前端如何显示该实体。
- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
