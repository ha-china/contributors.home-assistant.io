# 在配置流程中测试连接

> 青铜规则 test-before-configure：配置流程在创建条目之前测试连接。

Source: https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `test-before-configure`。

在[配置流程](https://www.hasscn.top/contributors/glossary/config-flow/)（config flow）创建配置条目（config entry）之前，它必须测试该集成（integration）能否使用用户输入的内容进行连接。当测试失败时，流程会再次显示表单，并显示一个错误，告诉用户哪里出了问题。

## 为什么重要

一个什么都接受的配置流程，会让用户得到一个无法工作的集成，却不知道原因。许多问题在这一步很容易被发现：IP 地址中的拼写错误、错误的端口、防火墙的阻挡、DNS 问题、错误的凭据，或者设备不受支持。在用户仍盯着表单时就在这里发现这些问题，远比之后在日志中出现错误要友好得多。

## 示例

使用该库进行一次真实的调用，例如获取设备信息，并将该库抛出的异常映射为表单上的错误：

```python
async def async_step_user(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Handle a flow started by the user."""
    errors: dict[str, str] = {}
    if user_input is not None:
        client = MyClient(
            user_input[CONF_HOST], async_get_clientsession(self.hass)
        )
        try:
            await client.get_device_info()
        except MyConnectionError:
            errors["base"] = "cannot_connect"
        except MyAuthenticationError:
            errors["base"] = "invalid_auth"
        except Exception:
            LOGGER.exception("Unexpected exception")
            errors["base"] = "unknown"
        else:
            return self.async_create_entry(
                title="My integration", data=user_input
            )

    return self.async_show_form(
        step_id="user",
        data_schema=probatio.Schema({probatio.Required(CONF_HOST): str}),
        errors=errors,
    )
```

错误键放在 `strings.json` 中的 `config.error` 之下。像 `cannot_connect`、`invalid_auth` 和 `unknown` 这样的常见错误有共享的翻译，你可以通过 `[%key:common::config_flow::error::cannot_connect%]` 来引用它们。

## 如何检查

- Pylint（当规则为 `done` 时）：当配置流程创建了条目，却没有任何报告失败的迹象时，`home-assistant-missing-test-before-configure` 会发出警告：没有向表单传递 `errors=`，也没有在 `except` 中中止。OAuth2 流程会被跳过，因为令牌交换本身就是连接测试。
- 该测试对设备来说是否有意义，会在审查中进行检查。

## 例外情况

- 不连接设备或服务的集成，例如[辅助元素](https://www.hasscn.top/contributors/glossary/helper/)（helper），没有可测试的内容，可以豁免。
- 在运行时发现其设备、无需用户提供连接详细信息的集成（如 Google Cast），可以豁免。

## 相关规则

- [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/)：通过 UI 使用配置流程进行设置。
- [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/)：防止重复的配置条目。
- [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)：完整地测试配置流程。
- [discovery](https://www.hasscn.top/contributors/core/quality-scale/discovery/)：支持发现功能。
- [reauthentication-flow](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/)：从 UI 重新进行身份验证。
- [reconfiguration-flow](https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/)：从 UI 重新配置。
