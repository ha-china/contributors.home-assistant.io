# hass 对象

> 集成所获取的 `HomeAssistant` 实例，可访问状态机、事件总线、服务和配置。

Source: https://www.hasscn.top/contributors/glossary/hass/

- In code: `HomeAssistant`, `hass`
- Also: hass

在 Home Assistant Core 中，几乎每个函数都将 `hass` 作为其第一个参数。它是代码访问其他一切内容的途径：`hass.states`、`hass.bus`、`hass.services` 和 `hass.config`。

`hass` 是代码中的名称。在文字中，请写作 Home Assistant。

## Related terms

- [状态机（state machine）](https://www.hasscn.top/contributors/glossary/state-machine/): Home Assistant Core 中保存每个实体（entity）当前状态的部分。
- [事件（Event）](https://www.hasscn.top/contributors/glossary/event/): 事件总线（event bus）上的一条消息，表示发生了某件事情，例如状态变化或按钮按下。任何代码都可以监听事件。
- [动作（Action）](https://www.hasscn.top/contributors/glossary/action/): Home Assistant 可以执行的操作，例如打开灯或发送通知。自动化、脚本和仪表盘会执行动作。
- [事件循环（event loop）](https://www.hasscn.top/contributors/glossary/event-loop/): 运行 Home Assistant Core 的 asyncio 循环。阻塞它的代码，比如在没有 `await` 的情况下等待网络，会让其他所有任务都停止。
