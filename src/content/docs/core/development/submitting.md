---
title: 提交拉取请求
description: Home Assistant Core 拉取请求的特有事项，从分支和提交信息到模板、新集成以及依赖更新。
sidebarGroup: Pull requests
order: 2
---

对 Home Assistant Core 的更改通过 GitHub 上针对 `dev` 分支的[拉取请求](/glossary/pull-request/)（pull request）进入代码库。拉取请求在每个 Home Assistant 仓库中的工作方式，从保持其精简到等待审查，都在[拉取请求与审查](/start/pull-requests/)中介绍。请先阅读该页面。本页补充的是 core 特有的内容。

## 在打开拉取请求之前

- 将你的分支基于最新的 `dev`。参见[保持分支最新](/core/development/catching-up/)。
- 通读[开发检查清单](/core/development/checklist/)。
- 运行测试和[代码检查工具](/core/development/checks/)（linters）。
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

- **Breaking change**: if your change breaks something for existing users, explain what breaks, how to fix it, and why. This text goes into the release notes, so write it for users, not for developers. Remove the section if nothing breaks. [When it is backward-incompatible](/releases/guides/backward-incompatible-changes/#when-it-is-backward-incompatible) helps you decide, also for the removal at the end of a deprecation.
- **Proposed change**: explain *why*, not only what. Reviewers need the reason to judge the solution.
- **Type of change**: check exactly one box. If more than one fits, your pull request does too much: split it. A bot uses this box to label your pull request.
- **Additional information**: link the issue you fix with `fixes #12345`, and the pull requests for the documentation or frontend.
- **Checklist**: go through it honestly.

在你的第一个拉取请求上，机器人会要求你签署贡献者许可协议（Contributor License Agreement）。在此之前，你的拉取请求无法被合并。如果你的 GitHub 账户是新建的，CI 也会等到维护者批准运行后才开始。

## 拉取请求打开之后

拉取请求一旦打开，就不要修改（amend）、压缩（squash）或变基（rebase）你已推送的提交。审查者需要跟踪历史，并查看自他们上次查看以来发生了什么变化。请改为添加新的提交，并通过合并引入来自 `dev` 的更改。参见[保持分支最新](/core/development/catching-up/)。

CI 必须通过，你的拉取请求才能被审查和合并。有些测试是不稳定的（flaky）：当你确定某个失败与你的更改无关时，请等待维护者处理，而不是再次推送以重新运行 CI。

[打开拉取请求之后](/core/development/review-process/)介绍了在 core 中接下来会发生什么。

## 新集成

Before you build a new integration, read [does it belong in core](/core/integrations/create/#does-it-belong-in-core). The project recommends that you publish it in the [Marketplace](/marketplace/) first. Once it has matured and has a user base, ask in the **#developers** channel on [Discord](https://www.home-assistant.io/join-chat/) whether it should ship built in.

如果应该内置，请[保持第一个拉取请求精简](/core/integrations/create/#keep-the-first-pull-request-small)：Bronze 等级、一个平台，没有额外内容。

在拉取请求的描述中：

- 说明该产品或服务是什么。
- 链接到你所使用库的源代码仓库。
- 链接 [home-assistant.io](https://www.home-assistant.io/) 文档的拉取请求以及品牌图片的拉取请求。

[教程](/core/integrations/tutorial/)会完整讲解一个新集成的构建过程，直到这个拉取请求。

## 依赖更新

在独立的拉取请求中更新依赖。只包含新版本所需的代码更改。使用新版本的新功能应在后续的拉取请求中提交。

在描述中，链接到上游的变更内容：发布说明或更新日志（changelog），或者新旧版本之间的 diff。审查者在合并之前会阅读上游的更改，既是为了确认该更新对于补丁版本是否安全，也是为了发现任何可疑之处。运行 `python3 -m script.gen_requirements_all` 来更新依赖要求文件，并将其包含在拉取请求中。

## 使用 AI

你可以使用 AI 工具来帮助你编写代码，只要你保持自己是流程中的人（human in the loop）。Core 遵循 [AI 政策](/start/ai-policy/)：你要审查并理解你提交的所有内容，你能解释每一处更改，并且你自己回答审查者的问题。自主代理不得贡献代码。拉取请求模板会要求你确认你理解所提交的代码。

Core 的仓库中有一个 `AGENTS.md` 文件以及供 AI 工具使用的技能（skills）。参见[仓库中的 AI 工具](/core/development/environment/#ai-tools-in-the-repository)。
