# 使用 has_entity_name

> 铜牌规则 has-entity-name：实体将 has_entity_name 设置为 True，并以所属设备为上下文进行命名。

Source: https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/

这是一条铜牌（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `has-entity-name`。

集成的每个实体都必须将 `has_entity_name` 设置为 `True`。这样，实体的名称只需描述它是什么，例如“温度”，而 Home Assistant 会在需要的地方把[设备](https://www.hasscn.top/contributors/glossary/device/)的名称放在它前面。设备的主要功能实体将名称设为 `None`，因此它会沿用设备本身的名称。

## 为什么它很重要

有了 `has_entity_name`，Home Assistant 就能知道名称的哪一部分是设备、哪一部分是实体。它可以在设备页面上显示“温度”（因为那里设备本身显而易见），而在所有实体的列表中显示“客厅传感器 温度”。命名方式在所有集成中都是一致的，重命名了设备的用户会在其所有实体上看到新名称。

它也是实体名称翻译的基础，而实体名称翻译是一项金牌（Gold）规则。

## 示例

位于名为“我的设备”的设备上的传感器，其名称为“我的设备 温度”：

```python
class MyTemperatureSensor(SensorEntity):
    """Temperature sensor of a device."""

    _attr_has_entity_name = True
    _attr_translation_key = "temperature"

    def __init__(self, device: MyDevice) -> None:
        """Initialize the sensor."""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.serial_number)},
            name=device.name,
        )
```

作为设备主要功能的锁，其名称为“我的设备”：

```python
class MyLock(LockEntity):
    """The lock of the device."""

    _attr_has_entity_name = True
    _attr_name = None
```

在 `entity.py` 的基础实体（base entity）中设置一次 `_attr_has_entity_name`，你的所有实体都会随之生效。

## 如何检查

Pylint，当该规则标记为 `done` 时：`home-assistant-missing-has-entity-name` 会在实体类未始终将 `has_entity_name` 设置为 `True` 时发出警告——无论设置是在类上、在方法开头，还是通过实体描述（entity description）进行。依赖于条件的值不计入。

## 例外情况

如果集成没有任何实体，则此规则不适用。

## 相关规则

- [entity-translations](https://www.hasscn.top/contributors/core/quality-scale/entity-translations/)：翻译实体名称。
- [entity-device-class](https://www.hasscn.top/contributors/core/quality-scale/entity-device-class/)：使用设备类别（device class）。
- [devices](https://www.hasscn.top/contributors/core/quality-scale/devices/)：创建设备。
