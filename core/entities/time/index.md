# 时间实体

> 构建一个时间实体，让人们可以在设备上设置一天中的某个时间，例如唤醒时间。

Source: https://www.hasscn.top/contributors/core/entities/time/

时间实体（time entity）让人们可以在设备或服务上设置一天中的某个时间，而不带日期。想想闹钟响起的时间，或者供暖计划切换到夜间模式的时间。请继承 `homeassistant.components.time` 中的 `TimeEntity`。

需要一个带日期的特定时刻？请使用[日期和时间](https://www.hasscn.top/contributors/core/entities/datetime/)实体。只需要日期？请使用[日期](https://www.hasscn.top/contributors/core/entities/date/)实体。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `native_value` | `datetime.time \| None` | `None` | 当前的时刻。 |

时间实体没有设备类别（device class），也没有状态属性：两者都是固定的，并且始终为 `None`。每个实体都具有的通用属性，例如 `name`、`available` 和 `unique_id`，位于[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)上。

## 支持的功能

此实体不支持任何功能。

## 方法

### 设置值

当有人在 UI 中选择一个时间，或者自动化（automation）或脚本调用 `time.set_value` 动作（action）时，该方法会被调用。实现两者之一即可。

```python
class MyTime(TimeEntity):
    # Implement one of these methods.

    def set_value(self, value: time) -> None:
        """Set a new time."""

    async def async_set_value(self, value: time) -> None:
        """Set a new time."""
```

## 状态

状态为 ISO 8601 格式的 `native_value`，例如 `07:30:00`。当 `native_value` 为 `None` 时，状态为 `unknown`。

## 示例

```python
from datetime import time

from homeassistant.components.time import TimeEntity
from homeassistant.const import EntityCategory


class ExampleWakeUpTime(TimeEntity):
    """The time the alarm clock goes off."""

    _attr_has_entity_name = True
    _attr_translation_key = "wake_up_time"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, device: ExampleDevice) -> None:
        """Initialize the time entity."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_wake_up_time"
        self._attr_native_value = device.wake_up_time

    async def async_set_value(self, value: time) -> None:
        """Set the wake-up time."""
        await self._device.set_wake_up_time(value)
        self._attr_native_value = value
        self.async_write_ha_state()
```
