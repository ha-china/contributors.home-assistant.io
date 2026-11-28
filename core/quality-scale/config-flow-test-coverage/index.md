# 全面测试配置流程

> 青铜规则 config-flow-test-coverage：配置流程具有完整的测试覆盖率，包括从错误中恢复。

Source: https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/

这是一条青铜（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `config-flow-test-coverage`。

测试覆盖了 `config_flow.py` 的 100%。流程可显示的每一个错误都有一个对应的测试，并且该测试随后会修复错误原因并完成流程，以证明用户能够恢复。创建条目（entry）的测试还会检查其唯一 ID（unique ID）。该规则覆盖该文件中的每一种流程：用户流程、发现（discovery）、导入、重新认证、重新配置和选项。

## 为什么重要

配置流程（config flow）是用户对您的集成（integration）最先看到的部分。如果它出了问题，没有人能通过设置。大多数维护者并不拥有他们所触及的每一个集成的设备，因此，正是测试告诉他们某项更改没有破坏设置。

测试恢复与测试错误同样重要。一个显示“无法连接”却随后一直卡住的流程，即使用户已经修复了问题，也是一个坏掉的流程。而对唯一 ID 的断言可以确保其生成方式的更改不会被忽视：那会破坏所有现有用户的重复检测。

编写这些测试也是进入 core 测试的一个好途径。一旦配置流程有了覆盖，测试集成的其余部分就是更小的一步。请参阅[编写测试](https://www.hasscn.top/contributors/core/development/tests/)。

## 示例

正常路径（happy path）测试从头到尾运行用户流程，并检查创建的条目，包括其唯一 ID：

```python
async def test_full_flow(
    hass: HomeAssistant,
    mock_my_client: AsyncMock,
    mock_setup_entry: AsyncMock,
) -> None:
    """Test the full user flow."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.168.1.2"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "My device"
    assert result["data"] == {CONF_HOST: "192.168.1.2"}
    assert result["result"].unique_id == "ABC123"
```

错误测试使客户端失败，检查错误，然后让客户端恢复工作并完成流程：

```python
@pytest.mark.parametrize(
    ("exception", "error"),
    [
        (MyConnectionError, "cannot_connect"),
        (MyAuthenticationError, "invalid_auth"),
        (Exception, "unknown"),
    ],
)
async def test_flow_errors(
    hass: HomeAssistant,
    mock_my_client: AsyncMock,
    mock_setup_entry: AsyncMock,
    exception: Exception,
    error: str,
) -> None:
    """Test errors in the user flow, and recovery."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": SOURCE_USER}
    )

    mock_my_client.get_data.side_effect = exception
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.168.1.2"}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"base": error}

    mock_my_client.get_data.side_effect = None
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {CONF_HOST: "192.168.1.2"}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
```

重新认证或重新配置测试从现有的条目开始。添加一个 `MockConfigEntry` 并执行 `entry.add_to_hass(hass)`，然后使用 `await entry.start_reauth_flow(hass)` 或 `await entry.start_reconfigure_flow(hass)` 启动流程。当流程以 `reauth_successful` 或 `reconfigure_successful` 中止时，测试即告完成。

不要忘记重复检查。正常路径通常会经过 [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/) 的代码，但请添加一个测试，尝试对同一设备设置两次，并期望流程以 `already_configured` 中止。

## 如何检查

- Codecov 要求在每个拉取请求（pull request）中，`config_flow.py` 中被更改的行有 100% 的覆盖率。
- 当 `test_config_flow.py` 中的正常路径测试创建了条目却没有检查其唯一 ID 时，Pylint 会发出警告（`home-assistant-tests-config-flow-unique-id`）。
- 当 `test_config_flow.py` 中的某个测试显示了错误，但之后从未完成流程时，Pylint 会发出警告（`home-assistant-tests-config-flow-error-recovery`）。
- 当某个流程显示了 `strings.json` 中缺失的翻译键时，core 的测试会失败。

## 例外情况

此规则没有任何例外。

## 相关规则

- [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/)：使用配置流程从 UI 进行设置。
- [test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/)：在配置流程中测试连接。
- [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/)：防止重复的配置条目。
- [discovery](https://www.hasscn.top/contributors/core/quality-scale/discovery/)：支持发现。
- [reauthentication-flow](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/)：从 UI 重新认证。
- [reconfiguration-flow](https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/)：从 UI 重新配置。
