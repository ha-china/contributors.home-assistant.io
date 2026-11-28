# REST API

> `/api/` 下的 HTTP 端点，用于读取状态、调用动作、触发事件和渲染模板，并列出每个端点所需的权限。

Source: https://www.hasscn.top/contributors/core/internals/rest-api/

Home Assistant 在 `/api/` 下提供 REST API，与前端使用相同的端口：默认为 8123；当 Home Assistant 与 Supervisor 一起运行时（例如在 Home Assistant OS 上）则为 80。`SETUP_PORT` 环境变量可以覆盖该默认值。它接受并返回 JSON。该 API 由 `api` 集成（integration）提供，只要前端加载了，它就会随之加载。

REST API 适合脚本和其他系统发起的简单、一次性请求。对于需要保持连接或跟随变化的功能，请使用 [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/)。前端使用的正是 WebSocket API，它提供了多得多的命令。

## 身份验证

每个请求都需要在 `Authorization` 请求头中提供访问令牌（access token）。对于脚本，请在您的个人资料页面的**安全**（Security）部分创建一个长期访问令牌。对于应用程序，请参阅[身份验证 API](https://www.hasscn.top/contributors/core/internals/auth-api/)。

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  http://homeassistant.local:8123/api/
```

使用 Python 的 `requests` 库发出的相同请求：

```python
import requests

response = requests.get(
    "http://homeassistant.local:8123/api/states/sun.sun",
    headers={"Authorization": "Bearer TOKEN"},
    timeout=10,
)
print(response.json())
```

成功的请求返回状态码 200，如果创建了新内容则返回 201。常见的错误包括 400（错误的请求）、401（未授权）、404（未找到）和 405（方法不允许）。动作（action）执行出错时返回 500，而在 Home Assistant 正在关闭时，每个端点都会返回 503。

有些端点需要管理员权限，在下文中以 **管理员** 标注。其他端点则根据用户的[权限](https://www.hasscn.top/contributors/core/internals/permissions/)，仅返回该用户可以读取的内容。

## 状态与配置

### GET /api/

如果 API 正在运行，则返回 `{"message": "API running."}`。注意末尾的斜杠：路径是 `/api/`，而不是 `/api`。

### GET /api/config

返回[核心配置](https://www.hasscn.top/contributors/core/internals/hass/#the-core-configuration)：位置、单位、时区、版本、已加载的组件等等。

```json
{
  "location_name": "Home",
  "latitude": 52.37,
  "longitude": 4.89,
  "elevation": 0,
  "unit_system": {
    "length": "km",
    "mass": "g",
    "temperature": "°C",
    "volume": "L"
  },
  "time_zone": "Europe/Amsterdam",
  "version": "2026.10.0",
  "components": ["api", "frontend", "http", "sun"],
  "state": "RUNNING"
}
```

该示例经过缩减。响应中包含更多的键。

### GET /api/core/state

返回核心（core）是否正在运行，以及数据库迁移是否正在进行。它旨在作为一种快速的健康检查，例如供 Supervisor 使用。

```json
{
  "state": "RUNNING",
  "recorder_state": {
    "migration_in_progress": false,
    "migration_is_live": false
  }
}
```

### GET /api/components

返回已加载组件的列表。

### POST /api/config/core/check_config

**管理员。** 检查 `configuration.yaml`。返回 `result`（`valid` 或 `invalid`），以及以文本形式表示的 `errors` 和 `warnings`，若无则为 `null`。

## 状态

### GET /api/states

以[状态对象](https://www.hasscn.top/contributors/core/internals/states/#the-state-object)列表的形式，返回用户可以读取的所有状态。

### GET /api/states/&lt;entity_id&gt;

返回单个实体（entity）的状态，若无则返回 404。

```json
{
  "entity_id": "sun.sun",
  "state": "below_horizon",
  "attributes": {
    "friendly_name": "Sun",
    "elevation": -17.67
  },
  "last_changed": "2026-10-10T21:43:29.204838+00:00",
  "last_reported": "2026-10-10T21:50:30.529465+00:00",
  "last_updated": "2026-10-10T21:50:30.529465+00:00",
  "context": {
    "id": "01J9Z7K1M3S8TQ0Y6E4H2B5N7C",
    "parent_id": null,
    "user_id": null
  }
}
```

### POST /api/states/&lt;entity_id&gt;

**管理员。** 创建或替换一个状态。请求体需要包含 `state`，并且可以包含 `attributes`：

```json
{
  "state": "25",
  "attributes": {
    "unit_of_measurement": "°C"
  }
}
```

如果状态是新建的则返回 201，如果状态已存在则返回 200；响应体中包含新状态，并且有一个指向它的 `Location` 头。添加 `"force_update": true` 可以在没有任何变化的情况下也触发一次状态变更。

> [!IMPORTANT]
> 这只会改变 Home Assistant 所显示的内容。它不会与设备进行通信，而且实体的下一次更新会将其覆盖。要控制设备，请调用动作。

### DELETE /api/states/&lt;entity_id&gt;

**管理员。** 移除一个状态。如果状态不存在则返回 404。

## 动作

### GET /api/services

返回已注册的动作，按域（domain）分组。该路径仍沿用旧名称 services（服务）。

### POST /api/services/&lt;domain&gt;/&lt;service&gt;

调用一个动作并等待其完成。请求体为动作数据，并且可以包含目标（target）：

```shell
curl \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"entity_id": "light.kitchen"}' \
  http://homeassistant.local:8123/api/services/light/turn_on
```

返回因此次调用而发生变化的状态列表。要获取[响应数据](https://www.hasscn.top/contributors/core/integrations/actions/#return-response-data)，请在 URL 中添加 `?return_response`。此时响应类似于这样：

```json
{
  "changed_states": [],
  "service_response": {
    "weather.forecast_home": {
      "forecast": []
    }
  }
}
```

对支持 `?return_response` 的动作使用该参数，并且仅限于这类动作。对仅返回数据的动作省略该参数，或对没有响应数据的动作添加该参数，都会得到 400 错误。

## 事件

### GET /api/events

返回拥有监听器的事件类型，以及每种类型各自的监听器数量。

### POST /api/events/&lt;event_type&gt;

**管理员。** 触发一个事件。请求体为可选的事件数据：

```json
{
  "button_id": "front_door"
}
```

返回 `{"message": "Event front_door_pressed fired."}`，消息中包含您的事件类型。事件会存储在数据库中，因此请注意您所触发的内容。

### GET /api/stream

**管理员。** 以服务器发送事件（server-sent events）的形式提供所有事件组成的流。传入 `?restrict=state_changed,call_service` 可以将其限制为某些事件类型。对于新代码，WebSocket API 的 `subscribe_events` 是更好的选择。

## 模板

### POST /api/template

**管理员。** 渲染一个[模板](https://www.hasscn.top/contributors/glossary/template/)并以纯文本形式返回结果。

```json
{
  "template": "It is {{ states('sensor.temperature') }} degrees."
}
```

## 历史与日志

这些端点来自 `history` 和 `logbook` 集成，它们是默认配置的一部分。

### GET /api/history/period/&lt;timestamp&gt;

返回实体的状态历史。时间戳（例如 `2026-10-01T00:00:00+02:00`）是时间段的起点，为可选参数：默认值为一天前。查询参数：

- `filter_entity_id`：必填。一个或多个实体 ID，以逗号分隔。
- `end_time`：时间段的结束时间，需 URL 编码。默认为开始时间后一天。
- `minimal_response`：对于第一个和最后一个状态之间的状态，仅返回 `state` 和 `last_changed`。速度快得多。
- `no_attributes`：跳过属性。也更快。
- `significant_changes_only=0`：返回每一次变化。默认情况下，您只会得到显著变化。
- `skip_initial_state`：省略时间段起始处的状态。

响应是一个列表，其中每个实体各对应一个状态列表。

### GET /api/logbook/&lt;timestamp&gt;

返回日志条目，从可选的时间戳开始。如果不提供时间戳，则从当天的起始时刻（当地时间）开始。查询参数：

- `entity`：一个或多个实体 ID，以逗号分隔。
- `end_time`：时间段的结束时间，需 URL 编码。
- `period`：在没有 `end_time` 时返回的天数。默认为 1。
- `context_id`：仅返回某个上下文的条目。不能与 `entity` 同时使用。

## 其他集成

若干集成添加了它们自己的端点：

- `GET /api/error_log`（**管理员**）：当前会话的日志，以纯文本形式表示。
- `GET /api/camera_proxy/<entity_id>`：摄像头的当前图像。
- `GET /api/calendars`：日历实体。`GET /api/calendars/<entity_id>?start=<timestamp>&end=<timestamp>` 返回某个日历在该时间段内的事件。
- `POST /api/intent/handle`：处理一个[意图（intent）](https://www.hasscn.top/contributors/core/internals/intents/#fire-an-intent)。
- `POST /api/conversation/process`：将文本发送给对话代理（conversation agent）。请参阅[对话 API](https://www.hasscn.top/contributors/core/internals/conversation-api/)。

## 添加您自己的端点

集成可以使用来自 `homeassistant.helpers.http` 的 `HomeAssistantView` 来添加端点，并通过 `hass.http.register_view(MyView())` 进行注册。设置 `url` 和 `name`，并实现 `get`、`post` 或其他方法。除非设置 `requires_auth = False`，否则视图需要进行身份验证。示例请参阅[权限](https://www.hasscn.top/contributors/core/internals/permissions/#in-an-http-view)。

在动手之前请三思。大多数功能应属于 WebSocket API，前端可以直接使用它。HTTP 视图适合 Home Assistant 外部的程序需要调用进来的情况（例如 webhook），或者当您需要提供文件时。
