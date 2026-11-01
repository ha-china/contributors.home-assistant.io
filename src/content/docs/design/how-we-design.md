---
title: 我们如何进行设计
description: 设计工作在哪里进行，一个想法如何成为 Home Assistant 的一部分，由谁决定，以及研究如何塑造设计。
order: 2
---

Home Assistant 的设计工作在公开环境中进行。提案、反馈、研究和决策都是公开的，任何人都可以参与：设计师、研究员、撰稿人、无障碍专家和开发者。本页介绍这些工作在哪里进行，以及一个想法如何从最初的念头演变为人们每天使用的东西。

## 设计在哪里进行

### UX 设计讨论

[Open Home Foundation](/glossary/open-home-foundation/) 的 [UX 设计仓库](https://github.com/OpenHomeFoundation/ux-design) 是设计工作的家园，既服务于 Home Assistant，也服务于基金会的其他项目。它的[讨论区](https://github.com/OpenHomeFoundation/ux-design/discussions)是提案被分享、评审和决定的地方。请选择适合你内容的分类：

- **Ideation（构思）**：早期的想法、问题和可能的改进，尚无具体设计。
- **Design review（设计评审）**：你希望获得反馈的设计或进行中的工作。
- **Design system（设计系统）**：共享的组件、模式、令牌（token）和指南。
- **Accessibility（无障碍）**：包容性设计、无障碍问题和改进。
- **UX research and insights（UX 研究与洞察）**：用户研究、可用性发现、分析数据，以及支持设计决策的其他证据。
- **UX strategy and vision（UX 战略与愿景）**：整个基金会体验的长期方向。

[项目看板](https://github.com/orgs/OpenHomeFoundation/projects/7)列出了正在进行和已规划的设计任务。

### Discord

[Home Assistant Discord](https://www.home-assistant.io/join-chat-design) 上的 **#designers** 频道用于快速提问和早期反馈。产品和 UX 讨论在 **#product-and-ux** 中进行。看不到这些频道？请在 **Channels & Roles** 下选择合适的角色。

### Figma

Figma Community 上的 [Home Assistant Design Kit](https://www.figma.com/community/file/1697311104929761103/home-assistant-design-kit) 是 Home Assistant 界面的官方 Figma 库，由 Open Home Foundation 维护。它的变量、文本样式和组件都是从[前端](https://github.com/home-assistant/frontend)源码生成的，因此你设计的内容与发布的内容一致。它包含浅色和深色模式、本区域中记录的[组件](/design/components/)，以及每个组件的文档和源码链接的使用指南。基于它制作的模型与可构建的内容保持高度一致。

### 前端仓库

[前端仓库](https://github.com/home-assistant/frontend)是设计变成代码的地方。界面中的具体问题会作为那里的 issue 提出，并带有 [`UX`](https://github.com/home-assistant/frontend/labels/UX) 或 [`Accessibility`](https://github.com/home-assistant/frontend/labels/Accessibility) 标签。需要设计团队提供意见的拉取请求（pull request）会带有 [`Needs UX`](https://github.com/home-assistant/frontend/labels/Needs%20UX) 标签。

## 从想法到实现

设计工作遵循以下步骤：

1. **想法。** 有人注意到一个问题或产生一个想法。可以在 **Ideation** 分类中发起，或者查看项目看板上已规划的任务。
2. **讨论。** 想法在公开环境中讨论，并获得他人的反馈和研究支持。
3. **提案。** 一个具体的设计，附带模型或原型。尽早分享到 **Design review** 中并征求反馈。你不需要先完成设计才能开始。
4. **评审。** 设计师、开发者和用户对提案作出回应，提案根据他们的意见进行修改。
5. **决定。** 方向确定下来。重大决策会被总结，并链接到所属的看板条目。
6. **实现。** 设计被构建出来，通常在前端完成，同时更新本区域中对应的页面。讨论中会链接到实现它的拉取请求。

在设计新东西之前，请先查看[组件](/design/components/)和[模式](/design/patterns/)。一致性是良好设计的一部分。

## 撰写提案

**Design review** 分类中的提案通常遵循相同的大纲。可以从这个模板开始：

```markdown
## Problem

Who runs into it, when, and why it matters.

## Proposal

What you propose. Add mockups, a prototype, or a short video.
Explain the choices you made.

## Open questions

What you are unsure about, and want feedback on.

## Related

The board item, related discussions, and issues.
```

以问题为先。清晰的问题能让讨论保持聚焦，并且往往能让解决方案显而易见。如果存在对应的看板条目，请将你的讨论链接到它。

## 由谁决定

提案在 UX 设计讨论区中评审，设计的方向也是在那里确定的。重大决策会在那里被总结，并链接到所属的看板条目。

对于代码，由前端评审者决定。保持既有体验的修复通常由他们处理。而新的卡片、徽章、屏幕或交互模式既是代码变更，也是设计决策。当其方向尚未确定时，评审者会添加 `Needs UX` 标签并请设计团队提供意见。在编写代码之前先讨论较大的想法，可以避免返工。有关前端评审的工作方式，请参阅[评审与发布](/frontend/development/review-and-release/)。

### 组件在哪里定义

本网站的设计（Design）区域是设计指南的参考：[组件](/design/components/)的外观和行为、使用时机、规格以及无障碍特性。[基础（foundations）](/design/foundations/)、[模式](/design/patterns/)和[品牌](/brand/)也是如此。本区域取代了 design.home-assistant.io。

要修改一个组件：

1. 先在 **Design system** 分类中发起讨论，并在那里确定方向。
2. 在[前端仓库](https://github.com/home-assistant/frontend)中打开一个修改该组件的拉取请求。
3. 在[本网站](https://github.com/home-assistant/contributors.home-assistant.io)中打开一个更新该组件页面的拉取请求。

发现某个页面与组件不再一致？两者之一需要修复。在本网站上打开一个 issue 或拉取请求，如果不确定哪个是正确的，就发起一个讨论。

## 研究

研究让设计决策基于人们的实际行为，而不是 Home Assistant 构建者的假设。Open Home Foundation 的[用户研究仓库](https://github.com/OpenHomeFoundation/user-research)是这项工作的家园，也对社区研究者开放。

### 方法

- **用户测试。** 在配置菜单被重组为 **Settings** 之前，一个用 Figma 制作的原型在线测试了十天，包含六个问题和三个任务。任何人都可以参加，参与者通过[论坛](https://community.home-assistant.io/)、Reddit 和 Twitter 招募。915 人参与并留下了 407 条评论。结论包括添加搜索栏，以及将 **Configuration** 重命名为 **Settings**。
- **调查。** 2024 年社区调查收到了超过 8,600 份回复。匿名数据集和问题以[开放数据](https://github.com/OpenHomeFoundation/user-research/tree/main/community-survey24)的形式发布，采用 CC BY 4.0 许可，供任何人使用。
- **研究。** 该仓库还包含一项隐私研究，附有其论文和海报。

研究体现在产品中。例如，研究不断表明，人们打开仪表盘编辑器时，心中想的是某个设备或实体（entity），而不是某种卡片类型。这就是为什么现在添加卡片的对话框从你的设备和实体开始。

### 参与其中

基金会邀请社区参与研究，例如在[博客](https://www.home-assistant.io/blog/2024/12/16/community-survey-2024/)上公布的社区调查，以及在论坛和社交媒体上分享的用户测试。涉及参与者的研究遵循 Open Home Foundation 的[用户研究协议](https://www.openhomefoundation.org/user-research-agreement/)。

想自己开展或分析研究？请在 **UX research and insights** 分类中分享你的计划或发现，并查看[研究项目看板](https://github.com/OpenHomeFoundation/user-research/projects)。想与从事用户研究的人交流，请加入 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 **#user-researchers**。

## 我们为谁设计

每一个设计决策都会考虑[三类用户](/design/users/)：从其他智能家居平台成长过来的人、喜欢折腾的人，以及想要更多但需要帮助才能实现的人。
