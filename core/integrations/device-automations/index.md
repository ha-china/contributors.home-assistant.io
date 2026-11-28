# 设备自动化

> 面向已拥有设备自动化的集成，介绍设备触发器、条件和动作的工作方式。

Source: https://www.hasscn.top/contributors/core/integrations/device-automations/

> [!IMPORTANT]
> 我们正在探索设备自动化的替代方案。现有的设备自动化将继续正常工作，但不再接受新的设备自动化。本页面仅用于维护已有的设备自动化。

设备自动化让用户围绕设备构建自动化，而无需了解状态（state）、事件或动作。用户选择一个设备，然后从该设备可用的触发器（trigger）、条件（condition）和动作（action）列表中进行选择，例如“按下按钮 1”或“打开灯”。在底层，它们与其他部分使用相同的事件、状态和动作。

它们来自两个地方：

- 设备所属的集成，用于与实体（entity）无关的功能，例如按下遥控器上的按钮（ZHA 和 deCONZ 就是这样做的）。
- 实体集成，用于与实体相关的功能，例如打开灯。`light` 集成为每个灯提供这些功能。

集成通过三个平台文件来添加它们：`device_trigger.py`、`device_condition.py` 和 `device_action.py`。每个文件都会定义一个模式（schema）、一个列出设备所支持功能的函数，以及一个执行具体工作的函数。脚手架（scaffold）脚本提供了这三个文件的模板：`python3 -m script.scaffold device_trigger`、`device_condition` 或 `device_action`。

## 设备触发器

当设备上发生某些事情时，触发器就会触发，例如总线上发生事件或状态发生变化。

```python
import probatio

from homeassistant.components.device_automation import (
    DEVICE_TRIGGER_BASE_SCHEMA,
)
from homeassistant.components.homeassistant.triggers import event
from homeassistant.const import (
    CONF_DEVICE_ID,
    CONF_DOMAIN,
    CONF_PLATFORM,
    CONF_TYPE,
)

TRIGGER_TYPES = {"button_short_press", "button_long_press"}

TRIGGER_SCHEMA = DEVICE_TRIGGER_BASE_SCHEMA.extend(
    {probatio.Required(CONF_TYPE): probatio.In(TRIGGER_TYPES)}
)


async def async_get_triggers(
    hass: HomeAssistant, device_id: str
) -> list[dict[str, Any]]:
    """List the triggers of a device."""
    return [
        {
            CONF_PLATFORM: "device",
            CONF_DOMAIN: DOMAIN,
            CONF_DEVICE_ID: device_id,
            CONF_TYPE: trigger_type,
        }
        for trigger_type in TRIGGER_TYPES
    ]


async def async_attach_trigger(
    hass: HomeAssistant,
    config: ConfigType,
    action: TriggerActionType,
    trigger_info: TriggerInfo,
) -> CALLBACK_TYPE:
    """Attach a trigger to the event of the device."""
    event_config = event.TRIGGER_SCHEMA(
        {
            event.CONF_PLATFORM: "event",
            event.CONF_EVENT_TYPE: f"{DOMAIN}_event",
            event.CONF_EVENT_DATA: {
                CONF_DEVICE_ID: config[CONF_DEVICE_ID],
                CONF_TYPE: config[CONF_TYPE],
            },
        }
    )

    return await event.async_attach_trigger(
        hass, event_config, action, trigger_info, platform_type="device"
    )
```

- `TRIGGER_SCHEMA` 用于校验触发器。将其定义为模块中的常量，Home Assistant 会自动应用它。不要自行应用。
- `async_get_triggers` 列出设备支持的触发器。这些就是用户可以选择的选项。
- `async_attach_trigger` 使触发器触发。它返回一个用于解除该触发器的函数。

如果静态模式无法满足需求，可以实现 `async_validate_trigger_config(hass, config)` 来进行动态校验。

## 设备条件

条件检查设备的某些情况，例如灯是否处于打开状态。

- `CONDITION_SCHEMA`：扩展自 `homeassistant.helpers.config_validation` 中的 `DEVICE_CONDITION_BASE_SCHEMA`。
- `async_get_conditions(hass, device_id)`：列出设备支持的条件。
- `async_condition_from_config(hass, config)`：返回一个检查该条件的函数，该函数返回一个 `bool` 值。必须确保可以安全地从事件循环（event loop）中调用它。

实现 `async_validate_condition_config(hass, config)` 以进行动态校验。

## 设备动作

动作让设备执行某些操作，例如打开灯或重启设备。

- `ACTION_SCHEMA`：扩展自 `homeassistant.helpers.config_validation` 中的 `DEVICE_ACTION_BASE_SCHEMA`。Home Assistant 会自动应用它，不要自行应用。
- `async_get_actions(hass, device_id)`：列出设备支持的动作。
- `async_call_action_from_config(hass, config, variables, context)`：执行该动作。

实现 `async_validate_action_config(hass, config)` 以进行动态校验。

## 次要设备自动化

拥有大量触发器、条件或动作的设备可能会让用户不知所措。请将较不重要的项目标记为次要（secondary）。它们仍然可用，但可能会显示在其他项目之后，或者隐藏在“显示更多”选项之后。

```python
{
    CONF_PLATFORM: "device",
    CONF_DOMAIN: DOMAIN,
    CONF_DEVICE_ID: device_id,
    CONF_TYPE: "button_long_press",
    "metadata": {"secondary": True},
}
```

如果设备自动化通过 `entity_id` 键引用了某个实体，那么当该实体被隐藏或具有[实体类别（entity category）](https://www.hasscn.top/contributors/glossary/entity-category/)时，该设备自动化会被自动标记为次要。

## 文本

用户看到的名称来自 `strings.json` 中 `device_automation` 下的内容：

```json
{
  "device_automation": {
    "trigger_type": {
      "button_short_press": "Button pressed",
      "button_long_press": "Button held down"
    },
    "condition_type": {
      "is_on": "{entity_name} is on"
    },
    "action_type": {
      "reboot": "Reboot"
    }
  }
}
```

在开发过程中，运行 `python3 -m script.translations develop` 即可查看更改。
