# 你的第一次翻译

> 加入一个翻译项目，找到你的语言，并翻译你的第一批字符串。大约需要十五分钟。

Source: https://www.hasscn.top/contributors/translate/first-contribution/

本指南将带你从零开始完成你的第一批翻译字符串。整个过程都在浏览器中进行。

## 1. 选择一个项目

Home Assistant 的界面文本分布在四个 Lokalise 项目中。点击下面的链接即可打开项目并加入：

- [Frontend](https://app.lokalise.com/public/3420425759f6d6d241f598.13594006/)：Home Assistant 界面本身。如果不确定从哪里开始，就从这里开始。
- [Backend](https://app.lokalise.com/public/130246255a974bd3b5e8a1.51616605/)：来自集成的文本，例如设置步骤、实体（entity）名称和错误消息。
- [iOS](https://app.lokalise.com/public/834452985a05254348aee2.46389241/)：适用于 iPhone、iPad、Mac 和 Apple Watch 的伴侣应用。
- [Android](https://app.lokalise.com/public/145814835dd655bc5ab0d0.36753359/)：适用于 Android 手机、平板和 Wear OS 的伴侣应用。

## 2. 创建账户并加入

Lokalise 会要求你创建一个免费账户。之后，加入项目并选择你的语言。你以后可以加入更多项目和语言。不熟悉编辑器？Lokalise 在 [translate and collaborate](https://docs.lokalise.com/en/collections/2909016-translate-and-collaborate) 中有说明。

## 3. 找一些可以翻译的内容

打开你的语言，筛选未翻译的字符串。如果你的语言已经全部翻译完成，那是好消息，但仍然有很多事情可做：通读现有的翻译，改进那些感觉不妥的地方。新鲜的眼光能发现很多问题。

先翻译几个字符串作为开始。短字符串是很好的热身。

> [!TIP]
> 不确定某个字符串的含义？看看它的键（key）。像 `component::wled::config::step::user::description` 这样的键告诉你，它是 WLED 集成第一个设置步骤的描述。仍然不确定？在字符串上留下评论，而不是凭猜测翻译。

## 4. 注意占位符

有些字符串包含花括号之间的部分，例如 `{count}`，或方括号之间的部分。不要翻译这些名称：Home Assistant 会在运行时填充它们。例外情况是复数或选择形式，例如 `{count, plural, one {# device} other {# devices}}`：保留其关键字，翻译内部括号中的文本。[占位符和引用](https://www.hasscn.top/contributors/translate/guides/placeholders/)解释了它们的工作原理。

## 5. 在 Home Assistant 中查看你的成果

Home Assistant 在构建时会从 Lokalise 拉取翻译。没有单独的审批步骤，也没有拉取请求（pull request）：你在 Lokalise 中保存的内容就是构建时会获取的内容。何时能看到取决于项目：

- **Backend**：Home Assistant Core 的每次构建都会下载这些翻译，因此你的字符串会出现在下一个每夜构建（nightly build）、下一个测试版（beta）和下一个正式版本中。
- **Frontend**：前端是独立构建和发布的，并在那一刻下载翻译。每都会生成一个前端每夜构建，Home Assistant 的每夜构建会使用它。Home Assistant 的测试版或正式版会附带特定的前端版本，因此你的字符串会在你保存之后构建的第一个前端版本中发布。

[翻译的工作原理](https://www.hasscn.top/contributors/translate/how-it-works/#how-translations-get-back)中有详细说明。

伴侣应用的工作方式略有不同。Android 也在构建时拉取翻译，而 iOS 应用则通过其代码仓库中的每日拉取请求获取翻译。

## 接下来做什么

- 阅读[翻译规则](https://www.hasscn.top/contributors/translate/reference/rules/)。它们很短。
- 查看是否有[针对你的语言的指南](https://www.hasscn.top/contributors/translate/reference/languages/)，例如是否使用正式或非正式的称呼。
- 加入另一个项目。Backend 项目有大量字符串，经常需要帮助。
