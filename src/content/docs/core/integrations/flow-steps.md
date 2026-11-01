---
title: 表单、菜单与进度
description: 配置流程、选项流程和修复流程的构建基石，涵盖从表单和分区到菜单、外部步骤和进度。
sidebarLabel: Forms, menus, and progress
sidebarGroup: Setup and configuration
order: 3
---

配置流程（config flow）、[选项流程（options flow）](/core/integrations/options-flow/)、[子条目流程（subentry flow）](/core/integrations/subentries/)和[修复流程（repair flow）](/core/integrations/repairs/)都建立在同一个框架之上：数据输入流程（data entry flow），位于 `homeassistant.data_entry_flow` 中。流程由一系列步骤组成。每个步骤都会返回本页所述结果中的一种，该结果决定了用户接下来看到的内容。

| 结果 | 方法 | 用户看到的内容 |
| --- | --- | --- |
| 表单 | `async_show_form` | 一个待填写的表单 |
| 菜单 | `async_show_menu` | 可供选择的后续步骤列表 |
| 创建条目 | `async_create_entry` | 成功。流程已完成。 |
| 中止 | `async_abort` | 说明流程为何停止的消息 |
| 外部步骤 | `async_external_step` | 在另一个网站上完成操作的链接 |
| 进度 | `async_show_progress` | 长任务运行时显示的加载动画 |

## 显示表单

表单包含一个步骤 ID、一个 schema，以及可选的错误信息。字段按照 schema 中的顺序显示。用户提交有效数据后，步骤方法会带着输入内容被再次调用。

```python
async def async_step_user(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Ask for the login details."""
    errors: dict[str, str] = {}

    if user_input is not None:
        try:
            await validate_login(self.hass, user_input)
        except InvalidAuth:
            errors["base"] = "invalid_auth"
        else:
            return self.async_create_entry(
                title=user_input[CONF_USERNAME], data=user_input
            )

    return self.async_show_form(
        step_id="user",
        data_schema=probatio.Schema(
            {
                probatio.Required(CONF_USERNAME): str,
                probatio.Required(CONF_PASSWORD): str,
            }
        ),
        errors=errors,
    )
```

### 校验与错误

您的步骤只会收到通过 schema 校验的输入。其他任何事情，比如检查密码是否有效，都由您自行处理。再次返回表单并附带一个 `errors` 字典：其键为出问题的字段，如果错误与单个字段无关，则使用 `base`。其值是您翻译文件中 `error` 部分的一个键。

### 多个步骤

要进入下一步，请返回该步骤的结果。将之前步骤中需要保留的数据保存在流程对象上：

```python
if user_input is not None:
    self._host = user_input[CONF_HOST]
    return await self.async_step_credentials()
```

向 `async_show_form` 传递 `last_step=False`，即可显示**下一步**而不是**提交**。

### 分区

使用 `section` 将字段分组到可折叠的分区（section）中。分区会改变表单的外观以及输入的结构：一个分区中的字段会以嵌套字典的形式传入。分区不能嵌套。

```python
from homeassistant.data_entry_flow import section

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_HOST): str,
        probatio.Required("ssl_options"): section(
            probatio.Schema(
                {
                    probatio.Required(CONF_SSL, default=True): bool,
                    probatio.Required(CONF_VERIFY_SSL, default=True): bool,
                }
            ),
            # Show the section collapsed. The default is False.
            {"collapsed": True},
        ),
    }
)
```

该表单的输入类似于 `{"host": "...", "ssl_options": {"ssl": True, "verify_ssl": False}}`。分区可以拥有图标，定义在 `icons.json` 中：

```json
{
  "config": {
    "step": {
      "user": {
        "sections": {
          "ssl_options": "mdi:lock"
        }
      }
    }
  }
}
```

### 标签与描述

表单的文本位于 `strings.json` 中，放在对应步骤 ID 之下：

| 键 | 含义 |
| --- | --- |
| `title` | 表单的标题。不要包含品牌名称：Home Assistant 会从 manifest 中自动添加。 |
| `description` | 操作说明。可选。不要链接到文档（会自动添加链接），也不要说显而易见的话，比如“在这里您可以设置 X”。 |
| `data` | 字段的标签。保持简短，并与其他集成保持一致。 |
| `data_description` | 显示在每个字段下方的说明 |
| `sections` | 每个分区：一个 `name`、一个 `description`，以及其字段的 `data` 和 `data_description` |

```json
{
  "config": {
    "step": {
      "user": {
        "description": "Enter the details of your Example hub.",
        "data": {
          "host": "[%key:common::config_flow::data::host%]"
        },
        "data_description": {
          "host": "The hostname or IP address of your hub."
        },
        "sections": {
          "ssl_options": {
            "name": "Security options",
            "data": {
              "verify_ssl": "Verify the SSL certificate"
            }
          }
        }
      }
    }
  }
}
```

有关良好字符串的规则，请参阅[让您的字符串可翻译](/translate/guides/developers/)。

### 默认值与建议值

预填充字段有两种方式：

- `default` 会填充该字段，并且当用户将其留空时也会使用该值。
- 建议值（suggested value）会填充该字段，但用户仍然可以将其清除。

```python
probatio.Optional(CONF_PORT, default=80): int
probatio.Optional(
    CONF_NAME, description={"suggested_value": "Living room"}
): str
```

`add_suggested_values_to_schema` 会用您已有的值填充静态 schema，这非常适合选项流程：

```python
return self.async_show_form(
    step_id="init",
    data_schema=self.add_suggested_values_to_schema(
        OPTIONS_SCHEMA, self.config_entry.options
    ),
)
```

使用 `probatio.In(...)` 构建且未指定 `default` 的选择字段会默认选中其第一个选项。

### 只读字段

有些设置在完成设置后无法更改。您仍然可以在选项流程中显示它们，让用户记得自己选择了什么：添加该字段时使用带有 `read_only=True` 的选择器。

```python
probatio.Optional(CONF_ENTITY_ID): EntitySelector(
    EntitySelectorConfig(read_only=True)
)
```

### 浏览器自动填充

帮助浏览器和密码管理器填充您的表单。前端会自行为名为 `username` 和 `password` 的字段添加正确的 `autocomplete` 属性。对于其他字段，请使用带有 `autocomplete` 的文本选择器：

```python
probatio.Required(CONF_USERNAME): TextSelector(
    TextSelectorConfig(type=TextSelectorType.EMAIL, autocomplete="username")
),
probatio.Required(CONF_PASSWORD): TextSelector(
    TextSelectorConfig(
        type=TextSelectorType.PASSWORD, autocomplete="current-password"
    )
),
```

### 依赖于其他字段的选项

有些选择器会根据同一表单中另一个字段的值来缩小其选项范围。它们在配置中接受一个 `context`，该配置将上下文键映射到提供其值的字段名称。例如，计量单位选择器支持 `filter_device_class` 和 `filter_state_class`。它们指向使用设备类别（device class）或状态类别（state class）选择器的字段。选择器配置会拒绝它不认识的上下文键，并且您不能将 `filter_device_class` 与 `device_classes` 组合使用，也不能将 `filter_state_class` 与 `state_classes` 组合使用：

```python
probatio.Optional(CONF_UNIT_OF_MEASUREMENT): UnitOfMeasurementSelector(
    UnitOfMeasurementSelectorConfig(
        context={
            "filter_device_class": CONF_DEVICE_CLASS,
            "filter_state_class": CONF_STATE_CLASS,
        }
    )
)
```

上下文只会改变前端提供的选项。选择器不会对照其他字段检查提交的值，因此您的步骤仍然需要检查该组合是否合理。

### 根据其他字段显示的字段

一个字段可以仅在同一步骤的其他字段具有特定值时显示。这样可以省去额外的步骤，或在提交后再次显示表单，仅仅为了显示或隐藏几个字段。使用 `homeassistant.data_entry_flow` 中的 `Required` 和 `Optional` 标记，并为它们赋予 `visible` 条件：

```python
from homeassistant import data_entry_flow
from homeassistant.helpers.selector import BooleanSelector

DATA_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_HOST): str,
        probatio.Required(CONF_SSL, default=False): BooleanSelector(),
        data_entry_flow.Required(
            CONF_VERIFY_SSL,
            default=True,
            visible={"field": CONF_SSL, "value": True},
        ): BooleanSelector(),
    }
)
```

**验证 SSL 证书**复选框仅在勾选**使用 SSL**时显示。条件会比较同一步骤中另一个字段的值。`operator` 键选择比较方式，而 `exists` 和 `not_exists` 不需要 `value`：

| 运算符 | 当字段满足以下条件时匹配 |
| --- | --- |
| `eq`（默认） | 等于 `value` |
| `not_eq` | 不等于 `value` |
| `in` | 是 `value` 列表中的值之一 |
| `not_in` | 不是 `value` 列表中的任何值 |
| `exists` | 有值：不缺失、不是 `None`，也不是空字符串 |
| `not_exists` | 没有值 |

`visible` 也可以接受一个条件列表，所有条件都必须匹配，或者直接使用 `True` 或 `False`。

隐藏的字段不会显示、不是必填项，并且会被排除在 `user_input` 之外，默认值也包括在内。对于其他字段的条件，它被视为空值。提交的输入中缺失的字段会以其默认值进行评估，而以空值提交的字段则保留该值。

由于隐藏字段被排除在 `user_input` 之外，它可能不会出现在您存储的数据中。请使用 `.get()` 并提供一个回退值来读取它，例如 `entry.data.get(CONF_VERIFY_SSL, True)`。

在[分区](#sections)内部，条件会查看该分区的字段。要隐藏整个分区，请将 `visible` 放在分区的标记上：

```python
data_entry_flow.Required(
    "ssl_options",
    visible={"field": CONF_SSL, "value": True},
): section(
    probatio.Schema(
        {
            probatio.Required(CONF_VERIFY_SSL, default=True): BooleanSelector(),
            probatio.Optional("ca_cert"): str,
        }
    ),
),
```

### 高级选项

`show_advanced_options` 属性已被弃用，并将在 Home Assistant 2027.6 中移除。在此之前它始终返回 `True`。请改为将大多数用户不需要的选项放入一个折叠的[分区](#sections)中。

## 创建条目

`async_create_entry` 会结束流程。在配置流程中，它会根据标题和 `data`（以及可选的 `options`）创建配置条目（config entry）：

```python
return self.async_create_entry(
    title="Office hub",
    data={CONF_HOST: host, CONF_TOKEN: token},
    options={CONF_SHOW_GUESTS: False},
)
```

两者都必须可被 JSON 序列化。将连接所需的信息放在 `data` 中，将用户可以调整的设置放在 `options` 中。更改凭据属于[重新认证（reauthentication）](/core/integrations/reauth-reconfigure/)，它会更新 `data`。

## 中止

当流程无法完成时，请附带原因中止它。用户会看到您翻译文件中 `abort` 部分里与之匹配的文本：

```python
return self.async_abort(reason="not_supported")
```

## 显示菜单

菜单让用户选择下一步。每个选项都是一个步骤 ID：

```python
return self.async_show_menu(
    step_id="user",
    menu_options=["discovery", "manual"],
    description_placeholders={"model": "Example model"},
)
```

标签来自您翻译文件中的 `menu_options`，可选的描述来自 `menu_option_descriptions`。您也可以传递一个由步骤 ID 和标签组成的字典来代替列表。传递 `sort=True` 可以按用户的语言根据标签对选项排序。

```json
{
  "config": {
    "step": {
      "user": {
        "menu_options": {
          "discovery": "Search the network",
          "manual": "Enter the address of the {model}"
        },
        "menu_option_descriptions": {
          "discovery": "Find hubs on your network automatically."
        }
      }
    }
  }
}
```

## 外部步骤

有时用户必须在另一个网站上完成某些操作，比如登录。对于 OAuth 2.0，请使用 [OAuth 2.0 辅助工具（helper）](/core/integrations/oauth2/)，它会为您完成所有这些工作。对于其他情况：

1. 该步骤返回 `async_external_step` 以及要打开的 URL。请在其中包含流程 ID，以便结果能够传回。
2. 用户在另一个网站上完成操作，该网站会将用户的浏览器重定向到您的集成在 Home Assistant 中的一个端点。
3. 该端点调用 `hass.config_entries.flow.async_configure(flow_id, data)` 并返回 `<script>window.close()</script>` 来关闭窗口。
4. 该步骤会带着数据被再次调用，并返回 `async_external_step_done` 以及下一步。

```python
async def async_step_user(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Send the user to the external website."""
    if not user_input:
        return self.async_external_step(
            step_id="user",
            url=f"https://example.com/link?flow_id={self.flow_id}",
        )

    self._data = user_input

    return self.async_external_step_done(next_step_id="finish")
```

请在下一步中使用返回的数据进行处理，不要在端点中处理，也不要在将步骤标记为完成之前处理。这样用户会在任务运行时看到加载动画，而不是空白窗口或过时的表单。

## 显示进度

对于需要一段时间的步骤（比如固件检查），请在一个任务中运行该工作并显示进度，直到完成：

```python
async def async_step_user(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Wait for the device to pair."""
    if not self._pair_task:
        self._pair_task = self.hass.async_create_task(self._async_pair())

    if not self._pair_task.done():
        return self.async_show_progress(
            step_id="user",
            progress_action="pairing",
            progress_task=self._pair_task,
        )

    return self.async_show_progress_done(next_step_id="finish")
```

当任务完成时，Home Assistant 会再次调用该步骤，但它也可能更早调用，例如在前端重新加载时。因此，绝不要启动第二个任务：请先检查是否已存在任务。`progress_action` 是您翻译文件中 `progress` 部分文本的键。要显示任务的进行程度，请调用 `self.async_update_progress(0.5)`，传入一个介于 0 和 1 之间的值。

## 从代码启动流程

集成和发现（discovery）会通过在上下文中携带来源（source）来启动流程。之后流程将从以该来源命名的步骤开始，而不是从 `user` 开始：

```python
await hass.config_entries.flow.async_init(
    DOMAIN, context={"source": SOURCE_IMPORT}, data=config
)
```

流程可以通过 `self.source` 检查它的来源。要为发现的设备启动流程，请改用[发现流程辅助工具](/core/integrations/discovery/#discovery-by-another-integration)。
