# 认证 API

> 应用如何使用 OAuth 2 登录 Home Assistant 实例、刷新和撤销令牌，以及发起经过身份验证的请求。

Source: https://www.hasscn.top/contributors/core/internals/auth-api/

每个 Home Assistant 实例都属于某个人，因此没有一个集中注册应用的地方。Home Assistant 采用 [OAuth 2](https://datatracker.ietf.org/doc/html/rfc6749) 以及 [IndieAuth](https://indieauth.spec.indieweb.org/) 对客户端的处理方式：您的应用由其自己的网站来标识。本页将介绍您的应用为用户实例获取令牌（token）所要经历的流程。

如果您使用 JavaScript 编写代码，[home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) 库已经为您实现了这个流程。前端也在使用它。

## 您的客户端 ID

您的客户端 ID 是应用网站的 URL，例如 `https://www.my-application.io/`。您让用户返回到的重定向 URI（redirect URI）必须具有相同的主机名和端口，例如 `https://www.my-application.io/auth_callback`。

需要在其他主机上使用重定向 URI，例如原生应用的自定义协议（scheme）？请在您的网站上声明它，Home Assistant 会抓取客户端 ID 处的页面来查找它。它只读取前 10 KB 的内容，并接受以下两种形式之一：

- HTML 中的 link 标签：

  ```html
  <link rel="redirect_uri" href="hass://auth" />
  ```

- 托管在客户端 ID URL 上的 JSON [OAuth 客户端 ID 元数据文档](https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/)，其中包含 `redirect_uris` 列表：

  ```json
  {
    "client_id": "https://www.my-application.io/oauth/metadata.json",
    "redirect_uris": ["https://oauth.my-application.io/hass/auth_callback"]
  }
  ```

Home Assistant 只会在页面没有 link 标签时才读取元数据文档。此时，仅当客户端 ID 是带有路径的 `https` URL、响应是直接的 `200 OK`（无重定向）、文档中的 `client_id` 与其被抓取的 URL 完全一致，并且 `redirect_uris` 中的每一项都是绝对 URI 时，它才会接受该文档。

Home Assistant 在 `/.well-known/oauth-authorization-server` 中描述了它所支持的内容，如 [RFC 8414](https://datatracker.ietf.org/doc/html/rfc8414) 所定义。需要动态发现端点的客户端可以从这里开始。

## 第 1 步：将用户引导至授权页面

将用户发送到其实例上的 `/auth/authorize`，并将您的 `client_id` 和 `redirect_uri` 作为查询参数：

```text
https://homeassistant.local:8123/auth/authorize
  ?client_id=https%3A%2F%2Fwww.my-application.io%2F
  &redirect_uri=https%3A%2F%2Fwww.my-application.io%2Fauth_callback
  &state=abc123
```

换行只是为了便于阅读。可选参数：

- `state`：会在重定向中原样返回。适合用来存放用户正在登录的实例的 URL。
- `code_challenge` 和 `code_challenge_method`：用于 PKCE（[RFC 7636](https://datatracker.ietf.org/doc/html/rfc7636)）。唯一支持的方法是 `S256`。只要可行就请使用 PKCE，在原生应用中则务必使用。

用户登录并批准后，Home Assistant 会重定向到您的重定向 URI，并附带一个 `code` 和您的 `state`：

```text
https://www.my-application.io/auth_callback?code=12345&state=abc123
```

## 第 2 步：用授权码换取令牌

向 `/auth/token` 发送 POST 请求，请求体使用 `application/x-www-form-urlencoded` 编码。请使用与第 1 步完全相同的 `client_id`：

```text
grant_type=authorization_code
&code=12345
&client_id=https%3A%2F%2Fwww.my-application.io%2F
```

如果使用 PKCE，请添加 `code_verifier`。响应如下：

```json
{
  "access_token": "ABCDEFGH",
  "expires_in": 1800,
  "refresh_token": "IJKLMNOPQRST",
  "token_type": "Bearer",
  "ha_auth_provider": "homeassistant"
}
```

访问令牌（access token）的有效期为 `expires_in` 秒。请妥善保存刷新令牌（refresh token）：正是它让用户保持登录状态。

如果请求有误，您会收到状态码 400，错误信息类似 `{"error": "invalid_request", "error_description": "Invalid code"}`。如果不允许该用户登录（例如用户处于停用状态），您会收到状态码 403，错误为 `access_denied`。

## 第 3 步：刷新访问令牌

当访问令牌过期时，再次向 `/auth/token` 发送 POST 请求：

```text
grant_type=refresh_token
&refresh_token=IJKLMNOPQRST
&client_id=https%3A%2F%2Fwww.my-application.io%2F
```

您会收到新的 `access_token` 及其对应的 `expires_in`。如果刷新令牌不再有效，则说明用户已注销：请清除您存储的内容，并重新开始整个流程。

刷新令牌在连续 90 天未使用后即会过期。

## 撤销令牌

要注销，请将刷新令牌以 `application/x-www-form-urlencoded` 编码 POST 到 `/auth/revoke`：

```text
token=IJKLMNOPQRST
```

这会撤销该刷新令牌以及由它创建过的所有访问令牌。无论该令牌是否存在，响应始终是状态码 200 和空响应体。旧的方式——将 `token` 和 `action=revoke` POST 到 `/auth/token`——仍然可用，但已被弃用。

## 发起经过身份验证的请求

对于 HTTP，请在 `Authorization` 请求头中发送访问令牌：

```shell
curl \
  -H "Authorization: Bearer ABCDEFGH" \
  https://homeassistant.local:8123/api/
```

对于 WebSocket API，请在 [auth 消息](https://www.hasscn.top/contributors/core/internals/websocket-api/#authentication)中发送它。在 HTTP 上，过期或无效的令牌会返回状态码 401。在 WebSocket API 上，您会收到 `auth_invalid`，并且服务器会关闭连接。无论哪种情况：请刷新令牌并重试。

## 长期访问令牌

对于无法通过登录流程的脚本和服务，用户可以在其个人资料页面的 **安全**（Security）部分创建长期访问令牌（long-lived access token）。这些令牌的有效期为 10 年，使用方式与访问令牌完全相同。

拥有 WebSocket 连接的应用也可以使用 `auth/long_lived_access_token` 为当前用户创建一个长期访问令牌。`lifespan` 以天为单位：

```json
{
  "id": 11,
  "type": "auth/long_lived_access_token",
  "client_name": "GPS Logger",
  "lifespan": 365
}
```

结果就是令牌本身。Home Assistant 不会存储它，因此无法再次显示。

## 签名路径

有时用户需要在没有 `Authorization` 请求头的情况下打开 URL，例如下载链接。签名路径（signed path）是添加了签名的普通路径，例如 `/api/states?authSig=ABCDEFGH`。任何打开它的人都会以创建它的刷新令牌的身份获得授权。

通过 WebSocket API，可以使用 `auth/sign_path` 创建签名路径。`expires` 以秒为单位，默认值为 30：

```json
{
  "id": 12,
  "type": "auth/sign_path",
  "path": "/api/states",
  "expires": 20
}
```

结果中包含要使用的 `path`。在集成（integration）中，请使用 `homeassistant.components.http.auth` 中的 `async_sign_path`。它会使用当前 HTTP 请求或 WebSocket 连接的刷新令牌，在没有刷新令牌时（例如在自动化中）则回退到一个特殊的内容用户（content user）。

请记住：

- 当签名路径的刷新令牌被删除、用户被删除，或 Home Assistant 重启时，签名路径将停止工作。
- 签名会在请求到达时进行检查。即使下载耗时超过过期时间，下载仍会继续完成。
