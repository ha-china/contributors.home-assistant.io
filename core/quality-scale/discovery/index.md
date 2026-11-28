# 支持发现

> 黄金规则 discovery：设备会被自动发现，因此用户无需自行查找。

Source: https://www.hasscn.top/contributors/core/quality-scale/discovery/

这是一条黄金（Gold）规则。在 `quality_scale.yaml` 中，它被称为 `discovery`。

如果集成的设备可以在网络或总线上被发现，则该集成支持[发现（discovery）](https://www.hasscn.top/contributors/glossary/discovery/)。Home Assistant 可以通过 Bluetooth、DHCP、HomeKit、mDNS（zeroconf）、MQTT、SSDP 和 USB 发现设备，应用也可以通过 Supervisor 宣告服务。你在 `manifest.json` 中声明要监听的内容，并在配置流程（config flow）的一个步骤中处理发现。

## 为什么重要

没有发现功能时，用户首先需要弄清楚哪个集成支持他们的设备，然后再查找其 IP 地址。有了发现功能，Home Assistant 会告诉用户它发现了一台设备，用户只需确认即可。这就是一分钟完成配置与需要登录路由器管理页面之间的区别。

发现功能在配置完成后仍然持续起作用：当设备获得新的 IP 地址时，集成可以更新其配置。参见 [discovery-update-info](https://www.hasscn.top/contributors/core/quality-scale/discovery-update-info/)。

## 示例

设备通过 mDNS 宣告一个 `_mydevice._tcp.local.` 服务。在 `manifest.json` 中声明它：

```json
{
  "zeroconf": ["_mydevice._tcp.local."]
}
```

然后在 `config_flow.py` 中处理它，位置在用户步骤旁边。发现步骤会设置唯一 ID，在设备已被配置时中止流程，并请求用户确认：

```python
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """Config flow for My integration."""

    host: str

    async def async_step_zeroconf(
        self, discovery_info: ZeroconfServiceInfo
    ) -> ConfigFlowResult:
        """Handle zeroconf discovery."""
        self.host = discovery_info.host
        serial = discovery_info.properties["serialno"]

        await self.async_set_unique_id(serial)
        self._abort_if_unique_id_configured(updates={CONF_HOST: self.host})

        try:
            await MyClient(self.host).get_data()
        except MyClientError:
            return self.async_abort(reason="cannot_connect")

        return await self.async_step_discovery_confirm()

    async def async_step_discovery_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask the user to confirm the discovered device."""
        if user_input is not None:
            return self.async_create_entry(
                title="My device",
                data={CONF_HOST: self.host},
            )

        self._set_confirm_only()
        return self.async_show_form(step_id="discovery_confirm")
```

`ZeroconfServiceInfo` 来自 `homeassistant.helpers.service_info.zeroconf`。其他发现方法在 `homeassistant.helpers.service_info` 中有各自的服务信息类，以及各自的步骤，例如 `async_step_dhcp` 或 `async_step_bluetooth`。

如果用户步骤设置了相同的唯一 ID，请在该步骤中向 `async_set_unique_id` 传入 `raise_on_progress=False`。否则，当该设备的发现流程处于打开状态时，手动设置设备的用户会遇到流程中止。

## 如何检查

- Hassfest，当该规则标记为 `done` 时：集成需要有一个 `config_flow.py`，并且在 `manifest.json` 中包含发现键（`bluetooth`、`dhcp`、`homekit`、`lorawan`、`mqtt`、`ssdp`、`usb` 或 `zeroconf`），或者在配置流程中包含发现步骤，例如 `async_step_zeroconf` 或 `async_step_hassio`。
- Codecov 要求对 `config_flow.py` 中更改的行实现 100% 的测试覆盖率，因此发现步骤需要测试。
- 设备可被发现的每一种方式是否都得到使用，会在审查中检查。

## 例外情况

并非所有设备都可以被发现。如果集成的设备或服务无法被发现，则此规则不适用。

## 相关规则

- [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/)：使用配置流程从 UI 进行设置。
- [test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/)：在配置流程中测试连接。
- [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/)：防止出现重复的配置条目。
- [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)：完整地测试配置流程。
