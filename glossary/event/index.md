# 事件（Event）

> 事件总线（event bus）上的一条消息，表示发生了某件事情，例如状态变化或按钮按下。任何代码都可以监听事件。

Source: https://www.hasscn.top/contributors/glossary/event/

- In code: `hass.bus`, `EVENT_STATE_CHANGED`, `EventEntity`
- Also: events, event bus

Home Assistant 会为许多事情触发事件：状态变化、执行某个动作、Home Assistant 启动等。自动化（automation）可以在这些事件上触发。

不要与事件实体（event entity）混淆：事件实体是 `event` 类型的实体，用于显示设备上最近发生的事情，例如按钮按下。

## Related terms

- [状态机（state machine）](https://www.hasscn.top/contributors/glossary/state-machine/): Home Assistant Core 中保存每个实体（entity）当前状态的部分。
- [触发器（Trigger）](https://www.hasscn.top/contributors/glossary/trigger/): 启动自动化的条件，例如状态变化、时间或事件。
- [hass 对象](https://www.hasscn.top/contributors/glossary/hass/): 集成所获取的 `HomeAssistant` 实例，可访问状态机、事件总线、服务和配置。
