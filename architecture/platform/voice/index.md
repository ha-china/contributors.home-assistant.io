# 语音是如何工作的

> 一句话如何变成一个动作：唤醒词、语音转文本、对话代理和文本转语音，以及每一步在哪里运行。

Source: https://www.hasscn.top/contributors/architecture/platform/voice/

[Assist](https://www.hasscn.top/contributors/glossary/assist/) 是 Home Assistant 的语音助手。你说“打开厨房的灯”，灯就亮了。这句话背后是一连串步骤，每一步都可以在不同的地方运行：在你说话的设备上、在你的 Home Assistant 上，或在云端。

## 简而言之

- [Assist 流水线（pipeline）](https://www.hasscn.top/contributors/glossary/assist-pipeline/)运行四个步骤：唤醒词、语音转文本、对话代理和文本转语音。
- 每个步骤都是一个独立的引擎，用户为每个步骤选择一个引擎：本地的、来自集成的，或来自 Home Assistant Link 的。
- 对话代理将文本转换为动作。内置的对话代理将句子匹配到[意图（intent）](https://www.hasscn.top/contributors/glossary/intent/)。AI 代理则使用大语言模型。
- 语音卫星设备（voice satellite），如 Home Assistant Voice Preview Edition，是分布在家中各处的麦克风和扬声器。

## 流水线

| 步骤 | 将 | 转换为 | 引擎 |
| --- | --- | --- | --- |
| 唤醒词 | 声音 | “有人说出了唤醒词” | 在卫星设备上，或在 Home Assistant 中 |
| 语音转文本 | 声音 | 文本 | 本地，如 Whisper 或 Speech-to-Phrase，或在云端 |
| 对话代理 | 文本 | 一个动作和一个回答 | 内置代理，或 AI 代理 |
| 文本转语音 | 回答 | 声音 | 本地，如 Piper，或在云端 |

用户在**设置** > **语音助手**中配置流水线，每个卫星设备使用一个。在 Assist 对话框中输入文字也会运行相同的流水线，从对话代理这一步开始。

## 对话代理

**内置代理**完全在本地运行。它使用 hassil 库，根据[Open Home Foundation](https://www.hasscn.top/contributors/glossary/open-home-foundation/) 的[intents 仓库](https://github.com/OHF-Voice/intents)中按语言提供的句子，将句子与模板进行匹配。匹配成功会得到一个意图，例如 `HassTurnOn`，附带区域为厨房、域为 light，然后由 Home Assistant 处理。

**AI 代理**来自连接到大语言模型的集成。Home Assistant 通过其 LLM API 为模型提供工具，使其能够查看和控制用户暴露给 Assist 的实体（entity）。用户可以让内置代理先尝试，只有当它无法理解时才转给 AI。

## 卫星设备

卫星设备是一种带有麦克风和扬声器的设备。它监听唤醒词，将音频流式传输到 Home Assistant，并播放回答。ESPHome 设备（如 Home Assistant Voice Preview Edition）和支持 Wyoming 协议的设备都可以作为卫星设备。每个卫星设备都是一个 `assist_satellite` 实体。

## 深入了解

- [Assist 流水线](https://www.hasscn.top/contributors/core/internals/assist-pipelines/)：运行流水线、其事件，以及音频如何发送
- [意图](https://www.hasscn.top/contributors/core/internals/intents/)和[内置意图](https://www.hasscn.top/contributors/core/internals/built-in-intents/)：一句话如何变成一个动作
- [对话 API](https://www.hasscn.top/contributors/core/internals/conversation-api/) 和 [LLM API](https://www.hasscn.top/contributors/core/internals/llm-api/)：面向代理和 AI 集成
- 每个步骤背后的实体：[唤醒词](https://www.hasscn.top/contributors/core/entities/wake-word/)、[语音转文本](https://www.hasscn.top/contributors/core/entities/stt/)、[对话](https://www.hasscn.top/contributors/core/entities/conversation/)、[文本转语音](https://www.hasscn.top/contributors/core/entities/tts/)和 [Assist 卫星设备](https://www.hasscn.top/contributors/core/entities/assist-satellite/)
- [语音翻译](https://www.hasscn.top/contributors/translate/voice/)：Assist 按语言所能理解的句子

## 参与其中

- 会说一种 Assist 还不能很好理解的语言？[语音翻译](https://www.hasscn.top/contributors/translate/voice/)是你的起点，无需编程。
- 正在开发语音引擎、AI 代理或卫星设备？从[你对 Core 的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始，然后阅读“深入了解”下的页面。
