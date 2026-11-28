# 使用 GitHub，无需成为开发者

> 什么是仓库、issue、fork、分支、commit 和 pull request，以及如何完全在浏览器中对 Home Assistant 做一个小改动。

Source: https://www.hasscn.top/contributors/start/github/

Home Assistant 的大部分内容都存放在 [GitHub](https://github.com/home-assistant) 上：代码、文档、错误报告，以及关于改动的讨论。GitHub 是开发者做给开发者用的，这一点显而易见。术语很奇怪，界面很繁杂，第一次使用就像走进别人家的厨房。

不过，你不需要是开发者也能使用它。修改文档中的一句话、报告一个 bug，或者提议修改一个翻译文件，这些都可以在浏览器中完成，无需安装任何软件。本页将解释你会遇到的术语，并带你从头到尾完成一个小改动。

## 创建账号

你需要一个免费的 GitHub 账号才能报告 bug、发表评论或提议改动。不注册也可以阅读。

1. 前往 [github.com/signup](https://github.com/signup)。
2. 按照步骤操作。GitHub 会要求你验证电子邮箱地址：请务必完成，因为有些功能在验证之前无法使用。
3. 开启[双因素认证](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication)。GitHub 强烈建议开启，因为它能保护你的账号安全。

你的用户名是公开的，你在 GitHub 上写的一切也是公开的。选一个你乐于看到出现在自己贡献旁边的名字。

## 术语的通俗解释

GitHub 反复使用着少数几个术语。了解它们之后，界面就好理解多了。

### 仓库

[仓库](https://www.hasscn.top/contributors/glossary/repository/)（repository，或简称 "repo"）就是一个项目：一个文件文件夹，加上对其中每个文件所做过的全部更改历史。Home Assistant 有很多仓库。文档位于 [home-assistant/home-assistant.io](https://github.com/home-assistant/home-assistant.io)，界面位于 [home-assistant/frontend](https://github.com/home-assistant/frontend)，Home Assistant Core 位于 [home-assistant/core](https://github.com/home-assistant/core)。每个仓库都有自己的 issue、pull request 和维护者。

### Issue

[issue](https://www.hasscn.top/contributors/glossary/issue/) 是对某个问题的报告，比如一个 bug 或一个有误的页面。任何人都可以在公开仓库中发起 issue，任何人都可以评论。Issue 不是寻求支持或提出功能建议的地方：请参阅[我们的交流渠道](https://www.hasscn.top/contributors/start/where-we-talk/)了解这些内容应该去哪里。

### Fork

[fork](https://www.hasscn.top/contributors/glossary/fork/) 是你自己账号下的一份仓库副本。你不能直接修改 Home Assistant 的仓库，但你可以修改自己的副本，然后向原始仓库提议你的改动。你不必自己创建 fork：第一次编辑文件时，GitHub 会主动帮你创建。

### 分支

[分支](https://www.hasscn.top/contributors/glossary/branch/)（branch）是仓库内部一条独立的改动线。它让你可以在不触碰主版本的情况下处理某项工作。每个仓库都有一个接收 pull request 的主分支：Home Assistant Core 和前端使用 `dev`，文档修复使用 `current`。每个领域的第一篇贡献页面会告诉你该使用哪个分支。

### Commit

[commit](https://www.hasscn.top/contributors/glossary/commit/) 是一次保存的更改：你修改了哪些文件、谁改的、什么时候改的，以及一条说明你做了什么的简短信息。当你在 GitHub 上保存一次编辑时，你就创建了一个 commit。

### Pull request

[pull request](https://www.hasscn.top/contributors/glossary/pull-request/) 是一个提议：“这里有一个改动，请采纳”。它会准确显示你改了什么，对其运行自动化检查，并有一个专门的讨论区供大家讨论。尽管名字里有 "pull"，但你并不需要拉取任何东西。可以把它理解为请求维护者把你的改动拉取进去。

### 审查

[审查](https://www.hasscn.top/contributors/glossary/review/)（review）是指在改动合入之前有人阅读你的 pull request。审查者可以批准它、对它发表评论，或要求修改。有时他们会建议一个具体的编辑，你只需选中一下即可接受。

### 合并

[合并](https://www.hasscn.top/contributors/glossary/merge/)（merge）一个 pull request 就是把它的改动纳入仓库。只有维护者才能合并。当你的 pull request 显示 **Merged** 时，你的改动就合入了：干得漂亮。

### 还会遇到的几个术语

- **Push**：把 commit 从别处发送到 GitHub。如果你只在浏览器中编辑，GitHub 会替你完成，你可以忽略这个词。
- **合并冲突（merge conflict）**：你的改动和另一个改动触及了同一文件的相同行，Git 无法决定保留哪一个。参见[当 GitHub 提示存在冲突时](https://www.hasscn.top/contributors/start/github/#when-github-says-there-is-a-conflict)。
- **草稿（Draft）**：尚未准备好接受审查的 pull request。
- **检查（Checks）**：在每个 pull request 上运行的自动化测试。绿色对勾表示通过，红色叉号表示有失败。参见 [CI](https://www.hasscn.top/contributors/glossary/ci/)。

## 在浏览器中做一个小改动

这是完整的流程，从你发现一个问题到修复被合并。示例是对 [home-assistant.io](https://www.home-assistant.io/) 文档的修复，因为大多数人都从这里开始。其他仓库的流程相同，只是分支和模板不同。

### 1. 打开文件

文档的每个页面底部都有一个 **Help us improve our documentation** 部分，其中有一个 **Edit** 链接。选中它，GitHub 就会打开该页面的源文件。

在其他任何仓库中，在文件列表中浏览到该文件并选中其名称。

### 2. 开始编辑

选中文件上方的铅笔图标。第一次操作时，GitHub 会告诉你需要拥有自己的仓库副本才能进行修改。选择 **Fork this repository**。GitHub 会在你的账号上创建 fork 并打开编辑器。

### 3. 进行修改

在编辑器中修改文本。只改一件事：一个错别字、一个过时的步骤、一句不清楚的话。小改动比大改动审查得快得多。

选择 **Preview** 查看你的改动效果。

### 4. 提议改动

1. 选择 **Commit changes...**。
2. 在 **Commit message** 字段中，简要描述你改了什么，比如“修复设置菜单的名称”。
3. 选择 **Propose changes**。

GitHub 会将你的改动作为一个 commit 保存到你的 fork 中，并向你展示你改了什么。

### 5. 发起 pull request

1. 选择 **Create pull request**。
2. 检查顶部的基础分支（base branch）：即你的 pull request 要合入的分支。对于文档修复，那是 `current`。如果显示的是其他分支，请在该菜单中更改。
3. 写一个清晰的标题，比如“修复备份页面上过时的菜单名称”。
4. 填写描述中的模板。保留其中的标题和复选框，并勾选适用的选项。模板是为了帮助审查者，而不是为了考你。
5. 选择 **Create pull request**。

就是这样。你的提议现在是公开的，相关的人会自动收到通知。你不需要主动请求任何人来审查。

### 6. 让机器人完成它们的工作

几分钟内，会发生几件事：

- 机器人会添加标签，自动化检查开始运行。
- 对于文档，机器人会发布一个 [Deploy Preview](https://www.hasscn.top/contributors/glossary/deploy-preview/) 的链接：包含你的改动的完整网站。打开它并检查你的页面。
- 在代码仓库（如 Home Assistant Core 或前端）中，机器人会在你第一次时要求你签署[贡献者许可协议](https://www.hasscn.top/contributors/start/licensing/)。点击它的链接。这只需做一次，在此之前你的 pull request 无法被合并。

如果某项检查失败而你不明白原因，请在你的 pull request 下发评论询问。这是很正常的问题，没有人会指望你第一次就能看懂检查日志。

### 7. 回应审查

迟早会有审查者查看你的改动。这可能需要几小时或几周，取决于仓库的繁忙程度。[Pull request 与审查](https://www.hasscn.top/contributors/start/pull-requests/#waiting-for-a-review)解释了原因，以及等待期间你可以做什么。

审查的评论会显示在你 pull request 的 **Conversation** 标签页中，以及 **Files changed** 标签页中相关代码行的旁边。

- **要回复一条评论**，在其下方写下你的回复。
- **要接受一条建议的改动**，选择 **Commit suggestion**。有多条建议？对每一条选择 **Add suggestion to batch**，然后选择 **Commit suggestions** 一次性应用。
- **要自己修改某些内容**，前往你的 fork，通过文件列表上方的分支菜单切换到你 pull request 的分支，然后像之前一样编辑文件。提交时，选择直接提交到该分支。你的 pull request 会自动更新。
- **当你处理完一条评论后**，选择 **Resolve conversation**，这样大家都能看到还剩什么没处理。

审查评论针对的是改动，而不是你本人。如果你认为审查者错了，请礼貌地说出来并解释原因。如果你看不懂某条评论，就问。审查者宁愿解释，也不愿看到你瞎猜。

在许多 Home Assistant 仓库中，当审查者要求修改时，机器人会把你的 pull request 转为草稿。处理完所有事项后，选择 **Ready for review** 通知他们。

### 8. 合并

当维护者合并你的 pull request 时，它会显示 **Merged**。你的改动现在成为 Home Assistant 的一部分。`current` 分支上的文档修复会自动上线：该分支就是 [home-assistant.io](https://www.home-assistant.io) 发布的内容。代码改动会随下一个版本发布给所有用户。

有时 pull request 会在未合并的情况下被关闭。审查者通常会说明原因：问题已经用其他方式修复了，或者改动不合适。经验丰富的贡献者也会遇到这种情况，这并不是对你个人的评判。

## 当 GitHub 提示存在冲突时

如果你的 pull request 在等待期间，别人修改了相同的行，GitHub 会显示该分支存在冲突。对于简单的冲突，你可以在浏览器中修复：

1. 在你的 pull request 上，选择 **Resolve conflicts**。
2. GitHub 会显示两个版本，位于 `<<<<<<<`、`=======` 和 `>>>>>>>` 等标记之间。编辑文本，只保留你想要的版本，并删除这些标记。
3. 选择 **Mark as resolved**，然后选择 **Commit merge**。

并非所有冲突都能在浏览器中解决。如果 **Resolve conflicts** 不可用，或者你不确定该保留什么，请在你的 pull request 下发评论寻求帮助。

如果你的分支只是落后了而没有冲突？那么 GitHub 会在 pull request 靠近底部的位置显示一个 **Update branch** 按钮。点击它即可拉取最新的改动。

## 说实话，容易让人困惑的地方

有几件事几乎每个人第一次都会被绊住：

- **你的改动似乎消失了。** 提议改动之后，它存在于你的 fork 中，而不是 Home Assistant 仓库中。这是正常的。当 pull request 被合并时，它才会移过去。
- **所有东西都有两份。** 你的 fork 和原始仓库看起来几乎一样。查看左上角的名称：是你的用户名，还是 `home-assistant`。
- **基础分支选错了。** 针对错误分支发起 pull request 是常见的新手错误。你可以在事后更改：选择 pull request 标题旁边的 **Edit title**，在基础分支菜单中选择另一个分支，然后选择 **Change base**。
- **通知的数量。** 一旦你发起了 pull request，GitHub 会就其上发生的一切给你发邮件。你可以在[通知设置](https://docs.github.com/en/subscriptions-and-notifications/get-started/configuring-notifications)中调整。
- **沉默。** 一段时间没有回应并不意味着没人在意。pull request 的数量比审查者多。

## 接下来去哪里

- [你的第一次贡献](https://www.hasscn.top/contributors/start/first-contribution/)：选择你想做的事情。
- [你的第一次文档修复](https://www.hasscn.top/contributors/writing/first-contribution/)：针对文档的这个流程。
- [Pull request 与审查](https://www.hasscn.top/contributors/start/pull-requests/)：更详细地介绍发起 pull request 之后会发生什么。
- GitHub 官方的 [Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world) 教程，如果你想先在自己的仓库中练习一下。
