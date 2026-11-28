# 图标

> 在 icons.json 中使用图标翻译（icon translations）为实体提供跟随其状态变化的图标，以及何时应改用 icon 属性。

Source: https://www.hasscn.top/contributors/core/entities/icons/

每个实体（entity）都有一个图标。Home Assistant 使用 [Material Design Icons](https://pictogrammers.com/library/mdi/)，写作 `mdi:` 加上图标名称，例如 `mdi:water-pump`。

在大多数情况下，你不需要做任何事情。Home Assistant 会根据实体的域（domain）、设备类别（device class）和状态（state）来选择图标：门磁传感器会显示一扇开着的或关着的门，温度传感器会显示一支温度计。如果这些默认图标合适，就沿用它们。它们能让你的实体看起来和其他同类实体一样，帮助用户快速找到方向。

当你的实体需要自己的图标时，请使用图标翻译。无论你选择什么图标，用户始终可以在实体设置中设置自己的图标，并且以他们的设置为准。

## 图标翻译

图标翻译将[翻译键（translation key）](https://www.hasscn.top/contributors/glossary/translation-key/)映射到图标，存放在集成（integration）的 `strings.json` 旁边的 `icons.json` 文件中。它们的工作方式类似于状态翻译，但给出的是图标而不是文字。

```json
{
  "entity": {
    "sensor": {
      "moon_phase": {
        "default": "mdi:moon-full",
        "state": {
          "new_moon": "mdi:moon-new",
          "first_quarter": "mdi:moon-first-quarter",
          "last_quarter": "mdi:moon-last-quarter"
        }
      }
    }
  }
}
```

实体通过其翻译键来使用它：

```python
class MoonPhaseSensor(SensorEntity):
    _attr_has_entity_name = True
    _attr_translation_key = "moon_phase"
```

- `default` 在没有任何状态匹配时使用。如果没有它，实体会回退到其域和设备类别的图标。
- `state` 将状态映射到图标。状态键与所有翻译键一样采用 `snake_case` 格式。不要在这里重复默认图标：与默认图标相同的状态图标没有任何意义。

### 数值状态的图标

对于数值状态，例如电池电量或填充百分比，请使用 `range` 而不是列出每个值。这些键是按升序排列的数字。前端会选择不超过当前值的最高键所对应的图标，对于低于最低键的值则使用 `default`。

```json
{
  "entity": {
    "sensor": {
      "tank_level": {
        "default": "mdi:gauge-empty",
        "range": {
          "25": "mdi:gauge-low",
          "50": "mdi:gauge",
          "90": "mdi:gauge-full"
        }
      }
    }
  }
}
```

`state` 中的精确匹配仍然优先于 `range`。

### 状态属性的图标

某些属性会在前端显示图标，例如空调（climate）实体的预设模式或风扇模式。将它们添加在 `state_attributes` 之下，使用相同的 `default`、`state` 和 `range` 键：

```json
{
  "entity": {
    "climate": {
      "heat_pump": {
        "state_attributes": {
          "preset_mode": {
            "default": "mdi:thermostat",
            "state": {
              "vacation": "mdi:beach",
              "night": "mdi:weather-night"
            }
          }
        }
      }
    }
  }
}
```

这只对前端以图标形式显示的属性有效。它无法为任意属性提供图标。

## icon 属性

你也可以设置 `icon` 属性，即 `_attr_icon`。它会覆盖图标翻译、设备类别和实体的状态。由于它是代码，因此可以依赖任何内容：

```python
from homeassistant.util import dt as dt_util


class ExampleSensor(SensorEntity):
    @property
    def icon(self) -> str:
        """Show a moon at night."""
        if dt_util.now().hour < 7:
            return "mdi:weather-night"
        return "mdi:weather-sunny"
```

请优先使用图标翻译。它们将图标排除在状态对象之外，因此图标不会在每次状态变化时写入数据库，而且前端可以在状态发生之前就为该状态显示正确的图标，例如在历史记录中或在状态选择器中。`icon` 属性无法为状态属性提供图标。

## 针对实体平台

实体平台（entity platform），例如 `sensor` 或 `light`，会在自己的 `icons.json` 中、`entity_component` 之下定义其域的默认图标。`_` 键是该域的默认值，其他键则是设备类别。只有在你开发该域本身时才需要改动这些内容。

有关图标在界面中的外观和行为，请参阅设计（Design）区域中的[状态图标](https://www.hasscn.top/contributors/design/components/state-icon/)。
