# 打开拉取请求之后

> 打开 Home Assistant Core 的拉取请求后会发生什么，以及你可以做些什么来推动它。

Source: https://www.hasscn.top/contributors/core/development/review-process/

你的拉取请求已经打开。现在它在等待[评审](https://www.hasscn.top/contributors/glossary/review/)。接下来发生的事情在每个 Home Assistant 仓库中基本相同：机器人、等待、评审评论，以及过期的拉取请求。[拉取请求与评审](https://www.hasscn.top/contributors/start/pull-requests/#after-you-open-it)解释了所有这些内容。本页补充的是 core 特有的部分。

## 谁来评审

维护者负责合并拉取请求。当你修改某个集成（integration）时，会自动请求该集成的[集成所有者](https://www.hasscn.top/contributors/glossary/integration-owner/)（在其 `manifest.json` 中列出）进行评审。但任何人都可以评审：“我用我的设备测试过了，可以正常工作”这样的反馈就已经很有帮助了。

质量等级的新层级需要 core 团队成员的批准。参见[提升集成的层级](https://www.hasscn.top/contributors/core/quality-scale/raise-tier/#the-review)。

## 自动评审者

core 中有两个自动评审者会在人工查看之前对拉取请求发表评论。它们只发表评论，不做决定。

- **质量等级评审者**：当更改集成的拉取请求被打开、重新打开或标记为准备好评审时运行。它会根据该集成在其 `quality_scale.yaml` 中标记为 `done` 或 `exempt` 的[质量等级](https://www.hasscn.top/contributors/core/quality-scale/)规则检查更改，并在每个违反规则的行上发布内联评论。当没有任何内容违反规则时，它会留下一条简短的评论。非常大的拉取请求会被跳过。
- **检查依赖要求**：当拉取请求更改了依赖要求文件时运行。对于每个新增或更新的 Python 包，它会检查源仓库是否公开、你的描述是否链接到它（对于新包）或链接到两个版本之间的变更日志或比较（对于更新）、该包如何发布到 PyPI，等等。它会将结果作为一条评论发布。

像阅读任何评审一样阅读它们的评论。当你认为某条评论有误时，在回复中说明原因。

## 什么会阻止合并

除了 CI 之外，一个机器人会在你的拉取请求上设置一些状态检查。在维护者能够合并之前，它们必须全部通过（绿色）：

- `required-labels`：当拉取请求没有类型标签（如 `bugfix` 或 `new-feature`）时为红色。机器人会根据你在模板中“Type of change”下勾选的选项添加该标签，所以请只勾选一个。
- `docs-missing`：当拉取请求带有 `docs-missing` 标签，或者新的集成或平台没有链接到 [home-assistant.io](https://www.home-assistant.io/) 上的文档拉取请求时为红色。模板中“Additional information”下有填写该链接的字段。
- `cla-bot`：在你签署贡献者许可协议（Contributor License Agreement）之前为红色。
- `code-owner-approval`：对于 Platinum 级别的集成，在其集成所有者之一批准该拉取请求之前为红色。
- `blocking-label-awaiting-frontend`：当拉取请求带有 `awaiting-frontend` 标签时为红色，因为它在等待前端的更改。

## 什么能更快推进

缺陷修复、代码质量改进以及带有测试的拉取请求会优先于新功能。小的拉取请求会优先于大的拉取请求。需要具备特定知识的人的更改，例如架构更改或集成所有者不在场的情况，会花费更长时间。

测试比任何东西都更有帮助。它们证明你的代码可以工作、保持其正常工作，并帮助评审者理解你解决的问题。

## 当被要求修改时

当评审者要求修改时，机器人会将你的拉取请求转为草稿状态。将你的修复作为新的提交推送：不要 amend、squash 或 rebase 你已经推送的内容。当你处理完每一条评论且 CI 通过后，选择 **Ready for review**。然后机器人会通知那些要求修改的评审者，又轮到他们了。

## 保持最新

大约一周没有活动后，通过合并[引入最新的 `dev`](https://www.hasscn.top/contributors/core/development/catching-up/)，并再次运行测试。这样当评审开始时，你的拉取请求就可以随时进行。

## 针对补丁版本的修复

Home Assistant 每月发布一次版本，期间会有补丁版本。如果你的修复应该进入下一个补丁版本，请在描述中明确说明。评审者会检查它是否符合条件，并将其添加到下一个补丁版本的里程碑中。

## 利用等待时间

在等待时评审其他拉取请求。这是让队列向前推进的最好方式，也是了解 core 如何运作的最好方式。[评审拉取请求](https://www.hasscn.top/contributors/core/development/reviewing/)告诉你应该关注什么。
