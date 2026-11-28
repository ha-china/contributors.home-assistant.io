# 搭建开发环境

> 在开发容器中从源码运行 Supervisor，运行测试和代码检查工具，并在真实系统上试用你的构建版本。

Source: https://www.hasscn.top/contributors/os/supervisor/development/

Supervisor 提供了一个开发容器，可以运行一个完整的系统：你的 Supervisor、Home Assistant Core、插件和应用，全部运行在你机器上的一个 Docker 容器内。对于大多数改动，这就足够了。

## 搭建开发容器

你需要 [Docker](https://docs.docker.com/get-docker/)、安装了 Dev Containers 扩展的 [Visual Studio Code](https://code.visualstudio.com/)，以及 [Git](https://git-scm.com/)。[Core 开发环境](https://www.hasscn.top/contributors/core/development/environment/)指南介绍了如何在各个操作系统上安装它们。在 Windows 上，请在 WSL2 中工作。

1. [Fork Supervisor 仓库](https://github.com/home-assistant/supervisor/fork)，并克隆你的 fork。
2. 在 Visual Studio Code 中打开该文件夹，并在提示时选择 **Reopen in Container**。

该容器以特权模式运行，内部带有自己的 Docker 引擎。这正是它能够运行整套 Supervisor 系统的原因。此设置会安装 Python 依赖项和 pre-commit 钩子。

## 运行 Supervisor

打开命令面板，选择 **Tasks: Run Task**，然后选择 **Run Supervisor**。该任务会从你的工作副本构建一个 Supervisor 镜像，并在容器内以 `hassio_supervisor` 的名称启动它。首次启动会下载 Home Assistant Core 和插件，这需要一些时间。

| 地址 | 说明 |
| --- | --- |
| `http://localhost:9123` | Home Assistant Core |
| `http://localhost:7357` | 观察器（observer） |

**Run Supervisor CLI** 任务会针对你的 Supervisor 打开 `ha` 命令行。每次修改后再次运行 **Run Supervisor**：它会用你的代码的新镜像重启 Supervisor。

开发容器遵循 `dev` 频道，因此 Core 和插件都是最新的开发版本。从源码构建的 Supervisor 版本号为 `9999.09.9.dev9999`，并且绝不会尝试自我更新。

## 测试和代码检查

测试会模拟 Docker、D-Bus 和网络，因此它们可以在任何地方运行，无需运行中的 Supervisor。它们位于 [`tests/`](https://github.com/home-assistant/supervisor/tree/main/tests) 中，布局与 [`supervisor/`](https://github.com/home-assistant/supervisor/tree/main/supervisor) 相同：

```shell
pytest -qsx tests/resolution/
```

编写新测试时，请使用带有 pytest fixture 的普通 `test_` 函数。[`tests/conftest.py`](https://github.com/home-assistant/supervisor/blob/main/tests/conftest.py) 提供了一个模拟的 `CoreSys`，以及更多其他内容。

在提交之前，请运行代码检查工具和类型检查器：

```shell
ruff check --fix supervisor tests
ruff format supervisor tests
pylint supervisor tests
mypy --ignore-missing-imports supervisor/
```

或者使用 `pre-commit run --all-files` 一次性运行所有已配置的钩子。

## 代码规范

该仓库在 [`.github/copilot-instructions.md`](https://github.com/home-assistant/supervisor/blob/main/.github/copilot-instructions.md) 中有自己的贡献者指南。其中最重要的几条：

- 在 [`supervisor/`](https://github.com/home-assistant/supervisor/tree/main/supervisor) 内部使用相对导入。
- 使用 [`supervisor/const.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/const.py) 中的常量，或模块自身的 `const.py`，而不是字面值。
- 通过 `self.sys_*` 访问系统的其他部分，参见[架构](https://www.hasscn.top/contributors/os/supervisor/architecture/)。
- 抛出 [`supervisor/exceptions.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/exceptions.py) 中的异常，并使用 `from` 进行异常链连接。
- 在新代码和注释中使用 "app"，而不是 "add-on"。仅在现有 API 字段或类仍在使用 `addon` 的地方保留它。

## 在真实系统上测试

有些问题只会在真实硬件上显现：特定开发板的 D-Bus API、磁盘、USB 设备。要在 Home Assistant OS 设备上运行你的 Supervisor：

1. 在设备上，使用 `ha info` 查看架构：`amd64` 或 `aarch64`。
2. 在你的电脑上，为该架构构建一个镜像，并将其推送到你可以拉取的镜像仓库，例如 GitHub 容器镜像仓库：

   ```shell
   docker build --platform linux/arm64 --push \
     --tag ghcr.io/YOUR_GITHUB_USERNAME/aarch64-hassio-supervisor:dev .
   ```

   Docker 将架构称为 `linux/amd64` 和 `linux/arm64`。镜像名称使用 Home Assistant 的命名，即 `amd64` 和 `aarch64`。

3. 在设备上，切换到 `dev` 频道，这样 Supervisor 就不会用稳定版替换你的构建版本：

   ```shell
   ha supervisor options --channel dev
   ```

4. 在宿主机 shell 中（参见[调试宿主机](https://www.hasscn.top/contributors/os/operating-system/debugging/)），拉取你的镜像并将其标记为 OS 启动时使用的镜像：

   ```shell
   docker pull ghcr.io/YOUR_GITHUB_USERNAME/aarch64-hassio-supervisor:dev
   docker tag ghcr.io/YOUR_GITHUB_USERNAME/aarch64-hassio-supervisor:dev \
     ghcr.io/home-assistant/aarch64-hassio-supervisor:latest
   ```

5. 重启 Supervisor 服务，并跟踪其输出：

   ```shell
   systemctl restart haos-supervisor
   journalctl -fu haos-supervisor
   ```

该服务会检测到镜像已更改，并基于它创建一个新的 Supervisor 容器。

GitHub 容器镜像仓库中的镜像默认是私有的。你可以在设备上使用 `docker login ghcr.io` 登录，或者在 GitHub 上将该软件包在其设置中设为公开。

## 提交拉取请求

针对 [home-assistant/supervisor](https://github.com/home-assistant/supervisor) 的 `main` 分支提交你的拉取请求，并填写模板。对于较大的改动，请先在 issue 中讨论方案。

如果你修改了 API，拉取请求模板还会要求：

- 如果 `ha` 命令需要，向 [cli](https://github.com/home-assistant/cli) 仓库提交拉取请求。
- 向 Core 所使用的 [Python 客户端库](https://github.com/home-assistant-libs/python-supervisor-client)提交拉取请求。
- 在 Apps 区域中更新 [Supervisor API](https://www.hasscn.top/contributors/apps/supervisor-api/) 参考文档。

## Supervisor 的发布方式

1. 拉取请求被合并到 `main` 分支。
2. 每次合并都会被构建并发布到 `dev` 频道。
3. 一次发布将一个版本（如 `2026.10.1`）发布到 `beta` 频道。
4. 一旦它被证明稳定，版本仓库中的 [stable.json](https://github.com/home-assistant/version/blob/master/stable.json) 就会更新，稳定版系统便会采用它。
