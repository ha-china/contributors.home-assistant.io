# 谁负责什么

> 参与 Home Assistant 发布的人员，以及他们各自的工作。

Source: https://www.hasscn.top/contributors/releases/reference/roles/

一次发布是数百人共同努力的成果。他们中的大多数人从未把自己当作发布工作的一部分。下面介绍谁负责什么。

## 贡献者

所有提交拉取请求（pull request）的人。对于发布而言，你的任务是：

- 如果你希望自己的改动进入本月的发布版本，请在 beta 开始前让你的拉取请求被合并。
- 当你的改动需要用户采取行动时，编写清晰的[不向后兼容的变更章节](https://www.hasscn.top/contributors/releases/guides/backward-incompatible-changes/)。
- 与代码一起，在 [home-assistant.io](https://github.com/home-assistant/home-assistant.io) 的 `next` 分支上提交文档拉取请求。

## 维护者和集成负责人

[维护者](https://www.hasscn.top/contributors/glossary/maintainer/)（maintainer）负责审查并合并拉取请求。[集成负责人](https://www.hasscn.top/contributors/glossary/integration-owner/)（integration owner）负责照看特定的集成。对于发布而言，他们：

- 决定在 beta 开始前合并哪些内容。
- 修复 beta 中发现的问题，尤其是他们最熟悉的代码。
- 标记应进入 beta 或下一个补丁版本的修复。参见[让修复进入补丁版本](https://www.hasscn.top/contributors/releases/guides/patch-releases/)。

## Beta 测试者

[beta 频道](https://www.hasscn.top/contributors/releases/first-contribution/#2-join-the-beta-channel)上的所有人。他们提前一周在真实的家庭环境中运行下一个版本，并报告出现的问题。没有他们，这些 bug 就会影响所有人。你也可以成为其中一员：参见[你的第一次贡献](https://www.hasscn.top/contributors/releases/first-contribution/)。

## 文档审查者

他们审查并合并 `next` 分支上的文档拉取请求，确保新功能的文档在发布日已经就绪。参见[编写文档](https://www.hasscn.top/contributors/writing/)。

## 翻译者

他们在 Lokalise 上翻译新增的文本。翻译内容会随每次构建被拉取，因此他们的成果无需单独的步骤就能进入 beta 和正式发布版本。参见[翻译](https://www.hasscn.top/contributors/translate/)。

## 发布团队

发布团队负责发布工作本身。只有他们执行的步骤包括：

- 创建 beta、正式版本和补丁版本。
- 将里程碑中的修复挑选（cherry-pick）到发布分支。
- 发布正式版本。
- 在其他人的协助下编写并发布发布说明。

发布团队使用[发布辅助脚本](https://github.com/home-assistant/hass-release)来生成更新日志、挑选里程碑中的修复，以及查找尚未合并的文档拉取请求。

## 创作者

[创作者网络](https://www.hasscn.top/contributors/community/reference/programs/#creator-network)（Creator Network）的成员会在 beta 日与团队会面，并可以在版本发布之前提供反馈。他们的视频和文章帮助许多人了解新功能。
