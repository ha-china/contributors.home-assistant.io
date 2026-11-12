---
title: 核心的工作原理
description: Home Assistant Core 的内部构造。包括 hass 对象、事件、状态、asyncio、身份认证、各类 API，以及语音和 AI 构建模块。
order: 40
sidebarGroups:
  - The core
  - Async
  - Authentication
  - APIs
  - Voice and AI
---

每个集成（integration）都与同一小组构建模块交互：事件总线、状态机、动作（action）注册表以及配置。它们都挂载在同一个对象 `hass` 上，并且都运行在同一个 asyncio 事件循环上。一旦你了解了这些模块的行为方式，核心的大部分就不再是魔法了。

本区域的这一部分面向以下开发者：想要了解集成内部发生了什么、参与核心本身的开发，或者构建从外部与 Home Assistant 通信的客户端。有关核心、前端、Supervisor 和操作系统如何协同配合的整体概览，请参阅[架构（Architecture）](/architecture/)区域。

## 从哪里开始

如果你刚接触核心，请先阅读以下三篇。它们解释了你在每个集成中都会遇到的内容：

1. [hass 对象](/core/internals/hass/)：`hass` 是什么，以及挂载在它上面的内容。
2. [Home Assistant 中的异步](/core/internals/asyncio/)：为什么几乎一切都是 `async`，以及在何处可以调用哪些函数。
3. [事件](/core/internals/events/)与[状态](/core/internals/states/)：事情如何发生，以及 Home Assistant 如何记住它们。

## 核心

- [hass 对象](/core/internals/hass/)：中心对象，以及 `hass.config` 上的核心配置。
- [事件](/core/internals/events/)：在事件总线上触发和监听事件。
- [状态](/core/internals/states/)：状态机和状态对象。
- [动作](/core/internals/actions/)：动作注册表、调用动作以及响应数据。

## 异步

- [Home Assistant 中的异步](/core/internals/asyncio/)：事件循环、协程、回调以及执行器。
- [线程安全](/core/internals/thread-safety/)：当你的代码在事件循环之外运行时应使用哪个 API。
- [阻塞操作](/core/internals/blocking-operations/)：将 I/O 排除在事件循环之外，包括导入操作。

## 身份认证

- [身份认证的工作原理](/core/internals/auth/)：用户、凭据、令牌、认证提供程序以及多因素模块。
- [权限](/core/internals/permissions/)：策略，以及在你的代码中检查它们。
- [身份认证 API](/core/internals/auth-api/)：让应用使用 OAuth 2 登录 Home Assistant 实例。

## API

- [REST API](/core/internals/rest-api/)：`/api/` 下的 HTTP 端点。
- [WebSocket API](/core/internals/websocket-api/)：前端使用的 API，以及如何添加你自己的命令。
- [实例发现](/core/internals/instance-discovery/)：应用如何在网络上找到 Home Assistant。
- [Modbus 设备](/core/internals/modbus/)：用于 Modbus 设备的库，以及共享一个连接。
- [LoRaWAN 设备](/core/internals/lorawan/)：注册网络服务器，以及公开其上的设备。

## 语音与 AI

- [意图（intent）](/core/internals/intents/)：处理和触发意图。
- [内置意图](/core/internals/built-in-intents/)：Home Assistant 开箱即用即可处理的意图。
- [对话 API](/core/internals/conversation-api/)：向对话代理发送文本并读取响应。
- [Assist 流水线](/core/internals/assist-pipelines/)：通过 WebSocket API 运行语音转文本、意图识别和文本转语音。
- [LLM API](/core/internals/llm-api/)：向大型语言模型公开工具，以及构建你自己的 API。

想要构建对话代理、语音转文本提供程序或文本转语音提供程序？它们都是实体（entity），请参阅[对话](/core/entities/conversation/)、[语音转文本](/core/entities/stt/)和[文本转语音](/core/entities/tts/)。编写句子让 Assist 理解你的语言属于翻译工作：请参阅[翻译语音命令](/translate/voice/)。

## 与谁交流

- Have a technical question about core internals? Start a thread in **#coding-support** on the [Home Assistant Discord](https://www.home-assistant.io/join-chat/).
- Much of the voice work, like the sentences and the wake word engines, happens in the [OHF-Voice](https://github.com/OHF-Voice) organization on GitHub. The integrations themselves, like `conversation` and `assist_pipeline`, live in core.
- Proposals to change how core works start as a discussion in the [architecture repository](https://github.com/home-assistant/architecture/discussions).
