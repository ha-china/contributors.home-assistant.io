# AI 任务实体

> 构建一个 AI 任务实体，让自动化可以请求模型生成数据或图像，或评估问题。

Source: https://www.hasscn.top/contributors/core/entities/ai-task/

AI 任务（AI task）实体让自动化和脚本可以使用模型执行一次性任务，而无需围绕它进行对话：总结这些传感器读数、描述摄像头看到的内容、撰写一条合适的通知，或绘制一幅图像。用户通过 `ai_task.generate_data`、`ai_task.generate_image` 和 `ai_task.evaluate` 这些动作来使用它。请继承 `homeassistant.components.ai_task` 中的 `AITaskEntity`。

为模型提供[对话实体](https://www.hasscn.top/contributors/core/entities/conversation/)的集成通常也会提供 AI 任务实体，并在两者之间共享向模型发送聊天记录（chat log）的代码。

## 属性

AI 任务实体没有自己的属性。适用[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)。

## 支持的功能

将 `AITaskEntityFeature` 的值与按位或（`|`）运算符组合使用。Home Assistant 会在调用你的实体之前检查这些值，并拒绝实体不支持的任务。

| 值 | 描述 |
| ----- | ----------- |
| `GENERATE_DATA` | 实体生成文本或结构化数据。实现 `_async_generate_data`。 |
| `SUPPORT_ATTACHMENTS` | 实体接受随任务一起提供的附件，例如摄像头快照或文件。 |
| `GENERATE_IMAGE` | 实体生成图像。实现 `_async_generate_image`。 |
| `EVALUATE` | 实体回答评估问题。实现 `_async_evaluate`。 |

## 聊天记录

每个数据和图像任务都会附带一个 `ChatLog`，与对话实体获得的相同。Home Assistant 已经填充了它：用于任务工作的系统提示词、调用方请求的 LLM API，以及作为用户消息的任务指令及其附件。你将聊天记录发送给模型，把回答添加到其中，并据此构建结果。API 详情请参阅对话实体页面上的[聊天记录](https://www.hasscn.top/contributors/core/entities/conversation/#the-chat-log)。

## 方法

### 生成数据

```python
async def _async_generate_data(
    self, task: GenDataTask, chat_log: ChatLog
) -> GenDataTaskResult:
    """Handle a generate data task."""
```

`GenDataTask` 包含以下字段：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `name` | `str` | 任务的名称，用于日志和追踪。 |
| `instructions` | `str` | 模型应该做什么。已在聊天记录中。 |
| `structure` | `probatio.Schema \| None` | 数据必须符合的结构，纯文本则为 `None`。 |
| `attachments` | `list[conversation.Attachment] \| None` | 随指令一起提供的文件。已在聊天记录中。 |
| `llm_api` | `llm.API \| None` | 调用方请求的 LLM API。已附加到聊天记录。 |

返回一个 `GenDataTaskResult`，其中包含聊天记录的 `conversation_id` 和生成的 `data`：无结构时为字符串，有结构时为符合该结构的字典。

### 生成图像

```python
async def _async_generate_image(
    self, task: GenImageTask, chat_log: ChatLog
) -> GenImageTaskResult:
    """Handle a generate image task."""
```

`GenImageTask` 包含 `name`、`instructions` 和可选的 `attachments`。返回一个 `GenImageTaskResult`：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `image_data` | `bytes` | 原始图像。 |
| `conversation_id` | `str` | 聊天记录的 ID。 |
| `mime_type` | `str` | 图像的类型，例如 `image/png`。 |
| `width` | `int \| None` | 宽度（像素），如果已知。 |
| `height` | `int \| None` | 高度（像素），如果已知。 |
| `model` | `str \| None` | 生成图像的模型，如果已知。 |
| `revised_prompt` | `str \| None` | 模型实际使用的提示词（如果它重写了提示词）。 |

### 评估

```python
async def _async_evaluate(
    self, task: EvaluationTask
) -> EvaluationTaskResult:
    """Handle an evaluation task."""
```

评估任务要求模型根据某些状态、附件或两者对一组问题进行判断，并以概率而非自由文本的形式回答。它不会获得聊天记录。`EvaluationTask` 包含以下字段：

| 名称 | 类型 | 描述 |
| ---- | ---- | ----------- |
| `name` | `str` | 任务的名称，用于日志和追踪。 |
| `questions` | `dict[str, EvaluationQuestion]` | 问题，以 ID 为键。 |
| `state` | JSON 值 | 要判断的数据，或 `None`。 |
| `attachments` | `list[conversation.Attachment] \| None` | 要判断的文件。 |

Home Assistant 会拒绝既没有 `state` 也没有附件的任务。每个问题都有一个 `type` 和 `instructions`：

- `noul`：是非题。用 `NoulAnswer` 回答，即“是”的概率。
- `choice`：从 `criteria` 中至少两个命名选项中选择一个。用 `ChoiceAnswer` 回答：所选的键以及每个键的概率。
- `score`：从 `criteria` 的有序列表中选择一个等级。用 `ScoreAnswer` 回答：期望的等级索引以及每个等级的概率。

返回一个 `EvaluationTaskResult`，其中包含 `answers`，以与问题相同的 ID 为键。

## 结构化输出

在动作中，用户使用[选择器（selector）](https://www.hasscn.top/contributors/glossary/selector/)描述结构：每个字段都有一个选择器，还可以有 `description` 和 `required`。除非 `required` 为 `true`，否则字段都是可选的，并且数据不能包含结构之外的字段。

```yaml
structure:
  name:
    description: "The name of the animal"
    required: true
    selector:
      text:
  legs:
    selector:
      number:
```

Home Assistant 会在其到达你的实体之前将其转换为 `probatio.Schema`，并将描述保留在键上。将其转换为你的模型的架构格式（通常是 JSON schema），并要求模型以该格式输出。然后解析答案并返回字典。如果模型返回的内容无法解析，则抛出 `HomeAssistantError`。

## 状态

状态是实体处理的最后一个任务的时间戳，在第一个任务之前为 `unknown`。Home Assistant 会设置并恢复它；`state` 属性是最终值。

## 示例

```python
import json

from homeassistant.components import ai_task, conversation
from homeassistant.exceptions import HomeAssistantError

Feature = ai_task.AITaskEntityFeature


class MyAITask(ai_task.AITaskEntity):
    """AI tasks with a cloud model."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_supported_features = Feature.GENERATE_DATA

    def __init__(self, entry: MyConfigEntry) -> None:
        """Set up the entity."""
        self.client = entry.runtime_data
        self._attr_unique_id = f"{entry.entry_id}_ai_task"

    async def _async_generate_data(
        self,
        task: ai_task.GenDataTask,
        chat_log: conversation.ChatLog,
    ) -> ai_task.GenDataTaskResult:
        """Send the chat log to the model and return its answer."""
        text = await self.client.complete(chat_log, task.structure)
        chat_log.async_add_assistant_content_without_tools(
            conversation.AssistantContent(
                agent_id=self.entity_id, content=text
            )
        )

        if not task.structure:
            return ai_task.GenDataTaskResult(
                conversation_id=chat_log.conversation_id, data=text
            )

        try:
            data = json.loads(text)
        except json.JSONDecodeError as err:
            raise HomeAssistantError("Model returned invalid JSON") from err

        return ai_task.GenDataTaskResult(
            conversation_id=chat_log.conversation_id, data=data
        )
```

`client.complete` 代表你的客户端库，它将聊天记录和结构转换为模型的格式。
