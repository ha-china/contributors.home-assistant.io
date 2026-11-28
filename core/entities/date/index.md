# 日期实体

> 构建一个日期实体，让人们能够在设备上设置一个日历日期，例如假期模式的开始日期。

Source: https://www.hasscn.top/contributors/core/entities/date/

日期实体（date entity）让人们能够在设备或服务（service）上设置一个不含时间的日历日期。比如假期模式开始的日期，或者滤网下次需要更换的日期。请继承 `homeassistant.components.date` 中的 `DateEntity`。

还需要包含一天中的时间？请使用[日期和时间](https://www.hasscn.top/contributors/core/entities/datetime/)实体。只需要一天中的时间？请使用[时间](https://www.hasscn.top/contributors/core/entities/time/)实体。如果这个日期是设备只负责报告的信息，例如它的安装日期？那是一个带有 `date` 设备类别的[传感器](https://www.hasscn.top/contributors/core/entities/sensor/)。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `native_value` | `datetime.date \| None` | 必填 | 当前日期。 |

日期实体没有设备类别，也没有状态属性：两者都是固定的，并且始终为 `None`。每个实体都具有的通用属性，例如 `name`、`available` 和 `unique_id`，位于[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)上。

## 支持的功能

此实体不支持任何功能。

## 方法

### 设置值

当有人在用户界面（UI）中选择一个日期，或者自动化（automation）或脚本调用 `date.set_value` 动作（action）时被调用。两者实现其一即可。

```python
class MyDate(DateEntity):
    # Implement one of these methods.

    def set_value(self, value: date) -> None:
        """Set a new date."""

    async def async_set_value(self, value: date) -> None:
        """Set a new date."""
```

## 状态

状态是 ISO 8601 格式的 `native_value`，例如 `2026-12-24`。当 `native_value` 为 `None` 时，状态为 `unknown`。

## 示例

```python
from datetime import date

from homeassistant.components.date import DateEntity
from homeassistant.const import EntityCategory


class ExampleHolidayStart(DateEntity):
    """The first day of the holiday mode."""

    _attr_has_entity_name = True
    _attr_translation_key = "holiday_start"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, device: ExampleDevice) -> None:
        """Initialize the date entity."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_holiday_start"
        self._attr_native_value = device.holiday_start

    async def async_set_value(self, value: date) -> None:
        """Set the first day of the holiday mode."""
        await self._device.set_holiday_start(value)
        self._attr_native_value = value
        self.async_write_ha_state()
```
