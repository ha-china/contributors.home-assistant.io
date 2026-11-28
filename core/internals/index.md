# 核心的工作原理

> Home Assistant Core 的内部构造。包括 hass 对象、事件、状态、asyncio、身份认证、各类 API，以及语音和 AI 构建模块。

Source: https://www.hasscn.top/contributors/core/internals/

每个集成（integration）都与同一小组构建模块交互：事件总线、状态机、动作（action）注册表以及配置。它们都挂载在同一个对象 `hass` 上，并且都运行在同一个 asyncio 事件循环上。一旦你了解了这些模块的行为方式，核心的大部分就不再是魔法了。

本区域的这一部分面向以下开发者：想要了解集成内部发生了什么、参与核心本身的开发，或者构建从外部与 Home Assistant 通信的客户端。有关核心、前端、Supervisor 和操作系统如何协同配合的整体概览，请参阅[架构（Architecture）](https://www.hasscn.top/contributors/architecture/)区域。

## 从哪里开始

如果你刚接触核心，请先阅读以下三篇。它们解释了你在每个集成中都会遇到的内容：

1. [hass 对象](https://www.hasscn.top/contributors/core/internals/hass/)：`hass` 是什么，以及挂载在它上面的内容。
2. [Home Assistant 中的异步](https://www.hasscn.top/contributors/core/internals/asyncio/)：为什么几乎一切都是 `async`，以及在何处可以调用哪些函数。
3. [事件](https://www.hasscn.top/contributors/core/internals/events/)与[状态](https://www.hasscn.top/contributors/core/internals/states/)：事情如何发生，以及 Home Assistant 如何记住它们。

## 核心

- [hass 对象](https://www.hasscn.top/contributors/core/internals/hass/)：中心对象，以及 `hass.config` 上的核心配置。
- [事件](https://www.hasscn.top/contributors/core/internals/events/)：在事件总线上触发和监听事件。
- [状态](https://www.hasscn.top/contributors/core/internals/states/)：状态机和状态对象。
- [动作](https://www.hasscn.top/contributors/core/internals/actions/)：动作注册表、调用动作以及响应数据。

## 异步

- [Home Assistant 中的异步](https://www.hasscn.top/contributors/core/internals/asyncio/)：事件循环、协程、回调以及执行器。
- [线程安全](https://www.hasscn.top/contributors/core/internals/thread-safety/)：当你的代码在事件循环之外运行时应使用哪个 API。
- [阻塞操作](https://www.hasscn.top/contributors/core/internals/blocking-operations/)：将 I/O 排除在事件循环之外，包括导入操作。

## 身份认证

- [身份认证的工作原理](https://www.hasscn.top/contributors/core/internals/auth/)：用户、凭据、令牌、认证提供程序以及多因素模块。
- [权限](https://www.hasscn.top/contributors/core/internals/permissions/)：策略，以及在你的代码中检查它们。
- [身份认证 API](https://www.hasscn.top/contributors/core/internals/auth-api/)：让应用使用 OAuth 2 登录 Home Assistant 实例。

## API

- [REST API](https://www.hasscn.top/contributors/core/internals/rest-api/)：`/api/` 下的 HTTP 端点。
- [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/)：前端使用的 API，以及如何添加你自己的命令。
- [实例发现](https://www.hasscn.top/contributors/core/internals/instance-discovery/)：应用如何在网络上找到 Home Assistant。
- [Modbus 设备](https://www.hasscn.top/contributors/core/internals/modbus/)：用于 Modbus 设备的库，以及共享一个连接。
- [LoRaWAN 设备](https://www.hasscn.top/contributors/core/internals/lorawan/)：注册网络服务器，以及公开其上的设备。

## 语音与 AI

- [意图（intent）](https://www.hasscn.top/contributors/core/internals/intents/)：处理和触发意图。
- [内置意图](https://www.hasscn.top/contributors/core/internals/built-in-intents/)：Home Assistant 开箱即用即可处理的意图。
- [对话 API](https://www.hasscn.top/contributors/core/internals/conversation-api/)：向对话代理发送文本并读取响应。
- [Assist 流水线](https://www.hasscn.top/contributors/core/internals/assist-pipelines/)：通过 WebSocket API 运行语音转文本、意图识别和文本转语音。
- [LLM API](https://www.hasscn.top/contributors/core/internals/llm-api/)：向大型语言模型公开工具，以及构建你自己的 API。

想要构建对话代理、语音转文本提供程序或文本转语音提供程序？它们都是实体（entity），请参阅[对话](https://www.hasscn.top/contributors/core/entities/conversation/)、[语音转文本](https://www.hasscn.top/contributors/core/entities/stt/)和[文本转语音](https://www.hasscn.top/contributors/core/entities/tts/)。编写句子让 Assist 理解你的语言属于翻译工作：请参阅[翻译语音命令](https://www.hasscn.top/contributors/translate/voice/)。

## 与谁交流

- 对核心内部有技术问题？在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 [**#coding-support**](https://discord.com/channels/330944238910963714/1257019582112334014) 中发起讨论。
- 大部分语音工作，例如句子和唤醒词引擎，都在 GitHub 上的 [OHF-Voice](https://github.com/OHF-Voice) 组织中进行。集成本身，如 `conversation` 和 `assist_pipeline`，则位于核心中。
- 改变核心工作方式的提案始于[架构仓库](https://github.com/home-assistant/architecture/discussions)中的讨论。

## All pages in this section

### The core

- [Python 中的 hass 对象](https://www.hasscn.top/contributors/core/internals/hass/): 每个集成（integration）都会获得的 HomeAssistant 实例、它上面挂载了什么，以及 hass.config 上的核心配置。
- [事件总线](https://www.hasscn.top/contributors/core/internals/events/): 事件总线的工作原理、如何触发你自己的事件，以及如何在监听事件时不泄漏监听器。
- [状态](https://www.hasscn.top/contributors/core/internals/states/): 状态机如何保存每个实体的当前状态、状态对象包含哪些内容，以及为什么集成要通过实体来写入状态。
- [动作注册表](https://www.hasscn.top/contributors/core/internals/actions/): 动作注册表（action registry）的底层工作原理、动作处理程序会接收到什么，以及如何从代码中调用动作。

### Async

- [Home Assistant 中的异步](https://www.hasscn.top/contributors/core/internals/asyncio/): 为什么 Home Assistant 运行在单个 asyncio 事件循环上、你所编写的函数有哪些类型，以及如何将工作移入和移出事件循环。
- [线程安全](https://www.hasscn.top/contributors/core/internals/thread-safety/): 当代码在事件循环（event loop）之外运行时应调用哪个 API，以及如何修复 Home Assistant 报告的线程安全错误。
- [阻塞操作](https://www.hasscn.top/contributors/core/internals/blocking-operations/): 如何避免阻塞 I/O 和缓慢的导入进入事件循环，以及如何修复 Home Assistant 报告的阻塞调用。

### Authentication

- [身份验证的工作原理](https://www.hasscn.top/contributors/core/internals/auth/): Home Assistant 中的用户、用户组、凭据和令牌，以及用于验证用户身份的身份验证提供程序和多因素模块。
- [权限](https://www.hasscn.top/contributors/core/internals/permissions/): 权限策略的结构与合并方式，以及如何在动作、HTTP 视图和 WebSocket 命令中检查权限。
- [认证 API](https://www.hasscn.top/contributors/core/internals/auth-api/): 应用如何使用 OAuth 2 登录 Home Assistant 实例、刷新和撤销令牌，以及发起经过身份验证的请求。

### APIs

- [REST API](https://www.hasscn.top/contributors/core/internals/rest-api/): `/api/` 下的 HTTP 端点，用于读取状态、调用动作、触发事件和渲染模板，并列出每个端点所需的权限。
- [WebSocket API](https://www.hasscn.top/contributors/core/internals/websocket-api/): 前端使用的 API。介绍连接的工作方式、核心命令、错误处理，以及如何从集成中添加你自己的命令。
- [实例发现](https://www.hasscn.top/contributors/core/internals/instance-discovery/): Home Assistant 如何使用 Zeroconf 在本地网络上宣布自己的存在，使应用程序无需用户输入地址即可找到它。
- [Modbus 设备](https://www.hasscn.top/contributors/core/internals/modbus/): 如何使用 modbus-connection 为 Modbus 设备编写库，以及您的集成如何与其他集成共享同一个 Modbus 连接。
- [LoRaWAN 设备](https://www.hasscn.top/contributors/core/internals/lorawan/): 连接集成如何注册 LoRaWAN 网络服务器，以及设备集成如何查找并公开其上的设备。

### Voice and AI

- [意图](https://www.hasscn.top/contributors/core/internals/intents/): 什么是意图（intent）、集成如何处理意图，以及如何从代码或通过 HTTP 触发一个意图。
- [内置意图处理器](https://www.hasscn.top/contributors/core/internals/built-in-intents/): Home Assistant 自带意图的处理器位于 Core 中的何处、它们如何找到实体，以及在哪里可以查询每个意图及其槽位。
- [对话 API](https://www.hasscn.top/contributors/core/internals/conversation-api/): 通过 REST 或 WebSocket API 向对话代理发送文本，并读取其返回的响应。
- [Assist 管道](https://www.hasscn.top/contributors/core/internals/assist-pipelines/): 语音如何在 Home Assistant 中流转，以及如何通过 WebSocket API 运行 Assist 管道、向其流式传输音频并跟踪其事件。
- [LLM API](https://www.hasscn.top/contributors/core/internals/llm-api/): 大型语言模型（LLM）在获得工具之后，能做的远不止聊天。Home Assistant 中的 LLM API 是一组工具，外加一段解释如何使用这些工具的提示词。封装语言模型的对话代理（conversation agent）会把用户所选 API 的工具交给模型，并执行模型调用的工具。
