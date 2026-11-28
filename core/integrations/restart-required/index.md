# 请求重启

> 告诉 Home Assistant 需要重启才能应用更改，而无需创建修复（repair）问题。

Source: https://www.hasscn.top/contributors/core/integrations/restart-required/

有些更改只有在 Home Assistant 重启后才会生效，例如对自定义集成的更新，或者仅在启动时读取的设置。为此，您的集成无需创建[修复（repair）](https://www.hasscn.top/contributors/core/integrations/repairs/)问题。它只需请求重启，Home Assistant 会将所有这些请求汇总为面向用户的一个指示器，并附上发出请求的集成列表。

## 更新实体

对于[更新实体](https://www.hasscn.top/contributors/core/entities/update/)（update entity），请将 `restart_required` 设置为 `True`。一旦安装顺利完成而未引发异常，更新实体就会代表您的集成请求重启。如果安装失败，则不会。

```python
class MyUpdate(UpdateEntity):
    """Updates that need a restart to apply."""

    _attr_restart_required = True
```

您也可以在实体描述（entity description）上进行设置，即使用 `UpdateEntityDescription(restart_required=True)`。

## 其他情况

对于更新实体以外的所有情况，请传入您集成的域名（domain）来调用辅助函数（helper）：

```python
from homeassistant.helpers import system_state

system_state.async_set_home_assistant_restart_required(hass, DOMAIN)
```

域名会显示给用户，以便他们了解是什么在等待重启。多次请求没有问题：您的集成只会被列出一次。请在事件循环（event loop）中调用该辅助函数。

只有在更改真正处于等待重启状态时才发起请求。不要提前请求。

## 无法撤回

一旦发出请求，重启请求将保持待处理状态，直到 Home Assistant 重启为止。没有用于清除它的 API。重启本身就会将其清除，而到那时您的更改已经生效。

集成也无法请求重新启动主机（reboot）。Supervisor 会跟踪主机是否需要重新启动，`hassio` 集成会将其传递给 Home Assistant。

## 读取状态

您的集成不需要读取此状态。它是为前端准备的。管理员用户可以使用 `subscribe_system_state` [WebSocket](https://www.hasscn.top/contributors/core/internals/websocket-api/) 命令来订阅它。它会立即发送当前状态，并在每次发生更改时再次发送：

```json
{
  "home_assistant_restart_dismissed": false,
  "home_assistant_restart_required": true,
  "home_assistant_restart_sources": ["demo", "hacs"],
  "host_reboot_dismissed": false,
  "host_reboot_required": false
}
```

## 暂时搁置

管理员可以使用 `dismiss_system_state` WebSocket 命令搁置待处理的请求。这只会在界面中将其隐藏：重启或重新启动主机仍然是必需的，并且 `*_dismissed` 字段会告知订阅者该请求已被搁置。

被搁置的重启请求会在另一个集成发起请求时重新出现。同一个集成再次发起请求则不会使其重新出现。被搁置的主机重新启动请求只有在待处理的重新启动消失、且 Supervisor 再次引发新的重新启动时才会重新出现。这些信息都不会被存储，因此 Home Assistant 重启后就会将其遗忘。
