# Supervisor（管理程序）

> 在 Home Assistant OS 上运行 Home Assistant Core、应用、备份和更新的程序，各自运行在独立的容器中。

Source: https://www.hasscn.top/contributors/architecture/platform/supervisor/

在 Home Assistant OS 上，Home Assistant Core 并不是独立运行的。是 Supervisor（管理程序）在运行它。Supervisor 启动 Core、更新它、备份它并恢复它。它还运行[应用（apps）](https://www.hasscn.top/contributors/apps/how-apps-work/)，以及一些自己的辅助程序。

Core、每个应用、每个辅助程序以及 Supervisor 本身都以 Docker 容器的形式运行。

## 简而言之

- Supervisor 是一个 Python 程序，位于 [home-assistant/supervisor](https://github.com/home-assistant/supervisor) 仓库中。
- 它以容器的形式运行 Core、应用和插件。它们的网络连接方式见 [Supervisor 运行的内容](https://www.hasscn.top/contributors/os/supervisor/#what-the-supervisor-runs)。
- 它有一个 REST API，地址为 `http://supervisor`。Core、应用和命令行都使用它。
- 它负责创建备份、安装更新，并检查系统是否存在问题。

## Home Assistant OS 上运行着什么

除了 Core 和应用之外，Supervisor 还运行一些自己的插件：用于 DNS、音频、`ha` 命令行、多播发现，以及一个在其他一切都宕机时仍能正常工作的状态页面。[Supervisor 运行的内容](https://www.hasscn.top/contributors/os/supervisor/#what-the-supervisor-runs)列出了每个容器的名称和网络。

## 它做什么

- **Supervisor API**：Core、应用和 `ha` 命令行通过位于 `http://supervisor` 的 REST API 与 Supervisor 通信。调用者可以执行什么操作取决于其角色。参见 [Supervisor API](https://www.hasscn.top/contributors/apps/supervisor-api/)，以及 Core 如何使用它见[与 Core 的连接](https://www.hasscn.top/contributors/os/supervisor/core-connection/)。
- **Ingress（入口）**：在 Home Assistant 内部、其登录验证之后显示应用的 Web 界面，而无需开放端口。参见 [ingress](https://www.hasscn.top/contributors/apps/guides/ingress/)。
- **备份和更新**：Supervisor 备份 Core、应用和文件夹，并从 `version.home-assistant.io` 安装新版本。参见 [Supervisor 的工作方式](https://www.hasscn.top/contributors/os/supervisor/architecture/)。
- **保持系统健康**：它持续检查系统，发现的问题会显示为修复事项。参见[问题解决中心](https://www.hasscn.top/contributors/os/supervisor/resolution-center/)。

## 深入了解

- [Supervisor 的工作方式](https://www.hasscn.top/contributors/os/supervisor/architecture/)：它如何启动、任务机制以及代码结构
- [插件](https://www.hasscn.top/contributors/os/supervisor/plugins/)：DNS、音频、CLI、多播和 observer 容器
- [开发 Supervisor](https://www.hasscn.top/contributors/os/supervisor/development/)：运行和测试你的更改
- [应用的工作方式](https://www.hasscn.top/contributors/apps/how-apps-work/)：从应用的角度看 Supervisor

## 参与其中

- 从[你对 Supervisor 的第一次贡献](https://www.hasscn.top/contributors/os/first-contribution/)开始。它会在你自己的机器上运行一个完整的系统。
- 想构建应用？前往应用区域的[你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)。
