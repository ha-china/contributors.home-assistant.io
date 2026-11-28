# Supervisor 端点

> Supervisor API 端点，涵盖 Supervisor 本身、系统信息、更新、任务、问题解决中心和安全设置。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/supervisor/

这些端点与 Supervisor 和整个系统相关。`GET /info` 对每个应用都可用，无需额外权限。其他 `/info` 端点适用于任何角色。其余端点需要 `hassio_api: true` 以及 `manager` 或 `admin` 角色。

## 系统

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/info` | 系统概览 |
| `GET` | `/available_updates` | 可用的更新 |
| `POST` | `/reload_updates` | 检查更新 |
| `POST` | `/refresh_updates` | 检查更新并重新加载商店 |

### `GET /info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `supervisor` | string | Supervisor 的版本 |
| `homeassistant` | string or null | Home Assistant Core 的版本 |
| `hassos` | string or null | Home Assistant OS 的版本，在其他系统上为 `null` |
| `docker` | string | Docker 的版本 |
| `hostname` | string or null | 主机名 |
| `operating_system` | string or null | 操作系统名称 |
| `features` | list | 主机支持的功能 |
| `machine` | string | 机器类型，例如 `generic-x86-64` |
| `machine_id` | string or null | 主机的机器 ID |
| `arch` | string | 主架构 |
| `supported_arch` | list | 系统可运行的所有架构 |
| `state` | string | Supervisor 的状态，例如 `running` |
| `supported` | boolean | 如果安装受支持则为 `true` |
| `channel` | string | 更新通道：`stable`、`beta` 或 `dev` |
| `logging` | string | Supervisor 的日志级别 |
| `timezone` | string | 时区 |

```json
{
  "supervisor": "2026.10.0",
  "homeassistant": "2026.10.1",
  "hassos": "17.0",
  "docker": "28.3.3",
  "hostname": "homeassistant",
  "operating_system": "Home Assistant OS 17.0",
  "features": ["reboot", "shutdown", "services", "network", "hostname"],
  "machine": "generic-x86-64",
  "machine_id": "d4d2b9f5a6b84e2f9c3e1a7b8c9d0e1f",
  "arch": "amd64",
  "supported_arch": ["amd64"],
  "state": "running",
  "supported": true,
  "channel": "stable",
  "logging": "info",
  "timezone": "Europe/Amsterdam"
}
```

### `GET /available_updates`

返回 Core、Supervisor、操作系统以及已安装应用的可用更新。旧路径 `/supervisor/available_updates` 返回相同内容。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `available_updates` | list | 每个更新一个条目，包含 `update_type`（`core`、`supervisor`、`os` 或 `addon`）、`panel_path` 和 `version_latest`。应用更新还包含 `name` 和 `icon` |

### `POST /reload_updates`

检查 Core、Supervisor、操作系统和插件的新版本。

### `POST /refresh_updates`

与 `POST /reload_updates` 相同，还会重新加载应用商店。建议使用 `POST /reload_updates` 和 [`POST /store/reload`](https://www.hasscn.top/contributors/apps/supervisor-api/store/#post-storereload)。

## Supervisor

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/supervisor/ping` | 检查 Supervisor 是否已启动。无需令牌 |
| `GET` | `/supervisor/info` | 关于 Supervisor 的信息 |
| `POST` | `/supervisor/options` | 更改 Supervisor 设置 |
| `POST` | `/supervisor/update` | 更新 Supervisor |
| `POST` | `/supervisor/reload` | 重新加载版本、密钥和系统检查 |
| `POST` | `/supervisor/restart` | 重启 Supervisor |
| `POST` | `/supervisor/repair` | 修复安装 |
| `GET` | `/supervisor/stats` | Supervisor 的资源使用情况 |
| `GET` | `/supervisor/logs` | Supervisor 的日志，以及其他[日志端点](https://www.hasscn.top/contributors/apps/supervisor-api/#log-endpoints)。当日志系统无法提供日志时，将返回容器的 Docker 日志 |

### `GET /supervisor/ping`

当 Supervisor 已启动时返回成功。它无需令牌，因此你可以在调用其他任何内容之前先调用它。

### `GET /supervisor/info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `version` | string | 已安装的版本 |
| `version_latest` | string | 最新可用版本 |
| `update_available` | boolean | 如果有可用更新则为 `true` |
| `channel` | string | `stable`、`beta` 或 `dev` |
| `arch` | string | 架构 |
| `supported` | boolean | 如果安装受支持则为 `true` |
| `healthy` | boolean | 如果安装状态健康则为 `true` |
| `ip_address` | string | Supervisor 在内部网络上的 IP 地址 |
| `timezone` | string or null | 时区 |
| `logging` | string | 日志级别 |
| `debug` | boolean | 如果调试模式已开启则为 `true` |
| `debug_block` | boolean | 如果 Supervisor 在启动时等待调试器则为 `true` |
| `diagnostics` | boolean or null | 如果已共享诊断信息则为 `true` |
| `auto_update` | boolean | 如果 Supervisor 自动更新则为 `true` |
| `detect_blocking_io` | boolean | 如果阻塞 I/O 检测已开启则为 `true` |
| `country` | string or null | 国家代码 |
| `feature_flags` | dictionary | 开发功能标志及其是否开启 |
| `wait_boot` | integer | 已弃用 |
| `addons` | list | 已弃用。已安装的应用，包含 `name`、`slug`、`version`、`version_latest`、`update_available`、`state`、`repository` 和 `icon`。请使用 [`GET /addons`](https://www.hasscn.top/contributors/apps/supervisor-api/apps/#get-addons) |
| `addons_repositories` | list | 已弃用。仓库，包含 `name` 和 `slug`。请使用 [`GET /store/repositories`](https://www.hasscn.top/contributors/apps/supervisor-api/store/#get-storerepositories) |

### `POST /supervisor/options`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `channel` | string | 否 | `stable`、`beta` 或 `dev` |
| `timezone` | string | 否 | 时区，例如 `Europe/Amsterdam`。在 Home Assistant OS 16.2 或更新版本上，还会设置主机的时区 |
| `logging` | string | 否 | `debug`、`info`、`warning`、`error` 或 `critical` |
| `debug` | boolean | 否 | 调试模式 |
| `debug_block` | boolean | 否 | 启动时等待调试器 |
| `diagnostics` | boolean | 否 | 共享诊断信息 |
| `auto_update` | boolean | 否 | 自动更新 Supervisor |
| `detect_blocking_io` | string | 否 | `on`、`off` 或 `on-at-startup` |
| `country` | string | 否 | 国家代码 |
| `feature_flags` | dictionary | 否 | 要开启或关闭的开发功能标志，例如 `{"supervisor_v2_api": true}`。未列出的标志保持其原值 |
| `wait_boot` | integer | 否 | 已弃用 |
| `addons_repositories` | list | 否 | 已弃用。替换仓库列表。请使用[仓库端点](https://www.hasscn.top/contributors/apps/supervisor-api/store/#repositories) |

### `POST /supervisor/update`

将 Supervisor 更新到最新版本。没有可用更新时会失败。`version` 键仅在 Supervisor 开发环境（`SUPERVISOR_DEV` 为 `1`）中有效。在其他任何地方，Supervisor 都会忽略它并安装最新版本。

### `POST /supervisor/reload`

检查新版本，重新加载 Home Assistant 密钥，并再次检查系统。

### `POST /supervisor/restart`

重启 Supervisor。

### `POST /supervisor/repair`

修复安装：在可能的情况下修复缺失的镜像、容器和文件。

### `GET /supervisor/stats`

以[统计模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#stats)的形式返回 Supervisor 的资源使用情况。

## 任务

Supervisor 将长时间运行的任务（如安装、更新和备份）作为任务（job）运行。任务构成一棵树：例如，一个备份任务包含每个应用的子任务。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/jobs/info` | 所有任务 |
| `GET` | `/jobs/<job_id>` | 单个任务 |
| `DELETE` | `/jobs/<job_id>` | 移除一个已完成的任务 |
| `POST` | `/jobs/options` | 更改任务设置 |
| `POST` | `/jobs/reset` | 重置任务设置 |

### `GET /jobs/info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `ignore_conditions` | list | Supervisor 在启动任务前会忽略的条件 |
| `jobs` | list | [任务模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#job)，最新的在前 |

### `GET /jobs/<job_id>`

返回单个[任务模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#job)，包含其子任务。用它来跟踪你以 `background: true` 启动的任务。

```json
{
  "name": "backup_manager_partial_backup",
  "reference": "a1b2c3d4",
  "uuid": "e2b7a9c4f1d34e5a8b6c0d1e2f3a4b5c",
  "progress": 0,
  "stage": "addons",
  "done": false,
  "errors": [],
  "created": "2026-10-01T09:30:00.000000+00:00",
  "extra": null,
  "child_jobs": []
}
```

除非 `supervisor_websocket_v2_api` 开发功能标志已开启，某些任务在这里仍使用其旧名称。备份和恢复任务报告的阶段如 `addons` 而非 `apps`，更新应用的任务名为 `addon_manager_update`。

### `DELETE /jobs/<job_id>`

从列表中移除一个任务。任务未完成时会失败。

### `POST /jobs/options`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `ignore_conditions` | list | 否 | 启动任务前要忽略的条件，例如 `healthy` 或 `internet_host`。会替换当前列表。这可能导致问题，因此仅用于调试 |

### `POST /jobs/reset`

将任务设置重置为默认值，因此不再忽略任何条件。

## 问题解决

问题解决中心（resolution center）会发现系统问题并建议修复方法。问题（issue）是一个故障，建议（suggestion）是针对某个问题的修复方法，检查（check）是发现它们的测试。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/resolution/info` | 问题、建议和检查 |
| `GET` | `/resolution/issue/<issue>/suggestions` | 针对某个问题的建议 |
| `DELETE` | `/resolution/issue/<issue>` | 忽略一个问题 |
| `POST` | `/resolution/suggestion/<suggestion>` | 应用一个建议 |
| `DELETE` | `/resolution/suggestion/<suggestion>` | 忽略一个建议 |
| `POST` | `/resolution/check/<check>/options` | 开启或关闭一项检查 |
| `POST` | `/resolution/check/<check>/run` | 运行一项检查 |
| `POST` | `/resolution/healthcheck` | 运行所有检查，并应用可自动执行的修复 |

`<issue>` 和 `<suggestion>` 是 UUID。`<check>` 是检查的 slug。

### `GET /resolution/info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `unsupported` | list | 安装不受支持的原因 |
| `unhealthy` | list | 安装状态不健康的原因 |
| `issues` | list | [问题模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#issue) |
| `suggestions` | list | [建议模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#suggestion) |
| `checks` | list | [检查模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#check) |

某些问题类型和检查 slug 在这里仍使用其旧名称，例如 `deprecated_addon` 和 `addon_pwned`。

### `GET /resolution/issue/<issue>/suggestions`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `suggestions` | list | 可修复此问题的[建议模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#suggestion) |

### `POST /resolution/check/<check>/options`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `enabled` | boolean | 否 | 开启或关闭该检查 |

## 安全

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/security/info` | 安全设置 |
| `POST` | `/security/options` | 更改安全设置 |
| `POST` | `/security/integrity` | 已移除。始终返回 `410` |

### `GET /security/info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `pwned` | boolean | 如果应用密码会与已知泄露进行比对检查则为 `true` |
| `force_security` | boolean | 如果密码已泄露的应用不允许启动则为 `true` |

### `POST /security/options`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `pwned` | boolean | 否 | 将应用密码与已知泄露进行比对检查 |
| `force_security` | boolean | 否 | 阻止密码已泄露的应用 |
