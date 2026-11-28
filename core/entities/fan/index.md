# 风扇实体

> 构建一个可控制转速、转动方向、摆动和预设模式的风扇实体。

Source: https://www.hasscn.top/contributors/core/entities/fan/

风扇实体（fan entity）控制风扇：其转速、转动方向、是否摆动，以及预设模式（如 `auto` 或 `breeze`）。继承自 `homeassistant.components.fan` 中的 `FanEntity`。它基于开关实体（toggle entity）构建，因此具有 `is_on`、`turn_on` 和 `turn_off`。

空调或热泵中的风扇属于[气候实体（climate entity）](https://www.hasscn.top/contributors/core/entities/climate/)，作为其风扇模式。对于独立风扇、吊扇或空气净化器风扇，请使用风扇实体。

关于前端如何展示风扇，请参阅[风扇更多信息视图（fan more-info view）](https://www.hasscn.top/contributors/design/more-info/fan/)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. A fan with speeds, presets, oscillation, and direction, in a tile card. The card is live: change the speed or pick a preset.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <script type="application/json">
    [
      {
        "entity_id": "fan.bedroom",
        "state": "on",
        "attributes": {
          "friendly_name": "Bedroom fan",
          "percentage": 50,
          "percentage_step": 25,
          "preset_modes": [
            "auto",
            "sleep"
          ],
          "preset_mode": null,
          "oscillating": false,
          "direction": "forward",
          "supported_features": 63
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "fan.bedroom",
        "features": [
          {
            "type": "fan-speed"
          },
          {
            "type": "fan-preset-modes"
          },
          {
            "type": "fan-oscillate"
          },
          {
            "type": "fan-direction"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 属性

除[通用实体属性（generic entity properties）](https://www.hasscn.top/contributors/core/entities/entity-class/)之外，风扇实体还具有以下属性。每个属性都可以通过其 `_attr_` 属性进行设置，例如 `_attr_percentage`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `is_on` | `bool \| None` | 计算得出 | 风扇是否开启。默认情况下，当 `percentage` 大于 0 或有预设处于激活状态时，风扇即为开启。如果你的设备更了解自身状态，可以重写该属性。 |
| `percentage` | `int \| None` | `0` | 当前转速，从 0（关闭）到 100。 |
| `speed_count` | `int` | `100` | 风扇具有的转速档位数。Home Assistant 用它来计算 `percentage_step`。 |
| `preset_mode` | `str \| None` | `None` | 当前激活的预设；当没有预设激活时为 `None`。 |
| `preset_modes` | `list[str] \| None` | `None` | 风扇支持的预设。 |
| `current_direction` | `str \| None` | `None` | 风扇转动的方向：`DIRECTION_FORWARD`（`"forward"`）或 `DIRECTION_REVERSE`（`"reverse"`）。 |
| `oscillating` | `bool \| None` | `None` | 风扇是否正在摆动。 |

`percentage_step` 由 `speed_count` 计算得出，等于 100 除以转速档位数。你不需要自己设置它。

### 转速与百分比

Home Assistant 始终以百分比来表示风扇转速。如果你的设备具有固定数量的转速档位，请设置 `speed_count`，并使用 `homeassistant.util.percentage` 中的辅助函数在两者之间进行转换：

- `ranged_value_to_percentage` 和 `percentage_to_ranged_value` 用于数值范围，例如 1 到 6 档转速
- `ordered_list_item_to_percentage` 和 `percentage_to_ordered_list_item` 用于命名转速的列表，例如 `low`、`medium` 和 `high`

关闭不属于该范围或列表：百分比为 0 即表示关闭。

### 预设模式

预设（preset）是风扇自行控制转速，或自行执行其他操作的一种模式。常见的例子有 `auto`、`smart`、`eco` 和 `breeze`。当没有预设激活时，`preset_mode` 必须为 `None`。

命名的手动转速不是预设：请将它们表示为百分比。手动设置转速时必须结束当前激活的预设。如果设备允许在预设保持激活的情况下设置转速，请改用单独的[开关实体（switch）](https://www.hasscn.top/contributors/core/entities/switch/)来表示该预设。

## 支持的功能

使用 `|` 组合 `FanEntityFeature` 标志，并将其设置为 `supported_features`。参见[支持的功能（supported features）](https://www.hasscn.top/contributors/glossary/supported-features/)。

| 值 | 描述 |
| ----- | ----------- |
| `SET_SPEED` | 风扇可以改变转速。需实现 `set_percentage`。 |
| `PRESET_MODE` | 风扇具有预设模式。需实现 `set_preset_mode`。 |
| `OSCILLATE` | 风扇可以摆动。需实现 `oscillate`。 |
| `DIRECTION` | 风扇可以改变转动方向。需实现 `set_direction`。 |
| `TURN_ON` | 风扇可以被打开。需实现 `turn_on`。 |
| `TURN_OFF` | 风扇可以被关闭。需实现 `turn_off`。 |

对于你未设置的功能，相应操作会在到达你的实体之前被拒绝。

## 方法

每个方法只需实现同步或异步变体之一，不要两者都实现。

| 方法 | 异步变体 | 功能 |
| ------ | ------------- | ------- |
| `turn_on(percentage: int \| None = None, preset_mode: str \| None = None, **kwargs: Any)` | `async_turn_on` | `TURN_ON` |
| `turn_off(**kwargs: Any)` | `async_turn_off` | `TURN_OFF` |
| `set_percentage(percentage: int)` | `async_set_percentage` | `SET_SPEED` |
| `set_preset_mode(preset_mode: str)` | `async_set_preset_mode` | `PRESET_MODE` |
| `set_direction(direction: str)` | `async_set_direction` | `DIRECTION` |
| `oscillate(oscillating: bool)` | `async_oscillate` | `OSCILLATE` |

几点细节：

- `turn_on` 可以接收百分比、预设、两者兼有，或两者皆无。当两者皆无时，风扇以设备自行选择的转速开启。
- 百分比为 0 表示关闭。默认的 `async_set_percentage` 会为此调用 `async_turn_off`，然后仍会将 0 传递给 `set_percentage`。当你重写 `async_set_percentage` 时，需要自行处理 0 的情况。将转速降至最低档以下时，最终也会变为 0。
- Home Assistant 在调用 `set_preset_mode` 或 `turn_on` 之前，会根据 `preset_modes` 检查预设，如果预设不在列表中，则会引发验证错误。
- `toggle` 已为你处理好：它会根据 `is_on` 调用 `turn_on` 或 `turn_off`。
- `increase_speed` 和 `decrease_speed` 已为你处理好。它们会按 `percentage_step` 或操作中指定的步长进行调整，并调用 `set_percentage`。只有当设备对这两个操作有自己的命令时，才需要重写 `async_increase_speed` 和 `async_decrease_speed`。

## 状态

状态为 `on` 或 `off`，由 `is_on` 决定。当 `is_on` 为 `None` 时，状态为 `unknown`。

## 示例

```python
import math
from typing import Any

from homeassistant.components.fan import FanEntity, FanEntityFeature
from homeassistant.util.percentage import (
    percentage_to_ranged_value,
    ranged_value_to_percentage,
)

SPEED_RANGE = (1, 3)


class MyFan(FanEntity):
    """A fan with three speeds."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_speed_count = 3
    _attr_supported_features = (
        FanEntityFeature.SET_SPEED
        | FanEntityFeature.TURN_ON
        | FanEntityFeature.TURN_OFF
    )

    def __init__(self, device: MyDevice) -> None:
        """Set up the fan."""
        self._device = device
        self._attr_unique_id = device.serial

    @property
    def percentage(self) -> int:
        """Return the speed as a percentage."""
        if not self._device.speed:
            return 0
        return ranged_value_to_percentage(SPEED_RANGE, self._device.speed)

    async def async_set_percentage(self, percentage: int) -> None:
        """Set the speed."""
        if percentage == 0:
            await self._device.turn_off()
            return

        # Round up, so 1% is the lowest speed and not off
        speed = math.ceil(percentage_to_ranged_value(SPEED_RANGE, percentage))
        await self._device.set_speed(speed)

    async def async_turn_on(
        self,
        percentage: int | None = None,
        preset_mode: str | None = None,
        **kwargs: Any,
    ) -> None:
        """Turn the fan on."""
        if percentage is not None:
            await self.async_set_percentage(percentage)
            return
        await self._device.turn_on()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the fan off."""
        await self._device.turn_off()
```
