# 语音转文本实体

> 构建一个语音转文本实体，将音频流转换为 Assist 所需的文本。

Source: https://www.hasscn.top/contributors/core/entities/stt/

语音转文本（speech-to-text，STT）实体接收一段音频流，并返回其中所说的文本。它是 [Assist 流水线](https://www.hasscn.top/contributors/glossary/assist-pipeline/)中从听到语音命令到理解该命令之间的步骤。请继承 `homeassistant.components.stt` 中的 `SpeechToTextEntity`。它可用于任何语音识别引擎，无论是本地还是云端。

## 属性

语音转文本实体除了[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)之外，还具有以下属性。六个 `supported_*` 属性是抽象的：必须将它们中的每一个都实现为属性，没有 `_attr_` 快捷方式可用。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `supported_languages` | `list[str]` | 必需 | 引擎能理解的语言，例如 `en-US`。 |
| `supported_formats` | `list[AudioFormats]` | 必需 | 引擎接受的容器格式。 |
| `supported_codecs` | `list[AudioCodecs]` | 必需 | 引擎接受的编解码器。 |
| `supported_bit_rates` | `list[AudioBitRates]` | 必需 | 引擎接受的比特率。 |
| `supported_sample_rates` | `list[AudioSampleRates]` | 必需 | 引擎接受的采样率。 |
| `supported_channels` | `list[AudioChannels]` | 必需 | 引擎接受的声道布局。 |
| `audio_processing` | `SpeechAudioProcessing` | 见下文 | 音频在到达引擎之前应如何进行准备。 |

## 支持的功能

语音转文本实体没有支持的功能。

## 音频格式

每个音频流都带有描述音频特征的 `SpeechMetadata`。在你的实体接收音频流之前，Home Assistant 会通过 `check_metadata` 将该元数据与你的 `supported_*` 属性进行核对，因此你只会收到你声明能够处理的音频。

| `SpeechMetadata` 字段 | 类型 | 值 |
| ---------------------- | ---- | ------ |
| `language` | `str` | `supported_languages` 之一。 |
| `format` | `AudioFormats` | `WAV`, `OGG` |
| `codec` | `AudioCodecs` | `PCM`, `OPUS` |
| `bit_rate` | `AudioBitRates` | `BITRATE_8`, `BITRATE_16`, `BITRATE_24`, `BITRATE_32` |
| `sample_rate` | `AudioSampleRates` | `SAMPLERATE_8000`, `SAMPLERATE_11000`, `SAMPLERATE_16000`, `SAMPLERATE_18900`, `SAMPLERATE_22000`, `SAMPLERATE_32000`, `SAMPLERATE_37800`, `SAMPLERATE_44100`, `SAMPLERATE_48000` |
| `channel` | `AudioChannels` | `CHANNEL_MONO`, `CHANNEL_STEREO` |

语音卫星设备（voice satellite）以 WAV 格式发送 16 kHz、16 位、单声道的 PCM 音频，因此如果你想与 Assist 硬件配合使用，请至少支持这一组合。

### 音频处理

`audio_processing` 返回来自 `homeassistant.components.stt.models` 的 `SpeechAudioProcessing`。只有当 `requires_external_vad` 为 `True` 时，流水线才会运行自己的语音活动检测（voice activity detection），并且它会在事件中传递所有这三项设置，以便录制音频的设备可以据此进行准备。

| 字段 | 默认值 | 描述 |
| ----- | ------- | ----------- |
| `requires_external_vad` | `True` | Home Assistant 使用自己的语音活动检测来判断语音的结束。当你的引擎自行检测时，请将其设置为 `False`。 |
| `prefers_auto_gain_enabled` | `True` | 音频应启用自动增益控制。 |
| `prefers_noise_reduction_enabled` | `True` | 音频应启用降噪。 |

## 方法

### 处理音频流

实现 `async_process_audio_stream`。它接收元数据和一个由原始音频数据块组成的异步可迭代对象，并在音频流结束时返回一个 `SpeechResult`。

```python
async def async_process_audio_stream(
    self, metadata: SpeechMetadata, stream: AsyncIterable[bytes]
) -> SpeechResult:
    """Process an audio stream to STT service."""
```

`SpeechResult` 包含识别出的 `text`（或 `None`），以及一个为 `SpeechResultState.SUCCESS` 或 `SpeechResultState.ERROR` 的 `result`。

在音频流传入时即时读取并立即转发给你的引擎。如果先等待整个音频流，会让每条响应都增加整个命令的时长。

### 部分结果

当你的引擎在用户仍在说话时就返回转录文本时，请改为实现 `async_process_audio_stream_with_progress`。它是一个具有相同参数的异步生成器。依次产出零个或多个 `PartialSpeechResult` 对象，最后恰好产出一个 `SpeechResult`。

```python
async def async_process_audio_stream_with_progress(
    self, metadata: SpeechMetadata, stream: AsyncIterable[bytes]
) -> AsyncGenerator[PartialSpeechResult | SpeechResult]:
    """Yield partial transcripts, then the final result."""
```

`PartialSpeechResult` 包含说话者到目前为止的完整 `text`，而不仅仅是新说出的词语，还可以包含一个可选的 `speaker_id`。每个部分结果都会替换之前具有相同 `speaker_id` 的部分结果。如果没有这个方法，基类会调用 `async_process_audio_stream` 并只产出其最终结果。

部分结果是新特性：Assist 流水线尚未使用它们，目前只等待最终结果。

## 状态

状态是该实体上次处理音频的时间戳，在首次处理之前为 `unknown`。Home Assistant 会设置并恢复它；`state` 属性是最终值。

## 示例

```python
from collections.abc import AsyncIterable

from homeassistant.components import stt


class MySpeechToText(stt.SpeechToTextEntity):
    """Speech-to-text with a cloud engine."""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, entry: MyConfigEntry) -> None:
        """Set up the entity."""
        self.client = entry.runtime_data
        self._attr_unique_id = f"{entry.entry_id}_stt"

    @property
    def supported_languages(self) -> list[str]:
        return ["en-US", "nl-NL"]

    @property
    def supported_formats(self) -> list[stt.AudioFormats]:
        return [stt.AudioFormats.WAV]

    @property
    def supported_codecs(self) -> list[stt.AudioCodecs]:
        return [stt.AudioCodecs.PCM]

    @property
    def supported_bit_rates(self) -> list[stt.AudioBitRates]:
        return [stt.AudioBitRates.BITRATE_16]

    @property
    def supported_sample_rates(self) -> list[stt.AudioSampleRates]:
        return [stt.AudioSampleRates.SAMPLERATE_16000]

    @property
    def supported_channels(self) -> list[stt.AudioChannels]:
        return [stt.AudioChannels.CHANNEL_MONO]

    async def async_process_audio_stream(
        self, metadata: stt.SpeechMetadata, stream: AsyncIterable[bytes]
    ) -> stt.SpeechResult:
        """Send the audio to the engine as it arrives."""
        try:
            text = await self.client.transcribe(stream, metadata.language)
        except MyClientError:
            return stt.SpeechResult(None, stt.SpeechResultState.ERROR)

        return stt.SpeechResult(text, stt.SpeechResultState.SUCCESS)
```
