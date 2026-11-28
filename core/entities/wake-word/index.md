# 唤醒词检测实体

> 构建一个唤醒词实体，监听音频流并在有人说出唤醒词时进行报告。

Source: https://www.hasscn.top/contributors/core/entities/wake-word/

唤醒词检测实体（wake word detection entity）监听音频流，并在听到唤醒词（wake word，也称作 hotword）时告知 Home Assistant，例如“Okay Nabu”。它是 [Assist 流水线（pipeline）](https://www.hasscn.top/contributors/glossary/assist-pipeline/) 的第一步，该流水线在 Home Assistant 中而非设备上运行唤醒词检测。请继承 `homeassistant.components.wake_word` 中的 `WakeWordDetectionEntity`。其域（domain）为 `wake_word`。

许多语音卫星设备（voice satellite）在设备本身上检测唤醒词。它们不需要此实体：该实体适用于在 Home Assistant 一侧运行的引擎，例如通过 Wyoming 集成（integration）使用的 openWakeWord。

## 属性

唤醒词检测实体没有自己的属性，适用[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)。基类会将 `entity_category` 设置为 `EntityCategory.DIAGNOSTIC`，并关闭轮询。

## 支持的功能

唤醒词检测实体没有任何受支持的功能。

## 音频

音频流是 `(audio_chunk, timestamp)` 元组的异步可迭代对象（async iterable）：

- `audio_chunk`：16 kHz 的 16 位有符号单声道 PCM 采样。
- `timestamp`：自音频流开始以来经过的毫秒数。

在流水线中，唤醒词检测与语音转文本（speech-to-text）共享同一个音频流。你的实体消费掉的音频块（chunk）对语音转文本而言就消失了，除非你将其交还。如果你的引擎会缓冲音频，请在结果的 `queued_audio` 中返回这些缓冲的音频块，这样语音命令的开头就不会丢失。

## 方法

### 获取支持的唤醒词

实现 `get_supported_wake_words` 以返回该实体能够检测的唤醒词。尽管名称中没有体现，但它是异步的。

```python
async def get_supported_wake_words(self) -> list[WakeWord]:
    """Return a list of supported wake words."""
```

一个 `WakeWord` 具有一个 `id`（在实体内唯一）、一个用于界面的 `name`，以及一个可选的 `phrase`，即人们实际说出的词语。前端通过 `wake_word/info` WebSocket 命令获取此列表，该命令会在 10 秒后放弃，因此请保持足够快。

### 处理音频流

实现 `_async_process_audio_stream`。注意开头的下划线：公开的 `async_process_audio_stream` 会包装它并更新状态。

```python
async def _async_process_audio_stream(
    self,
    stream: AsyncIterable[tuple[bytes, int]],
    wake_word_id: str | None,
) -> DetectionResult | None:
    """Try to detect a wake word in an audio stream."""
```

`wake_word_id` 是要监听的唤醒词，或为 `None` 以监听其中任意一个。当音频流结束时未检测到唤醒词，则返回 `None`。当听到唤醒词时，返回一个 `DetectionResult`：

| 字段 | 类型 | 描述 |
| ----- | ---- | ----------- |
| `wake_word_id` | `str` | 检测到的唤醒词的 ID。 |
| `wake_word_phrase` | `str` | 检测到的唤醒词的短语。 |
| `timestamp` | `int \| None` | 你检测到它的那个音频块的时间戳。 |
| `queued_audio` | `list[tuple[bytes, int]] \| None` | 你已消费且语音转文本仍需要的音频块。 |

## 状态

状态是最后一次检测的时间戳，在首次检测之前为 `unknown`。Home Assistant 会设置并恢复它；`state` 属性是 final 的。

## 示例

```python
from collections.abc import AsyncIterable

from homeassistant.components import wake_word


class MyWakeWord(wake_word.WakeWordDetectionEntity):
    """Wake word detection with a local engine."""

    _attr_has_entity_name = True
    _attr_name = None

    def __init__(self, entry: MyConfigEntry) -> None:
        """Set up the entity."""
        self.engine = entry.runtime_data
        self._attr_unique_id = f"{entry.entry_id}_wake_word"

    async def get_supported_wake_words(self) -> list[wake_word.WakeWord]:
        """Return the wake words of the engine."""
        return [wake_word.WakeWord(id="okay_nabu", name="Okay Nabu")]

    async def _async_process_audio_stream(
        self,
        stream: AsyncIterable[tuple[bytes, int]],
        wake_word_id: str | None,
    ) -> wake_word.DetectionResult | None:
        """Feed audio to the engine until it hears the wake word."""
        async for chunk, timestamp in stream:
            if self.engine.process(chunk):
                return wake_word.DetectionResult(
                    wake_word_id="okay_nabu",
                    wake_word_phrase="okay nabu",
                    timestamp=timestamp,
                )

        return None
```
