# 禁用噪声大或不太常用的实体

> 金牌规则 entity-disabled-by-default：只有少数用户需要的实体默认禁用。

Source: https://www.hasscn.top/contributors/core/quality-scale/entity-disabled-by-default/

这是一条金牌（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `entity-disabled-by-default`。

大多数用户不需要的实体（entity），或者状态（state）变化非常频繁的实体，默认是禁用的。需要它们的用户可以在实体设置中启用。

并没有一份固定的列表来说明哪些实体属于此类。这取决于设备（device）。蓝牙温度传感器的信号强度对大多数人没什么用处，因此默认禁用。而对于一台以测量信号强度为存在目的的设备来说，同一个实体却是主要功能，因此保持启用。

## 为什么重要

Home Assistant 会记录每个已启用实体的历史。每次状态变化都会消耗一定的 CPU、内存和磁盘空间，而噪声大的实体变化非常频繁。将这一点乘以家中的设备数量，开销就会累积起来，尤其是在 Raspberry Pi 这样的小型硬件上。

默认禁用这些实体意味着只有需要它们的用户才承担这些开销。这也让其他用户的实体列表保持易于管理。

## 示例

```python
class MySignalStrengthSensor(SensorEntity):
    """The signal strength of My device."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.DIAGNOSTIC
    _attr_device_class = SensorDeviceClass.SIGNAL_STRENGTH
    _attr_native_unit_of_measurement = SIGNAL_STRENGTH_DECIBELS_MILLIWATT
    _attr_entity_registry_enabled_default = False
```

如果使用实体描述（entity descriptions），请改为在描述上设置 `entity_registry_enabled_default=False`。

该设置仅在实体首次添加到实体注册表时生效。之后再更改它，并不会禁用用户已经拥有的实体。

## 如何检查

通过审查进行检查。

## 例外

如果集成（integration）没有实体，或者其实体中没有任何噪声大或很少使用的实体，则此规则不适用。

## 相关规则

- [appropriate-polling](https://www.hasscn.top/contributors/core/quality-scale/appropriate-polling/)：以合适的间隔进行轮询。
