---
title: 设备跟踪器实体
description: 报告设备在哪里：或者通过其位置，或者通过它是否连接到网络或信标。
sidebarLabel: Device tracker
sidebarGroup: Sensors and status
---

设备跟踪器（device tracker）报告在场情况：手机、标签或汽车是在家、离家，还是位于某个[地理位置区域（zone）](/glossary/zone/)中。它是只读的。共有三个基类，全部从 `homeassistant.components.device_tracker` 导入，你可以根据设备获知自身位置的方式来选择其中一个：

- `TrackerEntity`：设备报告其位置，形式为 GPS 坐标或其所在的区域。比如手机应用或汽车。
- `ScannerEntity`：设备会被本地 IP 网络发现，并通过其 MAC 地址进行识别。比如会列出已连接客户端的路由器。
- `BaseScannerEntity`：设备仅报告是否已连接，不做 `ScannerEntity` 那样的 MAC 地址假设。比如蓝牙信标。

这三个类默认都会获得 `diagnostic` [实体类别（entity category）](/glossary/entity-category/)，并设置 `tracking_type` 能力属性：`TrackerEntity` 为 `position`，扫描器（scanner）为 `connection`。

## 属性

每个实体（entity）都具有的通用属性（例如 `name` 或 `available`）位于[实体类](/core/entities/entities-class/)中。

### 所有设备跟踪器

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `source_type` | `SourceType` | `BaseScannerEntity` 必需。`TrackerEntity` 为 `SourceType.GPS`，`ScannerEntity` 为 `SourceType.ROUTER` | 设备的跟踪方式：`GPS`、`ROUTER`、`BLUETOOTH` 或 `BLUETOOTH_LE`。 |

`battery_level` 属性已被弃用，并将在 Home Assistant 2027.7 中停止工作。请使用带有 `battery` 设备类别的[传感器（sensor）](/core/entities/sensor/)来报告电池电量。

### `TrackerEntity`

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `latitude` | `float \| None` | `None` | 设备的纬度。 |
| `longitude` | `float \| None` | `None` | 设备的经度。 |
| `location_accuracy` | `float` | `0` | 位置的精度，单位为米。 |
| `in_zones` | `list[str] \| None` | `None` | 设备所在区域的实体 ID 列表，包括被动区域。设置后（即使是设置为空列表），它将优先于坐标。顺序无关紧要：基类会按区域半径对列表进行排序，并丢弃其中不存在的区域。 |

设置 `in_zones`，或者设置 `latitude` 和 `longitude`。在没有 `in_zones` 的情况下，基类会根据坐标和精度推算出所在区域。`location_name` 属性已被弃用，并将在 Home Assistant 2027.7 中停止工作。

`TrackerEntity` 默认不进行轮询，每次更新都会写入状态机（state machine），即使没有任何变化。

### `BaseScannerEntity`

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `is_connected` | `bool \| None` | 必需 | 设备是否已连接。 |

### `ScannerEntity`

`ScannerEntity` 构建在 `BaseScannerEntity` 之上，因此它同样需要 `is_connected`。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `mac_address` | `str \| None` | `None` | 设备的 MAC 地址。它同时也是该实体的唯一 ID。 |
| `ip_address` | `str \| None` | `None` | 设备的 IP 地址。 |
| `hostname` | `str \| None` | `None` | 设备的主机名。 |

`ScannerEntity` 以 MAC 地址为键，并有一些自身的默认设置：

- 其唯一 ID 是 MAC 地址。你无需自行设置。
- 在 Home Assistant Core 2028.11 之前，基类会为具有 MAC 地址但没有设备信息的跟踪器设置设备信息：一个以 MAC 地址作为连接、以主机名命名的设备，或者当设备是新的时以 MAC 地址命名。MAC 地址永远不会替换现有设备的名称。不要依赖它：从 2028.11 开始，没有设备信息的跟踪器不会包含在设备中，就像任何其他实体一样。在此之前，要将跟踪器排除在设备之外，请设置 `_attr_device_info = DeviceInfo()`。空的设备信息表示没有设备，默认设置仅在设备信息为 `None` 时适用。
- 它默认是禁用的。路由器会看到许多客户端，其中大多数不值得跟踪：用户最想跟踪的设备（如手机）通常通过 Home Assistant Companion 应用进行跟踪。当跟踪器不仅仅是网络上看到的另一个客户端时，请覆盖 `_attr_entity_registry_enabled_default`。例如，当跟踪是设备的目的时，比如 ZHA 建模为设备跟踪器的 Zigbee 存在标签，或者当用户单独设置了被跟踪的设备时。
- 当你设置 MAC 地址和 IP 地址时，DHCP 发现会使用它们，并在你设置主机名时使用主机名，来发现设备的集成。这发生在 Home Assistant 在设备连接时设置实体时，即使跟踪器被禁用。DHCP 发现还会查看具有 `router` 来源类型且状态为 `home` 的跟踪器：一次是在 DHCP 发现启动时，另一次是当这样的跟踪器获得其第一个状态时。之后从 `not_home` 变为 `home` 的跟踪器不会触发此操作。

## 支持的功能

此实体没有支持的功能。

## 方法

没有需要实现的方法。可以通过在 `update` 或 `async_update` 中轮询，或者通过 `async_write_ha_state` 推送，来使属性保持最新。请参见[更新状态](/core/entities/state-updates/)。

## 状态

状态由基类设置。不要自行设置 `state`。

| 状态 | `TrackerEntity` | 扫描器 |
| --- | --- | --- |
| `home` | 第一个活动区域是家庭区域。 | 已连接，且关联的区域是家庭区域。 |
| `not_home` | 没有活动区域。 | 未连接。 |
| 区域名称 | 第一个活动区域是另一个区域。 | 已连接，且关联的区域是另一个区域。 |
| `unknown` | 没有坐标且没有 `in_zones`。 | `is_connected` 为 `None`，或关联的区域不存在。 |

扫描器默认与家庭区域关联。用户可以在实体设置中选择另一个区域，例如为位于办公室的信标选择办公室。当该区域被删除时，Home Assistant 会引发一个[修复（repair）](/glossary/repair/)问题。

`in_zones` 状态属性列出设备所在的区域，最小的排在最前。当区域由坐标推算时，相同大小的区域按到其中心的距离排序，最近的排在最前。扫描器列出其关联的区域以及包含该区域的区域。当扫描器未连接时，`in_zones` 是一个空列表。

## 示例

一个报告其 GPS 位置的汽车跟踪器：

```python
from homeassistant.components.device_tracker import TrackerEntity


class ExampleCarTracker(TrackerEntity):
    """Location of an example car."""

    _attr_has_entity_name = True
    _attr_translation_key = "location"

    def __init__(self, car: ExampleCar) -> None:
        """Initialize the tracker."""
        self._car = car
        self._attr_unique_id = f"{car.vin}_location"

    async def async_added_to_hass(self) -> None:
        """Subscribe to position updates."""
        self.async_on_remove(self._car.subscribe(self._update))

    def _update(self) -> None:
        """Handle a new position from the car."""
        self._attr_latitude = self._car.latitude
        self._attr_longitude = self._car.longitude
        self._attr_location_accuracy = self._car.accuracy
        self.async_write_ha_state()
```

一个用于路由器客户端的跟踪器，包含在客户端的设备中。客户端名称放在设备上，当名称在路由器上更改时，设备会被重命名。该重命名仅在跟踪器启用时发生：Home Assistant 不会添加禁用的实体，因此它不会收到协调器更新。禁用跟踪器的设备信息在每次集成设置时仍会被使用，因此其设备在那时会获得当前名称。

```python
from homeassistant.components.device_tracker import ScannerEntity
from homeassistant.core import callback
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import CONNECTION_NETWORK_MAC, DeviceInfo
from homeassistant.helpers.update_coordinator import CoordinatorEntity


class ExampleClientTracker(CoordinatorEntity[ExampleCoordinator], ScannerEntity):
    """A client connected to an example router."""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, coordinator: ExampleCoordinator, client: ExampleClient) -> None:
        """Initialize the tracker."""
        super().__init__(coordinator)
        self._attr_mac_address = client.mac
        self._attr_hostname = client.hostname
        self._attr_device_info = DeviceInfo(
            connections={(CONNECTION_NETWORK_MAC, client.mac)},
            name=client.name,
            via_device_id=coordinator.router_device_id,
        )

    @property
    def is_connected(self) -> bool:
        """Return if the client is connected to the router."""
        return self.mac_address in self.coordinator.data.connected

    @callback
    def _handle_coordinator_update(self) -> None:
        """Rename the device when the client is renamed on the router."""
        name = self.coordinator.data.clients[self.mac_address].name
        if name and (device := self.device_entry) and device.name != name:
            dr.async_get(self.hass).async_update_device(device.id, name=name)
        super()._handle_coordinator_update()
```
