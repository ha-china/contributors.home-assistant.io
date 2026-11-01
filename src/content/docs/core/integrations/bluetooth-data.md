---
title: 获取蓝牙数据
description: 为蓝牙设备选择合适的协调器，并将其广播数据转换为实体。
sidebarGroup: Discovery
order: 4
---

许多蓝牙设备通过广播（advertisement）发送数据：这些反复播发的小数据包，无需任何人与其建立连接即可收到。Home Assistant 提供了由这些广播数据（而非轮询）驱动的协调器（coordinator）。它们的工作方式与[数据更新协调器](/core/integrations/fetching-data/)类似，并会替你处理好可用性（availability）问题。

## 选择协调器

| 你的设备 | 使用 |
| --- | --- |
| 主要是传感器、二进制传感器或事件来源，且所有数据都在广播中 | `PassiveBluetoothProcessorCoordinator` |
| 主要是传感器、二进制传感器或事件来源，但部分数据需要连接 | `ActiveBluetoothProcessorCoordinator` |
| 其他类型的设备，且所有数据都在广播中 | `PassiveBluetoothDataUpdateCoordinator` |
| 其他类型的设备，且部分数据需要连接 | `ActiveBluetoothDataUpdateCoordinator` |
| 仅在有连接时才能工作，不使用广播 | 普通的 [`DataUpdateCoordinator`](/core/integrations/fetching-data/) |

## 处理器协调器

处理器协调器能将类传感器集成的代码缩减到几乎为零。由你的库解析广播数据，你将解析结果转换为 `PassiveBluetoothDataUpdate`，随后框架会在实体（entity）出现时创建并更新它们。

`PassiveBluetoothDataUpdate` 包含四个映射。键为 `PassiveBluetoothEntityKey(key, device_id)`，例如 `PassiveBluetoothEntityKey("temperature", None)`：

| 字段 | 存放的内容 |
| --- | --- |
| `devices` | 每个设备 ID 对应的 `DeviceInfo`。`None` 表示主设备。 |
| `entity_descriptions` | 每个实体键对应的[实体描述](/glossary/entity-description/) |
| `entity_names` | 每个实体键对应的名称 |
| `entity_data` | 每个实体键对应的值 |

### 设置协调器

在 `__init__.py` 中，使用设备的地址和你的库的解析方法创建协调器。在平台设置完成之后再启动它，以便平台可以先订阅：

```python
from homeassistant.components.bluetooth import BluetoothScanningMode
from homeassistant.components.bluetooth.passive_update_processor import (
    PassiveBluetoothProcessorCoordinator,
)

type ExampleConfigEntry = ConfigEntry[PassiveBluetoothProcessorCoordinator]


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up an Example Bluetooth device."""
    assert entry.unique_id is not None
    parser = ExampleParser()

    coordinator = PassiveBluetoothProcessorCoordinator(
        hass,
        _LOGGER,
        address=entry.unique_id,
        mode=BluetoothScanningMode.ACTIVE,
        update_method=parser.update,
    )
    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    # Start after the platforms subscribed
    entry.async_on_unload(coordinator.async_start())
```

`connectable` 在此处默认为 `False`，因此你可以从所有适配器接收广播数据。

### 传感器平台

每个平台注册一个将解析后的数据转换为 `PassiveBluetoothDataUpdate` 的处理器，以及一个实体类：

```python
from homeassistant.components.bluetooth.passive_update_processor import (
    PassiveBluetoothDataProcessor,
    PassiveBluetoothDataUpdate,
    PassiveBluetoothProcessorEntity,
)
from homeassistant.components.sensor import SensorEntity


def sensor_update_to_bluetooth_data_update(
    parsed: ExampleUpdate,
) -> PassiveBluetoothDataUpdate:
    """Turn parsed data into a Bluetooth data update."""
    return PassiveBluetoothDataUpdate(
        devices={None: parsed.device_info},
        entity_descriptions={...},
        entity_data={...},
        entity_names={...},
    )


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the Example Bluetooth sensors."""
    coordinator = entry.runtime_data
    processor = PassiveBluetoothDataProcessor(
        sensor_update_to_bluetooth_data_update
    )

    entry.async_on_unload(
        processor.async_add_entities_listener(
            ExampleBluetoothSensor, async_add_entities
        )
    )
    entry.async_on_unload(coordinator.async_register_processor(processor))


class ExampleBluetoothSensor(PassiveBluetoothProcessorEntity, SensorEntity):
    """A sensor of an Example Bluetooth device."""

    @property
    def native_value(self) -> float | int | str | None:
        """Return the value of the sensor."""
        return self.processor.entity_data.get(self.entity_key)
```

### 按需连接

`ActiveBluetoothProcessorCoordinator` 的工作方式相同，平台无需更改。它添加了两个在广播数据变化时运行的函数：

- `needs_poll_method(service_info, last_poll)`：返回当前是否需要建立连接。`last_poll` 是自上次轮询以来的秒数，或为 `None`。
- `poll_method(service_info)`：连接到设备并返回数据。

```python
def _needs_poll(
    service_info: BluetoothServiceInfoBleak, last_poll: float | None
) -> bool:
    # Only poll when Home Assistant is running, the device needs it,
    # and a connectable adapter can reach it
    return (
        hass.state is CoreState.running
        and parser.poll_needed(service_info, last_poll)
        and bool(
            async_ble_device_from_address(
                hass, service_info.device.address, connectable=True
            )
        )
    )


async def _async_poll(service_info: BluetoothServiceInfoBleak):
    # The advertisement may come from an adapter that cannot connect,
    # so get a connectable BLEDevice for the same address
    if service_info.connectable:
        device = service_info.device
    elif not (
        device := async_ble_device_from_address(
            hass, service_info.device.address, True
        )
    ):
        raise RuntimeError(
            f"No connectable device for {service_info.device.address}"
        )

    return await parser.async_poll(device)


coordinator = ActiveBluetoothProcessorCoordinator(
    hass,
    _LOGGER,
    address=address,
    mode=BluetoothScanningMode.PASSIVE,
    update_method=parser.update,
    needs_poll_method=_needs_poll,
    poll_method=_async_poll,
    # Take advertisements from every adapter, and swap the BLEDevice
    # for a connectable one when polling
    connectable=False,
)
```

请从 `homeassistant.components.bluetooth.active_update_processor` 导入它。

### 请求主动扫描

两种处理器协调器都接受 `scan_interval` 和 `scan_duration` 参数。它们会请求处于 `AUTO` 模式的扫描器每隔 `scan_interval` 秒对该地址进行一次持续 `scan_duration` 秒的主动扫描。有些设备只有在被主动扫描时才会发送完整数据，而当一段时间未被主动扫描后，就会退回到需要连接的状态。请选择一个比该时长更短的 `scan_interval`，以及一个足以捕获下一条广播数据的 `scan_duration`：

```python
coordinator = ActiveBluetoothProcessorCoordinator(
    ...,
    scan_interval=165.0,
    scan_duration=10.0,
)
```

两者默认均为 `None`，这会保持正常的节奏。用户设置为 `PASSIVE` 或 `ACTIVE` 的扫描器不受影响。

## 数据更新协调器

对于并非以传感器为主的设备，例如锁或灯，请使用 `PassiveBluetoothDataUpdateCoordinator`（来自 `passive_update_coordinator`）或 `ActiveBluetoothDataUpdateCoordinator`（来自 `active_update_coordinator`）。继承它们，并在 `_async_handle_bluetooth_event` 中处理广播数据：

```python
from homeassistant.components import bluetooth
from homeassistant.components.bluetooth.active_update_coordinator import (
    ActiveBluetoothDataUpdateCoordinator,
)
from homeassistant.core import CoreState, callback


class ExampleCoordinator(ActiveBluetoothDataUpdateCoordinator[None]):
    """Handle the data of an Example lock."""

    def __init__(
        self,
        hass: HomeAssistant,
        ble_device: BLEDevice,
        device: ExampleLock,
    ) -> None:
        """Initialize the coordinator."""
        super().__init__(
            hass=hass,
            logger=_LOGGER,
            address=ble_device.address,
            needs_poll_method=self._needs_poll,
            poll_method=self._async_update,
            mode=bluetooth.BluetoothScanningMode.ACTIVE,
            connectable=True,
        )
        self.device = device

    @callback
    def _needs_poll(
        self,
        service_info: bluetooth.BluetoothServiceInfoBleak,
        seconds_since_last_poll: float | None,
    ) -> bool:
        """Return whether to connect and poll the device."""
        return (
            self.hass.state is CoreState.running
            and self.device.poll_needed(seconds_since_last_poll)
            and bool(
                bluetooth.async_ble_device_from_address(
                    self.hass, service_info.device.address, connectable=True
                )
            )
        )

    async def _async_update(
        self, service_info: bluetooth.BluetoothServiceInfoBleak
    ) -> None:
        """Connect to the device and poll it."""

    @callback
    def _async_handle_bluetooth_event(
        self,
        service_info: bluetooth.BluetoothServiceInfoBleak,
        change: bluetooth.BluetoothChange,
    ) -> None:
        """Handle a new advertisement."""
        self.device.update_from_advertisement(service_info.advertisement)
        super()._async_handle_bluetooth_event(service_info, change)
```

在你的实现中调用父类的 `_async_handle_bluetooth_event`：它会把设备标记为可用、更新监听器，并且在主动版本中，会在需要时安排一次轮询。

被动版本没有 `needs_poll_method` 和 `poll_method`，且 `connectable` 默认为 `False`。重写 `_async_handle_unavailable`，以便在设备停止广播时执行相应操作。

> [!NOTE]
> 不可用状态依赖于蓝牙协议栈检测到设备已停止广播。在 macOS 上，CoreBluetooth 会缓存广播数据，且可能永远不会报告这一情况，因此 `_async_handle_unavailable` 可能不会被调用。
