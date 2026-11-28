# 发送数据

> mobile_app webhook。使用哪个 URL、请求格式、响应，以及该 webhook 接受的所有请求类型。

Source: https://www.hasscn.top/contributors/companion/mobile-app-api/sending-data/

完成[注册](https://www.hasscn.top/contributors/companion/mobile-app-api/setup/)后，应用发送的所有内容都指向同一个 webhook。它不需要访问令牌：webhook ID 本身就是凭证。请像对待密码一样对待它。

## 使用哪个 URL

使用 webhook ID 构建 webhook URL：`<instance_url>/api/webhook/<webhook_id>`。然后按以下顺序尝试你拥有的 URL，当请求失败时切换到下一个：

1. `cloudhook_url`，如果注册时返回了该 URL。
2. `<remote_ui_url>/api/webhook/<webhook_id>`，如果注册时返回了 `remote_ui_url`。
3. `<instance_url>/api/webhook/<webhook_id>`，使用用户配置的 URL。

两个 Home Assistant Link URL 都可能随用户订阅的变化而出现或消失。[`get_config`](https://www.hasscn.top/contributors/companion/mobile-app-api/sending-data/#get_config) 的响应中包含当前的 URL。

### 家庭与外出

某些路由器无法通过外部地址访问本地网络中的设备（不支持 NAT 回环，即 hairpinning）。如果用户通过动态 DNS 域名访问 Home Assistant，来自家庭内部的请求会失败。让用户告诉应用哪个 Wi-Fi 网络是家庭网络，并在该网络下使用内部 URL。

## 通过 WebSocket API 发送

当应用已经建立了 [WebSocket](https://www.hasscn.top/contributors/core/internals/websocket-api/) 连接时，可以通过它使用 `webhook/handle` 命令发送 webhook 请求：

```json
{
  "id": 5,
  "type": "webhook/handle",
  "webhook_id": "abcdefgh",
  "method": "POST",
  "body": "{\"type\": \"get_zones\"}",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

`method` 是 `GET`、`HEAD`、`POST` 或 `PUT` 之一。`body` 和 `query` 是可选的字符串，`headers` 是一个可选的、值为字符串的对象。结果中包含响应的 `body`、`status` 和 `headers`：

```json
{
  "id": 5,
  "type": "result",
  "success": true,
  "result": {
    "body": "[]",
    "status": 200,
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

## 请求

每个请求都是一个带有 JSON 请求体的 HTTP POST（也支持 PUT）：

```json
{
  "type": "<type of request>",
  "data": {}
}
```

某些类型不需要 `data`。如果注册时启用了加密，则每个请求都必须加密，参见[加密](https://www.hasscn.top/contributors/companion/mobile-app-api/encryption/)。

## 响应

| 状态 | 含义 |
| --- | --- |
| `200` | 已处理。当载荷不符合该类型的 schema、加密载荷无法解密、或类型未知时，也会返回此状态码，并带有空的 `{}`。Home Assistant 会记录详细信息 |
| `201` | 注册了一个传感器 |
| `400` | 请求体不是有效的 JSON、在启用加密的情况下请求未加密、在加密已开启时发送了 `enable_encryption`、或 `stream_camera` 收到了未知的摄像头 |
| `404` | webhook 端点不存在，因为 `webhook` 集成（integration）未加载 |
| `405` | 请求使用了 `GET`。该 webhook 只接受 `POST` 和 `PUT` |
| `410` | 注册已被删除。告知用户并重新注册。在删除后 Home Assistant 重启之前，该 webhook 会像未知的 webhook 一样响应，返回空的 `200` |

Home Assistant 未知的 webhook ID 的请求会得到空的 `200`，当 `mobile_app` 本身未加载时也是如此。这样，API 就不会暴露哪些 webhook 存在。

请求体中的错误如下所示：

```json
{
  "success": false,
  "error": {
    "code": "encryption_required",
    "message": "Encryption required"
  }
}
```

如果注册使用了加密，带有内容的响应也会被加密。以下内容不会被加密：空的 `{}` 响应、对 `enable_encryption` 的响应，以及上述格式中的两种错误：`encryption_required` 和 `encryption_already_enabled`。由请求类型自身作为结果返回的错误会像其他响应一样被加密。例如，`stream_camera` 对未知摄像头会返回加密的 `{"success": false}` 和 `400`。因此不要只看状态码：请检查请求体中是否设置了 `encrypted`。

## 请求类型

### `update_location`

更新应用的设备追踪器。

```json
{
  "type": "update_location",
  "data": {
    "gps": [12.34, 56.78],
    "gps_accuracy": 120,
    "battery": 45
  }
}
```

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `gps` | 列表 | 纬度和经度。需要 `gps_accuracy` |
| `gps_accuracy` | 数字 | 位置的精度，单位为米。零或更大 |
| `location_name` | 字符串 | 设备所在的地理位置区域（zone）的名称 |
| `in_zones` | 列表 | 设备所在的地理位置区域的实体（entity）ID |
| `battery` | 整数 | 电量百分比。零或更大 |
| `speed` | 整数 | 速度，单位为米每秒。零或更大 |
| `altitude` | 数字 | 海拔高度，单位为米 |
| `course` | 整数 | 行进方向的角度，相对于正北。零或更大 |
| `vertical_accuracy` | 整数 | 海拔高度的精度，单位为米。零或更大 |

所有键都是可选的。发送 `in_zones` 时，Home Assistant 会忽略 `location_name`。

### `register_sensor` 和 `update_sensor_states`

注册传感器，以及更新一个或多个传感器。参见[传感器](https://www.hasscn.top/contributors/companion/mobile-app-api/sensors/)。

### `call_service`

在 Home Assistant 中执行[动作（action）](https://www.hasscn.top/contributors/glossary/action/)。类型和键仍使用旧名称 service（服务）。

```json
{
  "type": "call_service",
  "data": {
    "domain": "light",
    "service": "turn_on",
    "service_data": {
      "entity_id": "light.kitchen"
    }
  }
}
```

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `domain` | 字符串 | 动作的域 |
| `service` | 字符串 | 动作的名称 |
| `service_data` | 对象 | 动作的数据。可选 |

该动作以注册应用的用户身份运行。如果失败，Home Assistant 会记录错误，响应是一个没有请求体的 `200`。

### `fire_event`

触发一个事件。

```json
{
  "type": "fire_event",
  "data": {
    "event_type": "my_custom_event",
    "event_data": {
      "something": 50
    }
  }
}
```

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `event_type` | 字符串 | 事件的类型 |
| `event_data` | 对象 | 事件的数据。可选 |

### `render_template`

在一个请求中渲染一个或多个模板。`data` 中的每个键都是你自己命名的模板：

```json
{
  "type": "render_template",
  "data": {
    "greeting": {
      "template": "Hello {{ name }}, you are {{ states('person.paulus') }}.",
      "variables": {
        "name": "Paulus"
      }
    }
  }
}
```

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `template` | 字符串 | 要渲染的模板 |
| `variables` | 对象 | 模板的额外变量。可选 |

响应使用相同的键：`{"greeting": "Hello Paulus, you are home."}`。渲染失败的模板会在其键下返回 `{"error": "<message>"}`，其他模板仍会正常渲染。

### `update_registration`

更新注册信息，例如在应用更新后或推送令牌变更时。

```json
{
  "type": "update_registration",
  "data": {
    "app_data": {
      "push_token": "abcd",
      "push_url": "https://push.example.com/push"
    },
    "app_version": "2.0.0",
    "device_name": "Robbie's iPhone",
    "manufacturer": "Apple",
    "model": "iPhone XR",
    "os_version": "17.4"
  }
}
```

| 键 | 必需 | 类型 | 描述 |
| --- | --- | --- | --- |
| `app_version` | 是 | 字符串 | 应用的版本 |
| `device_name` | 是 | 字符串 | 设备的名称 |
| `manufacturer` | 是 | 字符串 | 设备的制造商 |
| `model` | 是 | 字符串 | 设备的型号 |
| `os_version` | 否 | 字符串 | 操作系统的版本 |
| `app_data` | 否 | 对象 | 替换应用数据，例如用于启用[通知](https://www.hasscn.top/contributors/companion/mobile-app-api/notifications/) |

响应是更新后的注册信息，不包含机密值。

### `get_config`

返回用于配置应用的信息。

```json
{
  "type": "get_config"
}
```

响应包含实例的 `latitude`、`longitude`、`elevation`、`unit_system`、`location_name`、`time_zone`、`components`、`version` 和 `theme_color`，以及：

| 键 | 描述 |
| --- | --- |
| `hass_device_id` | 应用的设备在设备注册表中的 ID |
| `instance_id` | 实例的唯一 ID |
| `cloudhook_url`, `remote_ui_url` | 当前的 Home Assistant Link URL，当实例拥有有效订阅且用户不是仅本地访问时 |
| `entities` | 注册中每个实体的启用状态，以注册时使用的唯一 ID 为键，参见[保持传感器同步](https://www.hasscn.top/contributors/companion/mobile-app-api/sensors/#keep-the-enabled-state-in-sync) |

### `get_zones`

返回所有地理位置区域的状态，按实体 ID 排序。

```json
{
  "type": "get_zones"
}
```

### `enable_encryption`

为现有注册开启加密。参见[加密](https://www.hasscn.top/contributors/companion/mobile-app-api/encryption/#enable-it-later)。

### `stream_camera`

返回用于串流摄像头的路径。

```json
{
  "type": "stream_camera",
  "data": {
    "camera_entity_id": "camera.front_door"
  }
}
```

```json
{
  "mjpeg_path": "/api/camera_proxy_stream/camera.front_door",
  "hls_path": "/api/hls/<token>/master_playlist.m3u8"
}
```

当摄像头无法串流时，`hls_path` 为 `null`。将这些路径与你访问实例所用的 URL 组合使用。未知摄像头会返回 `{"success": false}` 和 `400`。如果注册使用了加密，该请求体也会被加密。

### `conversation_process`

向 [Assist](https://www.hasscn.top/contributors/glossary/assist/) 发送一句话，并返回对话代理的响应。

```json
{
  "type": "conversation_process",
  "data": {
    "text": "Turn on the lights",
    "language": "en",
    "conversation_id": "ABCD"
  }
}
```

只有 `text` 是必需的。响应的格式与[对话 API](https://www.hasscn.top/contributors/core/internals/conversation-api/) 相同。

### `scan_tag`

报告设备扫描了 NFC 标签或二维码。Home Assistant 会触发一个标签扫描事件，以应用的设备作为扫描者。

```json
{
  "type": "scan_tag",
  "data": {
    "tag_id": "5f0ba733-172f-430d-a7f8-e4ad940c88d7"
  }
}
```

### `live_activity_token` 和 `live_activity_dismissed`

由 iOS 应用用于 Live Activities。参见[通知](https://www.hasscn.top/contributors/companion/mobile-app-api/notifications/#live-activities)。
