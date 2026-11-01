---
title: 事件总线
description: 事件总线的工作原理、如何触发你自己的事件，以及如何在监听事件时不泄漏监听器。
sidebarGroup: The core
order: 2
sidebarLabel: Events
---

本页介绍事件总线的底层工作原理。如果要从你的集成（integration）中触发事件，或者使用事件辅助元素（helpers）对 Home Assistant 中发生的事情做出反应，请参阅[集成中的事件](/core/integrations/events/)。

Home Assistant 由事件驱动。状态（state）发生变化：这是一个事件。调用了一个动作（action）：是一个事件。Home Assistant 启动或停止：也是事件。`hass.bus` 上的事件总线承载着所有这些事件，任何代码都可以监听。

在实践中，你很少直接监听原始总线。Home Assistant 为常见场景提供了[辅助元素](/core/integrations/events/#listen-to-home-assistant)，例如跟踪状态变化或每分钟运行某项任务。在合适的情况下请使用它们。本页将解释它们建立在什么之上。

## 什么是事件

事件是来自 `homeassistant.core` 的一个 `Event` 对象，包含以下属性：

- `event_type`：一个字符串，最多 64 个字符。自定义事件会以你的集成的域（domain）作为前缀，例如 `my_integration_button_pressed`。
- `data`：一个字典。请保持它可以被 JSON 序列化，因为事件会被 recorder 存储，并通过 WebSocket API 发送。
- `context`：导致该事件的 `Context`。它将事件与启动它的用户、自动化（automation）或动作关联起来。
- `origin`：来自本实例的事件为 `EventOrigin.local`，从外部进入的事件（例如通过 REST API）为 `EventOrigin.remote`。
- `time_fired`：事件被触发的时间。

Home Assistant 本身会触发诸如 `state_changed`、`call_service`、`homeassistant_start`、`homeassistant_started` 和 `homeassistant_stop` 之类的事件。这些常量位于 `homeassistant/const.py` 中，例如 `EVENT_STATE_CHANGED`。[home-assistant.io 上的事件参考](https://www.home-assistant.io/docs/configuration/events/)列出了用户能看到的事件。

> [!IMPORTANT]
> 事件会被记录到数据库中。在频繁触发事件之前，请先考虑事件数据的大小和结构。[数据科学门户](https://data.home-assistant.io/docs/events/)解释了事件是如何存储的。

## 触发事件

在事件循环（event loop）中，使用 `async_fire`：

```python
from homeassistant.core import HomeAssistant

DOMAIN = "my_integration"


async def async_press(hass: HomeAssistant, button_id: str) -> None:
    """Tell the rest of Home Assistant a button was pressed."""
    hass.bus.async_fire(
        f"{DOMAIN}_button_pressed",
        {"button_id": button_id},
    )
```

在其他线程中，请改用 `hass.bus.fire`。它会为你把事件调度到事件循环上。参见[线程安全](/core/internals/thread-safety/)。

当你因为用户做了某个操作而触发事件时，请传入该用户的 `context`，以便日志簿（logbook）和权限系统能够将其归因。在动作处理函数内部，它就是 `call.context`。

表示物理按钮或遥控器的集成通常需要使用[事件实体（event entity）](/core/entities/event/)而不是原始事件。参见[使设备事件可用](/core/integrations/events/#make-device-events-available)。

## 监听事件

`async_listen` 会注册一个监听器（listener），并返回一个用于移除它的函数。请务必保存该函数，并在用完之后调用它，否则你的监听器将永远存在。

```python
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import Event, HomeAssistant, callback


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry
) -> None:
    """Set up my integration."""

    @callback
    def handle_stop(event: Event) -> None:
        """Close the connection when Home Assistant stops."""
        entry.runtime_data.close()

    entry.async_on_unload(
        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, handle_stop)
    )
```

`entry.async_on_unload` 会在配置条目（config entry）被卸载时调用移除函数。在实体中，以同样的方式使用 `self.async_on_remove`。

需要了解的几点：

- **监听器如何运行取决于它是什么。** 用 `@callback` 装饰的函数直接在事件循环中运行。协程函数作为任务在事件循环中运行。没有 `@callback` 的普通函数则在 executor 的一个线程中运行。对于小型、非阻塞的监听器，请用 `@callback` 装饰：这是最快的选项。
- **只监听一种事件类型。** 你可以传入 `MATCH_ALL` 来获取所有事件，但这开销很大，而且很少是你想要的。
- **尽早过滤。** `async_listen` 接受一个可选的 `event_filter`：一个 `@callback` 函数，它会接收事件数据，并在监听器应当运行时返回 `True`。它在你的监听器被调度之前运行，可以在繁忙的总线上节省工作量。
- **`async_listen_once`** 会在第一个事件之后移除监听器。

为了给事件数据添加类型，core 使用了 `homeassistant.util.event_type` 中的 `EventType`。`EVENT_STATE_CHANGED` 是一个 `EventType[EventStateChangedData]`，因此监听器会得到 `Event[EventStateChangedData]`，类型检查器也就知道 `event.data` 里有什么。

## 常见事件的辅助元素

`homeassistant.helpers.event` 在 `async_listen` 的基础上，为常见需求提供了辅助元素，例如跟踪几个实体（entity）的状态，或在一天中的某个时间运行某项任务。它们会替你进行过滤，并像 `async_listen` 一样返回一个用于移除监听器的函数。完整列表及示例见[集成中的事件](/core/integrations/events/#listen-to-home-assistant)。

## 事件还是调度器

事件会经过总线传输、被记录下来，并且任何人都可以看到，包括自动化和 WebSocket API。对于只在你的集成内部才有意义的信号，例如“设备 12 有新数据到达”，请改用 `homeassistant.helpers.dispatcher` 中的调度器（dispatcher）。`async_dispatcher_send` 和 `async_dispatcher_connect` 的工作方式与事件类似，但它们只存在于内存中，不会被记录。
