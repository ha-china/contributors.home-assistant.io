# 文本转语音实体

> 构建一个文本转语音实体，将文本转换为音频，可一次性完成，也可在语言模型书写的同时流式生成。

Source: https://www.hasscn.top/contributors/core/entities/tts/

文本转语音（text-to-speech，TTS）实体（entity）将文本转换为语音音频。Assist 使用它来朗读其回复，`tts.speak` 动作（action）使用它在媒体播放器上播放消息。请继承 `homeassistant.components.tts` 中的 `TextToSpeechEntity`。任何语音合成引擎（无论是本地的还是云端的）都可以使用它。

## 属性

文本转语音实体在[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)的基础上还具有以下属性。每个属性都可以通过其 `_attr_` 属性来设置，例如 `_attr_supported_languages`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `supported_languages` | `list[str]` | 必填 | 引擎可以朗读的语言。 |
| `default_language` | `str` | 必填 | 调用方未指定语言时使用的语言。 |
| `supported_options` | `list[str] \| None` | `None` | 调用方可以传递的选项，例如 `voice`。包含其他选项的调用将被拒绝。 |
| `default_options` | `Mapping[str, Any] \| None` | `None` | 调用方未设置选项时使用的选项。 |

Home Assistant 在添加实体时会检查 `supported_languages` 和 `default_language`，如果缺少其中任何一个则会引发错误。

## 支持的特性

文本转语音实体没有支持的特性（supported features）。流式输入改为通过你的代码来检测：当你重写 `async_stream_tts_audio` 时，Home Assistant 就会知道引擎可以按块接收文本。

## 选项和音频格式

调用方以字典的形式传递选项，这些选项会合并到 `default_options` 之上。不在 `supported_options` 中的选项不会被丢弃：请求在到达你的引擎之前就会因 `ServiceValidationError` 而失败。对于不在 `supported_languages` 中的语言也是如此。

首选格式选项是个例外。它们总是被接受，Assist 会设置这些选项，使音频适合播放它的设备。

| 选项 | 常量 |
| ------ | -------- |
| `preferred_format` | `ATTR_PREFERRED_FORMAT` |
| `preferred_sample_rate` | `ATTR_PREFERRED_SAMPLE_RATE` |
| `preferred_sample_channels` | `ATTR_PREFERRED_SAMPLE_CHANNELS` |
| `preferred_sample_bytes` | `ATTR_PREFERRED_SAMPLE_BYTES` |
| `preferred_bitrate` | `ATTR_PREFERRED_BITRATE` |

如果你在 `supported_options` 中列出了其中一项，它就会传递给你的引擎，引擎应以该格式生成音频。如果没有列出，Home Assistant 会将其从选项中移除，并在你的引擎返回音频后使用 FFmpeg 进行转换。自行生成正确的格式可以省去这一转换步骤。在没有首选格式的情况下，结果会被转换为 MP3。

## 方法

### 生成音频

实现 `async_get_tts_audio`，对于阻塞式代码则实现 `get_tts_audio`。它接收完整的消息，并返回一个由文件扩展名和音频字节组成的元组，例如 `("mp3", data)`。当引擎没有生成任何内容时，返回 `(None, None)`。Home Assistant 随后会为调用方引发错误。

```python
async def async_get_tts_audio(
    self, message: str, language: str, options: dict[str, Any]
) -> TtsAudioType:
    """Load TTS audio from the engine."""
```

### 流式传输音频

语言模型会分块生成其回答。如果你的引擎可以在文本尚未完整时就开始朗读，也请实现 `async_stream_tts_audio`。它是可选的：如果没有实现，Home Assistant 会收集完整的消息并调用 `async_get_tts_audio`。

```python
async def async_stream_tts_audio(
    self, request: TTSAudioRequest
) -> TTSAudioResponse:
    """Generate speech from an incoming message."""
```

`TTSAudioRequest` 包含 `language`、`options` 以及 `message_gen`（文本块的异步生成器）。返回一个 `TTSAudioResponse`，其中包含文件的 `extension` 和 `data_gen`（音频块的异步生成器）。

### 获取支持的语音

`async_get_supported_voices(language)` 是可选的。针对某种语言返回一个 `Voice(voice_id, name)` 列表，前端就会将它们作为 `voice` 选项的候选提供选择。当引擎没有可供选择的语音时，返回 `None`。它是一个回调函数，因此不得执行 I/O 操作：请在实体设置时获取语音列表。

## 状态

状态是该实体上次生成音频的时间戳，在首次生成之前为 `unknown`。Home Assistant 会设置并恢复它；`state` 属性是最终值。

## 示例

```python
from typing import Any

from homeassistant.components import tts
from homeassistant.core import callback


class MyTextToSpeech(tts.TextToSpeechEntity):
    """Text-to-speech with a cloud engine."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_supported_languages = ["en-US", "nl-NL"]
    _attr_default_language = "en-US"
    _attr_supported_options = [tts.ATTR_VOICE]

    def __init__(self, entry: MyConfigEntry) -> None:
        """Set up the entity."""
        self.client = entry.runtime_data
        self._attr_unique_id = f"{entry.entry_id}_tts"

    @callback
    def async_get_supported_voices(
        self, language: str
    ) -> list[tts.Voice] | None:
        """Return the voices for a language."""
        return [
            tts.Voice(voice.id, voice.name)
            for voice in self.client.voices
            if voice.language == language
        ]

    async def async_get_tts_audio(
        self, message: str, language: str, options: dict[str, Any]
    ) -> tts.TtsAudioType:
        """Turn the message into audio."""
        try:
            data = await self.client.speak(
                message, language, voice=options.get(tts.ATTR_VOICE)
            )
        except MyClientError:
            return None, None

        return "mp3", data
```
