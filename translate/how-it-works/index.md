# 翻译是如何工作的

> 字符串从哪里来、在哪里被翻译，以及它们如何最终进入 Home Assistant。

Source: https://www.hasscn.top/contributors/translate/how-it-works/

Home Assistant 中的每一段文本都以英文形式存在于源代码中。从那里，它通过 Lokalise 传递给翻译者，并在构建时回到 Home Assistant 中。

## 字符串从哪里来

开发者在代码旁边编写使用它的英文文本：

- **前端（frontend）**文本，如菜单和对话框，位于[前端仓库](https://github.com/home-assistant/frontend)中。
- **后端（backend）**文本属于各个集成（integration）。每个集成都有一个 `strings.json` 文件，包含其设置步骤、实体（entity）名称、状态（state）和错误消息。
- **伴侣应用（Companion apps）**有自己的字符串，位于 iOS 和 Android 仓库中。

当包含新增或更新英文文本的更改被合并到前端或[核心仓库](https://github.com/home-assistant/core)时，新字符串会自动上传到 Lokalise。iOS 应用每天上传一次其字符串。

## 翻译在哪里进行

这些来源中的每一个都有其自己的 Lokalise 项目。这就是为什么有[四个项目可以加入](https://www.hasscn.top/contributors/translate/first-contribution/#1-pick-a-project)：前端、后端、iOS 和 Android。在一个项目中，每种语言都由社区翻译。任何加入的人都可以翻译字符串并改进现有翻译。没有单独的审批步骤：保存在 Lokalise 中的翻译就是最终发布的翻译。

## 翻译如何返回

对于 Home Assistant 本身，翻译并不存储在源代码中。它们是在构建代码时从 Lokalise 下载的。只有 Lokalise 标记为未验证的翻译才会被排除在外。前端和后端是分开构建的，因此它们在不同时刻获取翻译：

- **后端**：Home Assistant Core 的每次构建（nightly、beta 或正式发布）都会下载最新的后端翻译。该构建包含截至那一刻已翻译的所有内容。
- **前端**：前端在构建时下载其翻译，每晚一次，并且每次前端发布时也会下载。Home Assistant 的 nightly 构建使用最新的 nightly 前端。Home Assistant 的 beta 或正式发布包含特定的前端发布版本，以及该前端发布构建时的翻译。

Android 应用也在构建时下载翻译。iOS 应用是个例外：一个每日任务会从 Lokalise 拉取翻译，并在 [iOS 仓库](https://github.com/home-assistant/iOS)中打开一个包含这些翻译的 pull request。

这也意味着修复永远不会太遥远。今天修正一个翻译，它就会出现在下一次后端构建或下一次前端发布中。

## 哪些内容不在这里翻译

- **文档**：[home-assistant.io](https://www.home-assistant.io/) 上的文档仅提供英文。
- **语音命令**：Assist 能理解的句子在 GitHub 上维护，而不是在 Lokalise 中。参见[语音](https://www.hasscn.top/contributors/translate/voice/)。
