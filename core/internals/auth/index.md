# 身份验证的工作原理

> Home Assistant 中的用户、用户组、凭据和令牌，以及用于验证用户身份的身份验证提供程序和多因素模块。

Source: https://www.hasscn.top/contributors/core/internals/auth/

Home Assistant 拥有自己的身份验证系统。它位于 [`homeassistant/auth/`](https://github.com/home-assistant/core/tree/dev/homeassistant/auth) 中，而 `hass.auth` 是将这一切整合在一起的身份验证管理器。本页介绍它的各个组成部分。要让应用登录 Home Assistant，请参阅[身份验证 API](https://www.hasscn.top/contributors/core/internals/auth-api/)。要查看用户可以执行哪些操作，请参阅[权限](https://www.hasscn.top/contributors/core/internals/permissions/)。

## 组成部分

- **用户（user）**：每个人，以及每个与 Home Assistant 通信的系统进程，都是一个用户。在引导设置（onboarding）过程中创建的用户是**所有者（owner）**。所有者可以管理其他用户，并且始终拥有所有权限。
- **用户组（group）**：用户是一个或多个用户组的成员，用户组承载[权限策略](https://www.hasscn.top/contributors/core/internals/permissions/)。Home Assistant 有三种用户组：管理员（`system-admin`）、用户（`system-users`）和只读用户（`system-read-only`）。
- **身份验证提供程序（auth provider）**：验证某人的身份，通常使用用户名和密码。详情见下文。
- **凭据（credentials）**：某人通过特定身份验证提供程序完成身份验证的证明。凭据与用户关联。一个用户可以拥有来自多个提供程序的凭据，但每个提供程序只能有一个。
- **刷新令牌（refresh token）与访问令牌（access token）**：应用登录后获得的东西。详情见下文。

## 令牌

当有人登录应用时，该应用会获得两个令牌：

- **访问令牌（access token）**，有效期 30 分钟。它会随每一次 API 请求一起发送。
- **刷新令牌（refresh token）**，用于在旧令牌过期后获取新的访问令牌。刷新令牌在连续 90 天未使用后过期，用户可以随时从自己的个人资料中将其撤销。

刷新令牌分为三种类型：

- **普通（Normal）**：在用户登录应用时创建。由应用为用户保管。
- **长期访问令牌（long-lived access token）**：为用户在其个人资料中创建的长期访问令牌提供支持。刷新令牌本身绝不会展示给任何人。
- **系统（System）**：仅供系统用户使用，例如 Supervisor。绝不会展示给任何人。

## 身份验证提供程序

身份验证提供程序用于确认某人的身份。它定义了一个登录流程，该流程构建在与[配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/)相同的数据录入流程（data entry flow）机制之上，会询问它需要的任何信息：用户名和密码、验证码，或者什么都不需要。当流程成功后，提供程序会向 Home Assistant 传递一个 `Credentials` 对象。

Home Assistant 在 [`homeassistant/auth/providers/`](https://github.com/home-assistant/core/tree/dev/homeassistant/auth/providers) 中内置了以下提供程序：

- `homeassistant`：用户名和密码存储在配置目录中。这是在未配置 `auth_providers` 时 Home Assistant 所使用的提供程序。
- `trusted_networks`：从已配置的网络无需密码即可登录。
- `command_line`：通过外部命令验证用户名和密码。
- `insecure_example`：用于开发和测试的示例。配置校验会拒绝在 `configuration.yaml` 中使用它，因为它仅用于测试。

用户可以在 `configuration.yaml` 的 `homeassistant:` 部分中的 `auth_providers:` 下配置哪些提供程序处于活动状态。同一个提供程序可以有多个实例，每个实例都有自己的 `id`。它们不共享凭据。

> [!NOTE]
> 仅支持内置的身份验证提供程序。自定义集成无法添加新的提供程序。

### 构建身份验证提供程序

提供程序是 [`homeassistant/auth/providers/`](https://github.com/home-assistant/core/tree/dev/homeassistant/auth/providers) 中实现两个类的模块。完整的小示例请查看 `insecure_example.py`。

`AuthProvider` 子类实现以下方法：

| 方法 | 是否必需 | 描述 |
| --- | --- | --- |
| `async_login_flow(context)` | 是 | 返回供某人登录所用的 `LoginFlow`。 |
| `async_get_or_create_credentials(flow_result)` | 是 | 为已完成的登录流程的结果返回对应的 `Credentials`。可以是已有的，也可以是新建的。 |
| `async_user_meta_for_credentials(credentials)` | 否 | 返回一个 `UserMeta`，其中包含从这些凭据创建的新用户的详细信息，例如姓名。 |

`LoginFlow` 子类实现 `async_step_init`。流程的第一步始终是 `init`：

```python
async def async_step_init(
    self, user_input: dict[str, str] | None = None
) -> AuthFlowResult:
    """Ask for and check the username and password."""
    errors: dict[str, str] = {}

    if user_input is not None:
        try:
            self._auth_provider.async_validate_login(
                user_input["username"], user_input["password"]
            )
        except InvalidAuthError:
            errors["base"] = "invalid_auth"
        else:
            user_input.pop("password")
            return await self.async_finish(user_input)

    return self.async_show_form(
        step_id="init", data_schema=LOGIN_SCHEMA, errors=errors
    )
```

不要将密码传递给 `async_finish`：流程的结果才是提供程序用来生成凭据的内容。

`async_finish` 会从这里接手：如果用户设置了多因素认证模块，流程会在创建凭据之前先继续执行这些模块。

## 多因素认证模块

多因素认证（multi-factor authentication，MFA）模块在身份验证提供程序之后，为登录过程添加第二个步骤。用户可以设置多个模块，并在登录时选择其中一个。Home Assistant 在 [`homeassistant/auth/mfa_modules/`](https://github.com/home-assistant/core/tree/dev/homeassistant/auth/mfa_modules) 中内置了以下模块：

- `totp`：来自身份验证器（authenticator）应用的基于时间的一次性密码。
- `notify`：通过 notify 动作发送的一次性密码。
- `insecure_example`：用于开发和测试的示例。

用户可以在 `configuration.yaml` 的 `homeassistant:` 部分中的 `auth_mfa_modules:` 下配置这些模块。如果没有该键，Home Assistant 会加载 `totp`。与身份验证提供程序一样，仅支持内置模块。

### 构建 MFA 模块

模块是 [`homeassistant/auth/mfa_modules/`](https://github.com/home-assistant/core/tree/dev/homeassistant/auth/mfa_modules) 中 `MultiFactorAuthModule` 的子类。完整示例请参见 `insecure_example.py`。

| 方法 | 是否必需 | 描述 |
| --- | --- | --- |
| `input_schema` | 是 | 一个属性，包含用户登录时所填表单的模式（schema）。 |
| `async_setup_flow(user_id)` | 是 | 返回为用户设置该模块的 `SetupFlow`。 |
| `async_setup_user(user_id, setup_data)` | 是 | 为用户设置该模块。 |
| `async_depose_user(user_id)` | 是 | 移除该模块为用户存储的所有内容。 |
| `async_is_user_setup(user_id)` | 是 | 返回该模块是否已为用户设置。 |
| `async_validate(user_id, user_input)` | 是 | 返回用户输入的内容是否有效。 |
| `async_initialize_login_mfa_step(user_id)` | 否 | 在显示登录的 MFA 步骤之前调用，例如 `notify` 模块用它来发送验证码。 |

用户从其个人资料中设置模块。设置过程也是一个数据录入流程，是 `SetupFlow` 的子类。对于 `totp`，该流程会生成一个密钥，将其显示为二维码，并要求输入一个验证码，以确认身份验证器应用与时钟保持一致。只有在此之后，该模块才会为该用户启用。

MFA 步骤有时间限制：如果自登录开始后已过去超过 5 分钟，登录流程会在调用 `async_validate` 之前以 `login_expired` 中止该步骤。您的模块只需要检查验证码。
