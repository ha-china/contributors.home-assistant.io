# 状态

> 实体（entity）的当前值，例如 `on`、`21.5` 或 `playing`，连同其属性一起。

Source: https://www.hasscn.top/contributors/glossary/state/

- In code: `State`, `hass.states`, `native_value`
- Also: states, state object

状态存储在[状态机（state machine）](https://www.hasscn.top/contributors/glossary/state-machine/)中。状态始终以字符串形式存储，即使它是一个数字。当状态发生变化时，Home Assistant 会触发 `state_changed` [事件（event）](https://www.hasscn.top/contributors/glossary/event/)，并且记录器（recorder）会将其写入历史记录。

有两种状态比较特殊：[不可用（unavailable）和未知（unknown）](https://www.hasscn.top/contributors/glossary/unavailable/)。

## Related terms

- [实体（Entity）](https://www.hasscn.top/contributors/glossary/entity/): Home Assistant 可以显示、测量或控制的一个事物，例如灯、温度传感器或开关。每个实体都有一个状态。
- [属性（Attribute）](https://www.hasscn.top/contributors/glossary/attribute/): 随状态（state）一起提供的额外信息，例如灯的亮度或它支持的效果列表。
- [状态机（state machine）](https://www.hasscn.top/contributors/glossary/state-machine/): Home Assistant Core 中保存每个实体（entity）当前状态的部分。
- [不可用（Unavailable）](https://www.hasscn.top/contributors/glossary/unavailable/): 实体（entity）的一种特殊状态，表示 Home Assistant 目前无法访问它。与之相对的 unknown 状态表示可以访问但尚无值。
