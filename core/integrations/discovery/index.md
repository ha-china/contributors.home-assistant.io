# 发现

> Home Assistant 如何通过网络、USB 或蓝牙查找你的设备，并将其交给你的配置流程。

Source: https://www.hasscn.top/contributors/core/integrations/discovery/

[发现（discovery）](https://www.hasscn.top/contributors/glossary/discovery/)是 Home Assistant 自行查找设备并主动提供设置的方式。用户会在集成页面上看到一个“Discovered”（已发现）卡片，确认后即完成设置。这是你能为集成的用户体验做的最好的事情之一，也是[质量分级（quality scale）](https://www.hasscn.top/contributors/core/quality-scale/) Gold（金牌）等级的规则之一。

你的集成本身不会搜索网络。Home Assistant 会运行发现类集成，例如 `zeroconf` 和 `dhcp`，并将它们发现的结果与所有集成清单（manifest）中的匹配器（matcher）进行比对。

## 工作原理

1. 在你的[清单（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/#discovery)中添加一个匹配器，例如设备的 zeroconf 服务类型。
2. 某个发现集成找到了匹配的设备。
3. Home Assistant 会启动你的配置流程（config flow），并进入以发现来源命名的步骤，例如 `async_step_zeroconf`，同时传入一个描述所发现内容的服务信息（service info）对象。
4. 你的步骤会设置唯一 ID（unique ID），检查设备是否已被设置，并请用户确认。参见[发现步骤](https://www.hasscn.top/contributors/core/integrations/config-flow/#discovery-steps)。

同一台设备往往会被反复发现。当具有相同发现数据的流程仍在进行时，Home Assistant 不会启动新的流程；而你的唯一 ID 会在设备已被设置时让流程中止。当已知设备以新的 IP 地址出现时，请在发现步骤中更新该条目。参见[即时更新连接详情](https://www.hasscn.top/contributors/core/integrations/config-flow/#update-connection-details-on-the-fly)。

当用户忽略一个已发现的设备时，Home Assistant 会创建一个带有其唯一 ID 的已忽略配置条目，并且不再提供该设备。

## 发现来源

| 来源 | 清单键 | 步骤 | 服务信息 |
| --- | --- | --- | --- |
| mDNS 和 zeroconf | `zeroconf` | `async_step_zeroconf` | `ZeroconfServiceInfo` |
| HomeKit，通过 zeroconf | `homekit` | `async_step_homekit` | `ZeroconfServiceInfo` |
| SSDP 和 UPnP | `ssdp` | `async_step_ssdp` | `SsdpServiceInfo` |
| DHCP | `dhcp` | `async_step_dhcp` | `DhcpServiceInfo` |
| USB | `usb` | `async_step_usb` | `UsbServiceInfo` |
| MQTT | `mqtt` | `async_step_mqtt` | `MqttServiceInfo` |
| 蓝牙 | `bluetooth` | `async_step_bluetooth` | `BluetoothServiceInfoBleak` |
| LoRaWAN | `lorawan` | `async_step_integration_discovery` | `LoRaWANDiscoveryInfo` |
| Supervisor 应用 | 无 | `async_step_hassio` | `HassioServiceInfo` |
| 另一个集成 | 无 | `async_step_integration_discovery` | 由该集成定义 |

这些服务信息类位于 `homeassistant.helpers.service_info` 中，但蓝牙的那个除外，它来自 `homeassistant.components.bluetooth`。例如：

```python
from homeassistant.helpers.service_info.zeroconf import ZeroconfServiceInfo


async def async_step_zeroconf(
    self, discovery_info: ZeroconfServiceInfo
) -> ConfigFlowResult:
    """Handle a device found with zeroconf."""
    host = discovery_info.host
    serial_number = discovery_info.properties["serialno"]
    ...
```

一些有用的字段：

- `ZeroconfServiceInfo`：`host`、`port`、`hostname`、`name`、`type`，以及 `properties` 中的 TXT 记录。
- `SsdpServiceInfo`：`ssdp_location` 和 `ssdp_st` 等 SSDP 头部，以及 `upnp` 中的 UPnP 设备描述。
- `DhcpServiceInfo`：`ip`、`hostname`（小写）和 `macaddress`（小写，不带冒号）。
- `UsbServiceInfo`：`device`（串口路径）、`vid`、`pid`、`serial_number`、`manufacturer` 和 `description`。
- `MqttServiceInfo`：`topic`、`payload` 和 `subscribed_topic`。

如果你没有实现某个来源对应的步骤，Home Assistant 会改为调用你的 `user` 步骤。它只会在你的集成还没有任何配置条目时这样做，并且一次只进行一个流程：一旦有设备完成设置，发现功能就不再启动流程。这就是那些从不设置唯一 ID 的集成仍能被发现的方式。

## 由另一个集成进行发现

一个集成可以为另一个集成查找设备。例如，August 集成知道锁的蓝牙密钥，而 Yale Access Bluetooth 集成需要这些密钥。使用 `integration_discovery` 来源，通过 `discovery_flow.async_create_flow` 启动另一个集成的流程：

```python
from homeassistant.config_entries import SOURCE_INTEGRATION_DISCOVERY
from homeassistant.helpers import discovery_flow

discovery_flow.async_create_flow(
    hass,
    "other_domain",
    context={"source": SOURCE_INTEGRATION_DISCOVERY},
    data={"address": address, "key": key},
)
```

另一个集成会在 `async_step_integration_discovery` 中处理它。对于你从代码启动的每一个发现流程，都请使用这个辅助方法（helper）：它可以避免在具有相同数据的流程已在进行时重复启动流程，并会等待 Home Assistant 启动完成。

## 在设置之后查找设备

通过清单进行的发现是针对新配置条目的。集线器（hub）类集成通常还需要了解稍后出现的设备，或它已经设置过的设备。发现类集成为此提供了 API。参见[网络发现](https://www.hasscn.top/contributors/core/integrations/network-discovery/)和[蓝牙集成](https://www.hasscn.top/contributors/core/integrations/bluetooth/)。

## 测试

测试每一个发现步骤：新设备、已被设置的设备、移动到新地址的设备，以及被忽略的设备。在你的测试中手动构建服务信息对象，并使用真实设备发送的值。
