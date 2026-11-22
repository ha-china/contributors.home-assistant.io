---
title: 你的第一次文档修复
description: 直接在浏览器中修复文档中的小问题。无需任何环境配置。
order: 1
sidebarLabel: 你的第一次贡献
---

最快的入门方式就是修复你自己注意到的问题。某个页面让你感到困惑？某个步骤已过时，或者截图来自旧版本？这就是你的第一次贡献。

还没有想法？读者会通过每个页面上的反馈链接报告问题。这些报告是 [GitHub 上的公开议题（issue）](https://github.com/home-assistant/home-assistant.io/issues)，其中很多都是等待有人认领的小修复。

你需要一个免费的 [GitHub](https://github.com/) 账号。刚接触 GitHub？[无需成为开发者也能使用 GitHub](/start/github/) 解释了你会遇到的术语，比如 fork、commit 和 pull request。

不想自己动手编辑？那也没问题。在 [home-assistant.io](https://www.home-assistant.io/) 页面底部的 **帮助我们改进文档** 下选择 **提供反馈**，并描述问题所在。它会变成一个议题，供其他人认领处理。这同样需要一个 GitHub 账号。

## 1. 打开页面

1. 前往 [home-assistant.io](https://www.home-assistant.io/) 上你想要修复的页面。
2. 滚动到底部的 **帮助我们改进文档**，然后选择 **编辑**。
3. GitHub 会显示该页面的源代码。选择文件右上角的铅笔图标，**编辑此文件**。

   如果铅笔图标没有出现，请登录你的 GitHub 账号。
4. 第一次操作时，GitHub 会提供创建你自己的仓库副本，称为 [fork](/start/github/#fork)。接受它。你不需要对它做任何其他操作。

## 2. 进行修改

页面使用 Markdown 编写。大部分内容都是纯文本，所以你可以像编辑其他文本一样进行编辑。参考页面其余部分的处理方式，比如链接和列表，并照着做。

保持修改聚焦：每个 pull request 只包含一个修复，比十个修复更容易审查。计划进行更大的改动，比如新增一个章节或一个新页面？请先阅读[风格指南](/writing/reference/style/)和[页面的结构](/writing/guides/structure/)。

> [!TIP]
> 审查者经常指出的小问题：提到界面时，请用粗体书写 **设置** > **设备与服务**，并且完整书写 "Home Assistant"。

## 3. 提交修改

1. 选择 **提交更改...**。
2. 在弹出的窗口中，简要描述你所做的修改，比如“修复备份菜单的名称”。
3. 选择 **提议更改**。

GitHub 会将你的修改保存到你的 fork 中，并向你展示修改内容。这时发现自己在编辑中犯了错？没关系：照样打开 pull request，之后再修复即可。第 6 步会说明如何操作。

## 4. 打开 pull request

1. 选择 **创建 pull request**。
2. 检查顶部的基准分支（base branch）。是修复现有文档吗？它必须显示为 `current`：即人们当前正在运行的版本的文档。如果显示的是其他内容，请在该菜单中更改。
3. 填写模板。不要删除其中的任何文本：这对审查者有帮助。在 **更改类型** 下，勾选符合情况的选项，通常是 **拼写、语法或其他可读性改进** 或 **调整当前文档中缺失或错误的信息**。在 **检查清单** 下，勾选适用的选项。
4. 选择 **创建 pull request**。

就是这样。你的 pull request 现在已经公开，相关的人会自动收到通知。你不需要主动请求任何人进行审查。

## 5. 检查预览

在你打开 pull request 几分钟后，一个机器人会评论并附上一个 **部署预览** 的链接。那是包含你的修改的完整网站。打开它，检查你的页面是否如你所愿地显示。

## 6. 审查与合并

维护者会审查你的修改。当有动静时，GitHub 会根据你的设置，通过电子邮件或 github.com 向你发送通知。

- **有建议？** 直接在 pull request 中使用 **提交建议** 接受它。
- **想自己修改一些内容？** 在你的 fork 中、你 pull request 所在的分支上再次编辑该文件，pull request 会自动更新。[使用 GitHub](/start/github/#7-respond-to-the-review) 介绍了在哪里可以找到它。
- **有不明白的问题？** 尽管问。审查者更愿意解释，而不是看你猜测。

一旦你的 pull request 被合并，Netlify 就会将你的修复发布到 home-assistant.io。

## 接下来做什么

- 再修复一些其他问题。大多数文档的常驻贡献者都是从修正错别字开始的。
- 更喜欢带每一步截图的详细教程？论坛上的社区指南 [Editing the documentation and creating a pull request on GitHub](https://community.home-assistant.io/t/editing-the-documentation-and-creating-a-pull-request-on-github/9573) 展示了这些内容。
- 准备好进行更大的改动了吗？[在本地预览网站](/writing/guides/local-preview/)。
