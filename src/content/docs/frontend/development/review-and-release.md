---
title: 审查与发布
description: 打开前端拉取请求后会发生什么，以及合并的更改如何到达使用 Home Assistant 的用户手中。
order: 8
---

打开拉取请求（pull request）只是对话的开始，而不是你工作的结束。本页介绍审查者会关注什么、会运行哪些检查，以及你的更改如何进入一个发布版本。

## 审查之前

当你针对 `dev` 打开一个拉取请求时，有几件事会自动发生：

- **模板检查。** 拉取请求必须使用[模板](https://github.com/home-assistant/frontend/blob/dev/.github/PULL_REQUEST_TEMPLATE.md)，并保留其 **Proposed change**、**Type of change** 和 **Checklist** 部分，且只能勾选一个 **Type of change**，并在 **Proposed change** 下描述更改。如果不符合要求，拉取请求会被打上 `Needs Template` 标签并收到一条评论，检查会失败，直到你修复为止。草稿会被跳过，因此当你将拉取请求标记为准备审查时，检查才会运行。
- **标签。** 机器人会根据拉取请求更改的文件为其打上标签，例如 `Dashboards`、`Automations` 或 `Tests: Unit`。第二个脚本会在更改触及这些代码部分时添加 `Companion App`、`Home Assistant Link`、`Labs` 和 `Supervisor` 标签，即使更改来自这些文件夹之外。当标签不再匹配时，两者都会再次移除标签，包括手动添加的标签。规则位于 [`.github/labeler.yml`](https://github.com/home-assistant/frontend/blob/dev/.github/labeler.yml) 和 [`.github/scripts/label-content.mts`](https://github.com/home-assistant/frontend/blob/dev/.github/scripts/label-content.mts) 中。
- **CLA。** 你第一次贡献时，机器人会要求你签署贡献者许可协议。
- **CI。** 每次推送都会运行代码检查器、类型检查、单元测试、生产构建和端到端测试。它们必须通过，你的拉取请求才能被合并。

保持一个拉取请求只包含一个更改。如果你发现自己勾选了两个 **Type of change** 复选框，请将其拆分。小的拉取请求能更快得到审查。

## 审查者关注什么

前端维护者会审查每一个拉取请求。除了“它是否能工作”之外，他们还会检查：

- **各种状态下的行为。** 加载中、错误、不可用、实体（entity）缺失，以及双向的状态转换。而不仅仅是正常路径。
- **现有模式。** 使用共享的 `ha-*` 组件、现有的辅助元素（helper）和主题变量，而不是另起炉灶的并行实现。
- **文本。** 所有面向用户的文本都必须可翻译、使用句首大写，并使用正确的术语。
- **无障碍性。** 键盘导航、焦点、标签和触摸目标。
- **窄屏和从右到左的语言。** 前端运行在手机上，也运行在从右到左书写的语言中。
- **清理。** 当组件被移除时，事件监听器、定时器和订阅也要一并移除。

[编码指南](/frontend/development/guidelines/)更详细地介绍了这些内容。

### 截图与设计画廊

对于任何可见的更改，请在拉取请求中添加前后对比截图或短视频。审查者会根据这些内容做出很多判断。

如果更改的组件在画廊中有页面，也应该更新该页面。维护者可以添加 `needs design preview` 标签，这会为你的拉取请求部署一个画廊预览。已发布的设计指南位于本站的 [Design](/design/components/) 区域：当组件在那里有页面时，请通过向[本站](https://github.com/home-assistant/contributors.home-assistant.io)提交拉取请求来更新它。

### 需要设计意见的更改

新的卡片、徽章、屏幕和交互模式既是代码问题，也是设计决策。当方向尚未确定时，审查者会添加 `Needs UX` 标签并向设计团队征求意见。这可能需要一段时间。在编写代码之前，先在 [UX design discussions](https://github.com/OpenHomeFoundation/ux-design/discussions) 中讨论较大的想法，可以避免你重写代码。[Design](/design/how-we-design/) 区域解释了其工作方式。

### 需要后端的更改

当你的更改依赖于 Core 中的某个拉取请求时，请在模板中链接它。前端更改会等待后端更改合并。标签 `wait for backend` 和 `backend merged` 用于跟踪这一过程。

### 长期无动静的拉取请求

一个 90 天没有任何活动的拉取请求会被打上 `stale` 标签并收到一条评论。如果在那之后的 7 天内仍没有任何动静，它将被关闭。任何更新都会再次移除该标签。维护者可以使用 `no-stale` 标签豁免某个拉取请求。议题（issue）遵循相同的时限，但被标记为功能请求或求助（help wanted）的除外。

## AI 工具

你可以使用 AI 工具来帮助你编写代码。但你要对结果负责：你必须理解你提交的每一处更改，并能自己解释它。看起来像未经审查的 AI 输出的拉取请求或评论会被关闭。详情请参阅 [Open Home Foundation AI policy](https://github.com/home-assistant/frontend/blob/dev/AI_POLICY.md)。

## 帮助审查

拉取请求模板会要求你审查另外两个拉取请求。这不是走过场。每一次审查，哪怕是“我在手机上测试过，它能用”，都能减轻维护者的负担，并缩短你自己的拉取请求所在的队列。

## 从合并到发布

前端作为一个 Python 包 `home-assistant-frontend` 发布，Home Assistant Core 将其作为 `frontend` 集成（integration）的依赖进行安装。版本号是日期，例如 `20260930.0`。

1. **合并到 `dev`。** 你的更改将进入下一个发布版本。每晚都会从 `dev` 构建一个开发版本。
2. **Beta。** 当新的 Home Assistant 发布版本的 beta 开始时，`dev` 中的更改会进入 `rc` 分支，即候选发布版本（release candidate）。在那里会切出并标记一个新的前端版本，Core 会将其依赖提升到该版本。
3. **修复。** beta 期间或之后的补丁版本中所需的错误修复，会由维护者 cherry-pick 到 `rc` 上，并在那里发布和标记为 `.1`、`.2` 等等。这些拉取请求会被打上 `cherry-picked` 标签。
4. **发布。** 在发布日，`rc` 会被合并到 `master`，你的更改将随下一个 Home Assistant 发布版本一起发布。

[Releases](/releases/) 区域解释了 Home Assistant 整体的发布周期。

### 文档与向后不兼容的更改

如果你的更改添加或修改了用户需要配置的内容，请更新 [home-assistant.io](https://github.com/home-assistant/home-assistant.io) 上的用户文档，并在模板中链接该拉取请求。[Writing docs](/writing/) 介绍了具体方法。

如果你的更改给现有用户带来了破坏，例如移除了某个卡片选项，请填写模板中的 **Breaking change** 部分。这段文字会进入发布说明，所以要为用户而写：什么会被破坏、如何修复，以及为什么。
