---
title: 外部总线
description: 前端与嵌入它的应用（如伴侣应用）之间的消息总线。消息如何发送，以及所有消息的完整列表。
order: 4
---

嵌入前端的应用，例如[伴侣应用](/companion/)，可以做一些浏览器做不到的事情：扫描条形码、写入 NFC 标签、调试（commission）Matter 设备，或显示原生界面。外部总线就是前端与应用之间沟通这些事情的途径。它与[外部认证](/frontend/reference/external-auth/)协同工作，并使用相同的桥接机制。代码位于 [`src/external_app/`](https://github.com/home-assistant/frontend/tree/dev/src/external_app)。

## 发送消息

消息是 JSON 对象。

**从前端到应用**，前端使用可用的桥接：

```js
// Android, V2: the message is wrapped and serialized
window.externalAppV2.postMessage(
  JSON.stringify({ type: "externalBus", payload: message })
);

// Android, V1: the message is serialized
window.externalApp.externalBus(JSON.stringify(message));

// iOS and macOS: the message is passed as an object
window.webkit.messageHandlers.externalBus.postMessage(message);
```

**从应用到前端**，应用调用前端定义的函数：

```js
window.externalBus(message);
```

## 消息格式

每条消息都有一个 `id` 和一个 `type`，当该类型需要时还会有一个 `payload`：

```ts
interface Message {
  id: number;
  type: string;
  payload?: unknown;
}
```

有些消息需要应答。应答是一条具有相同 `id` 的 `result` 消息：

```ts
interface SuccessResult {
  id: number;
  type: "result";
  success: true;
  result: unknown;
}

interface ErrorResult {
  id: number;
  type: "result";
  success: false;
  error: { code: string; message: string };
}
```

从应用发送到前端的消息是命令，带有 `type: "command"`，命令名称放在 `command` 中：

```json
{
  "id": 5,
  "type": "command",
  "command": "navigate",
  "payload": { "path": "/config/areas/dashboard" }
}
```

前端会用结果应答每条命令。请根据两个通用错误代码的发送时机来判断，而不要仅凭名称：

- `unknown_command`：前端还没有命令处理器，因为它仍在启动中。命令本身很可能是已知的。
- `not_ready`：命令处理器已就位，但它不处理这条命令。

两者都由 [`src/external_app/external_messaging.ts`](https://github.com/home-assistant/frontend/blob/dev/src/external_app/external_messaging.ts) 中的 `receiveMessage` 发送。

## 从前端到应用

### 需要应答的消息

#### config/get

前端在连接后立即询问应用能做什么。载荷（payload）：无。应用以一个对象应答。所有键都是可选的：

| 键 | 类型 | 含义 |
| --- | --- | --- |
| `hasSettingsScreen` | boolean | The app shows its own settings on `config_screen/show`. |
| `hasSidebar` | boolean | The app has a sidebar of its own. |
| `canWriteTag` | boolean | The device can write NFC tags. |
| `hasExoPlayer` | boolean | The app can play HLS video natively with ExoPlayer. |
| `canCommissionMatter` | boolean | The app can commission Matter devices. |
| `hasMatterStatusReport` | boolean | The app reports the end of Matter commissioning with `matter/commission/finish`. |
| `canShareMatterDeviceToAppleHome` | boolean | The app can add a Matter device that Home Assistant already has to Apple Home, with `matter/share_device`. |
| `canShareMatterDeviceToOtherApps` | boolean | The app can share a Matter device that Home Assistant already has with an app the user picks in the Matter share sheet of the platform, with `matter/share_device`. |
| `canImportThreadCredentials` | boolean | The app can import Thread credentials. |
| `canTransferThreadCredentialsToKeychain` | boolean | The app can store Thread credentials in the keychain of the platform. Apple only. |
| `hasAssist` | boolean | The app has a native Assist interface, used instead of the one of the frontend. |
| `hasAssistSettings` | boolean | The app has Assist settings for the device, shown in the voice assistant settings. |
| `hasBarCodeScanner` | number | `1` when the app can scan barcodes, `0` otherwise. |
| `canSetupImprov` | boolean | The app can set up Improv Wi-Fi devices. |
| `hasEntityAddTo` | boolean | The app can add entities to places of its own, like a widget, from the more-info dialog. |
| `hasSplashscreen` | boolean | The app covers the frontend with its own loading screen until `frontend/loaded`. |
| `appVersion` | string | The version of the app. |
| `webrtc` | object | The WebRTC features of the app. See the keys below. |

Keys of `webrtc`, all optional:

| Key | Type | Meaning |
| --- | --- | --- |
| `hasCameraMicrophoneStream` | boolean | The app can stream the microphone to a camera entity, with `webrtc/stream/start`. |

#### entity/add_to/get_actions

前端询问一个实体可以添加到哪里，例如主屏幕小组件或表盘。

载荷：

```ts
{ entity_id: string }
```

应答：

```ts
{
  actions: Array<{
    enabled: boolean;
    name: string;
    details?: string;
    mdi_icon: string;
    app_payload: string;
  }>;
}
```

`name` 和 `details` 会按原样显示，因此请在应用中翻译它们。`mdi_icon` 是类似 `mdi:car` 的图标名称。`app_payload` 是任意字符串，当用户选择该操作时，前端会通过 `entity/add_to` 将其传回。

#### matter/share_device

前端要求应用将 Matter 设备分享到另一个平台，例如 Apple Home。该设备已在 Home Assistant 中设置好，并且 Home Assistant 已为其打开了调试窗口：在这段短时间内，另一个平台也可以添加该设备。前端在打开该窗口的对话框中提供此选项。

前端仅在应用支持时发送此消息：

- 使用 `canShareMatterDeviceToAppleHome` 时，它始终提供将设备添加到 Apple Home 的选项。当应用同时设置两个键时，此键优先。
- 使用 `canShareMatterDeviceToOtherApps` 时，仅当 Matter 服务器报告了 `discriminator` 和窗口超时时间时，它才提供分享面板。分享面板会打开自己的窗口，并且需要这两项。

载荷：

```ts
{
  setup_qr_code: string;
  setup_pin_code: number;
  discriminator?: number;
  vendor_id?: number;
  product_id?: number;
  device_name?: string;
  remaining_seconds?: number;
}
```

| 键 | 含义 |
| --- | --- |
| `setup_qr_code` | 调试窗口的二维码载荷，以 `MT:` 开头。始终发送。 |
| `setup_pin_code` | 调试窗口的设置密码。始终发送。 |
| `discriminator` | 窗口打开时设备广播的 discriminator，当 Matter 服务器报告时。 |
| `vendor_id` | 设备的供应商 ID，当 Matter 服务器报告时。 |
| `product_id` | 设备的产品 ID，当 Matter 服务器报告时。 |
| `device_name` | 设备在 Home Assistant 中的名称，用于向其他平台建议。 |
| `remaining_seconds` | 窗口关闭前的估计秒数，当 Matter 服务器报告其超时时。当剩余 30 秒或更少时，前端将代码视为已过期，不发送消息，并要求您获取新代码。发送时，此值大于 30。 |

应答：平台流程完成后返回一个空对象。如果未成功，请以错误结果应答：

- `canceled`：用户关闭了平台的分享面板。前端将其视为选择，而非错误。
- 任何其他代码，例如 `failed`：前端显示分享失败，并使用自己的文本。它不会显示您的 `message`。

#### webrtc/stream/start

The frontend asks the app to stream the microphone to a camera entity, so the user can talk through it. The app captures the microphone itself, and sends it in a WebRTC session of its own. That makes two-way audio work when Home Assistant is not opened over HTTPS, where the browser gives the frontend no access to the microphone.

The frontend only sends this message from the microphone button in the more-info dialog of a camera, when both are true:

- The page is not a secure context. In a secure context, the frontend captures the microphone itself.
- The app set `webrtc.hasCameraMicrophoneStream` in its answer to `config/get`.

Payload:

```ts
{
  stream_type: "microphone";
  entity_id: string;
}
```

| Key | Meaning |
| --- | --- |
| `stream_type` | What to stream. `"microphone"`. Reject a type you don't know with `unsupported_stream_type`. |
| `entity_id` | The camera entity to stream to. |

Answer, once the stream is connected:

```ts
{ session_id: string }
```

The app makes up the `session_id`. The frontend sends it back with `webrtc/stream/stop`, and the app sends it with `webrtc/stream/stopped`.

The frontend sets no timeout on the answer, and shows the microphone as connecting until it comes. So always answer: with the session ID, or with an error result when the stream could not start. The error codes are `WEBRTC_STREAM_ERROR_CODES` in [`src/external_app/external_messaging.ts`](https://github.com/home-assistant/frontend/blob/dev/src/external_app/external_messaging.ts):

| Code | Meaning |
| --- | --- |
| `microphone_denied` | The user denied the microphone permission. |
| `server_unavailable` | The app has no API for the server, or its connection never became ready. |
| `signaling_failed` | `camera/webrtc/offer` failed, or Home Assistant sent an error event. |
| `connection_failed` | The WebRTC connection was lost, and the app could not restore it. |
| `timeout` | The stream did not connect in time. The app decides how long it waits. |
| `interrupted` | The app stopped the stream itself, for example because it went to the background. |
| `unsupported_stream_type` | The app does not know the requested stream type. |
| `unknown` | An unexpected error. `message` holds the error of the app. |

The frontend shows a text of its own for each code. It only shows `message` with `unknown`, or with a code that is not in the list.

When the user turns the microphone off while the app is still connecting, the frontend sends nothing, because it has no session ID yet. It waits for the answer, and then sends `webrtc/stream/stop` for that session.

### Messages without an answer

| 类型 | 载荷 | 含义 |
| --- | --- | --- |
| `assist/settings` | | Open the Assist settings of the app. |
| `assist/show` | `{ pipeline_id, start_listening }`, optional | Show the native Assist interface. `pipeline_id` is an ID, `"preferred"`, or `"last_used"`. |
| `bar_code/scan` | `{ title, description, alternative_option_label? }` | Open the barcode scanner. Without `alternative_option_label`, hide the button for the alternative option. |
| `bar_code/notify` | `{ message }` | Show a message in the barcode scanner. |
| `bar_code/close` | | Close the barcode scanner. |
| `config_screen/show` | | Open the settings of the app. |
| `connection-status` | `{ event }` | The connection to Home Assistant changed. `event` is `"connected"`, `"disconnected"`, or `"auth-invalid"`. |
| `entity/add_to` | `{ entity_id, app_payload }` | Add the entity, with the `app_payload` from `entity/add_to/get_actions`. |
| `entity/controlled` | `{ entity_ids, domain, service }` | The user performed an action on these entities in the frontend. |
| `exoplayer/play_hls` | `{ url, muted }` | Play an HLS stream natively. |
| `exoplayer/resize` | `{ left, top, right, bottom }` | Move the native player to these coordinates. |
| `exoplayer/stop` | | Stop the native player. |
| `focus_element` | `{ element_id }` | Focus an element. |
| `frontend/loaded` | | The frontend has removed its launch screen. With `hasSplashscreen`, that is after the first page has rendered. |
| `frontend/reload_and_clear_cache` | | Clear the cache of the web view and reload. Sent to iOS and macOS only, when the frontend detects an outdated build. |
| `haptic` | `{ hapticType }` | Give haptic feedback: `"success"`, `"warning"`, `"failure"`, `"light"`, `"medium"`, `"heavy"`, or `"selection"`. |
| `improv/scan` | | Scan for Improv Wi-Fi devices. |
| `improv/configure_device` | `{ name }` | Set up the Improv Wi-Fi device with this name. |
| `matter/commission` | `{ mac_extended_address, extended_pan_id, border_agent_id, active_operational_dataset }`, optional | Start commissioning a Matter device. The payload describes the preferred Thread network. Each value can be `null`. |
| `more_info/opened` | `{ entity_id }` | The more-info dialog opened for this entity. |
| `more_info/closed` | `{ entity_id }` | The more-info dialog closed. |
| `sidebar/show` | | Show the sidebar of the app. |
| `tag/write` | `{ tag, name }` | Open the screen to write an NFC tag. `name` is `null` when the user did not name the tag. |
| `theme-update` | | The theme changed. Update the colors of the status bar and navigation bar. |
| `thread/import_credentials` | | Import Thread credentials from the device, and send them to Home Assistant over the WebSocket API. |
| `thread/store_in_platform_keychain` | `{ mac_extended_address, border_agent_id, active_operational_dataset, extended_pan_id }` | Store Thread credentials in the keychain of the platform. |
| `webrtc/stream/stop` | `{ session_id }` | Stop the stream that `webrtc/stream/start` answered with this `session_id`. Don't send `webrtc/stream/stopped` for it. |

## 从应用到前端

所有命令都会收到一个结果。成功时，`result` 为 `null`。

| 命令 | 载荷 | 含义 |
| --- | --- | --- |
| `automation/editor/show` | `{ config? }`, optional | Open the automation editor for a new automation. `config` can fill in `alias`, `description`, `triggers`, `conditions`, `actions`, `mode`, and `max`. |
| `bar_code/scan_result` | `{ rawValue, format }` | A scanned barcode. `format` is one of the [Barcode Detection API formats](https://developer.mozilla.org/docs/Web/API/Barcode_Detection_API#supported_barcode_formats), or `"unknown"`. |
| `bar_code/aborted` | `{ reason }` | The scan stopped. `reason` is `"canceled"` or `"alternative_options"`. |
| `improv/discovered_device` | `{ name }` | An Improv Wi-Fi device was found. |
| `improv/device_setup_done` | | Setting up the Improv Wi-Fi device is done. |
| `kiosk_mode/set` | `{ enable }` | Turn kiosk mode on or off. |
| `matter/commission/finish` | `{ name, success }` | Commissioning a Matter device ended. `name`, when not `null`, is proposed as the name of the new device. With `success: false`, the frontend closes its dialog and shows that adding the device failed, unless the device already showed up. |
| `navigate` | `{ path, options? }` | Go to a page. `path` starts with `/`, like `/config/voice-assistants/assistants`. `options.replace` replaces the current history entry, and `options.data` is stored in the history state. |
| `notifications/show` | | Open the notifications. |
| `restart` | | Reconnect the frontend to Home Assistant. |
| `sidebar/show` | | Open the sidebar. Fails with `not_allowed` while a dialog is open. |
| `sidebar/toggle` | | Open or close the sidebar. Fails with `not_allowed` while a dialog is open. |
| `webrtc/stream/stopped` | `{ session_id, code, message }` | A connected stream ended without the frontend stopping it. `code` is one of the error codes of [`webrtc/stream/start`](#webrtcstreamstart), and `message` is a fallback text. With `interrupted`, the frontend turns the microphone off without a message. With any other code, it also shows the error. A stream that fails before it is connected is not reported with this command, but with an error result for `webrtc/stream/start`. |
