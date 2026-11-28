# 系统健康

> 在系统信息页面上显示您的集成的状态，例如服务器是否可访问以及剩余配额还有多少。

Source: https://www.hasscn.top/contributors/core/integrations/system-health/

系统信息页面显示 Home Assistant 的运行状况，每个集成（integration）都对应一个部分。用户可以在 **设置** > **系统** > **修复** 页面的右上角菜单中，在 **系统信息** 下找到它。用户会将其复制到 issue 中，因此这里是放置有助于故障排查的事实信息的好地方：服务器是否可访问、集成连接到哪台服务器，或者请求配额还剩多少。

## 添加系统健康

创建 `system_health.py`，并注册一个返回该信息的函数：

```python
from typing import Any

from homeassistant.components import system_health
from homeassistant.core import HomeAssistant, callback


@callback
def async_register(
    hass: HomeAssistant, register: system_health.SystemHealthRegistration
) -> None:
    """Register the system health info."""
    register.async_register_info(system_health_info)


async def system_health_info(hass: HomeAssistant) -> dict[str, Any]:
    """Return the system health info."""
    info: dict[str, Any] = {
        # Checking the server can take a while, so pass the coroutine
        "can_reach_server": system_health.async_check_can_reach_url(
            hass, API_ENDPOINT
        ),
    }

    entries: list[ExampleConfigEntry] = (
        hass.config_entries.async_loaded_entries(DOMAIN)
    )
    if entries:
        quota = await entries[0].runtime_data.client.get_quota()
        info["remaining_requests"] = quota.remaining

    return info
```

只有在条目（entry）已加载的情况下才能依赖 `runtime_data`。`async_entries` 还会返回被忽略、已禁用、设置失败或已卸载的条目。卸载会移除 `runtime_data`，而其他那些条目可能从未有过它。因此请使用 `async_loaded_entries`，并处理好它不存在的情况。

这些值可以是任意类型，也可以是协程（coroutine）。对于协程，前端会显示加载动画（spinner），并在其完成后填入结果。`async_check_can_reach_url` 是一个现成的、用于检查 URL 是否可访问的函数。

`async_register_info` 还接受一个 `manage_url` 参数，即指向用户可管理该集成或帐户的链接。

## 文本

在 `strings.json` 中的 `system_health` 下，为每个键提供一个标签：

```json
{
  "system_health": {
    "info": {
      "can_reach_server": "Reach Example server",
      "remaining_requests": "Remaining allowed requests"
    }
  }
}
```
