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
| `hasSettingsScreen` | boolean | 应用在 `config_screen/show` 时显示自己的设置。 |
| `hasSidebar` | boolean | 应用有自己的侧边栏。 |
| `canWriteTag` | boolean | 设备可以写入 NFC 标签。 |
| `hasExoPlayer` | boolean | 应用可以使用 ExoPlayer 原生播放 HLS 视频。 |
| `canCommissionMatter` | boolean | 应用可以调试（commission）Matter 设备。 |
| `hasMatterStatusReport` | boolean | 应用通过 `matter/commission/finish` 报告 Matter 调试的结束。 |
| `canShareMatterDeviceToAppleHome` | boolean | 应用可以通过 `matter/share_device` 将 Home Assistant 已有的 Matter 设备添加到 Apple Home。 |
| `canShareMatterDeviceToOtherApps` | boolean | 应用可以通过 `matter/share_device` 将 Home Assistant 已有的 Matter 设备与用户在平台 Matter 分享面板中选择的应用分享。 |
| `canImportThreadCredentials` | boolean | 应用可以导入 Thread 凭据。 |
| `canTransferThreadCredentialsToKeychain` | boolean | 应用可以将 Thread 凭据存储在平台的钥匙串中。仅限 Apple。 |
| `hasAssist` | boolean | 应用有原生 Assist 界面，用于替代前端的界面。 |
| `hasAssistSettings` | boolean | 应用有设备的 Assist 设置，显示在语音助手设置中。 |
| `hasBarCodeScanner` | number | 应用可以扫描条形码时为 `1`，否则为 `0`。 |
| `canSetupImprov` | boolean | 应用可以设置 Improv Wi-Fi 设备。 |
| `hasEntityAddTo` | boolean | 应用可以从更多信息（more-info）对话框将实体添加到自己的位置，例如小组件。 |
| `hasSplashscreen` | boolean | 应用用自己的加载屏幕覆盖前端，直到 `frontend/loaded`。 |
| `appVersion` | string | 应用的版本。 |

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

### 无需应答的消息

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
