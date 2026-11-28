# 安全的集成

> 凭据、证书、脱敏、仅管理员访问、webhook 和文件路径。让集成保持安全的模式和辅助工具。

Source: https://www.hasscn.top/contributors/security/guides/integrations/

[集成](https://www.hasscn.top/contributors/glossary/integration/)运行在 Home Assistant Core 内部，处于同一进程中，可以访问一切。它与网络上的设备和服务通信，存储用户的凭据，并且可以添加进入 Home Assistant 的新途径，比如动作、WebSocket 命令和 webhook。其中每一项都是可能因失误而造成伤害的地方。

好消息是：Home Assistant 几乎为其中每一项都提供了辅助工具。本指南介绍应该使用哪一个，以及为什么。要了解 Home Assistant 信任对象的更大背景，请先阅读 [Home Assistant 如何处理信任](https://www.hasscn.top/contributors/security/how-it-works/)。

## 安全地与网络通信

### 使用共享的 web 会话

从 Home Assistant 获取你的 HTTP 会话，并将其传递给你的库：

```python
from homeassistant.helpers.aiohttp_client import async_get_clientsession

session = async_get_clientsession(hass)
client = ExampleClient(entry.data[CONF_HOST], session=session)
```

对于 HTTPX，请使用 `homeassistant.helpers.httpx_client` 中的 `get_async_client(hass)`。两者默认都会检查 SSL 证书（`verify_ssl=True`）。aiohttp 会话还会拒绝从网络上的地址重定向到本机（环回地址）的请求，这可以防范服务器端请求伪造。

传入会话也是质量等级的规则之一：[inject-websession](https://www.hasscn.top/contributors/core/quality-scale/inject-websession/)。

### 保持证书检查开启

默认情况下绝不要关闭证书检查。有些设备只有自签名证书，这时用户需要一条出路。可以把它作为[配置流程](https://www.hasscn.top/contributors/glossary/config-flow/)中的一个选项，默认开启检查，就像 Core 中的几个集成所做的那样：

```python
from homeassistant.const import CONF_VERIFY_SSL

STEP_USER_DATA_SCHEMA = probatio.Schema(
    {
        probatio.Required(CONF_HOST): str,
        probatio.Required(CONF_VERIFY_SSL, default=True): bool,
    }
)
```

然后把用户的选择传递给会话：

```python
session = async_get_clientsession(hass, entry.data[CONF_VERIFY_SSL])
```

证书检查很重要。2025 年的一份安全公告涉及 Core 及其使用的库中[对外请求的 SSL 验证](https://github.com/home-assistant/core/security/advisories/GHSA-m3pm-rpgg-5wj6)问题。

## 保守秘密

### 将凭据存储在配置条目中

凭据和连接细节应放在[配置条目](https://www.hasscn.top/contributors/glossary/config-entry/)的 `data` 中，而不是它的 `options` 中。options 用于用户稍后在[选项流程](https://www.hasscn.top/contributors/glossary/options-flow/)中更改的设置。

当凭据失效时，通过[重新认证流程](https://www.hasscn.top/contributors/glossary/reauthentication/)向用户询问新的凭据，而无需重新设置集成。

### 对诊断信息进行脱敏

用户会在公开的 issue 中发布[诊断信息](https://www.hasscn.top/contributors/glossary/diagnostics/)。将所有私密内容通过 `async_redact_data` 处理，它会把你列出的键的值替换为 `**REDACTED**`，包括嵌套的字典和列表：

```python
from homeassistant.components.diagnostics import async_redact_data

TO_REDACT = {CONF_API_KEY, CONF_PASSWORD, "serial_number"}

return {"entry_data": async_redact_data(entry.data, TO_REDACT)}
```

不要只想到密码：还有令牌、坐标、地址、姓名、电子邮件地址和序列号。完整信息（包括测试）请参阅[诊断](https://www.hasscn.top/contributors/core/integrations/diagnostics/)。

### 避免在日志中泄露秘密

用户在报告问题时也会把调试日志附在 issue 上。当某条日志需要标识某个键或 ID 时，使用 `homeassistant.helpers.redact` 中的 `partial_redact` 对其大部分内容进行遮蔽。它会保留前 4 个和后 4 个字符，并完全替换较短的值：

```python
from homeassistant.helpers.redact import partial_redact

_LOGGER.debug("Using API key %s", partial_redact(api_key))
```

同一个模块中还有它自己的 `async_redact_data`。它还接受从键到函数的映射，因此你可以部分遮蔽某个值，而不是将其完全移除。

## 将传入的数据视为不可信

来自设备、云服务或用户的数据可能是错误的，也可能是被故意构造的。

- 使用 schema 验证用户的输入。参见[输入验证](https://www.hasscn.top/contributors/core/development/input-validation/)。Home Assistant 会在你的处理函数运行之前根据 schema 检查动作的数据，因此你无需再次检查这些字段。
- 来自设备或服务的数据不会经过这些 schema。在使用这些值之前，先检查它们是否符合预期。
- 当某个值会进入 URL 或文件路径时，先用严格的模式（比如 slug）检查它。否则其中的 `../` 或 `?` 可能会把请求指向别处。
- 绝不要把外部数据传给 `eval()`、`exec()` 或 shell。Core 的代码检查工具 Ruff 会标记 `exec`（`S102`）、`eval`（`S307`）以及 `shell=True` 的 `subprocess`（`S602`）等有风险的调用。

传入的数据最终也会出现在界面上：设备名称或实体（entity）名称会到达仪表盘和卡片。前端必须将这些内容视为不可信。参见[前端中的不可信内容](https://www.hasscn.top/contributors/security/guides/frontend/)。

## 守护进入的途径

你添加的每一个动作、WebSocket 命令、HTTP 视图和 webhook 都是进入 Home Assistant 的一扇新门。要决定谁可以使用它。

### 仅管理员可用的动作

更改配置或具有其他安全影响的动作应要求管理员用户。使用 `async_register_admin_service` 注册它，它会替你完成这项检查：

```python
from homeassistant.helpers.service import async_register_admin_service

async_register_admin_service(
    hass, DOMAIN, "clear_cache", async_handle_clear_cache
)
```

作用于实体的动作也需要权限检查。参见[权限](https://www.hasscn.top/contributors/core/internals/permissions/)。

### 仅管理员可用的 WebSocket 命令

在顶部加上 `require_admin` 装饰器：

```python
@websocket_api.require_admin
@websocket_api.websocket_command({probatio.Required("type"): "example/info"})
@websocket_api.async_response
async def handle_info(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Return information about the example."""
```

### HTTP 视图

`HomeAssistantView` 默认要求已登录的用户（`requires_auth = True`）。只有在别无他法时才设置 `requires_auth = False`，然后由你自己检查请求，并且要在视图的每个方法中都进行检查：`get` 与 `post` 和 `put` 一样需要。对于仅管理员可用的视图，请使用 `homeassistant.components.http` 中的 `require_admin` 装饰处理函数：

```python
from homeassistant.components.http import HomeAssistantView, require_admin


class ExampleUploadView(HomeAssistantView):
    """Accept an upload from an admin."""

    url = "/api/example/upload"
    name = "api:example:upload"

    @require_admin
    async def post(self, request: web.Request) -> web.Response:
        """Handle the upload."""
```

### Webhook

webhook 不需要登录：任何知道 webhook ID 的人都可以调用它。这使得该 ID 成为一个秘密。使用 `webhook.async_generate_id()` 生成它，它会返回 64 个随机的十六进制字符。

当调用你的 webhook 的设备或服务位于本地网络时，将其注册为仅限本地：

```python
webhook.async_register(
    hass, DOMAIN, entry.title, entry.entry_id, handle_webhook, local_only=True
)
```

这样，Home Assistant 会忽略来自本地网络之外、或通过 Home Assistant Link 传入的请求。它会记录一条警告并以 `200 OK` 应答，因此调用者不会得到任何信息。Webhook 默认接受 `POST` 和 `PUT`。如果需要其他方法，请使用 `allowed_methods`。

2023 年的一份安全公告涉及[可从外部访问的仅限本地的 webhook](https://github.com/home-assistant/core/security/advisories/GHSA-wx3j-3v2j-rf45)，攻击途径是 Home Assistant Link（当时称为 Home Assistant Cloud）的远程连接。

## 检查文件路径

当用户给你的集成提供一个要读写的路径时，比如用于保存快照的文件夹，请使用 `hass.config.is_allowed_path()` 对照用户配置的允许列表进行检查。它会先解析路径，因此 `..` 之类的伎俩无法得逞。它会执行阻塞式 I/O，因此要在执行器（executor）中运行：

```python
allowed = await hass.async_add_executor_job(
    hass.config.is_allowed_path, file_path
)
if not allowed:
    raise ServiceValidationError(
        translation_domain=DOMAIN,
        translation_key="path_not_allowed",
        translation_placeholders={"path": file_path},
    )
```

对于 URL，`hass.config.is_allowed_external_url()` 会对允许的外部 URL 做同样的检查。

## 过去出过什么问题

这些[过去的安全公告](https://www.hasscn.top/contributors/security/reference/advisories/)涉及集成和 Core。每一份都对应本指南的一个章节。

- **一个无需登录、且只检查了部分方法的 HTTP 视图。** 旧版 Konnected 集成在 `POST` 和 `PUT` 上检查了令牌，但[在 `GET` 上没有](https://github.com/home-assistant/core/security/advisories/GHSA-x84v-g949-293w)。参见 [HTTP 视图](https://www.hasscn.top/contributors/security/guides/integrations/#http-views)。
- **登录前泄露信息。** 登录页面向本地网络上的任何人展示了[所有用户账户](https://github.com/home-assistant/core/security/advisories/GHSA-jqpc-rc7g-vf83)。
- **本地不等于可信。** 仅限本地的 webhook 曾通过 Home Assistant Cloud（现为 Home Assistant Link）的远程连接[从互联网上被访问到](https://github.com/home-assistant/core/security/advisories/GHSA-wx3j-3v2j-rf45)。参见 [webhook](https://www.hasscn.top/contributors/security/guides/integrations/#webhooks)。
- **请求路径中的外部数据。** 某个动作的字段最终进入了 [Supervisor API 请求](https://github.com/home-assistant/core/security/advisories/GHSA-4r74-h49q-rr3h)的路径中。参见[将传入的数据视为不可信](https://www.hasscn.top/contributors/security/guides/integrations/#treat-what-comes-in-as-untrusted)。
- **证书检查被关闭而无人察觉。** aiohttp 的一个参数被[以错误的方式替换](https://github.com/home-assistant/core/security/advisories/GHSA-m3pm-rpgg-5wj6)。参见[保持证书检查开启](https://www.hasscn.top/contributors/security/guides/integrations/#keep-certificate-checks-on)。

## 相关内容

- [安全辅助工具](https://www.hasscn.top/contributors/security/reference/helpers/)：所有辅助工具汇总在一页上。
- [依赖与供应链](https://www.hasscn.top/contributors/security/guides/dependencies/)：Home Assistant 对你的集成所使用的库有哪些要求。
- [身份验证](https://www.hasscn.top/contributors/core/internals/auth/)与[权限](https://www.hasscn.top/contributors/core/internals/permissions/)：用户、群组和权限检查。
