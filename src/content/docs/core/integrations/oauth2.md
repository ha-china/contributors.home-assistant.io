---
title: OAuth 2.0 和应用凭据
description: 通过 OAuth 2.0 链接用户在云服务上的帐户，并让 Home Assistant 为您处理令牌。
sidebarLabel: OAuth 2.0
sidebarGroup: 设置与配置
order: 7
---

许多云服务允许用户使用 OAuth 2.0 链接其帐户：用户在该服务的网站上登录，Home Assistant 获得一个令牌（token）。Home Assistant 在 `homeassistant.helpers.config_entry_oauth2_flow` 中为这一切提供了辅助工具（helper）：配置流程、存储令牌、刷新令牌以及处理错误。您无需自己实现其中任何一部分。

最快的入门方式是脚手架脚本：

```shell
python3 -m script.scaffold config_flow_oauth2
```

## 整体运作方式

OAuth 2.0 需要客户端 ID（client ID）和客户端密钥（client secret）：即在该服务注册的应用程序的凭据。用户获取它们有两种方式：

- **应用凭据（application credentials）**：用户在该服务上注册自己的应用程序，并在 Home Assistant 中输入其客户端 ID 和密钥。每个支持 OAuth 2.0 的集成都必须支持这种方式。
- **Home Assistant Link 帐户链接**：Nabu Casa 已在该服务上注册了一个应用程序，因此拥有订阅的用户无需注册任何内容即可链接其帐户。这能提供最佳体验。要将您的集成添加到其中，请联系 [partner@openhomefoundation.org](mailto:partner@openhomefoundation.org)。

两者最终都会成为一个实现（implementation），即 `AbstractOAuth2Implementation` 的子类。如果存在多个实现，配置流程会让用户选择其中一个，并使用它进行登录。

您的库必须构建为让 Home Assistant 能够为其刷新令牌：它在每次请求之前请求一个有效的令牌，而不是自己处理刷新。有关如何构建，请参阅[API 库中的 OAuth 2](/core/integrations/api-library/#oauth-2)。

## 应用凭据

在您的[清单（manifest）](/core/integrations/manifest/#dependencies)的 `dependencies` 中添加 `application_credentials`，并创建 `application_credentials.py`，其中包含该服务授权服务器的 URL：

```python
from homeassistant.components.application_credentials import (
    AuthorizationServer,
)
from homeassistant.core import HomeAssistant


async def async_get_authorization_server(
    hass: HomeAssistant,
) -> AuthorizationServer:
    """Return the authorization server."""
    return AuthorizationServer(
        authorize_url="https://example.com/oauth/authorize",
        token_url="https://example.com/oauth/token",
    )
```

`authorize_url` 是用户登录的地方。`token_url` 是 Home Assistant 获取和刷新令牌的地方。

### 自定义实现

如果该服务有特殊之处，请在 `async_get_auth_implementation` 中返回您自己的实现。例如，对于需要 [PKCE](https://www.rfc-editor.org/rfc/rfc7636) 的服务：

```python
from homeassistant.components.application_credentials import (
    ClientCredential,
)
from homeassistant.helpers.config_entry_oauth2_flow import (
    AbstractOAuth2Implementation,
    LocalOAuth2ImplementationWithPkce,
)


async def async_get_auth_implementation(
    hass: HomeAssistant, auth_domain: str, credential: ClientCredential
) -> AbstractOAuth2Implementation:
    """Return an implementation that uses PKCE."""
    return LocalOAuth2ImplementationWithPkce(
        hass,
        auth_domain,
        credential.client_id,
        authorize_url="https://example.com/oauth/authorize",
        token_url="https://example.com/oauth/token",
        # Optional, defaults to an empty string
        client_secret=credential.client_secret,
        # Optional, between 43 and 128, defaults to 128
        code_verifier_length=128,
    )
```

对于其他改动，请继承应用凭据集成中的 `AuthImplementation`，并重写您需要的部分。

### 帮助用户创建凭据

在 `strings.json` 的 `application_credentials` 下说明用户在哪里创建其凭据：

```json
{
  "application_credentials": {
    "description": "Create credentials in the [console]({console_url})."
  }
}
```

在 `application_credentials.py` 中使用 `async_get_description_placeholders` 填充诸如 `console_url` 之类的占位符，这样 URL 就不会出现在翻译中：

```python
async def async_get_description_placeholders(
    hass: HomeAssistant,
) -> dict[str, str]:
    """Return the placeholders for the credentials dialog."""
    return {"console_url": "https://example.com/developers"}
```

### 来自 YAML 的凭据

新集成不得接受 `configuration.yaml` 中的凭据：用户应在 UI 中输入。以前接受凭据的集成可以使用 `async_import_client_credential` 将其迁移过来：

```python
from homeassistant.components.application_credentials import (
    ClientCredential,
    async_import_client_credential,
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Import credentials from YAML."""
    if DOMAIN in config:
        await async_import_client_credential(
            hass,
            DOMAIN,
            ClientCredential(
                config[DOMAIN][CONF_CLIENT_ID],
                config[DOMAIN][CONF_CLIENT_SECRET],
            ),
        )

    return True
```

## 配置流程

继承 `AbstractOAuth2FlowHandler`。它已经包含了 `user` 步骤，会选择实现、将用户发送到该服务并接收令牌。您只需设置域名（domain）和日志记录器（logger），并在 `extra_authorize_data` 中添加该服务所需的作用域（scope）和其他参数：

```python
import logging
from typing import Any

from homeassistant.helpers import config_entry_oauth2_flow


class OAuth2FlowHandler(
    config_entry_oauth2_flow.AbstractOAuth2FlowHandler, domain=DOMAIN
):
    """Handle the OAuth 2.0 config flow of Example."""

    DOMAIN = DOMAIN

    @property
    def logger(self) -> logging.Logger:
        """Return the logger."""
        return logging.getLogger(__name__)

    @property
    def extra_authorize_data(self) -> dict[str, Any]:
        """Return extra parameters for the authorize URL."""
        return {"scope": "read write offline_access"}
```

登录成功后，辅助工具会调用 `async_oauth_create_entry` 并传入数据（包括令牌）。默认情况下，它会创建一个条目，并以实现的名称作为标题。您可以重写它来设置唯一 ID、更好的标题，或者[处理重新认证](#reauthentication)。

### 重新认证

令牌可能会永久失效，例如用户在服务端撤销了访问权限。此时 Home Assistant 会启动一个[重新认证流程](/core/integrations/reauth-reconfigure/#reauthentication)。对于 OAuth 2.0，这意味着重新登录：

```python
from collections.abc import Mapping

from homeassistant.config_entries import SOURCE_REAUTH, ConfigFlowResult


async def async_step_reauth(
    self, entry_data: Mapping[str, Any]
) -> ConfigFlowResult:
    """Start reauthentication."""
    return await self.async_step_reauth_confirm()


async def async_step_reauth_confirm(
    self, user_input: dict[str, Any] | None = None
) -> ConfigFlowResult:
    """Tell the user they need to log in again."""
    if user_input is None:
        return self.async_show_form(step_id="reauth_confirm")

    return await self.async_step_user()


async def async_oauth_create_entry(
    self, data: dict[str, Any]
) -> ConfigFlowResult:
    """Create an entry, or update it during reauthentication."""
    account = await get_account(self.hass, data["token"])
    await self.async_set_unique_id(account.id)

    if self.source == SOURCE_REAUTH:
        self._abort_if_unique_id_mismatch()
        return self.async_update_reload_and_abort(
            self._get_reauth_entry(), data_updates=data
        )

    self._abort_if_unique_id_configured()

    return self.async_create_entry(title=account.name, data=data)
```

请务必实现重新认证，这样用户无需删除集成即可重新链接其帐户。

## 发起经过身份验证的请求

在 `async_setup_entry` 中创建一个 `OAuth2Session`。它会保持令牌有效，并将刷新后的令牌存储在配置条目（config entry）中：

```python
from homeassistant.helpers.config_entry_oauth2_flow import (
    OAuth2Session,
    async_get_config_entry_implementation,
)


async def async_setup_entry(
    hass: HomeAssistant, entry: ExampleConfigEntry
) -> None:
    """Set up Example from a config entry."""
    implementation = await async_get_config_entry_implementation(
        hass, entry
    )
    session = OAuth2Session(hass, entry, implementation)

    coordinator = ExampleCoordinator(
        hass, entry, ExampleClient(session)
    )
    await coordinator.async_config_entry_first_refresh()

    entry.runtime_data = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
```

在每次请求之前，库会调用 `await session.async_ensure_token_valid()`，它会在需要时刷新令牌，然后从 `session.token["access_token"]` 读取令牌。请将令牌处理保留在库、安装过程或协调器（coordinator）中，绝不要放在实体（entity）代码中。

## 错误

当令牌请求失败时，辅助工具会抛出来自 `homeassistant.exceptions` 的以下异常之一。每个异常同时也是配置条目异常，会说明接下来应该发生什么，并带有已翻译的消息，因此您无需映射它们或将它们添加到 `strings.json` 中。

| 异常 | 原因 | 同时也是 |
| --- | --- | --- |
| `OAuth2TokenRequestReauthError` | HTTP 状态 400 到 499（429 除外） | `ConfigEntryAuthFailed` |
| `OAuth2TokenRequestTransientError` | HTTP 状态 429，或 500 到 599 | `ConfigEntryNotReady` |
| `OAuth2TokenRequestError` | 任何其他 HTTP 状态。是上述两个异常的基类。 | `ConfigEntryNotReady` |
| `OAuth2TokenRequestConnectionError` | 无响应，或响应中没有可用的令牌 | `ConfigEntryNotReady` |

`async_get_config_entry_implementation` 的工作方式相同：它会抛出 `ImplementationUnavailableError`（一个 `ConfigEntryNotReady`）或 `UnknownImplementationError`（一个 `ConfigEntryAuthFailed`）。为了向后兼容，这些令牌请求异常还继承自 `aiohttp.ClientResponseError`，而 `OAuth2TokenRequestConnectionError` 继承自 `aiohttp.ClientError`。当 `async_ensure_token_valid` 抛出 `OAuth2TokenRequestReauthError` 时，它已经启动了重新认证流程。

因此，请让这些异常继续传播：

- **使用协调器时**，您无需为它们编写任何错误处理。`OAuth2TokenRequestReauthError` 会启动重新认证，其他异常则被视为一次会重试的失败更新。请像上面的示例那样，在 `async_setup_entry` 中执行首次刷新，以便在设置实体之前检查令牌。
- **不使用协调器时**，请在 `async_setup_entry` 中调用 `await session.async_ensure_token_valid()`。然后 Home Assistant 会重试安装，或启动重新认证。

只有当您的集成需要不同的行为时才捕获其中某个异常，例如针对对该服务而言属于永久性的状态抛出 `ConfigEntryError`。请捕获最具体的异常，并让其余异常继续传播。
