# 创建设备

> 黄金规则 devices：实体归入设备，并填写完整的设备信息。

Source: https://www.hasscn.top/contributors/core/quality-scale/devices/

这是一条黄金规则（Gold rule）。在 `quality_scale.yaml` 中，它被称为 `devices`。

该集成会创建[设备（device）](https://www.hasscn.top/contributors/glossary/device/)并将其实体（entity）添加到其中。一个设备代表一个物理设备，或一项服务（service）。请尽可能完整地填写集成所能提供的设备信息：名称、制造商、型号、序列号、软件和硬件版本，以及能让设备被识别的连接信息和标识符。

## 为什么重要

人们以设备而非实体来思考。他们添加到 Home Assistant 的是一个温控器或一项天气服务，而不是一排传感器。设备将这些实体归拢在一处，其设备页面会展示该设备是什么，以及它运行着哪个固件。

完整的设备信息在其他方面也有回报。序列号和型号能帮助用户和支持人员找到正确的设备，而像 MAC 地址这样的连接信息则能让其他集成和发现机制识别出同一设备。

## 示例

在实体上设置 `_attr_device_info`。具有相同标识符的实体会归入同一个设备：

```python
class MySensor(SensorEntity):
    """A sensor of My device."""

    _attr_has_entity_name = True

    def __init__(self, device: MyDevice) -> None:
        """Initialize the sensor."""
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device.serial)},
            connections={(CONNECTION_NETWORK_MAC, device.mac)},
            name=device.name,
            manufacturer="My Company",
            model="My Sensor",
            model_id="ABC-123",
            serial_number=device.serial,
            sw_version=device.firmware,
            hw_version=device.revision,
        )
```

位于集线器（hub）之后的设备可以通过 `via_device_id`（即集线器的设备注册表 ID）指向该集线器。当设备是一项服务而非物理设备时，例如天气服务或云账户，请添加 `entry_type=DeviceEntryType.SERVICE`。

大多数集成会在 `entity.py` 中的一个共享基础实体里一次性设置设备信息。参见 [common-modules](https://www.hasscn.top/contributors/core/quality-scale/common-modules/)。

## 如何检查

在代码审查（review）中检查。设备信息必须是 `DeviceInfo`，而不是普通的字典。Home Assistant 目前仍然接受字典，但只有 mypy 会拒绝它，且仅在集成已启用类型标注时才会如此。参见[通过实体注册设备](https://www.hasscn.top/contributors/core/integrations/device-registry/#register-a-device-through-an-entity)。

## 例外

此规则没有例外。

## 相关规则

- [has-entity-name](https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/)：使用 has_entity_name。
