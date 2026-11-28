# 网络发现

> 在您的集成运行时，使用 Home Assistant 的 zeroconf、SSDP、DHCP、USB、MQTT 和网络 API 来查找设备。

Source: https://www.hasscn.top/contributors/core/integrations/network-discovery/

[通过清单（manifest）进行发现](https://www.hasscn.top/contributors/core/integrations/discovery/) 会为新设备启动配置流程（config flow）。有些集成需要更多功能：一个在设备出现时将其添加的集线器（hub），或者一个查询已知设备当前位置的集成。Home Assistant 通过本页上的 API 共享其发现集成，因此您的集成无需运行自己的扫描器。

将您使用的集成（例如 `zeroconf` 或 `ssdp`）添加到[清单](https://www.hasscn.top/contributors/core/integrations/manifest/#dependencies)的 `dependencies` 中。

## Zeroconf

Home Assistant 运行一个 mDNS 实现 [python-zeroconf](https://github.com/python-zeroconf/python-zeroconf)，并将其共享。不建议在一台主机上运行多个 mDNS 实现，因此请不要启动自己的实现。请获取共享实例，并将其传递给您的库：

```python
from homeassistant.components import zeroconf

aiozc = await zeroconf.async_get_async_instance(hass)
```

使用 `zeroconf.async_get_instance(hass)` 获取同步的 `Zeroconf` 对象。python-zeroconf 的示例展示了这两者的用法。

## SSDP

SSDP 集成会缓存其发现的设备。可通过以下方式查询：

| 函数 | 返回值 |
| --- | --- |
| `ssdp.async_get_discovery_info_by_udn_st(hass, udn, st)` | 一个 UDN 和 ST 的发现信息，或 `None` |
| `ssdp.async_get_discovery_info_by_st(hass, st)` | 通过此 ST 发现的所有内容的列表 |
| `ssdp.async_get_discovery_info_by_udn(hass, udn)` | 一个设备的所有服务的列表 |

```python
from homeassistant.components import ssdp

discovery_infos = await ssdp.async_get_discovery_info_by_st(
    hass, "urn:schemas-upnp-org:device:ZonePlayer:1"
)
```

要立即获知新设备，请通过 `ssdp.async_register_callback` 注册回调。它使用与清单中 `ssdp` 相同的格式进行匹配，并且来自 `homeassistant.const` 的 `MATCH_ALL` 可匹配标头的任意值：

```python
from homeassistant.components import ssdp

entry.async_on_unload(
    await ssdp.async_register_callback(
        hass,
        _async_player_discovered,
        {"st": "urn:schemas-upnp-org:device:ZonePlayer:1"},
    )
)
```

## DHCP

`dhcp.async_discovered_service_info` 返回仍位于 DHCP 缓存中的设备，它们是包含 `ip`、`hostname` 和 `macaddress` 的 `DhcpServiceInfo` 对象。主机名为小写，MAC 地址为小写且不带冒号：`AA:BB:CC:12:34:56` 会变成 `aabbcc123456`。

```python
from homeassistant.components import dhcp

for service_info in dhcp.async_discovered_service_info(hass):
    ...
```

## USB

USB 集成会在 Home Assistant 启动时、用户打开集成页面时以及设备插入时（如果系统支持）查找新设备。要在相同的时刻检查新的兼容设备，请注册回调：

```python
from homeassistant.components import usb
from homeassistant.core import callback


@callback
def _async_check_for_usb() -> None:
    """Check for new compatible USB devices."""


entry.async_on_unload(
    usb.async_register_scan_request_callback(hass, _async_check_for_usb)
)
```

## MQTT

使用 MQTT 的集成必须等到 MQTT 客户端可用后才能进行订阅。`async_wait_for_mqtt_client` 会在 MQTT 正在设置期间等待。当客户端可用时，它返回 `True`；当 MQTT 未设置，或在超时时间内不可用时，返回 `False`。客户端尚不必已连接。

```python
from homeassistant.components import mqtt

if not await mqtt.async_wait_for_mqtt_client(hass):
    raise ConfigEntryNotReady("MQTT is not available")
```

## 网络适配器

如果您的集成使用自己的发现方法，它需要知道应使用哪些网络接口。[Network 集成](https://www.home-assistant.io/integrations/network/) 保存着用户的偏好设置。请向它查询，而不要自己查看接口：

```python
from homeassistant.components import network

adapters = await network.async_get_adapters(hass)
```

每个适配器都是一个如下所示的字典：

```python
{
    "name": "eth1",
    "enabled": True,
    "auto": True,
    "default": False,
    "ipv4": [{"address": "192.168.1.5", "network_prefix": 23}],
    "ipv6": [],
}
```

只使用 `enabled`（已启用）的适配器。要获取某个地址所在的网络：

```python
from ipaddress import ip_network

for adapter in adapters:
    if not adapter["enabled"]:
        continue

    for ip_info in adapter["ipv4"]:
        network_range = ip_network(
            f"{ip_info['address']}/{ip_info['network_prefix']}", False
        )
```
