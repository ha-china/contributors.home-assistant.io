# 日期时间实体

> 构建一个日期时间实体，让人们能够在设备上设置一个时间点，例如充电会话开始的时间。

Source: https://www.hasscn.top/contributors/core/entities/datetime/

日期时间（date and time）实体（entity）让人们能够在设备或服务上设置一个完整的时间点，即一个带有一天中时间的日期。想想充电会话开始的时刻，或者洗碗机必须完成的时间。请继承 `homeassistant.components.datetime` 中的 `DateTimeEntity`。

只需要日期？请使用[日期（date）](https://www.hasscn.top/contributors/core/entities/date/)实体。只需要每天重复的一天中某个时间，例如起床时间？请使用[时间（time）](https://www.hasscn.top/contributors/core/entities/time/)实体。如果这个时刻是设备只上报的内容，例如它最后一次启动的时间？那它就是一个带有 `timestamp` 设备类别（device class）的[传感器（sensor）](https://www.hasscn.top/contributors/core/entities/sensor/)。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `native_value` | `datetime.datetime \| None` | 必需 | 当前的日期和时间。必须包含时区。 |

日期时间实体没有设备类别，也没有状态属性（state attribute）：两者都是固定的，并且始终为 `None`。每个实体都具有的通用属性，例如 `name`、`available` 和 `unique_id`，位于[实体类（entity class）](https://www.hasscn.top/contributors/core/entities/entity-class/)上。

## 支持的功能

此实体没有支持的功能。

## 方法

### 设置值

当有人在 UI 中选择日期和时间，或者自动化（automation）或脚本调用 `datetime.set_value` 动作（action）时，此方法会被调用。请实现两者之一。

```python
class MyDateTime(DateTimeEntity):
    # Implement one of these methods.

    def set_value(self, value: datetime) -> None:
        """Set a new date and time."""

    async def async_set_value(self, value: datetime) -> None:
        """Set a new date and time."""
```

你获得的值始终带有时区。当动作接收到没有时区的日期和时间时，它会使用 Home Assistant 配置中的时区。

## 状态

状态是 `native_value` 转换为 UTC 后、以带秒数的 ISO 8601 格式表示的值，例如 `2026-12-24T17:30:00+00:00`。当 `native_value` 为 `None` 时，状态为 `unknown`。

没有时区的 `native_value` 会在写入状态时引发 `ValueError`。请使用 `homeassistant.util.dt` 中的辅助函数来获取带时区的值，例如 `dt_util.as_local()` 或 `dt_util.utcnow()`。

## 示例

```python
from datetime import datetime

from homeassistant.components.datetime import DateTimeEntity


class ExampleChargeStart(DateTimeEntity):
    """When the next charging session starts."""

    _attr_has_entity_name = True
    _attr_translation_key = "charge_start"

    def __init__(self, charger: ExampleCharger) -> None:
        """Initialize the date and time entity."""
        self._charger = charger
        self._attr_unique_id = f"{charger.serial}_charge_start"
        self._attr_native_value = charger.charge_start

    async def async_set_value(self, value: datetime) -> None:
        """Set when the next charging session starts."""
        await self._charger.set_charge_start(value)
        self._attr_native_value = value
        self.async_write_ha_state()
```
