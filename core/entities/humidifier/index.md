# 加湿器实体

> 为向空气中增加湿气或去除湿气的设备构建加湿器实体。

Source: https://www.hasscn.top/contributors/core/entities/humidifier/

加湿器实体控制一台向空气中增加湿气（加湿器）或去除湿气（除湿器）的设备，使其达到目标湿度。继承自 `homeassistant.components.humidifier` 中的 `HumidifierEntity`。它基于开关实体构建，因此具有 `is_on`、`turn_on` 和 `turn_off`。

如果设备还能制热或制冷，请改用带有 `TARGET_HUMIDITY` 功能的[气候实体（climate entity）](https://www.hasscn.top/contributors/core/entities/climate/)。

有关前端如何展示加湿器，请参见[加湿器更多信息视图](https://www.hasscn.top/contributors/design/more-info/humidifier/)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. A humidifier with a target humidity and modes, in a tile card and a humidifier card. The cards are live: change the target, the mode, or turn it off.

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
        "entity_id": "humidifier.bedroom",
        "state": "on",
        "attributes": {
          "friendly_name": "Bedroom humidifier",
          "device_class": "humidifier",
          "action": "humidifying",
          "current_humidity": 38,
          "humidity": 45,
          "min_humidity": 30,
          "max_humidity": 70,
          "available_modes": [
            "normal",
            "eco",
            "sleep"
          ],
          "mode": "normal",
          "supported_features": 1
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "humidifier.bedroom",
        "features": [
          {
            "type": "target-humidity"
          },
          {
            "type": "humidifier-modes"
          }
        ]
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "humidifier",
        "entity": "humidifier.bedroom",
        "features": [
          {
            "type": "humidifier-toggle"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 属性

加湿器实体在[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)之外还具有以下属性。每个属性都可以通过其对应的 `_attr_` 属性来设置，例如 `_attr_target_humidity`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `is_on` | `bool \| None` | `None` | 设备是否开启。 |
| `device_class` | `HumidifierDeviceClass \| None` | `None` | 设备是加湿器还是除湿器。参见[设备类别](https://www.hasscn.top/contributors/core/entities/humidifier/#device-classes)。 |
| `action` | `HumidifierAction \| None` | `None` | 设备当前正在执行的操作。参见[动作](https://www.hasscn.top/contributors/core/entities/humidifier/#actions)。 |
| `current_humidity` | `float \| None` | `None` | 当前测得的湿度。 |
| `target_humidity` | `float \| None` | `None` | 要达到的湿度。 |
| `target_humidity_step` | `float \| None` | `None` | 目标湿度的步长。 |
| `min_humidity` | `float` | `0` | 最低目标湿度。 |
| `max_humidity` | `float` | `100` | 最高目标湿度。 |
| `mode` | `str \| None` | 设置 `MODES` 时必填 | 当前激活的模式。 |
| `available_modes` | `list[str] \| None` | 设置 `MODES` 时必填 | 设备支持的模式。 |

## 设备类别

请从 `HumidifierDeviceClass` 中选择一个[设备类别（device class）](https://www.hasscn.top/contributors/glossary/device-class/)进行设置，这样前端和语音助手就能知道设备的工作方式。

| 值 | 描述 |
| ----- | ----------- |
| `HUMIDIFIER` | 向空气中增加湿气。 |
| `DEHUMIDIFIER` | 从空气中去除湿气。 |

## 动作

`action` 用于说明设备当前正在做什么。请使用 `HumidifierAction` 枚举。当设备关闭时，无论 `action` 返回什么，Home Assistant 都会为你报告 `off`。

| 值 | 描述 |
| ----- | ----------- |
| `HumidifierAction.HUMIDIFYING` | 设备正在增加湿气。 |
| `HumidifierAction.DRYING` | 设备正在去除湿气。 |
| `HumidifierAction.IDLE` | 设备已开启，但当前没有任何操作。 |
| `HumidifierAction.OFF` | 设备已关闭。 |

仅当设备会报告该信息时才实现 `action`。

## 模式

模式为字符串。Home Assistant 为常见模式提供了带有内置翻译的常量：`MODE_NORMAL`、`MODE_ECO`、`MODE_AWAY`、`MODE_BOOST`、`MODE_COMFORT`、`MODE_HOME`、`MODE_SLEEP`、`MODE_AUTO` 和 `MODE_BABY`。你可以添加自己的值，并通过实体的[翻译键（translation key）](https://www.hasscn.top/contributors/core/entities/naming/)为它们提供翻译和图标（参见[图标](https://www.hasscn.top/contributors/core/entities/icons/)）。

## 支持的功能

将 `HumidifierEntityFeature` 标志设置为 `supported_features`。参见[支持的功能](https://www.hasscn.top/contributors/glossary/supported-features/)。

| 值 | 描述 |
| ----- | ----------- |
| `MODES` | 设备具有模式。设置 `mode` 和 `available_modes`，并实现 `set_mode`。 |

## 方法

每个方法实现同步或异步变体其中之一即可，不要两者都实现。

| 方法 | 异步变体 | 描述 |
| ------ | ------------- | ----------- |
| `turn_on(**kwargs: Any)` | `async_turn_on` | 开启设备。 |
| `turn_off(**kwargs: Any)` | `async_turn_off` | 关闭设备。 |
| `set_humidity(humidity: int)` | `async_set_humidity` | 设置目标湿度。Home Assistant 会先对照 `min_humidity` 和 `max_humidity` 进行检查。 |
| `set_mode(mode: str)` | `async_set_mode` | 设置模式。需要 `MODES`。 |

## 状态

状态为 `on` 或 `off`，取自 `is_on`。当 `is_on` 为 `None` 时，状态为 `unknown`。

## 示例

```python
from typing import Any

from homeassistant.components.humidifier import (
    HumidifierDeviceClass,
    HumidifierEntity,
)


class MyDehumidifier(HumidifierEntity):
    """A dehumidifier with a target humidity."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_device_class = HumidifierDeviceClass.DEHUMIDIFIER
    _attr_min_humidity = 30
    _attr_max_humidity = 80

    def __init__(self, device: MyDevice) -> None:
        """Set up the dehumidifier."""
        self._device = device
        self._attr_unique_id = device.serial

    @property
    def is_on(self) -> bool:
        """Return if the device is on."""
        return self._device.is_on

    @property
    def target_humidity(self) -> float:
        """Return the target humidity."""
        return self._device.target

    async def async_set_humidity(self, humidity: int) -> None:
        """Set the target humidity."""
        await self._device.set_target(humidity)

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Turn the device on."""
        await self._device.turn_on()

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Turn the device off."""
        await self._device.turn_off()
```
