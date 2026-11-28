# 语音

> 教 Assist 学会你的语言。编写它能理解的句子和它给出的回答，并帮助训练其背后的语音。

Source: https://www.hasscn.top/contributors/translate/voice/

Assist 是 Home Assistant 的语音助手，它可以在不向云端发送任何数据的情况下理解诸如“打开厨房的灯”这样的命令。之所以能做到这一点，是因为人们为自己的语言写下了某人可能表达该命令的多种说法。这项工作在 GitHub 上的 [intents 仓库](https://github.com/OHF-Voice/intents) 中进行，它是一种与 Lokalise 中界面文本翻译不同的翻译方式。

你不需要逐句翻译。你使用一种紧凑的模板语法来描述你的语言中人们如何表达一个命令，并添加测试来证明其有效。如果你的母语是该语言，并且熟悉编辑 YAML 文件，你就可以提供帮助。

## 适合谁

- 希望 Assist 能理解自己的语言，或理解得更好的**母语使用者**。
- 为自己的语言审核工作的**语言负责人**。
- 想了解存在哪些意图（intent）以及句子如何转化为操作的**开发者**。

## 如何开始

1. 阅读 [Assist 如何理解语言](https://www.hasscn.top/contributors/translate/voice/how-assist-understands/)。它解释了意图（intent）、槽位（slot）和槽位组合，这些是你随处可见的词汇。
2. 在[进度总览](https://ohf-voice.github.io/intents/)上查找你的语言。它会按意图显示你的语言已经覆盖了哪些内容。
3. 选择一个缺失或薄弱的意图，并按照[贡献句子和回答](https://www.hasscn.top/contributors/translate/voice/contributing/)进行操作。

从小处着手。针对一种语言、一个意图的拉取请求（pull request）比一个大型的拉取请求审核起来快得多。

## 指南

- [Assist 如何理解语言](https://www.hasscn.top/contributors/translate/voice/how-assist-understands/)：意图、句子、槽位、列表和回答，以及它们如何协同工作。
- [贡献句子和回答](https://www.hasscn.top/contributors/translate/voice/contributing/)：intents 仓库中的工作流程，从第一次编辑到合并拉取请求。
- [风格指南](https://www.hasscn.top/contributors/translate/voice/style-guide/)：如何编写效果良好的句子和回答。
- [支持的语言](https://www.hasscn.top/contributors/translate/voice/languages/)：Assist 已知的语言，以及如何添加新语言。
- [语言负责人](https://www.hasscn.top/contributors/translate/voice/language-leaders/)：他们的职责，以及如何成为其中一员。
- [贡献你的声音](https://www.hasscn.top/contributors/translate/voice/contributing-your-voice/)：帮助训练你的语言的语音识别和语音。

## 参考

- [模板句子语法](https://www.hasscn.top/contributors/translate/voice/template-syntax/)：句子文件、列表、展开规则和回答的完整语法。
- [测试语法](https://www.hasscn.top/contributors/translate/voice/test-syntax/)：如何为你的句子编写测试。
- [内置意图](https://www.hasscn.top/contributors/translate/voice/intents/)：每个意图及其槽位和槽位组合。

## 联系谁

- 关于你的语言的问题？询问语言负责人，名单见 [`languages.yaml`](https://github.com/OHF-Voice/intents/blob/main/languages.yaml)。他们审核对该语言的每一处更改。
- 关于仓库、工具，或某个不适合你的语言的意图的问题？请使用 [intents discussions](https://github.com/OHF-Voice/intents/discussions)，或提交一个 [issue](https://github.com/OHF-Voice/intents/issues)。
- 想聊天？加入 Home Assistant [Discord 服务器](https://www.home-assistant.io/join-chat)上的 [**#language-leaders**](https://discord.com/channels/330944238910963714/1257022942961991781) 频道。看不到它？请在 **Channels & Roles** 下选择正确的角色。
- 编写处理或触发意图的代码？相关内容请参阅 [Core internals](https://www.hasscn.top/contributors/core/internals/)。
