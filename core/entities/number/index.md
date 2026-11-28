# 数字实体

> 构建一个数字实体（number entity），让人们可以在设备上设置一个数值，例如目标档位或超时时间。

Source: https://www.hasscn.top/contributors/core/entities/number/

数字实体（number entity）让人们可以设置一个数值：音量大小、以秒为单位的超时时间、温度偏移量，或者汽车充电器的最大充电电流。请继承 `homeassistant.components.number` 中的 `NumberEntity`。

请将它用于人们_设置_的值。设备只报告的值应该是一个[传感器（sensor）](https://www.hasscn.top/contributors/core/entities/sensor/)。当存在更丰富的平台时，请使用那个平台：恒温器的目标温度应使用[气候（climate）](https://www.hasscn.top/contributors/core/entities/climate/)实体，灯泡的亮度应使用[灯（light）](https://www.hasscn.top/contributors/core/entities/light/)实体。

关于前端如何显示数字，请参见[数字更多信息视图（number more-info view）](https://www.hasscn.top/contributors/design/more-info/number/)。

## 属性

每个承载值的属性都以 `native_` 开头。你以设备使用的单位返回值，基类会将它们转换为用户想要的单位。参见[单位与转换](https://www.hasscn.top/contributors/core/entities/number/#units-and-conversion)。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `native_value` | `float \| None` | `None` | 当前值，以 `native_unit_of_measurement` 为单位。 |
| `native_min_value` | `float` | `0.0` | 可接受的最小值（含该值）。 |
| `native_max_value` | `float` | `100.0` | 可接受的最大值（含该值）。 |
| `native_step` | `float \| None` | `None` | 两个值之间的最小变化量。为 `None` 时，基类会根据范围自行选择一个步长，见下文。 |
| `native_unit_of_measurement` | `str \| None` | `None` | 值所使用的单位。如果你改为对单位进行翻译，则请省略它。 |
| `mode` | `NumberMode` | `NumberMode.AUTO` | 前端显示该控件的方式。 |
| `device_class` | `NumberDeviceClass \| None` | `None` | 该数字测量的是什么。参见[设备类型](https://www.hasscn.top/contributors/core/entities/number/#device-classes)。 |

在没有 `native_step` 的情况下，步长初始为 `1.0`。当最小值与最大值之间的范围小于等于 `1.0` 时，基类会将步长除以 10，直到它适合为止。

每个实体都具有的通用属性，例如 `name`、`available` 和 `unique_id`，位于[实体类（entity class）](https://www.hasscn.top/contributors/core/entities/entity-class/)上。不要设置 `unit_of_measurement`、`min_value`、`max_value`、`step` 或 `value`：它们是最终属性，由基类根据 `native_` 属性计算得出。

## 支持的特性

此实体没有支持的特性。

## 模式

| 常量 | 描述 |
| --- | --- |
| `NumberMode.AUTO` | 让前端在滑块和输入框之间自行选择。除非有特殊理由，否则请使用此项。 |
| `NumberMode.BOX` | 始终显示输入框。 |
| `NumberMode.SLIDER` | 始终显示滑块。 |

## 设备类型

数字设备类型与[传感器设备类型](https://www.hasscn.top/contributors/core/entities/sensor/)相同，但不包括 `date`、`enum`、`timestamp` 和 `uptime`。它们是 [`homeassistant/components/number/const.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/number/const.py) 中的 `NumberDeviceClass` 枚举，例如 `NumberDeviceClass.TEMPERATURE`、`NumberDeviceClass.POWER` 或 `NumberDeviceClass.DURATION`。

设置设备类型时，请返回该设备类型所接受的单位。可接受的单位位于同一文件中的 `DEVICE_CLASS_UNITS` 里。设置了设备类型且没有自己名称的数字实体，会使用其设备类型的翻译名称，例如 “Temperature”。参见[实体命名](https://www.hasscn.top/contributors/core/entities/naming/)。

## 单位与转换

对于许多设备类型，基类会在单位之间进行转换：你以原始单位（native unit）工作，而用户看到的是他们自己的单位。支持转换的设备类型是 [`homeassistant/components/number/const.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/number/const.py) 中 `UNIT_CONVERTERS` 的键。

- 原始单位为 °C 或 °F 的 `temperature` 数字实体，会以 Home Assistant 配置中的温度单位显示。
- 用户可以在实体的设置中为数字实体选择其他单位，只要该设备类型支持转换，且两种单位对其都有效。
- 最小值和最大值也会被转换。最小值向下取整，最大值向上取整，因此范围绝不会变窄。步长不会被转换：你设置的 `native_step` 会在用户的单位中原样使用。如果没有设置步长，则会根据转换后的范围推导出步长。
- 当有人设置一个值时，你会以原始单位收到该值。

如果单位是需要翻译的文本，例如 “presses”，请省略 `native_unit_of_measurement`，并在 `strings.json` 中该实体的翻译键下提供单位。同时设置两者会引发错误。参见[让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)。

## 方法

### 设置值

当有人在 UI 中更改该值，或自动化或脚本调用 `number.set_value` 动作时被调用。该值以你的原始单位表示。请实现两者之一。

```python
class MyNumber(NumberEntity):
    # Implement one of these methods.

    def set_native_value(self, value: float) -> None:
        """Set a new value."""

    async def async_set_native_value(self, value: float) -> None:
        """Set a new value."""
```

不要实现 `set_value` 或 `async_set_value`。它们是最终方法，来自旧版 API；重写它们的子类会在日志中得到警告。

## 状态

状态为 `native_value`，当用户的单位与原始单位不同时，会转换到用户的单位。转换后的值保留原始值的小数位数。当 `native_value` 为 `None` 时，状态为 `unknown`。

最小值、最大值、步长和模式是能力属性（capability attributes）：它们会被写入[实体注册表](https://www.hasscn.top/contributors/core/entities/registry/)，但不会包含在 recorder 历史记录中。

## 恢复值

如果你的数字实体将值保存在 Home Assistant 中而不是设备上，那么它需要在重启后恢复。请继承 `RestoreNumber`，而不是 `NumberEntity` 和 `RestoreEntity`。`RestoreEntity` 存储转换后的状态；`RestoreNumber` 存储 `native_` 值，因此你恢复的就是你设置的值。

```python
from homeassistant.components.number import RestoreNumber


class MyNumber(RestoreNumber):
    async def async_added_to_hass(self) -> None:
        """Restore the last value."""
        await super().async_added_to_hass()
        if (data := await self.async_get_last_number_data()) is not None:
            self._attr_native_value = data.native_value
```

`async_get_last_number_data()` 返回最近的 `native_value`、`native_min_value`、`native_max_value`、`native_step` 和 `native_unit_of_measurement`，如果没有可恢复的内容则返回 `None`。关于 `async_added_to_hass` 何时运行，参见[实体生命周期](https://www.hasscn.top/contributors/core/entities/lifecycle/)。

## 示例

```python
from homeassistant.components.number import (
    NumberDeviceClass,
    NumberEntity,
    NumberMode,
)
from homeassistant.const import EntityCategory, UnitOfElectricCurrent


class ExampleChargeCurrent(NumberEntity):
    """The maximum charge current of a car charger."""

    _attr_has_entity_name = True
    _attr_translation_key = "max_charge_current"
    _attr_device_class = NumberDeviceClass.CURRENT
    _attr_entity_category = EntityCategory.CONFIG
    _attr_mode = NumberMode.SLIDER
    _attr_native_min_value = 6
    _attr_native_max_value = 32
    _attr_native_step = 1
    _attr_native_unit_of_measurement = UnitOfElectricCurrent.AMPERE

    def __init__(self, device: ExampleCharger) -> None:
        """Initialize the number."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_max_charge_current"
        self._attr_native_value = device.max_current

    async def async_set_native_value(self, value: float) -> None:
        """Set the maximum charge current."""
        await self._device.set_max_current(int(value))
        self._attr_native_value = value
        self.async_write_ha_state()
```
