---
title: Home Assistant Core 端点
description: 用于控制 Home Assistant Core 的 Supervisor API 端点，以及您的应用访问 Core REST 和 WebSocket API 所使用的代理。
sidebarLabel: Home Assistant Core
order: 4
---

`/core` 下有两类端点。第一类控制 Home Assistant Core 容器：启动、停止、更新及其设置。第二类是 Home Assistant 自身 API 的代理，这样您的应用无需知道密码或端口即可读取状态并调用操作。

这些端点中的大多数也可以在 `/homeassistant`（旧名称）下使用，而不是 `/core`。那里的代理没有 `DELETE`。请使用 `/core`。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/core/info` | Home Assistant Core 的信息 |
| `POST` | `/core/options` | 更改 Core 设置 |
| `POST` | `/core/update` | 更新 Home Assistant Core |
| `POST` | `/core/start` | 启动 Home Assistant Core |
| `POST` | `/core/stop` | 停止 Home Assistant Core |
| `POST` | `/core/restart` | 重启 Home Assistant Core |
| `POST` | `/core/rebuild` | 重建 Core 容器 |
| `POST` | `/core/check` | 检查配置 |
| `GET` | `/core/stats` | Core 的资源使用情况 |
| `GET` | `/core/logs` | Core 的日志，以及其他[日志端点](/apps/supervisor-api/#log-endpoints) |
| `GET`, `POST`, `DELETE` | `/core/api/<path>` | Home Assistant REST API 的代理 |
| `GET` | `/core/api/stream` | 事件流的代理 |
| `GET` | `/core/websocket` | Home Assistant WebSocket API 的代理 |

## 控制 Home Assistant Core

要使用这些端点，您的应用需要 `hassio_api: true` 以及 `homeassistant`、`manager` 或 `admin` 角色。`GET /core/info` 在任何角色下都可用。

### `GET /core/info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `version` | string | 已安装的版本 |
| `version_latest` | string | 可用的最新版本 |
| `update_available` | boolean | 如果有可用更新则为 `true` |
| `machine` | string | 机器类型，例如 `generic-x86-64` 或 `raspberrypi5-64` |
| `ip_address` | string | Core 在内部网络中的 IP 地址 |
| `arch` | string | 架构 |
| `image` | string | 容器镜像 |
| `boot` | boolean | 如果 Core 随系统启动则为 `true` |
| `port` | integer | Home Assistant Web 服务器的端口 |
| `ssl` | boolean | 如果 Web 服务器使用 SSL 则为 `true` |
| `watchdog` | boolean | 如果看门狗（watchdog）已开启则为 `true` |
| `audio_input` | string or null | 已选择的音频输入设备 |
| `audio_output` | string or null | 已选择的音频输出设备 |
| `backups_exclude_database` | boolean | 如果备份默认不包含数据库则为 `true` |
| `duplicate_log_file` | boolean | 如果 Core 同时将日志写入文件则为 `true` |

```json
{
  "version": "2026.10.1",
  "version_latest": "2026.10.1",
  "update_available": false,
  "machine": "generic-x86-64",
  "ip_address": "172.30.32.1",
  "arch": "amd64",
  "image": "ghcr.io/home-assistant/generic-x86-64-homeassistant",
  "boot": true,
  "port": 8123,
  "ssl": false,
  "watchdog": true,
  "audio_input": null,
  "audio_output": null,
  "backups_exclude_database": false,
  "duplicate_log_file": false
}
```

### `POST /core/options`

只发送您想要更改的键。

| 键 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `boot` | boolean | 否 | 随系统启动 Core |
| `image` | string or null | 否 | 使用其他容器镜像。`null` 恢复为默认值 |
| `port` | integer | 否 | Home Assistant Web 服务器的端口 |
| `ssl` | boolean | 否 | Web 服务器使用 SSL |
| `watchdog` | boolean | 否 | 开启或关闭看门狗（watchdog） |
| `refresh_token` | string or null | 否 | Supervisor 用于 Core 的刷新令牌（refresh token） |
| `audio_input` | string or null | 否 | 音频输入设备 |
| `audio_output` | string or null | 否 | 音频输出设备 |
| `backups_exclude_database` | boolean | 否 | 备份默认不包含数据库 |
| `duplicate_log_file` | boolean | 否 | 同时将 Core 日志写入文件 |

### `POST /core/update`

更新 Home Assistant Core。在 Supervisor 仍在启动或正在恢复备份期间，以及 Core 正在运行数据库迁移时，此操作会失败。

| 键 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `version` | string | 否 | 要安装的版本。默认为最新版本 |
| `backup` | boolean | 否 | 在更新前创建备份。默认 `false` |
| `background` | boolean | 否 | 立即返回 `job_id` 而不是等待。默认 `false` |

### `POST /core/start`

启动 Home Assistant Core。与重启和重建一样，在 Supervisor 仍在启动或正在恢复备份期间，此操作会失败。

### `POST /core/stop`

停止 Home Assistant Core。

| 键 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `force` | boolean | 否 | 即使 Core 正在运行数据库迁移也停止。默认 `false` |

### `POST /core/restart`

重启 Home Assistant Core。

| 键 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `safe_mode` | boolean | 否 | 以安全模式启动，自定义集成（integration）将被关闭。默认 `false` |
| `force` | boolean | 否 | 即使 Core 正在运行数据库迁移也重启。默认 `false` |

### `POST /core/rebuild`

移除 Core 容器，并使用相同镜像重新创建。接受与 `POST /core/restart` 相同的键。

### `POST /core/check`

检查 Home Assistant 配置。配置有效时返回成功，无效时返回包含检查输出的错误。

### `GET /core/stats`

以[统计模型](/apps/supervisor-api/models/#stats)的形式返回 Home Assistant Core 的资源使用情况。添加 `one_shot` 查询参数可获取单次快速采样。

## Home Assistant Core API 代理

The proxy forwards your requests to the REST API and WebSocket API of Home Assistant Core, using your app's token. On the Core side, the requests run as an administrator of Home Assistant. Your app needs `homeassistant_api: true` in its configuration. It does not need `hassio_api` or a role. See [talk to Home Assistant](/apps/guides/communication/) for how to use it.

以 `hassio` 开头的路径会被代理阻止。

### `GET /core/api/<path>`

也支持 `POST` 和 `DELETE`。将请求转发到 Home Assistant Core 上的 `/api/<path>`，并原样返回 Core 的响应。代理不会将其包装在 Supervisor 信封中。

```bash
curl -sSL \
  -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
  http://supervisor/core/api/states/sun.sun
```

### `GET /core/api/stream`

转发 Home Assistant Core 的服务器发送事件（server-sent event）流。

### `GET /core/websocket`

打开到 Home Assistant Core 的 WebSocket 连接。`/core/api/websocket` 也可以。握手是标准的 Home Assistant 握手，使用您应用的令牌作为访问令牌：

```json
{
  "type": "auth",
  "access_token": "<your SUPERVISOR_TOKEN>"
}
```

在 `auth_ok` 之后，您可以照常使用 WebSocket API。以 `supervisor/` 或 `hassio/` 开头的命令会被拒绝。
