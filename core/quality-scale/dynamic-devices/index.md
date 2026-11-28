# 自动添加新设备

> Gold 规则 dynamic-devices：设置后出现的设备无需重新加载即可自动添加。

Source: https://www.hasscn.top/contributors/core/quality-scale/dynamic-devices/

这是一条 Gold 规则。在 `quality_scale.yaml` 中，它被称为 `dynamic-devices`。

当集成（integration）设置完成后出现新设备（device）时，例如配对到集线器的新灯具或添加到云账户的新设备，集成会自行创建其实体（entity）。用户无需重新加载集成或重启 Home Assistant。

## 为什么这很重要

用户将设备添加到集线器或账户后，期望它出现在 Home Assistant 中。而用户必须知道需要重新加载、以及到哪里找到重新加载选项，这正是 Gold 级别要消除的摩擦。

这是 [stale-devices](https://www.hasscn.top/contributors/core/quality-scale/stale-devices/) 的另一面：设备来来去去，Home Assistant 跟随变化。

## 示例

借助[协调器](https://www.hasscn.top/contributors/glossary/coordinator/)，跟踪平台已知的设备。协调器上的监听器在每次更新后运行，并为新设备添加实体：

```python
async def async_setup_entry(
    hass: HomeAssistant,
    entry: MyConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the sensors of My integration."""
    coordinator = entry.runtime_data
    known_devices: set[str] = set()

    @callback
    def _add_new_devices() -> None:
        new_devices = set(coordinator.data) - known_devices
        if not new_devices:
            return

        known_devices.update(new_devices)
        async_add_entities(
            MySensor(coordinator, device_id) for device_id in new_devices
        )

    _add_new_devices()
    entry.async_on_unload(coordinator.async_add_listener(_add_new_devices))
```

当配置条目（config entry）卸载时，监听器会通过 `entry.async_on_unload` 被移除。

在此示例中，`known_devices` 只在条目加载期间增长。当集成同时移除已消失的设备时（如 [stale-devices](https://www.hasscn.top/contributors/core/quality-scale/stale-devices/) 所述），稍后重新出现的设备仍保留在 `known_devices` 中，其实体在条目重新加载之前不会被再次添加。同时也应从 `known_devices` 中移除已删除的设备，这样它们在重新出现时会被视为新设备。

## 如何检查

在代码审查中检查。

## 例外情况

对于每个配置条目只有一个固定设备的集成，如果该设备随配置条目一同创建和移除，则可豁免此规则。

## 相关规则

- [stale-devices](https://www.hasscn.top/contributors/core/quality-scale/stale-devices/)：移除失效设备。
