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

The frontend asks the app to share a Matter device with another platform, like Apple Home. The device is already set up in Home Assistant, and Home Assistant has opened a commissioning window for it: a short time in which another platform can add the device too. The frontend offers this in the dialog that opens that window.

The frontend only sends this message when the app supports it:

- With `canShareMatterDeviceToAppleHome`, it always offers to add the device to Apple Home. When the app sets both keys, this one wins.
- With `canShareMatterDeviceToOtherApps`, it only offers the share sheet when the Matter server reported the `discriminator` and the timeout of the window. The share sheet opens a window of its own, and needs both.

Payload:

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

| Key | Meaning |
| --- | --- |
| `setup_qr_code` | The QR code payload of the commissioning window, starting with `MT:`. Always sent. |
| `setup_pin_code` | The setup passcode of the commissioning window. Always sent. |
| `discriminator` | The discriminator the device advertises while the window is open, when the Matter server reported it. |
| `vendor_id` | The vendor ID of the device, when the Matter server reported it. |
| `product_id` | The product ID of the device, when the Matter server reported it. |
| `device_name` | The name of the device in Home Assistant, to suggest to the other platform. |
| `remaining_seconds` | Estimated seconds until the window closes, when the Matter server reported its timeout. When 30 seconds or less remain, the frontend treats the code as expired, does not send the message, and asks you to get a new code. When sent, this value is greater than 30. |

Answer: an empty object once the flow of the platform has completed. When it did not work, answer with an error result:

- `canceled`: the user closed the sheet of the platform. The frontend takes that as a choice, not an error.
- Any other code, like `failed`: the frontend shows that sharing failed, with its own text. It does not show your `message`.

### Messages without an answer

| 类型 | 载荷 | 含义 |
| --- | --- | --- |
| `assist/settings` | | 打开应用的 Assist 设置。 |
| `assist/show` | `{ pipeline_id, start_listening }`，可选 | 显示原生 Assist 界面。`pipeline_id` 是一个 ID、`"preferred"` 或 `"last_used"`。 |
| `bar_code/scan` | `{ title, description, alternative_option_label? }` | 打开条形码扫描器。没有 `alternative_option_label` 时，隐藏替代选项的按钮。 |
| `bar_code/notify` | `{ message }` | 在条形码扫描器中显示一条消息。 |
| `bar_code/close` | | 关闭条形码扫描器。 |
| `config_screen/show` | | 打开应用的设置。 |
| `connection-status` | `{ event }` | 与 Home Assistant 的连接发生了变化。`event` 为 `"connected"`、`"disconnected"` 或 `"auth-invalid"`。 |
| `entity/add_to` | `{ entity_id, app_payload }` | 添加该实体，使用来自 `entity/add_to/get_actions` 的 `app_payload`。 |
| `entity/controlled` | `{ entity_ids, domain, service }` | 用户在前端对这些实体执行了操作。 |
| `exoplayer/play_hls` | `{ url, muted }` | 原生播放 HLS 流。 |
| `exoplayer/resize` | `{ left, top, right, bottom }` | 将原生播放器移动到这些坐标。 |
| `exoplayer/stop` | | 停止原生播放器。 |
| `focus_element` | `{ element_id }` | 聚焦某个元素。 |
| `frontend/loaded` | | 前端已移除其启动屏幕。在设置了 `hasSplashscreen` 的情况下，这是在第一页渲染完成之后。 |
| `frontend/reload_and_clear_cache` | | 清除 Web 视图的缓存并重新加载。仅发送给 iOS 和 macOS，当前端检测到过期的构建时。 |
| `haptic` | `{ hapticType }` | 提供触觉反馈：`"success"`、`"warning"`、`"failure"`、`"light"`、`"medium"`、`"heavy"` 或 `"selection"`。 |
| `improv/scan` | | 扫描 Improv Wi-Fi 设备。 |
| `improv/configure_device` | `{ name }` | 设置具有此名称的 Improv Wi-Fi 设备。 |
| `matter/commission` | `{ mac_extended_address, extended_pan_id, border_agent_id, active_operational_dataset }`，可选 | 开始调试（commission）Matter 设备。载荷描述了首选的 Thread 网络。每个值都可以为 `null`。 |
| `more_info/opened` | `{ entity_id }` | 该实体的更多信息（more-info）对话框已打开。 |
| `more_info/closed` | `{ entity_id }` | 更多信息对话框已关闭。 |
| `sidebar/show` | | 显示应用的侧边栏。 |
| `tag/write` | `{ tag, name }` | 打开写入 NFC 标签的界面。当用户没有为标签命名时，`name` 为 `null`。 |
| `theme-update` | | 主题已更改。更新状态栏和导航栏的颜色。 |
| `thread/import_credentials` | | 从设备导入 Thread 凭据，并通过 WebSocket API 将其发送到 Home Assistant。 |
| `thread/store_in_platform_keychain` | `{ mac_extended_address, border_agent_id, active_operational_dataset, extended_pan_id }` | 将 Thread 凭据存储在平台的钥匙串中。 |

## 从应用到前端

所有命令都会收到一个结果。成功时，`result` 为 `null`。

| 命令 | 载荷 | 含义 |
| --- | --- | --- |
| `automation/editor/show` | `{ config? }`，可选 | 打开自动化（automation）编辑器以创建新的自动化。`config` 可以填充 `alias`、`description`、`triggers`、`conditions`、`actions`、`mode` 和 `max`。 |
| `bar_code/scan_result` | `{ rawValue, format }` | 扫描到的条形码。`format` 是[条形码检测 API 格式](https://developer.mozilla.org/docs/Web/API/Barcode_Detection_API#supported_barcode_formats)之一，或 `"unknown"`。 |
| `bar_code/aborted` | `{ reason }` | 扫描已停止。`reason` 为 `"canceled"` 或 `"alternative_options"`。 |
| `improv/discovered_device` | `{ name }` | 发现了一个 Improv Wi-Fi 设备。 |
| `improv/device_setup_done` | | Improv Wi-Fi 设备的设置已完成。 |
| `kiosk_mode/set` | `{ enable }` | 开启或关闭 kiosk 模式。 |
| `matter/commission/finish` | `{ name, success }` | Matter 设备的调试已结束。`name` 在不为 `null` 时，将作为新设备的名称建议。当 `success: false` 时，前端会关闭其对话框并显示添加设备失败，除非该设备已经出现。 |
| `navigate` | `{ path, options? }` | 前往某个页面。`path` 以 `/` 开头，例如 `/config/voice-assistants/assistants`。`options.replace` 替换当前的历史记录条目，`options.data` 存储在历史状态中。 |
| `notifications/show` | | 打开通知。 |
| `restart` | | 将前端重新连接到 Home Assistant。 |
| `sidebar/show` | | 打开侧边栏。当对话框打开时会以 `not_allowed` 失败。 |
| `sidebar/toggle` | | 打开或关闭侧边栏。当对话框打开时会以 `not_allowed` 失败。 |
