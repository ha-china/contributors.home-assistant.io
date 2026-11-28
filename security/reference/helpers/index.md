# 安全辅助函数

> Home Assistant Core 和前端中处理证书、脱敏、管理员访问、Webhook、路径和不可信内容的辅助函数。

Source: https://www.hasscn.top/contributors/security/reference/helpers/

所有与安全相关的辅助函数（helper）汇总在一页。各指南说明了何时以及为何使用它们：[集成（integration）](https://www.hasscn.top/contributors/security/guides/integrations/)和[前端](https://www.hasscn.top/contributors/security/guides/frontend/)。

## Core

### 网络

| 辅助函数 | 位置 | 作用 |
| --- | --- | --- |
| `async_get_clientsession(hass, verify_ssl=True)` | `homeassistant.helpers.aiohttp_client` | 共享的 aiohttp 会话。默认检查证书，并拒绝从网络重定向到回环地址。 |
| `async_create_clientsession(hass, verify_ssl=True)` | `homeassistant.helpers.aiohttp_client` | 具有相同保护措施的新 aiohttp 会话，适用于需要自己创建会话的情况，例如需要使用 cookie。 |
| `get_async_client(hass, verify_ssl=True)` | `homeassistant.helpers.httpx_client` | 共享的 HTTPX 客户端。默认检查证书。 |
| `CONF_VERIFY_SSL` | `homeassistant.const` | 用于关闭证书检查选项的标准键。 |

### 脱敏

| 辅助函数 | 位置 | 作用 |
| --- | --- | --- |
| `async_redact_data(data, to_redact)` | `homeassistant.components.diagnostics` | 将所列键的值替换为 `**REDACTED**`，包括嵌套的字典和列表。空值和 `None` 保持不变。 |
| `async_redact_data(data, to_redact)` | `homeassistant.helpers.redact` | 同上，但 `to_redact` 还可以将键映射到一个用于遮蔽该值的函数。 |
| `partial_redact(value, unmasked_prefix=4, unmasked_suffix=4)` | `homeassistant.helpers.redact` | 保留开头和结尾的字符，其余替换为 `***`。较短的值和非字符串值会变为 `**REDACTED**`。 |

### 访问

| 辅助函数 | 位置 | 作用 |
| --- | --- | --- |
| `async_register_admin_service(hass, domain, service, handler)` | `homeassistant.helpers.service` | 注册一个仅管理员可调用的动作（action）。 |
| `@websocket_api.require_admin` | `homeassistant.components.websocket_api` | 将 WebSocket 命令限制为仅管理员可用。 |
| `@require_admin` | `homeassistant.components.http` | 将 HTTP 视图的方法限制为仅管理员可用。 |
| `requires_auth` | `HomeAssistantView` | 默认为 `True`：该视图需要已登录的用户。 |

有关实体（entity）的检查，请参见[权限](https://www.hasscn.top/contributors/core/internals/permissions/)。

### Webhook

| 辅助函数 | 位置 | 作用 |
| --- | --- | --- |
| `async_generate_id()` | `homeassistant.components.webhook` | 由 64 个随机十六进制字符组成的 webhook ID。 |
| `async_register(..., local_only=True)` | `homeassistant.components.webhook` | 忽略来自本地网络之外的请求，以及通过 Home Assistant Link 的请求。 |
| `async_register(..., allowed_methods=...)` | `homeassistant.components.webhook` | webhook 接受的 HTTP 方法。默认为 `POST` 和 `PUT`。 |

### 文件和 URL

| 辅助函数 | 位置 | 作用 |
| --- | --- | --- |
| `hass.config.is_allowed_path(path)` | `homeassistant.core_config` | 判断路径是否位于用户允许的文件夹内。会先解析路径。包含阻塞式 I/O：请在执行器（executor）中运行。 |
| `hass.config.is_allowed_external_url(url)` | `homeassistant.core_config` | 判断 URL 是否以用户允许的外部 URL 之一开头。 |

## 前端

| 辅助函数 | 位置 | 作用 |
| --- | --- | --- |
| `filterXSS(html)` | [`src/common/util/xss.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/util/xss.ts) | 从字符串中移除所有标签，用于必须放入 HTML 字符串的文本。 |
| `sanitizeHttpUrl(url)` | [`src/common/url/sanitize-http-url.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/url/sanitize-http-url.ts) | 仅当 URL 是绝对的 `http:` 或 `https:` URL 时才返回它。 |
| `sanitizeLinkUrl(url)` | [`src/common/url/sanitize-http-url.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/url/sanitize-http-url.ts) | 类似于 `sanitizeHttpUrl`，并且还会将 `homeassistant://` 深度链接转换为前端内部的安全路径。 |
| `<ha-markdown>` | [`src/components/ha-markdown.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-markdown.ts) | 渲染 Markdown，并使用标签和属性的允许列表进行过滤。仅对可信内容使用 `allow-svg`。 |
