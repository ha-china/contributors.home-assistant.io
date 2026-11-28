# 插件端点

> Supervisor API 端点，用于运行在 Home Assistant 旁边的插件：音频服务器、CLI、DNS、多播和观察者。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/plugins/

插件（plugin）是 Supervisor 为支持系统而运行的容器：音频服务器、CLI、DNS 服务器、多播代理和观察者。每个插件都有相同的基本端点，外加一些自己的端点。

要使用这些端点，你的应用需要 `hassio_api: true` 并具有 `manager` 或 `admin` 角色。`/info` 端点对任何角色都可用。

## 共享端点

每个插件都有以下端点。将 `<plugin>` 替换为 `audio`、`cli`、`dns`、`multicast` 或 `observer`。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/<plugin>/info` | 版本信息，以及下方各插件列出的详细信息 |
| `GET` | `/<plugin>/stats` | 插件的资源使用情况 |
| `POST` | `/<plugin>/update` | 更新插件 |

`GET /<plugin>/info` 始终返回：

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `version` | string | 已安装的版本 |
| `version_latest` | string | 可用的最新版本 |
| `update_available` | boolean | 如果有可用更新则为 `true` |

`GET /<plugin>/stats` 返回一个[统计模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#stats)。添加 `one_shot` 查询参数可获得单个快速采样。

`POST /<plugin>/update` 安装新版本。在 Supervisor 仍在启动或恢复备份时会失败。audio、DNS 和 multicast 插件还会拒绝已经安装的版本。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `version` | string | 否 | 要安装的版本。默认为最新版本 |

audio、DNS 和 multicast 插件还有 `POST /<plugin>/restart`（在 Supervisor 仍在启动或恢复备份时会失败），以及位于 `/<plugin>/logs` 下的[日志端点](https://www.hasscn.top/contributors/apps/supervisor-api/#log-endpoints)。

## 音频

audio 插件运行 PulseAudio，具有 `audio: true` 的应用会使用它。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/audio/info` | 音频设备和流 |
| `POST` | `/audio/reload` | 重新读取音频设备 |
| `POST` | `/audio/restart` | 重启音频服务器 |
| `POST` | `/audio/profile` | 切换声卡的配置文件 |
| `POST` | `/audio/default/<source>` | 设置默认设备 |
| `POST` | `/audio/volume/<source>` | 设置设备的音量 |
| `POST` | `/audio/volume/<source>/application` | 设置应用程序流的音量 |
| `POST` | `/audio/mute/<source>` | 静音设备 |
| `POST` | `/audio/mute/<source>/application` | 静音应用程序流 |

`<source>` 为 `input` 或 `output`。

### `GET /audio/info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `host` | string | 音频服务器在内部网络上的 IP 地址 |
| `audio` | dictionary | 一个[音频模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#audio) |

另外还有 `version`、`version_latest` 和 `update_available`。

### `POST /audio/profile`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `card` | string | 是 | 声卡的名称 |
| `name` | string | 是 | 配置文件的名称 |

### `POST /audio/default/<source>`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `name` | string | 是 | 设备的名称 |

### `POST /audio/volume/<source>`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `index` | integer | 是 | 设备的索引，对于 `application` 路径则为流的索引 |
| `volume` | float | 是 | 音量，从 0 到 1 |

### `POST /audio/mute/<source>`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `index` | integer | 是 | 设备的索引，对于 `application` 路径则为流的索引 |
| `active` | boolean | 是 | `true` 表示静音 |

## CLI

CLI 插件运行 `ha` 命令行工具。它只有共享端点。

## DNS

DNS 插件运行 CoreDNS。内部网络上的每个容器都使用它来解析名称，包括应用的名称。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/dns/info` | DNS 设置 |
| `POST` | `/dns/options` | 更改 DNS 设置 |
| `POST` | `/dns/restart` | 重启 DNS 服务器 |
| `POST` | `/dns/reset` | 将 DNS 设置重置为默认值 |

### `GET /dns/info`

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `host` | string | DNS 服务器在内部网络上的 IP 地址 |
| `servers` | list | 你设置的 DNS 服务器 |
| `locals` | list | 宿主机的 DNS 服务器 |
| `mdns` | boolean | 如果解析 mDNS 名称则为 `true` |
| `llmnr` | boolean | 如果解析 LLMNR 名称则为 `true` |
| `fallback` | boolean | 如果在其他服务器失败时使用公共 DNS 服务器则为 `true` |

另外还有 `version`、`version_latest` 和 `update_available`。

### `POST /dns/options`

更改会重启 DNS 服务器。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `servers` | list | 否 | 最多 8 个 DNS 服务器，写作 `dns://` 加上 IPv4 地址，例如 `dns://1.1.1.1`。不接受 IPv6 地址 |
| `fallback` | boolean | 否 | 在其他服务器失败时使用公共 DNS 服务器 |

## 多播

multicast 插件在宿主机网络和内部网络之间转发 mDNS。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/multicast/info` | 多播信息 |
| `POST` | `/multicast/options` | 开启或关闭插件 |
| `POST` | `/multicast/restart` | 重启插件 |

`GET /multicast/info` 在共享键的基础上增加了 `enabled`（boolean）。

### `POST /multicast/options`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `enabled` | boolean | 否 | 开启或关闭插件 |

在插件关闭时，更新端点会失败。

## 观察者

观察者（observer）是一个小型网页，用于显示系统的状态，即使 Home Assistant 本身无法启动时也可以使用。它只有共享端点。`GET /observer/info` 增加了 `host`，即它在内部网络上的 IP 地址。
