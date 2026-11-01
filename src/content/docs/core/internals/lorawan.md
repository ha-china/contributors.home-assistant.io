---
title: LoRaWAN 设备
description: 连接集成如何注册 LoRaWAN 网络服务器，以及设备集成如何查找并公开其上的设备。
sidebarLabel: LoRaWAN
sidebarGroup: APIs
order: 35
---

LoRaWAN 是一种远距离、低功耗的无线电协议，被那些时不时发送一次读数的电池供电传感器所使用。这些设备不直接与 Home Assistant 通信，而是与网络服务器（network server，如 ChirpStack 或 The Things Stack）通信，Home Assistant 再与该服务器通信。

因此，LoRaWAN 支持分为两类集成，它们通过共享的 `lorawan` 集成连接在一起：

- **连接集成（connection integration）**负责建立网络服务器，并将其连接注册到 Home Assistant。
- **设备集成（device integration）**支持某一厂商的设备。它会在每个已注册的连接上查找这些设备，并将它们转换为实体（entity）。

两者都在其[清单（manifest）](/core/integrations/manifest/#dependencies)的 `dependencies` 中列出 `lorawan`。两者都基于 [`lorawan-connection`](https://github.com/home-assistant-libs/lorawan-connection) 构建，这是由 Home Assistant 项目维护的一个 Python 包。与所有集成一样，与服务器通信的代码以及解码设备有效负载的代码都位于[库（library）](/core/integrations/api-library/)中。集成负责处理配置、发现和实体。

## 连接集成

### 实现后端

连接集成的库实现 `lorawan-connection` 的 `Connection` 协议：

- `stack_type`：服务器的命名空间，如 `"chirpstack"` 或 `"tts"`。在连接之前就已经确定。
- `async_subscribe(brands=..., listener=...)`：先将所有匹配的设备发送给监听器，然后返回一个取消订阅的函数，并在此之后持续发送实时设备事件。`brands` 是由 `(stack, brand_id)` 对组成的 `frozenset`。`None` 表示选择所有设备。
- `on_disconnect(listener)`：在连接丢失时进行报告，并返回一个取消订阅的函数。
- `async_send_downlink(downlink)`：为设备排入一条下行消息（downlink），并返回其 ID。

后端报告的每个设备都有一个 `DeviceDescriptor`。将其 `network_id` 设置为你连接集成的配置条目（config entry）的 ID。将其 `stack` 设置为该连接的 `stack_type`，并填入服务器用来识别设备的 `brand_id` 和 `model_id`。发现和型号选择会依据这些信息进行匹配。

该库的[后端指南](https://home-assistant-libs.github.io/lorawan-connection/connection/adding-a-backend/)涵盖了事件的顺序、过滤以及下行消息。

### 注册连接

在 `async_setup_entry` 中连接到服务器，然后使用 `async_register_connection` 注册连接：

```python
from lorawan_connection import Connection

from homeassistant.components import lorawan


async def async_register_server(
    hass: HomeAssistant, entry: MyConfigEntry, connection: Connection
) -> None:
    """Register a connected backend during setup of the entry."""
    unregister = await lorawan.async_register_connection(
        hass, entry, connection=connection
    )
    entry.async_on_unload(unregister)
```

注册会在该连接发送完其设备后返回，并为设备集成所匹配的设备启动发现。一个配置条目一次只能注册一个连接：注册第二个会引发 `ValueError`。它返回的函数用于撤回连接，但不会关闭它。

其余部分由你的集成负责：

- 如果设置失败或被取消，请关闭后端。当身份验证失败时引发 `ConfigEntryAuthFailed`，当暂时无法连接服务器时引发 `ConfigEntryNotReady`。请参阅[处理设置失败](/core/integrations/setup-failures/)。
- 当连接丢失时，`lorawan` 会将其撤回。你的集成进行重连，或重新加载其配置条目，并注册新的连接。保持相同的 `network_id`，这样其上的设备仍是相同的设备。
- 在卸载时以及 Home Assistant 停止时，撤回注册并关闭后端。在你有意关闭后端之前，先移除你自己的重连监听器，否则关闭它会安排一次重新加载。

## 设备集成

### 被发现

在你的[清单](/core/integrations/manifest/#lorawan)中添加一个 `lorawan` 键，其中包含你厂商的 `(stack, brand_id)` 对。你的集成需要一个[配置流程（config flow）](/core/integrations/config-flow/)，并在其 `dependencies` 中包含 `lorawan`。Hassfest 会检查这两项。

当连接报告一个匹配的设备时，Home Assistant 会以 `integration_discovery` 来源和来自 `homeassistant.helpers.service_info.lorawan` 的 `LoRaWANDiscoveryInfo` 启动你的配置流程。该发现信息没有任何字段：流程只需要知道你的某个厂商设备出现了。只有新添加的设备才会触发发现。设备的更新和活动不会。

你的集成需要一个配置条目（针对该厂商），而不是每个设备或每台服务器一个。设备管理器会在每个连接上查找设备，因此用户无需选择服务器。使用你集成的域（domain）作为唯一 ID，将用户步骤和发现步骤都指向一个要求确认的步骤，并在条目已存在时使用 `_abort_if_unique_id_configured()` 中止。

清单按品牌进行匹配，并选择你的集成。你的库决定支持哪些型号。它为每个型号提供一个 `Device` 子类，在其 `identifiers` 中列出每个 stack 的 `(brand_id, model_id)`，以及一个在 `DEVICES` 中列出这些型号的 `DeviceCollection` 子类。请参阅[编写设备库](https://home-assistant-libs.github.io/lorawan-connection/patterns/library/)。

### 设置设备管理器

`DeviceManager` 负责记录管理工作。它会为每个连接创建一个你的库的集合（collection），包括稍后注册的连接，并为每个匹配型号的设备创建一个协调器（coordinator）。你需要向它提供一个从 `Connection` 创建集合的函数，以及一个从 `hass` 和设备创建协调器的函数。

在示例中，`ExampleDevice` 和 `ExampleDevices` 代表你的设备库中的类。请在清单的 `requirements` 中列出该库。

```python title="__init__.py"
from example_lorawan import ExampleDevice, ExampleDevices

from homeassistant.components.lorawan import DeviceManager
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .coordinator import ExampleCoordinator

type ExampleConfigEntry = ConfigEntry[
    DeviceManager[ExampleDevice, ExampleCoordinator]
]

PLATFORMS = [Platform.SENSOR]


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up the vendor integration."""
    manager = entry.runtime_data = DeviceManager(
        hass,
        entry,
        create_collection=ExampleDevices,
        create_coordinator=ExampleCoordinator,
    )
    entry.async_on_unload(manager.close)
    await manager.async_setup()

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)


async def async_unload_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Unload the vendor integration."""
    await hass.config_entries.async_unload_platforms_or_raise(entry, PLATFORMS)
```

### 共享设备更新

一个设备的所有实体共享其协调器。协调器不进行轮询：它以设备作为其数据启动，并监听设备以获取更新。没有更新间隔，也没有首次刷新。

```python title="coordinator.py"
import logging
from typing import override

from example_lorawan import ExampleDevice

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

_LOGGER = logging.getLogger(__name__)


class ExampleCoordinator(DataUpdateCoordinator[ExampleDevice]):
    """Share the updates of one device with its entities."""

    def __init__(self, hass: HomeAssistant, device: ExampleDevice) -> None:
        """Initialize the coordinator."""
        # The device manager shuts the coordinator down.
        super().__init__(
            hass, _LOGGER, config_entry=None, name=device.descriptor.name
        )
        self.async_set_updated_data(device)
        self._unsubscribe = device.add_update_listener(self._updated)

    @callback
    def _updated(self) -> None:
        self.async_set_updated_data(self.data)

    @override
    async def async_shutdown(self) -> None:
        self._unsubscribe()
        await super().async_shutdown()
```

每个平台使用 `subscribe_coordinator_added` 向管理器请求协调器。监听器会立即收到已存在的协调器，以及之后每一个新建的协调器。卸载时取消订阅：

```python title="sensor.py"
async def async_setup_entry(
    hass: HomeAssistant,
    entry: ExampleConfigEntry,
    async_add_entities: AddConfigEntryEntitiesCallback,
) -> None:
    """Set up the sensors."""

    @callback
    def coordinator_added(coordinator: ExampleCoordinator) -> None:
        async_add_entities([ExampleSensor(coordinator)])

    entry.async_on_unload(
        entry.runtime_data.subscribe_coordinator_added(coordinator_added)
    )
```

### 实体和设备

将你的实体基于 `LoRaWANEntity` 构建，并结合该平台的实体类。`LoRaWANEntity` 是一个 [`CoordinatorEntity`](/core/integrations/fetching-data/)，它以 `self.device` 的形式为你提供设备，并在设备关闭时将实体标记为不可用。它会设置 `_attr_has_entity_name`，其 `async_update` 不做任何事情，因为更新是通过设备传入的。

在实体的 `device_info` 中描述设备，并使用 `device_identifier` 标识它：

```python title="entity.py"
from typing import override

from example_lorawan import ExampleDevice

from homeassistant.components.lorawan import (
    LoRaWANEntity,
    device_identifier,
)
from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN


class ExampleEntity(LoRaWANEntity[ExampleDevice]):
    """Base entity for a device of this vendor."""

    @property
    @override
    def device_info(self) -> DeviceInfo:
        return DeviceInfo(
            identifiers={device_identifier(DOMAIN, self.device)},
            name=self.device.descriptor.name,
        )
```

该标识符是你的域，加上网络 ID 和设备的 DevEUI。两台服务器可以各自拥有一个具有相同 DevEUI 的设备，因此也要将网络 ID 和 DevEUI 放入你实体的唯一 ID 中，其后是测量项或通道的键。

解码有效负载和编码命令的工作留在你的库中。实体属性读取设备的状态（state），实体动作调用设备的方法。将失败的命令转换为 [Home Assistant 异常](/core/development/style/#error-handling)。

### 设备管理器处理的事项

- 当连接丢失时，管理器保留设备及其注册表条目，并将其协调器标记为失败，从而使实体变为不可用。当同一配置条目注册了新连接时，它会对比设备。仍然存在的设备保留其型号和协调器。已消失的设备会被移除。
- 管理器没有超时机制。很少发送数据的设备仍保持可用。
- 当设备从服务器上被移除，或其连接的配置条目被删除时，管理器会将该设备从设备注册表中移除，并关闭其协调器。其实体也随之移除。
- 当你的配置条目卸载时，管理器会关闭集合和协调器。它会保留注册表条目，并且不会触碰连接。

## 测试

`lorawan_connection.mock.MockConnection` 在测试中替代服务器。将它与你库中的真实集合一起使用，以测试它报告的设备、实时更新、发现、实体、移除和卸载。值得测试的情形：

- 在你的集成已加载之后才注册的连接。
- 两个连接各自拥有一个具有相同 DevEUI 的设备。
- 断开连接和重新连接，包括在连接中断期间被移除的设备。
- 当设置失败、被取消或 Home Assistant 停止时，对 Home Assistant 订阅和集合的清理。
- 设备注册表的清理，包括在你的集成未加载期间被删除的连接条目。

在你的库中测试解码，而不是在集成中。单独针对真实服务器测试连接集成的后端：身份验证、设备列表、事件传递、下行消息，以及当设置失败、被取消或 Home Assistant 停止时关闭传输层。
