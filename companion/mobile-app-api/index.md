# 移动应用 API

> 应用如何通过 mobile_app 集成连接到 Home Assistant。包括注册、webhook、传感器、位置、通知以及 web 视图。

Source: https://www.hasscn.top/contributors/companion/mobile-app-api/

官方伴侣应用（companion apps）通过 Core 中的 `mobile_app` 集成与 Home Assistant 通信。它是一个公开的 API：任何应用都可以使用它，在 Home Assistant 中显示为一个设备（device），上报传感器和位置信息，并接收通知。本节内容面向参与官方应用开发的人员，以及任何构建自己应用的人。

## 整体运作方式

1. **查找并登录。** 应用找到实例，用户通过 OAuth 2 登录。应用获得访问令牌（access token）和刷新令牌（refresh token）。
2. **注册。** 应用使用这些令牌向 `mobile_app` 注册自身。Home Assistant 会为它创建一个设备，并返回一个 webhook ID，以及可选的用于加密的密钥和用于 Home Assistant Link 的 URL。
3. **发送数据。** 从此以后，应用将传感器更新、位置信息和其他请求发送到 webhook。Webhook 请求无需令牌：webhook ID 本身就是凭证。
4. **接收通知。** Home Assistant 通过 WebSocket 连接或应用使用的推送服务推送通知。
5. **展示前端。** 应用在 web 视图中展示前端，并向其传递一个令牌，这样用户就不需要登录两次。

[伴侣应用架构](https://www.hasscn.top/contributors/architecture/platform/companion-apps/) 提供了更宏观的介绍。

## 页面

- [连接与注册](https://www.hasscn.top/contributors/companion/mobile-app-api/setup/)：发现、登录以及注册调用。
- [发送数据](https://www.hasscn.top/contributors/companion/mobile-app-api/sending-data/)：webhook、其 URL、请求格式以及所有请求类型。
- [加密](https://www.hasscn.top/contributors/companion/mobile-app-api/encryption/)：使用 libsodium 加密 webhook 流量。
- [传感器](https://www.hasscn.top/contributors/companion/mobile-app-api/sensors/)：注册和更新传感器，并保持其启用状态同步。
- [通知](https://www.hasscn.top/contributors/companion/mobile-app-api/notifications/)：WebSocket 推送、云端推送，以及推送服务器的契约。
- [Web 视图](https://www.hasscn.top/contributors/companion/mobile-app-api/webview/)：无需二次登录即可展示前端。

## 代码位置

该集成位于 Core 的 [`homeassistant/components/mobile_app/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/mobile_app)：

| 文件 | 作用 |
| --- | --- |
| `http_api.py` | 注册端点 |
| `webhook.py` | Webhook 及大多数请求类型 |
| `helpers.py` | 加密与响应 |
| `websocket_api.py` | WebSocket 推送通道 |
| `notify.py` | 发送通知 |
| `live_activity/` | iOS 的 Live Activity 令牌及其两种请求类型 |

当代码与本文档不一致时，以代码为准。对该集成的更改遵循正常的 [Core 贡献流程](https://www.hasscn.top/contributors/core/)。
