# 版本发布是如何运作的

> Home Assistant 的月度发布周期，从第一行代码到最后一个补丁版本。

Source: https://www.hasscn.top/contributors/releases/how-it-works/

Home Assistant 按照固定的时间表发布。新版本在每个月的第一个星期三发布。发布前一周会有一个 beta 版本。发布之后，通常每周会有一次包含修复的补丁版本。然后周期重新开始。

[开放之家基金会（Open Home Foundation）](https://www.hasscn.top/contributors/glossary/open-home-foundation/)制定这一时间表。home-assistant.io 上的[发布常见问题](https://www.home-assistant.io/faq/release/)面向用户对此进行了说明。

## 周期一览

| 时间 | 发生什么 |
| --- | --- |
| 整个月 | 新功能和修复通过合并进入开发分支。每天都会基于它构建夜间构建版本。 |
| 发布前一周的星期三 | beta 开始。开发分支被冻结为 beta，第一个 beta 以 `b0` 结尾。 |
| beta 周期间 | 针对在 beta 中发现的问题的修复会进入新的 beta：`b1`、`b2`，依此类推。 |
| 每月第一个星期三 | 正式发布，例如 `2026.11.0`。发布说明上线，并举行发布派对直播。 |
| 发布后的几周 | 包含错误修复的补丁版本，例如 `2026.11.1` 和 `2026.11.2`。目标是每周一个，尽量在星期五发布。 |

确切的日期见[活动日历](https://www.hasscn.top/contributors/community/reference/events/)。

## 开发

所有新工作都通过拉取请求（pull request）进入每个仓库的 `dev` 分支。该分支上的版本始终指向下一个发布版本，并带有开发标记，例如 `2026.11.0.dev0`。

每天晚上，都会基于 `dev` 分支构建一个版本，版本号类似 `2026.11.0.dev202610100230`。喜欢尝鲜的人可以通过 dev 频道运行这些构建版本。这里是新代码第一次与真实家庭相遇的地方。

新功能的文档会同时编写，位于 home-assistant.io 的 `next` 分支上。它会与发布版本一起上线。参见[编写文档](https://www.hasscn.top/contributors/writing/)。

## Beta

在发布前一周的星期三，发布团队会从 `dev` 分支创建第一个 beta。从那一刻起，该发布版本就功能完备了：新功能将进入下个月。

beta 会发布在 [beta 频道](https://www.hasscn.top/contributors/releases/first-contribution/#2-join-the-beta-channel)上。加入该频道的所有人都会将其作为更新收到。[beta 发布说明](https://rc.home-assistant.io/latest-release-notes/)以及 beta 的文档位于 rc.home-assistant.io 上。

在 beta 周期间，测试人员报告问题，开发人员进行修复。这些修复会先合并到 `dev`，然后发布团队将它们复制到 beta 中。这种复制称为 cherry-picking（摘取）。每一轮修复都会成为一个新的 beta。关于修复如何被摘取，参见[让修复进入补丁版本](https://www.hasscn.top/contributors/releases/guides/patch-releases/)。

## 正式发布

在每月的第一个星期三，最后一个 beta 成为正式发布版本。发布团队将其发布，稳定频道上的 Home Assistant 安装实例会收到更新。

与此同时，发布说明会发布在 [Home Assistant 博客](https://www.home-assistant.io/blog/categories/core/)上，新功能的文档也会在 home-assistant.io 上线。当天晚些时候，会举行发布派对：一场在 YouTube 上介绍新内容的直播。参见[发布说明与发布派对](https://www.hasscn.top/contributors/releases/guides/release-notes/)。

## 补丁版本

有些错误只有在很多人运行某个发布版本后才会显现。补丁版本就是用来修复这些问题的。它们只包含错误修复，绝不包含新功能，目标是每周发布一个补丁版本，尽量在星期五发布，直到下一个发布版本推出。

每个补丁版本都会有一个简短的更新日志，添加到当月发布说明的**补丁版本**部分下。

## 前端和其他部分

用户界面（即前端）有自己的仓库和版本号，但遵循同样的节奏。新的前端版本会作为发布工作的一部分被升级进 core，因此每个 Home Assistant 发布版本都附带与之匹配的前端。

每次构建 Home Assistant 时都会从 Lokalise 拉取翻译，因此翻译人员不需要单独的发布步骤。参见[翻译是如何运作的](https://www.hasscn.top/contributors/translate/how-it-works/)。

## 由发布团队完成的工作

有些步骤只由发布团队完成，你无需操心：

- 创建 beta、发布版本和补丁版本。
- 选择并摘取哪些修复进入 beta 或补丁版本。
- 发布构建版本，并更新安装实例检查更新时所用的版本信息。
- 在其他人的协助下编写并发布发布说明。

其他人能做的，就是让这些步骤变得容易：测试 beta、清晰地报告问题、写好向后不兼容变更部分，并按时准备好拉取请求及其文档。
