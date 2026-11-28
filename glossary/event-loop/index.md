# 事件循环（event loop）

> 运行 Home Assistant Core 的 asyncio 循环。阻塞它的代码，比如在没有 `await` 的情况下等待网络，会让其他所有任务都停止。

Source: https://www.hasscn.top/contributors/glossary/event-loop/

- In code: `async_`, `hass.async_add_executor_job`
- Also: asyncio, executor

以 `async_` 开头的函数在事件循环（event loop）中运行，绝不能阻塞。只能阻塞运行的代码，比如不支持异步的库，则通过 `hass.async_add_executor_job` 在执行器（executor）线程中运行。

## Related terms

- [Home Assistant Core](https://www.hasscn.top/contributors/glossary/core/): Home Assistant 核心的 Python 应用程序，包含所有集成，位于 home-assistant/core 仓库中。
- [hass 对象](https://www.hasscn.top/contributors/glossary/hass/): 集成所获取的 `HomeAssistant` 实例，可访问状态机、事件总线、服务和配置。
