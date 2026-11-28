# 对话 API

> 通过 REST 或 WebSocket API 向对话代理发送文本，并读取其返回的响应。

Source: https://www.hasscn.top/contributors/core/internals/conversation-api/

`conversation` 集成（integration）接收一句话，将其交给[对话代理（conversation agent）](https://www.hasscn.top/contributors/glossary/conversation-agent/)，并返回该代理的响应。内置代理会将这句话匹配到一个[意图（intent）](https://www.hasscn.top/contributors/core/internals/intents/)并进行处理。其他代理，比如由大语言模型支持的代理，则以各自的方式处理。无论采用哪种方式，响应看起来都是一样的。

要自己构建一个代理，请参见[对话实体（conversation entity）](https://www.hasscn.top/contributors/core/entities/conversation/)。本页面介绍的是如何调用代理。

## 发送一句话

通过 REST API，向 `/api/conversation/process` 发送 POST 请求：

```json
{
  "text": "turn on the lights in the living room",
  "language": "en"
}
```

通过 WebSocket API，使用相同的字段发送 `conversation/process`：

```json
{
  "id": 5,
  "type": "conversation/process",
  "text": "turn on the lights in the living room",
  "language": "en"
}
```

| 字段 | 描述 |
| --- | --- |
| `text` | 必填。这句话。 |
| `language` | 这句话的语言。默认为实例的语言。 |
| `agent_id` | 要使用的代理。默认为内置代理 `conversation.home_assistant`。 |
| `conversation_id` | 继续先前的对话。参见[对话](https://www.hasscn.top/contributors/core/internals/conversation-api/#conversations)。 |
| `device_id` | 这句话所来自的设备（device），例如语音卫星。 |
| `satellite_id` | 这句话所来自的卫星的实体（entity）ID。 |

## 响应

```json
{
  "response": {
    "response_type": "action_done",
    "language": "en",
    "data": {
      "success": [
        {"name": "Living Room", "type": "area", "id": "living_room"},
        {"name": "Ceiling", "type": "entity", "id": "light.ceiling"}
      ],
      "failed": []
    },
    "speech": {
      "plain": {
        "speech": "Turned on the lights",
        "extra_data": null
      }
    },
    "card": {}
  },
  "conversation_id": "01J9Z7K1M3S8TQ0Y6E4H2B5N7C",
  "continue_conversation": false
}
```

- `response_type`：发生了什么。见下文。
- `data`：取决于响应类型。
- `speech`：要对用户说的话。纯文本位于 `plain` 下，[SSML](https://www.w3.org/TR/speech-synthesis11/) 位于 `ssml` 下。
- `conversation_id`：随下一句话一起传递，以继续对话。
- `continue_conversation`：如果代理期望用户作出回答（比如在提问之后），则为 `true`。

### 操作已完成

该意图执行了某个操作，比如打开了一盏灯。`data.success` 列出了被操作的目标，`data.failed` 列出了失败的目标。每个目标都有一个 `name`、一个 `type`，以及一个可选的 `id`。类型是 `floor`、`area`、`domain`、`device_class`、`device`、`entity` 或 `custom` 之一。

目标层层递进，从一般到具体。“关闭所有灯”有一个目标：`domain` light。“打开厨房的灯”有两个：`area` kitchen 和 `domain` light。“打开厨房的百叶窗”有三个：`area` kitchen、`domain` cover 和 `device_class` blind。

### 查询回答

响应回答了一个问题，比如“温度是多少？”。答案在 `speech` 中，`data.success` 列出了被询问的对象。

### 错误

出了点问题。`data.code` 说明了原因，`speech` 中则有一条给用户的消息：

- `no_intent_match`：这句话没有匹配到任何意图。
- `no_valid_targets`：区域（area）、设备或实体不存在，或未被公开。
- `failed_to_handle`：在处理意图时发生错误。
- `unknown`：意图处理之外的错误。

## 对话

支持该功能的代理会跟踪一段对话，因此在“打开客厅的灯”之后说“那厨房呢？”也能被理解。每个响应都有一个 `conversation_id`。将其随下一句话一起发送，即可继续对话：

```json
{
  "text": "and in the kitchen?",
  "conversation_id": "01J9Z7K1M3S8TQ0Y6E4H2B5N7C"
}
```

## 预加载句子

加载一种语言的句子需要一点时间。要在第一个请求到来之前就准备好它们，请通过 WebSocket API 发送 `conversation/prepare`，并可选择带上 `language` 和 `agent_id`：

```json
{
  "id": 6,
  "type": "conversation/prepare",
  "language": "en"
}
```

## 其他 WebSocket 命令

- `conversation/agent/list`：可用的代理，可选择按 `language` 和 `country` 过滤。
- `conversation/sentences/list`（管理员）：由自动化中的句子触发器注册的句子。
- `conversation/agent/homeassistant/language_scores`：内置代理对每种语言的支持程度，以及给定 `language` 和 `country` 时的首选语言。
- `conversation/agent/homeassistant/debug`：显示内置代理如何匹配一个 `sentences` 列表，而不会对其执行操作。在编写句子时很有用。
