---
title: 二元传感器实体
description: 报告只有开或关两种状态的事物，例如打开的门或检测到的移动。
sidebarLabel: 二元传感器
sidebarGroup: 传感器与状态
---

二元传感器（binary sensor）报告两种状态之一：开或关。开和关的具体含义取决于其设备类（device class）：门是打开或关闭，烟雾探测器是检测到烟雾或无异常，电池是电量低或正常。请继承自 `BinarySensorEntity`，它从 `homeassistant.components.binary_sensor` 导入。

当值恰好只有两种状态且用户无法更改时，使用二元传感器。如果用户可以打开和关闭它，请使用[开关（switch）](/core/entities/switch/)。如果它有两种以上的状态，请使用带有 `enum` 设备类的[传感器（sensor）](/core/entities/sensor/)。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `is_on` | `bool \| None` | 必需 | 二元传感器是否处于开启状态。`None` 表示状态未知。 |
| `device_class` | `BinarySensorDeviceClass \| None` | `None` | 二元传感器检测的内容。参见[设备类](#device-classes)。 |

每个实体都具有的通用属性，例如 `name` 或 `available`，请参见[实体类](/core/entities/entity-class/)。

二元传感器不能使用 `config` [实体类别（entity category）](/glossary/entity-category/)：Home Assistant 会拒绝添加它。

## 支持的功能

此实体没有支持的功能。

## 设备类

The [device class](/glossary/device-class/) changes how the frontend shows on and off, and which icon the entity gets. A binary sensor with a device class and no name is named after its device class. See [naming](/core/entities/naming/). The value column is what you put in YAML, for example as `device_class` of an [MQTT binary sensor](https://www.home-assistant.io/integrations/binary_sensor.mqtt/) or a [template binary sensor](https://www.home-assistant.io/integrations/template/).

| Device class | Value | On means | Off means |
| --- | --- | --- | --- |
| `BATTERY` | `battery` | Low | Normal |
| `BATTERY_CHARGING` | `battery_charging` | Charging | Not charging |
| `CO` | `carbon_monoxide` | Carbon monoxide detected | Clear |
| `COLD` | `cold` | Cold | Normal |
| `CONNECTIVITY` | `connectivity` | Connected | Disconnected |
| `DOOR` | `door` | Open | Closed |
| `GARAGE_DOOR` | `garage_door` | Open | Closed |
| `GAS` | `gas` | Gas detected | Clear |
| `GLASS_BREAK` | `glass_break` | Glass break detected | Clear |
| `HEAT` | `heat` | Hot | Normal |
| `LIGHT` | `light` | Light detected | No light |
| `LOCK` | `lock` | Unlocked | Locked |
| `MOISTURE` | `moisture` | Wet | Dry |
| `MOTION` | `motion` | Motion detected | Clear |
| `MOVING` | `moving` | Moving | Stopped |
| `OCCUPANCY` | `occupancy` | Occupied | Clear |
| `OPENING` | `opening` | Open | Closed |
| `PLUG` | `plug` | Plugged in | Unplugged |
| `POWER` | `power` | Power detected | No power |
| `PRESENCE` | `presence` | Home | Away |
| `PROBLEM` | `problem` | Problem detected | OK |
| `RUNNING` | `running` | Running | Not running |
| `SAFETY` | `safety` | Unsafe | Safe |
| `SMOKE` | `smoke` | Smoke detected | Clear |
| `SOUND` | `sound` | Sound detected | Clear |
| `TAMPER` | `tamper` | Tampering detected | Clear |
| `UPDATE` | `update` | Update available | Up to date |
| `VIBRATION` | `vibration` | Vibration detected | No vibration |
| `WINDOW` | `window` | Open | Closed |

设备类定义在 `homeassistant/components/binary_sensor/const.py` 的 `BinarySensorDeviceClass` 中。

请避免使用 `UPDATE` 设备类。要报告有新的固件或软件可用，请改用[更新实体（update entity）](/core/entities/update/)。

## 方法

二元传感器没有操作（action），因此除了保持 `is_on` 为最新之外，无需实现其他内容。可以在 `update` 或 `async_update` 中获取数据，或通过 `async_write_ha_state` 推送数据。参见[更新状态](/core/entities/state-updates/)。

## 状态

基类会根据 `is_on` 设置状态：`True` 对应 `on`，`False` 对应 `off`，`None` 对应 `unknown`。不要自行设置 `state`。

## 示例

一个从设备接收推送更新的移动探测器：

```python
from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)


class ExampleMotionSensor(BinarySensorEntity):
    """Motion detector of an example device."""

    _attr_has_entity_name = True
    _attr_device_class = BinarySensorDeviceClass.MOTION
    _attr_should_poll = False

    def __init__(self, device: ExampleDevice) -> None:
        """Initialize the binary sensor."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_motion"

    async def async_added_to_hass(self) -> None:
        """Subscribe to motion updates."""
        self.async_on_remove(
            self._device.subscribe_motion(self._handle_motion)
        )

    def _handle_motion(self, detected: bool) -> None:
        """Handle a motion update from the device."""
        self._attr_is_on = detected
        self.async_write_ha_state()
```

该实体没有名称，因此根据其设备类命名为："Motion"。
