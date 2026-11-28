# WebSocket API

> Home Assistant Core 的 API，前端和伴侣应用（companion apps）通过一个保持打开的连接使用它来读取状态、执行操作，并在事件发生时获取更新。

Source: https://www.hasscn.top/contributors/glossary/websocket-api/

- In code: `websocket_api`, `/api/websocket`, `home-assistant-js-websocket`

客户端连接到 `/api/websocket`，使用访问令牌（access token）登录，然后以 JSON 消息的形式发送命令。集成（integration）可以通过 `websocket_api` 集成添加自己的命令。前端通过 home-assistant-js-websocket 库与它通信。

有关消息以及如何添加命令，请参阅 [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/)。

## Related terms

- [前端](https://www.hasscn.top/contributors/glossary/frontend/): Home Assistant 的网页界面，使用 Lit 和 TypeScript 构建，位于 home-assistant/frontend 仓库中。
- [伴侣应用（Companion app）](https://www.hasscn.top/contributors/glossary/companion-app/): 适用于 Android、iOS 和 macOS 的 Home Assistant 应用。它显示前端（frontend），并从设备添加传感器、通知和小组件。
- [Home Assistant Core](https://www.hasscn.top/contributors/glossary/core/): Home Assistant 核心的 Python 应用程序，包含所有集成，位于 home-assistant/core 仓库中。
