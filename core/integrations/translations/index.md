# 集成翻译

> 集成的 strings.json 的各个章节、引用与占位符的工作方式，以及自定义集成如何提供自己的翻译。

Source: https://www.hasscn.top/contributors/core/integrations/translations/

集成展示给用户的每一段文本都存放在你集成文件夹中的 `strings.json` 里。代码中从不包含面向用户的文本：代码只引用一个键，由 Home Assistant 以用户的语言查找相应的文本。这涵盖了配置流程（config flow）、实体（entity）名称与状态（state）、错误、修复（repair）问题、动作（action）等等。

`strings.json` 存放英文源文本。在你的 pull request 合并后，英文字符串会被上传到 [Lokalise](https://www.hasscn.top/contributors/glossary/lokalise/)，由翻译人员进行翻译，翻译结果再被拉回到 core 中。你无需为此做任何事情。整个流程请参阅[翻译是如何工作的](https://www.hasscn.top/contributors/translate/how-it-works/)，如何编写便于翻译人员处理的字符串请参阅[让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)。

本页面是该文件本身的参考：有哪些章节，以及每个章节中应放入什么内容。文件结构由 hassfest（core 中的 [`script/hassfest/translations.py`](https://github.com/home-assistant/core/blob/dev/script/hassfest/translations.py)）检查，因此当本页面与 hassfest 不一致时，以 hassfest 为准。

## 查看你的更改

Home Assistant 不会直接读取 `strings.json`。它读取的是集成 `translations` 文件夹中编译后的文件，这些文件是生成的，不会被提交。编译你的字符串即可在 UI 中看到它们：

```shell
python3 -m script.translations develop --integration example
```

省略 `--integration` 则会提示你选择一个集成，或者使用 `--all` 处理所有集成。如果更改没有显示，请重启 Home Assistant 并清除浏览器的缓存。

## 各章节

所有章节都是可选的。添加你的集成所需要的章节即可。

| 章节 | 翻译的内容 |
| --- | --- |
| `title` | 集成的名称，仅当它不是品牌名称时使用 |
| `common` | 你的集成在多处复用的字符串 |
| `config` | [配置流程](https://www.hasscn.top/contributors/core/integrations/config-flow/) |
| `options` | [选项流程](https://www.hasscn.top/contributors/core/integrations/options-flow/) |
| `config_subentries` | [子条目（subentry）](https://www.hasscn.top/contributors/core/integrations/subentries/)的流程 |
| `selector` | 流程、动作、触发器和条件中选择器（selector）的选项和标签 |
| `entity` | 你的实体的名称、状态、状态属性和单位 |
| `entity_component` | 实体域（entity domain）的状态和属性，适用于本身就是实体域的集成，例如 `sensor` |
| `device` | 你的设备的名称 |
| `exceptions` | 你抛出的异常的消息 |
| `issues` | [修复](https://www.hasscn.top/contributors/core/integrations/repairs/)问题及其修复流程 |
| `services` | 你的[动作](https://www.hasscn.top/contributors/core/integrations/actions/)及其字段的名称和描述 |
| `triggers` | 你的[触发器（trigger）](https://www.hasscn.top/contributors/core/integrations/triggers-and-conditions/)的名称和描述 |
| `conditions` | 你的[条件（condition）](https://www.hasscn.top/contributors/core/integrations/triggers-and-conditions/)的名称和描述 |
| `device_automation` | [设备触发器、条件和动作](https://www.hasscn.top/contributors/core/integrations/device-automations/) |
| `system_health` | [系统健康（system health）](https://www.hasscn.top/contributors/core/integrations/system-health/)页面上的标签 |
| `application_credentials` | [应用凭证（application credentials）](https://www.hasscn.top/contributors/core/integrations/oauth2/#help-users-create-credentials)对话框中的说明 |
| `preview_features` | [Labs](https://www.hasscn.top/contributors/core/development/labs/) 预览功能 |

还有一些针对特定集成的章节：`config_panel` 用于自带配置面板的集成，例如 ZHA 和 KNX；`conversation` 用于 conversation 集成。`auth`、`onboarding` 和 `homeassistant_hardware` 集成各自拥有自己的模式（schema）。

## 标题

你的集成的名称来自[清单（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/)，在绝大多数情况下它是一个品牌名称。品牌名称不会被翻译，因此请省略 `title`。

仅当名称是描述性文字而不是品牌时才添加 `title`，例如“Local calendar”。对于 core 集成，hassfest 会拒绝与 manifest 中名称相同的 `title`，除非该集成在其允许列表中。

## 流程

`config`、`options` 以及 `config_subentries` 下的每种类型都共用一种格式：

```json
{
  "config": {
    "flow_title": "{name} ({host})",
    "step": {
      "user": {
        "title": "Connect to your hub",
        "description": "Enter the address of your Example hub.",
        "data": {
          "host": "[%key:common::config_flow::data::host%]"
        },
        "data_description": {
          "host": "The hostname or IP address of your hub."
        }
      }
    },
    "error": {
      "cannot_connect": "[%key:common::config_flow::error::cannot_connect%]"
    },
    "abort": {
      "no_devices_found": "[%key:common::config_flow::abort::no_devices_found%]"
    }
  }
}
```

| 键 | 含义 |
| --- | --- |
| `flow_title` | 发现的设备列表中显示的流程标题。请参阅[流程标题](https://www.hasscn.top/contributors/core/integrations/config-flow/#the-flow-title)。 |
| `step` | 每个步骤 ID：`title`、`description`、`data`、`data_description`、`sections`、`menu_options`、`menu_option_descriptions`，以及 `submit`（提交按钮的标签） |
| `error` | 表单上显示的错误，以你返回的错误为键 |
| `abort` | 流程中止的原因。支持 Markdown。 |
| `progress` | 进度步骤的消息，以 `progress_action` 为键 |
| `create_entry` | 创建条目时显示的消息。未传入描述时使用 `default`。 |
| `initiate_flow` | 启动流程的按钮的标签。添加它时 `user` 为必填。 |

`data_description` 中的每个键都需要在 `data` 中有对应的键。步骤的各个键在[表单、菜单和进度](https://www.hasscn.top/contributors/core/integrations/flow-steps/#labels-and-descriptions)中说明。

子条目类型还需要 `entry_type` 和 `initiate_flow`。请参阅[子条目](https://www.hasscn.top/contributors/core/integrations/subentries/#texts-and-translations)。辅助元素（helper）集成必须为其 `user` 步骤提供 `description`。

## 选择器

流程、动作、触发器或条件中的选择器通过其配置中的 `translation_key` 获得自己的文本。这些文本放在 `selector` 下面，以该翻译键（translation key）为键：

```json
{
  "selector": {
    "fan_speed": {
      "options": {
        "off": "[%key:common::state::off%]",
        "low": "Low",
        "high": "High"
      }
    }
  }
}
```

```python
SelectSelector(
    SelectSelectorConfig(
        options=["off", "low", "high"],
        translation_key="fan_speed",
    )
)
```

哪些键适用取决于选择器的类型：

- `options`：select 选择器的选项
- `unit_of_measurement`：number 选择器的单位
- `choices`：choose 选择器的选项
- `fields`：object 选择器的字段，每个字段都有一个 `name`、一个可选的 `description` 和一个可选的 `overview_label`

object 选择器会把你添加的条目以列表形式展示，并列出其各字段的值。字段的 `overview_label` 用于设置其值在该列表中显示的文本。它必须包含 `{value}` 占位符（placeholder），且不能包含其他占位符。前端会填入该字段格式化后的值，因此你的代码无需传递任何内容。如果没有 `overview_label`，列表则只显示该值。

```json
{
  "selector": {
    "sensor_offsets": {
      "fields": {
        "uncompensated": {
          "name": "Uncompensated value",
          "description": "The value before the offset is applied.",
          "overview_label": "Uncompensated value: {value}"
        }
      }
    }
  }
}
```

## 实体

`entity` 章节翻译你的实体，先以实体域为键，再以实体的[翻译键](https://www.hasscn.top/contributors/glossary/translation-key/)为键：

```json
{
  "entity": {
    "sensor": {
      "operating_mode": {
        "name": "Operating mode",
        "state": {
          "eco": "Eco",
          "boost": "Boost"
        },
        "state_attributes": {
          "fan_mode": {
            "name": "Fan mode",
            "state": {
              "quiet": "Quiet"
            }
          }
        }
      },
      "goal": {
        "name": "Goal",
        "unit_of_measurement": "steps"
      }
    }
  }
}
```

- `name`：实体的名称。请参阅[翻译后的名称](https://www.hasscn.top/contributors/core/entities/naming/#translated-names)，包括名称中的占位符。
- `state`：每个状态的文本。状态是小写的键，例如 `eco`，绝不是文本。示例请参阅 [select](https://www.hasscn.top/contributors/core/entities/select/) 实体。
- `state_attributes`：属性的名称及其状态。
- `unit_of_measurement`：以单词表示的单位，例如“steps”。带有翻译单位的实体不会设置 `native_unit_of_measurement`。请参阅 [sensor](https://www.hasscn.top/contributors/core/entities/sensor/)。

状态、状态属性和单位不能包含占位符。图标使用相同的翻译键，位于 `icons.json` 中。请参阅[图标](https://www.hasscn.top/contributors/core/entities/icons/)。

实体翻译是质量等级（quality scale）金牌（Gold）级的一项规则：请参阅[实体翻译](https://www.hasscn.top/contributors/core/quality-scale/entity-translations/)。

## 实体组件

本身就是实体域的集成（例如 `sensor` 或 `binary_sensor`）在 `entity_component` 下翻译其状态和属性，以设备类别（device class）为键。键 `_` 用于没有设备类别的实体：

```json
{
  "entity_component": {
    "_": {
      "name": "Binary sensor",
      "state": {
        "off": "[%key:common::state::off%]",
        "on": "[%key:common::state::on%]"
      }
    },
    "door": {
      "name": "Door",
      "state": {
        "off": "[%key:common::state::closed%]",
        "on": "[%key:common::state::open%]"
      }
    }
  }
}
```

每个设备类别都可以有 `name`、`state` 和 `state_attributes`，其结构与 `entity` 下相同。其他集成通过引用（reference）来复用这些字符串，例如 `[%key:component::sensor::entity_component::temperature::name%]`。

## 设备

`device` 章节翻译设备名称，以你在设备信息（device info）中传入的翻译键为键：

```json
{
  "device": {
    "power_strip": {
      "name": "Power strip with {socket_count} sockets"
    }
  }
}
```

有了翻译键后，设备信息中的 `name` 会被忽略。如果该键没有翻译，翻译键本身就会成为名称。使用 `translation_placeholders` 填充占位符。请参阅[设备注册表（device registry）](https://www.hasscn.top/contributors/core/integrations/device-registry/)。

## 异常

继承自 `HomeAssistantError` 的异常接受 `translation_domain`、`translation_key` 和 `translation_placeholders`。它们的消息放在 `exceptions` 下面：

```json
{
  "exceptions": {
    "cannot_connect": {
      "message": "Could not connect to {host}."
    }
  }
}
```

请参阅[设置失败与异常](https://www.hasscn.top/contributors/core/integrations/setup-failures/)了解在哪里抛出异常，以及质量等级中的[异常翻译](https://www.hasscn.top/contributors/core/quality-scale/exception-translations/)规则。

## 问题

修复问题放在 `issues` 下面，以该问题的翻译键为键。每个问题都有一个 `title`、一个可选的 `short_title`，以及 `description` 或 `fix_flow` 之一，绝不能两者兼有。`fix_flow` 的格式与[流程](https://www.hasscn.top/contributors/core/integrations/translations/#flows)相同。请参阅[修复](https://www.hasscn.top/contributors/core/integrations/repairs/)。

## 动作

你的动作的名称和描述放在 `services` 下面：

```json
{
  "services": {
    "set_speed": {
      "name": "Set speed",
      "description": "Sets the speed of the fan.",
      "fields": {
        "speed": {
          "name": "Speed",
          "description": "The speed to set."
        }
      },
      "sections": {
        "advanced": {
          "name": "Advanced options"
        }
      }
    }
  }
}
```

每个动作都需要一个 `name` 和一个 `description`，每个字段都需要一个 `name`。字段还可以有一个 `example`。可折叠章节内的字段仍然放在 `fields` 下面；`sections` 只为章节命名。请参阅[动作](https://www.hasscn.top/contributors/core/integrations/actions/#names-and-descriptions)。

## 触发器和条件

`triggers` 和 `conditions` 的工作方式与 `services` 类似：每个触发器或条件有一个 `name`、一个 `description`，以及包含 `name`、可选 `description` 和可选 `example` 的 `fields`。它们没有 `sections`。关于如何命名，请参阅[触发器和条件](https://www.hasscn.top/contributors/core/integrations/triggers-and-conditions/)。

## 设备自动化

设备触发器、条件和动作放在 `device_automation` 下面，分为 `trigger_type`、`trigger_subtype`、`condition_type` 和 `action_type`。设备自动化的额外字段在 `extra_fields` 中获得标签，在 `extra_fields_descriptions` 中获得描述。请参阅[设备自动化](https://www.hasscn.top/contributors/core/integrations/device-automations/#texts)。

## 其他章节

- `system_health`：你的系统健康信息的标签，放在 `info` 下面。请参阅[系统健康](https://www.hasscn.top/contributors/core/integrations/system-health/#texts)。
- `application_credentials`：用户输入凭证的对话框的 `description`。请参阅 [OAuth 2.0](https://www.hasscn.top/contributors/core/integrations/oauth2/#help-users-create-credentials)。
- `preview_features`：每个功能有一个 `name` 和 `description`，外加可选的 `enable_confirmation` 和 `disable_confirmation`。描述可以包含链接，但不能包含占位符。请参阅 [Labs](https://www.hasscn.top/contributors/core/development/labs/)。

## 引用

很多字符串已经存在，例如“Failed to connect”或“Device is already configured”。不要重复编写它们：使用引用指向它们，写法为 `[%key:<path>%]`。这样翻译人员只需翻译一次该字符串，即可覆盖所有使用它的集成。

路径的各部分之间使用 `::` 分隔：

- `common::...` 指向 core 中 [`homeassistant/strings.json`](https://github.com/home-assistant/core/blob/dev/homeassistant/strings.json) 里的共享字符串，例如 `[%key:common::config_flow::data::host%]`。
- `component::<domain>::...` 指向任何集成，包括你自己的集成，例如 `[%key:component::example::config::step::user::title%]`。

对于多次使用的字符串，把它们放在你自己的 `common` 章节中，并用 `[%key:component::example::common::<key>%]` 引用它们。

引用必须是完整的字符串：`"Error: [%key:common::...%]"` 会被拒绝。引用也不能指向本身是引用的字符串，因为 Lokalise 只支持一层。请改为指向原始字符串。编译步骤会将引用替换为文本，因此 Home Assistant 读取的文件中只包含纯字符串。

## 占位符

只有在运行时才能确定的值，例如主机名或数量，要放在占位符中：`"Could not connect to {host}."`。你的代码负责填充它们：

| 位置 | 如何传递 |
| --- | --- |
| 流程步骤 | `async_show_form`、`async_show_menu`、`async_abort` 和 `async_create_entry` 上的 `description_placeholders` |
| 流程标题 | `self.context` 中的 `title_placeholders` |
| 实体和设备 | `translation_placeholders` |
| 异常和修复问题 | `translation_placeholders` |
| 动作 | 注册动作时的 `description_placeholders` |

Hassfest 会检查每个字符串：

- 占位符名称必须是有效的 Python 标识符，例如 `{host_name}`。
- 占位符不能用单引号包裹，例如 `'{name}'`。
- 字符串不能包含 HTML，开头和结尾也不能有空格。
- 字符串不能包含 URL。应将 URL 放在占位符中，这样链接变更时无需新的翻译。
- 翻译键由小写字母、数字、`-` 和 `_` 组成。不能以 `-` 或 `_` 开头或结尾，也不能连续出现两个。

在运行时，缺少某个键的翻译会回退到英文。占位符与英文字符串不一致的翻译会被丢弃，改用英文字符串。

## 自定义集成

自定义集成不使用 `strings.json`，也不会在 Lokalise 上被翻译。将 `strings.json` 转换为翻译文件的编译步骤只在 core 中运行。自定义集成需要自行提供编译完成的文件，放在其 `translations` 文件夹中：

```text
custom_components/example/
├── __init__.py
├── manifest.json
└── translations/
    ├── en.json
    └── nl.json
```

每个文件都以 [BCP 47](https://www.rfc-editor.org/info/bcp47) 语言代码命名，其结构与 `strings.json` 相同。`en.json` 是必需的，并且必须完整，因为它是所有其他语言的回退。

引用在翻译文件中不起作用：没有任何东西会替换它们，用户会看到原始的 `[%key:...%]` 文本。请完整写出每一个字符串。占位符则照常工作。

Hassfest 也会校验自定义集成的 `translations/en.json`。你可以在自己的仓库中使用 [hassfest GitHub Action](https://github.com/home-assistant/actions#hassfest) 来运行它。

## 与谁交流

Questions about `strings.json` or a hassfest error? Start a thread in [**#coding-support**](https://discord.com/channels/330944238910963714/1257019582112334014) on the [Home Assistant Discord](https://www.home-assistant.io/join-chat/). For questions about translating itself, see the [Translate](https://www.hasscn.top/contributors/translate/) area.
