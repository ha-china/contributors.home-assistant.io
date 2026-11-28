# Bluetooth 集成

> 使用 Bluetooth 的集成的最佳实践，以及 Bluetooth 集成的 API。

Source: https://www.hasscn.top/contributors/core/integrations/bluetooth/

Home Assistant 自行管理所有 Bluetooth 适配器（adapter）和扫描器（scanner），包括像 ESPHome Bluetooth 代理这样的远程适配器。您的集成绝不会启动自己的扫描器：它使用 Bluetooth 集成，由后者与每一个需要的集成共享同一条广播（advertisement）数据流。

本页包含最佳实践和 API。要将广播转换为实体（entity），请参阅[获取 Bluetooth 数据](https://www.hasscn.top/contributors/core/integrations/bluetooth-data/)。要被发现，请在您的[清单文件（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/#bluetooth)中添加一个 `bluetooth` 匹配器。

## 最佳实践

- 在清单文件的 `dependencies` 中添加 `bluetooth_adapters`。这样可以确保所有受支持的远程适配器在您的集成尝试使用它们之前已经连接。
- 您的库需要一个 `BleakScanner`？使用 `bluetooth.async_get_scanner(hass)` 获取一个。运行多个扫描器的开销很大，而且在用户更改适配器设置后，这个扫描器仍能继续工作。
- 不要在多次连接之间复用 `BleakClient`。这会降低连接的可靠性。
- 使用至少 10 秒的连接超时。BlueZ 首次连接新的或已更新的设备时需要解析服务。
- 要预料到连接偶尔会失败，并进行重试。[`bleak-retry-connector`](https://pypi.org/project/bleak-retry-connector/) 软件包让您无需反复猜测就能快速可靠地建立连接。

## 可连接与不可连接

一些 Bluetooth 适配器（例如许多远程适配器）只能监听广播：它们无法连接到设备。许多设备不需要连接，因为所有信息都在它们的广播中。

这就是 `connectable` 的作用所在。它默认为 `True`：您只能从可连接的适配器获取数据。如果您的设备只需要广播，请将其设置为 `False`，这样您就能从所有适配器获取数据，无论其是否可连接。

如果您的部分设备需要连接而其他设备不需要，请在清单文件中为每个匹配器（matcher）设置 `connectable`。如果无法通过匹配器区分它们，请在配置流程（config flow）中检查 `BluetoothServiceInfoBleak` 上的 `connectable`，并对需要您无法建立的连接的设备中止流程。

## 订阅广播

`bluetooth.async_register_callback` 会在看到匹配的设备或其广播发生变化时调用您。它使用与清单文件相同的匹配器，外加 `address`。它返回一个用于取消订阅的函数。

```python
from homeassistant.components import bluetooth
from homeassistant.core import callback


@callback
def _async_discovered_device(
    service_info: bluetooth.BluetoothServiceInfoBleak,
    change: bluetooth.BluetoothChange,
) -> None:
    """Handle a new advertisement."""


entry.async_on_unload(
    bluetooth.async_register_callback(
        hass,
        _async_discovered_device,
        {"address": "44:33:11:22:33:22", "connectable": False},
        bluetooth.BluetoothScanningMode.ACTIVE,
    )
)
```

其他匹配器的工作方式相同，例如用于 HomeKit 设备的 `{"manufacturer_id": 76, "manufacturer_data_start": [6]}`，或 `{"local_name": "Prodigio_*"}`。

### 重放已知设备

订阅时，Bluetooth 集成会重放它已有的广播，因此您可以立即看到所有已知设备。传入 `replay` 可以改变这一行为：

| 值 | 行为 |
| --- | --- |
| `BluetoothCallbackReplay.OLDEST_FIRST` | 按设备首次被发现的顺序重放。默认值。 |
| `BluetoothCallbackReplay.NEWEST_FIRST` | 最先重放最近的广播，适用于您希望立即根据当前状态采取行动的情况 |
| `BluetoothCallbackReplay.DISABLED` | 不重放，只处理新的广播 |

### 为单个设备进行主动扫描

`AUTO` 模式下的扫描器进行被动扫描，并在短时间窗口内切换到主动扫描。如果您的匹配器包含 `address`，且模式不是 `PASSIVE`，您可以针对该地址请求主动扫描窗口，节奏由您的设备决定：传入 `scan_interval`（窗口之间的秒数）和 `scan_duration`（每个窗口的秒数）。不传入时，应用 habluetooth 的默认值：每 5 分钟一个 10 秒的窗口。这些值会被限制在 habluetooth 允许的范围内。用户设置为 `PASSIVE` 或 `ACTIVE` 的扫描器不受影响。

### 每一条广播

`async_register_callback` 会跳过没有变化的广播。要查看某个地址的每一条广播，请使用 `async_register_advertisement_callback`，例如在配置流程打开期间检查设备是否仍在广播：

```python
entry.async_on_unload(
    bluetooth.async_register_advertisement_callback(
        hass, _async_advertisement, "44:44:33:11:23:42"
    )
)
```

只有 `raw` 字节是逐数据包提供的，在不提供原始广播的后端上它们为 `None`。其他数据会在多个数据包之间合并。每个听到数据包的扫描器都会运行一次该回调，即使是随后因存在更强的信号源而被丢弃的广播也是如此，因此它会非常频繁地运行。Home Assistant 早期就过滤掉的嘈杂 Apple 广播永远不会到达该回调。一旦不再需要，请立即取消订阅。

### 等待一条广播

`async_process_advertisements` 会一直等待，直到您的回调对某条广播返回 `True`，或直到超时：

```python
def _has_temperature(
    service_info: bluetooth.BluetoothServiceInfoBleak,
) -> bool:
    """Wait for an advertisement with manufacturer ID 323."""
    return 323 in service_info.manufacturer_data


service_info = await bluetooth.async_process_advertisements(
    hass,
    _has_temperature,
    {"address": discovery_info.address, "connectable": False},
    bluetooth.BluetoothScanningMode.ACTIVE,
    ADDITIONAL_DISCOVERY_TIMEOUT,
)
```

如果匹配器中包含 `address` 且模式不是 `PASSIVE`，该超时还会用作该地址的主动扫描窗口。

## 查找设备

| 函数 | 返回值 |
| --- | --- |
| `async_ble_device_from_address(hass, address, connectable=True)` | 从最近的、能够到达该设备的适配器获取 bleak `BLEDevice`，否则返回 `None`。请使用它来解析地址，而不是启动扫描器。 |
| `async_last_service_info(hass, address, connectable=True)` | 最新的 `BluetoothServiceInfoBleak`，来自信号最好的扫描器 |
| `async_address_present(hass, address, connectable=True)` | 设备是否仍被发现 |
| `async_discovered_service_info(hass, connectable=True)` | 所有仍然存在的设备 |
| `async_scanner_devices_by_address(hass, address, connectable=True)` | 看到该设备的每个适配器对应一个 `BluetoothScannerDevice`，其中包含其 `ble_device`、`advertisement` 和 `scanner` |
| `async_scanner_count(hass, connectable=True)` | 扫描器的数量。当没有能到达设备的扫描器时，可用它给出清晰的错误提示。 |

如果您从不可连接的适配器接收数据但需要建立连接，请使用 `async_ble_device_from_address(hass, address, connectable=True)` 将 `BLEDevice` 换成可连接的一个。只要范围内有一台可连接的适配器，这就可行。

### 解释设备为何不可达

当 `async_ble_device_from_address` 返回 `None`，或连接失败时，`async_address_reachability_diagnostics` 会用一段面向人类的文本解释原因。请传入您所需的设备信息：想要连接的用户关心连接槽位（connection slots），而只读取广播的用户则不关心。

```python
from homeassistant.components.bluetooth import BluetoothReachabilityIntent

reason = bluetooth.async_address_reachability_diagnostics(
    hass, address, BluetoothReachabilityIntent.CONNECTION
)
```

这段文本会说明该地址是否被发现、由哪些扫描器发现、信号如何，以及所有扫描器是否都在忙于连接。请将其放入错误或日志消息中，但不要解析它：其措辞可能会变化。

## 可用性

`async_track_unavailable` 会在设备不再被发现时调用您。这可能需要长达五分钟。使用 `connectable=True` 时，只要有一台可连接的适配器能够到达该设备，它就算可用。使用 `connectable=False` 时，任何适配器都可以。

```python
@callback
def _async_unavailable(
    service_info: bluetooth.BluetoothServiceInfoBleak,
) -> None:
    """Handle the device going away."""


entry.async_on_unload(
    bluetooth.async_track_unavailable(
        hass, _async_unavailable, address, connectable=True
    )
)
```

设备何时算作消失取决于它广播的频率。Bluetooth 集成会学习这个间隔：使用 `async_get_learned_advertising_interval(hass, address)` 获取。在得知之前它返回 `None`。在此之前使用回退间隔，您可以通过 `async_set_fallback_availability_interval(hass, address, seconds)` 设置，并通过 `async_get_fallback_availability_interval` 读取。如果两者都未设置，则应用 `bluetooth.FALLBACK_MAXIMUM_STALE_ADVERTISEMENT_SECONDS`。

## 重新发现

Bluetooth 集成会记住它已经为哪些设备启动过发现流程，因此不会重复询问用户。有时您希望它忘掉这些：

| 函数 | 适用场景 |
| --- | --- |
| `async_rediscover_address(hass, address)` | 配置条目（config entry）或设备被删除时。清除历史记录，并立即使用缓存的数据重新开始发现，这样无需重启即可重新设置该设备。 |
| `async_clear_address_from_match_history(hass, address)` | 设备状态发生了变化，但仍广播相同的 UUID，例如恢复出厂设置之后。清除历史记录，让下一条广播能够启动新的发现。 |
| `async_clear_advertisement_history(hass, address)` | 您希望下一条广播到达您的回调时，即使它与上一条完全相同。在 GATT 会话之后很有用，可以收到下一条“我醒了”的广播。它不影响发现流程。 |
| `async_request_active_scan(hass, duration=None)` | 您想立即进行一次主动扫描时，例如在配置流程中。等待 `duration` 秒（或 habluetooth 的默认值），之后您就可以读取新的广播。同时进行的调用共享一个扫描窗口。仅影响 `AUTO` 模式的扫描器。 |

> [!WARNING]
> 不要对广播经常变化的设备使用 `async_clear_address_from_match_history`，例如将读数放入广播中的传感器。每一次变化都会启动一个新的发现流程。

## 扫描器

这些功能面向提供 Bluetooth 适配器的集成，或需要查看扫描器的集成。

### 检查扫描器

`async_scanner_by_source(hass, source)` 通过 MAC 地址返回一个扫描器，`async_current_scanners(hass)` 返回所有扫描器。请仅将它们用于诊断和调试。扫描器对象来自 habluetooth，它们的接口可能在版本之间发生变化。只读取 `source` 和 `current_mode` 等简单属性，并预期它们可能为 `None`，不要修改任何内容，也不要保留对扫描器的引用。

### 提供扫描器

提供 Bluetooth 适配器的集成会在其 `dependencies` 中添加 `bluetooth`，并被列在 `bluetooth_adapters` 集成的 `after_dependencies` 中。注册一个继承 `BaseHaScanner` 的扫描器。如果适配器需要限制连接，请传入连接槽位的数量：

```python
cancel = bluetooth.async_register_scanner(
    hass, scanner, connection_slots=slots
)
```

扫描器通过来自 `bluetooth.async_get_advertisement_callback(hass)` 的回调，以 `BluetoothServiceInfoBleak` 对象的形式向 Home Assistant 提供广播。要彻底移除一个扫描器（包括其广播历史），请调用 `bluetooth.async_remove_scanner(hass, source)`。
