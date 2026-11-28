# 获取数据

> 通过轮询（poll）或推送（push）从您的设备或服务获取数据，并使用数据更新协调器（data update coordinator）在实体（entity）之间共享数据。

Source: https://www.hasscn.top/contributors/core/integrations/fetching-data/

您的集成（integration）需要从某处获取数据：本地网络上的 API、云服务、套接字（socket），或 USB 设备上的串口。如何获取数据取决于 API 提供了什么。本页面帮助您选择合适的方法。

## 推送还是轮询

API 分为两类：

- **推送（push）**：您进行订阅，当有变化时 API 会通知您。这种方式使用的资源最少，更新会立即显示。
- **轮询（poll）**：您按一定间隔向 API 请求最新数据。变化会在下一次轮询时显示。

如果 API 支持推送，请使用推送。在清单（manifest）中设置相应的 [IoT class](https://www.hasscn.top/contributors/core/integrations/manifest/#iot_class)。

## 为所有实体只轮询一次：协调器

大多数 API 在一次请求中就会返回多个实体的数据。这时您希望整个集成只进行一次轮询，然后所有实体都从其结果中更新。`homeassistant.helpers.update_coordinator` 中的 `DataUpdateCoordinator` 正是为此而设计的。它还会处理错误、重试和退避（back off），并在更新失败时将您的实体标记为不可用。

将协调器放在 `coordinator.py` 中：

```python
from datetime import timedelta
import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryAuthFailed
from homeassistant.helpers.update_coordinator import (
    DataUpdateCoordinator,
    UpdateFailed,
)

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

type ExampleConfigEntry = ConfigEntry[ExampleCoordinator]


class ExampleCoordinator(DataUpdateCoordinator[ExampleData]):
    """Fetch data for all Example entities."""

    config_entry: ExampleConfigEntry

    def __init__(
        self,
        hass: HomeAssistant,
        config_entry: ExampleConfigEntry,
        client: ExampleClient,
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

    async def _async_setup(self) -> None:
        """Load data that only needs to be fetched once."""
        self.device = await self.client.get_device()

    async def _async_update_data(self) -> ExampleData:
        """Fetch the latest data."""
        try:
            return await self.client.get_data()
        except ExampleAuthError as err:
            raise ConfigEntryAuthFailed from err
        except ExampleRateLimitError as err:
            raise UpdateFailed(retry_after=err.retry_after) from err
        except ExampleError as err:
            raise UpdateFailed(
                translation_domain=DOMAIN,
                translation_key="update_error",
                translation_placeholders={"error": str(err)},
            ) from err
```

各部分的作用：

- `config_entry`：始终传入它。核心（core）中的集成必须这样做。
- `update_interval`：轮询的频率。只有当至少有一个实体在监听时，协调器才会进行轮询。
- `_async_setup`：可选。在首次刷新期间运行一次，用于只需加载一次的数据。
- `_async_update_data`：获取数据。它返回的任何内容最终都会存入 `coordinator.data`。

以及各异常的作用：

- `UpdateFailed`：更新失败。协调器只记录一次（不会在每次轮询失败时都记录），将实体标记为不可用，并在下一个间隔时重试。使用 `retry_after` 时，它会等待相应的秒数。在首次刷新期间，`retry_after` 会传递给导致设置失败的 `ConfigEntryNotReady`，因此[设置重试](https://www.hasscn.top/contributors/core/integrations/setup-failures/)会遵循该值。
- `UpdateFailedUnreachable`：`UpdateFailed` 的子类，用于设备或服务无法访问的情况，例如设备已关闭。其行为与 `UpdateFailed` 相同，但协调器以 `info` 级别而非 `error` 级别记录（`<name> is unavailable: <message>`），符合[不可用时记录日志](https://www.hasscn.top/contributors/core/quality-scale/log-when-unavailable/)规则的要求。
- `ConfigEntryAuthFailed`：凭据不再有效。协调器停止轮询并启动[重新认证](https://www.hasscn.top/contributors/core/integrations/reauth-reconfigure/#reauthentication)。
- 超时和 `aiohttp` 客户端错误由协调器自行处理，[OAuth 2.0 令牌错误](https://www.hasscn.top/contributors/core/integrations/oauth2/#errors)也是如此。

### 在设置期间进行首次刷新

在 `async_setup_entry` 中创建协调器，并在设置平台之前进行首次刷新：

```python
coordinator = ExampleCoordinator(hass, entry, client)
await coordinator.async_config_entry_first_refresh()

entry.runtime_data = coordinator
```

如果首次刷新失败，`async_config_entry_first_refresh` 会抛出 `ConfigEntryNotReady`，Home Assistant 将[重试设置](https://www.hasscn.top/contributors/core/integrations/setup-failures/)。这样您的实体启动时就总是带有数据。只能从 `async_setup_entry` 中调用它：在任何其他配置条目（config entry）状态下调用都会抛出错误。如果首次更新失败不应阻止设置，请改为调用 `await coordinator.async_refresh()`。

### 使用协调器的实体

继承 `CoordinatorEntity`。它会为您处理轮询、可用性以及监听协调器的工作。在属性（例如 `native_value`）中从 `self.coordinator.data` 读取值：

```python
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.update_coordinator import CoordinatorEntity


class ExampleSensor(CoordinatorEntity[ExampleCoordinator], SensorEntity):
    """A sensor of an Example device."""

    @property
    def native_value(self) -> float:
        """Return the temperature."""
        return self.coordinator.data.temperature
```

当新数据到达时，协调器会调用 `_handle_coordinator_update`，该方法会写入状态，属性随之读取新值。您也可以重写 `_handle_coordinator_update` 并在其中设置 `_attr_native_value`。如果这样做，还需要在 `__init__` 中从 `coordinator.data` 设置它。实体只有在被添加之后才开始监听，因此在设置期间已经完成的首次刷新永远不会触发 `_handle_coordinator_update`。如果不这样做，传感器将保持 `unknown` 状态直到下一次更新。在 `always_update=False` 且数据不变的情况下，这可能需要很长时间。

执行命令后，使用 `await self.coordinator.async_request_refresh()` 请求最新数据。请求会进行去抖（debounce）处理，因此连续多次调用只会导致一次更新。

### 跳过没有变化的更新

默认情况下，协调器在每次更新后都会调用其监听器，即使数据没有变化。如果您的数据可以用 `==` 进行比较（例如 dataclass），请传入 `always_update=False`。这样协调器只会在数据发生变化时才调用监听器，从而减少状态写入。

### 只获取用到的数据

有些 API 允许您请求更少的数据。向 `CoordinatorEntity` 传入一个 `context`（例如设备 ID），并在协调器中使用 `self.async_contexts()` 查看哪些 context 拥有监听器。已禁用的实体不会监听，因此您不会获取它们的数据。

## 使用协调器的推送

协调器也适用于推送式 API。省略 `update_interval`，使其永不轮询，并在新数据到达时调用 `async_set_updated_data`：

```python
@callback
def _handle_push(self, data: ExampleData) -> None:
    """Handle new data pushed by the device."""
    self.async_set_updated_data(data)
```

如果协调器同时也会轮询，此调用会重置距离下一次轮询的时间。

## 不使用协调器的推送

当每个实体都有自己的订阅时，在 `async_added_to_hass` 中订阅，并在实体被移除时取消订阅。实体可能会被禁用，因此不要在实体被添加之前订阅。设置 `_attr_should_poll = False`，并在数据到达时自行写入状态：

```python
class ExampleSwitch(SwitchEntity):
    """A switch that gets pushed updates."""

    _attr_should_poll = False

    async def async_added_to_hass(self) -> None:
        """Subscribe to updates."""
        self.async_on_remove(
            self._device.subscribe(self._handle_update)
        )

    @callback
    def _handle_update(self) -> None:
        """Write the new state."""
        self.async_write_ha_state()
```

`async_write_ha_state()` 会立即写入当前状态。`async_schedule_update_ha_state(force_refresh=True)` 会先调用您的 `async_update`，然后再写入状态。

## 按实体轮询

如果每个实体都有自己的端点，并且一次请求恰好对应一个实体，您可以在实体的 `async_update` 方法中获取数据。只要 `should_poll` 为 `True`（默认值），Home Assistant 就会按一定间隔调用它。

- 如果实体在被添加之前需要数据，请向 `async_add_entities` 传入 `update_before_add=True`。
- 在平台中使用 `SCAN_INTERVAL` 常量设置间隔，例如 `SCAN_INTERVAL = timedelta(seconds=30)`。不要设置得太低：这会消耗 Home Assistant 的资源，可能使设备过载，还可能导致用户被云 API 封禁。

如果多个实体共享一个端点，请改用协调器。

## 并行请求

Home Assistant 限制每个平台同时运行的更新和动作（action）调用数量，以免集成使设备或 API 过载。大多数集成无需在此处进行任何更改。

该限制是每个平台一个信号量（semaphore），同时适用于实体更新和动作调用。默认情况下，如果您的实体具有同步的 `update` 方法，该值为 `1`；否则为 `0`（无限制），例如具有 `async_update` 方法或完全没有更新方法的实体。Home Assistant 会根据平台添加的第一个实体来决定该值。可以通过平台文件中的 `PARALLEL_UPDATES` 常量覆盖它：

```python
# Only one update or action call at a time on this device
PARALLEL_UPDATES = 1
```

请在每个平台中显式设置它：这是[质量分级](https://www.hasscn.top/contributors/core/quality-scale/)白银（Silver）级别的一项规则。协调器已经集中处理了更新，因此使用协调器的集成可以为 `sensor` 和 `binary_sensor` 等只读平台设置 `PARALLEL_UPDATES = 0`。此时该限制只与动作调用有关。
