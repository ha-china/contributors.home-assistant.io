# 语言负责人

> intents 仓库中的每种语言都有负责人来审核其变更。这个角色需要做什么，以及如何成为其中一员。

Source: https://www.hasscn.top/contributors/translate/voice/language-leaders/

Assist 应当以人们的母语理解他们，并很好地理解他们。为了保持每种语言的质量，每种语言都设有语言负责人（language leader）：由母语使用者来照看自己的语言。

## 语言负责人做什么

- **审核其语言的每一项变更。** 每当有触及该语言文件夹的拉取请求（pull request）时，他们都会收到通知，并决定该请求是否被合并。
- **守护质量。** 他们检查句子是否正确、自然，并与该语言的其余部分保持一致。一个漏网的句子可能会匹配到错误的内容，或者完全无法匹配。
- **保持语言的一致性。** 他们决定诸如使用正式还是非正式称呼，以及常用事物使用哪些词语等选择。

语言负责人拥有其语言的 [`sentences/`](https://github.com/OHF-Voice/intents/tree/main/sentences)、[`responses/`](https://github.com/OHF-Voice/intents/tree/main/responses)、[`tests/`](https://github.com/OHF-Voice/intents/tree/main/tests)、[`rules/`](https://github.com/OHF-Voice/intents/tree/main/rules) 和 [`lists/`](https://github.com/OHF-Voice/intents/tree/main/lists) 文件夹。他们修改这些文件夹时不需要其他人的批准。

## 负责人是谁

每种语言的负责人在 [`languages.yaml`](https://github.com/OHF-Voice/intents/blob/main/languages.yaml) 的 `leaders` 项下列出，并附有他们的 GitHub 用户名。[`CODEOWNERS`](https://github.com/OHF-Voice/intents/blob/main/CODEOWNERS) 文件就是根据该列表生成的，GitHub 由此知道该请谁进行审核。你也可以在[支持的语言](https://www.hasscn.top/contributors/translate/voice/languages/)表格中找到他们。

## 成为语言负责人

任何人都可以申请，只要你：

- 是该语言的母语使用者。
- 已向 intents 仓库提交过至少两个拉取请求。
- 协助审核该语言的拉取请求。

要申请，请在 [intents discussions](https://github.com/OHF-Voice/intents/discussions) 中发起一个话题，或在 Home Assistant [Discord 服务器](https://www.home-assistant.io/join-chat)的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道中询问。

有些语言还没有负责人。如果你的语言是其中之一，那就是你的机会：做出贡献，审核他人发起的请求，然后申请。

## 失去该角色

语言负责人是一门语言的守门人。当负责人不活跃时，对该语言的贡献就会搁置。当负责人接受低质量的变更时，Assist 就无法正确理解人们。

因此，如果负责人成为瓶颈，或者质量不够好，他们将被移除负责人身份。他们之后可以再次申请。
