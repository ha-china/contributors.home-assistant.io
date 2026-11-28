# WebSocket API

> 前端使用的 API。介绍连接的工作方式、核心命令、错误处理，以及如何从集成中添加你自己的命令。

Source: https://www.hasscn.top/contributors/core/internals/websocket-api/

Home Assistant 在 `/api/websocket` 提供 WebSocket API。它是主要的 API：前端和伴侣应用（companion app）几乎所有的操作都使用它，而且它可以在变化发生时实时流式传输。集成（integration）会向它添加自己的命令，因此实际存在的命令远多于本页所列。

对于 JavaScript，请使用 [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) 库。它负责处理身份验证、重连和订阅，前端使用的正是它。

## 连接的工作方式

1. 客户端连接。服务器发送 `auth_required`。
2. 客户端发送一条带有访问令牌的 `auth` 消息。
3. 服务器回复 `auth_ok`，或者回复 `auth_invalid` 并关闭连接。
4. 命令阶段开始。客户端发送命令，服务器发送结果和订阅消息。
5. 任意一方关闭连接。

每条消息都是一个带有 `type` 的 JSON 对象。在命令阶段，客户端发出的每条消息还带有一个 `id`：一个随每条命令递增的数字。服务器会在它发回的所有内容上都带上这个 `id`，这样你就能将应答与命令一一对应。

## 身份验证

连接后，服务器会立即发送：

```json
{
  "type": "auth_required",
  "ha_version": "2026.10.0"
}
```

发送一个访问令牌。有关如何获取访问令牌，请参阅[身份验证 API](https://www.hasscn.top/contributors/core/internals/auth-api/)。

```json
{
  "type": "auth",
  "access_token": "ABCDEFGH"
}
```

如果令牌有效：

```json
{
  "type": "auth_ok",
  "ha_version": "2026.10.0"
}
```

如果无效，你会收到带有 `message` 的 `auth_invalid`，服务器随即断开连接。

## 启用功能

完成身份验证后，客户端可以立即使用 `supported_features` 开启可选功能。目前只有一个这样的功能，即 `coalesce_messages`：启用后，服务器会将消息打包，以 JSON 列表的形式批量发送，而不是逐条发送。

```json
{
  "id": 1,
  "type": "supported_features",
  "features": {
    "coalesce_messages": 1
  }
}
```

## 结果与错误

服务器对每条命令都以 `result` 应答，`ping` 除外，它会收到 `pong`：

```json
{
  "id": 6,
  "type": "result",
  "success": true,
  "result": null
}
```

当出现问题时，`success` 为 `false`，`error` 中包含 `code` 和 `message`：

```json
{
  "id": 12,
  "type": "result",
  "success": false,
  "error": {
    "code": "invalid_format",
    "message": "Message incorrectly formatted: required key not provided"
  }
}
```

错误代码包括 `invalid_format`、`not_found`、`not_allowed`、`not_supported`、`unauthorized`、`unknown_command`、`id_reuse`、`home_assistant_error`、`service_validation_error`、`template_error`、`timeout` 和 `unknown_error`。当错误来自带有翻译信息的 `HomeAssistantError` 时，错误还会带有 `translation_domain`、`translation_key` 和 `translation_placeholders`，这样前端就能以用户的语言显示该错误。

## 核心命令

以下是 `websocket_api` 集成本身的命令。

### 订阅事件

```json
{
  "id": 18,
  "type": "subscribe_events",
  "event_type": "state_changed"
}
```

省略 `event_type` 即可获取所有事件。这种情况以及大多数事件类型都需要管理员权限。每个事件都会以类型为 `event` 的消息送达，并带有该订阅的 `id`：

```json
{
  "id": 18,
  "type": "event",
  "event": {
    "event_type": "state_changed",
    "data": {
      "entity_id": "light.kitchen",
      "old_state": {},
      "new_state": {}
    },
    "origin": "LOCAL",
    "time_fired": "2026-10-10T10:37:24.265429+00:00",
    "context": {
      "id": "01J9Z7K1M3S8TQ0Y6E4H2B5N7C",
      "parent_id": null,
      "user_id": null
    }
  }
}
```

此处对状态（state）做了截断处理。要跟踪状态，使用 `subscribe_entities` 效率更高。

### 取消订阅

结束任意订阅。`subscription` 是启动该订阅的那条命令的 `id`。

```json
{
  "id": 19,
  "type": "unsubscribe_events",
  "subscription": 18
}
```

### 订阅实体（entity）

`subscribe_entities` 是前端用来跟踪状态的方式。它先发送用户可读取的所有状态，之后只发送变化的部分，且采用紧凑格式。传入 `entity_ids` 可以限制范围。

```json
{
  "id": 20,
  "type": "subscribe_entities",
  "entity_ids": ["light.kitchen"]
}
```

每条 `event` 消息包含一个最多含三个键的映射：`a` 表示新增实体及其完整的压缩状态，`c` 表示发生变化的实体且只包含变化的部分（变化在 `+` 下，被移除的属性在 `-` 下），`r` 表示被移除实体的 ID。在压缩状态中，`s` 是状态，`a` 是属性，`c` 是上下文，`lc` 是最后变更时间，`lu` 是最后更新时间。

### 订阅触发器

**需要管理员权限。** 订阅一个或多个[触发器（trigger）](https://www.hasscn.top/contributors/glossary/trigger/)，格式与自动化（automation）中的相同。触发器每次触发时，你都会收到一条包含触发器变量的 `event` 消息。

```json
{
  "id": 2,
  "type": "subscribe_trigger",
  "trigger": {
    "trigger": "state",
    "entity_id": "binary_sensor.motion",
    "to": "on"
  }
}
```

### 调用动作（action）

```json
{
  "id": 24,
  "type": "call_service",
  "domain": "light",
  "service": "turn_on",
  "service_data": {
    "brightness": 255
  },
  "target": {
    "entity_id": "light.kitchen"
  }
}
```

`service_data` 和 `target` 是可选的。结果中包含本次调用的 `context`。要获取[响应数据](https://www.hasscn.top/contributors/core/integrations/actions/#return-response-data)，请添加 `"return_response": true`。此时结果中还会包含一个 `response`：

```json
{
  "id": 24,
  "type": "result",
  "success": true,
  "result": {
    "context": {
      "id": "01J9Z7K1M3S8TQ0Y6E4H2B5N7C",
      "parent_id": null,
      "user_id": "31ddb597e03147118cf8d2f8fbea5553"
    },
    "response": {}
  }
}
```

### 触发事件

**需要管理员权限。** 触发一个事件，`event_data` 为可选。结果中包含 `context`。

```json
{
  "id": 25,
  "type": "fire_event",
  "event_type": "my_integration_button_pressed",
  "event_data": {
    "button_id": "front_door"
  }
}
```

### 获取内容

以下每条命令都只接受一个 `id` 和一个 `type`，并在 `result` 中返回相应数据：

- `get_states`：用户可读取的所有状态。
- `get_config`：[核心配置](https://www.hasscn.top/contributors/core/internals/hass/#the-core-configuration)。
- `get_services`：所有动作及其描述。
- `get_panels`：已注册的面板。这一条来自 `frontend` 集成。

### Ping

发送 `{"id": 19, "type": "ping"}`，服务器会回复 `{"id": 19, "type": "pong"}`。可以把它当作心跳，用来检测连接是否存活。

### 验证配置

`validate_config` 会将 `triggers`、`conditions` 和 `actions` 当作自动化的一部分来进行检查。每个键都是可选的，且只返回你发送的键。

```json
{
  "id": 30,
  "type": "validate_config",
  "triggers": [],
  "conditions": [],
  "actions": []
}
```

```json
{
  "id": 30,
  "type": "result",
  "success": true,
  "result": {
    "triggers": {"valid": true, "error": null},
    "conditions": {"valid": false, "error": "Invalid condition"},
    "actions": {"valid": true, "error": null}
  }
}
```

### 使用目标（target）

这些命令接受一个 `target`，其格式与动作调用相同，包含 `entity_id`、`device_id`、`area_id`、`floor_id` 和 `label_id`。目标可以包含一个具有相同键的 `exclude` 块，结果会排除其匹配的内容：

- `extract_from_target`：将目标解析为 `referenced_entities`、`referenced_devices` 和 `referenced_areas`，并在 `missing_devices`、`missing_areas`、`missing_floors` 和 `missing_labels` 下列出不存在的内容。使用 `"expand_group": true` 时，分组会被替换为其成员。默认为 `false`。
- `get_triggers_for_target`、`get_conditions_for_target` 和 `get_services_for_target`：返回适用于目标中至少一个实体的触发器、条件或动作，例如 `light.turn_on`。这里 `expand_group` 默认为 `true`。

### 更多命令

核心命令还包括 `render_template`、`subscribe_condition`、`test_condition`、`execute_script`、`entity/source`、`manifest/list`、`manifest/get` 和 `integration/setup_info`。除此之外，几乎所有带界面的集成都会注册自己的命令。应用和其他客户端依赖的一些命令在下文的[集成命令](https://www.hasscn.top/contributors/core/internals/websocket-api/#integration-commands)中有介绍。其余命令的调用方式，最好直接查看前端源码。

## 集成命令

这些命令并非来自 `websocket_api` 本身，而是来自那些只要前端加载就一定会加载的集成。伴侣应用和其他客户端都在使用这些命令，因此它们的格式是一种契约。

### 列出用于显示的实体

`config/entity_registry/list_for_display` 来自 `config` 集成。它以紧凑格式返回实体注册表（entity registry）：只包含客户端显示实体所需的信息，并使用短键名来减小消息体积。任何通过身份验证的用户都可以调用它。它不接受任何参数。

```json
{
  "id": 40,
  "type": "config/entity_registry/list_for_display"
}
```

```json
{
  "id": 40,
  "type": "result",
  "success": true,
  "result": {
    "entity_categories": {"0": "config", "1": "diagnostic"},
    "entities": [
      {
        "ei": "light.living_room",
        "pl": "hue",
        "ai": "living_room",
        "lb": [],
        "di": "a1b2c3d4e5f6",
        "np": "area",
        "hn": true,
        "en": "Ceiling"
      },
      {
        "ei": "sensor.living_room_signal",
        "pl": "esphome",
        "lb": [],
        "di": "f6e5d4c3b2a1",
        "np": "device",
        "tk": "signal",
        "ec": 1,
        "hn": true,
        "dp": 0
      }
    ]
  }
}
```

`entity_categories` 将数字映射到[实体类别（entity category）](https://www.hasscn.top/contributors/core/entities/registry/)。实体在 `ec` 中用该数字来指代自己的类别，而不是重复字符串。JSON 的键始终是字符串，因此这些数字以 `"0"` 和 `"1"` 的形式送达。

`entities` 包含注册表中所有未停用的实体。已停用的实体一律排除在外，无论是由谁停用的。没有注册表条目的实体，例如没有唯一 ID 的实体，也不会出现在列表中。每个实体都有以下这些键。只有 `ei`、`pl` 和 `lb` 始终存在。其余键在没有值时会被省略。

| 键 | 类型 | 含义 |
| --- | --- | --- |
| `ei` | 字符串 | 实体 ID。 |
| `pl` | 字符串 | 平台：提供该实体的集成，例如 `hue`。 |
| `lb` | 字符串列表 | 该实体的标签（label）的 ID。没有标签时为空列表。 |
| `ai` | 字符串 | 实体本身被分配到的区域（area）的 ID。当实体仅从其设备继承区域时，此项不会被设置。 |
| `di` | 字符串 | 该实体所属设备（device）的 ID。 |
| `np` | 字符串 | 构建实体全名时接下来使用哪个名称：实体拥有自己的区域时为 `area`，否则当它属于某台设备时为 `device`。 |
| `ic` | 字符串 | 用户选择的图标，例如 `mdi:lightbulb`。它会覆盖状态的图标。 |
| `tk` | 字符串 | 实体的翻译键，用于翻译其名称和状态。 |
| `ec` | 数字 | 实体类别，是 `entity_categories` 的一个键。 |
| `hb` | 布尔值 | 当实体被隐藏时为 `true`，无论是被用户还是被集成隐藏。 |
| `hn` | 布尔值 | 当实体[使用 `has_entity_name`](https://www.hasscn.top/contributors/core/entities/naming/) 时为 `true`，此时其名称不包含设备名称。 |
| `en` | 字符串 | 实体名称。用户设置的名称，否则为集成提供的名称。对于不使用 `has_entity_name` 的集成，如果集成提供的名称以设备名称开头，则会去掉开头的设备名称。 |
| `dp` | 数字 | 仅限传感器：要显示的小数位数。为用户设置的精度，否则为集成建议的精度。 |

如需包含所有字段的完整注册表条目，请使用 `config/entity_registry/list`（所有条目）或 `config/entity_registry/get_entries`（一组 `entity_ids` 的条目）。

### 向语音助手公开实体

`homeassistant` 集成会记录哪些实体向哪个语音助手公开。这些命令用于管理这一设置。所有这些命令都需要管理员权限。

这些助手由以下 ID 标识，命令不接受其他任何 ID：

- `conversation`：Assist
- `cloud.alexa`：通过 Home Assistant Link 使用的 Amazon Alexa
- `cloud.google_assistant`：通过 Home Assistant Link 使用的 Google Assistant

#### 公开或取消公开实体

`homeassistant/expose_entity` 向一个或多个助手公开或取消公开实体。更改会立即生效。

```json
{
  "id": 41,
  "type": "homeassistant/expose_entity",
  "assistants": ["conversation", "cloud.alexa"],
  "entity_ids": ["light.living_room", "sensor.outside"],
  "should_expose": true
}
```

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `assistants` | 字符串列表 | 必填。要更改此设置的助手。 |
| `entity_ids` | 字符串列表 | 必填。要更改的实体。这些 ID 不会与现有实体进行核对。 |
| `should_expose` | 布尔值 | 必填。`true` 表示公开，`false` 表示取消公开。 |

结果为 `null`。

#### 列出已公开的实体

`homeassistant/expose_entity/list` 不接受参数，返回至少向一个助手公开的实体。每个实体映射到它所公开给的各个助手，值始终为 `true`。实体未公开给的助手会被省略，未向任何助手公开的实体同样不会出现。

```json
{
  "id": 42,
  "type": "homeassistant/expose_entity/list"
}
```

```json
{
  "id": 42,
  "type": "result",
  "success": true,
  "result": {
    "exposed_entities": {
      "light.living_room": {
        "conversation": true,
        "cloud.alexa": true
      },
      "sensor.outside": {
        "conversation": true
      }
    }
  }
}
```

该列表保存的是已存储的内容。当有人公开或取消公开某个实体时，Home Assistant 会存储该实体的设置；当助手第一次询问它是否可以使用该实体时，Home Assistant 也会进行存储。在此之前，即使下文的默认规则会将其公开，该实体也不会出现在列表中。

#### 默认公开新实体

每个助手都有一个设置，用于决定新实体是否自动向它公开。`homeassistant/expose_new_entities/get` 读取某个 `assistant` 的该设置：

```json
{
  "id": 43,
  "type": "homeassistant/expose_new_entities/get",
  "assistant": "conversation"
}
```

```json
{
  "id": 43,
  "type": "result",
  "success": true,
  "result": {
    "expose_new": true
  }
}
```

在更改之前，`conversation` 的该设置为 `true`，其他助手则为 `false`。

`homeassistant/expose_new_entities/set` 用于更改该设置。`assistant` 和 `expose_new`（一个布尔值）均为必填。结果为 `null`。

```json
{
  "id": 44,
  "type": "homeassistant/expose_new_entities/set",
  "assistant": "cloud.alexa",
  "expose_new": true
}
```

开启该设置后，并非每个新实体都会被公开。当实体没有实体类别且未被隐藏，并且满足以下条件之一时，才会默认公开：

- 其域（domain）为 `climate`、`cover`、`fan`、`humidifier`、`light`、`media_player`、`scene`、`switch`、`todo`、`vacuum` 或 `water_heater`。
- 它是设备类别（device class）为 `door`、`garage_door`、`lock`、`motion`、`opening`、`presence` 或 `window` 的二进制传感器。
- 它是设备类别为 `aqi`、`carbon_monoxide`、`carbon_dioxide`、`humidity`、`pm10`、`pm25`、`temperature` 或 `volatile_organic_compounds` 的传感器。

## 添加你自己的命令

集成使用 `websocket_api.async_register_command` 注册命令，通常是在 `async_setup` 中。请以你的域来命名命令，例如 `my_integration/devices`。

```python
from typing import Any

import probatio

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.typing import ConfigType


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up my integration."""
    websocket_api.async_register_command(hass, websocket_list_devices)
    return True


@websocket_api.websocket_command(
    {
        probatio.Required("type"): "my_integration/devices",
        probatio.Optional("include_offline", default=False): bool,
    }
)
@websocket_api.async_response
async def websocket_list_devices(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return the devices of my integration."""
    devices = await async_get_devices(hass, msg["include_offline"])
    connection.send_result(msg["id"], {"devices": devices})
```

- `websocket_command` 用于设置模式（schema）。消息会在你的处理函数运行之前进行验证。
- `async_response` 用于协程函数形式的处理函数。不使用 await 的处理函数可以改用 `@callback`，而无需 `async_response`。
- `require_admin` 将命令限制为仅管理员可用。请把它放在其他装饰器（decorator）之上。
- `connection.user` 是用户。凡是代表该用户执行的操作，都请使用 `connection.context(msg)` 作为上下文。请参阅[权限](https://www.hasscn.top/contributors/core/internals/permissions/)。
- `connection.send_result(msg["id"], result)` 用于应答命令。`connection.send_error(msg["id"], code, message)` 用于报告错误，错误代码应使用 `websocket_api` 提供的代码之一，例如 `websocket_api.ERR_NOT_FOUND`。

### 订阅

对于以流方式发送更新的命令，请将一个用于结束订阅的函数存储在 `connection.subscriptions[msg["id"]]` 中。当客户端取消订阅或断开连接时，Home Assistant 会调用该函数。使用 `connection.send_message(websocket_api.event_message(msg["id"], data))` 发送更新。

```python
@callback
@websocket_api.websocket_command(
    {probatio.Required("type"): "my_integration/subscribe"}
)
def websocket_subscribe(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Send updates of my integration to the client."""

    @callback
    def forward(data: dict[str, Any]) -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], data)
        )

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(
        hass, SIGNAL_UPDATE, forward
    )
    connection.send_result(msg["id"])
```
