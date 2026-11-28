# 通知

> mobile_app 如何通过 WebSocket 连接或推送服务器向应用发送通知，以及推送服务器必须遵循的约定。

Source: https://www.hasscn.top/contributors/companion/mobile-app-api/notifications/

Last verified on 2026-10-14, against https://github.com/home-assistant/mobile-apps-fcm-push/blob/main/functions/handlers.js.

`mobile_app` 内置了通知功能。一旦应用启用了通知，Home Assistant 就会为其创建一个 notify 实体和一个 `notify.mobile_app_<device_name>` 动作，用户可以在自动化中发送通知。

发送通知有两种方式：

- **通过 WebSocket 连接**（本地推送），在应用已连接时使用。无需服务器，但应用必须保持连接打开。
- **通过推送服务器**（云端推送）。Home Assistant 将通知 POST 到你运行的 URL，由你的服务器将其转交给 Apple、Google 或其他推送服务。

应用可以同时支持两种方式。如果支持，Home Assistant 会在 WebSocket 连接打开时使用 WebSocket 通道，而在没有连接打开时，或应用未及时确认通知时，使用推送服务器。

关于用户如何向官方应用发送通知，请参阅[通知文档](https://companion.home-assistant.io/docs/notifications/notifications-basic)。

## 通过 WebSocket

要启用此功能，请在[注册](https://www.hasscn.top/contributors/companion/mobile-app-api/setup/#register-the-app)时或通过 [`update_registration`](https://www.hasscn.top/contributors/companion/mobile-app-api/sending-data/#update_registration) 在 `app_data` 中将 `push_websocket_channel` 设置为 `true`。

然后在已认证的 [WebSocket](https://www.hasscn.top/contributors/core/internals/websocket-api/) 连接上打开一个通道：

```json
{
  "id": 2,
  "type": "mobile_app/push_notification_channel",
  "webhook_id": "abcdefgh",
  "support_confirm": true
}
```

Webhook ID 必须属于该连接的用户。为同一个 webhook 打开新通道会关闭旧通道。

通知以该订阅上的事件形式到达：

```json
{
  "id": 2,
  "type": "event",
  "event": {
    "message": "Hello world",
    "title": "Hi",
    "hass_confirm_id": "6d8c3e2a1f4b4f0b9c0d5e7a8b9c0d1e"
  }
}
```

使用 `support_confirm` 时，每条通知都有一个 `hass_confirm_id`，你有 10 秒钟的时间进行确认：

```json
{
  "id": 3,
  "type": "mobile_app/push_notification_confirm",
  "webhook_id": "abcdefgh",
  "confirm_id": "6d8c3e2a1f4b4f0b9c0d5e7a8b9c0d1e"
}
```

如果未及时收到确认，Home Assistant 会关闭该通道，并将该通知以及其他任何未确认的通知改由推送服务器发送。如果没有推送服务器，未连接的应用将收不到通知，该动作会因设备未连接而报错失败。

## 通过推送服务器

要启用此功能，请在 `app_data` 中设置以下两个键：

| 键 | 描述 |
| --- | --- |
| `push_token` | 设备的推送令牌，例如 APNs 令牌或 FCM 注册令牌 |
| `push_url` | Home Assistant 将通知 POST 到的 URL |

`mobile_app` 不关心通知如何到达设备。它将通知 POST 到你的服务器，其余工作由你负责。这让你可以完全掌控自己的推送设置。官方应用使用[该项目的推送服务](https://github.com/home-assistant/mobile-apps-fcm-push)，它通过 Firebase Cloud Messaging 向 Android 和 iOS 设备发送通知。其代码是构建你自己的推送服务的一个很好的起点。

### 请求

Home Assistant 发送一个带有 JSON 主体的 POST 请求，并在 10 秒后放弃：

```json
{
  "message": "Hello World",
  "title": "Test message",
  "push_token": "my-secure-token",
  "registration_info": {
    "app_id": "io.robbie.HomeAssistant",
    "app_version": "2026.10.0",
    "os_version": "26.0",
    "webhook_id": "abcdefgh"
  },
  "data": {
    "key": "value"
  }
}
```

只有当用户设置了 `title` 和 `data` 时它们才会出现。`data` 包含用户传入的所有其他内容，也是应用特定选项所在的位置。

### 响应

当通知被接受时，请返回 `200`、`201` 或 `202`。始终发送带有 `application/json` 内容类型的 JSON 主体，即使没有任何内容需要报告，例如 `{}`。Home Assistant 将每个响应都当作 JSON 读取，无法读取的响应会像错误一样失败，无论状态码是什么。

对于任何其他状态码，通知将失败并报错 `Error sending notification to <device>`。`429` 会报错 `Rate limit exceeded sending notification to <device>`，而耗时超过 10 秒的请求会报错 `Timeout sending notification to <device>`。notify 实体会抛出这些错误，因此其动作会失败。`notify.mobile_app_<device_name>` 动作只会记录这些错误——速率限制记为警告，其他记为错误——而动作本身会成功。你的 JSON 响应可以说明出了什么问题。Home Assistant 会在调试级别记录该说明：

| 键 | 描述 |
| --- | --- |
| `message` | 按原样记录，并附注该消息来自 Home Assistant 之外 |
| `errorMessage` | 附加到标准消息中："Internal server error, please try again later: ..." |

请尽可能具体，并在你知道解决办法时告诉用户如何解决问题。

### 速率限制

推送服务需要花钱，而一个有问题的自动化可能会发送成千上万条通知。请使用速率限制。官方应用的推送服务默认允许每台设备每天 500 条通知，计数在 UTC 午夜重置。

Home Assistant 本身不做任何限制。由你的服务器进行限制，并告知 Home Assistant。在响应中添加 `rateLimits`：

```json
{
  "rateLimits": {
    "successful": 1,
    "errors": 5,
    "maximum": 500,
    "resetsAt": "2026-10-11T00:00:00.000Z"
  }
}
```

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `successful` | integer | 此周期内已发送的通知数 |
| `errors` | integer | 此周期内失败的通知数 |
| `maximum` | integer | 每个周期的最大数量 |
| `resetsAt` | timestamp | 周期结束时间，采用 ISO 8601 格式，UTC 时区 |

Home Assistant 会在调试级别记录这些数字，以及距离重置的剩余时间。当用户达到限制时，请在周期结束前返回 `429`，并尽早拒绝请求。Home Assistant 会记录一条已达到限制的警告。

## 实时活动（Live Activities）

iOS 应用可以显示实时活动（Live Activities），例如锁定屏幕上的计时器或配送信息，通知可以启动、更新和结束这些活动。每个活动都有自己的推送令牌，`mobile_app` 会跟踪它们。这仅适用于通过推送服务器发送的通知，且注册时 `manufacturer` 为 `Apple`：

- 在注册时，或之后通过 `update_registration`，应用会在 `app_data` 中放入一个 `start_live_activity_token`，用于启动新的实时活动。
- 当设备上启动一个实时活动时，应用会通过 `live_activity_token` webhook 请求发送其更新令牌：包括活动的 `tag`、`push_token`，以及作为 Unix 时间戳的 `expires_at`。
- 当用户在设备上关闭该活动时，应用会发送带有该 `tag` 的 `live_activity_dismissed`。

当通知的 `data` 中包含 `tag` 和 `live_update: true` 时，Home Assistant 会在发送给推送服务器的请求中添加一个 `live_activity_token`，并在 `data` 中添加一个值为 `start`、`update` 或 `end` 的 `event`。带有相同标签的 `clear_notification` 消息会结束该活动。过期的令牌会被自动移除。

面向用户的说明请参阅[实时活动文档](https://companion.home-assistant.io/docs/notifications/live-activities)。
