# 分配实体类别

> 金牌（Gold）规则 entity-category：配置类和诊断类实体会拥有实体类别。

Source: https://www.hasscn.top/contributors/core/quality-scale/entity-category/

这是一条金牌（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `entity-category`。

不属于设备主要用途的实体（entity）会获得[实体类别（entity category）](https://www.hasscn.top/contributors/glossary/entity-category/)。共有两种：

- `EntityCategory.CONFIG`：更改设备配置的实体，例如用于关闭状态指示灯的开关。
- `EntityCategory.DIAGNOSTIC`：显示设备本身信息的实体，例如信号强度、运行时间或固件版本。

而作为用户拥有设备之原因的实体（例如温控器的温度）则保持默认设置：无类别。

## 为什么重要

Home Assistant 使用类别来决定实体显示在哪里。自动生成的仪表盘（dashboard）不会包含配置类和诊断类实体，并且设备页面会将它们显示在各自的独立区域中。如果没有类别，传感器的信号强度就会出现在每个用户仪表盘上温度的旁边。

## 示例

```python
class MySignalStrengthSensor(SensorEntity):
    """The signal strength of My device."""

    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.SIGNAL_STRENGTH
```

如果使用实体描述（entity descriptions），请改为在描述上设置 `entity_category`。

## 如何检查

在审查（review）中检查。

## 例外情况

如果集成（integration）没有实体，或者其所有实体都是不适合设置类别的主要实体，则此规则不适用。
