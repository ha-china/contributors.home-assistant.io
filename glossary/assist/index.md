# Assist

> Home Assistant 的语音助手。它将您说的话或输入的内容转化为操作。

Source: https://www.hasscn.top/contributors/glossary/assist/

- In code: `assist_pipeline`, `conversation`

Assist 可在应用程序中、在 Home Assistant Voice Preview Edition 等语音卫星设备上以及其他设备上使用。它在本地运行，或者在用户选择的情况下使用云服务和 AI。

## Related terms

- [意图](https://www.hasscn.top/contributors/glossary/intent/): 语音指令的含义，例如打开某个区域的灯，以及执行该操作所需的详细信息。
- [对话代理（conversation agent）](https://www.hasscn.top/contributors/glossary/conversation-agent/): 理解并回答命令的部分：可以是 Home Assistant 的内置代理，也可以是来自集成的代理，例如 AI 服务。
- [Assist 管道](https://www.hasscn.top/contributors/glossary/assist-pipeline/): 语音命令所经过的步骤：唤醒词、语音转文本、对话代理以及文本转语音。
