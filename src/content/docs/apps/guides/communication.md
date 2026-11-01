---
title: 与 Home Assistant 和 Supervisor 通信
description: 通过内部网络和 API 代理，从你的应用访问 Home Assistant Core、Supervisor 以及其他应用。
order: 5
---

你的应用与 Supervisor 及其他应用运行在同一个内部网络上，并获得一个用于调用它们 API 的令牌（token）。本指南介绍与它们各自通信的方式，以及每种方式所需的权限。

## 内部网络

每个应用都通过主机名访问其他应用。Supervisor 会将每个应用以应用 ID 注册到内部 DNS 中，其中 `_` 被替换为 `-`：

| 主机名 | 说明 |
| --- | --- |
| `supervisor` | Supervisor 及其 API，位于 `172.30.32.2` |
| `homeassistant` | Home Assistant Core |
| `core-mosquitto` | 官方 Mosquitto broker 应用（`core_mosquitto`） |
| `local-hello-world` | 你的本地应用 `hello_world` |
| `a0d7b954-adguard` | 来自社区仓库的应用 |

应用 ID 以仓库 ID 开头：本地应用为 `local`，官方应用为 `core`，其他仓库则为 URL 的哈希值。[应用的工作原理](/apps/how-apps-work/#names-and-ids)解释了它是如何生成的。Supervisor API 的 `GET /addons` 端点会列出每个已安装应用的 `slug` 和 `repository`。

## 你的令牌

Supervisor 通过环境变量 `SUPERVISOR_TOKEN` 为每个应用分配专属令牌。在 `Authorization: Bearer` 请求头中使用它来访问 Supervisor API 和 Home Assistant Core API 代理。令牌能做什么取决于你的 `config.yaml` 中的权限。

请注意，由 S6 overlay 启动的脚本需要 `#!/command/with-contenv bashio`（或 `with-contenv bash`）才能看到这个变量。参见[容器环境](/apps/guides/s6-overlay/#the-container-environment)。

## Home Assistant Core

调用 Home Assistant 最简单的方式是通过 Supervisor 的代理。你无需知道端口、是否启用了 SSL，也无需用户的访问令牌。在 `config.yaml` 中添加 `homeassistant_api: true`，并使用你的 `SUPERVISOR_TOKEN`：

```bash
curl -sSL \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  -H "Content-Type: application/json" \
  http://supervisor/core/api/config
```

`http://supervisor/core/api/` 映射到 Home Assistant 的 REST API，即 Core 上的 `/api/`。`/core/api/stream` 处的事件流的工作方式相同。

WebSocket API 位于 `ws://supervisor/core/websocket`。在认证消息中，将你的 `SUPERVISOR_TOKEN` 作为 `access_token` 发送，就像使用普通的访问令牌一样：

```json
{ "type": "auth", "access_token": "<your SUPERVISOR_TOKEN>" }
```

代理不会转发 `supervisor/` 和 `hassio/` 类型的命令，并会阻止 REST API 的 `hassio` 端点。这些仅供 Home Assistant 前端使用。

> [!WARNING]
> Through the proxy, your app acts as an administrator of Home Assistant. Everything else an administrator can do, your app can do too, including managing users and their credentials. Only add `homeassistant_api: true` when your app needs Home Assistant, and treat your `SUPERVISOR_TOKEN` as an administrator credential.

You can also connect to Home Assistant directly at `homeassistant` on port 8123, but then you need a user's access token and you have to know how the user configured Home Assistant. The proxy is almost always the better choice.

## Supervisor API

Supervisor API 位于 `http://supervisor/`，使用相同的令牌：

```bash
curl -sSL \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  http://supervisor/addons/self/info
```

每个应用无需任何额外权限即可调用以下几个端点：

- `/addons/self/...`：关于你自己的应用的信息，包括其选项、日志和统计信息。你也可以启动、停止和重启它。更改其安全设置或更新它不在此范围内：这需要 `hassio_api` 以及允许该操作的角色。
- `/info`：关于系统的一般信息。
- `/services` 和 `/discovery`：[服务与发现](/apps/guides/services-discovery/)。
- `/auth`：用户认证，需要 `auth_api: true`。
- `/supervisor/ping`：完全不需要令牌。

对于其他任何内容，请添加 `hassio_api: true`。之后你可以调用什么取决于 `hassio_role`：`default` 角色可以读取所有 `info` 端点，其他角色则拥有更多权限。角色说明见[保护你的应用](/apps/guides/security/#api-roles)，端点见 [Supervisor API 参考](/apps/supervisor-api/)。

使用 Bashio 时，这些调用中的大多数只需一个函数，而且 Bashio 会自动为你添加令牌：

```bash
#!/command/with-contenv bashio

hostname=$(bashio::info.hostname)
port=$(bashio::app.ingress_port)

# An endpoint without a function of its own. Bashio returns the "data" part.
info=$(bashio::api.supervisor GET /addons/self/info)
```

每个函数都记录在 [Bashio 参考](/apps/bashio/)中。

## 其他应用

应用之间通过内部网络相互通信，就像任何其他网络服务一样：使用对方应用的主机名及其监听的端口。这里不涉及权限；对方应用在网络内部暴露的任何内容都是可访问的。

对于少数常见服务，Supervisor 可以为你提供连接详情，这样用户就无需手动输入。参见[共享服务与发现集成](/apps/guides/services-discovery/)。

## 向你的应用发送输入

在 `config.yaml` 中设置 `stdin: true` 后，Home Assistant 可以通过 `hassio.app_stdin` 动作（action）向你的应用的标准输入写入内容：

```yaml
actions:
  - action: hassio.app_stdin
    data:
      app: local_hello_world
      input: "restart"
```

Home Assistant 在发送前会将 `input` 编码为 JSON，因此文本 `restart` 会以 `"restart"` 的形式到达（包含引号），而映射则会以 JSON 对象的形式到达。Supervisor 会将数据原样写入你的应用的标准输入。
