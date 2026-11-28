# Supervisor

> Supervisor 的作用、它运行的内容，以及它与应用和 Supervisor API 的关系。

Source: https://www.hasscn.top/contributors/os/supervisor/

[Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/) 让用户能够从 Home Assistant 管理整个系统。它是一个 Python 程序，位于 [home-assistant/supervisor](https://github.com/home-assistant/supervisor) 仓库中，以容器的形式运行在 Home Assistant OS 上。它的职责包括：

- 运行 Home Assistant Core 并对其进行更新。当更新启动失败时，它会进行回滚。
- 安装、运行和更新[应用（app）](https://www.hasscn.top/contributors/glossary/app/)。
- 创建和恢复备份。
- 更新 Home Assistant OS 以及它自身。
- 运行提供 DNS、音频、多播、命令行和状态页面的插件。
- 通过 D-Bus 和 OS Agent 管理主机：网络、主机名、磁盘和时间。
- 检查系统问题并提供修复方案。

## Supervisor 运行的内容

Supervisor 运行的一切都是 Docker 容器。它们大多位于一个名为 `hassio` 的私有桥接网络 `172.30.32.0/23` 上。Core 和多播插件使用主机网络，请求使用主机网络的应用也是如此：

| 容器 | 是什么 | 地址 |
| --- | --- | --- |
| `hassio_supervisor` | Supervisor | `172.30.32.2` |
| `homeassistant` | Home Assistant Core | 主机网络 |
| `hassio_dns` | [DNS 插件](https://www.hasscn.top/contributors/os/supervisor/plugins/#dns) | `172.30.32.3` |
| `hassio_audio` | [音频插件](https://www.hasscn.top/contributors/os/supervisor/plugins/#audio) | `172.30.32.4` |
| `hassio_cli` | [CLI 插件](https://www.hasscn.top/contributors/os/supervisor/plugins/#cli) | `172.30.32.5` |
| `hassio_observer` | [Observer 插件](https://www.hasscn.top/contributors/os/supervisor/plugins/#observer) | `172.30.32.6` |
| `hassio_multicast` | [多播插件](https://www.hasscn.top/contributors/os/supervisor/plugins/#multicast) | 主机网络 |
| `app_<slug>` | 一个应用 | 来自 `172.30.33.0/24`，或主机网络 |

Supervisor 容器本身由主机上的 `haos-supervisor.service` 启动，参见 [Home Assistant OS](https://www.hasscn.top/contributors/os/operating-system/#how-it-boots)。其余一切都由 Supervisor 启动。

## 应用与 Supervisor API

Supervisor 在 `hassio` 网络上的 `http://supervisor` 提供一个 REST API。Home Assistant Core 通过 `hassio` 集成（integration）使用它，`ha` 命令行通过 CLI 插件使用它，应用则在其配置中请求访问权限时使用它。每个调用者都会获得自己的令牌，以及一个限制其可执行操作的角色。

大多数人是通过应用接触 Supervisor 的。Supervisor 从应用仓库安装应用，构建或拉取它们的镜像，并按照其配置所要求的选项、端口和访问权限来运行它们。构建应用以及完整的 Supervisor API 参考文档在[应用（Apps）](https://www.hasscn.top/contributors/apps/)区域中。

## 后续步骤

- [搭建开发环境](https://www.hasscn.top/contributors/os/supervisor/development/)，在你自己的机器上运行 Supervisor。
- [架构](https://www.hasscn.top/contributors/os/supervisor/architecture/)介绍了代码的组织方式。
- [任务（Jobs）](https://www.hasscn.top/contributors/os/supervisor/jobs/)和[问题解决中心](https://www.hasscn.top/contributors/os/supervisor/resolution-center/)是大多数变更会涉及的两个机制。

## All pages in this section

### How it works

- [任务](https://www.hasscn.top/contributors/os/supervisor/jobs/): Supervisor 如何以任务（job）的形式运行工作，包括条件、并发限制、节流，以及客户端可以跟踪的进度。
- [解决中心](https://www.hasscn.top/contributors/os/supervisor/resolution-center/): Supervisor 如何通过检查和评估发现问题、将其跟踪为议题，并通过建议进行修复。
- [插件](https://www.hasscn.top/contributors/os/supervisor/plugins/): Supervisor 在 Home Assistant Core 旁边运行的五个插件、每个插件的作用，以及它们的代码所在位置。

### Guides

- [调试 Supervisor](https://www.hasscn.top/contributors/os/supervisor/debugging/): 将 Python 调试器附加到本地或远程设备上正在运行的 Supervisor，并查找其日志。
- [将 Core 连接到 Supervisor](https://www.hasscn.top/contributors/os/supervisor/core-connection/): 在你的开发环境中运行 Home Assistant Core，连接真实的 Supervisor，以便开发 hassio 集成。

### 工作原理

- [Supervisor 架构](https://www.hasscn.top/contributors/os/supervisor/architecture/): Supervisor 代码是如何组织的、它如何启动，以及更新和备份在其中的工作方式。

### 指南

- [搭建开发环境](https://www.hasscn.top/contributors/os/supervisor/development/): 在开发容器中从源码运行 Supervisor，运行测试和代码检查工具，并在真实系统上试用你的构建版本。
