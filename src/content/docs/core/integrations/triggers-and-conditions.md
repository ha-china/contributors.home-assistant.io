---
title: 触发器和条件
description: 通过触发器和条件平台为您的集成提供自动化触发器和条件，并进行命名，让用户能够预测它们。
sidebarGroup: Integration features
order: 2
---

集成可以向自动化（automation）提供自己的[触发器（trigger）](/glossary/trigger/)和[条件（condition）](/glossary/condition/)，例如"灯打开了"、"燃料变低"或"月亮处于某月相"。用户在自动化编辑器中挑选它们，与内置的触发器和条件并列，并填写您所描述的字段。您需要在 `trigger.py` 和 `condition.py` 平台中提供它们。

> [!IMPORTANT]
> 此 API 正在使用中，但它还很年轻，且仍在频繁变动。目前的大多数实现是实体域，例如 `light` 和 `lock`，仅有少数集成如 `fumis`、`moon` 和 `zwave_js`。在近期的版本中，这些辅助方法被移入了 `homeassistant/helpers/trigger/` 和 `homeassistant/helpers/condition/` 包，并且触发器运行器增加了一个新的参数。在基于它进行构建之前，请阅读当前的代码和一个现有的实现，并预期需要跟随其变化。

在寻找按设备（device）选择的触发器和条件，例如"按钮 1 被按下"？那些是[设备自动化](/core/integrations/device-automations/)，这是一种较旧的机制，不再接受新的实现。

## 用户编写的内容

触发器或条件由您集成的域（domain）及其键（key）来标识。在 YAML 中，设置放在 `options` 中，而它适用的实体（entity）、设备或区域（area）放在 `target` 中：

```yaml
triggers:
  - trigger: light.turned_on
    target:
      area_id: living_room
  - trigger: fumis.fuel_became_low
    options:
      device_id: 0c5ac1d9e3f8a4b2c6d7e8f9a0b1c2d3
conditions:
  - condition: moon.is_phase
    options:
      phase: full_moon
```

A `target` can also leave out part of what it matches with an `exclude` block, like all lights on a floor except the kitchen. See [targets and exclusions](#targets-and-exclusions).

## Triggers

### 触发器类

触发器继承自 `homeassistant.helpers.trigger` 中的 `Trigger`，并实现两个方法：

- `async_validate_config`：用于验证配置的类方法。它接收一个包含触发器 `options` 和 `target` 的字典，并返回验证后的版本。
- `async_attach_runner`：开始监听。每当触发器触发时，调用 `run_action`，并传入触发器数据和一段描述。返回一个停止监听的回调函数。

构造函数接收一个 `TriggerConfig`，其中包含触发器的 `key`、`target` 和 `options`。

```python
from typing import override

import probatio

from homeassistant.const import ATTR_DEVICE_ID, CONF_OPTIONS
from homeassistant.core import CALLBACK_TYPE, HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.trigger import (
    Trigger,
    TriggerActionRunner,
    TriggerConfig,
    TriggerNotTriggeredReporter,
)
from homeassistant.helpers.typing import ConfigType

from .const import SIGNAL_BUTTON_PRESSED

_CONFIG_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_OPTIONS): {
            probatio.Required(ATTR_DEVICE_ID): probatio.All(
                cv.ensure_list, [cv.string]
            ),
        },
    }
)


class ButtonPressedTrigger(Trigger):
    """Trigger when a button on the hub is pressed."""

    @classmethod
    @override
    async def async_validate_config(
        cls, hass: HomeAssistant, config: ConfigType
    ) -> ConfigType:
        """Validate the trigger config."""
        return _CONFIG_SCHEMA(config)

    def __init__(self, hass: HomeAssistant, config: TriggerConfig) -> None:
        """Initialize the trigger."""
        super().__init__(hass, config)
        assert config.options is not None
        self._device_ids: list[str] = config.options[ATTR_DEVICE_ID]

    @override
    async def async_attach_runner(
        self,
        run_action: TriggerActionRunner,
        did_not_trigger: TriggerNotTriggeredReporter | None = None,
    ) -> CALLBACK_TYPE:
        """Start listening for button presses."""

        @callback
        def async_button_pressed(device_id: str) -> None:
            """Run the automation for a watched device."""
            if device_id in self._device_ids:
                run_action({ATTR_DEVICE_ID: device_id}, "button pressed")

        return async_dispatcher_connect(
            self._hass, SIGNAL_BUTTON_PRESSED, async_button_pressed
        )
```

`run_action` 的第一个参数会被添加到 `trigger` 变量中，自动化可以在其动作中使用该变量。第二个参数是对所发生事情的简短描述，会显示在自动化跟踪和日志簿中。`run_action` 返回一个任务，因此如果您需要等待动作完成，可以对其进行 await。

`did_not_trigger` 是可选的。当触发器检查了某个变化但决定不触发时，可以使用 `NotTriggeredInfo` 调用它，这会显示在跟踪中。

### 注册触发器

在 `trigger.py` 的 `async_get_triggers` 中返回您的触发器，以其键作为键名。该键相对于您的域：`button_pressed` 会变成 `example.button_pressed`。

```python
TRIGGERS: dict[str, type[Trigger]] = {
    "button_pressed": ButtonPressedTrigger,
}


async def async_get_triggers(
    hass: HomeAssistant,
) -> dict[str, type[Trigger]]:
    """Return the triggers of the Example integration."""
    return TRIGGERS
```

### 描述触发器

`triggers.yaml` 告诉自动化编辑器触发器有哪些字段，其方式与 `services.yaml` 为[动作](/core/integrations/actions/#describe-actions-in-servicesyaml)提供描述相同。触发器可以有一个 `target`、`fields`，或两者兼有。每个字段可以有一个 `selector`、`required`、`default` 和 `example`。

```yaml
button_pressed:
  fields:
    device_id:
      required: true
      selector:
        device:
          filter:
            - integration: example
          multiple: true
```

以 `.` 开头的顶层键会被忽略，因此您可以将它们用作多个触发器共享的 YAML 锚点。没有字段的触发器写作 `button_pressed: {}`。

### 文本和图标

每个触发器的名称和描述，以及每个字段的名称，都放在 `strings.json` 的 `triggers` 下。参见[翻译](/core/integrations/translations/#triggers-and-conditions)。

```json
{
  "triggers": {
    "button_pressed": {
      "name": "Button pressed",
      "description": "Triggers when one or more buttons are pressed.",
      "fields": {
        "device_id": {
          "name": "Buttons",
          "description": "The buttons to watch."
        }
      }
    }
  }
}
```

核心集成的每个触发器还需要在 `icons.json` 中有一个图标：

```json
{
  "triggers": {
    "button_pressed": {
      "trigger": "mdi:gesture-tap-button"
    }
  }
}
```

Hassfest 会检查所有这些内容：注册触发器的集成需要一个 `triggers.yaml`，而在核心集成中，每个触发器都需要名称、描述和图标。

### 基于实体状态的触发器

实体域提供跟随其实体状态的触发器。`homeassistant.helpers.trigger` 为此提供了基类和工厂，例如 `make_entity_target_state_trigger`，它会构建一个在实体达到某个状态时触发的触发器：

```python
TRIGGERS: dict[str, type[Trigger]] = {
    "turned_off": make_entity_target_state_trigger(DOMAIN, STATE_OFF),
    "turned_on": make_entity_target_state_trigger(DOMAIN, STATE_ON),
}
```

这些触发器接收一个 `target`，并会为您处理 `behavior` 和 `for`。完整示例请参见 `homeassistant/components/light/trigger.py` 及其 `triggers.yaml`，其中包括用于亮度的数值触发器。

## 条件

### 条件类

条件继承自 `homeassistant.helpers.condition` 中的 `Condition`，并实现：

- `async_validate_config`：用于验证配置的类方法，与触发器相同。
- `_async_check`：返回条件是否满足。它在每次检查条件时都会被调用，因此要保持快速，并且不要执行 I/O 操作。

构造函数接收一个 `ConditionConfig`，其中包含条件的 `options` 和 `target`。这个示例来自 `moon` 集成，用于测试月亮的月相：

```python
from typing import Unpack, cast, override

import probatio

from homeassistant.const import CONF_OPTIONS
from homeassistant.core import HomeAssistant
from homeassistant.helpers.condition import (
    Condition,
    ConditionCheckParams,
    ConditionConfig,
)
from homeassistant.helpers.typing import ConfigType

from .const import CONF_PHASE
from .helpers import MOON_PHASES, moon_phase

_IS_PHASE_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_OPTIONS, default=dict): {
            probatio.Required(CONF_PHASE): probatio.In(MOON_PHASES),
        }
    }
)


class IsPhaseCondition(Condition):
    """Test if the moon is in a specific phase."""

    @classmethod
    @override
    async def async_validate_config(
        cls, hass: HomeAssistant, config: ConfigType
    ) -> ConfigType:
        """Validate the condition config."""
        return cast(ConfigType, _IS_PHASE_SCHEMA(config))

    def __init__(self, hass: HomeAssistant, config: ConditionConfig) -> None:
        """Initialize the condition."""
        super().__init__(hass, config)
        assert config.options is not None
        self._phase: str = config.options[CONF_PHASE]

    @override
    def _async_check(self, **kwargs: Unpack[ConditionCheckParams]) -> bool:
        """Check the condition."""
        return moon_phase() == self._phase
```

### 注册和描述条件

从这里开始，条件的工作方式与触发器相同：

- 在 `condition.py` 的 `async_get_conditions` 中返回它们，以其键作为键名。
- 在 `conditions.yaml` 中描述它们的字段，格式与 `triggers.yaml` 相同。
- 将它们的名称和描述放在 `strings.json` 的 `conditions` 下。
- 在 `icons.json` 的 `conditions` 下为每个条件提供一个图标，使用键 `condition`。

```python
CONDITIONS: dict[str, type[Condition]] = {
    "is_phase": IsPhaseCondition,
}


async def async_get_conditions(
    hass: HomeAssistant,
) -> dict[str, type[Condition]]:
    """Return the conditions of the moon integration."""
    return CONDITIONS
```

```yaml
is_phase:
  fields:
    phase:
      required: true
      selector:
        select:
          translation_key: phase
          options:
            - new_moon
            - full_moon
```

对于基于实体状态的条件，`homeassistant.helpers.condition` 提供了 `make_entity_state_condition` 以及诸如 `EntityNumericalConditionBase` 之类的基类。请参见 `homeassistant/components/light/condition.py`。

## Targets and exclusions

A target can have an `exclude` block, with the same keys as the target itself. Home Assistant removes whatever it matches from the resolved target, also when entities are added to an excluded area or label later:

```yaml
triggers:
  - trigger: light.turned_on
    target:
      floor_id: ground_floor
      exclude:
        area_id: kitchen
```

The entity triggers and conditions from the helpers handle this for you. So does `cv.TARGET_FIELDS`, which accepts the `exclude` block when you validate a `target`.

If your trigger or condition resolves the target itself, use the target helpers in `homeassistant.helpers.target`, never the IDs in the target directly. Reading `area_id` or `entity_id` yourself silently ignores the exclude block, and your trigger then reacts to entities the user left out:

- `async_extract_referenced_entity_ids` resolves a `TargetSelection` to entities, devices, and areas, with the exclusions removed.
- `async_track_target_selector_state_change_event` and `TargetEntityChangeTracker` follow the entities of a target as they change, exclusions included.

If your trigger or condition can't support exclusions, validate the target with `cv.TARGET_ID_FIELDS` instead. It has the same keys without `exclude`, so an exclude block fails validation instead of being ignored.

## Naming

用户会并排看到许多集成的触发器和条件。一致的命名让他们在了解了另一个集成之后，就能猜测您的触发器和条件是如何工作的。

为设备类型选定一个名称，例如"灯"、"锁"、"媒体播放器"或"气候控制设备"，并在您的所有触发器、条件和动作中使用它。不要混用像 "vacuum" 和 "vacuum cleaner" 这样的变体。

### 触发器命名

触发器为刚刚发生的事件命名，以设备类型开头。

| 事件类型 | 标题 | 键 |
| --- | --- | --- |
| 瞬时变化 | "灯打开了"、"门打开了"、"按钮被按下" | `turned_on`、`opened`、`pressed` |
| 活动的开始或结束 | "割草机开始割草"、"电池停止充电" | `started_mowing`、`stopped_charging` |
| 测量 | "温度发生变化"、"电池电量越过阈值" | `level_changed`、`level_crossed_threshold` |
| 检测 | "检测到移动"、"烟雾消散" | `detected`、`cleared` |
| 状态 | "电池电量变低"、"电池电量不再低" | `became_low`、`no_longer_low` |

- 对于活动，使用"已开始"或"已停止"："吸尘器清洁了"听起来像是已经完成，而"吸尘器开始清洁"则没有这种含义。
- 不要把裸状态用作标题，例如"电池电量低"。它们读起来像是一种状态，而不是一个事件。
- 以设备类型开头，传感器和地理位置区域（zone）也是如此："已进入区域"，而不是"进入区域"。
- 描述遵循"当一个或多个[设备][现在时动词]时触发。"的格式，例如"当一个或多个灯打开时触发。"

### 条件命名

条件测试的是当前状态，因此其标题的形式为"[设备类型]处于[状态]"，例如"灯处于开启状态"或"锁处于锁定状态"。相反的情况使用"未处于"，例如"媒体播放器未在播放"。对于数值，使用"[设备类型][属性]"，例如"媒体播放器音量"。

- 键使用 `is_`，从而将条件与触发器和动作区分开：`is_on`、`is_not_playing`、`is_hvac_mode`、`is_brightness`。子类型放在它的前面，例如 `blind_is_open`。
- 描述遵循"测试一个或多个[设备]是否处于[状态]。"的格式，例如"测试一个或多个锁是否处于锁定状态。"对于数值："测试一个或多个[设备]的[属性]。"

### 键

- 键为小写的 `snake_case`，并与标题的含义相匹配。
- 不要重复域：在 `update` 域中，使用 `became_available`，而不是 `update_became_available`。
- 不要使用占位键，例如 `_`。
- 将子类型放在前面：`awning_opened`、`blind_is_open`。
