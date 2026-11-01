---
title: 线程安全
description: 当代码在事件循环（event loop）之外运行时应调用哪个 API，以及如何修复 Home Assistant 报告的线程安全错误。
sidebarGroup: Async
order: 11
---

asyncio 中的几乎所有内容都不是线程安全的，Home Assistant 的核心对象也是如此。从另一个线程调用 `async_` 方法可能会破坏事件循环的内部状态。其结果并不是一个清晰的错误，而是难以追溯的随机异常行为和重启。

因此 Home Assistant 会进行检查。许多 `async_` API 会验证自己是否是从事件循环线程中调用的。如果不是，Home Assistant 会通过堆栈跟踪报告这次调用，并将其阻止以保持系统稳定。如果您是通过这样的报告来到这里的：堆栈跟踪指向的就是发起调用的代码。

## 规则

- 在事件循环中，位于协程（coroutine）或 `@callback` 函数中：调用 `async_` 版本。
- 在另一个线程中，例如执行器（executor）任务或来自同步库的回调：调用不带 `async_` 的版本，或者将工作调度到事件循环上执行。

## 常见原因：缺少 @callback

接受函数作为参数的辅助函数（helper）会通过检查该函数来决定如何运行它。协程函数或用 `@callback` 装饰的函数会在事件循环中运行。其他任何函数都被视为阻塞函数，并在执行器中运行。

```python
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, EventStateChangedData, callback
from homeassistant.helpers.event import async_track_state_change_event


async def async_added_to_hass(self) -> None:
    """Start tracking the other light."""
    self.async_on_remove(
        async_track_state_change_event(
            self.hass, ["light.other"], self._async_light_changed
        )
    )


@callback
def _async_light_changed(
    self, event: Event[EventStateChangedData]
) -> None:
    """Follow the state of the other light."""
    new_state = event.data["new_state"]
    if new_state is None or new_state.state in (
        STATE_UNAVAILABLE,
        STATE_UNKNOWN,
    ):
        return

    self.async_write_ha_state()
```

如果没有 `@callback`，`_async_light_changed` 就会在一个线程中运行，而 `async_write_ha_state` 就会从错误的线程中被调用。修复只需一行代码。

## 从线程中：应改用什么来调用

| 在事件循环中 | 从另一个线程 |
| --- | --- |
| `hass.async_create_task` | `hass.create_task` |
| `hass.bus.async_fire` | `hass.bus.fire` |
| `hass.services.async_register` | `hass.services.register` |
| `hass.services.async_remove` | `hass.services.remove` |
| `hass.states.async_set` | `hass.states.set` |
| `self.async_write_ha_state()` | `self.schedule_update_ha_state()` |
| `async_dispatcher_send` | `dispatcher_send` |
| `issue_registry.async_create_issue` | `issue_registry.create_issue` |
| `issue_registry.async_delete_issue` | `issue_registry.delete_issue` |

有些 API 完全没有线程安全的版本：

- 区域（area）、类别（category）、设备（device）、实体（entity）、楼层（floor）和标签（label）注册表，包括 `async_get_or_create`、`async_update_entity`、`async_update_device` 和 `async_remove`。
- `hass.config_entries.async_update_entry` 和 `hass.config_entries.async_update_subentry`。
- 渲染模板，如 `async_render_to_info`。
- 使用 `issue_registry.async_ignore_issue` 忽略问题。
- 使用 `issue_registry.async_refresh_issues` 刷新一组问题，以及使用 `issue_registry.async_keep_issue` 保留问题。参见[从另一个线程刷新](/core/integrations/repairs/#refresh-from-another-thread)。

对于这些情况，可以将进行调用的函数调度到事件循环上执行。`hass.add_job` 可以从任何线程做到这一点：

```python
from homeassistant.core import callback


@callback
def _async_update_title(entry: ConfigEntry, title: str) -> None:
    """Update the title of the config entry."""
    hass.config_entries.async_update_entry(entry, title=title)


# In a thread:
hass.add_job(_async_update_title, entry, "New title")
```

更好的做法是：问问自己为什么代码要在某个线程中运行。通常这是因为有一个同步库，它可以在边界处封装一次，这样集成的其余部分就能留在事件循环中。

## 尽早发现错误

在开发时开启调试模式，即在 `configuration.yaml` 的 `homeassistant:` 下设置 `debug: true`。之后 Home Assistant 会检查更多的调用，并立即报告它们。参见[Home Assistant 中的 async](/core/internals/asyncio/#find-mistakes-early)。
