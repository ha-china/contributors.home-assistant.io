# 移除失效设备

> Gold 规则 stale-devices：已消失的设备会被移除，或者可以由用户自行移除。

Source: https://www.hasscn.top/contributors/core/quality-scale/stale-devices/

这是一条 Gold 规则。在 `quality_scale.yaml` 中，它被称为 `stale-devices`。

当设备从集成所连接的集线器（hub）或账户中移除时，集成也会将其从 Home Assistant 中移除。只有在确定设备已经消失时才移除它，例如集线器返回了完整的设备列表，而该设备已不在其中。

当集成无法确定时，它会实现 `async_remove_config_entry_device`，这样用户就可以自行从设备页面删除该设备。

## 为什么重要

一台已经不存在、但仍以不可用实体（entity）的形式出现在 Home Assistant 中的设备，只是无用的杂物。它会出现在设备列表、仪表盘（dashboard）和 Assist 中，而用户却无法摆脱它。

移除设备也会移除其实体，因此集成可以彻底清理自身。

## 示例

当服务返回所有设备时，将新列表与之前的列表进行比较，并移除已消失的设备。在协调器（coordinator）的 `__init__` 中将 `previous_devices` 初始化为空集合，这样第一次刷新时就有可以比较的内容：

```python
def __init__(
    self, hass: HomeAssistant, config_entry: MyConfigEntry, client: MyClient
) -> None:
    """Initialize the coordinator."""
    super().__init__(
        hass,
        _LOGGER,
        config_entry=config_entry,
        name=DOMAIN,
        update_interval=timedelta(minutes=1),
    )
    self.client = client
    self.previous_devices: set[str] = set()

async def _async_update_data(self) -> dict[str, MyDevice]:
    """Fetch the devices, and remove the ones that are gone."""
    try:
        data = await self.client.get_devices()
    except MyConnectionError as err:
        raise UpdateFailed(
            translation_domain=DOMAIN,
            translation_key="update_failed",
        ) from err

    if stale_devices := self.previous_devices - set(data):
        device_registry = dr.async_get(self.hass)
        for device_id in stale_devices:
            if device := device_registry.async_get_device_by_identifier(
                (DOMAIN, device_id), self.config_entry.entry_id
            ):
                device_registry.async_remove_device(device.id)

    self.previous_devices = set(data)
    return data
```

该集合保存在内存中，因此每次加载配置条目（config entry）时它都是空的。在 Home Assistant 停止期间消失的设备不会在其中，这种比较也无法将其移除。为了也能处理这种情况，可以将该列表与设备注册表（device registry）中该配置条目的设备进行比较，例如通过 `dr.async_entries_for_config_entry` 获取。

当集成只接收设备的更新而没有完整列表时，可以让用户移除已经没有响应的设备。当 `__init__.py` 中包含 `async_remove_config_entry_device` 时，Home Assistant 会在设备页面上显示删除选项。返回 `True` 以允许移除：

```python
async def async_remove_config_entry_device(
    hass: HomeAssistant,
    entry: MyConfigEntry,
    device_entry: dr.DeviceEntry,
) -> bool:
    """Allow removing a device that no longer reports."""
    known_devices = entry.runtime_data.data
    return not any(
        identifier[0] == DOMAIN and identifier[1] in known_devices
        for identifier in device_entry.identifiers
    )
```

## 如何检查

在审查中检查。

## 例外情况

每个配置条目只有一个固定设备、且该设备随配置条目一起创建和删除的集成，可豁免此规则。

## 相关规则

- [dynamic-devices](https://www.hasscn.top/contributors/core/quality-scale/dynamic-devices/)：自动添加新设备。
