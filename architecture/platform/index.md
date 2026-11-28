# 围绕 Core

> 与 Home Assistant Core 一起运行、或从别处与之通信的软件，以及它们如何协同工作。

Source: https://www.hasscn.top/contributors/architecture/platform/

Home Assistant Core 是核心，但它并非独自完成所有事情。在 Home Assistant OS 上，Supervisor 负责运行、更新和备份 Core，同时管理提供更多软件的应用（app）。伴侣应用（companion app）将 Home Assistant 带到手机、手表和汽车上。Home Assistant Link 让你可以从任何地方访问它，而语音功能则从厨房里的卫星设备延伸到别处的语音引擎。

## Home Assistant 的运行方式

有两种受支持的 Home Assistant 运行方式，参见[安装类型](https://www.hasscn.top/contributors/os/installation-types/)：

- **Home Assistant OS**：专为 Home Assistant 打造的操作系统。[Supervisor](https://www.hasscn.top/contributors/architecture/platform/supervisor/) 运行 Core 和[应用](https://www.hasscn.top/contributors/apps/how-apps-work/)，各自运行在独立的容器中，并安装所有组件的更新，包括操作系统本身。推荐绝大多数用户使用。
- **Home Assistant Container**：运行在用户自行管理的系统上的容器化 Core。没有 Supervisor，也没有应用。

两者运行的是相同的 Core：Home Assistant OS 使用的镜像构建在 Home Assistant Container 所运行的同一容器镜像之上。你构建的几乎所有内容在两者中的工作方式都相同。

## 组成部分

- [Supervisor](https://www.hasscn.top/contributors/architecture/platform/supervisor/)：在 Home Assistant OS 上运行 Core、应用、备份和更新的组件。
- [Home Assistant OS](https://www.hasscn.top/contributors/os/operating-system/)：操作系统本身，它的构建方式，以及它如何安全地更新。
- [应用](https://www.hasscn.top/contributors/apps/how-apps-work/)：以容器形式运行在 Home Assistant 旁边的额外软件。
- [伴侣应用](https://www.hasscn.top/contributors/architecture/platform/companion-apps/)：Android 和 Apple 设备上的 Home Assistant。
- [Home Assistant Link](https://www.hasscn.top/contributors/architecture/platform/cloud/)：远程访问、语音助手等，无需开放你的家庭网络。
- [语音](https://www.hasscn.top/contributors/architecture/platform/voice/)：一句话如何变成一个动作。

## 参与贡献

- [你对 Supervisor 的首次贡献](https://www.hasscn.top/contributors/os/first-contribution/)，或对操作系统的贡献。
- 在应用（Apps）领域的[首次贡献](https://www.hasscn.top/contributors/apps/first-contribution/)：构建一个应用，或帮助完善官方应用。
- [你对伴侣应用的首次贡献](https://www.hasscn.top/contributors/companion/first-contribution/)：Android 或 Apple。
- 语音：在[语音翻译](https://www.hasscn.top/contributors/translate/voice/)中为你的语言编写句子，或在 Core 中参与 [Assist 管道](https://www.hasscn.top/contributors/core/internals/assist-pipelines/)的开发。
