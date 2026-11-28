# 从 UI 重新进行身份验证

> Silver 规则 reauthentication-flow：用户无需移除集成即可输入新的凭据。

Source: https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/

这是一条 Silver 规则。在 `quality_scale.yaml` 中，它被称为 `reauthentication-flow`。

当集成的凭据失效时，集成必须启动[重新身份验证](https://www.hasscn.top/contributors/glossary/reauthentication/)（reauthentication）流程。在该流程中，用户输入新的凭据，集成对其进行测试，然后更新并重新加载现有的[配置条目](https://www.hasscn.top/contributors/glossary/config-entry/)（config entry）。

## 为什么重要

人们会更改密码，API 令牌也会过期。如果没有重新身份验证流程，集成就会直接停止工作，唯一的解决办法是将其移除并重新设置。这会丢失实体（entity）自定义，并且在此过程中破坏仪表盘（dashboard）和自动化（automation）。

有了重新身份验证流程，集成会显示在**设置** > **设备与服务**下，提示需要关注。用户输入新密码后，一切都能像以前一样正常工作。

## 示例

重新身份验证流程在集成于设置期间或协调器（coordinator）更新中抛出 `ConfigEntryAuthFailed` 时启动。参见 [test-before-setup](https://www.hasscn.top/contributors/core/quality-scale/test-before-setup/)。然后它会在配置流程中运行 `async_step_reauth`：

```python
class MyConfigFlow(ConfigFlow, domain=DOMAIN):
    """Config flow for My integration."""

    async def async_step_reauth(
        self, entry_data: Mapping[str, Any]
    ) -> ConfigFlowResult:
        """Start reauthentication after an authentication error."""
        return await self.async_step_reauth_confirm()

    async def async_step_reauth_confirm(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Ask for a new API token."""
        errors: dict[str, str] = {}
        if user_input is not None:
            entry = self._get_reauth_entry()
            client = MyClient(
                entry.data[CONF_HOST], user_input[CONF_API_TOKEN]
            )
            try:
                account_id = await client.get_account_id()
            except MyAuthError:
                errors["base"] = "invalid_auth"
            except MyConnectionError:
                errors["base"] = "cannot_connect"
            else:
                await self.async_set_unique_id(account_id)
                self._abort_if_unique_id_mismatch(reason="wrong_account")
                return self.async_update_reload_and_abort(
                    entry, data_updates=user_input
                )

        return self.async_show_form(
            step_id="reauth_confirm",
            data_schema=probatio.Schema(
                {probatio.Required(CONF_API_TOKEN): str}
            ),
            errors=errors,
        )
```

这里有几点细节需要注意：

- 该流程在保存新凭据之前会先对其进行测试，就像配置流程一样。
- `_abort_if_unique_id_mismatch` 可以防止用户意外使用其他账户登录，因为这会替换所有实体背后的数据。
- `async_update_reload_and_abort` 会更新该条目、重新加载它，并以 `reauth_successful` 原因结束流程。

## 如何检查

- Pylint，在该规则为 `done` 时：`config_flow.py` 必须实现 `async_step_reauth`（`home-assistant-missing-reauthentication-flow`）。
- 重新身份验证流程的测试计入 [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)，并且 Codecov 要求 `config_flow.py` 的每一行更改都被覆盖。
- 其余部分在评审（review）中检查。

## 例外情况

如果集成不需要任何形式的身份验证，则此规则不适用。

## 相关规则

- [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/)：通过配置流程从 UI 进行设置。
- [test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/)：在配置流程中测试连接。
- [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)：完整测试配置流程。
- [test-before-setup](https://www.hasscn.top/contributors/core/quality-scale/test-before-setup/)：在设置期间检查连接。
- [reconfiguration-flow](https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/)：从 UI 进行重新配置。
