---
title: 你对 core 的首次贡献
description: 搭建开发环境，找一些小的修复任务，然后向 Home Assistant Core 发起你的第一个拉取请求（pull request）。
sidebarLabel: Your first contribution
order: 1
---

你向 core 提交的第一个拉取请求（pull request）不必很大。修复一个小 bug、补充一个缺失的测试，或者改正日志消息中的一个拼写错误，都是完美的起点。重要的是你完整地走过一遍整个流程：环境、修改、测试、拉取请求和审查。在那之后，其他一切都只是大同小异。

为环境搭建预留一个晚上的时间。第一次构建开发容器（development container）需要一段时间，而且你只需要做一次。

## 1. 打个招呼

Join the [Home Assistant Discord](https://www.home-assistant.io/join-chat/). Under **Channels & Roles**, choose **I want to contribute dev skills to Home Assistant** to see the channels for development. General development questions, like whether an integration belongs in core, fit **#developers**. When you are stuck on code, start a thread in **#coding-support**. You do not need permission to start, but it helps to know where to ask when you get stuck.

## 2. 搭建你的环境

最快的方式是使用开发容器：Visual Studio Code 和 Docker 为你提供一个开箱即用的环境，其中包含正确的 Python 版本、所有依赖项以及代码检查工具（linter）。

1. 安装 [Docker](https://docs.docker.com/get-docker/)、[Visual Studio Code](https://code.visualstudio.com/) 和 [Git](https://git-scm.com/)。
2. 在 GitHub 上[复刻（fork）core 仓库](https://github.com/home-assistant/core/fork)。
3. 克隆你的复刻仓库，并在 Visual Studio Code 中打开它：

   ```shell
   git clone https://github.com/YOUR_GITHUB_USERNAME/core
   cd core
   git remote add upstream https://github.com/home-assistant/core.git
   code .
   ```

4. 当 Visual Studio Code 询问时，选择 **Reopen in Container**。首次构建需要几分钟时间。
5. 打开命令面板（Command Palette），选择 **Tasks: Run Task**，然后选择 **Run Home Assistant Core**。等输出平息下来后，在浏览器中打开 `http://localhost:8123`。你应该能看到自己的开发实例的引导（onboarding）界面。

在 Windows 上，请在 WSL2 中进行这些操作。[开发环境](/core/development/environment/)指南中有详细说明，如果你不想使用容器，其中也有手动搭建的方法。

## 3. 寻找可以着手的工作

以下是一些寻找任务的好地方：

- core 仓库中带有 [good first issue](https://github.com/home-assistant/core/labels/good%20first%20issue) 标签的议题（issue）。这类议题并不总是很多，所以即使列表很短也不必担心。
- 你自己在使用的某个集成（integration）中遇到的 bug。你已经知道如何复现它，并且可以用自己的设备来测试修复效果。
- 你在使用的某个集成，它缺少测试或缺少类型提示（type hints）。测试是很受欢迎的首次贡献方式，而且能让你了解该集成的工作原理。

在开始之前，先检查是否已经有人为同一个议题发起了拉取请求。如果议题比较久远，留一条评论说明你正在处理它，可以避免重复劳动。

## 4. 进行修改

为你的修改创建一个分支，从 Home Assistant 最新的 `dev` 分支开始。绝不要直接在 `dev` 分支上工作：

```shell
git fetch upstream
git checkout -b fix-sensor-unit upstream/dev
```

### 找到代码

每个集成都位于自己的文件夹中，文件夹以其[域（domain）](/glossary/domain/)命名：`homeassistant/components/<domain>/`。它的测试位于 `tests/components/<domain>/` 中。域是集成文档页面地址的最后一部分。Philips Hue 集成的文档位于 `https://www.home-assistant.io/integrations/hue/`，因此它的代码在 `homeassistant/components/hue/` 中。

不确定哪个文件是做什么的？[文件结构](/core/integrations/file-structure/)会解释这些文件，[集成如何融入其中](/core/integrations/concepts/)则解释了其背后的理念。

### 运行它

像第 2 步那样，使用 **Run Home Assistant Core** 任务启动你的开发实例。它使用你代码检出中 `config/` 文件夹里的配置，因此与你自己的 Home Assistant 相互独立。像普通用户那样，在 **Settings** > **Devices & services** 中添加你正在处理的集成。

Home Assistant 在启动时会加载你的代码。修改之后，从命令面板中选择 **Tasks: Restart Running Task**。要单步调试代码，按 <kbd>F5</kbd> 在调试器中启动 Home Assistant，并设置断点。参见[调试](/core/development/environment/#debugging)。

### 开启调试日志

大多数集成会在调试（debug）级别记录它们所做的事情。环境搭建过程已在 `config/configuration.yaml` 中添加了 `logger` 部分。将你的集成以及它所使用的库添加到 `logs` 下：

```yaml
logger:
  default: info
  logs:
    homeassistant.components.hue: debug
```

库日志记录器（logger）的名称列在集成的 `manifest.json` 文件中的 `loggers` 下。重启 Home Assistant 后，调试消息就会显示在任务的终端中。你也可以从 UI 开启调试日志：在集成页面上，打开三个点的菜单并选择 **Enable debug logging**。

### 连接你自己的设备

要复现 bug，你通常需要真实的设备。开发容器运行在 Docker 中，使用 Docker 的默认网络：它并不直接位于你的家庭网络中。

- 容器中的 Home Assistant 可以通过 IP 地址连接到你网络上的设备。添加集成时，输入设备的 IP 地址即可。
- 发现（discovery）功能在容器中通常无法工作。Zeroconf 和 SSDP 依赖组播（multicast），而 Docker 的默认网络不会传输组播流量，因此需要手动添加设备。
- 设备可以通过你的电脑访问 Home Assistant。容器发布了 8123 端口，因此向 Home Assistant 推送数据的设备会使用你电脑的 IP 地址，例如 `http://192.168.1.10:8123`。容器还通过 UDP 发布了 5683 端口，供 Shelly 集成使用。
- USB 棒和蓝牙适配器只能在 Linux 主机上透传给容器。在 Windows 和 macOS 上，容器无法直接访问这类硬件。

在 Windows 上，容器运行在 WSL2 内部。如果你的设备或浏览器无法访问它，请参见 [WSL 中的网络](/core/development/environment/#networking-in-wsl)。

### 测试它

保持修改小而专注，只围绕一件事。然后运行你所修改集成的测试：

```shell
pytest tests/components/YOUR_INTEGRATION
```

如果你修复了一个 bug，请添加一个测试：没有你的修复时该测试失败，有了修复后该测试通过。关于 core 中测试的编写方式，请参见[编写测试](/core/development/tests/)；关于运行测试的更多方式，请参见[运行测试](/core/development/testing/)。

## 5. 提交并推送

提交时 linter 会自动运行。如果它们修改了某个文件，请将该文件加入暂存区并再次提交。

```shell
git add .
git commit -m "Fix unit of the energy sensor in Example"
git push -u origin HEAD
```

`-u` 会将你复刻仓库中的同名分支设为该分支的默认上游。如果不加这个参数，你的分支会继续跟踪 `upstream/dev`，之后直接执行 `git push` 或 `git pull` 就会作用到错误的位置。

提交信息请使用祈使语气，例如 "Fix" 或 "Add"，并以大写字母开头。

## 6. 发起拉取请求

在 GitHub 上，从你的分支向 `home-assistant/core` 的 `dev` 分支发起拉取请求。按照模板填写内容，不要删除模板中的任何部分：

- 在 **Type of change** 中仅勾选一项。
- 解释*为什么*需要这个修改，而不仅仅是它做了什么。
- 使用 `fixes #12345` 关联你所修复的议题。

在你的第一个拉取请求中，机器人会要求你签署贡献者许可协议（Contributor License Agreement）。请立即签署，因为没有它就不会有人审查你的拉取请求。此外，在你的第一个拉取请求上，测试要等到维护者批准后才会运行。这是正常现象，耐心等待即可。

## 7. 完成审查

会有人审查你的拉取请求。这可能需要一段时间，因为排队队列很长。请做好被提问和被要求修改的心理准备：每个拉取请求都是这样变得更好的，而且这绝不是针对你个人。当被要求修改时，你的拉取请求会被转为草稿（draft）。推送修复后，再将其重新标记为 **Ready for review**。

在等待期间，可以审查其他人的拉取请求。模板要求你审查两个拉取请求，这也是了解 core 工作方式的最佳途径。

## 接下来做什么

- 阅读[发起拉取请求之后](/core/development/review-process/)，了解接下来会发生什么。
- 在下一次修改之前，查看[开发检查清单](/core/development/checklist/)。
- 想构建更庞大的东西？从[构建集成](/core/integrations/)开始。如果要开发你自己的新集成，请先阅读[它是否属于 core](/core/integrations/create/#does-it-belong-in-core)：项目推荐将 [Marketplace](/marketplace/) 作为它的首选归宿。
