# 为官方应用做贡献

> 帮助改进官方应用、基础镜像以及每个应用都依赖的构建工具。构建你的第一个应用，然后选择你想出力的地方。

Source: https://www.hasscn.top/contributors/apps/first-contribution/

在这个领域，大多数人都会为自己构建一个应用，或者与他人分享。这本身就是一种贡献。一旦你了解了应用是如何组装起来的，你还可以帮助改进整个生态系统共享的部分：官方应用、基础镜像，以及构建它们的工具。

本页面将带你循序渐进地完成。从第 1 步开始，在你觉得合适的地方停下即可。

## 1. 构建你的第一个应用

完成[你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)教程，也就是本区域的下一页。你将构建一个小应用，安装到自己的 Home Assistant 上，并把它扩展成一个带选项的 Web 服务器。这大约需要半小时，本步骤之后的所有内容都假设你已了解应用文件夹里的东西。

## 2. 选择你想出力的地方

有三个代码仓库存放着每个应用开发者都会用到的东西。每个都是普通的 GitHub 仓库：fork 它，创建分支，然后向 `master` 发起 pull request。

### 官方应用

[home-assistant/addons](https://github.com/home-assistant/addons) 存放着官方应用，例如 Mosquitto broker、MariaDB、Samba share 和 Z-Wave JS。每个应用都是一个文件夹，包含你在教程中用到的相同文件：`config.yaml`、一个 `Dockerfile`、一个 `build.yaml`、`DOCS.md` 中的文档、一个 `CHANGELOG.md`，以及它的翻译文件。

- **缺陷（bug）** 通过其 [issues](https://github.com/home-assistant/addons/issues) 中的缺陷报告表单提交。该表单仅适用于受支持的配置。一个包含可复现缺陷及其日志的 issue 是很好的起点。
- **功能请求** 请前往[功能请求讨论区](https://github.com/orgs/home-assistant/discussions)，而不是 issues。
- **任务（task）** 是一种单独的 issue 类型，供 Open Home Foundation 员工和授权贡献者使用。由其他人打开的任务 issue 会被自动关闭。

30 天内没有活动的 issue 会被标记为过期（stale），并在 7 天后关闭。带有 `pinned`、`security` 或 `Help wanted` 标签的 issue 不受此限制。

### 基础镜像

[home-assistant/docker-base](https://github.com/home-assistant/docker-base) 构建了 Home Assistant 和大多数应用所基于的基础镜像：Alpine、Alpine 上的 Python、Debian 和 Ubuntu，支持 `amd64` 和 `arm64`。它们自带 S6 overlay、Bashio 和 TempIO。README 说明了如何使用 `docker buildx` 在本地构建每个镜像。

这个仓库没有 issue 跟踪器。变更以 pull request 的形式提交。

### 构建工具

[home-assistant/builder](https://github.com/home-assistant/builder) 存放着用于构建、使用 Cosign 签名并发布多架构容器镜像的 GitHub Actions。[发布指南](https://www.hasscn.top/contributors/apps/guides/publishing/)会用到它们。它的 [issues](https://github.com/home-assistant/builder/issues) 开放用于报告缺陷。

旧的 `home-assistant/builder` action（作为单个步骤使用）已被弃用，不再维护。开发工作集中在 [`actions/`](https://github.com/home-assistant/builder/tree/master/actions) 文件夹中的新 actions 上。

## 3. 发起 pull request

这三个仓库都没有自己的 pull request 模板或贡献指南。home-assistant 组织的[贡献指南](https://github.com/home-assistant/.github/blob/master/CONTRIBUTING.md)适用：

- 让你的改动尽可能聚焦。相互之间没有依赖的改动应放在单独的 pull request 中。
- 遵循风格和代码质量标准，并确保各项检查仍然通过。
- 写好提交信息（commit message）。

你可以使用 AI 工具来辅助，但你必须理解并能够解释你提交的每一处改动。详情请参阅 [Open Home Foundation AI 政策](https://github.com/home-assistant/addons/blob/master/AI_POLICY.md)。

## 你的 pull request 之后

你一发起 pull request，检查就会开始运行。它们必须通过才能合并：

| 仓库 | pull request 上运行的检查 |
| --- | --- |
| addons | 对每个 `Dockerfile` 运行 hadolint，以及 yamllint 和对脚本的 ShellCheck。每个 `config.yaml`、`build.yaml`、`Dockerfile`、`apparmor.txt`、`data` 或 `rootfs` 有改动的应用都会针对 `amd64` 和 `aarch64` 进行测试构建。 |
| docker-base | 构建每个镜像。不会发布任何内容：镜像只会在发布版本时推送。 |
| builder | 当 actions 发生变化时，会用它们构建一个测试应用。 |

随后仓库的维护者会审查你的改动。请预期会有提问，审查本来就是这样。在 docker-base 和 builder 中，发布说明由已合并的 pull request 汇总而成。

## 接下来做什么

- 还没有构建过应用？从[你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)开始，然后[构建一个真实的应用](https://www.hasscn.top/contributors/apps/build-a-real-app/)，并阅读[应用的工作原理](https://www.hasscn.top/contributors/apps/how-apps-work/)，了解 Supervisor 对应用做了什么。
- 查看针对你手头任务的[指南](https://www.hasscn.top/contributors/apps/guides/)。
- 想参与 Supervisor 本身的开发？前往 [OS 与 Supervisor](https://www.hasscn.top/contributors/os/first-contribution/)。
