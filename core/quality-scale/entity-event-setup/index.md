# 在实体生命周期中订阅事件

> 铜级规则 entity-event-setup：实体在 async_added_to_hass 中订阅，并在移除时取消订阅。

Source: https://www.hasscn.top/contributors/core/quality-scale/entity-event-setup/

这是一条铜级（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `entity-event-setup`。

当一个[实体（entity）](https://www.hasscn.top/contributors/glossary/entity/)订阅事件时，例如订阅由集成（integration）的库推送的更新，它必须在 `async_added_to_hass` 中订阅，并在被移除时取消订阅。不要在 `__init__` 中订阅。

## 为什么它很重要

Home Assistant 在实体平台注册该实体之后调用 `async_added_to_hass`。从那一刻起，实体就拥有了它所需要的一切，比如 `self.hass` 和 `self.async_write_ha_state`。如果某个回调在这之前触发，并尝试写入状态，则会失败。

取消订阅同样重要。如果一个实体已被移除，或者其配置条目（config entry）已被卸载，但它仍处于订阅状态，它就会继续接收事件。这会导致内存泄漏，并可能为一个已不存在的实体写入状态。

## 示例

最简单的方法是 `async_on_remove`。它接收取消订阅的函数，并在实体被移除时调用该函数，因此你不必自己去跟踪它：

```python
class MySensor(SensorEntity):
    """A sensor that gets pushed updates."""

    def __init__(self, client: MyClient) -> None:
        """Initialize the sensor."""
        self.client = client

    async def async_added_to_hass(self) -> None:
        """Subscribe to updates when added to Home Assistant."""
        await super().async_added_to_hass()
        self.async_on_remove(
            self.client.events.subscribe("update", self._handle_update)
        )

    @callback
    def _handle_update(self, event: MyEvent) -> None:
        """Handle an update from the device."""
        self._attr_native_value = event.value
        self.async_write_ha_state()
```

如果你需要更多的控制，可以改为在 `async_will_remove_from_hass` 中取消订阅。基于 `CoordinatorEntity` 的实体已经为其协调器（coordinator）执行了此操作，因此你只需要针对自己的订阅执行此操作。

## 如何检查

在代码审查（review）中检查。

## 例外情况

如果集成的实体不订阅事件，则此规则不适用。

## 相关规则

- [config-entry-unloading](https://www.hasscn.top/contributors/core/quality-scale/config-entry-unloading/)：支持卸载配置条目。
