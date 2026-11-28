# 服务、发现、认证和 Ingress 端点

> Supervisor API 端点，供应用共享 MQTT 等服务、向 Home Assistant 宣告自身、校验用户凭据以及使用 ingress。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/services/

这些端点是应用之间以及应用与 Home Assistant 协作的方式。其中大多数不需要 `hassio_api` 权限：你的应用可以做什么，是在其 `config.yaml` 中通过 `services`、`discovery` 和 `auth_api` 设置的。请参阅[服务与发现](https://www.hasscn.top/contributors/apps/guides/services-discovery/)，了解如何在你的应用中使用它们。

## 服务

服务（service）是一个应用提供、其他应用使用的东西，例如 MQTT 代理。提供服务的应用注册其连接详情，需要该服务的应用读取这些详情，这样用户就不必手动输入主机名和密码。

共有两种服务：`mqtt` 和 `mysql`。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/services` | 列出服务 |
| `GET` | `/services/<service>` | 读取某个服务的连接详情 |
| `POST` | `/services/<service>` | 注册为某个服务的提供者 |
| `DELETE` | `/services/<service>` | 移除某个服务的注册 |

你的应用需要在其配置的 `services` 选项中声明该服务。Supervisor 会检查以下内容：

- 读取和注册对该服务的任何角色都有效：`want`、`need` 或 `provide`。当另一个应用已注册为提供者时，注册会失败。
- 移除注册需要 `<service>:provide`。

在配置中，`provide` 是为注册服务的应用准备的角色。

### `GET /services`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `services` | 列表 | [服务模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#service)列表 |

### `GET /services/<service>`

返回提供者注册的连接详情。当没有应用提供该服务时会失败。

```json
{
  "addon": "core_mosquitto",
  "host": "core-mosquitto",
  "port": 1883,
  "ssl": false,
  "protocol": "3.1.1",
  "username": "addons",
  "password": "Ahng5Ohghahy"
}
```

### `POST /services/mqtt`

将你的应用注册为 MQTT 代理。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `host` | 字符串 | 是 | 代理的主机名 |
| `port` | 整数 | 是 | 代理的端口 |
| `username` | 字符串 | 否 | 供其他应用使用的用户名 |
| `password` | 字符串 | 否 | 供其他应用使用的密码 |
| `ssl` | 布尔值 | 否 | 代理使用 TLS。默认为 `false` |
| `protocol` | 字符串 | 否 | `3.1` 或 `3.1.1`。默认为 `3.1.1` |

### `POST /services/mysql`

将你的应用注册为 MySQL 服务器。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `host` | 字符串 | 是 | 服务器的主机名 |
| `port` | 整数 | 是 | 服务器的端口 |
| `username` | 字符串 | 否 | 供其他应用使用的用户名 |
| `password` | 字符串 | 否 | 供其他应用使用的密码 |

### `DELETE /services/<service>`

移除该服务的注册。当提供服务的应用停止提供该服务时，应从该应用调用此端点。Supervisor 不会检查注册是由哪个应用发起的：它会移除当前的注册。

## 发现

通过发现（discovery），你的应用告知 Home Assistant 它正在运行，以及如何访问它。Home Assistant 随后会提议设置对应的集成（integration）。你的应用只能为其配置中 `discovery` 选项所列出的集成发送发现消息。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `POST` | `/discovery` | 发送发现消息 |
| `DELETE` | `/discovery/<uuid>` | 移除一条发现消息 |
| `GET` | `/discovery` | 列出发现消息。只有 Home Assistant Core 可以调用 |
| `GET` | `/discovery/<uuid>` | 获取一条发现消息。只有 Home Assistant Core 可以调用 |

### `POST /discovery`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `service` | 字符串 | 是 | 集成的域（domain），例如 `mqtt` |
| `config` | 字典 | 是 | 集成连接所需的信息，例如主机和端口 |

```json
{
  "service": "mqtt",
  "config": {
    "host": "core-mosquitto",
    "port": 1883
  }
}
```

响应中包含该消息的 `uuid`。请保存它，以便之后移除该消息。

### `DELETE /discovery/<uuid>`

移除一条发现消息。你的应用只能移除自己发送的消息。

### `GET /discovery`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `discovery` | 列表 | 正在运行的应用的[发现模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#discovery) |
| `services` | 字典 | 按集成划分，能够为其发送发现消息的应用的 slug |

## 认证

在配置中设置 `auth_api: true` 后，你的应用可以校验 Home Assistant 用户的用户名和密码。可以用它让用户使用其 Home Assistant 账户登录你的应用。

`auth_api` 仅涵盖 `/auth` 本身。其他认证端点属于账户管理，需要 `hassio_api: true` 以及相应的[角色](https://www.hasscn.top/contributors/apps/guides/security/#api-roles)：`/auth/list` 和 `/auth/reset` 需要 `admin`，`/auth/cache` 需要 `manager` 或 `admin`。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET`, `POST` | `/auth` | 校验用户凭据 |
| `GET` | `/auth/list` | 列出用户 |
| `POST` | `/auth/reset` | 更改用户的密码 |
| `DELETE` | `/auth/cache` | 清除凭据缓存 |

### `POST /auth`

校验用户名和密码。可以通过以下三种方式之一发送：

- `Authorization: Basic` 请求头。此时请将你的令牌放在 `X-Supervisor-Token` 中。
- 包含 `username` 和 `password` 的 JSON 请求体。
- 包含 `username` 和 `password` 的表单请求体（`application/x-www-form-urlencoded`）。

凭据正确时返回成功，否则返回 `401`。Supervisor 会将正确的凭据缓存一段时间，这样 Home Assistant 就不会在每次登录时都收到请求。

任何 `Authorization` 请求头都会被视为第一种方式，因此 Supervisor 会尝试将其读取为 `Basic` 凭据。此处请将你的令牌放在 `X-Supervisor-Token` 中，而不是 `Authorization: Bearer` 中：

```bash
curl -sSL -X POST \
  -H "X-Supervisor-Token: ${SUPERVISOR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"username": "jane", "password": "secret"}' \
  http://supervisor/auth
```

### `GET /auth/list`

返回拥有用户名的 Home Assistant 用户。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `users` | 列表 | [用户模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#user)列表 |

### `POST /auth/reset`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `username` | 字符串 | 是 | 用户名 |
| `password` | 字符串 | 是 | 新密码 |

### `DELETE /auth/cache`

清除正确凭据的缓存。

## Ingress

[Ingress](https://www.hasscn.top/contributors/apps/guides/ingress/) 在 Home Assistant 中展示你的应用的网页界面。Supervisor 会代理这些请求，因此你的应用不需要自己的登录功能或开放端口。Home Assistant Core 使用这些端点来建立 ingress 会话。你的应用自身不会调用它们。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/ingress/panels` | 使用 ingress 的应用的侧边栏面板。应用需要 `admin` 角色 |
| `POST` | `/ingress/session` | 创建 ingress 会话。只有 Home Assistant Core 可以调用 |
| `POST` | `/ingress/validate_session` | 校验 ingress 会话。只有 Home Assistant Core 可以调用 |

### `GET /ingress/panels`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `panels` | 字典 | 按应用 slug 划分的[面板模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#panel) |

### `POST /ingress/session`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `user_id` | 字符串 | 否 | Home Assistant 用户的 ID。Supervisor 会通过请求头将该用户传递给应用 |

以 `session` 返回新会话。浏览器会通过 `ingress_session` cookie 将其发送给 Supervisor。

### `POST /ingress/validate_session`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `session` | 字符串 | 是 | 要校验的会话 |

会话有效时返回成功，无效时返回 `401`。
