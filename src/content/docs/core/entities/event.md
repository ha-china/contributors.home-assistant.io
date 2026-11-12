---
title: 事件实体
description: 将物理世界中发生的事情（如按下按钮或门铃响起）转化为可用于自动化的实体。
sidebarLabel: Event
sidebarGroup: Sensors and status
---

事件实体（event entity）捕获在某一时刻发生的事情：遥控器上的按钮被按下、门铃响起、运动传感器触发。它没有自己的持久状态。由您触发事件，Home Assistant 会记录最近一次事件。请继承 `EventEntity`，该类从 `homeassistant.components.event` 导入。

事件实体适用于没有开或关状态的瞬时信号。如果某事物会保持一段时间的状态，比如检测到的运动在一分钟后清除，那么[二进制传感器](/core/entities/binary-sensor/)更合适。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `event_types` | `list[str]` | 必需 | 该实体可以触发的事件类型。 |
| `device_class` | `EventDeviceClass \| None` | `None` | 这些事件属于什么类型。参见[设备类](#device-classes)。 |

每个实体都具有的通用属性（如 `name` 或 `available`）位于[实体类](/core/entities/entity-class/)中。`event_types` 列表是一个能力属性，不会被记录到历史中。

## 支持的功能

此实体没有支持的功能。

## 设备类

| 设备类 | 用途 |
| --- | --- |
| `EventDeviceClass.BUTTON` | 遥控器或墙壁开关上的按钮被按下。 |
| `EventDeviceClass.DOORBELL` | 作为门铃使用的按钮。 |
| `EventDeviceClass.MOTION` | 运动传感器检测到运动。 |

设置了设备类且没有名称的事件实体将以它的设备类命名。参见[命名](/core/entities/naming/)。

### 标准事件类型

一些设备类具有标准事件类型，因此无论由哪个集成提供该实体，同一个自动化都能正常工作。它们是 `homeassistant.components.event` 中的枚举。

`DOORBELL` 实体必须支持 `DoorbellEventType.RING`。如果不支持，Home Assistant 会记录一条警告，并且从 Home Assistant 2027.4 开始，这将停止工作。

`BUTTON` 实体可以使用这些 `ButtonEventType` 值。它们都不是强制性的：只使用您的硬件能够产生的那些。

The types come in two layers. The physical types, `PRESS_START` and `PRESS_END`, describe the button going down and up. The gesture types describe what the device concluded from the presses.

| Event type | Layer | Meaning |
| --- | --- | --- |
| `PRESS_START` | Physical | The button went down. Only use it if the device reports it for every press. |
| `PRESS_END` | Physical | The button was released after a press the device did not classify as long. |
| `LONG_PRESS_START` | Gesture | The button reached the hold threshold and is still down. Fired once per hold. |
| `LONG_PRESS_END` | Gesture | The button was released after a press the device classified as long. |
| `SINGLE_PRESS` | Gesture | The device concluded that exactly one short press happened. |
| `MULTI_PRESS` | Gesture | The device finished counting a series of two or more presses. A long press never counts. |

`MULTI_PRESS` includes a `press_count` attribute (the `ATTR_PRESS_COUNT` constant) with the number of presses. Only list `MULTI_PRESS` in `event_types` if you also list `SINGLE_PRESS`. A device that reports a double press, but never a resolved single press, keeps its double press as a non-standard event type.

When mapping the events of your device:

- Map one event of the device to one standard event. Do not suppress, delay, or synthesize events, and do not run timers.
- Only list a type in `event_types` if its meaning holds for every event you fire under that name.
- A device that reports both the release and the resolved single press fires both, as `PRESS_END` and `SINGLE_PRESS`.
- A device that sends one event per press maps it by what that event is. Sent when the button goes down, it is `PRESS_START`. Sent when the button is released, it is `PRESS_END`. Reported as a completed press, like after a debounce or through a cloud service, it is `SINGLE_PRESS`. When in doubt, use `SINGLE_PRESS`.
- A hold reported when the threshold is reached is `LONG_PRESS_START`. A hold reported after the release is `LONG_PRESS_END`.
- Only keep local state to classify a release as `PRESS_END` or `LONG_PRESS_END` after a `LONG_PRESS_START`, or to fire `LONG_PRESS_START` once when the device repeats it.

For a button that reports a direction from one source, like an up and down rocker, prefer one entity per direction. A non-standard `direction` attribute is acceptable when separate entities are not practical. Other, non-standard event types are allowed too.

## 方法

您不需要实现任何方法。您通过调用 `_trigger_event` 来触发事件，然后写入状态。

### `_trigger_event`

```python
def _trigger_event(
    self, event_type: str, event_attributes: dict[str, Any] | None = None
) -> None:
```

`event_type` 必须在 `event_types` 中，否则调用将引发 `ValueError`。可选的 `event_attributes` 会被添加到状态属性中，与 `event_type` 并列。之后请立即调用 `self.async_write_ha_state()` 以发布该事件。

事件实体会自行在重启后恢复其最近一次事件：它是一个 `RestoreEntity`。

## 状态

状态是最近一次事件触发的时间，以带毫秒的 ISO 8601 时间戳表示。在第一个事件之前，状态为 `unknown`。`event_type` 属性保存最近一次事件的类型，以及您传递的任何属性。

当两个事件在同一毫秒内触发时，基类会将第二个事件向前移动一毫秒，因此每个事件都是其自己的状态变化。

## 示例

一个监听设备的门铃按钮：

```python
from homeassistant.components.event import (
    DoorbellEventType,
    EventDeviceClass,
    EventEntity,
)
from homeassistant.core import callback


class ExampleDoorbell(EventEntity):
    """Doorbell button of an example device."""

    _attr_has_entity_name = True
    _attr_device_class = EventDeviceClass.DOORBELL
    _attr_event_types = [DoorbellEventType.RING]

    def __init__(self, device: ExampleDevice) -> None:
        """Initialize the event entity."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_doorbell"

    async def async_added_to_hass(self) -> None:
        """Listen for rings."""
        self.async_on_remove(self._device.on_ring(self._handle_ring))

    @callback
    def _handle_ring(self) -> None:
        """Handle a ring from the device."""
        self._trigger_event(DoorbellEventType.RING)
        self.async_write_ha_state()
```

通过 `async_on_remove` 注册监听器可确保它在实体移除时被一并移除。参见[实体生命周期](/core/entities/lifecycle/)。
