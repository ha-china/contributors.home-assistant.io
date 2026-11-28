# 对话实体

> 构建一个对话代理，接收来自 Assist 的文本并作出回答，背后可以有或没有语言模型。

Source: https://www.hasscn.top/contributors/core/entities/conversation/

对话实体（conversation entity）是一种[对话代理（conversation agent）](https://www.hasscn.top/contributors/glossary/conversation-agent/)：它接收用户输入或说出的内容，并返回响应。Assist 会作为[Assist 管道（Assist pipeline）](https://www.hasscn.top/contributors/glossary/assist-pipeline/)的一部分向它发送文本，`conversation.process` 动作和前端聊天界面也是如此。请继承 `homeassistant.components.conversation` 中的 `ConversationEntity`。

如今大多数对话实体都封装了一个大语言模型（LLM）。Home Assistant 负责处理周边的重活：它将聊天历史保存在聊天日志（chat log）中，通过 LLM API 为模型提供控制家居的工具，并将最后一条消息转换为语音响应。你的实体则负责在聊天日志与模型 API 之间进行转换。

## 属性

对话实体在[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)的基础上还具有以下属性。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `supported_languages` | `list[str] \| Literal["*"]` | 必填 | 代理支持的语言。当它能处理任何语言时返回 `"*"`（`MATCH_ALL`），这对 LLM 来说很常见。 |
| `supports_streaming` | `bool` | `False` | 代理是否以流式方式返回响应。当你使用 `async_add_delta_content_stream` 向聊天日志提供内容时，将其设置为 `True`，这样 Assist 就可以在完整答案生成之前开始朗读。 |

`supported_languages` 没有 `_attr_` 快捷方式：请将其实现为属性。

## 支持的功能

使用按位或（`|`）运算符组合 `ConversationEntityFeature` 的值。

| 值 | 描述 |
| ----- | ----------- |
| `CONTROL` | 代理可以控制 Home Assistant 中的设备，通常是因为用户授予了它访问 LLM API 的权限。当管道中优先使用本地意图时，Assist 会将某些句子留给你的代理处理，而不是在本地处理。 |

## 聊天日志

Home Assistant 会将每条消息连同 `ChatLog` 一起交给你的实体。聊天日志以内容对象列表的形式保存在 `chat_log.content` 中，记录了目前为止的整个对话：

- `SystemContent`：系统提示词。
- `UserContent`：用户所说的内容，可选 `attachments`。
- `AssistantContent`：代理所说的内容，可选 `tool_calls` 和 `thinking_content`。
- `ToolResultContent`：工具调用的结果。

聊天日志在一次聊天会话期间持续存在，因此后续问题到达时，之前的消息已经就位。你无需自己存储历史记录。

以下是你最常用的调用：

- `await chat_log.async_provide_llm_data(llm_context, user_llm_hass_api, user_llm_prompt, user_extra_system_prompt)`：构建系统提示词，并附加用户在你的选项中选择的 LLM API。请传入 `user_input.as_llm_context(DOMAIN)` 作为上下文。当出现问题时它会抛出 `ConverseError`，你可以用 `err.as_conversation_result()` 将其转换为结果。
- `chat_log.llm_api`：上述调用之后的 LLM API 实例，或 `None`。它的 `tools` 是你提供给模型的工具，`custom_serializer` 用于转换它们的模式（schema）。
- `chat_log.async_add_delta_content_stream(agent_id, stream)`：添加流式响应的方式。向它传入包含 `role`、`content`、`thinking_content` 或 `tool_calls` 的字典。它会替你执行工具调用，并产出（yield）它添加的每条消息，因此你可以循环直到 `chat_log.unresponded_tool_results` 为 `False`。
- `chat_log.async_add_assistant_content(content)`：非流式版本。它同样会执行工具调用并产出其结果。
- `chat_log.async_add_assistant_content_without_tools(content)`：添加一条普通响应。适用于没有工具的代理。

当模型完成后，`async_get_result_from_chat_log(user_input, chat_log)` 会根据最后一条助手消息构建 `ConversationResult`。当最后一条消息以问号结尾时（希腊语和中文的问号也算），它还会设置 `continue_conversation`，这样语音卫星设备就会继续监听答案。

完整的类型化 API 位于 [`chat_log.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/conversation/chat_log.py)。

## 方法

### 处理消息

实现 `_async_handle_message`。当它运行时，Home Assistant 已经创建了聊天日志并将用户消息添加到其中。

```python
async def _async_handle_message(
    self,
    user_input: ConversationInput,
    chat_log: ChatLog,
) -> ConversationResult:
    """Process a sentence."""
```

`ConversationInput` 包含请求内容：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `text` | `str` | 用户所说的内容。 |
| `context` | `Context` | 附加到你所执行动作上的上下文。 |
| `conversation_id` | `str \| None` | 对话的 ID，用于多轮对话。 |
| `device_id` | `str \| None` | 请求来源的设备，例如语音卫星设备。 |
| `satellite_id` | `str \| None` | 请求来源的 Assist 卫星设备的实体 ID。 |
| `language` | `str` | 文本的语言。回退为 Home Assistant 的语言。 |
| `agent_id` | `str` | 处理该请求的代理。 |
| `extra_system_prompt` | `str \| None` | 给模型的额外指令，例如来自 `start_conversation` 动作。 |

返回一个以 `intent.IntentResponse` 作为 `response` 的 `ConversationResult`，以及可选的 `conversation_id` 和 `continue_conversation`。

较旧的集成会改为重写 `async_process`。这仍然有效，但你会失去聊天日志的处理能力，因此新代码应实现 `_async_handle_message`。

### 准备

`async_prepare(language)` 是可选的。Home Assistant 一旦知道有请求即将到来就会调用它，因此你可以提前加载模型或其他资源。

## 状态

状态是该实体处理的最后一条消息的时间戳，在第一条消息之前为 `unknown`。Home Assistant 会设置并恢复它；`state` 属性是最终值。

## 示例

一个对话实体，以流式方式返回模型的响应，并允许模型使用 LLM API 的工具。

```python
from typing import Literal

from homeassistant.components import conversation
from homeassistant.const import CONF_LLM_HASS_API, MATCH_ALL

from .const import DOMAIN


class MyConversationEntity(conversation.ConversationEntity):
    """A conversation agent backed by a language model."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_supports_streaming = True

    def __init__(self, entry: MyConfigEntry) -> None:
        """Set up the entity."""
        self.entry = entry
        self._attr_unique_id = entry.entry_id
        if entry.options.get(CONF_LLM_HASS_API):
            self._attr_supported_features = (
                conversation.ConversationEntityFeature.CONTROL
            )

    @property
    def supported_languages(self) -> list[str] | Literal["*"]:
        """Return the supported languages."""
        return MATCH_ALL

    async def _async_handle_message(
        self,
        user_input: conversation.ConversationInput,
        chat_log: conversation.ChatLog,
    ) -> conversation.ConversationResult:
        """Process a sentence."""
        try:
            await chat_log.async_provide_llm_data(
                user_input.as_llm_context(DOMAIN),
                self.entry.options.get(CONF_LLM_HASS_API),
                self.entry.options.get("prompt"),
                user_input.extra_system_prompt,
            )
        except conversation.ConverseError as err:
            return err.as_conversation_result()

        while True:
            stream = self.entry.runtime_data.stream(chat_log)
            async for _ in chat_log.async_add_delta_content_stream(
                self.entity_id, stream
            ):
                pass
            if not chat_log.unresponded_tool_results:
                break

        return conversation.async_get_result_from_chat_log(
            user_input, chat_log
        )
```

`runtime_data.stream` 代表你的客户端库：它将聊天日志发送给模型，并产出增量字典。
