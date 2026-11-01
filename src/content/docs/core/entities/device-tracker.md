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

A `ScannerEntity` is keyed on the MAC address, and has a few defaults of its own:

- Its unique ID is the MAC address. You do not set one yourself.
- Until Home Assistant Core 2028.11, the base class sets device info for a tracker that has a MAC address but no device info: a device with the MAC address as connection, named after the hostname, or after the MAC address when the device is new. The MAC address never replaces the name of an existing device. Do not rely on it: starting with 2028.11, a tracker without device info is not included in a device, like any other entity. To keep a tracker out of a device until then, set `_attr_device_info = DeviceInfo()`. An empty device info means no device, and the default only applies when the device info is `None`.
- It is disabled by default. A router sees many clients, and most of them are not worth tracking: the devices users most want to track, like phones, are usually tracked with the Home Assistant Companion app instead. Override `_attr_entity_registry_enabled_default` when the tracker is not just another client seen on a network. For example, when tracking is the purpose of the device, like for the Zigbee presence tags that ZHA models as device trackers, or when the user set up the tracked device on its own.
- When you set the MAC address and IP address, DHCP discovery uses them, with the hostname when you set one, to discover integrations for the device. That happens when Home Assistant sets up the entity while the device is connected, even when the tracker is disabled. DHCP discovery also looks at trackers with the `router` source type that are `home`: once when DHCP discovery starts, and when such a tracker gets its first state. A tracker that changes from `not_home` to `home` later does not trigger this.

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

A tracker for a client of a router, included in a device for the client. The client name goes on the device, and the device is renamed when the name changes on the router. That rename only happens while the tracker is enabled: Home Assistant does not add a disabled entity, so it gets no coordinator updates. The device info of a disabled tracker is still used each time the integration is set up, so its device gets the current name then.

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
