# 唤醒词

> 让语音助手开始聆听的词语或短语，例如“Okay Nabu”。

Source: https://www.hasscn.top/contributors/glossary/wake-word/

- In code: `wake_word`
- In the UI: Wake word
- Also: wake words, wake word detection

检测唤醒词是 [Assist 流水线](https://www.hasscn.top/contributors/glossary/assist-pipeline/)的第一步。它可以在 Home Assistant 中进行，使用 `wake_word` 集成和诸如 openWakeWord 之类的引擎；也可以在设备本身上进行，例如在 ESP32 或 Android 手机上使用 microWakeWord。只有在检测到唤醒词之后，命令的其余部分才会被处理。

## Related terms

- [Assist 管道](https://www.hasscn.top/contributors/glossary/assist-pipeline/): 语音命令所经过的步骤：唤醒词、语音转文本、对话代理以及文本转语音。
- [Assist 卫星](https://www.hasscn.top/contributors/glossary/assist-satellite/): 一种监听语音命令并将其发送到 Home Assistant 的设备，例如 Home Assistant Voice Preview Edition。
- [Assist](https://www.hasscn.top/contributors/glossary/assist/): Home Assistant 的语音助手。它将您说的话或输入的内容转化为操作。
