---
title: 重新认证与重新配置
description: 让用户修复过期的凭据并更改现有配置条目（config entry）的连接详细信息，而无需删除后重新添加。
sidebarLabel: Reauth and reconfigure
sidebarGroup: Setup and configuration
order: 6
---

设置完成后，情况会发生变化。密码会过期，令牌会被吊销，设备会更换 IP 地址。配置流程（config flow）中有两个特殊步骤可以处理这些情况，它们都会更新现有的配置条目，而不是创建新的条目：

- **重新认证**（`reauth`）用于修复凭据。当您的集成报告身份验证失败时，Home Assistant 会启动它。
- **重新配置**（`reconfigure`）用于更改其他设置数据，例如主机地址。用户从配置条目的菜单中启动它。

两者都不用于选项（options）。改变集成行为方式的设置应属于[选项流程](/core/integrations/options-flow/)。

两者都是[质量标准（quality scale）](/core/quality-scale/)的规则：重新认证属于银级（Silver），重新配置属于金级（Gold）。

## 重新认证

### 启动它

当您的凭据不再有效时，在 `async_setup_entry` 中或从您的[协调器（coordinator）](/core/integrations/fetching-data/)的 `_async_update_data` 中抛出 `ConfigEntryAuthFailed`。Home Assistant 会将该条目置于错误状态，并启动一个[重新认证](/glossary/reauthentication/)流程。如果在其他任何地方抛出，则不会启动该流程。

```python
async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""
    client = ExampleClient(entry.data[CONF_TOKEN])

    try:
        await client.login()
    except ExampleAuthError as err:
        raise ConfigEntryAuthFailed(
            translation_domain=DOMAIN,
            translation_key="invalid_token",
        ) from err
    ...
```

如果没有协调器，您也可以使用 `entry.async_start_reauth(hass)` 自行启动该流程。

### 处理它

流程从 `async_step_reauth` 开始，并携带配置条目的数据。显示一个表单，检查新凭据，然后更新现有的条目：

```python
from collections.abc import Mapping

from homeassistant.config_entries import ConfigFlowResult


async def async_step_reauth(
    self, entry_data: Mapping[str, Any]
) -> ConfigFlowResult:
    """Start reauthentication."""
    return await self.async_step_reauth_confirm()


async def async_step_reauth_confirm(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Ask for a new token."""
    errors: dict[str, str] = {}

    if user_input is not None:
        try:
            account = await validate_token(user_input[CONF_TOKEN])
        except ExampleAuthError:
            errors["base"] = "invalid_auth"
        else:
            await self.async_set_unique_id(account.id)
            self._abort_if_unique_id_mismatch()

            return self.async_update_reload_and_abort(
                self._get_reauth_entry(),
                data_updates=user_input,
            )

    return self.async_show_form(
        step_id="reauth_confirm",
        data_schema=probatio.Schema({probatio.Required(CONF_TOKEN): str}),
        errors=errors,
    )
```

这里发生了几件事：

- `self._get_reauth_entry()` 返回需要新凭据的配置条目。`self.source == SOURCE_REAUTH` 告诉您当前处于重新认证流程中。
- `async_set_unique_id` 之后紧接着 `_abort_if_unique_id_mismatch()`，以确保用户登录的是同一个账户，而不是其他账户。
- `async_update_reload_and_abort` 将 `data_updates` 合并到条目数据中，重新加载该条目，并以 `reauth_successful` 中止流程。传入 `reload_even_if_entry_is_unchanged=False` 可仅在内容有变化时才重新加载。

将该步骤添加到 `strings.json` 中，并使用共享的标题：

```json
{
  "config": {
    "step": {
      "reauth_confirm": {
        "title": "[%key:common::config_flow::title::reauth%]",
        "description": "The token for your Example account no longer works.",
        "data": {
          "token": "[%key:common::config_flow::data::api_token%]"
        }
      }
    }
  }
}
```

`reauth_successful` 和 `reconfigure_successful` 的中止消息来自 Home Assistant 本身，因此不需要放入您的 `strings.json` 中。只有通过 `reason` 传入的自定义中止原因才需要自己的字符串。不过，请添加 `unique_id_mismatch` 中止原因，以应对用户登录到不同账户的情况。

对于 OAuth 2.0，重新认证会让用户重新经历该服务的登录过程。参见 [OAuth 2.0](/core/integrations/oauth2/#reauthentication)。

### 测试它

自动化测试必须检查该流程会更新现有的条目，而不是创建新条目。如果重新认证或重新配置流程调用了 `async_create_entry`，则会引发错误。

要手动尝试，请停止 Home Assistant，编辑 `config/.storage/core.config_entries` 中存储的凭据（请在您配置的副本上进行），然后重新启动。对于 OAuth 2.0，请更改 `access_token`、`refresh_token` 或 `expires_at`。

## 重新配置

添加 `async_step_reconfigure` 以让用户更改条目的设置数据，例如主机地址。只要该步骤存在，用户就能在配置条目的菜单中找到**重新配置**（Reconfigure）。

```python
async def async_step_reconfigure(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Change the host of an existing entry."""
    errors: dict[str, str] = {}
    entry = self._get_reconfigure_entry()

    if user_input is not None:
        try:
            device = await get_device(self.hass, user_input[CONF_HOST])
        except ExampleConnectionError:
            errors["base"] = "cannot_connect"
        else:
            await self.async_set_unique_id(device.serial_number)
            self._abort_if_unique_id_mismatch()

            return self.async_update_reload_and_abort(
                entry, data_updates=user_input
            )

    return self.async_show_form(
        step_id="reconfigure",
        data_schema=self.add_suggested_values_to_schema(
            STEP_USER_SCHEMA, entry.data
        ),
        errors=errors,
    )
```

它的工作方式与重新认证相同：`self._get_reconfigure_entry()` 返回该条目，`self.source == SOURCE_RECONFIGURE` 告诉您当前处于哪个流程，唯一 ID 检查确保这仍然是同一台设备，流程以 `reconfigure_successful` 结束。

许多集成会共享 `user` 步骤和 `reconfigure` 步骤的代码，并通过检查 `self.source` 来决定是创建还是更新条目。

## 无需重新加载即可更新

如果您的集成能自行获取更改，请改用 `async_update_and_abort`。它接受相同的参数（`reload_even_if_entry_is_unchanged` 除外），并且不会重新加载条目。
