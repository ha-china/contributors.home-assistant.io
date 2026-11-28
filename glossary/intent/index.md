# 意图

> 语音指令的含义，例如打开某个区域的灯，以及执行该操作所需的详细信息。

Source: https://www.hasscn.top/contributors/glossary/intent/

- In code: `intent`, `HassTurnOn`
- Also: intents

“打开厨房的灯”和“厨房的灯打开”是不同的句子，但具有相同的意图（intent）：`HassTurnOn`，其区域（area）为厨房，域（domain）为 light。每种语言的句子都存放在 [OHF-Voice/intents](https://github.com/OHF-Voice/intents) 仓库中。

## Related terms

- [Assist](https://www.hasscn.top/contributors/glossary/assist/): Home Assistant 的语音助手。它将您说的话或输入的内容转化为操作。
- [对话代理（conversation agent）](https://www.hasscn.top/contributors/glossary/conversation-agent/): 理解并回答命令的部分：可以是 Home Assistant 的内置代理，也可以是来自集成的代理，例如 AI 服务。
