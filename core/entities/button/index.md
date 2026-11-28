# 按钮实体

> 构建一个按钮实体，用于触发设备或服务上的单个操作，例如重启。

Source: https://www.hasscn.top/contributors/core/entities/button/

按钮实体（button entity）会触发设备或服务上的一个操作：重启设备、通过闪烁灯光来识别设备、重置滤芯计数器，或者煮一杯咖啡。它自身没有开或关的状态。请继承 `homeassistant.components.button` 中的 `ButtonEntity`。

按钮是 Home Assistant 中的一个虚拟按钮。它并不适合所有看起来像按钮的东西：

- 按下后会保持开启或关闭状态的东西是[开关（switch）](https://www.hasscn.top/contributors/core/entities/switch/)。
- 人们按下的设备上的物理按钮是[事件（event）](https://www.hasscn.top/contributors/core/entities/event/)实体。按钮实体无法报告发生在 Home Assistant 之外的按压操作。
- 安装固件应属于[更新（update）](https://www.hasscn.top/contributors/core/entities/update/)实体。

## 属性

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `device_class` | `ButtonDeviceClass \| None` | `None` | 按钮的功能。参见[设备类](https://www.hasscn.top/contributors/core/entities/button/#device-classes)。 |

按钮没有特定平台的状态属性。每个实体都具有的通用属性，例如 `name`、`available` 和 `unique_id`，位于[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)上。按钮不会轮询：`should_poll` 默认为 `False`。

## 支持的功能

此实体没有支持的功能。

## 设备类

| 常量 | 描述 |
| --- | --- |
| `ButtonDeviceClass.IDENTIFY` | 识别设备，例如通过闪烁灯光或发出声音。 |
| `ButtonDeviceClass.RESTART` | 重启设备。 |
| `ButtonDeviceClass.UPDATE` | 更新设备的软件。请避免使用：应改用[更新（update）](https://www.hasscn.top/contributors/core/entities/update/)实体。 |

带有设备类且没有自己名称的按钮会获得其设备类的翻译名称，例如“重启”。参见[实体命名](https://www.hasscn.top/contributors/core/entities/naming/)。

识别按钮通常不是设备的主要功能。请为它设置 `EntityCategory.DIAGNOSTIC` [实体类别](https://www.hasscn.top/contributors/glossary/entity-category/)。

## 方法

### 按下

当有人在 UI 中按下按钮，或者自动化或脚本调用 `button.press` 动作时被调用。请实现两者之一。

```python
class MyButton(ButtonEntity):
    # Implement one of these methods.

    def press(self) -> None:
        """Handle the button press."""

    async def async_press(self) -> None:
        """Handle the button press."""
```

## 状态

按钮的状态是从 Home Assistant 中最后一次按下它的时间戳，以 UTC 的 ISO 8601 字符串表示。在第一次按下之前，它为 `unknown`。基类会在调用你的按下方法之前设置它，并在重启后恢复它。你不能自己设置它：`state` 是 final 的。

## 示例

```python
from homeassistant.components.button import (
    ButtonDeviceClass,
    ButtonEntity,
)
from homeassistant.const import EntityCategory


class ExampleRestartButton(ButtonEntity):
    """Restart the device."""

    _attr_has_entity_name = True
    _attr_device_class = ButtonDeviceClass.RESTART
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, device: ExampleDevice) -> None:
        """Initialize the button."""
        self._device = device
        self._attr_unique_id = f"{device.serial}_restart"

    async def async_press(self) -> None:
        """Restart the device."""
        await self._device.restart()
```

由于设置了设备类，这个按钮会被命名为“Restart”，而无需你提供名称或翻译键。
