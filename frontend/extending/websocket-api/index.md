# 添加 WebSocket 命令

> 在 Core 中通过 WebSocket 命令将集成（integration）的数据提供给前端，并从前端调用它。

Source: https://www.hasscn.top/contributors/frontend/extending/websocket-api/

前端通过 WebSocket 连接与 Core 通信。当你的集成拥有前端需要的数据，而这些数据既不是实体（entity）状态也不是属性（attribute）时，可以添加一个 WebSocket 命令。命令可以只应答一次，也可以作为订阅持续发送更新。

## 在 Core 中

命令是一个带有装饰器的函数，装饰器用于设置其消息类型和数据模式（schema）。类型以你的集成的域（domain）作为前缀。

```python
from typing import Any

import probatio

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback


@websocket_api.websocket_command(
    {
        probatio.Required("type"): "example/get_status",
        probatio.Required("device_id"): str,
    }
)
@callback
def ws_get_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the status of a device."""
    status = hass.data[DOMAIN].get(msg["device_id"])
    if status is None:
        connection.send_error(msg["id"], "not_found", "Device not found")
        return

    connection.send_result(msg["id"], {"status": status})
```

在集成被设置时注册该命令：

```python
async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the example integration."""
    websocket_api.async_register_command(hass, ws_get_status)
    return True
```

你的集成不需要在 manifest 中将 `websocket_api` 声明为依赖项。无论哪种方式，命令都会被注册，并且只要 WebSocket API 运行即可使用。

用 `@callback` 装饰的函数在[事件循环（event loop）](https://www.hasscn.top/contributors/glossary/event-loop/)中运行，因此它不能执行任何 I/O 操作。当你的命令需要等待设备或网络时，请将其设为 `async`，并在 `websocket_command` 下方添加 `@websocket_api.async_response`：

```python
@websocket_api.websocket_command(
    {probatio.Required("type"): "example/refresh"}
)
@websocket_api.async_response
async def ws_refresh(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Refresh all devices."""
    await hass.data[DOMAIN].async_refresh()
    connection.send_result(msg["id"])
```

对于仅限管理员使用的命令，请添加 `@websocket_api.require_admin`。

### 订阅

对于会变化的数据，先发送第一个结果，然后在每次变化时发送带有相同消息 ID 的事件。将一个用于停止更新的函数存储在 `connection.subscriptions` 中，当前端取消订阅或断开连接时，Core 会调用它：

```python
@websocket_api.websocket_command(
    {probatio.Required("type"): "example/subscribe_status"}
)
@callback
def ws_subscribe_status(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Send status updates to the frontend."""

    @callback
    def on_update(status: dict[str, Any]) -> None:
        connection.send_event(msg["id"], status)

    connection.subscriptions[msg["id"]] = hass.data[DOMAIN].subscribe(
        on_update
    )
    connection.send_result(msg["id"])
```

[WebSocket API 参考](https://www.hasscn.top/contributors/core/internals/websocket-api/)更深入地介绍了 Core 的 WebSocket API。

## 在前端中

将你的命令的类型和函数添加到 [`src/data/`](https://github.com/home-assistant/frontend/tree/dev/src/data) 中以你的集成命名的模块里。组件调用该函数，而不是直接发送原始消息：

```ts
export interface ExampleStatus {
  status: string;
}

export const fetchExampleStatus = (
  hass: HomeAssistant,
  deviceId: string
) =>
  hass.callWS<ExampleStatus>({
    type: "example/get_status",
    device_id: deviceId,
  });

export const subscribeExampleStatus = (
  conn: Connection,
  onChange: (status: ExampleStatus) => void
) =>
  conn.subscribeMessage<ExampleStatus>(onChange, {
    type: "example/subscribe_status",
  });
```

`hass.callWS()` 返回一个 promise，当 Core 发送错误时该 promise 会以该错误拒绝。`subscribeMessage()` 返回一个 promise，其结果是一个用于取消订阅的函数。在组件中，从 `hassSubscribe()` 返回它，`SubscribeMixin` 会自动清理它。[数据层](https://www.hasscn.top/contributors/frontend/architecture/data/)解释了这些模式。

自定义卡片和面板可以用同样的方式调用你的命令，使用 `hass.callWS()` 或 `hass.connection.subscribeMessage()`。
