---
title: LLM API
description: Home Assistant 如何向大型语言模型暴露工具，集成如何贡献工具或整个 API，以及 API 如何通过 MCP 提供。
sidebarLabel: LLM API
sidebarGroup: Voice and AI
order: 54
---

大型语言模型（LLM）在获得工具之后，能做的远不止聊天。Home Assistant 中的 LLM API 是一组工具，外加一段解释如何使用这些工具的提示词。封装语言模型的对话代理（conversation agent）会把用户所选 API 的工具交给模型，并执行模型调用的工具。

Home Assistant 内置了两个 API，集成（integration）可以向它们添加工具，也可以注册自己的 API。

这涉及三个方面：

- **使用 API**，即在对话代理中使用。这部分由[对话实体（conversation entity）](/core/entities/conversation/)负责，通过 `chat_log.async_provide_llm_data` 实现。
- 向现有 API **贡献工具**。参见[贡献工具](#contribute-tools)。
- **构建你自己的 API**。参见[构建你自己的 API](#build-your-own-api)。

## 内置 API

`llm` 集成注册了两个 API。两者本身都没有工具：它们的所有工具都来自各集成的 `llm.py` 平台，参见[贡献工具](#contribute-tools)。

- **Assist**，ID 为 `assist`，向用户显示为“设备控制”（Device control），用于控制和读取用户暴露给 Assist 的实体（entity）。`intent` 集成向它提供常见的[意图（intent）](/core/internals/intents/)作为工具，比如 `HassTurnOn` 和定时器意图，实体集成也提供它们自己的工具，比如设置风扇的速度。它不能执行任何管理操作。
- **Home Assistant**，ID 为 `homeassistant`，管理 Home Assistant 本身，比如注册表、系统日志、自动化和配置条目（config entry）。它不限于已暴露的实体，并且只有管理员才能使用。

注册意图并不会使它成为工具。要向模型提供你的意图，请在你的 `llm.py` 平台中为其处理器返回一个 `llm.IntentTool`。该工具会使用你的意图处理器的 `description`，所以要为模型来编写它：模型正是通过阅读它来决定何时调用该工具。

## 让用户选择 API

与语言模型通信的集成会让用户在其选项流（options flow）中选择 API。将所选的 API ID 以列表形式存储在 `homeassistant.const` 的 `CONF_LLM_HASS_API` 下。如果用户一个都没选，则省略该键。

```python
from homeassistant.const import CONF_LLM_HASS_API
from homeassistant.helpers import llm
from homeassistant.helpers.selector import (
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
)

apis = [
    SelectOptionDict(label=api.name, value=api.id)
    for api in llm.async_get_apis(hass)
]
schema = probatio.Schema(
    {
        probatio.Optional(
            CONF_LLM_HASS_API,
            description={"suggested_value": options.get(CONF_LLM_HASS_API)},
        ): SelectSelector(SelectSelectorConfig(options=apis, multiple=True)),
    }
)
```

当用户选择多个 API 时，Home Assistant 会将它们合并为一个提供给模型。

## 贡献工具

集成可以通过一个 `llm.py` 平台向这些 API 添加工具，而无需拥有自己的 API。该平台包含一个 `async_get_tools` 回调，`llm` 集成会针对每个请求调用它，并传入该请求的上下文以及正在组装的 API 的 ID。返回适用于该 API 的工具，以及可选的随附提示词，或返回 `None` 表示不贡献任何内容。

以这种方式贡献的每个工具，其名称都必须以你的域名（domain）加两个下划线开头，比如 `my_integration__coffee_count`。Home Assistant 会在日志中报告缺少该前缀的工具，并且它们将在 Home Assistant 2027.3 中停止工作。

```python
from homeassistant.components import llm
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.llm import LLMContext


@callback
def async_get_tools(
    hass: HomeAssistant, llm_context: LLMContext, api_id: str
) -> llm.LLMTools | None:
    """Return the tools of my integration."""
    if api_id != "assist":
        return None

    return llm.LLMTools(
        tools=[CoffeeCountTool()],
        prompt="Use my_integration__coffee_count for coffee questions.",
    )
```

由于它在每次请求时都会运行，工具可以依赖于上下文：请求来自的设备、助手（assistant）或 API。该平台只在需要时才会被导入，你的集成无需依赖 `llm`。

## 工具

工具是 `homeassistant.helpers.llm` 中 `llm.Tool` 的子类：

```python
import probatio

from homeassistant.core import HomeAssistant
from homeassistant.helpers import llm
from homeassistant.util import dt as dt_util

from .const import DOMAIN


class TimeTool(llm.Tool):
    """Tell the time."""

    name = "GetTime"
    title = "Get the time"
    description = "Returns the current time."
    integration = DOMAIN
    annotations = llm.ToolAnnotations(
        read_only=True,
        destructive=False,
        idempotent=True,
        open_world=False,
    )
    parameters = probatio.Schema({probatio.Optional("timezone"): str})

    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: llm.ToolInput,
        llm_context: llm.LLMContext,
    ) -> llm.ToolResult:
        """Return the current time."""
        tzinfo = dt_util.DEFAULT_TIME_ZONE
        if timezone := tool_input.tool_args.get("timezone"):
            tzinfo = dt_util.get_time_zone(timezone)

        return llm.ToolResult(
            data={"time": dt_util.now(tzinfo).isoformat()}
        )
```

| 属性 | 描述 |
| --- | --- |
| `name` | 必需。模型调用该工具时所使用的名称。 |
| `integration` | 必需。提供该工具的集成的域名。 |
| `description` | 该工具的功能说明，为模型而编写。可选，但没有它模型将无所适从。 |
| `title` | 展示给用户的名称。可选。 |
| `parameters` | 参数的 `probatio` 模式。默认为无参数。 |
| `annotations` | 一个描述该工具行为方式的 `ToolAnnotations`。 |

缺少 `integration` 的工具会被报告：对于核心集成报告为错误，对于自定义集成则在日志中报告为警告，直到它在 Home Assistant 2027.10 中停止工作。

### 调用工具

`async_call` 接收 `hass`、一个 `ToolInput` 以及请求的 `LLMContext`：

- `ToolInput` 包含 `tool_name`、`tool_args`（根据 `parameters` 验证）、本次调用的 `id`，以及 `external`。外部调用（external call）是指已由其他部分处理的调用，因此聊天记录（chat log）会记录它，但不会让它经过 LLM API 运行。对话代理会为其模型提供方运行的工具（比如网页搜索）设置它，内置对话代理也会为其自行处理的意图设置它。由聊天记录为你的工具运行的调用，其 `external` 被设置为 `False`。
- `LLMContext` 包含 `platform`（代理的域名）、包含用户的 `context`、`language`、其已暴露实体适用的 `assistant`，以及请求来自的 `device_id`。

返回一个 `ToolResult`。其 `data` 必须是一个可以序列化为 JSON 的字典。返回普通字典的方式已被弃用，并将在 Home Assistant 2027.11 中停止工作。

当工具无法完成其任务时，抛出一个 `HomeAssistantError`。Home Assistant 会捕获它并告诉模型调用失败。如果你想亲自为模型描述失败情况，可以返回一个设置了 `error` 的结果：

```python
return llm.ToolResult(data={"error": "Calendar not found"}, error=True)
```

### 注解（Annotations）

注解告诉模型应当多加小心。它们与[Model Context Protocol](https://modelcontextprotocol.io)的工具注解保持一致，并且 MCP Server 集成会传递它们。

| 注解 | 含义 | 默认值 |
| --- | --- | --- |
| `read_only` | 该工具不会更改任何内容。 | `False` |
| `destructive` | 该工具可以更改或移除已存在的内容。 | `True` |
| `idempotent` | 使用相同参数再次调用不会产生更多更改。 | `False` |
| `open_world` | 该工具会触及 Home Assistant 之外。 | `True` |

默认值都做了最坏的假设，所以请为你的工具声明实际情况。

## 构建你自己的 API

API 是 `llm.API` 的子类。它返回一个 `APIInstance`：即这些工具，以及一段告诉模型如何使用它们的提示词。

```python
from homeassistant.helpers import llm


class MyAPI(llm.API):
    """An LLM API of my integration."""

    async def async_get_api_instance(
        self, llm_context: llm.LLMContext
    ) -> llm.APIInstance:
        """Return the tools for this request."""
        return llm.APIInstance(
            api=self,
            api_prompt="Use the tools to look up data in my service.",
            llm_context=llm_context,
            tools=[TimeTool()],
        )


async def async_setup_entry(
    hass: HomeAssistant, entry: MyConfigEntry
) -> None:
    """Set up my integration."""
    entry.async_on_unload(
        llm.async_register_api(
            hass,
            MyAPI(
                hass=hass,
                id=f"my_integration-{entry.entry_id}",
                name=entry.title,
            ),
        )
    )
```

`llm.API` 只接受关键字参数：`hass`、一个唯一的 `id`，以及用户看到的 `name`。对于只有管理员才能使用的 API，请设置 `requires_admin=True`。`async_register_api` 会返回一个用于注销该 API 的函数：当该 API 属于某个配置条目时，请在卸载时调用它，如上例所示。

`APIInstance` 还可以接受一个 `custom_serializer`：一个将你的工具的模式（比如选择器）转换为模型所期望的 JSON 模式的函数。

## 通过 MCP 提供服务

一旦用户设置了 [MCP Server 集成](https://www.home-assistant.io/integrations/mcp_server/)，每个已注册的 API 都可以通过 [Model Context Protocol](https://modelcontextprotocol.io) 使用。你无需为此做任何事情。

每个 API 都有自己的 Streamable HTTP 端点，位于 `/api/mcp/<API ID>`。Assist API 位于 `/api/mcp/assist`。除 Assist 之外的所有 API 在那里都需要管理员的访问令牌（access token）。该集成还会在 `/api/mcp` 提供用户为其配置的 API，供未选择特定 API 的客户端使用。

要了解存在哪些 API，管理员可以通过 WebSocket API 列出它们，按注册顺序排列：

```json
{
  "id": 1,
  "type": "llm/api/list"
}
```

```json
{
  "id": 1,
  "type": "result",
  "success": true,
  "result": {
    "apis": [
      {"id": "assist", "name": "Device control", "requires_admin": false}
    ]
  }
}
```
