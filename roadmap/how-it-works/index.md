# 从想法到发布

> Home Assistant 的较大工作如何在公开环境中规划：从功能请求到路线图机遇（opportunity）、史诗（epic）、任务和拉取请求，以及你在整个过程中可以在哪里参与。

Source: https://www.hasscn.top/contributors/roadmap/how-it-works/

Home Assistant 的很多工作完全不需要计划。修复一个 bug、改进一个集成（integration），或者一个[符合进入核心条件](https://www.hasscn.top/contributors/core/integrations/create/#does-it-belong-in-core)的新集成：你打开一个拉取请求（pull request），就完成了。[拉取请求与评审](https://www.hasscn.top/contributors/start/pull-requests/)介绍了这条路径。

较大的工作则不同。当某项工作跨越多个代码仓库、需要设计，或者改变 Home Assistant 的构建方式时，[Open Home Foundation](https://www.hasscn.top/contributors/glossary/open-home-foundation/) 会在 GitHub 上的公开仓库中分层规划。本页将逐一介绍这些层级，说明每一层所在的位置，以及你可以在哪里跟进或参与。最后，我们会追踪一项真实的工作，从最初的功能请求一直到发布它的那个版本。

## 各层级一览

Diagram. 从上到下：每一层都被拆解为下一层。在 GitHub 上，机遇、史诗和任务以子议题（sub-issue）的形式相互关联，因此你可以沿着链接上下追踪。

- 目标：基金会想要前进的方向
  - [目标](https://github.com/OpenHomeFoundation/goals): 由董事会制定
- 机遇：值得解决的问题
  - [功能请求](https://github.com/home-assistant/feature-requests/discussions): 来自任何人的想法和投票
  - [路线图](https://github.com/OpenHomeFoundation/roadmap): 由产品团队塑造的机遇
- 史诗：一项工作整体，通常是一个机遇的一个阶段
  - [史诗](https://github.com/home-assistant/epics): 交付成果和完成标准
- 任务：单个代码仓库中的一项工作
  - [Core](https://github.com/home-assistant/core): Python 和集成
  - [Frontend](https://github.com/home-assistant/frontend): 用户界面
  - [Documentation](https://github.com/home-assistant/home-assistant.io): home-assistant.io
  - [Tasks](https://github.com/home-assistant/tasks): 不适合放在其他地方的工作
- 交付
  - [拉取请求](https://www.hasscn.top/contributors/start/pull-requests/): 与其他贡献一样接受评审
  - [发布](https://www.hasscn.top/contributors/releases/how-it-works/): 每月一次

除了这些层级之外（而不是在其中），还有[架构](https://www.hasscn.top/contributors/roadmap/how-it-works/#alongside-the-roadmap-architecture)。它守护 Home Assistant 的构建方式，适用于所有进入项目的内容，无论它是否来自路线图。

## 目标

最顶层是 Open Home Foundation 的目标，位于[目标仓库](https://github.com/OpenHomeFoundation/goals)。它们由基金会董事会制定，定义了基金会想要前进的方向。例如[让 Home Assistant 更容易上手](https://github.com/OpenHomeFoundation/goals/issues/7)和[Proxy all the things](https://github.com/OpenHomeFoundation/goals/issues/4)。董事会也维护这些目标，每个目标都链接到为之努力的路线图机遇。

只有基金会成员可以撰写目标，但讨论是公开的：你可以在目标下评论并分享你的看法。

## 功能请求

大多数想法都始于一个[功能请求](https://github.com/home-assistant/feature-requests/discussions)。任何人都可以发起、投票或参与讨论。请描述你想解决的问题，而不仅仅是你想到的解决方案。[我们的交流场所](https://www.hasscn.top/contributors/start/where-we-talk/#feature-requests)中有更多关于如何写好功能请求的内容。

基金会的产品团队会定期评审热门和具有战略意义的请求，并将其中一些转化为路线图机遇。投票和有深度的讨论都很重要，但并非每个请求都能进入路线图。

## 路线图机遇

Open Home Foundation 的[路线图](https://github.com/OpenHomeFoundation/roadmap)涵盖 Home Assistant、ESPHome、Music Assistant 以及基金会的其他项目。它不是一份带日期的功能清单，而是一组[机遇（opportunity）](https://www.hasscn.top/contributors/glossary/opportunity/)：值得解决的问题。每个机遇都是一个议题（issue），并链接到它所支持的目标。

一个机遇可以始于一个粗略的想法，并随着时间逐渐成形。它的议题中包含以下内容：

- **问题陈述**：问题是什么、谁受影响、为什么重要
- **社区信号**：指向该问题的功能请求、讨论或 Discord 帖子
- **范围与边界**：哪些在范围内，哪些明确排除在外
- **预期解决方案**：足够清晰的解决方案，让人理解构建它意味着什么
- **风险与未决问题**：还有哪些不确定之处
- **投入度（appetite）**：这个机遇值得投入多少时间，大致分为小、中、大
- **执行议题**：一旦获批，链接到具体工作
- **决策日志**：关键决策和转向，附有日期

一个大型机遇下面可以有更小的机遇。例如，[围绕家庭使用智能家居的方式塑造 UI](https://github.com/OpenHomeFoundation/roadmap/issues/129) 就包含多个更聚焦的机遇。

**谁可以参与：**只有基金会员工和授权贡献者可以创建机遇。其他人打开的议题会被自动关闭。评论对所有人开放，而且很重要：评论可以补充信号、质疑范围，或改变解决方案，正如下面的[示例](https://www.hasscn.top/contributors/roadmap/how-it-works/#example-better-sun-triggers)所示。

**机遇如何被选中：**模板的决策日志中提到了“投注表（betting table）”的结果，机遇就是在其中被选中进行开发的。其具体运作方式以及参与者，在公开仓库中没有说明。

**跟进进展：**[路线图项目看板](https://ohf.to/roadmap)展示活跃的机遇及其进展，你也可以在 GitHub 上关注[路线图仓库](https://github.com/OpenHomeFoundation/roadmap)。Home Assistant 博客的[路线图分类](https://www.home-assistant.io/blog/categories/roadmap/)提供更宏观的视角，最新的一篇是 2025 年 5 月的 [Roadmap 2025](https://www.home-assistant.io/blog/2025/05/09/roadmap-2025h1/)。当工作交付时，发布说明通常会链接相应的机遇，例如 [2026.6](https://www.home-assistant.io/blog/2026/06/03/release-20266/) 在关闭让红外成为双向平台的机遇时就是这样做的。

需要设计的工作会经过基金会的 [UX 设计讨论](https://github.com/OpenHomeFoundation/ux-design/discussions)。[我们的设计方式](https://www.hasscn.top/contributors/design/how-we-design/)介绍了这条路径。

## 史诗

[史诗（epic）](https://www.hasscn.top/contributors/glossary/epic/)是由多个任务组成的较大工作整体，通常跨越多个仓库。史诗位于[史诗仓库](https://github.com/home-assistant/epics)。每个史诗都会说明：

- 它所交付的路线图机遇
- 它解决的问题和期望达成的结果
- 它的交付成果
- 何时算作完成
- 相关背景，例如配套的功能请求、设计文档或 Discord 频道

史诗是其机遇的子议题。史诗之间也可以相互阻塞，GitHub 会在议题的侧边栏中显示这一点。

### 阶段

一个机遇通常分阶段交付，每个阶段都有自己的史诗。例如，[通过 UI 配置 HTTP 服务器](https://github.com/OpenHomeFoundation/roadmap/issues/47)有[阶段 1：默认端口和 UI](https://github.com/home-assistant/epics/issues/48)，已完成；以及[阶段 2：UI 中的 SSL/TLS 和双栈](https://github.com/home-assistant/epics/issues/118)，正在进行中。阶段 3 列在阶段 2 中，但还没有史诗。

后面的阶段可能只是一个计划而非承诺。[让 Home Assistant OS 更容易安装的阶段 3](https://github.com/home-assistant/epics/issues/135) 的史诗自己就这样说明：其范围是一个计划，不是承诺，条目可能会在阶段之间移动或被放弃。

### 路线图之外的史诗

并非每个史诗都来自机遇。有些是跨多个集成的清理工作，例如[使用通用的 `OSError` 辅助函数转换文件系统错误](https://github.com/home-assistant/epics/issues/142)。它们解释正确的模式，列出需要修复的集成，并要求你在拉取请求中引用该史诗。如果你正在 Home Assistant Core 中寻找一项定义清晰的工作，这些是很好的去处。

**谁可以参与：**GitHub 上 home-assistant 组织的成员可以创建史诗。其他人打开的议题会被自动关闭。阅读和跟进对所有人开放。

## 任务

任务是单个仓库中较小的一项工作。它是类型为 **Task** 的议题，位于工作所在的仓库中：Home Assistant Core、前端、文档、Supervisor 或其他任何仓库。每个任务都是其史诗的子议题，因此史诗可以显示工作的进展程度。

不适合放在任何仓库的工作会进入[任务仓库](https://github.com/home-assistant/tasks)。只有 home-assistant 组织的成员可以在那里打开议题。

**谁可以参与：**并非所有人都能打开任务。在大多数仓库中，一个工作流会检查每个类型为 **Task** 的新议题：如果你不是 GitHub 上 home-assistant 组织的成员，它会关闭该议题，加上 `auto-closed` 标签，并留下一条评论，指引你前往 bug 报告表单和功能请求。Home Assistant Core 和 home-assistant.io 也接受仓库 `CODEOWNERS` 文件中列出的人（如集成所有者）提交的任务。任务一旦存在，就是一个普通议题：你可以评论、提问或主动提供帮助。想参与某项任务？开始之前先在任务上说明，以免有人重复做同样的工作。

## 拉取请求

工作本身在拉取请求中进行，与其他贡献一样。在描述中链接任务，例如使用 `fixes #12345`，这样拉取请求合并时任务会自动关闭。新功能的文档提交到 home-assistant.io 的 `next` 分支，以便随发布一起上线。评审流程与其他所有拉取请求相同：参见[拉取请求与评审](https://www.hasscn.top/contributors/start/pull-requests/)。

**谁可以参与：**所有人。打开拉取请求和评审拉取请求对所有贡献者开放。

## 发布

合并的工作会随下一个每月发布交付。发布前一周，它处于 beta 阶段，任何人都可以在自己的家中测试。[发布的工作原理](https://www.hasscn.top/contributors/releases/how-it-works/)介绍了这个周期，[你的第一次发布贡献](https://www.hasscn.top/contributors/releases/first-contribution/)展示了如何参与 beta。

## 路线图之外：架构

架构会议守护 Home Assistant 的技术架构。它不是路线图流程中的一个步骤：它位于流程旁边，负责照看技术。任何改变 Home Assistant 构建方式的变更都需要它的批准，无论变更来自哪里：一个机遇、一个史诗，还是你自己的一个拉取请求。比如一种新的实体（entity）类型、对实体模型的更改，或者为实体组件新增的触发器（trigger）和条件（condition）。

会议处理提案，提案是[架构仓库](https://github.com/home-assistant/architecture)中的讨论。

当路线图工作涉及架构时，两者会相互链接。一个机遇可以引发一个[架构讨论](https://github.com/home-assistant/architecture/discussions)，该讨论会链接回机遇，作为推理过程所在之处。机遇也可以建立在已有的架构讨论之上，例如[让 Home Assistant 发送射频命令](https://github.com/OpenHomeFoundation/roadmap/issues/102)的机遇。

提案公开讨论，然后在会议上做出决定。结果会发布在讨论中并标记为其答案：批准或拒绝，附上会议日期和任何备注，例如会议希望做出的修改。为整个项目设定长期规则的决策还会被记录为架构决策记录（Architecture Decision Record）。[架构决策是如何做出的](https://www.hasscn.top/contributors/architecture/decisions/)介绍了这一流程。

**谁可以参与：**任何人都可以发起或参与架构讨论。


## 你可以在哪里参与

| 层级 | 位置 | 你可以做什么 |
| --- | --- | --- |
| 目标 | [OpenHomeFoundation/goals](https://github.com/OpenHomeFoundation/goals) | 阅读和评论 |
| 功能请求 | [功能请求](https://github.com/home-assistant/feature-requests/discussions) | 提议、投票和讨论 |
| 机遇 | [OpenHomeFoundation/roadmap](https://github.com/OpenHomeFoundation/roadmap) 和[项目看板](https://ohf.to/roadmap) | 跟进和评论 |
| 架构 | [架构讨论](https://github.com/home-assistant/architecture/discussions) | 发起讨论或参与讨论 |
| 设计 | [UX 设计讨论](https://github.com/OpenHomeFoundation/ux-design/discussions) | 分享想法和提供反馈 |
| 史诗 | [home-assistant/epics](https://github.com/home-assistant/epics) | 跟进，并从清理类史诗中认领工作 |
| 任务 | 工作所在的仓库 | 评论，并主动提供帮助 |
| 拉取请求 | 工作所在的仓库 | 打开和评审拉取请求 |
| 发布 | [beta](https://www.hasscn.top/contributors/releases/first-contribution/) | 测试，并报告问题 |

## 示例：更好的太阳触发器

下面是一项工作从开始到结束的完整追踪。它让太阳[触发器](https://www.hasscn.top/contributors/glossary/trigger/)和[条件](https://www.hasscn.top/contributors/glossary/condition/)基于太阳的实际位置工作，而不是围绕日出和日落的固定时间偏移。

1. **功能请求。**2026 年 3 月，一位用户在日出和日落之外，请求增加[黎明和黄昏触发器](https://github.com/home-assistant/feature-requests/discussions/3043)。
2. **机遇。**2026 年 4 月，机遇[改进基于太阳的触发器和条件](https://github.com/OpenHomeFoundation/roadmap/issues/96)被创建，该请求作为其社区信号。它描述了问题（在春季匹配黄昏的偏移量在冬季是错误的，在北极圈以上则毫无用处），提出了一套基于太阳高度的完整触发器和条件，并设定了较小的投入度。在评论中，社区成员补充了信号，并质疑了排除时间偏移的选择。
3. **架构。**一位维护者指出，为实体组件新增触发器和条件需要架构批准。于是 2026 年 5 月开启了[架构讨论](https://github.com/home-assistant/architecture/discussions/1394)，并链接回该机遇。架构会议首先要求修改，例如用一个带类型选项的黎明触发器代替三个独立的触发器。2026 年 6 月，会议批准了修订后的提案。
4. **首次发布。**高优先级的触发器和条件在 [core#174485](https://github.com/home-assistant/core/pull/174485) 和 [core#174537](https://github.com/home-assistant/core/pull/174537) 中构建，并随 [2026.7](https://www.home-assistant.io/blog/2026/07/01/release-20267/) 发布。
5. **史诗和任务。**2026 年 7 月，在首次发布之后，史诗[改进基于太阳的触发器和条件](https://github.com/home-assistant/epics/issues/112)在该机遇下被创建，包含两个仓库中的任务：刚刚交付的工作、[时间偏移](https://github.com/home-assistant/core/issues/175828)、[其余的触发器和条件](https://github.com/home-assistant/core/issues/175830)，以及[文档](https://github.com/home-assistant/home-assistant.io/issues/46939)。
6. **反馈改变了计划。**2026.7 发布后，Discord 上和机遇评论中的人们要求加入时间偏移。这需要单独的[架构讨论](https://github.com/home-assistant/architecture/discussions/1430)，于 7 月底在核心会议上获得批准。[拉取请求](https://github.com/home-assistant/core/pull/176967)在第二天合并，并随 [2026.8](https://www.home-assistant.io/blog/2026/08/05/release-20268/) 发布。
7. **最后一次发布。**黄金时刻、蓝色时刻、极昼和极夜在 [core#180106](https://github.com/home-assistant/core/pull/180106) 中实现，在 [home-assistant.io#47624](https://github.com/home-assistant/home-assistant.io/pull/47624) 中记录文档，并随 [2026.9](https://www.home-assistant.io/blog/2026/09/02/release-20269/#golden-hour-blue-hour-and-polar-sun-automations) 发布。
8. **关闭。**史诗于 2026 年 9 月关闭，机遇在一周半后关闭。一个后续任务，[基于太阳方位角的触发器和条件](https://github.com/home-assistant/core/issues/181914)，仍然处于打开状态。

有几点值得注意。这项工作始于一个只有十几个投票的功能请求。社区的评论改变了最终构建的内容。架构决策先于代码，而后续的更改也需要单独的决策。而且实际的顺序比层级所暗示的更混乱：在这个例子中，史诗是在第一部分已经发布之后才创建的。

## 找谁交流

- 关于机遇或史诗的问题？在该议题的评论中提问，这样正在做这项工作的人才能看到。
- 关于某个变更架构的问题？使用[架构讨论](https://github.com/home-assistant/architecture/discussions)，或在 [Discord](https://www.home-assistant.io/join-chat/) 的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道提问。
- 不确定你的想法属于哪里？先从[功能请求](https://github.com/home-assistant/feature-requests/discussions)开始。
