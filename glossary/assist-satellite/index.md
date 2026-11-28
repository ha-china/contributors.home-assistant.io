# Assist 卫星

> 一种监听语音命令并将其发送到 Home Assistant 的设备，例如 Home Assistant Voice Preview Edition。

Source: https://www.hasscn.top/contributors/glossary/assist-satellite/

- In code: `assist_satellite`, `AssistSatelliteEntity`
- Also: voice satellite, satellite, satellites

卫星本身不理解命令。它进行监听（通常监听[唤醒词](https://www.hasscn.top/contributors/glossary/wake-word/)），将音频流式传输到 Home Assistant，并播放回答。每个卫星使用一个 [Assist 管道](https://www.hasscn.top/contributors/glossary/assist-pipeline/)，并且知道自己所在的区域（area），因此“打开灯”在你所在的房间内就能生效。

在 Core 中，卫星是 `assist_satellite` 类型的实体（entity）。参见 [Assist 卫星实体](https://www.hasscn.top/contributors/core/entities/assist-satellite/)。

## Related terms

- [Assist](https://www.hasscn.top/contributors/glossary/assist/): Home Assistant 的语音助手。它将您说的话或输入的内容转化为操作。
- [Assist 管道](https://www.hasscn.top/contributors/glossary/assist-pipeline/): 语音命令所经过的步骤：唤醒词、语音转文本、对话代理以及文本转语音。
- [唤醒词](https://www.hasscn.top/contributors/glossary/wake-word/): 让语音助手开始聆听的词语或短语，例如“Okay Nabu”。
