# 提交 Android 拉取请求

> 检查清单、拉取请求模板、应用内更新日志，以及 Android 仓库中评审的流程。

Source: https://www.hasscn.top/contributors/companion/android/submitting/

你的改动在自己的机器上运行正常。接下来它需要一个拉取请求（pull request）、一次评审和一次合并。本页介绍评审者期望的内容，以便评审顺利进行。

## 打开拉取请求之前

- **格式化并测试。** 运行 `./gradlew :build-logic:convention:ktlintFormat ktlintFormat` 和 `./gradlew test`。其他检查请参阅[代码风格与 lint](https://www.hasscn.top/contributors/companion/android/code-style/)。
- **构建所有内容。** 共享代码会进入手机、汽车和手表应用。请确认 `:app`、`:automotive` 和 `:wear` 仍然可以构建。
- **为你修改的行为添加测试。** 参阅[测试](https://www.hasscn.top/contributors/companion/android/testing/)。
- **遵循指南**：[最佳实践](https://www.hasscn.top/contributors/companion/android/best-practices/)、[UI 架构](https://www.hasscn.top/contributors/companion/android/ui-architecture/)以及 [Compose 与设计系统](https://www.hasscn.top/contributors/companion/android/compose/)。
- **保持改动小巧。** 每个拉取请求只包含一个想法。大型重构应通过 `WIPFeature` 标志分小步进行，参见[小步发布大改动](https://www.hasscn.top/contributors/companion/android/best-practices/#ship-big-changes-in-small-steps)。
- **阅读 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)。** 你可以使用 AI 工具，但必须理解并能够解释你提交的每一行代码。来自自主智能体的拉取请求将被关闭。

## 拉取请求

按照 [GitHub 文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork)中的说明，从你的 fork 向 `main` 创建拉取请求。GitHub 会自动填入模板。不要从中删除任何内容，除非模板要求你这样做，比如不适用于你改动的章节。请填写：

- **摘要（Summary）**：你改了什么、为什么改，以及对用户意味着什么。链接相关 issue。
- **检查清单（Checklist）**：测试、代码风格、边界情况、向后兼容性以及 AI 政策。不向后兼容的改动，根据影响对象不同，写入面向用户的更新日志，或写入面向开发者的代码中。另外，请从描述你如何使用 AI 的选项中恰好勾选一项。
- **截图（Screenshots）**：针对前端之外的 UI 改动，需提供浅色和深色模式下的截图。
- **文档（Documentation）**：如果你的改动新增、修改或删除了用户可见的内容，请在[用户文档](https://github.com/home-assistant/companion.home-assistant)中打开一个拉取请求并链接它。在该功能上线生产环境之前，请用 `<span class='beta'>BETA</span>` 标记新功能。如果改动影响开发者依赖的内容，比如如何构建、测试或发布应用，模板还会要求提交一个更新开发者文档的拉取请求。

### 更新日志

如果你的改动新增了功能、明显改变了用户可见的行为，或破坏了用户依赖的内容，请将其添加到 [`app/src/main/kotlin/io/homeassistant/companion/android/changelog/ChangelogContent.kt`](https://github.com/home-assistant/android/blob/main/app/src/main/kotlin/io/homeassistant/companion/android/changelog/ChangelogContent.kt) 中的应用内更新日志。小的 bug 修复不需要单独的条目：常设的“Bug fixes and dependency updates”条目已涵盖它们。

`ChangelogContent.kt` 保存这些条目，按新增、改进和修复分组，每个条目都标注了适用的平台。每个条目的文本是 [`common/src/main/res/values/strings_changelog.xml`](https://github.com/home-assistant/android/blob/main/common/src/main/res/values/strings_changelog.xml) 中的一个字符串，因此会被翻译。有一个截图测试会渲染真实的更新日志，因此更新日志的改动还需要更新[截图参考](https://www.hasscn.top/contributors/companion/android/screenshot-testing/)。

## 草稿拉取请求

当你想尽早获得方向上的反馈但工作尚未完成时，可以打开草稿拉取请求。当你修改 CI 本身时，这也很有用。不过使用 CI 要小心：每次推送都会运行完整的流水线，消耗大量资源。在还没有可查看的内容之前，不要打开拉取请求（无论是否为草稿）。你可以随意频繁地推送到自己的 fork。

如果这是你的首次贡献，维护者必须在每次 CI 运行开始前进行批准。

## 评审

任何人都可以评审拉取请求，欢迎你参与。哪怕十分钟的评审也有帮助。不方便评审代码？从拉取请求安装 APK，并报告你发现的问题：bug、崩溃，或 UI 和 UX 反馈。参见[测试拉取请求构建](https://www.hasscn.top/contributors/companion/android/get-started/#test-a-pull-request-build)。

要合并拉取请求，需要维护者的批准。请保持耐心和友善。他们的反馈以评论形式出现，可能是请求修改，也可能是提问。请用自己的话回答问题，不要用 AI 生成的输出。

当你处理完反馈且 CI 通过后，可以请求再次评审。

## 保持分支最新

如果你的分支落后于 `main` 或存在冲突，你可以将 `main` 合并到你的分支并[解决冲突](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line)，或者在其上[变基（rebase）](https://docs.github.com/en/get-started/using-git/about-git-rebase)：

- **尚未评审**：合并或变基均可，由你选择。
- **已经评审**：合并。变基可能破坏已有的评审评论并丢失这些反馈。

该仓库使用 [squash and merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/about-pull-request-merges#squash-and-merge-your-commits)，因此你的分支历史不需要保持整洁。

## 合并

一切通过且维护者批准后，他们会进行合并。你无需做任何事。你的改动会立即推送给内部测试人员，并在下个周末推送到 beta 渠道。参见[发布](https://www.hasscn.top/contributors/companion/android/releases/)。

## 过期的拉取请求

机器人会在拉取请求 30 天无活动后将其标记为过期，issue 则是 90 天。如果之后 7 天内仍无动静，机器人会将其关闭。带有 `under investigation` 或 `Help wanted` 标签的内容不受影响。
