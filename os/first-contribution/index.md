# 你对 Supervisor 的首次贡献

> 在开发容器中运行 Supervisor，做一个小改动，运行测试，然后提交你的第一个 pull request。

Source: https://www.hasscn.top/contributors/os/first-contribution/

Supervisor 是进入这个领域最简单的途径。它使用 Python，有现成的开发容器，并且可以在你自己的机器上运行一套完整的 Home Assistant 系统。几分钟内你就能看到自己的改动生效，无需刷写任何东西。

预留一个晚上的时间。容器的首次构建需要一段时间，但你只需要做一次。

> [!TIP]
> 更想开发操作系统本身？从[构建镜像](https://www.hasscn.top/contributors/os/operating-system/build/)开始。首次构建预计需要一小时或更长时间，并且需要大量磁盘空间。

## 1. 打个招呼

加入 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 [**#operating-system**](https://discord.com/channels/330944238910963714/1475552965954900018) 频道。在 **Channels & Roles** 下选择 **I want to contribute dev skills to Home Assistant** 即可看到该频道。你不需要获得许可才能开始，但知道去哪里提问会很有帮助。

## 2. 打开开发容器

你需要 [Docker](https://docs.docker.com/get-docker/)、[Visual Studio Code](https://code.visualstudio.com/) 和 [Git](https://git-scm.com/)。在 Windows 上，请在 WSL2 中工作。

1. 在 GitHub 上 [fork Supervisor 仓库](https://github.com/home-assistant/supervisor/fork)。
2. 克隆你的 fork 并在 Visual Studio Code 中打开它：

   ```shell
   git clone https://github.com/YOUR_GITHUB_USERNAME/supervisor
   cd supervisor
   code .
   ```

3. 当 Visual Studio Code 询问时，选择 **Reopen in Container**。

## 3. 运行 Supervisor

打开命令面板，选择 **Tasks: Run Task**，然后选择 **Run Supervisor**。该任务会从你的工作副本构建一个 Supervisor 镜像并启动它。随后 Supervisor 会下载 Home Assistant Core 及其插件，因此首次启动需要几分钟。

完成后，打开 `http://localhost:9123`。这就是由你自己的 Supervisor 运行的 Home Assistant Core。**Run Supervisor CLI** 任务会针对它打开 `ha` 命令行。

## 4. 找点小事做

- 浏览[开放的 issue](https://github.com/home-assistant/supervisor/issues)，找一些描述清晰且工作量小的。
- 缺失的测试也是很好的首次改动。测试位于 `tests/` 中，其目录结构与 [`supervisor/`](https://github.com/home-assistant/supervisor/tree/main/supervisor) 一致。
- 你自己遇到过的令人困惑的日志消息或错误也算数。你已经知道它为什么重要了。

在着手更大的改动之前，先在 issue 中询问。对 Supervisor 的大型改动需要就方案达成一致。[Supervisor README](https://github.com/home-assistant/supervisor#development) 说得很清楚：小改动和 bug 修复可以直接提交 pull request，但对于重大改动，请先提交 RFC（request for comments，征求意见：一份供他人反馈的书面提案）。

## 5. 做出改动并测试

创建一个分支，做出你的改动，并针对你修改的部分运行测试：

```shell
git checkout -b fix-something
pytest -qsx tests/backups/
```

提交前运行 linter：

```shell
ruff check --fix supervisor tests
ruff format supervisor tests
```

要在运行中的系统中查看你的改动，请再次运行 **Run Supervisor** 任务。它会从你的代码重新构建镜像。

## 6. 提交 pull request

将你的分支推送到你的 fork，并针对 `main` 提交一个 pull request。填写 pull request 模板：描述拟议的改动，选择改动类型，并逐项完成检查清单。维护者会进行审查。预期会有提问，审查本来就是这样运作的。

## 你的 pull request 之后

在 Supervisor 仓库中：

- **检查。** 每次推送时，CI 都会运行 Ruff、pylint、mypy、针对 `Dockerfile` 的 hadolint，以及测试。pull request 模板说得很明白：除非测试通过，否则你的 pull request 无法被合并。一个构建工作流还会从你的分支构建 Supervisor 镜像，并针对运行中的系统执行一些测试。
- **标签。** 你的 pull request 需要一个表示其类型的标签。只要 `cla-signed` 是它唯一的标签，一项检查就会失败。发布说明是自动起草的，并且只列出带有类别标签的 pull request：`breaking-change`、`new-feature`、`bugfix`、`style`、`refactor`、`performance`、`test`、`build`、`ci`、`chore`、`revert` 或 `dependencies`。标签还决定了你的改动会出现在哪个章节。
- **等待。** 30 天没有活动的 pull request 会被标记为过期（stale），并在 7 天后关闭。任何更新都会移除该标记。
- **合并之后。** 你的改动会被构建并发布到 `dev` 频道。随后一次发布将其带到 `beta`，之后再进入 `stable`。参见 [Supervisor 的发布方式](https://www.hasscn.top/contributors/os/supervisor/development/#how-the-supervisor-is-released)。

在操作系统仓库中，pull request 针对 `dev` 提交。每个 pull request 都会运行 hadolint、ShellCheck 和 Buildroot 包检查器。维护者可以添加 `run-ova-test` 标签来构建镜像并运行自动化测试。这只适用于主仓库中的分支，不适用于来自 fork 的 pull request。90 天没有活动的 pull request 会被标记为过期（stale），并在 7 天后关闭。[发布与构建](https://www.hasscn.top/contributors/os/operating-system/releases/)会追踪改动从那里到发布的过程。

## 接下来做什么

- 阅读 [Supervisor 架构](https://www.hasscn.top/contributors/os/supervisor/architecture/)，熟悉代码结构。
- 了解 [jobs](https://www.hasscn.top/contributors/os/supervisor/jobs/) 和[问题解决中心（resolution center）](https://www.hasscn.top/contributors/os/supervisor/resolution-center/)的工作方式。大多数改动都会涉及其中之一。
- 使用[远程系统](https://www.hasscn.top/contributors/os/supervisor/development/#test-on-a-real-system)在真实硬件上进行测试。
