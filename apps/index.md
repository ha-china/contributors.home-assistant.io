# 应用（Apps）

> 打包与 Home Assistant 并行运行的软件，由 Supervisor 管理。构建一个应用，测试它，并与所有人分享。

Source: https://www.hasscn.top/contributors/apps/

应用（Apps）是与 Home Assistant 并行运行的额外程序：MQTT 代理、文件编辑器、数据库、媒体服务器。应用以前被称为加载项（add-ons），你在代码、API 和较早的文章中仍然会看到这个名称。它们运行在 Home Assistant OS 上，由 [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/) 安装、启动、更新，并包含在备份中。

在底层，一个应用就是一个容器镜像加上一个小小的配置文件。配置文件告诉 Supervisor 应用需要什么：哪些端口、哪些文件夹、哪些硬件，以及用户可以设置哪些选项。用户在 **设置** > **应用** 下的 **应用商店** 中安装应用，任何人都可以发布一个包含自己应用的仓库。

## 本内容适合谁

如果你想为自己或他人把软件打包成应用，这个领域就是为你准备的。你需要熟悉终端、Docker 或其他容器工具，以及一些 shell 脚本。你不需要了解 Python 或 Home Assistant 的代码库。

如果你想参与 Supervisor 本身（运行应用的那部分）的开发，请参阅 [OS 与 Supervisor](https://www.hasscn.top/contributors/os/)。

## 从这里开始

按顺序完成以下步骤：

1. [为官方应用做贡献](https://www.hasscn.top/contributors/apps/first-contribution/)：你的第一次贡献，从你自己的应用到官方应用、基础镜像和构建工具。
2. [你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)：构建一个 "Hello world" 应用，安装它，并将其扩展为一个带选项的小型 Web 服务器。大约半小时。
3. [构建一个真实的应用](https://www.hasscn.top/contributors/apps/build-a-real-app/)：完整地走一遍一个示例应用，包括服务、选项、使用 Bashio 记录日志、翻译、文档、CI 和发布。
4. [应用的工作原理](https://www.hasscn.top/contributors/apps/how-apps-work/)：Supervisor、仓库、应用文件夹，以及应用启动时会发生什么。

## 指南

- [构建容器镜像](https://www.hasscn.top/contributors/apps/guides/dockerfile/)：基础镜像、构建参数和标签。
- [使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/)：S6 overlay 是基础镜像中的进程管理器。它按顺序运行你的设置步骤和程序，重启它们，并在它们失败时停止容器。
- [添加选项](https://www.hasscn.top/contributors/apps/guides/options/)：让用户配置你的应用，包括验证和翻译后的标签。
- [与 Home Assistant 和 Supervisor 通信](https://www.hasscn.top/contributors/apps/guides/communication/)：内部网络、Core API 代理和 Supervisor API。
- [通过 ingress 添加 Web 界面](https://www.hasscn.top/contributors/apps/guides/ingress/)：在 Home Assistant UI 中展示你的应用。
- [共享服务并发现集成](https://www.hasscn.top/contributors/apps/guides/services-discovery/)：向其他应用提供 MQTT 或 MySQL，并让 Home Assistant 为你的应用设置集成（integration）。
- [访问硬件和主机](https://www.hasscn.top/contributors/apps/guides/hardware/)：串口、USB、GPIO、音频和主机命名空间。
- [展示你的应用](https://www.hasscn.top/contributors/apps/guides/presentation/)：README、文档、更新日志、图标和徽标。
- [测试你的应用](https://www.hasscn.top/contributors/apps/guides/testing/)：devcontainer、真实设备和纯 Docker。
- [保护你的应用](https://www.hasscn.top/contributors/apps/guides/security/)：AppArmor、API 角色、保护模式和用户身份验证。
- [发布你的应用](https://www.hasscn.top/contributors/apps/guides/publishing/)：为每种架构构建镜像并发布你的版本。
- [创建并分享仓库](https://www.hasscn.top/contributors/apps/guides/repository/)：把你的应用放到用户可以添加的地方。

## 参考

- [应用配置](https://www.hasscn.top/contributors/apps/reference/configuration/)：`config.yaml` 的每一个键。
- [Bashio](https://www.hasscn.top/contributors/apps/bashio/)：基础镜像中 shell 库的每一个函数，用于读取选项、写日志和调用 Supervisor API。
- [应用文件](https://www.hasscn.top/contributors/apps/reference/files/)：应用文件夹和仓库中的文件。
- [运行时环境](https://www.hasscn.top/contributors/apps/reference/environment/)：应用容器内的环境变量、文件夹和网络地址。
- [安全评级](https://www.hasscn.top/contributors/apps/reference/security-rating/)：Supervisor 如何为你的应用评级。
- [Supervisor API](https://www.hasscn.top/contributors/apps/supervisor-api/)：每个端点、其载荷以及数据模型。

## 实用仓库

- [hassio-addons/app-example](https://github.com/hassio-addons/app-example)：[构建一个真实的应用](https://www.hasscn.top/contributors/apps/build-a-real-app/) 所讲解的示例应用，包含 S6 服务、Bashio、lint 检查和发布。
- [home-assistant/apps-example](https://github.com/home-assistant/apps-example)：一个更小的示例仓库，带有 devcontainer 和构建其中每个应用的工作流。
- [hassio-addons/bashio](https://github.com/hassio-addons/bashio)：Bashio，用于应用的 shell 函数库。
- [home-assistant/addons](https://github.com/home-assistant/addons)：官方应用。
- [hassio-addons](https://github.com/hassio-addons)：社区应用，以及大量优秀示例。
- [home-assistant/docker-base](https://github.com/home-assistant/docker-base)：基础镜像。
- [home-assistant/builder](https://github.com/home-assistant/builder)：用于构建和发布镜像的 GitHub Actions。
- [home-assistant/supervisor](https://github.com/home-assistant/supervisor)：Supervisor。有疑问时，代码就是真理。

## 与谁交流

- [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道是应用开发者互相帮助的地方。关于 Supervisor 如何运行应用的问题适合发在 [**#operating-system**](https://discord.com/channels/330944238910963714/1475552965954900018)，这是 Home Assistant OS 和 Supervisor 的频道。看不到这些频道？在 **Channels & Roles** 下，选择 **I want to contribute dev skills to Home Assistant**。
- 发现了 Supervisor 处理应用方面的 bug？请在 [home-assistant/supervisor](https://github.com/home-assistant/supervisor/issues) 中提交 issue。
- 官方应用有问题？请使用 [home-assistant/addons](https://github.com/home-assistant/addons/issues) 的 issues。
- 准备好向世界展示你的应用了吗？请在社区论坛的 [Share your Projects](https://community.home-assistant.io/c/projects/9) 分类中发布它。
