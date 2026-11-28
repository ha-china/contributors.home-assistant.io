# 通过发现更新网络信息

> Gold 级规则 discovery-update-info：发现（discovery）会在地址变化时更新已知设备的地址。

Source: https://www.hasscn.top/contributors/core/quality-scale/discovery-update-info/

这是一项 Gold 级规则。在 `quality_scale.yaml` 中，它被称为 `discovery-update-info`。

当一个已经完成设置的设备再次被发现时，集成会使用发现（discovery）信息来更新其配置条目（config entry）的网络信息，例如主机名或 IP 地址。只有在确定是同一台设备时它才会这样做，因此它依据的是稳定的唯一 ID，绝不会依据地址本身。

## 为什么重要

大多数家庭网络会动态分配 IP 地址。设备重启或路由器重启都可能使设备获得新的地址，而只知道旧地址的集成就会停止工作。要求用户设置静态 IP 地址并不是解决办法：并非人人都会设置，而且也不应该有人必须如此。

发现机制已经能在新地址上看到该设备。利用这些信息可以让集成自行修复。

## 示例

在发现步骤中，设置流程的唯一 ID，并将新地址传递给 `_abort_if_unique_id_configured`。如果存在具有该唯一 ID 的条目，Home Assistant 会更新其数据，在内容发生变化时重新加载它，并中止该流程：

```python
async def async_step_zeroconf(
    self, discovery_info: ZeroconfServiceInfo
) -> ConfigFlowResult:
    """Handle zeroconf discovery."""
    host = discovery_info.host
    serial = discovery_info.properties["serialno"]

    await self.async_set_unique_id(serial)
    self._abort_if_unique_id_configured(updates={CONF_HOST: host})

    # Only a new device gets this far.
    self.host = host
    return await self.async_step_discovery_confirm()
```

DHCP 发现只会为 `manifest.json` 中的匹配器（matcher）启动流程。要让已知设备以新地址出现时也能启动流程，请在 DHCP 匹配器中将 `registered_devices` 设置为 `true`，并在设备的设备信息中通过 `connections={(CONNECTION_NETWORK_MAC, mac)}` 注册该设备的 MAC 地址。

```json
{
  "dhcp": [{ "registered_devices": true }]
}
```

## 如何检查

在代码审查中检查。配置流程（config flow）的测试应涵盖在新的地址上发现已知设备的情况。

## 例外情况

如果集成的设备无法被发现，则此规则不适用。
