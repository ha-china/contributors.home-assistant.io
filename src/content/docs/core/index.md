---
title: 核心与集成
description: Python、核心与集成平台。构建和改进集成、参与 Home Assistant Core 本身开发所需的一切。
---

Home Assistant Core 是每个 Home Assistant 安装的核心 Python 应用程序。它运行着状态机、事件总线、自动化，以及将 Home Assistant 与设备和服务连接起来的数千个集成。所有这些都存放在同一个代码仓库中：[home-assistant/core](https://github.com/home-assistant/core)。

对核心的大多数贡献都与[集成](/glossary/integration/)（integration）有关：为一种新设备添加支持、修复现有设备中的缺陷，或者将集成提升到更高的质量水平。有些贡献则更为深入，涉及每个集成所依赖的辅助元素（helper）和 API。

如果你编写 Python，或者想要编写 Python，这个板块就是为你准备的。你不需要了解整个代码库。大多数人从自己在家里使用的一个集成入手，然后逐步深入。

## 你可以参与的工作

- **修复缺陷**：在你使用的集成中认领一个 issue，复现它，然后修复它。
- **改进集成**：添加测试、添加类型注解（type hints），或者朝着[集成质量标准](/core/quality-scale/)的下一个等级努力。
- **添加集成**：让 Home Assistant 连接到它尚不支持的设备或服务。
- **审查**：测试并审查他人的拉取请求（pull request）。这是你能做的最有价值的事情之一。

## 从这里开始

选择与你想要做的事情相匹配的路径：

1. **先修复一个小问题。** 从未为核心做过贡献？从[你的第一次贡献](/core/first-contribution/)开始：搭建好你的环境，修复一个小缺陷，然后提交你的第一个拉取请求。一个小修复能让你了解整个流程，即使你以后想构建集成，这也会有所帮助。
2. **构建一个新的集成。** 阅读[集成如何融入核心](/core/integrations/concepts/)，然后按照[教程](/core/integrations/tutorial/)操作。该教程会从脚手架（scaffold）开始构建一个小型集成，直到提交一个符合 Bronze 等级的拉取请求。对于你自己的设备或服务，项目建议从 [Marketplace](/marketplace/) 入手：参见[它是否属于核心](/core/integrations/create/#does-it-belong-in-core)。

然后将本板块的其余内容作为你的参考：[开发工作流](/core/development/)介绍了相关工具和拉取请求流程，下面的指南则涵盖其他所有内容。

## 指南与参考

- [构建集成](/core/integrations/)：集成的文件构成、配置流程（config flow）、数据获取，以及构成集成的其他所有内容。
- [实体与平台](/core/entities/)：传感器、灯光、温控设备以及所有其他实体（entity）类型，以及每种类型支持的属性和功能。
- [集成质量标准](/core/quality-scale/)：描述集成质量优劣的等级和规则，以及审查者所关注的内容。
- [核心的工作原理](/core/internals/)：asyncio、`hass` 对象、事件、状态、身份验证、API、意图（intent）以及 LLM 支持。

## 相关板块

- [翻译](/translate/guides/developers/)：如何在 `strings.json` 中编写翻译人员可以处理的字符串。
- [编写文档](/writing/)：每个集成都会在 [home-assistant.io](https://www.home-assistant.io/) 上有一个页面，你需要随代码一起编写它。
- [前端](/frontend/)：当你的更改需要在界面中添加新内容时。
- [架构](/architecture/)：Home Assistant 构建方式背后的决策。
- [Marketplace](/marketplace/)：发布自定义集成，让其他人可以从 Marketplace 安装它。

## 与谁交流

- On the [Home Assistant Discord](https://www.home-assistant.io/join-chat/), general development questions, like whether an integration belongs in core, fit **#developers**. For a technical question, start a thread in **#coding-support**. The **#core** channel is where the core team discusses Core itself, not the place for questions. Can't see the channels? Under **Channels & Roles**, choose **I want to contribute dev skills to Home Assistant**.
- Bugs and pull requests live in the [core repository](https://github.com/home-assistant/core). Feature ideas go to [GitHub discussions](https://github.com/orgs/home-assistant/discussions).
- Bigger changes to how core works are discussed in the [architecture repository](https://github.com/home-assistant/architecture/discussions) first.

当你寻求帮助时，请将你的工作推送到一个分支并分享链接。当人们能够看到代码时，他们能更快地为你提供帮助，而且链接也能保持频道整洁易读。
