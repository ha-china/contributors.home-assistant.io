# 拉取请求与评审

> 如何创建一个易于评审的拉取请求（pull request）、创建之后会发生什么，以及如何帮助它被合并。适用于所有仓库。

Source: https://www.hasscn.top/contributors/start/pull-requests/

[拉取请求](https://www.hasscn.top/contributors/glossary/pull-request/)（pull request）是更改进入 Home Assistant 的方式，无论是代码、文档还是设计标记。本页介绍在所有仓库中都相同的部分。每个领域还会补充自己的细节，例如 [Core 开发指南](https://www.hasscn.top/contributors/core/development/)或[前端的评审流程](https://www.hasscn.top/contributors/frontend/development/review-and-release/)。

刚接触 GitHub？fork、branch、commit、push 这些词在[不写代码也能用好 GitHub](https://www.hasscn.top/contributors/start/github/)中有解释。该页面还会带你在浏览器中完成你的第一个拉取请求，无需安装任何软件。

## 创建拉取请求之前

### 确认它合适

大多数更改不需要事先获得许可。修复一个 bug、改进文档或添加一个小功能，都可以直接提交拉取请求。较大的更改则不同：一种新的实体（entity）类型、对所有集成（integration）工作方式的改动，或者为所有人引入一个新的依赖。这些应该先从讨论开始，免得你做出来的东西不得不改变方向。参见[决策是如何做出的](https://www.hasscn.top/contributors/architecture/decisions/)。

所有架构决策都记录在[架构仓库](https://github.com/home-assistant/architecture)中。你的更改必须遵循这些决策。

### 保持小而精

一个拉取请求应该只做一件事：修复一个 bug、添加一个功能，或更新一个页面。过程中发现了其他问题？放到单独的拉取请求里。

小的拉取请求评审得更快。更多人可以评审它们，冲突更少，而且对小改动的认真评审比快速浏览大改动能发现更多问题。许多小的拉取请求并不是效率更低，而是效率更高。

依赖更新也应放在单独的拉取请求中，并附上发布说明或两个版本之间变更的链接，方便评审者查看改了什么。

### 测试它

运行你的更改并确认它能正常工作；如果是文档，确认显示正常。这听起来显而易见，但它能省去一整轮评审。

### 从最新版本开始

[分支](https://www.hasscn.top/contributors/glossary/branch/)（branch）是一条独立的更改线，这样你的工作不会与其他内容混在一起。为每个拉取请求创建一个新分支，基于仓库主分支的最新版本。例如，Home Assistant Core 和前端使用 `dev`，文档使用 `current` 或 `next`。各领域的指南会告诉你使用哪个分支。

你的 [fork](https://www.hasscn.top/contributors/glossary/fork/)，也就是你自己的一份仓库副本，不会自动更新。如果你是很久以前创建的，它可能已经落后了：开始之前先拉取最新的更改。

### 填写模板

每个仓库都有拉取请求模板。请使用它，并且不要删除其中的章节。写一个清晰的标题，以及一段说明你*为什么*做这个更改的描述，而不仅仅是它做了什么。链接它所修复的 issue。如果你使用了 AI 工具，请遵循 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)：你必须能够用自己的话解释每一处更改。一些模板会通过复选框询问这一点。[拉取请求模板会问什么](https://www.hasscn.top/contributors/start/ai-policy/#what-the-pull-request-templates-ask)列出了这些内容。

## 创建拉取请求之后

### 机器人先行动

几分钟内，一些事情会自动发生：

- **CLA 检查。** 在代码仓库中，机器人会在你第一次贡献时要求你签署[贡献者许可协议](https://www.hasscn.top/contributors/start/licensing/)（Contributor License Agreement）。在你签署之前，你的拉取请求无法被合并。
- **标签。** 机器人会给你的拉取请求打标签，例如按更改类型或它涉及的集成。标签帮助维护者找到他们可以评审的拉取请求。
- **集成负责人。** 如果你更改了某个集成，GitHub 会请求其[集成负责人](https://www.hasscn.top/contributors/glossary/integration-owner/)（integration owner）进行评审。其他文件也可以有负责人，列在仓库的 `CODEOWNERS` 文件中。
- **CI。** 自动化检查会构建你的更改、运行测试并检查代码风格。红色叉号表示有检查失败了。打开详情，修复与你的更改相关的部分，然后再次推送：把你的新提交发送到拉取请求的分支，检查会重新运行。参见 [CI](https://www.hasscn.top/contributors/glossary/ci/)。看不懂失败原因？在拉取请求的评论中提问。

如果某个检查因为你的更改而失败，请在修复期间将你的拉取请求标记为草稿（draft）。这告诉评审者它还没准备好。如果你确定失败与你的更改无关，就保持打开状态并说明情况。

### 等待评审

这是最难的部分。评审需要时间，从几小时到几周不等，而且没有任何保证。拉取请求总是比评审者多。

有些内容通常会被更快处理：bug 修复、小改动，以及带测试的拉取请求。大的拉取请求，或者需要具备特定知识的人的拉取请求，需要更长时间。

在等待期间：

- **保持最新。** 合并冲突（merge conflict）意味着别人修改了与你相同的行，Git 无法自行合并两者。GitHub 会在你的拉取请求上显示这一点。修复它，如果已经过了一段时间，还要用最新的更改更新你的分支。[当 GitHub 提示存在冲突时](https://www.hasscn.top/contributors/start/github/#when-github-says-there-is-a-conflict)介绍了如何在浏览器中操作。
- **再看一遍。** 一天之后，你常常会自己发现一些问题。
- **评审别人的工作。** 这是让队列向前推进的最好方式，对每个人都如此。测试一个拉取请求并评论“我在我的设备上试过了，可以正常工作”，就已经是一条有用的评审了。

不要催促维护者或集成负责人进行评审，无论是在拉取请求中还是私信中。机器人会通知该通知的人。在描述中请求评审也是多余的：创建拉取请求本身就已经是在请求评审了。

### 评审意见

在某个时候，评审者会对你的工作发表评论，或要求更改。这不是针对你个人。评审者和你想要的是同样的东西：一个更好的 Home Assistant。看不懂某条评论就问。如果你认为评审者错了，礼貌地提出异议，并解释原因。

在许多仓库中，当评审者要求更改时，机器人会把你的拉取请求转为草稿。当你处理完所有评论且检查通过后，选择 **Ready for review**。机器人随后会通知评审者你已完成。

一些项目使用 AI 工具辅助评审。把它们的评论当作普通的评审意见对待：如果你认为某条不对，简短地说明即可。维护者拥有最终决定权。

### 过期与锁定

一段时间没有活动的拉取请求或 issue 会被机器人打上 `stale` 标签并附上评论。如果之后仍无动静，机器人会关闭它。任何活动都会重置计时：如果你仍在等待评审，一条评论就足够了。某些标签，比如 `no-stale`，可以让机器人不碰它。

一旦某个内容被关闭，另一个机器人会在一段时间后锁定对话。此后，只有对仓库有写权限的人才能评论。又发现了同样的问题？创建一个新的 issue，并链接旧的。

各仓库的时限不同：

| 仓库 | Issue 过期时间 | 拉取请求过期时间 | 打标签后关闭时间 | 关闭后锁定时间 |
| --- | --- | --- | --- | --- |
| [core](https://github.com/home-assistant/core/blob/dev/.github/workflows/stale.yml) | 90 天 | 60 天 | 7 天 | Issue 30 天，拉取请求 1 天 |
| [frontend](https://github.com/home-assistant/frontend/blob/dev/.github/workflows/stale.yaml) | 90 天 | 90 天 | 7 天 | Issue 30 天，拉取请求 1 天 |
| [home-assistant.io](https://github.com/home-assistant/home-assistant.io/blob/current/.github/workflows/stale.yml) | 60 天 | 60 天 | 7 天 | Issue 30 天，拉取请求 1 天 |
| [supervisor](https://github.com/home-assistant/supervisor/blob/main/.github/workflows/stale.yml) | 30 天（仅 bug） | 30 天 | 7 天 | Issue 30 天，拉取请求 1 天 |
| [operating-system](https://github.com/home-assistant/operating-system/blob/dev/.github/workflows/stale.yml) | 90 天 | 90 天 | 7 天 | Issue 30 天，拉取请求 7 天 |
| [addons](https://github.com/home-assistant/addons/blob/master/.github/workflows/stale.yml) | 30 天 | 未设置 | 7 天 | 未设置 |
| android | 未启用 | 未启用 | 未启用 | 未设置 |
| iOS | 未设置 | 未设置 | 未设置 | 未设置 |

这些链接指向各仓库的配置文件，位于其 `.github` 文件夹中。锁定时限在旁边的 `lock.yml` 中（前端为 `lock.yaml`）。android 仓库仍保留着一个供旧机器人使用的 [`stale.yml`](https://github.com/home-assistant/android/blob/main/.github/stale.yml)（issue 90 天，拉取请求 30 天），但该机器人自 2021 年以来就没有在那里打过任何标签了。

## 做一个好邻居

- 同时打开的拉取请求不要超过五个。等一些被合并后再打开更多。
- 不要打开依赖于其他尚未合并的拉取请求的拉取请求。
- 只打开你打算完成的拉取请求。如果无法继续，说明情况并关闭它。这没什么可羞愧的。如果卡住了，可以在 [Discord](https://www.hasscn.top/contributors/start/where-we-talk/) 上寻求帮助。

## 已合并

恭喜，也谢谢你。你让每一个使用 Home Assistant 的人的体验变得更好了。

大多数更改会在下一个版本中到达用户。需要进入补丁版本的修复？在描述中明确说明。由评审者决定，并将其添加到下一个补丁版本的里程碑中。

然后继续前进：再开一个拉取请求，或者帮忙评审。每一次都会更容易。
