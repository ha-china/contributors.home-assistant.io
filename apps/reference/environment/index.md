# 运行环境

> 应用容器从 Supervisor 获得的内容。环境变量、文件夹、主机名和网络地址。

Source: https://www.hasscn.top/contributors/apps/reference/environment/

当 Supervisor 启动你的应用时，它会为容器设置一些你的代码可以依赖的内容。本页面列出了这些内容。

## 环境变量

| 变量 | 内容 |
| --- | --- |
| `SUPERVISOR_TOKEN` | 你的应用的令牌，用于 Supervisor API 和 Home Assistant Core API 代理。每个应用唯一。 |
| `HASSIO_TOKEN` | 同一个令牌，使用其旧名称。新代码中请使用 `SUPERVISOR_TOKEN`。 |
| `TZ` | 系统的时区，例如 `Europe/Amsterdam`。 |

你在 `config.yaml` 的 `environment` 中定义的变量也会被添加。如果设置了 `legacy: true`，则顶层选项中字符串或数字类型的选项也会作为变量传入。

基础镜像使用 S6 overlay，它将容器的环境保存在一个单独的位置。以 `#!/command/with-contenv bashio`（或 `with-contenv bash`）开头的脚本可以获取这些变量；由 S6 启动的其他脚本可能无法获取。参见[容器环境](https://www.hasscn.top/contributors/apps/guides/s6-overlay/#the-container-environment)。

## 文件夹

| 路径 | 内容 |
| --- | --- |
| `/data` | 你的应用的私有持久化存储。可读写，包含在备份中。 |
| `/data/options.json` | 用户的选项，已根据你的 `schema` 进行校验。在每次启动前写入。 |

你通过 `map` 映射的文件夹会挂载到以下路径，除非你设置了不同的 `path`：

| 类型 | 路径 |
| --- | --- |
| `homeassistant_config` | `/homeassistant` |
| `app_config` | `/config` |
| `all_app_configs` | `/app_configs` |
| `local_apps` | `/local_apps` |
| `ssl` | `/ssl` |
| `share` | `/share` |
| `media` | `/media` |
| `backup` | `/backup` |

映射的文件夹默认为只读，除非你设置了 `read_only: false`。

根据 `config.yaml` 中的其他配置项，Supervisor 还会挂载更多内容：

| 配置项 | 挂载内容 |
| --- | --- |
| `tmpfs: true` | `/tmp` 作为 tmpfs，位于内存中 |
| `host_ipc: false` | 私有的 `/dev/shm`，位于内存中 |
| `audio: true` | `/etc/pulse/client.conf`、`/run/audio` 和 `/etc/asound.conf` |
| `devicetree: true` | `/device-tree` |
| `gpio: true` | `/sys/class/gpio`，在支持的系统上 |
| `udev: true` | `/run/udev`，只读 |
| `kernel_modules: true` | `/lib/modules`，只读 |
| `host_dbus: true` | `/run/dbus`，只读 |
| `journald: true` | `/var/log/journal` 和 `/run/log/journal`，只读 |
| `docker_api: true` | `/run/docker.sock`，只读，仅在关闭保护模式时可用 |

## 网络

除非你设置了 `host_network`，否则你的应用将运行在内部网络 `172.30.32.0/23` 上，与 Supervisor 和其他应用在一起。Home Assistant Core 也可以从该网络访问。

| 名称 | 说明 |
| --- | --- |
| `supervisor` | Supervisor 及其 API。始终为 `172.30.32.2`。`hassio` 是它的别名。 |
| `homeassistant` | Home Assistant Core。它运行在宿主机网络上，可以通过 `172.30.32.1`（内部网络的网关）访问。 |
| `{repository}-{slug}` | 另一个应用，例如 `core-mosquitto` 或 `local-hello-world`。 |

你自己容器的主机名是你的应用 ID，其中 `_` 被替换为 `-`。如果设置了 `host_uts: true`，则改为使用宿主机的主机名。

`supervisor` 和 `hassio` 会被添加到你容器的 hosts 文件中，因此它们在宿主机网络上也能正常工作。运行在宿主机网络上的应用仍会以名称注册到内部 DNS 中，指向网关 `172.30.32.1`，因此其他应用也可以通过名称访问它。

Ingress 请求始终来自 Supervisor，即 `172.30.32.2`。

## Init

Home Assistant 基础镜像使用 S6 overlay 作为其 init 系统，以 `/init` 作为入口点。请在 `config.yaml` 中设置 `init: false`，这样 Docker 就不会在它前面添加自己的 init 进程。参见[使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/)。
