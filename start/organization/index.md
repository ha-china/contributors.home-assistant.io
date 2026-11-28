# 项目是如何组织的

> 谁拥有 Home Assistant，谁为它出资，工作在哪里进行，以及由谁决定合并哪些内容。

Source: https://www.hasscn.top/contributors/start/organization/

Home Assistant 是一个开源项目，由一个非营利基金会拥有，并与贡献者社区共同构建。本页将解释这些组成部分如何相互配合，让你了解自己正在与谁合作。

## 开放之家基金会（Open Home Foundation）

Home Assistant 属于[开放之家基金会（Open Home Foundation）](https://www.openhomefoundation.org/)，这是一个非营利组织。Home Assistant 和其他项目于 2024 年移交给了该基金会。如今，基金会还拥有 ESPHome 和 Music Assistant 等项目。

基金会雇佣了 50 多名全职员工。他们在相同的代码仓库中工作，遵循相同的审查流程，并在与所有人相同的频道中交流。你会在代码审查中遇到他们，但他们远非唯一进行审查和合并的人。

基金会代表智能家居中的三个价值观：隐私、选择和可持续性。这些价值观体现在[我们的原则](https://www.hasscn.top/contributors/start/principles/)中。它的[结构页面](https://www.openhomefoundation.org/structure/)解释了基金会是如何治理和获得资助的。

## 商业合作伙伴

基金会的资金来自商业合作伙伴费用和捐赠。其目前的商业合作伙伴是 [Nabu Casa](https://www.nabucasa.com/) 和 Apollo Automation。根据合同要求，每家合作伙伴必须将其销售授权产品所得利润的大部分贡献给基金会。

Nabu Casa 是 Home Assistant 产品和服务的官方提供商，例如 Home Assistant Link：一项可选订阅服务，提供远程访问、Amazon Alexa 和 Google Assistant 支持，以及 Assist 的云端语音功能。

## 代码仓库

所有工作都在 GitHub 上公开进行，隶属于 [home-assistant](https://github.com/home-assistant) 组织。你早期会接触到的一些代码仓库：

- [core](https://github.com/home-assistant/core)：Home Assistant Core 以及所有内置集成（integration），使用 Python 编写。
- [frontend](https://github.com/home-assistant/frontend)：网页界面，使用 TypeScript 编写。
- [home-assistant.io](https://github.com/home-assistant/home-assistant.io)：用户文档。
- [android](https://github.com/home-assistant/android) 和 [iOS](https://github.com/home-assistant/iOS)：伴侣应用（companion apps）。
- [supervisor](https://github.com/home-assistant/supervisor) 和 [operating-system](https://github.com/home-assistant/operating-system)：负责安装、更新和运行一切的部分。
- [architecture](https://github.com/home-assistant/architecture)：关于 Home Assistant 构建方式的讨论和决策。

一些项目位于基金会的其他组织中，例如 [OHF-Voice](https://github.com/OHF-Voice/intents) 中的语音意图。[代码仓库](https://www.hasscn.top/contributors/architecture/repositories/)页面列出了所有仓库，并告诉你什么该去哪个仓库。

## 维护者、团队和集成负责人

任何人都可以提交 issue、拉取请求（pull request）或进行审查。由谁决定合并什么取决于具体的代码仓库：

- **维护者（Maintainers）**可以批准并合并拉取请求。每个代码仓库都有自己的维护者，通常以 GitHub 团队的形式组织，例如 Home Assistant Core 的 `@home-assistant/core`。
- **集成负责人（Integration owners）**负责某个集成。在 Home Assistant Core 中，每个集成都在其清单（manifest）的 `codeowners` 字段中列出其负责人。他们会收到该集成相关 issue 的通知，GitHub 也会请他们审查涉及该集成的拉取请求。
- **审查者（Reviewers）**可以是任何人。来自贡献者的细致审查能帮助维护者更快地做出决定。

更大的问题，比如新的实体（entity）类型或适用于所有集成的规则，会在 architecture 代码仓库中公开讨论。[架构决策是如何做出的](https://www.hasscn.top/contributors/architecture/decisions/)解释了其运作方式。

### CODEOWNERS 中的团队

`CODEOWNERS` 文件告诉 GitHub 应该请谁来审查。在 Home Assistant Core 和 [home-assistant.io](https://github.com/home-assistant/home-assistant.io) 中，它列出了人员以及 `home-assistant` 组织的几个 GitHub 团队：

- `@home-assistant/core`：核心文件，以及核心团队拥有的集成
- `@home-assistant/frontend`：`frontend`、`lovelace` 和 `panel_custom` 集成
- `@home-assistant/supervisor`：`hassio` 集成，以及构建容器镜像的文件
- `@home-assistant/cloud`：`cloud`、`alexa` 和 `google_assistant` 集成，位于 Home Assistant Link 背后
- `@home-assistant/matter`：`matter` 集成
- `@home-assistant/z-wave`：`zwave_js` 集成

少数集成由组织之外的团队拥有，例如某个制造商的团队。在 Core 中，`CODEOWNERS` 文件是根据集成的清单生成的，因此清单变化时它也会随之变化。

### 成为集成负责人

集成的负责人列在其 `manifest.json` 的 `codeowners` 字段中。要成为负责人，请提交一个拉取请求，将你的 GitHub 用户名添加到那里。如果之前曾为该集成做过贡献，会大有帮助。[集成负责人](https://www.hasscn.top/contributors/core/quality-scale/integration-owner/)解释了这一角色对你的要求，以及如何更新相关文件。

## 志愿者和员工

有两类人为 Home Assistant 工作：

- **员工（Staff）**受雇于开放之家基金会。基金会的资金来自其商业合作伙伴的费用和捐赠，用于支付他们的薪水。其[结构页面](https://www.openhomefoundation.org/structure/)有详细信息。
- **志愿者（Volunteers）**没有报酬。他们在空闲时间做出贡献，因为他们关心 Home Assistant。

两者都在相同的代码仓库中、按照相同的规则工作。大多数贡献者是志愿者。这塑造了项目的运作方式：审查可能需要一段时间，没有人欠任何人一次合并，耐心是双向的。这也意味着项目是由那些真正参与进来的人塑造的。如果你关心某件事，你就可以帮助它实现。

## 项目的未来方向

基金会公开规划较大的工作。其董事会制定[目标](https://github.com/OpenHomeFoundation/goals)。产品团队将一些功能请求转化为[路线图](https://github.com/OpenHomeFoundation/roadmap)上的机会（opportunity）：值得解决的问题，而不是一份带有日期的功能清单。机会通过相关工作所在的代码仓库中的史诗（epic）和任务来交付。

你可以通过[功能请求](https://github.com/home-assistant/feature-requests/discussions)施加影响：分享你的想法、投票并参与讨论。[从想法到发布](https://www.hasscn.top/contributors/roadmap/how-it-works/)介绍了每一个步骤，并展示了你可以在哪里参与进来。
