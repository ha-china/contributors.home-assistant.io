# 意图

> 什么是意图（intent）、集成如何处理意图，以及如何从代码或通过 HTTP 触发一个意图。

Source: https://www.hasscn.top/contributors/core/internals/intents/

[意图](https://www.hasscn.top/contributors/glossary/intent/)描述了某人想要做什么，而不关心他们是如何表达的。“打开厨房的灯”、“厨房灯打开”以及语音助手上的一个按钮，最终都会变成同一个意图：`HassTurnOn`，其中槽位（slot）`area` 被设置为 kitchen，`domain` 被设置为 light。

这种分离正是关键所在。理解用户的部分（Assist、大语言模型或外部语音助手）产生意图。执行意图的部分，即意图处理器（intent handler），并不关心它来自哪里。处理器只需编写一次，即可用于所有来源。

在 Home Assistant 中：

- `conversation` 集成将文本转换为意图，使用来自[意图仓库（intents repository）](https://github.com/OHF-Voice/intents)的句子。参见 [conversation API](https://www.hasscn.top/contributors/core/internals/conversation-api/)。
- [LLM API](https://www.hasscn.top/contributors/core/internals/llm-api/) 将意图作为工具提供给大语言模型。但并非所有意图：集成会选择提供其自身的哪些意图。
- `intent` 集成注册[内置意图（built-in intents）](https://www.hasscn.top/contributors/core/internals/built-in-intents/)，并提供一个 HTTP 端点来触发它们。它与 `conversation` 一起加载，后者是默认配置的一部分。
- 任何集成都可以为自己的意图注册处理器。

## 意图对象

来自 `homeassistant.helpers.intent` 的 `Intent` 包含：

| 属性 | 描述 |
| --- | --- |
| `hass` | Home Assistant 实例。 |
| `platform` | 触发该意图的集成。 |
| `intent_type` | 意图的名称，例如 `HassTurnOn`。 |
| `slots` | 槽位值，按槽位名称索引。每个槽位是一个包含 `value` 的字典。 |
| `text_input` | 产生此意图的文本（如果有）。 |
| `context` | `Context`，包含用户信息。 |
| `language` | 语言，默认为实例的语言。 |
| `assistant` | 处理请求的助手（assistant），例如 `conversation`。用于仅对向其公开的实体进行操作。 |
| `device_id` | 请求来源的设备，例如语音卫星（voice satellite）。 |
| `satellite_id` | 请求来源的卫星的实体 ID。 |
| `conversation_agent_id` | 处理请求的对话代理（conversation agent）。 |

## 处理意图

继承 `IntentHandler` 并通过 `intent.async_register` 注册一个实例。带有意图的集成通常在 `intent.py` 平台中完成此操作，提供一个 `async_setup_intents` 函数，由 `intent` 集成调用：

```python
import probatio

from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv, intent

INTENT_ADD_COFFEE = "MyIntegrationAddCoffee"


async def async_setup_intents(hass: HomeAssistant) -> None:
    """Set up the intents of my integration."""
    intent.async_register(hass, AddCoffeeHandler())


class AddCoffeeHandler(intent.IntentHandler):
    """Count how much coffee was had."""

    intent_type = INTENT_ADD_COFFEE
    description = "Adds cups to today's coffee count"
    slot_schema = {probatio.Optional("cups"): cv.positive_int}

    async def async_handle(
        self, intent_obj: intent.Intent
    ) -> intent.IntentResponse:
        """Handle the intent."""
        slots = self.async_validate_slots(intent_obj.slots)
        cups = slots.get("cups", {}).get("value", 1)
        total = await async_add_coffee(intent_obj.hass, cups)

        response = intent_obj.create_response()
        response.async_set_speech(f"That is {total} cups today.")
        return response
```

- `intent_type` 是名称。为你自己的意图添加前缀以避免冲突。以 `Hass` 开头的名称属于 Home Assistant。
- `description` 描述该意图。当意图作为工具提供给语言模型时，它们会阅读这段描述，所以要为它们编写。
- `slot_schema` 描述槽位。`async_validate_slots` 会对槽位进行验证，当它们不符合要求时会抛出异常。
- `platforms` 可选择性地限制哪些集成可以触发该意图。

你在处理器中设置的语音（speech）会按原样朗读，不会被翻译。内置意图的回复语句则针对每种语言都从意图仓库获取。

对于在匹配实体上调用动作（action）这一常见意图场景，来自 `homeassistant.helpers.intent` 的 `ServiceIntentHandler` 会为你完成匹配、调用和响应。

### 响应

`intent_obj.create_response()` 返回一个 `IntentResponse`：

- `async_set_speech(text)`：要回复的语音内容。默认为纯文本，或通过 `speech_type="ssml"` 使用 SSML。
- `async_set_reprompt(text)`：如果用户未及时回答时要说的内容，用于提出问题的响应。
- `async_set_card(title, content)`：供能够显示卡片的助手使用的卡片。
- `async_set_results(success_results, failed_results)`：被操作的目标，以 `IntentResponseTarget` 对象表示。
- `async_set_error(code, message)`：将响应转换为错误。
- `response_type`：默认为 `IntentResponseType.ACTION_DONE`。对于问题的答案，将其设置为 `QUERY_ANSWER`。

当意图无法被处理时，抛出 `intent.IntentHandleError`，并附带给用户的消息。

## 触发意图

如果你的代码自己理解用户，例如面向外部语音助手的集成，就让 Home Assistant 处理结果：

```python
from homeassistant.helpers import intent

try:
    response = await intent.async_handle(
        hass,
        DOMAIN,
        intent.INTENT_TURN_ON,
        {"name": {"value": "Kitchen light"}},
        context=context,
        language="en",
    )
except intent.UnknownIntent:
    _LOGGER.warning("Unknown intent")
except intent.InvalidSlotInfo as err:
    _LOGGER.error("Invalid slot data: %s", err)
except intent.IntentError:
    _LOGGER.exception("Error handling the intent")
```

将响应返回给用户由你负责。`response.speech` 按类型保存语音内容，例如 `response.speech["plain"]["speech"]`。`response.as_dict()` 返回完整的响应，其结构与 [conversation API](https://www.hasscn.top/contributors/core/internals/conversation-api/#the-response) 相同。

### 通过 HTTP

`intent` 集成提供 `POST /api/intent/handle`，其中包含意图 `name` 及其在 `data` 中的槽位值：

```json
{
  "name": "HassTurnOn",
  "data": {
    "name": "Kitchen light"
  }
}
```

可选字段有 `language`、`assistant`、`device_id` 和 `satellite_id`。响应是以 JSON 格式表示的意图响应。

要发送文本而非意图，并让 Home Assistant 自行推断意图，请使用 [conversation API](https://www.hasscn.top/contributors/core/internals/conversation-api/)。
