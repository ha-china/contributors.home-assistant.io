# 应用的工作原理

> Supervisor 如何处理你的应用，从仓库到运行中的容器，以及在此过程中你会遇到的各种名称和文件夹。

Source: https://www.hasscn.top/contributors/apps/how-apps-work/

应用（app）是由 Supervisor 为用户管理的容器。了解 Supervisor 在每个步骤中做了什么，就能让大多数配置选项变得一目了然。本页将从仓库到运行中的应用，完整地介绍这一过程。

## 组成部分

- **Home Assistant OS** 在一个精简的操作系统之上以容器的方式运行一切。
- **Supervisor** 是管理所有其他容器的容器：Home Assistant Core、几个系统容器（称为插件/plugin），以及每一个应用。它有一个 REST API，供 Core、UI 和应用调用。[Supervisor 运行的内容](https://www.hasscn.top/contributors/os/supervisor/#what-the-supervisor-runs)列出了每个容器及其地址。
- **应用**是一个包含 `config.yaml` 以及 `Dockerfile` 或对已发布镜像的引用的文件夹。
- **仓库（repository）**是一个包含一个或多个应用文件夹以及 `repository.yaml` 的 Git 仓库。
- **应用商店**在 **设置** > **应用** > **安装应用** 下显示用户添加的每个仓库中的应用。

## 从仓库到应用商店

Supervisor 会为它所知道的每个仓库保留一份本地副本：

- **本地应用**：设备上的 `local_apps` 文件夹。不涉及 Git，因此它是开发时的首选。
- **官方应用**：[home-assistant/addons](https://github.com/home-assistant/addons)。
- 几个内置的社区仓库，例如[社区应用](https://github.com/hassio-addons/repository)、ESPHome 和 Music Assistant。
- 用户通过 URL 添加的每个仓库。

当商店重新加载时，Supervisor 会在每个仓库中搜索名为 `config.yaml`、`config.yml` 或 `config.json` 的文件，搜索任意深度，但会跳过隐藏文件夹以及名为 `rootfs` 的文件夹。找到的每个文件就是一个应用。它会根据配置模式（schema）验证该文件；配置无效的应用会被跳过，并在 Supervisor 日志中给出警告。

## 名称与 ID

Supervisor 通过仓库和 slug（以一个下划线连接）来标识一个已安装的应用：`{repository}_{slug}`。

- **slug** 来自 `config.yaml`。它可以包含字母、数字、`-`、`_` 和 `.`，并且在其所属仓库内必须唯一。
- **仓库 ID** 对于本地应用是 `local`，对于官方应用是 `core`。对于通过 URL 添加的仓库，它是小写后的 URL（包含分支）的 SHA-1 哈希值的前 8 个字符，例如社区应用是 `a0d7b954`。

因此，本地文件夹中的 `hello_world` 会变成 `local_hello_world`。你会在 API、CLI（`ha apps info local_hello_world`）以及 [my links](https://www.hasscn.top/contributors/glossary/my-link/) 中看到这个完整 ID。它也是内部网络上主机名的基础：将 `_` 替换为 `-`，`local_hello_world` 就可以通过 `local-hello-world` 访问。

## 安装与构建

当用户安装一个应用时，Supervisor 会通过以下两种方式之一获取其镜像：

- **拉取（Pull）**：如果 `config.yaml` 中有 `image` 键，Supervisor 会以 `version` 作为标签拉取该镜像。这是已发布应用应有的工作方式：快速且可靠。参见[发布你的应用](https://www.hasscn.top/contributors/apps/guides/publishing/)。
- **构建（Build）**：如果没有 `image`，Supervisor 会使用 Docker BuildKit 在设备上根据你的 `Dockerfile` 构建镜像。本地应用在开发期间就是这种情况。

在安装任何内容之前，Supervisor 会检查应用是否适合该系统：CPU 架构必须在 `arch` 中，如果你设置了 `machine`，机器类型必须与之匹配，并且 Home Assistant 的版本必须至少为 `homeassistant` 中指定的版本。

## 启动

当一个应用启动时，Supervisor 会：

1. 根据你的 `schema` 验证用户的选项，并将其写入 `/data/options.json`。
2. 按照 `config.yaml` 的要求创建容器：端口、映射的文件夹、设备、能力（capabilities）、AppArmor 配置文件，以及环境变量，其中包括一个该应用专属的 `SUPERVISOR_TOKEN`。
3. 将容器加入内部网络，并在内部 DNS 中注册其主机名。
4. 启动容器并等待其运行。

在系统启动时，应用会根据其 `startup` 值分阶段启动：

| `startup` | 启动时机 |
| --- | --- |
| `initialize` | 最先，在 Supervisor 启动时 |
| `system` | 在服务之前，适用于数据库之类的组件 |
| `services` | 在 Home Assistant Core 之前 |
| `application` | 在 Home Assistant Core 之后。这是默认值 |
| `once` | 绝不在启动时运行。适用于完成工作后即退出的应用 |

只有当用户保持 **开机启动** 开启时，应用才会在系统启动时启动。使用 `boot: manual` 时，它默认关闭；使用 `boot: manual_only` 时，用户完全无法将其打开。

## 运行期间

- 你的应用写入 `stdout` 和 `stderr` 的一切内容都会显示在 **日志** 标签页中。
- 如果用户开启了 **看门狗（Watchdog）**，当容器失败时，Supervisor 会重启你的应用。如果你设置了 `watchdog` URL，它还会检查该 URL，并在其停止响应时重启应用。
- `/data` 是你的应用的私有持久化存储。它在重启和更新后依然保留，并且是应用每次备份的一部分。`/data` 和映射文件夹之外的一切内容在容器重建时都会丢失。

## 备份

应用的备份包含其配置、其 `/data` 文件夹，以及（如果你映射了 `app_config`）其公共配置文件夹。默认情况下，备份是热备份：你的应用会继续运行。如果你的应用需要磁盘上的一致状态，你有两个选择：

- 设置 `backup_pre` 和 `backup_post` 为在备份前后于你的容器内运行的命令，例如将数据库刷写到磁盘。
- 设置 `backup: cold`，Supervisor 会在备份期间停止你的应用。

使用 `backup_exclude` 来排除无需恢复的文件，例如缓存。详情请参见[应用配置](https://www.hasscn.top/contributors/apps/reference/configuration/#backups)。

## 更新

当你在 `config.yaml` 中提高 `version` 时，用户会看到更新。更新会拉取（或构建）新镜像并重建容器；`/data` 会保留。用户可以为每个应用开启自动更新。如果某个版本需要用户注意，请将其列在 `breaking_versions` 中，Supervisor 绝不会自动跨过它进行更新。

## 下一步

- [指南](https://www.hasscn.top/contributors/apps/guides/)每个只讲一个任务，从容器镜像到发布你的应用。
- [与 Home Assistant 和 Supervisor 通信](https://www.hasscn.top/contributors/apps/guides/communication/)讲解了内部网络和 API。
- [运行时环境](https://www.hasscn.top/contributors/apps/reference/environment/)列出了你的容器从 Supervisor 获得的一切。
- [应用配置](https://www.hasscn.top/contributors/apps/reference/configuration/)包含 `config.yaml` 的每一个键。
