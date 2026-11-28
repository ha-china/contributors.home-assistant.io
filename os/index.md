# 操作系统与 Supervisor

> 参与 Home Assistant OS 和 Supervisor 的开发工作，这两个组件将一块开发板或一台虚拟机变成一个能够运行、自我更新和自我修复的 Home Assistant 系统。

Source: https://www.hasscn.top/contributors/os/

大多数人将 Home Assistant 运行在 [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/) 上。他们烧录一个镜像，插上设备，之后就再也不用操心 Linux。这之所以可行，是因为有两个项目在协同工作：

- **Home Assistant OS** 是一个小型的只读 Linux 系统，使用 Buildroot 构建——这是一个可以从源码构建完整嵌入式 Linux 系统的工具。它负责启动设备、运行 Docker，并通过 A/B 方案进行自我更新：系统有两份副本 A 和 B，更新会写入当前未运行的那一份，如果更新后无法启动，则回退到另一份。这项工作由 RAUC 完成，它是一个面向嵌入式 Linux 的更新系统。OS Agent 是主机上的一个小程序，为 Supervisor 执行主机任务，例如迁移数据磁盘。
- **Supervisor** 是一个运行在其上层容器中的 Python 程序。它运行 Home Assistant Core、应用（apps）以及它自己的插件，负责创建备份、安装更新，并监控系统健康状况。

本区域面向希望参与其中任一项目开发的开发者。对于 OS，你面对的是嵌入式 Linux：Buildroot、内核、引导加载程序和开发板支持。对于 Supervisor，你面对的是异步 Python、Docker 和 D-Bus——Linux 服务之间相互通信所使用的消息总线。两者互不依赖，无需同时掌握。

## 各组件如何协作

Diagram. 自上而下：什么运行在什么之上。点击方框可了解更多信息。

- 由 Supervisor 运行，各自位于独立的容器中
  - [Home Assistant Core](https://www.hasscn.top/contributors/core/): Home Assistant 本身
  - [Apps](https://www.hasscn.top/contributors/apps/how-apps-work/): 与 Core 并列运行的软件
  - [Plugins](https://www.hasscn.top/contributors/os/supervisor/plugins/): DNS、音频、CLI 等
- 管理以上所有内容，运行在自己的容器中
  - [Supervisor](https://www.hasscn.top/contributors/os/supervisor/architecture/): 运行、更新并备份这一切
- [Home Assistant OS](https://www.hasscn.top/contributors/os/operating-system/) (the subject of this page)
  - Docker: 运行各个容器
  - [NetworkManager](https://www.hasscn.top/contributors/os/operating-system/networking/): 网络
  - [RAUC](https://www.hasscn.top/contributors/os/operating-system/update-system/): 更新，具有两个系统槽位
  - OS Agent: 为 Supervisor 执行主机任务
  - [Buildroot](https://www.hasscn.top/contributors/os/operating-system/build/): 从源码构建，只读
- [开发板](https://www.hasscn.top/contributors/os/operating-system/boards/)
  - [Green 和 Yellow](https://www.hasscn.top/contributors/os/operating-system/boards/): Home Assistant 硬件
  - [Raspberry Pi](https://www.hasscn.top/contributors/os/operating-system/raspberry-pi/): Pi 3、4 和 5
  - [ODROID](https://www.hasscn.top/contributors/os/operating-system/odroid/): Hardkernel 开发板
  - [PC](https://www.hasscn.top/contributors/os/operating-system/generic/): 通用 x86-64 和 aarch64
  - [虚拟机](https://www.hasscn.top/contributors/os/operating-system/virtual-machine/): OVA、QCOW2 等

[架构](https://www.hasscn.top/contributors/architecture/platform/)区域介绍了整体概况。本区域则深入介绍你需要了解的改动细节。

## 从这里开始

- [你的第一次贡献](https://www.hasscn.top/contributors/os/first-contribution/)：在开发容器中运行 Supervisor，进行修改，然后提交 pull request。
- [安装类型](https://www.hasscn.top/contributors/os/installation-types/)：OS 和 Supervisor 分别在哪些场景下使用，哪些场景下不使用。

## Home Assistant OS

- [概览](https://www.hasscn.top/contributors/os/operating-system/)：OS 中包含什么、如何启动，以及代码仓库的组织方式。
- [构建镜像](https://www.hasscn.top/contributors/os/operating-system/build/)：搭建构建容器并为开发板进行构建。
- [测试你的构建](https://www.hasscn.top/contributors/os/operating-system/test/)：在 QEMU 中启动、运行测试，并安装到设备上。
- [配置主机](https://www.hasscn.top/contributors/os/operating-system/configuration/)：`CONFIG` USB 驱动器、内核模块、udev 规则和时间服务器。
- [配置网络](https://www.hasscn.top/contributors/os/operating-system/networking/)：NetworkManager 连接、Wi-Fi 和静态地址。
- [调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/)：端口 22222 上的 SSH、串行控制台和日志。
- [发布与构建](https://www.hasscn.top/contributors/os/operating-system/releases/)：分支、版本号和构建流水线。
- 参考：[分区](https://www.hasscn.top/contributors/os/operating-system/partitions/)、[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/)、[开发板元数据](https://www.hasscn.top/contributors/os/operating-system/board-metadata/)和[支持的开发板](https://www.hasscn.top/contributors/os/operating-system/boards/)。

## Supervisor

- [概览](https://www.hasscn.top/contributors/os/supervisor/)：Supervisor 做什么，以及它运行什么。
- [搭建开发环境](https://www.hasscn.top/contributors/os/supervisor/development/)：在开发容器中运行 Supervisor，并在真实系统上进行测试。
- [调试 Supervisor](https://www.hasscn.top/contributors/os/supervisor/debugging/)：连接 Python 调试器并阅读日志。
- [将 Core 连接到 Supervisor](https://www.hasscn.top/contributors/os/supervisor/core-connection/)：针对真实的 Supervisor 开发 `hassio` 集成（integration）。
- 工作原理：[架构](https://www.hasscn.top/contributors/os/supervisor/architecture/)、[任务](https://www.hasscn.top/contributors/os/supervisor/jobs/)、[问题解决中心](https://www.hasscn.top/contributors/os/supervisor/resolution-center/)和[插件](https://www.hasscn.top/contributors/os/supervisor/plugins/)。

Supervisor 也是运行[应用（apps）](https://www.hasscn.top/contributors/glossary/app/)的组件。应用开发以及它们所使用的 Supervisor API 参考文档位于[应用（Apps）](https://www.hasscn.top/contributors/apps/)区域。

## 与谁交流

- [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 [**#operating-system**](https://discord.com/channels/330944238910963714/1475552965954900018) 频道是提问 Home Assistant OS 和 Supervisor 相关问题的地方。看不到该频道？在 **Channels & Roles** 下选择 **I want to contribute dev skills to Home Assistant**。
- Issue 和 pull request 位于 [home-assistant/operating-system](https://github.com/home-assistant/operating-system) 和 [home-assistant/supervisor](https://github.com/home-assistant/supervisor)。每个插件都有各自的代码仓库，列在[插件](https://www.hasscn.top/contributors/os/supervisor/plugins/)页面上。
- 为新开发板添加支持属于架构决策。请阅读 [ADR-0015](https://github.com/home-assistant/architecture/blob/master/adr/0015-home-assistant-os.md) 和 [ADR-0017](https://github.com/home-assistant/architecture/blob/master/adr/0017-hardware-screening-os.md)，并在编写代码之前先在[架构仓库](https://github.com/home-assistant/architecture)中发起讨论。
