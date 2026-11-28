# 对话代理（conversation agent）

> 理解并回答命令的部分：可以是 Home Assistant 的内置代理，也可以是来自集成的代理，例如 AI 服务。

Source: https://www.hasscn.top/contributors/glossary/conversation-agent/

- In code: `ConversationEntity`, `conversation`
- Also: conversation agents, agent

内置代理将句子匹配到意图（intent），并在本地运行。来自集成的代理可以使用大语言模型，并通过工具控制家庭。

## Related terms

- [Assist](https://www.hasscn.top/contributors/glossary/assist/): Home Assistant 的语音助手。它将您说的话或输入的内容转化为操作。
- [意图](https://www.hasscn.top/contributors/glossary/intent/): 语音指令的含义，例如打开某个区域的灯，以及执行该操作所需的详细信息。
- [Assist 管道](https://www.hasscn.top/contributors/glossary/assist-pipeline/): 语音命令所经过的步骤：唤醒词、语音转文本、对话代理以及文本转语音。
