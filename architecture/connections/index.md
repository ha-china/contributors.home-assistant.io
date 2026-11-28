# 各部分如何通信

> Home Assistant Core 与其周围一切之间的 API，以及每个连接者如何证明自己的身份。

Source: https://www.hasscn.top/contributors/architecture/connections/

Home Assistant Core 从不孤单。前端、伴侣应用（companion apps）、语音卫星设备、Supervisor 以及 Home Assistant Link 都会与它通信。它们通过少数几个 API 来实现，这些 API 全部由 Core 自带的 Web 服务器提供服务，默认端口为 8123。

## 连接一览

| 谁 | 通过什么与 Core 通信 | 做什么 |
| --- | --- | --- |
| 浏览器或应用中的前端 | [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/) | 一切：状态、操作、设置、实时更新 |
| 伴侣应用 | WebSocket API，以及一个 webhook | 展示前端，并发送传感器数据和位置信息 |
| 脚本和其他软件 | [REST API](https://www.hasscn.top/contributors/core/internals/rest-api/)，或 WebSocket API | 读取状态、执行操作 |
| 互联网上的设备和服务 | Webhooks | 向集成（integration）推送数据 |
| Supervisor | 它自己的 API，以及 Core 的 API | 管理 Core、应用和备份，参见 [the Supervisor](https://www.hasscn.top/contributors/architecture/platform/supervisor/) |

## WebSocket API

WebSocket API 是主要的入口。与 REST API 不同，连接会保持打开，因此 Home Assistant 可以在变化发生的瞬间推送每一次变化：一盏灯打开后，所有屏幕上都会立即显示为开。前端几乎所有的功能都通过 [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) 库使用它。集成也可以添加自己的命令。

REST API 覆盖了基本功能，比如读取状态和执行操作，适合想要简单方式的软件。

## 登录

除了 webhook 之外，每个连接都从证明你的身份开始。用户通过 OAuth 2 流程登录，并获得令牌（token）：一个长期保留的刷新令牌（refresh token），以及有效期 30 分钟的访问令牌（access token）。脚本使用长期访问令牌（long-lived access token），由用户在其个人资料中创建。参见[身份验证的工作原理](https://www.hasscn.top/contributors/core/internals/auth/)和[权限](https://www.hasscn.top/contributors/core/internals/permissions/)。

最重要的界限在于管理员与其他所有人之间：更改设置、添加集成，以及任何会泄露敏感信息的操作，都仅限管理员。参见 [Home Assistant 如何处理信任](https://www.hasscn.top/contributors/security/how-it-works/)。

## Webhooks

Webhook 是唯一无需登录的入口：一个 URL，`/api/webhook/<webhook_id>`，任何人都可以向它发送数据。这是安全的，因为该 ID 是一个随机的 64 字符值：知道它就等于拥有权限。未知 ID 会得到与已知 ID 相同的响应，因此没有人能探测某个 ID 是否存在，而且集成可以让 webhook 只接受来自家庭网络的请求。

Webhook 为那些无法登录的东西而存在，比如发送更新的服务，或者在后台发送位置信息的手机。借助 Home Assistant Link，webhook 还可以通过云获得一个公共 URL，因此在外出时也能使用，而无需将 Home Assistant 暴露到互联网上。

## 位于代理之后

Core 可以自己提供 HTTPS，但很多人会在前面放置反向代理，或者使用 Home Assistant Link。在代理之后，Core 只信任来自用户所配置代理的转发地址，因此没有人能伪装成位于家庭网络中。

## 参与开发

- 刚接触 Core？从[你对 Core 的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。这些 API 是 Core 的一部分。
- [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/) 和 [REST API](https://www.hasscn.top/contributors/core/internals/rest-api/)：每一条消息和每一个端点。
- [添加 WebSocket 命令](https://www.hasscn.top/contributors/frontend/extending/websocket-api/)：当前端需要从 Core 获取新功能时。
- [身份验证的工作原理](https://www.hasscn.top/contributors/core/internals/auth/)：令牌、用户和权限。
