# 状态机（state machine）

> Home Assistant Core 中保存每个实体（entity）当前状态的部分。

Source: https://www.hasscn.top/contributors/glossary/state-machine/

- In code: `hass.states`, `StateMachine`

集成将状态写入其中，而其他一切都从其中读取：自动化、模板、仪表盘。写入通过实体进行，而不是直接写入状态机。

## Related terms

- [状态](https://www.hasscn.top/contributors/glossary/state/): 实体（entity）的当前值，例如 `on`、`21.5` 或 `playing`，连同其属性一起。
- [hass 对象](https://www.hasscn.top/contributors/glossary/hass/): 集成所获取的 `HomeAssistant` 实例，可访问状态机、事件总线、服务和配置。
- [事件（Event）](https://www.hasscn.top/contributors/glossary/event/): 事件总线（event bus）上的一条消息，表示发生了某件事情，例如状态变化或按钮按下。任何代码都可以监听事件。
