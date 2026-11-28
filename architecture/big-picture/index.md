# 全局概览

> 在一页中展示 Home Assistant 的所有组成部分、各自的作用，以及它们之间如何通信。

Source: https://www.hasscn.top/contributors/architecture/big-picture/

Home Assistant 并不是一个单一的程序。它是由多个协同工作的部分组成的：位于核心的 Python 应用程序、一个网页界面、手机上的应用，以及在大多数安装中运行这一切的操作系统。本页展示每个组成部分及其连接方式，让本区域的其他内容有一个依托之处。

Diagram. All the pieces of Home Assistant, from top to bottom.

- Where people use it
  - [Frontend](https://www.hasscn.top/contributors/architecture/frontend/): In the browser and the apps
  - [Companion apps](https://www.hasscn.top/contributors/architecture/platform/companion-apps/): Android and Apple devices
  - [Voice](https://www.hasscn.top/contributors/architecture/platform/voice/): Satellites and Assist
  - [Other software](https://www.hasscn.top/contributors/architecture/connections/): Scripts, Alexa, Google
- They talk to Core through: [WebSocket API, REST API, webhooks](https://www.hasscn.top/contributors/architecture/connections/)
- [Home Assistant Core](https://www.hasscn.top/contributors/architecture/core/)
  - [Event loop](https://www.hasscn.top/contributors/core/internals/asyncio/): Runs everything
  - [States and events](https://www.hasscn.top/contributors/core/internals/states/): What is true, what happened
  - [Actions](https://www.hasscn.top/contributors/core/internals/actions/): What can be done
  - [Registries](https://www.hasscn.top/contributors/architecture/core/registries/): What it remembers
  - Automations: Triggers, conditions, actions
  - [Recorder](https://www.hasscn.top/contributors/architecture/core/history/): History and statistics
  - [Integrations](https://www.hasscn.top/contributors/core/integrations/): with entities, through Python libraries
- Core reaches what it connects to through: Local network, the internet, radios
- What it connects to
  - Devices: On the network, Bluetooth, USB
  - Protocols: Zigbee, Z-Wave, Matter, MQTT
  - Services: Weather, energy, AI
- On Home Assistant OS, it all runs on
  - [Home Assistant OS](https://www.hasscn.top/contributors/os/operating-system/): The operating system
  - [Supervisor](https://www.hasscn.top/contributors/architecture/platform/supervisor/): Runs and updates it all
  - [Apps](https://www.hasscn.top/contributors/apps/how-apps-work/): Software next to Core

## 核心：Home Assistant Core

[Home Assistant Core](https://www.hasscn.top/contributors/architecture/core/) 是一个 Python 应用程序，每种安装方式都会运行它。它了解家中每个设备的状态，运行自动化（automation），并保存历史记录。集成（integration）将它连接到设备和服务。

最重要的理念是：一切皆实体（entity）。一个集成将飞利浦 Hue 灯泡变成一个 light 实体，将温控器变成一个 climate 实体和几个传感器。从那时起，Home Assistant 的其余部分只与实体打交道，无论它们来自哪个品牌。

## 人们在哪里使用它

- **[前端（frontend）](https://www.hasscn.top/contributors/frontend/)** 是网页界面：仪表盘（dashboard）、设置、自动化编辑器。它在浏览器中运行，其文件由 Core 提供。[它在整体中的位置](https://www.hasscn.top/contributors/architecture/frontend/)解释了它与 Core 的关系。
- **[伴侣应用（companion apps）](https://www.hasscn.top/contributors/companion/)** 在手机、平板电脑和 Mac 上显示相同的前端，并从设备添加传感器、通知和小组件。请参阅[它们如何连接](https://www.hasscn.top/contributors/architecture/platform/companion-apps/)。
- **[语音（Voice）](https://www.hasscn.top/contributors/architecture/platform/voice/)** 将一句话转化为一个操作，可以来自厨房里的卫星设备，也可以来自手机。
- **其他软件**，如脚本、Amazon Alexa 和 Google Assistant，通过 Home Assistant 的 API 或 Home Assistant Link 与其通信。

它们都通过相同的 [API](https://www.hasscn.top/contributors/architecture/connections/) 与 Core 通信，并以相同的方式登录。

## 它连接什么

集成与外部世界通信：本地网络上的设备、Zigbee、Z-Wave、Thread 和 Bluetooth 等无线电，以及互联网上的服务。知道如何与特定设备通信的代码位于一个 Python 库中，集成会使用该库。更多信息请参阅[原则](https://www.hasscn.top/contributors/architecture/principles/)。

一些协议作为独立程序在 Core 旁边运行：用于 Z-Wave 的 Z-Wave JS、一个 MQTT broker，以及用于 Matter 的 Matter 服务器。集成与该程序通信。

## 什么在运行它

在推荐的安装方式 [Home Assistant OS](https://www.hasscn.top/contributors/os/operating-system/) 上，[Supervisor](https://www.hasscn.top/contributors/architecture/platform/supervisor/) 在容器中运行 Home Assistant Core，旁边是[应用（apps）](https://www.hasscn.top/contributors/apps/how-apps-work/)，例如 MQTT broker 或 Z-Wave JS。它会进行备份，并安装包括操作系统在内的一切更新。

使用 [Home Assistant Container](https://www.hasscn.top/contributors/os/installation-types/) 时，用户自己在容器中运行 Core，没有 Supervisor 和应用。

## 家门之外

来自 Nabu Casa 的 [Home Assistant Link](https://www.hasscn.top/contributors/architecture/platform/cloud/) 是可选的。它通过加密隧道让 Home Assistant 可以从任何地方访问，将其连接到 Alexa 和 Google Assistant，并为语音提供语音服务。

## 一个流程，从头到尾

你从仪表盘打开一盏灯：

1. 你选择了灯的卡片。前端通过 [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/) 为 `light.turn_on` 发送 `call_service`。
2. Core 检查你是否可以这样做，然后执行[操作（action）](https://www.hasscn.top/contributors/core/internals/actions/)：它在 light 实体上调用 `async_turn_on`。
3. 该实体（属于某个集成的一部分）通过其库告诉灯打开。
4. 灯报告它已打开。实体将其新状态写入[状态机（state machine）](https://www.hasscn.top/contributors/core/internals/states/)。
5. 状态机触发 `state_changed`。前端收到它，并在每个屏幕上将灯显示为已打开。记录器将其写入历史记录，任何等待它的自动化都会运行。

同样的路径也适用于自动化、语音命令或应用：只有第 1 步不同。

## 准备好贡献了吗？

本页上的每个部分在本站都有一个对应的区域，并有一个入门贡献供你开始：

- **Home Assistant Core 和集成**：[你对 Core 的第一个贡献](https://www.hasscn.top/contributors/core/first-contribution/)。
- **前端**：[你对前端的第一个贡献](https://www.hasscn.top/contributors/frontend/first-contribution/)。
- **伴侣应用**：[你对伴侣应用的第一个贡献](https://www.hasscn.top/contributors/companion/first-contribution/)。
- **语音**：[语音翻译](https://www.hasscn.top/contributors/translate/voice/)，用于 Assist 在你的语言中理解的句子。
- **Supervisor 和 Home Assistant OS**：[你对 Supervisor 的第一个贡献](https://www.hasscn.top/contributors/os/first-contribution/)。
- **应用**：在应用区域中的[你的第一个贡献](https://www.hasscn.top/contributors/apps/first-contribution/)。
- **Home Assistant Link**：`cloud` 集成是 Core 的一部分。

[架构概览](https://www.hasscn.top/contributors/architecture/#ready-to-contribute)包含完整的地图，包括设计、文档和翻译。
