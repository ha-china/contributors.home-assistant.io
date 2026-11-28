# 属性（Attribute）

> 随状态（state）一起提供的额外信息，例如灯的亮度或它支持的效果列表。

Source: https://www.hasscn.top/contributors/glossary/attribute/

- In code: `extra_state_attributes`
- Also: attributes, state attributes

属性（attribute）是对状态的描述，它们本身并不是独立的值。用户希望在图表中单独查看或在自动化（automation）中单独使用的内容，例如设备的电池电量，更适合作为单独的实体（entity）。

## Related terms

- [状态](https://www.hasscn.top/contributors/glossary/state/): 实体（entity）的当前值，例如 `on`、`21.5` 或 `playing`，连同其属性一起。
- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
