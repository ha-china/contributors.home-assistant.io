---
title: 作为贡献者成长
description: 第一次拉取请求之后是什么。审查、分类问题、负责一个集成、承担角色，以及这一切能通向哪里。
sidebarLabel: 作为贡献者成长
order: 4.5
---

你的第一个贡献已合并。然后呢？本页展示了人们在那之后走过的路径，大致按大多数人走的顺序排列。你不必走完所有路径，也没有终点线。很多人多年来只把一件事做好，就一直在做贡献。

每一步都说明它意味着什么、需要什么、以及如何达到。如果某件事在任何地方都没有书面说明，本页会如实说明，而不是猜测。

## 1. 成为常客

成长最简单的方式就是持续出现。在同一部分项目中提交第二、第三个拉取请求（pull request）比第一个让你学到更多，审查它们的人也开始记住你的名字。

不过，让 Home Assistant 持续运转的大部分工作并不是编写新东西，而是帮助已经存在的人和变更。这正是常客发挥最大作用的地方。

### 审查拉取请求

拉取请求比审查者多。你给出的每一次审查都能让维护者的最终审查更快完成。审查不需要任何权限：任何人都可以在拉取请求上评论、测试或批准它。

Core 和前端的拉取请求模板要求你在打开自己的拉取请求时，审查同一仓库中另外两个打开的拉取请求。它们还链接到一个搜索尚未有审查的拉取请求的入口。这是一个很好的起点。

什么是有用的审查：

- 用你自己的设备或环境测试变更，并说明你的发现。“我在我的设备上试过，可以正常工作”就很有帮助。
- 检查基本项：模板是否填写完整、检查是否通过、它是否只做一件事？
- 当有不清楚的地方时提出问题。如果你不理解它，下一个人也不会理解。

各仓库的详细信息，请参阅 [Core 中审查拉取请求](/core/development/reviewing/) 和 [前端中的审查与发布](/frontend/development/review-and-release/)。总体流程见 [拉取请求与审查](/start/pull-requests/)。

### 协助处理问题

错误报告堆积得很快。很多缺少日志、版本号或复现步骤。你不需要任何特殊权限就能帮忙：

- 在你自己的安装上尝试复现错误，并评论发生了什么。
- 友善地询问缺失的细节。[报告错误](/start/report-a-bug/) 列出了每个仓库的表单要求填写的内容。
- 发现重复问题时指出来。
- 确认旧错误在最新版本上是否仍然存在，以免它被搁置。

设置标签或关闭问题需要 GitHub 权限，大多数贡献者没有这些权限。你会看到用于此目的的标签包括 Core 和 [home-assistant.io](https://github.com/home-assistant/home-assistant.io) 上的 `needs-more-information`、前端的 `needs more information`，以及 Core 中的 `waiting-for-reply`。

想找点自己能修复的东西？一些仓库会用 `good first issue` 或 `help-wanted` 标记问题，其中包括 Core、前端和 home-assistant.io。并非每个仓库都使用这些标签，而且任意时刻带有这些标签的问题数量差异很大。

### 帮助他人

回答问题也是一种贡献，而且是用户能立刻感受到的贡献。

- 在[社区论坛](https://community.home-assistant.io/)和 [Discord](https://www.home-assistant.io/join-chat/) 上帮助人们解决他们的配置问题。[回答你的第一个问题](/community/first-contribution/) 展示了如何做，[欢迎新成员](/community/guides/welcome-newcomers/) 帮助你做得更好。
- 在[功能请求](https://github.com/home-assistant/feature-requests/discussions)中帮助完善想法。解释请求背后的问题，指向已有的请求而不是重复提交，并投票。产品团队利用功能请求来制定[路线图](/roadmap/how-it-works/)。

## 2. 成为集成负责人

[集成负责人](/glossary/integration-owner/)（integration owner）负责照看一个集成。你最了解该设备或服务，因此当它发生变更时，审查者会听取你的意见。

### 需要什么

集成的负责人列在 Home Assistant Core 中其 `manifest.json` 的 `codeowners` 字段里。要成为负责人，请打开一个拉取请求，在其中添加你的 GitHub 用户名，然后运行 hassfest 来更新仓库的 `CODEOWNERS` 文件：

```shell
python3 -m script.hassfest
```

提交这两个文件。该拉取请求会像其他拉取请求一样被审查。如果先参与过该集成的开发会大有帮助。[成为集成负责人](/core/quality-scale/integration-owner/) 解释了这个角色以及它对你的要求：负责人需要长期照看该集成。没有活跃负责人的集成可能会在质量评级中失去位置。

### 你能得到什么

- **审查请求。** GitHub 会请你审查涉及你集成的拉取请求，因为 `CODEOWNERS` 文件是从清单（manifest）生成的。
- **文档也一样。** home-assistant.io 的 `CODEOWNERS` 文件与 Core 同步。如果你拥有该集成，你也就拥有它的文档页面，并会被要求审查对它的更改。
- **问题提及。** 当 Core 或 home-assistant.io 上的问题或拉取请求获得你集成的标签（`integration: <domain>`）时，机器人会指派你并在评论中提及你。
- **机器人命令。** 该评论列出了只有该集成的负责人才能使用的命令，通过评论 `@home-assistant <command>` 来使用：关闭、重新打开或重命名问题，移除你集成的标签，以及添加或移除一些分类标签如 `needs-more-information`。在拉取请求上，你还可以将其标记为草稿、标记为可审查，或更新其分支。不指定集成的命令只在问题或拉取请求带有单一集成标签时才有效。
- **任务问题。** 在 Core 和 home-assistant.io 中，只有 GitHub 组织成员和列在 `CODEOWNERS` 中的人才能打开 Task 类型的问题。其他人的任务问题会被自动关闭。

机器人的源代码在 [OpenHomeFoundation/bots](https://github.com/OpenHomeFoundation/bots) 中。它展示了每个命令的确切作用。

## 3. 在你的领域承担角色

一些领域设有责任更大的角色。每个角色都有各自的授予方式。

- **语言负责人。** Assist 支持的每种语言都有负责人，他们在 [intents 仓库](https://github.com/OHF-Voice/intents) 中审查其语言的变更。申请时，你需要是母语使用者，至少向 intents 仓库提交过两个拉取请求，并协助审查你语言的拉取请求。参见[语言负责人](/translate/voice/language-leaders/)。
- **版主。** 版主保持论坛、Discord 和 subreddit 友好且安全。版主由其他版主提名，由 Open Home Foundation 的社区经理接受提名。参见[版主工作方式](/community/guides/moderation/#becoming-a-moderator)。
- **Creator Network。** 如果你制作关于 Home Assistant 的视频、文章或其他内容，可以申请加入 [Creator Network](/community/reference/programs/#creator-network)。
- **Works with Home Assistant。** 如果你在设备制造商工作，[Works with Home Assistant](/community/reference/programs/#works-with-home-assistant) 计划就是为你的公司准备的。

## 4. 维护者与团队

[维护者](/glossary/maintainer/)（maintainer）可以批准并合并仓库中的拉取请求。每个仓库都有自己的维护者，通常组织成 GitHub 团队，例如 `@home-assistant/core` 或 `@home-assistant/frontend`。[项目如何组织](/start/organization/#teams-in-codeowners) 列出了你会在 `CODEOWNERS` 文件中遇到的团队，以及每个团队负责的内容。

一个人如何成为维护者，本站还没有书面说明。审查、分类问题和负责集成本身就很有价值，无论之后是什么。

## 5. 获得认可

你的工作会出现在用户阅读的地方：

- **发布说明。** [Home Assistant 博客](https://www.home-assistant.io/blog/) 上的发布说明会按 GitHub 用户名感谢贡献者，标注在他们参与的功能旁边。帮助撰写发布说明的人也会被感谢。
- **完整变更日志。** 每个版本都有 Home Assistant Core 的完整变更日志，从发布说明的 **All changes** 下链接。每个合并的拉取请求都会连同其作者一起列出。

## 6. 与基金会一起走得更远

Home Assistant 是 [Open Home Foundation](https://www.openhomefoundation.org/) 的项目之一。还有更多可以参与：

- **路线图。** 在[路线图](/roadmap/)上了解基金会正在做什么，以及你可以在哪里提供帮助。
- **聚会与社区日。** 与其他贡献者面对面交流，或者自己主办一场聚会。基金会会为主办者报销某些费用。参见[主办聚会](/community/guides/meetups/)。
- **其他项目。** 基金会还拥有 ESPHome 和 Music Assistant 等项目，并与其他方合作。其[项目页面](https://www.openhomefoundation.org/projects/)列出了这些项目，并附有各自的链接。
- **职位。** 基金会在其[职位页面](https://jobs.ashbyhq.com/openhomefoundation)上发布空缺职位。

## 找谁交流

- 不确定接下来做什么？在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 **#developers** 频道，或你所在领域的频道中询问。[我们的交流场所](/start/where-we-talk/#by-area) 列出了这些频道。[项目论坛](discord:project-forum)上有运行时间较长的项目，以及团队正在冲刺的较大主题。
- 想成为集成负责人？在该集成的拉取请求或问题中询问，让现任负责人能看到。
- 有兴趣成为语言负责人？在 [intents 讨论区](https://github.com/OHF-Voice/intents/discussions) 发起一个话题。
- 关于社区角色、聚会或社区日的问题？发送电子邮件至社区团队 [community@openhomefoundation.org](mailto:community@openhomefoundation.org)。
