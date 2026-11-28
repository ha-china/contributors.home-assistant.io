# 测试你的应用

> 在你自己的电脑上、真实设备上，或使用纯 Docker，以完整的 Supervisor 和 Home Assistant 运行你的应用。

Source: https://www.hasscn.top/contributors/apps/guides/testing/

你可以通过三种方式测试应用。devcontainer 最完整、最舒适。真实设备是测试硬件所必需的。纯 Docker 则是进行构建检查最快的方式。

## devcontainer

[示例应用仓库](https://github.com/home-assistant/apps-example) 自带了适用于 Visual Studio Code 的 devcontainer。它会在你电脑上的一个容器内运行 Supervisor 和 Home Assistant，并且你仓库中的每个应用都可以作为本地应用使用。它支持 Windows、macOS 和 Linux。

1. 安装 [Visual Studio Code](https://code.visualstudio.com/)、Docker 以及 [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 扩展。
2. 将示例仓库中的 `.devcontainer.json` 和 [`.vscode/tasks.json`](https://github.com/home-assistant/apps-example/blob/main/.vscode/tasks.json) 复制到你的仓库中。如果你是从示例仓库开始的，那么你已经拥有它们了。
3. 在 Visual Studio Code 中打开你的仓库，并在提示时选择 **Reopen in Container**。首次启动需要一些时间。
4. 运行 **Start Home Assistant** 任务：打开命令面板（Command Palette），选择 **Tasks: Run Task**，然后选择该任务。这将启动 Supervisor 和 Home Assistant。
5. 打开 `http://localhost:7123/` 并完成引导设置。

你的应用会显示在应用商店的 **Local apps** 下。`tasks.json` 中的其他任务会使用 `ha apps` 命令为你安装、启动和重新构建应用。将你的应用的 slug 添加到 `tasks.json` 底部的列表中即可使用它们。

devcontainer 使用 `--privileged` 在 Docker 中运行 Docker，这就是它能够运行整个技术栈的原因。不过，它无法访问你的硬件。

## 真实设备

对于任何需要真实硬件的场景，例如串口或蓝牙，请在运行 Home Assistant OS 的设备上进行测试。使用 [Samba share](https://my.home-assistant.io/redirect/supervisor_app/?app=core_samba) 或 [Terminal & SSH](https://my.home-assistant.io/redirect/supervisor_app/?app=core_ssh) 应用，将你的应用文件夹复制到 `local_apps` 中，就像在[你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)中那样。

如果你的 `config.yaml` 中有 `image` 键，Supervisor 会拉取该镜像，而不是构建你的本地更改。在开发期间请注释掉该键，并在发布前恢复它：

```yaml
# image: "ghcr.io/me/my-app"
```

更改之后，在应用商店中选择 **Check for updates**，然后在应用页面上选择 **Rebuild**。通过 SSH，`ha apps rebuild --force local_my_app` 可以实现同样的效果。

## 纯 Docker

要检查你的镜像能否构建，请在应用文件夹中使用 Docker BuildKit：

```bash
docker buildx build -t local/my-app .
```

要为其他架构构建，请添加 `--platform`。Docker 对架构的命名有所不同：`amd64` 对应 `linux/amd64`，`aarch64` 对应 `linux/arm64`。交叉构建需要 QEMU 模拟，请参阅 [Docker 关于多平台构建的文档](https://docs.docker.com/build/building/multi-platform/)。

```bash
docker buildx build --platform linux/arm64 -t local/my-app .
```

你也可以运行该镜像，并使用你自己的一个文件夹作为 `/data`。对于直接读取该文件的程序，请在该文件夹中放置一个 `options.json`：

```bash
docker run --rm -v /tmp/my-app-data:/data -p 8080:8080 local/my-app
```

没有 Supervisor 时，就没有 `SUPERVISOR_TOKEN`，也没有 Supervisor API，因此每个使用该 API 的 Bashio 调用都会失败。这包括 `bashio::config`，它从 API 而不是从 `options.json` 获取配置。请将其用于快速检查，而不是作为完整的测试。

## 日志

你的应用写入 `stdout` 和 `stderr` 的所有内容都会显示在应用的 **Log** 标签页中，也可以通过 `ha apps logs local_my_app` 查看。如果你的应用没有启动或根本没有显示，请在 **Settings** > **System** > **Logs** 下查看 Supervisor 日志，并选择 **Supervisor**。
