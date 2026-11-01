---
title: 传入 Web 会话
description: "铂金规则 inject-websession：库接受 Home Assistant 的 Web 会话。"
sidebarLabel: inject-websession
sidebarGroup: Platinum
order: 2
---

这是一条铂金（Platinum）规则。在 `quality_scale.yaml` 中，它被称为 `inject-websession`。

集成的库必须从外部接受一个 HTTP 会话，并且集成必须传入 Home Assistant 提供的会话。Home Assistant 为 [aiohttp](https://docs.aiohttp.org/) 和 [HTTPX](https://www.python-httpx.org/) 提供了共享会话，因此库会使用其中之一。

## 为什么重要

许多集成都会进行 HTTP 通信。如果每个库都打开自己的会话，Home Assistant 最终会拥有许多连接池，每个连接池都有自己的连接和 SSL 配置。共享会话可以在集成之间复用连接，并使用更少的内存和套接字。

## 示例

在 `async_setup_entry` 中将共享的 aiohttp 会话传递给客户端：

```python
from homeassistant.helpers.aiohttp_client import async_get_clientsession


async def async_setup_entry(
    hass: HomeAssistant, entry: MyConfigEntry
) -> None:
    """Set up My integration from a config entry."""
    session = async_get_clientsession(hass)
    client = MyClient(entry.data[CONF_HOST], session=session)
    ...
```

对于 HTTPX，请使用 `homeassistant.helpers.httpx_client` 中的 `get_async_client`。

有时共享会话并不是你想要的，例如当库使用的 cookie 不应泄露给其他集成时。这时可以创建一个自己的会话，但仍由 Home Assistant 管理：aiohttp 使用 `async_create_clientsession`，HTTPX 使用 `create_async_httpx_client`。

## 如何检查

此规则通过人工审查进行检查。

## 例外情况

如果集成不发出 HTTP 请求，例如它通过 Modbus、蓝牙（Bluetooth）或原始 TCP 套接字进行通信，则此规则不适用。

## 相关规则

- [async-dependency](/core/quality-scale/async-dependency/)：使用异步依赖项。
