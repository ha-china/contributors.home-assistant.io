---
title: 集成中的动作
description: 注册用户可从自动化、脚本和仪表盘中调用的动作，在 services.yaml 中描述这些动作，并返回响应数据。
sidebarGroup: Integration features
order: 1
sidebarLabel: Actions
---

动作（action）是用户可以从自动化（automation）、脚本或开发者工具的**动作**标签页中调用的内容，例如 `light.turn_on`。实体（entity）集成（如 `light`）提供了常见的动作。您的集成可以注册自己的动作，用于特定于该集成的事项，例如 `sonos.set_sleep_timer`。

本页面介绍如何向您的集成添加动作。动作注册表底层的工作原理、处理函数（handler）会接收到什么，以及如何在代码中调用动作，请参见[核心工作原理：动作](/core/internals/actions/)。

请先为您自己的集成添加动作，而不是修改共享的动作。当某种模式出现在多个集成中时，它以后可以成为共享动作。

> [!NOTE]
> 在代码中，动作仍然被称为服务（service）：`hass.services`、`ServiceCall` 和 `services.yaml`。它们是同一回事。

## 在 async_setup 中注册动作

请在您集成的 `async_setup` 中注册动作，不要在 `async_setup_entry` 中注册，也不要在平台中注册。这样，即使没有加载任何配置条目（config entry），这些动作也存在，因此使用它们的自动化可以被编辑和验证，用户也会得到明确的错误提示，而不是未知动作。这是[质量等级](/core/quality-scale/)中铜级（Bronze）的一项规则。

将注册代码放在 `services.py` 中，放在名为 `async_setup_services` 的函数里，并从 `async_setup` 调用该函数。它是一个同步函数，用 `@callback` 装饰，只接收 `hass`。Pylint 会警告在 `services.py` 之外注册的动作（`home-assistant-action-registered-outside-services-module`），以及形状不同的 `async_setup_services`（`home-assistant-invalid-setup-services`）。

由于您的集成现在有了 `async_setup`，它需要一个 `CONFIG_SCHEMA`。参见[无 YAML 的集成](/core/integrations/yaml/#integrations-without-yaml)。

## 选择正确的目标

请在正确的层级上定位动作所作用的对象。不要使用更高或更低的层级，即使其中一个可以解析为另一个。

- **实体**：动作控制或需要特定的实体，例如在媒体播放器上设置睡眠定时器。注册一个[实体动作](#entity-actions)。
- **设备（device）**：动作需要将设备作为一个整体来操作，例如重启设备。使用 `device_id` 字段。不要用实体 ID 作为其设备的替代。
- **配置条目**：动作需要集成实例，例如在云服务的账户中创建内容。使用 `config_entry_id` 字段。不要用设备或实体 ID 作为其配置条目的替代。

当动作需要目标（target）时，请将其设为必填。不要回退到默认目标：今天运行正常的自动化，在用户添加第二台设备后会悄悄执行其他操作。

## 配置条目的动作

```python title="services.py"
import probatio

from homeassistant.const import ATTR_CONFIG_ENTRY_ID
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
    callback,
)
from homeassistant.helpers import config_validation as cv, service

from .const import DOMAIN

GET_FORECAST_SCHEMA = probatio.Schema(
    {
        probatio.Required(ATTR_CONFIG_ENTRY_ID): cv.string,
        probatio.Required("days"): cv.positive_int,
    }
)


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register the actions of the Example integration."""

    async def async_get_forecast(call: ServiceCall) -> ServiceResponse:
        """Return the forecast for the coming days."""
        entry: ExampleConfigEntry = service.async_get_config_entry(
            hass, DOMAIN, call.data[ATTR_CONFIG_ENTRY_ID]
        )
        forecast = await entry.runtime_data.client.get_forecast(
            call.data["days"]
        )

        return {"forecast": [day.as_dict() for day in forecast]}

    hass.services.async_register(
        DOMAIN,
        "get_forecast",
        async_get_forecast,
        schema=GET_FORECAST_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
```

```python title="__init__.py"
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .services import async_setup_services

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Example integration."""
    async_setup_services(hass)
    return True
```

`service.async_get_config_entry` 会检查配置条目是否存在、是否属于您的集成，以及是否已加载。如果不满足，它会抛出带有已翻译消息的 `ServiceValidationError`。对于设备目标，`service.async_get_device_and_config_entry(hass, DOMAIN, device_id)` 会对设备及其所属的配置条目执行相同的检查。

## 实体动作

实体动作在用户定位的实体上运行。用户可以按实体、设备、区域（area）、楼层（floor）或标签（label）来定位它们，Home Assistant 会将这些解析为您的实体。请使用 `async_register_platform_entity_service` 在您自己的域（如 `sonos`）下注册它们，而不是在实体域（如 `media_player`）下注册：

```python title="services.py"
import probatio

from homeassistant.components.media_player import (
    DOMAIN as MEDIA_PLAYER_DOMAIN,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv, service

from .const import DOMAIN


@callback
def async_setup_services(hass: HomeAssistant) -> None:
    """Register the actions of the Sonos integration."""
    service.async_register_platform_entity_service(
        hass,
        DOMAIN,
        "set_sleep_timer",
        entity_domain=MEDIA_PLAYER_DOMAIN,
        schema={probatio.Required("sleep_time"): cv.positive_int},
        func="set_sleep_timer",
    )
```

这会调用每个被定位实体的 `set_sleep_timer` 方法，并以 `sleep_time` 作为关键字参数。除了方法名之外，`func` 也可以是一个接收实体和 `ServiceCall` 的异步函数。模式（schema）可以是一个字典，系统会自动将其转换为实体动作模式。若只想允许具有某些功能的实体，请传入 `required_features`。

Entity actions support the `exclude` block of a target for you. When a user targets a floor and excludes an area, the entities of that area are not called, also when the target is `entity_id: all`. The `exclude` block is not passed on to your method.

If an action resolves its target itself instead, use `service.async_extract_entities` or `target.async_extract_referenced_entity_ids`, which remove the exclusions. Do not read `entity_id`, `device_id`, or `area_id` from `call.data` and resolve them yourself: the entity action schema accepts `exclude`, so your action would act on exactly the entities the user left out. When you require at least one target in your own schema, use `probatio.AtLeastOne(*cv.TARGET_ID_KEYS)`, so a target with only an exclude block doesn't pass.

## Admin-only actions

能够更改配置或具有其他安全影响的动作，应该只对管理员开放。请使用 `homeassistant.helpers.service` 中的 `async_register_admin_service` 来注册它们，而不是使用 `hass.services.async_register`。它先接收 `hass`，然后接收相同的参数，并在您的处理函数运行之前检查调用者是否为管理员。

## 抛出错误

当动作失败时，请抛出异常，以便用户看到出了什么问题：用户操作错误时使用 `ServiceValidationError`，其他情况使用 `HomeAssistantError`。请使用已翻译的消息。参见[动作中的异常](/core/integrations/setup-failures/#exceptions-in-actions-and-entity-methods)。

## 返回响应数据

动作可以返回数据，供那些需要实体状态（state）之外信息的自动化使用，例如日历事件列表或搜索结果。不要将其用于适合作为实体状态的数据：温度是传感器，而不是响应。

响应数据是一个可序列化为 JSON 的 `dict`。注册动作时请传入 `supports_response`：

| 值 | 含义 |
| --- | --- |
| `SupportsResponse.NONE` | 动作不返回任何内容。默认值。 |
| `SupportsResponse.OPTIONAL` | 动作执行某些操作，同时也可以返回数据。检查 `call.return_response` 以确定调用者是否需要数据，若不需要则返回 `None`。 |
| `SupportsResponse.ONLY` | 动作只返回数据，不做其他事情 |

错误始终以异常的形式表示，绝不会是响应中的错误码。用户不应需要在自动化中进行错误处理。

## 在 services.yaml 中描述动作

用户只会使用他们能找到的动作。请在 `services.yaml` 中描述每个动作，以便 UI 显示正确的字段和选择器（selector）。键是动作的名称，不包含您的域：

```yaml
set_speed:
  target:
    entity:
      domain: fan
      supported_features:
        - fan.FanEntityFeature.SET_SPEED
  fields:
    speed:
      required: true
      example: "low"
      selector:
        select:
          translation_key: "fan_speed"
          options:
            - "off"
            - "low"
            - "medium"
            - "high"
    advanced_options:
      collapsed: true
      fields:
        speed_pct:
          selector:
            number:
              min: 0
              max: 100
```

- `target`：用于接受实体的动作。它允许用户选择实体、设备和区域。在没有过滤器的情况下，它会提供所有实体，因此请使用 `entity` [选择器](/glossary/selector/)来缩小范围。Hassfest 不允许在目标上使用 `device` 过滤器：为此，请在字段中使用设备选择器。使用 `target` 时，不要添加 `entity_id` 字段。
- `supported_features`：只提供至少支持这些功能之一的实体。若需要同时满足多个功能，请将它们放在嵌套列表中。
- `fields`：每个字段一个条目，包含 `required`、`example`、`default`，以及决定 UI 中输入方式的 `selector`。
- 分区（section）：带有 `collapsed` 及其自身 `fields` 的键，会将字段分组到一个可折叠的分区中。它只改变字段的显示方式：数据并不会嵌套，因此上面的动作会收到 `{"speed_pct": 50}`。

### 仅在适用时显示字段

字段上的 `filter` 仅在至少一个所选实体支持它时才显示该字段。过滤器只在带有 `target` 的动作中起作用，因为它们查看的是所选实体：hassfest 会拒绝在其他动作中使用过滤器。请使用 `supported_features` 或 `attribute` 其中之一，不要同时使用：

```yaml
temperature:
  filter:
    supported_features:
      - climate.ClimateEntityFeature.TARGET_TEMPERATURE
color_temp:
  filter:
    attribute:
      supported_color_modes:
        - light.ColorMode.COLOR_TEMP
        - light.ColorMode.HS
```

使用 `attribute` 过滤器时，当所选实体的属性具有所列值之一时，就会显示该字段。如果属性是一个列表，只需有一项匹配即可。

### 名称和描述

每个动作和每个字段的名称和描述并不在 `services.yaml` 中：它们位于 `strings.json` 的 `services` 之下，并且每个动作和字段都需要有条目。请通过描述占位符将 URL 排除在翻译之外，这些占位符在您注册动作时传入：

```python
hass.services.async_register(
    DOMAIN,
    "get_forecast",
    async_get_forecast,
    schema=GET_FORECAST_SCHEMA,
    supports_response=SupportsResponse.ONLY,
    description_placeholders={"docs_url": "https://example.com/forecast"},
)
```

格式参见[翻译](/core/integrations/translations/#actions)，另请参阅[让您的字符串可翻译](/translate/guides/developers/)。

### 图标

请在 `icons.json` 的 `services` 下为每个动作指定图标。分区也可以有图标：

```json
{
  "services": {
    "start_brewing": {
      "service": "mdi:flask",
      "sections": {
        "advanced_options": "mdi:test-tube"
      }
    }
  }
}
```

## 试一试

打开开发者工具的**动作**标签页，选择您的动作，填写字段，然后选择**执行动作**。
