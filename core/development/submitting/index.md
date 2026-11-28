# 提交拉取请求

> Home Assistant Core 拉取请求的特有事项，从分支和提交信息到模板、新集成以及依赖更新。

Source: https://www.hasscn.top/contributors/core/development/submitting/

对 Home Assistant Core 的更改通过 GitHub 上针对 `dev` 分支的[拉取请求](https://www.hasscn.top/contributors/glossary/pull-request/)（pull request）进入代码库。拉取请求在每个 Home Assistant 仓库中的工作方式，从保持其精简到等待审查，都在[拉取请求与审查](https://www.hasscn.top/contributors/start/pull-requests/)中介绍。请先阅读该页面。本页补充的是 core 特有的内容。

## 在打开拉取请求之前

- 将你的分支基于最新的 `dev`。参见[保持分支最新](https://www.hasscn.top/contributors/core/development/catching-up/)。
- 通读[开发检查清单](https://www.hasscn.top/contributors/core/development/checklist/)。
- 运行测试和[代码检查工具](https://www.hasscn.top/contributors/core/development/checks/)（linters）。
- 实际运行带有你更改的 Home Assistant，并试用它。从未能正常运行的代码只会浪费所有人的时间，包括你自己的。
- 对于改变 core 工作方式的更改，请查看[架构决策](https://github.com/home-assistant/architecture/tree/master/adr)。如果需要新的决策，请在编写代码之前先发起[讨论](https://github.com/home-assistant/architecture/discussions)。

## 提交并推送

为每个拉取请求使用一个独立的分支进行开发，绝不要在 `dev` 上直接开发：

```shell
git fetch upstream
git checkout -b add-battery-sensor upstream/dev
```

当你的更改完成后，提交并推送到你的 fork：

```shell
git add .
git commit -m "Add battery sensor to Example"
git push -u origin HEAD
```

`-u` 会将你 fork 上的分支设为该分支的默认跟踪目标。没有它，你的分支会继续跟踪 `upstream/dev`，之后直接执行 `git push` 或 `git pull` 就会推送到错误的位置。

一条好的提交信息：

- 说明更改做了什么，而不是"Update"或"Fix"
- 使用祈使语气："Add battery sensor"，而不是"Adds battery sensor"
- 以大写字母开头，且不以句号结尾
- 不带 `[example]` 或 `sensor:` 之类的前缀

Git 钩子（hooks）会在你提交时运行，并且可能更改你的集成文件夹之外的文件。这些更改也应包含在你的拉取请求中。

## 打开拉取请求

在 GitHub 上，从你的分支向 [home-assistant/core](https://github.com/home-assistant/core) 的 `dev` 分支打开一个拉取请求。然后填写模板。不要从中删除任何内容，包括你没有勾选的复选框。

- **Breaking change**：如果你的更改对现有用户造成了破坏，请说明破坏了什么、如何修复以及原因。这段文字会进入发布说明，因此请面向用户而非开发者来撰写。如果没有破坏任何内容，请删除该部分。[何时属于向后不兼容](https://www.hasscn.top/contributors/releases/guides/backward-incompatible-changes/#when-it-is-backward-incompatible)可帮助你做出判断，也适用于弃用功能在周期结束时的移除。
- **Proposed change**：解释*为什么*，而不仅仅是做了什么。审查者需要理由来评判解决方案。
- **Type of change**：只勾选一个框。如果有多项符合，说明你的拉取请求内容过多：请拆分。机器人会使用此框为你的拉取请求添加标签。
- **Additional information**：使用 `fixes #12345` 链接你修复的 issue，以及文档或前端的拉取请求。
- **Checklist**：如实逐项核对。

在你的第一个拉取请求上，机器人会要求你签署贡献者许可协议（Contributor License Agreement）。在此之前，你的拉取请求无法被合并。如果你的 GitHub 账户是新建的，CI 也会等到维护者批准运行后才开始。

## 拉取请求打开之后

拉取请求一旦打开，就不要修改（amend）、压缩（squash）或变基（rebase）你已推送的提交。审查者需要跟踪历史，并查看自他们上次查看以来发生了什么变化。请改为添加新的提交，并通过合并引入来自 `dev` 的更改。参见[保持分支最新](https://www.hasscn.top/contributors/core/development/catching-up/)。

CI 必须通过，你的拉取请求才能被审查和合并。有些测试是不稳定的（flaky）：当你确定某个失败与你的更改无关时，请等待维护者处理，而不是再次推送以重新运行 CI。

[打开拉取请求之后](https://www.hasscn.top/contributors/core/development/review-process/)介绍了在 core 中接下来会发生什么。

## 新集成

在构建新集成之前，请阅读[它是否属于 core](https://www.hasscn.top/contributors/core/integrations/create/#does-it-belong-in-core)。项目建议你先将其发布到 [Marketplace](https://www.hasscn.top/contributors/marketplace/) 中。一旦它成熟并拥有用户群，请在 [Discord](https://www.home-assistant.io/join-chat/) 的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道询问它是否应该内置。

如果应该内置，请[保持第一个拉取请求精简](https://www.hasscn.top/contributors/core/integrations/create/#keep-the-first-pull-request-small)：Bronze 等级、一个平台，没有额外内容。

在拉取请求的描述中：

- 说明该产品或服务是什么。
- 链接到你所使用库的源代码仓库。
- 链接 [home-assistant.io](https://www.home-assistant.io/) 文档的拉取请求以及品牌图片的拉取请求。

[教程](https://www.hasscn.top/contributors/core/integrations/tutorial/)会完整讲解一个新集成的构建过程，直到这个拉取请求。

## 依赖更新

在独立的拉取请求中更新依赖。只包含新版本所需的代码更改。使用新版本的新功能应在后续的拉取请求中提交。

在描述中，链接到上游的变更内容：发布说明或更新日志（changelog），或者新旧版本之间的 diff。审查者在合并之前会阅读上游的更改，既是为了确认该更新对于补丁版本是否安全，也是为了发现任何可疑之处。运行 `python3 -m script.gen_requirements_all` 来更新依赖要求文件，并将其包含在拉取请求中。

## 使用 AI

你可以使用 AI 工具来帮助你编写代码，只要你保持自己是流程中的人（human in the loop）。Core 遵循 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)：你要审查并理解你提交的所有内容，你能解释每一处更改，并且你自己回答审查者的问题。自主代理不得贡献代码。拉取请求模板会要求你确认你理解所提交的代码。

Core 的仓库中有一个 `AGENTS.md` 文件以及供 AI 工具使用的技能（skills）。参见[仓库中的 AI 工具](https://www.hasscn.top/contributors/core/development/environment/#ai-tools-in-the-repository)。
