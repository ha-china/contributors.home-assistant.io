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

类型分为两层。物理类型 `PRESS_START` 和 `PRESS_END` 描述按钮按下和释放。手势类型描述设备从按压中得出的结论。

| 事件类型 | 层 | 含义 |
| --- | --- | --- |
| `PRESS_START` | 物理 | 按钮被按下。仅当设备对每次按压都报告时才使用。 |
| `PRESS_END` | 物理 | 按钮在设备未归类为长按的按压后被释放。 |
| `LONG_PRESS_START` | 手势 | 按钮达到保持阈值并且仍处于按下状态。每次保持触发一次。 |
| `LONG_PRESS_END` | 手势 | 按钮在设备归类为长按的按压后被释放。 |
| `SINGLE_PRESS` | 手势 | 设备得出结论，恰好发生了一次短按。 |
| `MULTI_PRESS` | 手势 | 设备完成了对两次或更多次按压的计数。长按不计入。 |

`MULTI_PRESS` 包含一个 `press_count` 属性（`ATTR_PRESS_COUNT` 常量），表示按压次数。仅在 `event_types` 中同时列出 `SINGLE_PRESS` 时才列出 `MULTI_PRESS`。报告双击但从不报告已解析的单按的设备，将其双击保留为非标准事件类型。

在映射设备的事件时：

- 将设备的一个事件映射到一个标准事件。不要抑制、延迟或合成事件，也不要运行定时器。
- 仅当某个类型对您在该名称下触发的每个事件都成立时，才在 `event_types` 中列出该类型。
- 同时报告释放和已解析的单按的设备会触发两者，即 `PRESS_END` 和 `SINGLE_PRESS`。
- 每次按压发送一个事件的设备根据该事件的内容进行映射。在按钮按下时发送，则为 `PRESS_START`。在按钮释放时发送，则为 `PRESS_END`。报告为已完成的按压（如去抖后或通过云服务），则为 `SINGLE_PRESS`。如有疑问，请使用 `SINGLE_PRESS`。
- 在达到阈值时报告的保持为 `LONG_PRESS_START`。在释放后报告的保持为 `LONG_PRESS_END`。
- 仅在 `LONG_PRESS_START` 之后保留本地状态以将释放分类为 `PRESS_END` 或 `LONG_PRESS_END`，或在设备重复报告时触发一次 `LONG_PRESS_START`。

对于报告来自单一来源的方向的按钮（如上下翘板开关），建议每个方向使用一个实体。当单独实体不切实际时，非标准的 `direction` 属性是可以接受的。其他非标准事件类型也允许。

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
