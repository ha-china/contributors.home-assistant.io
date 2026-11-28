# 从 UI 重新配置

> Gold 规则 reconfiguration-flow：用户无需删除配置项即可更改其设置。

Source: https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/

这是一条 Gold 规则。在 `quality_scale.yaml` 中，它被称为 `reconfiguration-flow`。

配置流程（config flow）有一个[重新配置步骤](https://www.hasscn.top/contributors/glossary/reconfigure-flow/)：`async_step_reconfigure`。它允许用户从集成配置项（config entry）的菜单中更改设置期间输入的内容，例如设备的主机地址，而无需删除配置项并重新进行设置。

## 为什么这很重要

情况总会发生变化。设备可能会获得新的 IP 地址，用户可能会将服务迁移到另一台服务器。理想情况下，Home Assistant 会通过发现（discovery）或重新认证（reauthentication）察觉到这些变化，并要求用户采取行动。但这并不总是可行的。重新配置流程为用户提供了一种自行解决问题的方法，同时保留他们的实体（entity）、历史记录和自动化。

删除并重新添加集成会丢失其实体的所有自定义设置。任何人都不应该为了一个新的 IP 地址而这样做。

## 示例

重新配置步骤会测试新的输入，确保它仍然是同一台设备或同一个账户，然后更新配置项：

```python
async def async_step_reconfigure(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Handle reconfiguration of the integration."""
    errors: dict[str, str] = {}
    if user_input is not None:
        client = MyClient(user_input[CONF_HOST])
        try:
            serial = await client.get_serial()
        except MyConnectionError:
            errors["base"] = "cannot_connect"
        else:
            await self.async_set_unique_id(serial)
            self._abort_if_unique_id_mismatch(reason="wrong_device")
            return self.async_update_reload_and_abort(
                self._get_reconfigure_entry(),
                data_updates=user_input,
            )

    return self.async_show_form(
        step_id="reconfigure",
        data_schema=probatio.Schema({probatio.Required(CONF_HOST): str}),
        errors=errors,
    )
```

`_abort_if_unique_id_mismatch` 可防止用户将配置项指向另一台设备。`async_update_reload_and_abort` 会更新数据、重新加载配置项，并以 `reconfigure_successful` 原因结束流程。

使用 `self.add_suggested_values_to_schema` 用当前值预填表单，这样用户只需更改需要更改的部分。

## 如何检查

- Hassfest（当规则为 `done` 时）：配置流程必须具有 `async_step_reconfigure`。
- Codecov 要求 `config_flow.py` 中变更的行达到 100% 的测试覆盖率，因此重新配置步骤需要测试，包括从错误中恢复。参见 [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)。

## 例外情况

- 配置流程中没有任何设置的集成可豁免此规则。
- 设置中仅包含凭据（由重新认证流程处理）的集成可豁免此规则。
- 任何更改都需要新建配置项的集成可豁免此规则。

## 相关规则

- [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/)：使用配置流程从 UI 进行设置。
- [test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/)：在配置流程中测试连接。
- [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/)：防止重复的配置项。
- [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)：完整地测试配置流程。
- [reauthentication-flow](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/)：从 UI 重新认证。
