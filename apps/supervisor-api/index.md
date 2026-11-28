# Supervisor API

> Supervisor 提供给应用的 REST API，如何进行身份验证，你的应用可以调用哪些内容，以及响应的格式。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/

Supervisor 在内部网络上运行一个 REST API。Home Assistant Core 使用它，CLI 使用它，你的应用也可以使用它：读取自己的配置、查找 MQTT 代理（broker）、创建备份，或重启 Home Assistant。本节是该 API 的参考文档。

这些路径仍然使用旧名称：应用位于 `/addons` 和 `/store/addons` 之下。这就是真实的 API，所以你调用的就是这些路径。

## 基础 URL 和身份验证

在应用容器内部，API 位于 `http://supervisor/`。Supervisor 通过 `SUPERVISOR_TOKEN` 环境变量为每个应用提供自己的令牌（token）。在每次请求中都要携带它：

```bash
curl -sSL \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  http://supervisor/info
```

Supervisor 接受以下任意一种请求头中的令牌，按此顺序检查：

- `X-Supervisor-Token: <token>`
- `X-Hassio-Key: <token>`（旧版）
- `Authorization: Bearer <token>`

同一个令牌也可以通过 `HASSIO_TOKEN` 获取，这是该变量的旧名称。在新代码中请使用 `SUPERVISOR_TOKEN`。

如果你使用 Bash 编写应用脚本，[Bashio](https://www.hasscn.top/contributors/apps/bashio/) 将此 API 的大部分功能封装在 `bashio::app.option` 和 `bashio::services` 等函数中。它会为你处理令牌。

## 你的应用可以调用什么

你的应用能够访问哪些端点取决于它在 `config.yaml` 中的配置。完整说明请参阅[与 Home Assistant 和 Supervisor 通信](https://www.hasscn.top/contributors/apps/guides/communication/)，相关选项请参阅[配置参考](https://www.hasscn.top/contributors/apps/reference/configuration/)。

### 无需任何额外权限

每个应用都可以使用其令牌调用这些端点，即使没有 `hassio_api`：

| 路径 | 用途 |
| --- | --- |
| `/addons/self/<endpoint>` | 你自己应用下一级的端点，如 `info`、`options`、`logs`、`stats`、`start` 或 `restart`。不包括 `security` 和 `update`，也不包括更深的路径如 `logs/follow` |
| `/addons/self/options/config` | 你自己应用的已验证选项 |
| `/info` | 关于系统的一般信息 |
| `/services` 及其下所有内容 | [服务](https://www.hasscn.top/contributors/apps/supervisor-api/services/)，如 MQTT |
| `/discovery` 及其下所有内容 | [发现](https://www.hasscn.top/contributors/apps/supervisor-api/services/#discovery)消息 |
| `/auth` | 检查用户凭据，需要 `auth_api: true` |

`self` 是一个别名：在路径中需要应用 slug 的地方，你的应用可以使用 `self` 来指代自己。

### 需要 `hassio_api: true`

在 `config.yaml` 中设置 `hassio_api: true` 可以访问更多的 API。具体能访问什么取决于你通过 `hassio_role` 设置的角色：

| 角色 | 可以调用 |
| --- | --- |
| `default` | 所有以 `/info` 结尾的路径，如 `/core/info` 或 `/os/info` |
| `homeassistant` | `default` 的全部内容，外加 `/core/` 和 `/homeassistant/` 下的所有内容 |
| `backup` | `default` 的全部内容，外加 `/backups` 下的所有内容 |
| `manager` | `default` 的全部内容，外加 `/addons`（其他应用的 `security` 端点除外）、`/addons/reload`、`/audio`、`/auth/cache`、`/available_updates`、`/backups`、`/cli`、`/core`、`/dns`、`/docker`、`/hardware`、`/homeassistant`、`/host`、`/jobs`、`/mounts`、`/multicast`、`/network`、`/observer`、`/os`（`/os/datadisk/wipe` 除外）、`/refresh_updates`、`/resolution`、`/security`、`/store`、`/supervisor` 和 `/time` |
| `admin` | 所有内容 |

只请求你的应用所需的角色。`manager` 和 `admin` 角色会降低你应用的[安全评级](https://www.hasscn.top/contributors/apps/guides/security/)。

### 应用永远不能调用的路径

有些路径对所有应用都是禁止的，无论其角色如何：

- `/addons/<app>/sys_options` 和 `/os/ssh/authorized_keys` 只接受来自 Home Assistant Core 的调用。
- `/core/api/hassio...` 和 `/homeassistant/api/hassio...` 对所有人都是封锁的。通过这些 Core 端点，调用者将以 Supervisor 本身的身份执行操作。
- 通过 [WebSocket 代理](https://www.hasscn.top/contributors/apps/supervisor-api/core/#get-corewebsocket)，以 `supervisor/` 或 `hassio/` 开头的命令会被拒绝。

### 无需令牌

`GET /supervisor/ping` 不需要令牌。对 [Home Assistant Core 代理](https://www.hasscn.top/contributors/apps/supervisor-api/core/#home-assistant-core-api-proxy)的调用也不会根据你的角色进行检查：代理会自行检查你的令牌，并且只有当你的应用具有 `homeassistant_api: true` 时才允许你通过。

## 响应

大多数端点以相同的信封（envelope）格式返回 JSON。一次成功的调用：

```json
{
  "result": "ok",
  "data": {}
}
```

`data` 包含端点的响应。本参考文档中的响应表描述的是 `data` 内部的内容。只执行某个操作的端点（如重启）会返回空的 `data`。

一次失败的调用：

```json
{
  "result": "error",
  "message": "App my_app does not exist",
  "error_key": "app_not_found_error",
  "extra_fields": {}
}
```

| 键 | 描述 |
| --- | --- |
| `result` | `ok` 或 `error` |
| `data` | 响应内容，仅在成功时存在 |
| `message` | 人类可读的错误消息 |
| `error_key` | 错误的稳定键名（当错误有键名时）。在代码中请使用它，而不是解析 `message` |
| `extra_fields` | 与 `error_key` 相关的值（如果有的话） |
| `job_id` | 失败的[任务](https://www.hasscn.top/contributors/apps/supervisor-api/supervisor/#jobs)的 ID（当错误来自某个任务时） |

有些端点不使用这种信封格式。日志、更新日志和文档以纯文本形式返回。图标和徽标以 PNG 图像形式返回。备份下载以 tar 文件形式返回。当这些操作失败时，错误信息也是纯文本。

### 状态码

| 代码 | 含义 |
| --- | --- |
| `200` | 成功 |
| `400` | 请求失败。阅读 `message` 了解原因。当 Supervisor 仍在启动时，你也会收到此状态码 |
| `401` | 没有令牌，或端点不接受该令牌 |
| `403` | 你的应用没有此路径的权限 |
| `404` | 应用、备份、任务或其他对象不存在 |
| `409` | 冲突，例如某个操作已经在运行 |
| `500` | Supervisor 内部出现错误。请检查 Supervisor 日志 |

### 后台任务

长时间运行的操作，如安装应用或创建备份，会作为[任务](https://www.hasscn.top/contributors/apps/supervisor-api/supervisor/#jobs)运行。多个端点接受 `background` 选项。设置 `background: true` 后，调用会立即返回一个 `job_id`，你可以通过 `GET /jobs/<job_id>` 跟踪进度。

## 日志端点

应用、Home Assistant Core、Supervisor、插件和主机都有工作方式相同的日志端点。它们从主机的 systemd journal 读取数据并返回纯文本。

| 路径 | 返回内容 |
| --- | --- |
| `<base>/logs` | 最近的日志行 |
| `<base>/logs/follow` | 最近的日志行，然后保持连接打开并流式传输新行 |
| `<base>/logs/latest` | 自容器上次启动以来的所有日志行 |
| `<base>/logs/boots/<bootid>` | 某次启动的日志行 |
| `<base>/logs/boots/<bootid>/follow` | 某次启动的日志行，然后流式传输新行 |

`<bootid>` 可以是来自 [`GET /host/logs/boots`](https://www.hasscn.top/contributors/apps/supervisor-api/host/#get-hostlogsboots) 的启动 ID，也可以是一个偏移量：`0` 表示当前启动，`-1` 表示上一次启动，依此类推。正数从 journal 中仍保留的最早一次启动开始计数。

日志端点接受以下查询参数和请求头：

| 参数 | 描述 |
| --- | --- |
| `lines` | 查询参数。要返回的行数。默认为 100，最小为 2 |
| `verbose` | 查询参数，无需值。为每行添加时间戳、主机名和进程 |
| `no_colors` | 查询参数，无需值。去除 ANSI 颜色代码 |
| `Accept` | 请求头。`text/plain`（默认）或 `text/x-log`。`text/x-log` 提供与 `verbose` 相同的输出 |
| `Range` | 请求头。[systemd-journal-gatewayd](https://www.freedesktop.org/software/systemd/man/latest/systemd-journal-gatewayd.service.html) 范围，如 `entries=cursor[[:num_skip]:num_entries]`。设置 `lines` 时会被忽略 |

响应中有一个 `X-First-Cursor` 请求头，包含第一行的 journal 游标（cursor）。将其传入 `Range` 请求头即可向前翻阅更早的日志行。

## 示例

检查 Supervisor 是否已启动。这个调用不需要令牌：

```bash
curl -sSL http://supervisor/supervisor/ping
```

```json
{
  "result": "ok",
  "data": {}
}
```

获取主机的网络配置。这个调用需要你的应用具有 `hassio_api: true`，任何角色都可以：

```bash
curl -sSL \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  http://supervisor/network/info
```

读取你自己应用的选项，并根据其模式（schema）进行验证：

```bash
curl -sSL \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  http://supervisor/addons/self/options/config
```

```json
{
  "result": "ok",
  "data": {
    "name": "world",
    "beer": true
  }
}
```

## 各端点

- [应用](https://www.hasscn.top/contributors/apps/supervisor-api/apps/)：已安装的应用、它们的选项、状态和日志。
- [商店](https://www.hasscn.top/contributors/apps/supervisor-api/store/)：可安装的应用和应用仓库。
- [备份](https://www.hasscn.top/contributors/apps/supervisor-api/backups/)：创建、恢复和管理备份。
- [Home Assistant Core](https://www.hasscn.top/contributors/apps/supervisor-api/core/)：控制 Core，以及访问其 REST 和 WebSocket API 的代理。
- [主机和操作系统](https://www.hasscn.top/contributors/apps/supervisor-api/host/)：主机、Home Assistant OS、硬件、网络、时间、挂载和 Docker。
- [插件](https://www.hasscn.top/contributors/apps/supervisor-api/plugins/)：audio、CLI、DNS、multicast 和 observer。
- [Supervisor](https://www.hasscn.top/contributors/apps/supervisor-api/supervisor/)：Supervisor 本身、更新、任务、resolution 和安全。
- [服务、发现、身份验证和 ingress](https://www.hasscn.top/contributors/apps/supervisor-api/services/)：应用之间以及与 Home Assistant 协同工作所使用的内容。
- [模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/)：多个端点返回的对象。

## API 版本 2

Supervisor 在 `/v2` 下还有此 API 的第二个版本，其中应用位于 `/apps` 和 `/store/apps` 之下，而不是 `/addons` 和 `/store/addons`。它仅在 `supervisor_v2_api` 开发功能标志开启时才可用，并且仍在变化中。本参考文档涵盖的是不带 `/v2` 的 API，即每个安装都有的那个版本。
