# 构建一个真实的应用

> 完整地走一遍一个应用，看看有经验的应用开发者是如何搭建的。使用 S6 overlay 的服务、使用 Bashio 的选项、翻译、文档、CI 和发布。

Source: https://www.hasscn.top/contributors/apps/build-a-real-app/

[你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)展示了一个应用最少需要什么。一个真实的应用需要更多：按正确顺序启动、崩溃时停止容器的服务，带校验的选项，带级别的日志，文档，lint 检查，适用于每种架构的镜像，以及发布。

学习这些最好的方式是阅读一个真实的应用。[hassio-addons/app-example](https://github.com/hassio-addons/app-example) 是 Home Assistant Community Apps 的示例应用，该项目维护着一组社区应用，也是 [Bashio](https://www.hasscn.top/contributors/apps/bashio/) 的所在项目。它每隔几秒在日志中显示一条随机引言。这本身没什么用，但它周围的一切都按照一个被维护的应用应有的方式搭建。本教程将逐个文件地讲解它。

在阅读本页的同时打开该仓库。你不需要构建任何东西就能跟着学习，但你可以安装这个示例来查看它运行，并把它复制作为你自己应用的起点。

## 先试一试

这个示例应用发布在 [Home Assistant Community Apps 仓库](https://github.com/hassio-addons/repository)中。要安装它：

1. 添加仓库：在**设置** > **应用**下，打开**应用商店**，在右上角菜单中选择**仓库**。添加 `https://github.com/hassio-addons/repository`。
2. 在商店中找到 **Example**，选择**安装**。
3. 选择**启动**，然后打开**日志**选项卡。

你会看到一个横幅，显示应用和系统的名称与版本，然后每五秒一条引言，每十秒来自第二个服务的一行日志。在**配置**选项卡上更改**Seconds between quotes**，重启应用，并观察日志。

## 1. 仓库

Home Assistant Community Apps 为每个应用提供独立的 Git 仓库。另一个单独的仓库（就是你刚添加的那个）向用户列出已发布的应用。应用仓库如下所示，省略了一些面向 GitHub 的文件，如 issue 模板和行为准则：

```text
app-example/
├── .github/
│   ├── workflows/
│   │   ├── ci.yaml
│   │   ├── deploy.yaml
│   │   ├── labels.yaml
│   │   ├── pr-labels.yaml
│   │   └── release-drafter.yaml
│   └── renovate.json
├── example/
│   ├── rootfs/
│   ├── translations/
│   │   └── en.yaml
│   ├── .README.j2
│   ├── build.yaml
│   ├── config.yaml
│   ├── Dockerfile
│   ├── DOCS.md
│   ├── icon.png
│   └── logo.png
├── .yamllint
├── LICENSE.md
└── README.md
```

应用本身是 `example` 文件夹。它之外的一切都是为开发这个应用的人准备的：工作流、linter 设置和许可证。

你不必像这样拆分你的应用。你也可以把所有应用放在一个仓库中，在顶层放一个 `repository.yaml`，这样用户直接添加那个仓库即可。[home-assistant/apps-example](https://github.com/home-assistant/apps-example) 就是那样搭建的。[创建并分享仓库](https://www.hasscn.top/contributors/apps/guides/repository/)解释了那种设置。`example` 文件夹在两种方式中的工作方式相同。

## 2. 配置

[`example/config.yaml`](https://github.com/hassio-addons/app-example/blob/main/example/config.yaml) 告诉 Supervisor 这个应用是什么，以及用户可以设置什么：

```yaml
---
name: Example
version: dev
slug: example
description: Example app by Home Assistant Community Apps
url: https://github.com/hassio-addons/app-example
init: false
arch:
  - aarch64
  - amd64
options:
  log_level: info
  seconds_between_quotes: 5
schema:
  log_level: list(trace|debug|info|notice|warning|error|fatal)
  seconds_between_quotes: int(1,120)
```

需要注意的几点：

- `version: dev` 是一个占位符。当发布一个版本时，Home Assistant Community Apps 的工具链会把真实的版本号和要拉取的 `image` 写入用户添加的应用仓库中该文件的副本。在你自己的仓库中，在这里填入真实的版本号，并在你发布镜像后添加 `image`。参见[发布你的应用](https://www.hasscn.top/contributors/apps/guides/publishing/)。
- 使用基础镜像时 `init: false` 是必需的，因为 S6 overlay 必须是容器中的第一个进程。[使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/#what-the-base-images-set-up)解释了原因。
- schema 会替你做校验。`int(1,120)` 意味着 Supervisor 会拒绝 1 到 120 之外的任何值，所以脚本永远不需要检查。`list(...)` 会显示一个下拉框。
- `log_level` 是一个常见的约定：当出现问题时，用户可以自己开启调试日志，而不需要你的应用发布新版本。

每个键都在[应用配置](https://www.hasscn.top/contributors/apps/reference/configuration/)参考中。选项及其类型在[添加选项](https://www.hasscn.top/contributors/apps/guides/options/)中。

## 3. Dockerfile

`example/Dockerfile`，已缩短：

```dockerfile
ARG BUILD_FROM=ghcr.io/hassio-addons/base:21.0.8
# hadolint ignore=DL3006
FROM ${BUILD_FROM}

# Copy root filesystem
COPY rootfs /

# Setup base
RUN apk add --no-cache \
    coreutils=9.11-r0 \
    wget=1.25.0-r3

# Build arguments
ARG BUILD_ARCH
ARG BUILD_VERSION

# Labels
LABEL \
    io.hass.arch="${BUILD_ARCH}" \
    io.hass.version=${BUILD_VERSION}
```

完整的文件还添加了更多构建参数和标签：名称、描述、构建日期、Git commit，以及像 `org.opencontainers.image.source` 这样的 Open Container Initiative 标签。构建工作流会填充这些内容；Supervisor 只传递 `BUILD_ARCH`、`BUILD_VERSION`，以及（如果有 `build.yaml` 的话）`BUILD_FROM` 和你在该文件中 `args:` 下列出的任何构建参数。它还会设置 `io.hass.type="app"`。该标签的旧值是 `addon`。参见[标签](https://www.hasscn.top/contributors/apps/guides/dockerfile/#labels)。

从中可以学到：

- **基础镜像。** 这个示例从 Home Assistant Community Apps 的基础镜像开始。与 [Home Assistant 基础镜像](https://www.hasscn.top/contributors/apps/guides/dockerfile/#base-images)一样，它是带有 S6 overlay、Bashio 和 Tempio 的 Alpine Linux。它会在日志中添加一个启动横幅，并根据 `log_level` 选项设置 Bashio 的日志级别。两者你都可以使用。
- **`build.yaml`。** 这个示例还有一个 `build.yaml`，包含每种架构的基础镜像。它的构建工作流会从该文件读取 `build_from`。Supervisor 仍会读取它，但会记录它已被弃用。在你自己的应用中，把基础镜像放在 `Dockerfile` 中，并为 `BUILD_FROM` 提供默认值，就像这里的第一行那样，并省略 `build.yaml`。参见 [build.yaml](https://www.hasscn.top/contributors/apps/guides/dockerfile/#buildyaml)。
- **固定版本。** 基础镜像和每个 Alpine 软件包都有确切的版本。构建是可重复的，并且当有新版本发布时，[Renovate](https://docs.renovatebot.com/) 会打开一个拉取请求。示例的 [`.github/renovate.json`](https://github.com/hassio-addons/app-example/blob/main/.github/renovate.json) 包含在 `Dockerfile` 中查找这些版本的规则。
- **`COPY rootfs /`。** 应用的所有文件都放在 `rootfs` 中，位于它们在镜像中的位置。没有 `CMD`，也没有 `ENTRYPOINT`：S6 overlay 启动 `rootfs` 中的内容。
- **hadolint。** 注释 `# hadolint ignore=DL3006` 静默了在 CI 中运行的 Dockerfile linter 的一条规则，因为基础镜像标签来自一个参数。

## 4. 使用 S6 overlay 的服务

[`example/rootfs/etc/s6-overlay/`](https://github.com/hassio-addons/app-example/tree/main/example/rootfs/etc/s6-overlay) 有三个服务：

| 服务 | 类型 | 依赖于 | 作用 |
| --- | --- | --- | --- |
| `init-example` | oneshot | `base` | 在启动时运行一次并记录一条问候语。在真实的应用中，这里是你写配置文件的地方。 |
| `example1` | longrun | `init-example` | 运行 `/usr/bin/example1.sh`，即引言循环。 |
| `example2` | longrun | `example1` | 运行 `/usr/bin/example2.sh`，第二个循环。 |

longrun 的 `run` 脚本记录一行日志，然后用 `exec` 把控制权交给程序：

```bash
#!/command/with-contenv bashio
# shellcheck shell=bash

bashio::log.info "Starting Example1..."

exec /usr/bin/example1.sh
```

每个 longrun 都有一个 `finish` 脚本，当程序崩溃时停止整个容器，这样 Supervisor 就能看到故障。这三个服务都在 `user` bundle 中，通过 `user-bundles.d/user/contents.d/` 中的空文件实现。

文件夹、`type`、`up` 和 `finish` 文件以及依赖关系如何工作，请参见[使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/)。请结合示例阅读该指南；它使用的正是这种布局。

## 5. 使用 Bashio 读取选项

`rootfs/usr/bin/example1.sh` 中的引言循环在启动时读取一次它的选项：

```bash
#!/command/with-contenv bashio
# shellcheck shell=bash

main() {
    local sleep

    bashio::log.trace "${FUNCNAME[0]}"

    sleep=$(bashio::config 'seconds_between_quotes')
    bashio::log.info "Seconds between each quotes is set to: ${sleep}"

    while true; do
        display_quote
        sleep "${sleep}"
    done
}
main "$@"
```

`bashio::config` 从 Supervisor API 获取选项，这就是脚本以 `with-contenv` 开头的原因：它为脚本提供了所需的令牌。选项只有在用户保存并重启应用后才会改变，所以读取一次就足够了。

其他用于选项的函数：

```bash
# Is an optional option set?
if bashio::config.has_value 'username'; then
  bashio::log.info "Logging in as $(bashio::config 'username')"
fi

# Stop with a clear message when a required option is empty
bashio::config.require 'password'

# A boolean option
if bashio::config.true 'ssl'; then
  bashio::config.require.ssl
fi
```

所有这些都在 [Bashio 选项参考](https://www.hasscn.top/contributors/apps/bashio/config/)中。

## 6. 带级别的日志

这个示例以不同的级别记录日志。`bashio::log.info` 用于正常事件，`bashio::log.notice` 用于回退到离线引言时，`bashio::log.trace` 用于每个函数的开头，以便在有人需要查看所有内容时使用。

用户通过 `log_level` 选项选择级别。社区基础镜像会在你的服务启动之前应用它，所以除非用户要求，否则 `bashio::log.debug` 和 `bashio::log.trace` 会保持安静。在 Home Assistant 基础镜像上，你需要在第一个服务的开头自己设置：

```bash
if bashio::config.has_value 'log_level'; then
  bashio::log.level "$(bashio::config 'log_level')"
fi
```

示例还展示了另一件事。当命令失败时，Bashio 会停止脚本。示例使用 `grep` 获取引言，而 `grep` 在找不到内容时会失败。所以示例添加了 `|| true`，并附上说明原因的注释：

```bash
# The page might not contain a quote at all, in which case grep exits
# non-zero. Bashio runs with errexit (and inherit_errexit), so swallow
# that here and let the caller deal with an empty quote instead.
quote=$(grep -e "<dt>" -e "</dd>" <<< "${html}" | ...) || true
```

日志记录、日志级别和错误处理都在 [Bashio 日志参考](https://www.hasscn.top/contributors/apps/bashio/logging/)中。

## 7. 翻译和文档

除了日志之外，用户看到的应用内容：

- `translations/en.yaml` 在**配置**选项卡上为选项提供可读的名称和描述。没有它，用户会看到 `seconds_between_quotes`。
- `DOCS.md` 是**文档**选项卡：如何安装应用、每个选项，以及在哪里获取帮助。
- `icon.png` 和 `logo.png` 显示在应用商店和应用页面上。
- `.README.j2` 是用户添加的仓库中该应用 `README.md` 的模板。Home Assistant Community Apps 的发布工具链会渲染它，包含版本号，对于 beta 和 edge 频道还会包含一条警告。如果你把应用放在一个仓库中，就写一个普通的 `README.md`。

示例的翻译文件：

```yaml
---
configuration:
  log_level:
    name: Log level
    description: The amount of logging the app should do.
  seconds_between_quotes:
    name: Seconds between quotes
    description: >-
      The number of seconds the app waits until showing a new quote in the
      app log.
```

[展示你的应用](https://www.hasscn.top/contributors/apps/guides/presentation/)涵盖了这些文件中的每一个。

## 8. 持续集成

每个拉取请求都会运行 [`.github/workflows/ci.yaml`](https://github.com/hassio-addons/app-example/blob/main/.github/workflows/ci.yaml)。它调用来自 [hassio-addons/workflows](https://github.com/hassio-addons/workflows) 的共享工作流，并固定到某个 commit。该工作流：

1. 从 `config.yaml` 和 `build.yaml` 读取应用信息：slug、架构和基础镜像。
2. 运行 linter，每个作为独立的任务：
   - 应用 linter，[frenck/action-app-linter](https://github.com/frenck/action-app-linter)，它校验 `config.yaml` 并警告你可以省略的默认值。
   - [Hadolint](https://github.com/hadolint/hadolint) 用于 `Dockerfile`。
   - [ShellCheck](https://www.shellcheck.net/) 用于脚本，包括 S6 服务的 `run` 和 `finish` 文件。
   - yamllint，使用 `.yamllint` 中的规则，以及用于每个 JSON 文件的 `jq`。
   - Prettier，用于 JSON、JavaScript、Markdown 和 YAML。
   - [zizmor](https://github.com/zizmorcore/zizmor)，用于检查工作流本身的安全问题。
3. 审查拉取请求更改的依赖项。
4. 为每种架构构建镜像，每种架构在对应架构的 runner 上构建，但不推送。

每个脚本中的 `# shellcheck shell=bash` 行是为 ShellCheck 准备的：它不认识 `bashio` 解释器，这一行告诉它把脚本当作 Bash 来检查。

其他工作流保持仓库整洁：`labels.yaml` 将仓库的标签与共享列表同步，`pr-labels.yaml` 检查每个拉取请求是否带有描述变更类型的标签之一，如 `bugfix` 或 `new-feature`，`release-drafter.yaml` 保持下一版发布说明草稿的最新状态。

> [!NOTE]
> hassio-addons/workflows 的 README 说明这些工作流可能会变更且没有版本化，在其他项目中使用它们是可能的但不被推荐。对于你自己的仓库，复制你想要的 lint 任务，并使用 Home Assistant 的[构建器 actions](https://www.hasscn.top/contributors/apps/guides/publishing/#build-with-github-actions) 进行构建和发布。

## 9. 发布和版本

[`.github/workflows/deploy.yaml`](https://github.com/hassio-addons/app-example/blob/main/.github/workflows/deploy.yaml) 在每次推送到 `main` 时运行，也在 GitHub 上发布 release 时运行。它先运行与 CI 相同的检查，然后为每种架构构建镜像，推送到 GitHub Container Registry，并将这些镜像合并为一个多架构镜像，如 `ghcr.io/hassio-addons/example`。

它变成哪个版本和频道取决于是什么触发了它：

| 触发方式 | 版本 | 频道 |
| --- | --- | --- |
| 推送到 `main` | 短 Git commit，如 `6b6b1f1` | edge |
| GitHub 上的预发布 | 标签，小写且不带前导 `v` | beta |
| GitHub 上的正式发布 | 标签，小写且不带前导 `v` | stable |

稳定版发布也会进入 beta 频道。构建之后，工作流会把新版本告知 Home Assistant Community Apps 对应的应用仓库。其工具链随后复制应用文件，把 `version` 和 `image` 写入 `config.yaml`，渲染 README，并提交这些更改。该频道的用户就会收到更新。

所以一次发布就是一个 GitHub release。Release Drafter 保存说明草稿，用类似 `v1.2.0` 的标签发布它会启动构建。版本遵循[语义化版本](https://semver.org/)，正如示例的 `DOCS.md` 向用户解释的：主版本用于破坏性变更，次版本用于新功能，修订版本用于修复。

那个发布流程是 Home Assistant Community Apps 特有的。它背后的规则适用于每个应用，在[发布你的应用](https://www.hasscn.top/contributors/apps/guides/publishing/#versions)中：在用户能看到新版本之前先发布镜像，并且永远不要重复使用一个版本。

## 让它成为你自己的

要从这个示例开始你自己的应用：

1. 把 `example` 文件夹复制到你的仓库中，并以你的应用命名。
2. 在 `config.yaml` 中，修改 `name`、`slug`、`description`、`url` 和选项。把 `version` 设置为真实的版本。
3. 在 `Dockerfile` 中，选择你的基础镜像：保留社区基础镜像，或使用 [Home Assistant 基础镜像](https://www.hasscn.top/contributors/apps/guides/dockerfile/#base-images)。把它放在 `ARG BUILD_FROM` 中，并删除 `build.yaml`。
4. 在 `Dockerfile` 中安装你的软件，并把 `rootfs/etc/s6-overlay/` 中的服务替换为你自己的。保留 `finish` 脚本。
5. 更新 `translations/en.yaml`、`DOCS.md`、图标和 logo。
6. 添加工作流：从示例中选取你想要的 lint 任务，以及用于构建和发布镜像的[构建器 actions](https://www.hasscn.top/contributors/apps/guides/publishing/)。
7. 测试它：把文件夹复制到你 Home Assistant 的 `local_apps` 中，或使用[测试你的应用](https://www.hasscn.top/contributors/apps/guides/testing/)中的 devcontainer。

## 接下来是什么

- [应用如何工作](https://www.hasscn.top/contributors/apps/how-apps-work/)：Supervisor 对你的应用做了什么，从仓库到运行中的容器。接下来读它。
- [使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/)：关于 `rootfs` 中服务的一切。
- [Bashio 参考](https://www.hasscn.top/contributors/apps/bashio/)：每个函数，从选项到 Supervisor API。
- [保护你的应用](https://www.hasscn.top/contributors/apps/guides/security/)：添加 AppArmor 配置文件，并尽可能请求最少的访问权限。
- [使用 ingress 添加网页界面](https://www.hasscn.top/contributors/apps/guides/ingress/)：在 Home Assistant 中展示你的应用。
