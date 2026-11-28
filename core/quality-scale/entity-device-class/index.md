# 使用设备类

> 黄金级规则 entity-device-class：实体（entity）在适用的地方都会使用设备类（device class）。

Source: https://www.hasscn.top/contributors/core/quality-scale/entity-device-class/

这是一条黄金级（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `entity-device-class`。

实体（entity）在适用的地方使用[设备类（device class）](https://www.hasscn.top/contributors/glossary/device-class/)。温度传感器使用 `SensorDeviceClass.TEMPERATURE`，门磁传感器使用 `BinarySensorDeviceClass.DOOR`，固件更新使用 `UpdateDeviceClass.FIRMWARE`。[实体页面](https://www.hasscn.top/contributors/core/entities/)列出了每个平台可用的设备类。

## 为什么这很重要

设备类告诉 Home Assistant 一个实体测量或代表什么，许多功能都建立在此基础之上：

- 只有在设备类已知的情况下，用户才能将传感器切换为其他单位，例如从 °C 切换为 °F。
- Assist 可以回答“客厅的温度是多少？”。
- Google Assistant 和 Amazon Alexa 知道如何公开该实体。
- 前端会选择合适的图标，并以正确的方式显示状态，例如对于门，显示“打开”而不是“开启”。
- 实体可以按其设备类命名，因此它们自身无需翻译。

## 示例

此传感器使用温度设备类。它没有自己的名称，因此以设备类命名：“My device Temperature”。

```python
class MyTemperatureSensor(SensorEntity):
    """The temperature of My device."""

    _attr_has_entity_name = True
    _attr_device_class = SensorDeviceClass.TEMPERATURE
    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS

    def __init__(self, device: MyDevice) -> None:
        """Initialize the sensor."""
        self._attr_unique_id = f"{device.serial}_temperature"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.serial)},
            name="My device",
        )
```

## 检查方式

- 当翻译键仅重复设备类已提供的名称时，Pylint 会发出警告（`home-assistant-redundant-translation-key`）。
- 设备类是否合适，以及是否缺少设备类，将在代码审查中检查。

## 例外情况

如果集成（integration）没有实体，或者其实体位于没有设备类的平台上，例如 `light`、`tts` 或 `conversation`，则此规则不适用。

## 相关规则

- [has-entity-name](https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/)：使用 has_entity_name。
- [entity-translations](https://www.hasscn.top/contributors/core/quality-scale/entity-translations/)：翻译实体名称。
- [icon-translations](https://www.hasscn.top/contributors/core/quality-scale/icon-translations/)：使用图标翻译。
