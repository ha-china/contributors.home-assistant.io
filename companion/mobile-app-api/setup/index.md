# 连接与注册

> 查找 Home Assistant 实例，使用 OAuth 2 登录用户，并通过 mobile_app 集成注册应用。

Source: https://www.hasscn.top/contributors/companion/mobile-app-api/setup/

在应用能够发送任何内容之前，它需要找到实例、登录用户并完成自身注册。每个服务器只需执行一次。

## 查找实例

Home Assistant 通过 zeroconf 在本地网络上以 `_home-assistant._tcp.local.` 的形式对外宣告自己。浏览该服务即可为用户提供一个实例列表。如果没有找到任何实例，则请用户输入 URL。有关该服务宣告的内容，请参阅[实例发现](https://www.hasscn.top/contributors/core/internals/instance-discovery/)。

## 登录用户

Home Assistant 使用带有 [IndieAuth](https://indieauth.spec.indieweb.org/) 扩展的 OAuth 2 来进行客户端认证。无需客户端注册：客户端 ID 就是你的应用网站的 URL，并且重定向 URI 必须具有相同的 scheme、主机和端口。

原生应用需要一个类似 `myapp://auth-callback` 的重定向 URI，它位于不同的主机上。为了允许这种情况，请在客户端 ID 对应的页面中添加一个 link 标签。Home Assistant 会读取该页面的前 10 kB 内容：

```html
<link rel="redirect_uri" href="myapp://auth-callback">
```

除了 link 标签之外，该页面也可以是一个 OAuth 客户端 ID 元数据文档：一个包含你的 `client_id` 和 `redirect_uris` 列表的 JSON 对象。

流程如下：

1. 在浏览器中打开 `/auth/authorize`，并以 `client_id`、`redirect_uri` 以及可选的 `state` 作为查询参数。
2. 用户登录后，Home Assistant 会携带一个 `code` 重定向到你的重定向 URI。
3. 通过向 `/auth/token` 发送 POST 请求（表单编码，包含 `grant_type=authorization_code`、该 `code` 以及相同的 `client_id`）来用授权码换取令牌。

你将获得一个有效期为 30 分钟的访问令牌，以及一个用于获取新访问令牌的刷新令牌。有关令牌的工作原理，请参阅[身份验证](https://www.hasscn.top/contributors/core/internals/auth-api/)。

> [!NOTE]
> 官方应用使用固定的客户端 ID，即 `https://home-assistant.io/iOS` 和 `https://home-assistant.io/android`，并使用 `homeassistant://auth-callback` 重定向，以及 Android 的两个 Wear OS 回调。Core 允许这些客户端无需抓取网站即可使用，因此即使没有互联网访问也能登录。对于你自己的应用，请使用你自己的客户端 ID。

## 确保 mobile_app 已加载

`mobile_app` 是 `default_config` 的一部分，因此在大多数安装中都会被加载。如果用户移除了 `default_config`，则需要在他们的 `configuration.yaml` 中添加 `mobile_app:` 并重启。

要进行检查，请携带访问令牌调用 `GET /api/config`，并在 `components` 中查找 `mobile_app`。如果注册返回 404，则说明该集成未加载。

## 注册应用

向 `/api/mobile_app/registrations` 发送经过身份验证的 POST 请求：

```json
{
  "device_id": "ABCDEFGH",
  "app_id": "awesome_home",
  "app_name": "Awesome Home",
  "app_version": "1.2.0",
  "device_name": "Robbie's iPhone",
  "manufacturer": "Apple",
  "model": "iPhone X",
  "os_name": "iOS",
  "os_version": "17.4",
  "supports_encryption": true,
  "app_data": {
    "push_websocket_channel": true
  }
}
```

| 键 | 是否必需 | 类型 | 描述 |
| --- | --- | --- | --- |
| `app_id` | 是 | string | 你的应用的唯一标识符 |
| `app_name` | 是 | string | 你的应用的名称 |
| `app_version` | 是 | string | 你的应用的版本 |
| `device_name` | 是 | string | 设备的名称。用于命名该设备及其实体（entity） |
| `manufacturer` | 是 | string | 设备的制造商 |
| `model` | 是 | string | 设备的型号 |
| `os_name` | 是 | string | 操作系统的名称 |
| `os_version` | 否，但请发送 | string | 操作系统的版本。Home Assistant 中的设备会将其用作软件版本。注册调用接受不包含该字段的请求，但随后设置注册会失败，并且其 webhook 无法工作 |
| `device_id` | 否，但请发送 | string | 设备的稳定且唯一的标识符。如果没有提供，Home Assistant 会生成一个随机的 |
| `supports_encryption` | 否 | boolean | 应用是否[加密](https://www.hasscn.top/contributors/companion/mobile-app-api/encryption/)其 webhook 流量。默认为 `false` |
| `app_data` | 否 | object | 应用特定的数据。用于启用[通知](https://www.hasscn.top/contributors/companion/mobile-app-api/notifications/) |

`app_id` 和 `device_id` 共同标识一个注册。使用相同的一对值再次注册会替换旧的注册：你会获得新的 webhook ID 和密钥，而旧的将停止工作。如果没有提供 `device_id`，则每次注册都会创建一个新的注册。

Home Assistant 会以 `201 Created` 作为响应。请永久保存该响应，因为这是你唯一一次获得它的机会：

```json
{
  "cloudhook_url": "https://hooks.nabu.casa/randomlongstring123",
  "remote_ui_url": "https://randomlongstring123.ui.nabu.casa",
  "secret": "qwerty",
  "webhook_id": "abcdefgh"
}
```

| 键 | 描述 |
| --- | --- |
| `webhook_id` | 用于[发送数据](https://www.hasscn.top/contributors/companion/mobile-app-api/sending-data/)的 webhook 的 ID |
| `secret` | 用于加密的密钥。仅在你发送了 `supports_encryption` 时才会设置 |
| `cloudhook_url` | 通过 Home Assistant Link 的 webhook URL。仅当实例拥有有效订阅、已连接到云端，且用户不是仅本地访问时才会设置 |
| `remote_ui_url` | 通过 Home Assistant Link 访问该实例的远程 URL。条件相同，但不要求云端连接 |

不适用的值将为 `null`。

注册完成后，Home Assistant 会为你的应用创建一个新设备，并带有用于其位置的设备追踪器。该追踪器会被添加到执行注册的用户的对应人员（person）中。当你[注册传感器](https://www.hasscn.top/contributors/companion/mobile-app-api/sensors/)时，它们会随之出现。
