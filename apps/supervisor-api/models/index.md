# Supervisor API 模型

> 多个 Supervisor API 端点返回的对象，例如应用、备份、任务、网络接口和挂载。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/models/

这些是会从多个端点返回的对象。各端点页面会链接到这里。

## 应用（App）

已安装的应用，即 [`GET /addons`](https://www.hasscn.top/contributors/apps/supervisor-api/apps/#get-addons) 列出的对象。[`GET /addons/<app>/info`](https://www.hasscn.top/contributors/apps/supervisor-api/apps/#get-addonsappinfo) 会返回更多信息。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 应用名称 |
| `slug` | string | 应用的 slug |
| `description` | string | 简短描述 |
| `advanced` | boolean | 已弃用，始终为 `false` |
| `stage` | string | `stable`、`experimental` 或 `deprecated` |
| `version` | string | 已安装的版本 |
| `version_latest` | string | 最新可用版本 |
| `update_available` | boolean | 如果有可用更新则为 `true` |
| `available` | boolean | 如果应用可以在此系统上运行则为 `true` |
| `detached` | boolean | 如果应用已不在任何仓库中则为 `true` |
| `homeassistant` | string or null | 最低 Home Assistant 版本 |
| `state` | string | `startup`、`started`、`stopped`、`unknown` 或 `error` |
| `repository` | string | 仓库的 slug |
| `build` | boolean | 如果应用是在本地构建的则为 `true` |
| `url` | string or null | 应用的网站 |
| `icon` | boolean | 如果应用有图标则为 `true` |
| `logo` | boolean | 如果应用有徽标则为 `true` |
| `system_managed` | boolean | 如果 Home Assistant 管理该应用则为 `true` |

## 商店应用（Store app）

商店中的应用，无论是否已安装，即 [`GET /store/addons`](https://www.hasscn.top/contributors/apps/supervisor-api/store/#get-storeaddons) 列出的对象。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 应用名称 |
| `slug` | string | 应用的 slug |
| `description` | string | 简短描述 |
| `advanced` | boolean | 已弃用，始终为 `false` |
| `arch` | list | 支持的架构 |
| `available` | boolean | 如果应用可以安装在此系统上则为 `true` |
| `build` | boolean | 如果应用是在本地构建的则为 `true` |
| `documentation` | boolean | 如果应用有文档则为 `true` |
| `homeassistant` | string or null | 最低 Home Assistant 版本 |
| `icon` | boolean | 如果应用有图标则为 `true` |
| `logo` | boolean | 如果应用有徽标则为 `true` |
| `installed` | boolean | 如果应用已安装则为 `true` |
| `repository` | string | 仓库的 slug |
| `stage` | string | `stable`、`experimental` 或 `deprecated` |
| `update_available` | boolean | 如果有可用更新则为 `true` |
| `url` | string or null | 应用的网站 |
| `version` | string or null | 已安装的版本，未安装时为 `null` |
| `version_latest` | string | 最新可用版本 |

## 仓库（Repository）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `slug` | string | 仓库的 slug |
| `name` | string | 仓库名称 |
| `source` | string | Git URL，内置仓库则为 `local` 和 `core` |
| `url` | string | 仓库的网站。仓库未设置时与 `source` 相同 |
| `maintainer` | string | 仓库的维护者 |

## 备份（Backup）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `slug` | string | 备份的 ID |
| `name` | string | 备份名称 |
| `date` | string | 备份创建的时间，采用 ISO 8601 格式 |
| `type` | string | `full` 或 `partial` |
| `size` | float | 大小（MB） |
| `size_bytes` | integer | 大小（字节） |
| `location` | string or null | 主位置。`null` 表示本地备份文件夹 |
| `locations` | list | 备份存储的所有位置 |
| `protected` | boolean | 如果备份有密码则为 `true` |
| `location_attributes` | dictionary | 每个位置的 `protected` 和 `size_bytes`。本地文件夹为 `.local` |
| `compressed` | boolean | 如果备份已压缩则为 `true` |
| `content` | dictionary | 备份中的内容：`homeassistant`（boolean）、`addons`（slug 列表）和 `folders`（列表） |

## 统计（Stats）

容器的资源使用情况。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `cpu_percent` | float or null | CPU 使用率（百分比），单次采样时为 `null` |
| `cpu_usage` | integer | 容器的总 CPU 时间 |
| `cpu_system_usage` | integer | 系统的总 CPU 时间 |
| `online_cpus` | integer | CPU 数量 |
| `memory_usage` | integer | 内存使用量（字节） |
| `memory_limit` | integer | 内存限制（字节） |
| `memory_percent` | float | 内存使用量占限制的百分比 |
| `network_rx` | integer | 接收的字节数 |
| `network_tx` | integer | 发送的字节数 |
| `blk_read` | integer | 从磁盘读取的字节数 |
| `blk_write` | integer | 写入磁盘的字节数 |

## 服务（Service）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `slug` | string | 服务名称，例如 `mqtt` |
| `available` | boolean | 如果有应用提供该服务则为 `true` |
| `providers` | list | 可以提供该服务的应用的 slug |

## 发现（Discovery）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `addon` | string | 发送该消息的应用的 slug |
| `service` | string | 集成（integration）的域 |
| `uuid` | string | 消息的 ID |
| `config` | dictionary | 集成连接所需的信息 |

## 面板（Panel）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `title` | string | 侧边栏中的标题 |
| `icon` | string | 侧边栏中的图标 |
| `admin` | boolean | 如果只有管理员可见该面板则为 `true` |
| `enable` | boolean | 如果面板显示在侧边栏中则为 `true` |

## 用户（User）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `username` | string | 用于登录的用户名 |
| `name` | string | 显示名称 |
| `is_owner` | boolean | 如果该用户是所有者则为 `true` |
| `is_active` | boolean | 如果该用户可以登录则为 `true` |
| `local_only` | boolean | 如果该用户只能从本地网络登录则为 `true` |
| `group_ids` | list | 用户所属的组，例如 `system-admin` |

## 任务（Job）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 任务名称 |
| `reference` | string or null | 任务处理的对象，例如应用 slug 或备份 ID |
| `uuid` | string | 任务的 ID |
| `progress` | float | 进度（0 到 100），当任务可以报告时 |
| `stage` | string or null | 任务所处的阶段 |
| `done` | boolean or null | 完成时为 `true`，任务尚未开始时为 `null` |
| `created` | string | 任务创建的时间，采用 ISO 8601 格式 |
| `errors` | list | [任务错误](https://www.hasscn.top/contributors/apps/supervisor-api/models/#job-error) |
| `extra` | dictionary or null | 关于任务或其阶段的额外信息 |
| `child_jobs` | list | 此任务启动的任务 |

### 任务错误（Job error）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `type` | string | 错误类型 |
| `message` | string | 出了什么问题 |
| `stage` | string or null | 任务当时所处的阶段 |
| `error_key` | string or null | 错误的稳定键 |
| `extra_fields` | dictionary or null | 与 `error_key` 一起使用的值 |

## 问题（Issue）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `uuid` | string | 问题的 ID |
| `type` | string | 问题类型 |
| `context` | string | 问题所在的位置，例如 `addon`、`core` 或 `system` |
| `reference` | string or null | 相关对象，例如应用 slug |
| `reference_extra` | dictionary or null | 额外细节，例如冲突的端口 |

## 建议（Suggestion）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `uuid` | string | 建议的 ID |
| `type` | string | 修复类型 |
| `context` | string | 修复适用的位置 |
| `reference` | string or null | 相关对象，例如应用 slug |
| `reference_extra` | dictionary or null | 额外细节 |
| `auto` | boolean | 如果 Supervisor 会自行应用修复则为 `true` |

## 检查（Check）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `slug` | string | 检查的 slug |
| `enabled` | boolean | 如果检查会运行则为 `true` |

## 主机服务（Host service）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | systemd 单元的名称 |
| `description` | string | 单元的描述 |
| `state` | string | 单元的状态，例如 `active` |

## 网络接口（Network interface）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `interface` | string | 接口名称，例如 `eth0` |
| `type` | string | `ethernet`、`wireless` 或 `vlan` |
| `enabled` | boolean | 如果接口已启用则为 `true` |
| `connected` | boolean | 如果接口已连接则为 `true` |
| `primary` | boolean | 如果这是主接口则为 `true` |
| `mac` | string | MAC 地址 |
| `ipv4` | dictionary or null | [IP 配置](https://www.hasscn.top/contributors/apps/supervisor-api/models/#ip-configuration) |
| `ipv6` | dictionary or null | [IP 配置](https://www.hasscn.top/contributors/apps/supervisor-api/models/#ip-configuration) |
| `wifi` | dictionary or null | [Wi-Fi 配置](https://www.hasscn.top/contributors/apps/supervisor-api/models/#wi-fi-configuration) |
| `vlan` | dictionary or null | [VLAN 配置](https://www.hasscn.top/contributors/apps/supervisor-api/models/#vlan-configuration) |
| `mdns` | string | `default`、`off`、`resolve` 或 `announce` |
| `llmnr` | string | `default`、`off`、`resolve` 或 `announce` |

### IP 配置（IP configuration）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `method` | string | `auto`、`static` 或 `disabled` |
| `address` | list | 带前缀的地址 |
| `gateway` | string or null | 网关 |
| `nameservers` | list | DNS 服务器 |
| `route_metric` | integer or null | 路由度量值，数值越小优先级越高 |
| `ready` | boolean | 如果配置已生效则为 `true` |
| `addr_gen_mode` | string | 仅限 IPv6：`eui64`、`stable-privacy`、`default-or-eui64` 或 `default` |
| `ip6_privacy` | string | 仅限 IPv6：`disabled`、`enabled-prefer-public`、`enabled` 或 `default` |

### Wi-Fi 配置（Wi-Fi configuration）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `mode` | string | `infrastructure`、`mesh`、`adhoc` 或 `ap` |
| `auth` | string | `open`、`wep`、`wpa-psk` 或 `unsupported` |
| `ssid` | string | 网络名称 |
| `signal` | integer or null | 信号强度（百分比） |

### VLAN 配置（VLAN configuration）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `id` | integer | VLAN ID |
| `parent` | string | VLAN 运行所在的接口 |

## 接入点（Access point）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `mode` | string | `infrastructure`、`mesh` 或 `adhoc` |
| `ssid` | string | 网络名称 |
| `frequency` | integer | 频率（MHz） |
| `signal` | integer | 信号强度（百分比） |
| `mac` | string | 接入点的 MAC 地址 |

## 挂载（Mount）

同一个对象会发送到 `POST /mounts` 并从 `GET /mounts` 返回。有些键只单向传递。

| 键 | 类型 | 方向 | 描述 |
| --- | --- | --- | --- |
| `name` | string | Both | 挂载的名称：字母、数字和下划线 |
| `type` | string | Both | `cifs`、`nfs` 或 `disk` |
| `usage` | string | Both | `backup`、`media` 或 `share` |
| `read_only` | boolean | Both | 以只读方式挂载。备份挂载不允许。默认为 `false` |
| `server` | string | Both | CIFS 和 NFS：服务器的主机名或 IP 地址 |
| `port` | integer | Both | CIFS 和 NFS：端口（非默认端口时） |
| `share` | string | Both | CIFS：共享名称 |
| `version` | string or null | Both | CIFS：`1.0` 或 `2.0`，用于强制使用旧协议版本 |
| `username` | string | Request | CIFS：用户名。与 `password` 一起发送，或两者都省略 |
| `password` | string | Request | CIFS：密码 |
| `path` | string | Both | NFS：服务器上的路径 |
| `uuid` | string | Both | 磁盘：分区的 UUID，来自 [`GET /host/disks`](https://www.hasscn.top/contributors/apps/supervisor-api/host/#get-hostdisks) |
| `device` | string | Request | 磁盘：分区的设备路径。发送 `uuid`、`device` 或两者 |
| `filesystem` | string | Response | 磁盘：分区的文件系统 |
| `state` | string or null | Response | 挂载的状态，例如 `active` 或 `failed` |
| `user_path` | string or null | Response | 应用找到挂载的位置，例如 `/media/nas` |

## 启动槽位（Boot slot）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `state` | string | RAUC 报告的槽位状态，例如 `booted`、`active` 或 `inactive` |
| `status` | string or null | 上次从此槽位启动的结果：`good` 或 `bad` |
| `version` | string or null | 此槽位中的操作系统版本 |

## 磁盘（Disk）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 磁盘名称 |
| `vendor` | string | 厂商 |
| `model` | string | 型号 |
| `serial` | string | 序列号 |
| `size` | integer | 大小（字节） |
| `id` | string | 磁盘的 ID：UDisks2 驱动器 ID，如果没有则为设备路径 |
| `dev_path` | string | 设备路径 |

## 设备（Device）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 设备名称 |
| `sysfs` | string | sysfs 中的路径 |
| `dev_path` | string | `/dev` 中的路径 |
| `subsystem` | string or null | 子系统，例如 `tty`、`input` 或 `sound` |
| `by_id` | string or null | `/dev/serial/by-id` 风格的链接 |
| `attributes` | dictionary | udev 属性 |
| `children` | list | sysfs 中子设备的路径 |

## 驱动器（Drive）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `vendor` | string | 厂商 |
| `model` | string | 型号 |
| `revision` | string | 固件版本 |
| `serial` | string | 序列号 |
| `id` | string | 驱动器的 ID |
| `size` | integer | 大小（字节） |
| `time_detected` | string | 发现驱动器的时间，采用 ISO 8601 格式 |
| `connection_bus` | string | 总线，例如 `usb` |
| `seat` | string | 驱动器所属的 seat |
| `removable` | boolean | 如果用户可以移除驱动器则为 `true` |
| `ejectable` | boolean | 如果系统可以弹出驱动器则为 `true` |
| `filesystems` | list | 驱动器上的[文件系统](https://www.hasscn.top/contributors/apps/supervisor-api/models/#filesystem) |

### 文件系统（Filesystem）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `device` | string | 设备文件，例如 `/dev/sda1` |
| `id` | string | 文件系统的 ID |
| `size` | integer | 大小（字节） |
| `name` | string | 文件系统的标签 |
| `system` | boolean | 如果是系统文件系统则为 `true` |
| `mount_points` | list | 文件系统的挂载位置 |

## 音频（Audio）

[`GET /audio/info`](https://www.hasscn.top/contributors/apps/supervisor-api/plugins/#get-audioinfo) 的 `audio` 对象。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `card` | list | [声卡](https://www.hasscn.top/contributors/apps/supervisor-api/models/#sound-card) |
| `input` | list | 用于输入的[音频设备](https://www.hasscn.top/contributors/apps/supervisor-api/models/#audio-device) |
| `output` | list | 用于输出的[音频设备](https://www.hasscn.top/contributors/apps/supervisor-api/models/#audio-device) |
| `application` | list | [应用流](https://www.hasscn.top/contributors/apps/supervisor-api/models/#application-stream) |

### 声卡（Sound card）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 声卡名称 |
| `index` | integer | 声卡的 PulseAudio 索引 |
| `driver` | string | 声卡的驱动程序 |
| `profiles` | list | 配置文件，每个包含 `name`、`description` 和 `active` |

### 音频设备（Audio device）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 设备名称 |
| `index` | integer | 设备的 PulseAudio 索引 |
| `description` | string | 描述 |
| `volume` | float | 音量（0 到 1） |
| `mute` | boolean | 如果已静音则为 `true` |
| `default` | boolean | 如果这是默认设备则为 `true` |
| `card` | integer or null | 声卡的索引 |
| `applications` | list | 此设备上的[应用流](https://www.hasscn.top/contributors/apps/supervisor-api/models/#application-stream) |

### 应用流（Application stream）

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 应用名称 |
| `index` | integer | 流的 PulseAudio 索引 |
| `stream_index` | string | 流播放所在设备的索引 |
| `stream_type` | string | `input` 或 `output` |
| `volume` | float | 音量（0 到 1） |
| `mute` | boolean | 如果已静音则为 `true` |
| `app` | string | 流所属应用的 slug |
