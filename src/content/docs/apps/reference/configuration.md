---
title: 应用（App）配置
description: 应用 config.yaml 中的每个键、其作用，以及 Supervisor 接受的取值。
order: 1
---

每个应用在其文件夹中都有一个配置文件，告诉 Supervisor 这个应用是什么、需要什么。本页面列出 Supervisor 接受的每一个键。它遵循 Supervisor 代码中的模式（schema）（[`supervisor/apps/validate.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/apps/validate.py)）。

该文件名为 `config.yaml`、`config.yml` 或 `config.json`。这里的所有示例都使用 YAML。由于 Supervisor 会在仓库中任意深度搜索这些文件名，请不要在应用中将 `config.yaml` 用于其他用途，除非它位于名为 `rootfs` 的文件夹或隐藏文件夹内。

```yaml
name: "Hello world"
version: "1.1.0"
slug: "hello_world"
description: "My first real app!"
url: "https://github.com/me/my-apps/tree/main/hello_world"
arch:
  - aarch64
  - amd64
init: false
ports:
  8000/tcp: 8000
map:
  - type: share
    read_only: false
  - type: homeassistant_config
    path: /custom/config/path
image: "ghcr.io/me/hello-world"
```

Supervisor 不认识的键会被忽略且不发出警告，因此请检查拼写。

## 必需的键

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | string | 应用的名称，显示在应用商店和 UI 中。 |
| `version` | string | 应用的版本。使用 `image` 时，这也是 Supervisor 拉取的标签（tag）。请加引号，以免 YAML 将 `1.10` 读作数字。 |
| `slug` | string | 应用的 ID。只能包含字母、数字、`-`、`_` 和 `.`。在仓库中必须唯一。 |
| `description` | string | 简短描述，显示在应用商店中。 |
| `arch` | list | 应用支持的 CPU 架构：`aarch64` 和 `amd64`。已弃用的值 `armhf`、`armv7` 和 `i386` 仍被接受，但会发出警告。 |

## 信息与行为

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `url` | URL | | 应用的主页，例如仓库或论坛帖子。显示在应用页面上。 |
| `machine` | list | all | 应用可运行的机器类型。参见 [machine](#machine)。 |
| `homeassistant` | string | | 应用所需的最低 Home Assistant Core 版本，例如 `2026.10.0`。 |
| `startup` | string | `application` | 应用在启动时的启动时机：`initialize`、`system`、`services`、`application` 或 `once`。参见[应用的工作原理](/apps/how-apps-work/#starting)。 |
| `boot` | string | `auto` | `auto` 在启动时启动应用。`manual` 默认关闭**开机启动**。`manual_only` 将其关闭且不允许用户打开。 |
| `stage` | string | `stable` | 应用所处的生命周期阶段：`stable`、`experimental` 或 `deprecated`。 |
| `init` | bool | `true` | 使用 Docker 的默认 init 进程运行容器。当镜像自带 init 时设置为 `false`，所有 Home Assistant 基础镜像都是如此（S6 overlay 版本 3 否则无法启动）。 |
| `timeout` | integer | `10` | Supervisor 在终止容器之前等待应用停止的秒数。取值在 10 到 300 之间。 |
| `breaking_versions` | list | | 需要用户注意的版本。自动更新绝不会安装或跨越这些版本。 |
| `environment` | mapping | | 容器的额外环境变量。 |
| `legacy` | bool | `false` | 用于没有 Home Assistant 标签的镜像：还会将顶层选项（如果它们是字符串或数字）作为环境变量传入。 |
| `stdin` | bool | `false` | 保持容器的标准输入打开，以便 Home Assistant 可以通过 `hassio.app_stdin` 动作发送数据。 |
| `tmpfs` | bool | `false` | 将 `/tmp` 挂载为 tmpfs，即内存中的文件系统。 |

### machine

不使用 `machine` 时，应用在所有机器上都可用。使用它时，应用仅在你列出的机器类型上可用。前面带 `!` 的条目（如 `!raspberrypi5-64`）会明确排除某种机器类型。

接受的值为 `generic-aarch64`、`generic-x86-64`、`green`、`intel-nuc`、`khadas-vim3`、`odroid-c2`、`odroid-c4`、`odroid-m1`、`odroid-n2`、`qemuarm-64`、`qemux86-64`、`raspberrypi3-64`、`raspberrypi4-64`、`raspberrypi5-64` 和 `yellow`。已弃用的值 `odroid-xu`、`qemuarm`、`qemux86`、`raspberrypi`、`raspberrypi2`、`raspberrypi3`、`raspberrypi4` 和 `tinker` 仍被接受，但会发出警告。

## 镜像

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `image` | string | | 要拉取的镜像，不带标签，例如 `ghcr.io/me/my-app`。标签始终为 `version`。不使用 `image` 时，Supervisor 会在设备上构建应用。 |

请使用多架构镜像的名称。对于按架构发布的镜像，占位符 `{arch}` 仍然受支持，例如 `ghcr.io/me/{arch}-my-app`。参见[发布你的应用](/apps/guides/publishing/)。

## 选项

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `options` | mapping | `{}` | 应用的选项及其默认值。 |
| `schema` | mapping 或 `false` | `{}` | 每个选项的类型，用于验证用户的输入并构建 UI 中的表单。`false` 会关闭验证和表单。 |

类型和规则见[添加选项](/apps/guides/options/#schema-types)。

## 网络

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `ports` | mapping | | 要在主机上暴露的端口，格式为 `"container-port/protocol": host-port`，例如 `8080/tcp: 8080`。协议为 `tcp` 或 `udp`。主机端口为 `null`（或无值）表示该端口默认关闭；用户可以打开它。 |
| `ports_description` | mapping | | 每个端口的描述，键与 `ports` 相同。建议使用[翻译](/apps/guides/presentation/#translations)。 |
| `host_network` | bool | `false` | 让应用在主机的网络上运行，而不是内部网络。 |
| `webui` | string | | Web 界面的 URL，用于**打开 Web UI** 按钮。参见 [URL 模板](#url-templates)。 |
| `watchdog` | string | | 看门狗（watchdog）用于检查应用是否健康的 URL。参见 [URL 模板](#url-templates)。 |

### URL 模板

`webui` 和 `watchdog` 使用占位符，由 Supervisor 填充：

- `[HOST]`：主机。对于**打开 Web UI**，这是用户访问 Home Assistant 的地址；看门狗则使用应用的 IP 地址。
- `[PORT:8080]`：对于**打开 Web UI**，是容器端口 8080 映射到的主机端口。看门狗连接到应用的 IP 地址，因此它使用容器端口 8080 本身，除非应用运行在主机网络上。
- `[PROTO:option]`：如果名为 `option` 的选项为 `true`，则为 `https`，否则为 `http`。

```yaml
webui: "[PROTO:ssl]://[HOST]:[PORT:8080]/dashboard"
watchdog: "http://[HOST]:[PORT:8080]/health"
```

`webui` 的格式为 `http`、`https` 或 `[PROTO:option]`，然后是 `://[HOST]:[PORT:number]`，再接可选的路径。`watchdog` 接受相同的格式，还接受 `tcp://[HOST]:[PORT:number]`，仅检查该端口是否接受连接。在 `watchdog` 中，端口也可以是纯数字。HTTP 看门狗将任何低于 300 的响应视为健康。

## Ingress

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `ingress` | bool | `false` | 在 Home Assistant 内显示应用的 Web 界面。参见[通过 ingress 添加 Web 界面](/apps/guides/ingress/)。 |
| `ingress_port` | integer | `8099` | 你的 Web 服务器在容器内监听的端口。`0` 让 Supervisor 在 62000 到 65500 之间选择一个空闲端口，你的应用可从 API 读取。主要用于运行在主机网络上的应用。 |
| `ingress_entry` | string | | ingress URL 起始的路径（如果不是 `/`）。 |
| `ingress_stream` | bool | `false` | 将请求体流式传输给应用，而不是先读入内存。大文件上传时需要。 |
| `panel_icon` | string | `mdi:puzzle` | 应用在侧边栏中的图标，来自 [Material Design Icons](https://pictogrammers.com/library/mdi/)。 |
| `panel_title` | string | 应用名称 | 应用在侧边栏中的标题。 |
| `panel_admin` | bool | `true` | 仅在管理员的侧边栏中显示该应用。 |

使用 `ingress_port: 0` 的应用不得在 `ports` 中暴露 62000 到 65500 之间的任何端口；Supervisor 会拒绝该配置。

## 文件夹

`map` 列出要挂载到容器中的主机文件夹。每个条目都有一个 `type`，以及可选的 `read_only`（默认 `true`）和 `path`（容器中的挂载点）。

```yaml
map:
  - type: share
    read_only: false
  - type: ssl
  - type: media
    path: /mnt/media
```

| 类型 | 挂载位置 | 内容 |
| --- | --- | --- |
| `homeassistant_config` | `/homeassistant` | Home Assistant 的配置文件夹 |
| `app_config` | `/config` | 此应用的公共配置文件夹。参见[面向用户的配置文件](/apps/guides/options/#configuration-files-for-users) |
| `all_app_configs` | `/app_configs` | 所有应用的公共配置文件夹 |
| `local_apps` | `/local_apps` | 本地应用文件夹 |
| `ssl` | `/ssl` | 证书 |
| `share` | `/share` | Home Assistant 与应用之间共享的文件 |
| `media` | `/media` | 媒体文件 |
| `backup` | `/backup` | 备份 |
| `data` | `/data` | 此应用的私有数据。始终以读写方式挂载；仅使用此类型来更改 `path` |

如果设置了 `path`，它不能为空、不能为 `/`，也不能与其他条目的路径相同。

旧名称仍被接受，但会发出警告：`addons` 对应 `local_apps`（挂载在 `/addons`），`all_addon_configs` 对应 `all_app_configs`（挂载在 `/addon_configs`），`addon_config` 对应 `app_config`。旧的 `config` 类型将 Home Assistant 配置挂载在 `/config`；请改用 `homeassistant_config`。旧的简写形式（如 `share:rw`）也仍然有效。

## 硬件

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `devices` | list | | 要映射到容器中的设备路径，例如 `/dev/ttyAMA0`。 |
| `uart` | bool | `false` | 将所有串行设备映射到容器中。 |
| `usb` | bool | `false` | 将原始 USB 设备（`/dev/bus/usb`）映射到容器中，支持热插拔。 |
| `gpio` | bool | `false` | 在支持的系统上将 `/sys/class/gpio` 映射到容器中。 |
| `udev` | bool | `false` | 以只读方式挂载主机的 udev 数据库（`/run/udev`）。 |
| `devicetree` | bool | `false` | 将主机的设备树挂载在 `/device-tree`。 |
| `video` | bool | `false` | 授予对所有视频设备的访问权限。 |
| `audio` | bool | `false` | 通过 PulseAudio 将应用连接到 Home Assistant 的音频系统。 |
| `kernel_modules` | bool | `false` | 以只读方式挂载主机的内核模块（`/lib/modules`），并添加 `SYS_MODULE` 能力。 |
| `full_access` | bool | `false` | 授予对所有硬件的完全访问权限。仅在关闭保护模式时有效。不要与 `devices`、`uart`、`usb` 或 `gpio` 组合使用；这些会被忽略。 |

有关各项的更多信息，请参见[访问硬件和主机](/apps/guides/hardware/)。

## 主机与特权

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `privileged` | list | | 要添加的 Linux 能力（capabilities）。参见 [privileged](#privileged)。 |
| `apparmor` | bool | `true` | 使用 AppArmor 运行应用。如果应用文件夹中有 `apparmor.txt`，Supervisor 会使用该配置文件；否则使用 Docker 的默认配置文件。 |
| `host_dbus` | bool | `false` | 以只读方式挂载主机的 D-Bus 系统总线（`/run/dbus`）。 |
| `host_pid` | bool | `false` | 使用主机的 PID 命名空间。仅在关闭保护模式时有效。不适用于 S6 overlay。 |
| `host_uts` | bool | `false` | 使用主机的 UTS 命名空间（即主机名）。 |
| `host_ipc` | bool | `false` | 为 `false` 时，应用会在内存中获得自己的私有 `/dev/shm`。设置为 `true` 可让 `/dev/shm` 保持容器默认值。 |
| `realtime` | bool | `false` | 允许实时调度：添加 `SYS_NICE`、实时优先级限制，以及在系统支持时的实时 CPU 预算。 |
| `journald` | bool | `false` | 以只读方式将主机的系统日志挂载在 `/var/log/journal` 和 `/run/log/journal`。请检查哪一个有内容，因为这因系统而异。 |
| `ulimits` | mapping | | 容器的资源限制。参见 [ulimits](#ulimits)。 |

### privileged

可以添加的能力有 `AUDIT_WRITE`、`BPF`、`CHECKPOINT_RESTORE`、`DAC_READ_SEARCH`、`IPC_LOCK`、`MKNOD`、`NET_ADMIN`、`NET_RAW`、`PERFMON`、`SETFCAP`、`SYS_ADMIN`、`SYS_MODULE`、`SYS_NICE`、`SYS_PTRACE`、`SYS_RAWIO`、`SYS_RESOURCE` 和 `SYS_TIME`。只请求你的应用所需的能力：其中许多会降低[安全评级](/apps/reference/security-rating/)。

`AUDIT_WRITE`、`MKNOD`、`NET_RAW` 和 `SETFCAP` 如今属于 Docker 的默认集合。Supervisor 正在转向一个不含它们的更小默认集合，由两个默认关闭的功能标志控制：`app_drop_net_raw` 移除 `NET_RAW`，`app_reduced_capabilities` 移除其他三个。如果你的应用需要其中之一，请现在就在 `privileged` 中列出它；你请求的能力绝不会被移除。

### ulimits

每个限制是一个数字，或是一个包含 `soft` 和 `hard` 的映射：

```yaml
ulimits:
  nofile:
    soft: 65535
    hard: 65535
  nproc: 4096
```

值不能高于主机的硬限制。在 Home Assistant OS 上，`nofile` 的硬限制为 524288；在主机上运行 `ulimit -Ha` 可以查看所有限制。

## API 访问

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `homeassistant_api` | bool | `false` | Access to the Home Assistant Core API, through the proxy at `http://supervisor/core/api`. Through the proxy, your app acts as an administrator of Home Assistant. See [Home Assistant Core](/apps/guides/communication/#home-assistant-core). |
| `hassio_api` | bool | `false` | Access to the Supervisor API beyond the basics, limited by `hassio_role`. |
| `hassio_role` | string | `default` | The role of the app in the Supervisor API: `default`, `homeassistant`, `backup`, `manager`, or `admin`. See [API roles](/apps/guides/security/#api-roles). |
| `auth_api` | bool | `false` | Access to the authentication API, to check user names and passwords against Home Assistant. |
| `docker_api` | bool | `false` | Mount the Docker socket, read-only. Only works with protection mode off. |

更多信息请参见[与 Home Assistant 和 Supervisor 通信](/apps/guides/communication/)。

## 服务与发现

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `services` | list | | 应用提供或使用的服务，格式为 `service:role`。服务有 `mqtt` 和 `mysql`，角色有 `provide`、`want` 和 `need`。 |
| `discovery` | list | | 应用可以为其发送发现消息的集成（integration），按域名表示，例如 `adguard`。 |

参见[共享服务与发现集成](/apps/guides/services-discovery/)。

## 备份

| 键 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `backup` | string | `hot` | `hot` 在应用运行时对其进行备份。`cold` 在备份期间停止应用。 |
| `backup_pre` | string | | 在热备份之前在容器中运行的命令。 |
| `backup_post` | string | | 在热备份之后在容器中运行的命令。 |
| `backup_exclude` | list | | 要排除在备份之外的文件的 Glob 模式，例如 `*.log` 或 `cache/*`。 |

使用 `backup: cold` 时，`backup_pre` 和 `backup_post` 会被忽略。

## 已弃用的键

Supervisor 仍会读取一些旧的键并转换或忽略它们，同时发出警告：

- `advanced` 被忽略。
- `codenotary` 被忽略。
- `snapshot`、`snapshot_pre`、`snapshot_post` 和 `snapshot_exclude` 被读取为对应的 `backup` 键。
- `auto_uart` 被读取为 `uart`。
- `startup: before` 和 `startup: after` 被读取为 `services` 和 `application`。
- 旧 `host:container:permissions` 格式的 `devices` 条目会被简化为主机路径。

单独的 `build.yaml`（或 `build.json`）也已被弃用。参见[构建容器镜像](/apps/guides/dockerfile/#buildyaml)。
