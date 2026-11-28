# 构建容器镜像

> 编写应用的 Dockerfile。选择基础镜像，添加你的服务和脚本，并设置构建参数和标签。

Source: https://www.hasscn.top/contributors/apps/guides/dockerfile/

每个应用都是一个容器镜像。你可以在应用文件夹中的 `Dockerfile` 里描述它，就像其他任何镜像一样。在开发阶段，Supervisor 会在设备上构建它；而当你发布时，[builder actions](https://www.hasscn.top/contributors/apps/guides/publishing/) 会为每种架构构建它。

## 一个最简的 Dockerfile

```dockerfile
FROM ghcr.io/home-assistant/base:3.24

# Install what your app needs
RUN apk add --no-cache nginx

# Copy your files into the image
COPY rootfs /
```

如果你的服务已在 `rootfs` 中设置好（如下文 [S6 overlay](https://www.hasscn.top/contributors/apps/guides/dockerfile/#s6-overlay) 所述），这就足够了。你也可以保持更简单的方式，用 `CMD` 运行单个脚本，就像[你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)中那样。

## 基础镜像

来自 [home-assistant/docker-base](https://github.com/home-assistant/docker-base) 的 Home Assistant 基础镜像，包含了大多数应用所需的一切。它们以多架构镜像的形式发布，支持 `amd64` 和 `aarch64`。

| 镜像 | 基于 | 标签示例 |
| --- | --- | --- |
| `ghcr.io/home-assistant/base` | Alpine Linux | `3.24` |
| `ghcr.io/home-assistant/base-python` | 带 Python 的 Alpine Linux | `3.14-alpine3.24` |
| `ghcr.io/home-assistant/base-debian` | Debian | `trixie` |
| `ghcr.io/home-assistant/base-ubuntu` | Ubuntu | `26.04` |

该仓库的 README 列出了受支持的标签。优先选择 Alpine：它体积小，这在使用 SD 卡的 Raspberry Pi 上很重要。当你的软件需要 glibc 时，请使用 Debian 或 Ubuntu。

每个基础镜像都包含：

- [S6 overlay](https://github.com/just-containers/s6-overlay) 版本 3，作为 init 系统和服务监督器。
- [Bashio](https://github.com/hassio-addons/bashio)，一个面向应用的 shell 函数库。
- [Tempio](https://github.com/home-assistant/tempio)，用于从模板渲染配置文件。
- `bash`、`curl`、`jq`、`tzdata` 和 CA 证书。
- jemalloc，位于基于 Alpine 的镜像中。要使用它，请为你的应用程序设置 `LD_PRELOAD="/usr/local/lib/libjemalloc.so.2"`。

请固定基础镜像的版本，例如 `base:3.24`，而不是使用 `latest`。这样你的构建就能保持可复现，而且像 Renovate 或 Dependabot 这样的工具可以帮你更新标签。

你不必使用这些镜像。任何镜像都可以，只要它能在你的 `arch` 中列出的架构上运行即可。如果没有 S6 overlay，请保留默认的 `init: true`，让 Docker 添加一个 init 进程，并省略下文中的 Bashio 部分。

## S6 overlay

基础镜像使用 S6 overlay 作为其 init 系统：`/init` 是入口点，它负责启动并监督你的服务。由此带来两点要求：

- 在 `config.yaml` 中设置 `init: false`。S6 overlay 必须是容器中的 1 号进程，如果 Docker 在它前面添加了自己的 init，它就不会启动。
- 不要设置 `host_pid: true`。S6 overlay 无法在宿主机的 PID 命名空间中工作。

你在应用的 `rootfs` 文件夹中描述你的服务。只运行一次的设置步骤是一个 oneshot 服务，你的程序是一个 longrun 服务，而 `finish` 脚本决定崩溃是否会导致容器停止：

```text
rootfs/etc/s6-overlay/
├── s6-rc.d/
│   ├── init-my-app/
│   │   ├── dependencies.d/base
│   │   ├── run
│   │   ├── type
│   │   └── up
│   └── my-app/
│       ├── dependencies.d/init-my-app
│       ├── finish
│       ├── run
│       └── type
└── user-bundles.d/user/contents.d/
    ├── init-my-app
    └── my-app
```

[使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/)解释了每个文件的作用、较旧的 `/etc/services.d` 格式、finish 脚本，以及容易犯的错误。

## Bashio

Bashio 让你免于手动解析 JSON 和调用 Supervisor API。使用 `bashio` 作为脚本的解释器，并在前面加上 `with-contenv`，这样脚本就能获取容器的环境变量。一些你会经常用到的函数：

```bash
#!/command/with-contenv bashio

# Read an option
port=$(bashio::config 'port')

# Check if an optional option is set
if bashio::config.has_value 'username'; then
  bashio::log.info "Username is set"
fi

# Stop with an error if a required option is empty
bashio::config.require 'password'

# Logging, with levels the user can filter on
bashio::log.debug "Only shown with debug logging"
bashio::log.warning "Something looks off"
```

Bashio 还封装了大部分 Supervisor API，例如 `bashio::services 'mqtt' 'host'` 和 `bashio::app.ingress_port`。每个函数都可以在 [Bashio 参考](https://www.hasscn.top/contributors/apps/bashio/)中找到。

## 构建参数

Supervisor 和 builder actions 会传递两个构建参数：

| 参数 | 内容 |
| --- | --- |
| `BUILD_ARCH` | 构建的架构：`aarch64` 或 `amd64` |
| `BUILD_VERSION` | `config.yaml` 中的 `version` |

在使用之前，请用 `ARG` 声明它们：

```dockerfile
ARG BUILD_ARCH
RUN echo "Building for ${BUILD_ARCH}"
```

两者都使用 Docker BuildKit 构建，因此标准的 `TARGETARCH` 参数也可用。注意，Home Assistant 使用 `aarch64`，而它使用的是 `arm64`。

如果你需要为每种架构使用不同的 `Dockerfile`，请将其命名为 `Dockerfile.aarch64` 或 `Dockerfile.amd64`。对于该架构，Supervisor 会使用它而不是 `Dockerfile`。

> [!NOTE]
> 从 Supervisor 2026.04.0 起，默认不再传递 `BUILD_FROM`。如果你的 `Dockerfile` 以 `FROM ${BUILD_FROM}` 开头，请为该参数指定默认值，或将其替换为固定的 `FROM`。

## 标签

Supervisor 会从镜像中读取几个标签：

| 标签 | 内容 |
| --- | --- |
| `io.hass.version` | 应用的版本 |
| `io.hass.arch` | 镜像的架构 |
| `io.hass.type` | `app` |

在大多数情况下，你不必自己设置它们。当 Supervisor 构建应用时，它会添加全部三个标签。builder 的 `build-image` action 会添加 `io.hass.version` 和 `io.hass.arch`。如果你以其他方式构建镜像，请使用 `LABEL` 添加它们：

```dockerfile
LABEL \
  io.hass.version="1.0.0" \
  io.hass.type="app" \
  io.hass.arch="aarch64"
```

对于没有这些标签的现有镜像，请在 `config.yaml` 中设置 `legacy: true`。

## build.yaml

较旧的应用在 `config.yaml` 旁边有一个 `build.yaml`，其中包含每种架构的基础镜像（`build_from`）、额外的构建参数（`args`）和标签（`labels`）。此文件已被弃用。Supervisor 仍会读取它，但会发出警告；请改为将所有内容放在 `Dockerfile` 中：

- `build_from`：一行 `FROM`，或带有默认值的 `ARG BUILD_FROM=...`。
- `args`：带有默认值的 `ARG` 行。
- `labels`：`LABEL` 行。
- `squash`：没有替代方案；BuildKit 不支持它。
