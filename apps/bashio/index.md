# Bashio

> 应用基础镜像中的 shell 函数库。如何加载它、它会改变脚本中的什么，以及它拥有的每一个函数。

Source: https://www.hasscn.top/contributors/apps/bashio/

Bashio 是一个面向应用的 Bash 函数库。它读取应用的选项，按级别写入日志消息，并用 500 多个函数封装了 [Supervisor API](https://www.hasscn.top/contributors/apps/supervisor-api/)，因此你的脚本无需自己处理 `curl`、令牌和 `jq`。它由 [Home Assistant Community Apps](https://github.com/hassio-addons/bashio) 开发，并随每个 Home Assistant 基础镜像一起提供。

下面各页中的函数列表是根据其源码中的 docblock 生成的。

## 哪些镜像包含它

两个 Home Assistant 基础镜像都附带 Bashio 和 S6 overlay：

- [`ghcr.io/home-assistant/base`](https://github.com/home-assistant/docker-base)，及其 Python、Debian 和 Ubuntu 变体
- [`ghcr.io/hassio-addons/base`](https://github.com/hassio-addons/app-base)，Home Assistant Community Apps 的基础镜像

镜像包含哪些版本，可以在其仓库的 Dockerfile 中查看。在镜像中，该库位于 `/usr/lib/bashio`，而 `/usr/bin/bashio` 会加载它。

基于其他镜像构建？请从这些 Dockerfile 之一复制步骤：它们下载一个 Bashio 发行版，将其 `lib` 文件夹移动到 `/usr/lib/bashio`，并将 `/usr/lib/bashio/bashio` 链接到 `/usr/bin/bashio`。

## 加载 Bashio

使用 `bashio`（而不是 `bash`）作为脚本的解释器：

```bash
#!/command/with-contenv bashio

name=$(bashio::config 'name')
bashio::log.info "Hello ${name}!"
```

`bashio` 命令会加载该库，然后用它运行你的脚本。`with-contenv` 来自 [S6 overlay](https://www.hasscn.top/contributors/apps/guides/s6-overlay/#the-container-environment)：它为脚本提供容器的环境。Bashio 需要它，因为它从中读取 `SUPERVISOR_TOKEN` 来调用 Supervisor API，甚至 `bashio::config` 也是从该 API 获取你的选项。如果没有 `with-contenv`，由 S6 启动的脚本就没有令牌，这些调用会失败。

`#!/usr/bin/with-contenv bashio` 也可以，在上述所有镜像中均可使用：它们安装了 S6 overlay 为旧脚本提供的来自 `/usr/bin` 的链接。对于不需要容器环境的脚本，`#!/usr/bin/env bashio` 就足够了。

## Bashio 会改变脚本中的什么

Bashio 在运行你的脚本之前会开启严格的错误处理：

- `errexit`：当命令失败时，脚本停止。
- `nounset`：当使用未设置的变量时，脚本停止。
- `pipefail`：当管道中的任何命令失败时，管道就失败，而不仅仅是最后一个命令。
- `errtrace` 和 `inherit_errexit`：同样的规则也适用于函数内部和 `$(...)` 内部。

这能及早发现错误，但也意味着预期的失败需要处理。一个没有找到任何内容的 `grep` 会返回 `1` 并使你的脚本停止。可以添加 `|| true`，在 `if` 中测试该命令，或者使用 [`bashio::try`](https://www.hasscn.top/contributors/apps/bashio/logging/#try)。

## 函数如何返回结果

Bashio 函数以两种方式之一返回结果：

- 检查类函数，如 `bashio::config.true` 或 `bashio::fs.file_exists`，不打印任何内容。它们对“是”返回退出状态 `0`，对“否”返回 `1`，因此你可以在 `if` 中使用它们。
- 获取类函数，如 `bashio::config` 或 `bashio::app.version`，会打印该值。用 `$(...)` 捕获它。

日志消息不会与你捕获的值混在一起。Bashio 在加载时会保存一份标准输出的副本，并将日志消息写入那里。更多信息请参阅[日志记录](https://www.hasscn.top/contributors/apps/bashio/logging/)。

大多数调用 Supervisor API 的函数会将答案缓存在 `/tmp/.bashio` 中的一个文件里。容器中的每个脚本都共享该缓存。通过 API 更改设置的函数，例如带有新值的 `bashio::app.options`，之后会清空整个缓存，这样你就不会读回旧值。

## 环境变量

Bashio 在加载时读取这些变量：

| 变量 | 默认值 | 作用 |
| --- | --- | --- |
| `SUPERVISOR_TOKEN` | 空 | Supervisor API 的令牌。Supervisor 会为每个应用设置它。 |
| `SUPERVISOR_API` | `http://supervisor` | Supervisor API 的地址。 |
| `LOG_LEVEL` | `5`（info） | 日志级别，从 `0`（关闭）到 `8`（全部）的数字。 |
| `LOG_FORMAT` | `[{TIMESTAMP}] {LEVEL}: {MESSAGE}` | 日志消息的格式。 |
| `LOG_TIMESTAMP` | `%T` | `{TIMESTAMP}` 的格式，与 `date` 命令的格式相同。 |
| `CACHE_DIR` | `/tmp/.bashio` | 缓存所在的位置。 |
| `HIBP_ENDPOINT` | `https://api.pwnedpasswords.com/range` | 用于密码检查的 Have I Been Pwned API。 |

## 已弃用的名称

应用过去被称为 add-on（插件），Bashio 函数也是如此。每个 `bashio::app.*`、`bashio::apps` 和 `bashio::apps.*` 函数仍然有一个使用旧名称的别名：`bashio::addon.*`、`bashio::addons` 和 `bashio::addons.*`。别名会调用新函数，并在你第一次使用时记录一条警告。这些别名可能会在未来的版本中被移除，因此请在新代码中使用新名称。

还有几个其他旧名称的工作方式相同：`hass.die_if_true` 和 `hass.die_if_empty` 会调用 `bashio::exit.die_if_true` 和 `bashio::exit.die_if_empty`，而 `bashio::pwned.occurances` 会调用 `bashio::pwned.occurrences`。这些函数中的每一个在每次调用时都会记录一条警告。

## 函数

函数按其操作对象分组。每一页都列出了其模块的每个公开函数，包括其参数和来自源码的描述。

- [选项](https://www.hasscn.top/contributors/apps/bashio/config/)：读取和检查应用的选项。
- [日志记录、退出和错误](https://www.hasscn.top/contributors/apps/bashio/logging/)：日志级别、彩色输出、停止脚本，以及 `bashio::try`。
- [应用](https://www.hasscn.top/contributors/apps/bashio/apps/)：你自己的应用和其他应用：设置、状态、端口、ingress 和资源使用情况。
- [Supervisor 和系统](https://www.hasscn.top/contributors/apps/bashio/supervisor/)：原始 API 调用、Supervisor、系统信息、更新、任务、备份、仓库、挂载、Docker 和安全设置。
- [Core、主机和操作系统](https://www.hasscn.top/contributors/apps/bashio/core-host-os/)：Home Assistant Core、主机、Home Assistant OS、硬件和网络。
- [插件](https://www.hasscn.top/contributors/apps/bashio/plugins/)：音频、CLI、DNS、多播和观察者。
- [服务、发现、认证和 ingress](https://www.hasscn.top/contributors/apps/bashio/services/)：MQTT 和其他服务、发现消息、用户凭据，以及 ingress 会话。
- [变量、字符串、文件和 JSON](https://www.hasscn.top/contributors/apps/bashio/helpers/)：用于值、字符串、文件、jq、缓存、端口和 Have I Been Pwned 的辅助函数。

## 帮助和变更

缺少某个函数，或者发现了 bug？Bashio 有自己的仓库：[hassio-addons/bashio](https://github.com/hassio-addons/bashio)。其 README 指出，Supervisor API 的某些部分还没有对应的函数。对于这些情况，可以直接调用 [`bashio::api.supervisor`](https://www.hasscn.top/contributors/apps/bashio/supervisor/#api)。
