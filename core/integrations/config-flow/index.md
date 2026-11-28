# 配置流程

> 让用户通过配置流程（config flow）从 UI 添加您的集成，并确保同一设备永远不会被设置两次。

Source: https://www.hasscn.top/contributors/core/integrations/config-flow/

[配置流程](https://www.hasscn.top/contributors/glossary/config-flow/)（config flow）是用户添加您的集成时经过的对话框：通过几个步骤收集所需的信息、验证其是否有效，并创建一个[配置条目](https://www.hasscn.top/contributors/core/integrations/config-entries/)（config entry）。当 Home Assistant 发现您的某台设备时，发现（discovery）功能会启动相同的流程。

由于流程会在条目存在之前完成所有验证，您的集成无需在每次启动时检查其配置。

核心（core）中的每个集成都需要一个配置流程。要达到质量标准（quality scale）必须做到的事项，例如为每个字段提供 `data_description`，以及 `data` 与 `options` 之间的划分，都写在 [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/) 规则中。

## 添加配置流程

1. 在[清单文件](https://www.hasscn.top/contributors/core/integrations/manifest/#config_flow)（manifest）中设置 `"config_flow": true`。
2. 创建 `config_flow.py`，其中包含一个继承 `ConfigFlow` 并传入您的域（domain）的类。
3. 运行一次 `python3 -m script.hassfest`，让 Home Assistant 知道您的集成拥有配置流程。

[脚手架脚本](https://www.hasscn.top/contributors/core/integrations/create/)会替您完成这三步。

```python
from typing import Any

import probatio

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult
from homeassistant.const import CONF_HOST
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .const import DOMAIN

STEP_USER_SCHEMA = probatio.Schema({probatio.Required(CONF_HOST): str})


class ExampleConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Example."""

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Handle a flow started by the user."""
        errors: dict[str, str] = {}

        if user_input is not None:
            client = ExampleClient(
                user_input[CONF_HOST],
                session=async_get_clientsession(self.hass),
            )

            try:
                device = await client.get_device()
            except ExampleConnectionError:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(device.serial_number)
                self._abort_if_unique_id_configured()

                return self.async_create_entry(
                    title=device.model,
                    data=user_input,
                )

        return self.async_show_form(
            step_id="user",
            data_schema=STEP_USER_SCHEMA,
            errors=errors,
        )
```

每个步骤都是一个名为 `async_step_<step_id>` 的方法。它会在没有输入时被调用一次以显示其表单，并在用户提交时带着输入再次被调用。一个步骤会返回接下来发生的事情：表单、菜单、新条目或中止。[表单、菜单和进度](https://www.hasscn.top/contributors/core/integrations/flow-steps/)涵盖了所有这些内容。

模式（schema）使用 Home Assistant 所用的验证库 Probatio（`import probatio`）编写，通常与[选择器](https://www.hasscn.top/contributors/glossary/selector/)（selector）结合使用。

## 保留步骤

有些步骤名称具有固定的含义。Home Assistant 会替您调用它们：

| 步骤 | 何时运行 |
| --- | --- |
| `user` | 用户从 UI 添加集成。如果您没有实现对应的发现步骤，也用于发现。 |
| `reconfigure` | 用户重新配置现有条目。请参见[重新认证和重新配置](https://www.hasscn.top/contributors/core/integrations/reauth-reconfigure/)。 |
| `reauth` | 您的集成报告其凭据不再有效 |
| `bluetooth`, `dhcp`, `homekit`, `mqtt`, `ssdp`, `usb`, `zeroconf` | 您的设备通过[清单文件](https://www.hasscn.top/contributors/core/integrations/manifest/#discovery)中的匹配器被发现 |
| `hassio` | 一个 Supervisor 应用向您的集成了通告了自己 |
| `integration_discovery` | 另一个集成为您发现了一台设备。请参见[发现](https://www.hasscn.top/contributors/core/integrations/discovery/#discovery-by-another-integration)。 |
| `import` | 保留用于将 YAML 配置迁移到配置条目中 |
| `discovery` | 已弃用。当缺少对应来源的发现步骤时被调用。 |

## 唯一 ID

唯一 ID（unique ID）将配置条目与其背后的设备或账户绑定在一起，因此它不会被设置两次。在流程中使用 `async_set_unique_id` 设置它，配置条目便会继承该 ID。它只需要在您的集成内部保持唯一即可。

```python
# Abort if another flow for this device is already in progress
await self.async_set_unique_id(device.serial_number)

# Abort if a config entry for this device already exists
self._abort_if_unique_id_configured()
```

当流程因条目已存在而中止时，用户会看到来自您的 `strings.json` 的 `already_configured` 中止原因。请为此使用共享的字符串：

```json
{
  "config": {
    "abort": {
      "already_configured": "[%key:common::config_flow::abort::already_configured_device%]"
    }
  }
}
```

唯一 ID 还让用户能够忽略一个已被发现的设备，从而不再被询问该设备。这就是为什么发现功能需要一个唯一 ID。

### 即时更新连接信息

当局域网中的设备获得了新的 IP 地址时，唯一 ID 让您能够从发现步骤更新现有条目。将新值传递给 `_abort_if_unique_id_configured`。如果数据发生了变化，Home Assistant 会更新该条目并重新加载它：

```python
await self.async_set_unique_id(serial_number)
self._abort_if_unique_id_configured(updates={CONF_HOST: host})
```

只有当条目已加载或正在等待重试其设置时才会发生重新加载。传入 `reload_on_update=False` 可以在不重新加载的情况下更新条目。即使没有变化，发现功能也会重新加载一个正在等待重试设置的条目：该设备显然又重新上线了。

### 什么样的唯一 ID 才是好的

它必须是一个字符串、保持稳定，并且不是用户可以更改的内容。

- **好**：序列号、使用 `homeassistant.helpers.device_registry.format_mac` 格式化的 MAC 地址、印在设备上或烧录进设备中的唯一标识符，或经纬度。
- **对本地设备有时可以**：主机名，前提是其中一部分包含上述好的来源之一。
- **对云服务有时可以**：小写的电子邮件地址、用户名（如果用户名不区分大小写，则使用小写），或不会发生冲突的账户 ID。
- **绝不使用**：IP 地址、设备名称、URL，或用户可以更改的主机名。

从设备 API 或发现过程中获取 MAC 地址。读取 ARP 缓存的工具（例如 `getmac`）并不能在 Home Assistant 运行的每种网络环境中都正常工作。

### 没有唯一 ID 的发现

如果您的某些设备没有唯一 ID，请改为在发现步骤中调用此方法。这样，只要您的集成尚不存在任何条目，发现功能仍然可以工作：

```python
if device_unique_id:
    await self.async_set_unique_id(device_unique_id)
else:
    await self._async_handle_discovery_without_unique_id()
```

如果您始终无法获得唯一 ID，请省略发现步骤。这样，只要您的集成还没有配置条目，Home Assistant 在发现设备时就会调用您的 `user` 步骤。

## 发现步骤

发现步骤会接收一个包含所发现内容的服务信息对象，例如 `ZeroconfServiceInfo`。它必须：

- 确保没有其他流程正在设置同一设备。设置唯一 ID 通常就能做到这一点。当同一设备可以通过多种方式被发现、而这些方式会给出不同的唯一 ID 时，请在您的流程上实现 `is_matching(self, other_flow)`，并调用 `self.hass.config_entries.flow.async_has_matching_flow(self)`。这样 Home Assistant 会对每一个正在进行中的其他流程调用 `is_matching`。
- 确保设备尚未被设置。
- 始终要求用户确认。发现步骤绝不能自行创建条目。

```python
async def async_step_zeroconf(
    self, discovery_info: ZeroconfServiceInfo
) -> ConfigFlowResult:
    """Handle a discovered device."""
    serial_number = discovery_info.properties["serialno"]
    await self.async_set_unique_id(serial_number)
    self._abort_if_unique_id_configured(
        updates={CONF_HOST: discovery_info.host}
    )

    self._host = discovery_info.host
    self.context["title_placeholders"] = {"name": serial_number}

    return await self.async_step_discovery_confirm()


async def async_step_discovery_confirm(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Ask the user to confirm the discovered device."""
    if user_input is not None:
        return self.async_create_entry(
            title=self.unique_id, data={CONF_HOST: self._host}
        )

    self._set_confirm_only()

    return self.async_show_form(step_id="discovery_confirm")
```

`_set_confirm_only()` 告诉前端该步骤仅要求确认。关于设备最初是如何被发现的，请参见[发现](https://www.hasscn.top/contributors/core/integrations/discovery/)。

### 无需身份验证的可发现集成

如果您的集成是可发现的且无需身份验证，您可能根本不需要编写流程。当您回答设备是可发现的且无需身份验证时，`python3 -m script.scaffold integration` 会生成此流程。对于现有集成，请运行 `python3 -m script.scaffold config_flow_discovery`。该流程会在结束前检查是否能找到任何设备，支持清单文件中的每一种发现方法，并允许使用一个配置条目来管理所有设备。

生成的 `config_flow.py` 没有流程类。它会使用您的域、一个标题以及一个返回是否能找到任何设备的函数来调用 `config_entry_flow.register_discovery_flow()`。只有当用户手动添加集成、且没有已发现的设备正在等待被设置时，Home Assistant 才会调用该函数。

#### 在流程和设置中进行扫描

许多发现协议会等待超时，以收集所有应答的设备。而您的函数只需要知道是否至少有一台设备，随后 `async_setup_entry` 则必须找到所有设备。这看起来像是扫描了两次。核心中使用此辅助机制的集成接受了这一点，并将开销保持在较低水平：

- 该函数找到的任何内容都不会传递到设置中。辅助机制会以空的 `data` 创建条目，并在流程从发现功能启动时跳过该函数。设置还会在 Home Assistant 每次启动时运行。因此设置总是自行执行发现，只有第一次手动设置才会扫描两次。
- 只要有一台设备应答就立即返回，而不是等待完整的超时时间。Govee lights local 会轮询直到第一台设备出现（在超时范围内）。Deako 只请求一个地址。Fjäråskupan 则完全不扫描：它检查 Home Assistant 已经见过的蓝牙设备。
- 在设置中持续进行发现，并为稍后出现的设备添加实体（entity）。Gree、Refoss 和 Zerproc 使用 `async_track_time_interval()` 按间隔再次扫描。Govee lights local 和 Escea 保持监听器一直运行。晚些时候才应答的设备依然会被添加。

Escea 是唯一一个在两者之间共享工作的例外。它的函数会启动一个发现服务并将其存储在 `hass.data` 中，`async_setup_entry` 会使用正在运行的服务而不是再启动一个。当函数没有找到任何内容时，它会再次停止该服务。只有当您的库中有一个在条目加载期间一直运行的发现服务时，这种做法才有意义。

## 流程标题

流程在 UI 中显示的标题（例如被发现设备的名称）按以下顺序确定：

1. 如果流程在 `self.context` 中设置了 `title_placeholders`，并且它不为空：
   1. 如果您的翻译中有 `flow_title`，则使用该字符串，并填入占位符。
   2. 如果没有 `flow_title`，则使用 `name` 占位符（如果存在）。
2. 您的翻译中的 `title`。
3. 清单文件中的 `name`。
4. 域（domain）。

重新认证流程会自行将 `title_placeholders` 设置为 `{"name": <entry title>}`。

## 文本和翻译

流程的所有文本都存放在 `strings.json` 的 `config` 键下：标题、描述、字段标签、错误和中止原因。例如：

```json
{
  "config": {
    "step": {
      "user": {
        "data": {
          "host": "[%key:common::config_flow::data::host%]"
        },
        "data_description": {
          "host": "The hostname or IP address of your Example device."
        }
      }
    },
    "error": {
      "cannot_connect": "[%key:common::config_flow::error::cannot_connect%]"
    },
    "abort": {
      "already_configured": "[%key:common::config_flow::abort::already_configured_device%]"
    }
  }
}
```

在开发过程中，运行 `python3 -m script.translations develop` 可以在 UI 中查看对 `strings.json` 的更改。所有键请参见[翻译](https://www.hasscn.top/contributors/core/integrations/translations/#flows)，规则请参见[让您的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)，步骤的键请参见[表单、菜单和进度](https://www.hasscn.top/contributors/core/integrations/flow-steps/#labels-and-descriptions)。

## 在另一个流程中继续

一个流程可以启动另一个流程，并让前端在第一个流程完成后立即显示它。将 `next_flow` 连同下一个流程的类型和 ID 一起传递给 `async_create_entry`：

```python
from homeassistant.config_entries import SOURCE_USER, FlowType

result = await self.hass.config_entries.flow.async_init(
    "other_domain", context={"source": SOURCE_USER}
)

return self.async_create_entry(
    title="Example",
    data={},
    next_flow=(FlowType.CONFIG_FLOW, result["flow_id"]),
)
```

子条目流程和选项流程在启动之前需要配置条目已经存在。要继续其中一种流程，请重写 `async_on_create_entry`。它会在条目创建之后运行：

```python
from homeassistant.config_entries import SubentryFlowContext


async def async_on_create_entry(
    self, result: ConfigFlowResult
) -> ConfigFlowResult:
    """Start adding a location right after the entry is created."""
    subentry_result = await self.hass.config_entries.subentries.async_init(
        (result["result"].entry_id, "location"),
        context=SubentryFlowContext(source=SOURCE_USER),
    )
    result["next_flow"] = (
        FlowType.CONFIG_SUBENTRIES_FLOW,
        subentry_result["flow_id"],
    )

    return result
```

## 使用 SchemaConfigFlowHandler 的简单流程

对于辅助元素（helper）和其他具有简单流程的集成，`SchemaConfigFlowHandler` 将整个配置流程和选项流程定义为数据。请记住它的局限：

- 所有输入都存储在条目的 `options` 中，而不是 `data` 中。这使得它不适合用于连接信息或 API 密钥。
- 复杂的验证、唯一 ID 或重复检查通常在普通配置流程中更容易实现。
- 不建议使用 `user` 和 `import` 以外的步骤来启动流程。

```python
from homeassistant.helpers.schema_config_entry_flow import (
    SchemaCommonFlowHandler,
    SchemaConfigFlowHandler,
    SchemaFlowError,
    SchemaFlowFormStep,
)


async def validate_options(
    handler: SchemaCommonFlowHandler, user_input: dict[str, Any]
) -> dict[str, Any]:
    """Validate the options."""
    if user_input[CONF_THRESHOLD] < 0:
        # The error key must exist in strings.json
        raise SchemaFlowError("negative_threshold")

    return user_input


OPTIONS_SCHEMA = probatio.Schema(
    {probatio.Required(CONF_THRESHOLD): NumberSelector()}
)

CONFIG_FLOW = {
    "user": SchemaFlowFormStep(
        probatio.Schema({probatio.Required(CONF_NAME): TextSelector()}),
        next_step="options",
    ),
    "options": SchemaFlowFormStep(
        OPTIONS_SCHEMA, validate_user_input=validate_options
    ),
}

OPTIONS_FLOW = {
    "init": SchemaFlowFormStep(
        OPTIONS_SCHEMA, validate_user_input=validate_options
    ),
}


class ExampleConfigFlowHandler(SchemaConfigFlowHandler, domain=DOMAIN):
    """Handle a config flow for Example."""

    config_flow = CONFIG_FLOW
    options_flow = OPTIONS_FLOW
    # Reload the entry when the options change
    options_flow_reloads = True

    def async_config_entry_title(self, options: Mapping[str, Any]) -> str:
        """Return the title of the config entry."""
        return cast(str, options[CONF_NAME])
```

## 测试您的配置流程

核心中的集成需要对 `config_flow.py` 有完整的测试覆盖率。测试每一条路径：成功、每个错误、每次中止，以及同一设备被第二次设置时会中止。请参见[编写测试](https://www.hasscn.top/contributors/core/development/tests/)。
