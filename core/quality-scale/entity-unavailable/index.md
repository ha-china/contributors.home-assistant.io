# 在适当的时候将实体标记为不可用

> 银级规则 entity-unavailable：当设备或服务无法连接时，实体会变为不可用。

Source: https://www.hasscn.top/contributors/core/quality-scale/entity-unavailable/

这是一条银级（Silver）规则。在 `quality_scale.yaml` 中，它被称为 `entity-unavailable`。

当集成（integration）无法从设备或服务获取数据时，其实体必须变为[不可用](https://www.hasscn.top/contributors/glossary/unavailable/)（unavailable）。当连接正常但某个值暂时缺失时，该实体会改为报告未知状态（`None`），并保持可用。

## 为什么这很重要

设备离线后仍持续显示上一个值的实体是在说谎。当传感器已经三小时无法连接时，客厅早已不是 21 °C 了。不可用状态会告诉用户及其自动化：这个值当前不可信。

## 示例

### 使用 coordinator 时

`CoordinatorEntity` 会为你处理这件事。当[coordinator](https://www.hasscn.top/contributors/glossary/coordinator/)的更新抛出 `UpdateFailed` 时，`last_update_success` 会变为 `False`，coordinator 的所有实体都会变为不可用：

```python
class MyCoordinator(DataUpdateCoordinator[dict[str, MyDevice]]):
    """Fetch data for all devices."""

    async def _async_update_data(self) -> dict[str, MyDevice]:
        try:
            return await self.client.get_devices()
        except MyConnectionError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="update_failed",
            ) from err
```

如果实体需要更多判断，比如当其设备不在数据中时变为不可用，可以将你的检查与 `super().available` 结合：

```python
class MySensor(MyEntity, SensorEntity):
    """A sensor of a device."""

    @property
    def available(self) -> bool:
        """Return if the entity is available."""
        return super().available and self.device_id in self.coordinator.data
```

不要省略 `super().available`。当更新失败时，coordinator 会保留上一次成功更新的数据，因此仅检查 `coordinator.data` 会让实体带着旧数据保持可用。

### 使用 async_update 时

自行更新的实体会设置 `_attr_available`：

```python
async def async_update(self) -> None:
    """Fetch the latest value."""
    try:
        data = await self.client.get_data()
    except MyConnectionError:
        self._attr_available = False
        return

    self._attr_available = True
    self._attr_native_value = data.temperature
```

## 如何检查

- 当 coordinator 实体的 `available` 重写只检查 `coordinator.data`，而忽略上次更新是否成功时，Pylint 会发出警告（`home-assistant-coordinator-entity-available`）。
- 其余部分在审查（review）中检查。

## 例外情况

如果集成没有实体，则此规则不适用。

进入待机状态的设备是一种特殊情况。如果集成有办法在设备处于待机状态时将其打开，例如通过用户定义的自动化或第二通道（如 Wake-on-LAN 或红外发射器），则在设备待机时应将其报告为 `off`，而不是不可用。如果没有这样的办法，且设备在当前状态下无法被控制，则将其报告为不可用。

例如，一个只能通过红外发射器打开的媒体播放器：

- 刚添加时，由于没有连接，它是不可用的。
- 一旦用户设置了打开它的自动化，它在待机时就是 `off`。
- 一旦它被打开且连接恢复，它就是 `on`。

当使用 coordinator 将待机设备报告为不可用时，请抛出 `UpdateFailedUnreachable`，就像对待任何无法连接的设备一样。它是 `UpdateFailed` 的子类，因此实体会以相同方式变为不可用，并且 coordinator 会以 `info` 级别记录日志，正如 [log-when-unavailable](https://www.hasscn.top/contributors/core/quality-scale/log-when-unavailable/) 所要求的那样。

## 相关规则

- [log-when-unavailable](https://www.hasscn.top/contributors/core/quality-scale/log-when-unavailable/)：在变为不可用时记录一次日志，恢复时再记录一次。
