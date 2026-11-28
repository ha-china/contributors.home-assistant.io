# 防止重复的配置条目

> 铜级规则 unique-config-entry：同一设备或服务不能被设置两次。

Source: https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/

这是一条铜级（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `unique-config-entry`。

配置流程（config flow）必须阻止用户将同一设备或服务设置两次。当设备或服务已经拥有配置条目（config entry）时，每个流程（包括发现流程）都会中止。

## 为什么重要

通过用户界面（UI）设置集成（integration）非常容易，因此不小心把它设置两次同样容易。同一设备的两个条目意味着重复的设备和实体（entity），以及相互冲突的唯一 ID（unique ID）。发现（discovery）功能会让情况更糟：如果没有办法识别已知设备，Home Assistant 会不断提示再次设置它。

## 示例

有两种方法可以实现。

### 使用唯一 ID

为配置条目提供一个[唯一 ID](https://www.hasscn.top/contributors/glossary/unique-id/)，例如设备的序列号，并在具有该 ID 的条目已存在时中止。这是首选方式，因为它还能让发现功能识别该设备：

```python
async def async_step_user(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Handle a flow started by the user."""
    errors: dict[str, str] = {}
    if user_input is not None:
        client = MyClient(user_input[CONF_HOST])
        try:
            info = await client.get_device_info()
        except MyConnectionError:
            errors["base"] = "cannot_connect"
        else:
            await self.async_set_unique_id(info.serial_number)
            self._abort_if_unique_id_configured()
            return self.async_create_entry(title=info.name, data=user_input)

    return self.async_show_form(
        step_id="user",
        data_schema=probatio.Schema({probatio.Required(CONF_HOST): str}),
        errors=errors,
    )
```

唯一 ID 只需要在你的集成内部保持唯一即可。请使用稳定的硬件标识符，例如序列号或使用 `format_mac` 格式化的 MAC 地址。不要使用 IP 地址或主机名：它们会变化。

### 使用唯一数据

当设备没有可用的标识符时，改为比较现有条目的数据：

```python
if user_input is not None:
    self._async_abort_entries_match({CONF_HOST: user_input[CONF_HOST]})
```

当存在具有相同主机的条目时，流程会以 `already_configured` 中止。

## 如何检查

- Hassfest，当该规则为 `done` 时：配置流程必须调用 `_async_abort_entries_match`，或者同时调用 `async_set_unique_id` 和 `_abort_if_unique_id_configured`。在清单（manifest）中包含 `single_config_entry` 的集成可通过此检查。
- Pylint，针对每个集成：当 `async_set_unique_id` 收到 IP 地址或主机名时，`home-assistant-unique-id-ip-based` 会发出警告。
- Pylint：当配置流程测试在创建条目时未检查其唯一 ID，`home-assistant-tests-config-flow-unique-id` 会发出警告。
- 对重复情况的测试是 [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/) 的一部分。

## 例外情况

仅支持单个配置条目的集成可免于此规则。通常，这是通过在 `manifest.json` 中设置 `"single_config_entry": true` 来实现的。

## 相关规则

- [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/)：通过配置流程从用户界面进行设置。
- [test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/)：在配置流程中测试连接。
- [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)：全面测试配置流程。
- [discovery](https://www.hasscn.top/contributors/core/quality-scale/discovery/)：支持发现功能。
- [reauthentication-flow](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/)：从用户界面重新进行身份验证。
- [reconfiguration-flow](https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/)：从用户界面重新配置。
