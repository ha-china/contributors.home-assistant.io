---
title: 翻译
description: 让 Home Assistant 支持你的语言。无需编程，只需对自己的语言有良好的感觉。
---

Home Assistant 支持 64 种语言，每一种都是由使用它的用户翻译的。当巴西、日本或芬兰的用户第一次打开 Home Assistant 时，他们看到的文字是由像你一样的志愿者撰写的。

你不需要会编程也能提供帮助。只要你是母语使用者，并且在意你的语言读起来的感觉，你就具备了所需的一切。

## 两种帮助方式

翻译工作分为两类，使用不同的工具：

- **Interface text** is everything you read on screen: menus, settings, dialogs, error messages, and the names of entities and their states. You translate it in your browser, in [Home Assistant's projects on Lokalise](/translate/first-contribution/#1-pick-a-project).
- **Voice commands** are the sentences Home Assistant understands when you talk to Assist, and the answers it gives back. They live in YAML files on GitHub, and language leaders review the changes for their language. See [Voice](/translate/voice/).

大多数人从界面文本开始。上手只需几分钟，而且你翻译的内容无需审核即可发布，参见[翻译如何回归](/translate/how-it-works/#how-translations-get-back)。

## 从这里开始

- [你的第一次翻译](/translate/first-contribution/)：创建账号并翻译你的第一批字符串。
- [翻译的工作原理](/translate/how-it-works/)：字符串从何而来，以及你的工作如何最终进入 Home Assistant。

## 指南

- [占位符与引用](/translate/guides/placeholders/)：字符串中不应翻译的部分，以及原因。
- [申请新语言](/translate/guides/new-language/)：当你的语言尚未支持时。
- [让你的字符串可翻译](/translate/guides/developers/)：面向向 Home Assistant 添加文本的开发者。

## 语音

- [语音](/translate/voice/)：帮助 Assist 理解你的语言，包括它识别的句子和给出的回答。
- [贡献句子与回答](/translate/voice/contributing/)：你在 intents 仓库中的第一次更改。
- [内置意图](/translate/voice/intents/)：每个意图（intent）及其槽位（slot）。

## 参考

- [翻译规则](/translate/reference/rules/)：适用于所有语言的规则。
- [语言指南](/translate/reference/languages/)：按语言制定的约定，以该语言撰写。
- [品牌](/brand/)：Home Assistant 的个性与语气，以及如何书写它的名称。

## 联系谁

- 对某个具体字符串有疑问？在 Lokalise 上给它留言评论。你所在语言的其他翻译者会在那里看到。
- 缺少某种语言，或想讨论翻译的工作方式？请使用 GitHub 上的[本地化讨论区](https://github.com/home-assistant/frontend/discussions/categories/localization)。
- 在做语音命令方面的工作？请前往 [intents 讨论区](https://github.com/OHF-Voice/intents/discussions)，你所在语言的语言负责人会审核你的更改。语言负责人们在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 **#language-leaders** 频道中交流。
