# Assist 卫星实体

> 为监听语音命令并说出响应的设备构建 Assist 卫星实体。

Source: https://www.hasscn.top/contributors/core/entities/assist-satellite/

Assist 卫星实体（Assist satellite entity）表示一种带有麦克风（通常还有扬声器）、供人们与之交谈的设备，例如语音助手音箱。设备将音频流式传输到 Home Assistant，由 Home Assistant 对其运行 [Assist 流水线](https://www.hasscn.top/contributors/glossary/assist-pipeline/)（Assist pipeline）并返回响应。该实体跟踪设备在对话中所处的阶段，并允许自动化让它说话或提问。请继承 `homeassistant.components.assist_satellite` 中的 `AssistSatelliteEntity`。

该实体本身不进行语音识别或语音合成：这是流水线中[语音转文本](https://www.hasscn.top/contributors/core/entities/stt/)（speech-to-text）、[对话](https://www.hasscn.top/contributors/core/entities/conversation/)（conversation）和[文本转语音](https://www.hasscn.top/contributors/core/entities/tts/)（text-to-speech）实体的工作。卫星实体负责在设备与流水线之间传递音频和事件。

## 属性

Assist 卫星实体在[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)（generic entity properties）之外还具有以下属性。每个属性都可以通过其 `_attr_` 属性设置，例如 `_attr_pipeline_entity_id`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `pipeline_entity_id` | `str \| None` | `None` | 为此设备选择流水线的[选择实体](https://www.hasscn.top/contributors/core/entities/select/)（select entity）的实体 ID。为 `None` 时，使用首选流水线。 |
| `vad_sensitivity_entity_id` | `str \| None` | `None` | 设置语音活动检测（voice activity detection，VAD）灵敏度的选择实体的实体 ID，它决定多长的静音会结束命令。 |
| `tts_options` | `dict[str, Any] \| None` | `None` | 传递给文本转语音（text-to-speech）用于响应的选项，例如设备首选的音频格式。参见[选项和音频格式](https://www.hasscn.top/contributors/core/entities/tts/#options-and-audio-formats)。 |

`assist_pipeline` 集成提供了用于流水线和灵敏度的现成选择实体，您可以将它们添加到同一设备上。

## 支持的功能

使用按位或（`|`）运算符组合 `AssistSatelliteEntityFeature` 的值。

| 值 | 描述 |
| ----- | ----------- |
| `ANNOUNCE` | 设备可以播放由 Home Assistant 发起的公告。实现 `async_announce`。启用 `assist_satellite.announce` 动作以及前端中的连接测试。 |
| `START_CONVERSATION` | 设备可以播放公告，然后监听回复。实现 `async_start_conversation`。启用 `assist_satellite.start_conversation` 动作。`assist_satellite.ask_question` 动作也会使用它。当流水线使用内置的 Home Assistant 对话代理（conversation agent）时，启动对话会失败，因为该代理不会保持对话的连续性。 |

## 运行流水线

当设备听到唤醒词（wake word）或有人按下其按钮时，使用 `async_accept_pipeline_from_satellite` 启动流水线，并将设备的音频流传给它。不要以其他方式运行流水线：此方法会挑选流水线、跨多轮对话保持会话 ID，并处理正在进行中的公告和提问。

```python
await self.async_accept_pipeline_from_satellite(
    audio_stream,
    start_stage=PipelineStage.STT,
    end_stage=PipelineStage.TTS,
    wake_word_phrase="okay nabu",
)
```

音频必须为 16 kHz、16 位、单声道 PCM。当设备自行检测到唤醒词时，传入 `wake_word_phrase`；或者从 `PipelineStage.WAKE_WORD` 开始，让 Home Assistant 来检测唤醒词。

为了在语音设置向导中捕获下一个唤醒词，Home Assistant 只会查看以 `PipelineStage.STT` 开始并带有 `wake_word_phrase` 的流水线。由 Home Assistant 自行检测的唤醒词无法被拦截。

每个流水线事件都会发送到您的 `on_pipeline_event` 方法，您可以在其中转发设备所需的内容，例如响应音频的 URL。状态会自行跟随事件变化，只有一个例外：在响应之后，一旦设备说完话，就调用 `tts_response_finished()`，以回到 `idle` 状态。

## 方法

| 方法 | 是否必需 | 描述 |
| ------ | -------- | ----------- |
| `on_pipeline_event(event)` | 是 | 处理正在运行的流水线的事件。它是一个回调，因此不得使用 await。 |
| `async_get_configuration()` | 是 | 返回当前的 `AssistSatelliteConfiguration`。它是一个回调，因此应返回缓存的副本，并在设置时从设备获取。 |
| `async_set_configuration(config)` | 是 | 将新配置应用到设备。在设备与 Home Assistant 就该配置达成一致后返回。 |
| `async_announce(announcement)` | 需要 `ANNOUNCE` | 播放公告。仅在播放完毕后才返回。 |
| `async_start_conversation(start_announcement)` | 需要 `START_CONVERSATION` | 播放公告，然后监听回复并对其运行流水线。在公告播放完毕后返回。 |

### 配置

`AssistSatelliteConfiguration` 描述设备的唤醒词：

| 字段 | 类型 | 描述 |
| ----- | ---- | ----------- |
| `available_wake_words` | `list[AssistSatelliteWakeWord]` | 设备可以监听的唤醒词，每个唤醒词包含一个 `id`、`wake_word` 短语及其 `trained_languages`。 |
| `active_wake_words` | `list[str]` | 设备当前监听的唤醒词的 ID。 |
| `max_active_wake_words` | `int` | 可以同时处于活动状态的唤醒词数量。 |

前端通过 `assist_satellite/get_configuration` 和 `assist_satellite/set_wake_words` WebSocket 命令读取和更改此配置。`get_configuration` 还会返回卫星的 `pipeline_entity_id` 和 VAD 灵敏度实体（作为 `vad_entity_id`）。`set_wake_words` 接受一个 `wake_word_ids` 列表：Home Assistant 会拒绝不在 `available_wake_words` 中的 ID，以及数量超过 `max_active_wake_words` 所允许的 ID。语音设置向导还会使用 `assist_satellite/intercept_wake_word` 来捕获下一个唤醒词并将其显示给用户。

### 公告

`async_announce` 和 `async_start_conversation` 会接收一个 `AssistSatelliteAnnouncement`。Home Assistant 已经将消息转换为音频，因此您只需播放媒体：

| 字段 | 描述 |
| ----- | ----------- |
| `message` | 公告的文本，如果设备有屏幕，则显示在屏幕上。 |
| `media_id` | 要播放的音频的 URL。 |
| `preannounce_media_id` | 在 `media_id` 之前播放的声音，例如提示音，或为 `None` 以跳过。 |
| `original_media_id` | 调用方传入的原始媒体 ID，即 Home Assistant 解析之前的媒体 ID。 |
| `media_id_source` | 音频的来源：`url`、`media_id` 或 `tts`。 |
| `tts_token` | 生成的文本转语音音频的令牌（token）（如有）。 |

使用 `ask_question` 时，Home Assistant 会调用 `async_start_conversation`，然后在语音转文本（speech-to-text）之后停止下一个流水线，并将转录文本与调用方给出的答案进行匹配。为此，请从语音转文本开始运行回复的流水线，这是 `async_accept_pipeline_from_satellite` 的默认 `start_stage`。从唤醒词开始的流水线会继续运行越过语音转文本阶段。

在公告播放期间，Home Assistant 会将状态设置为 `responding`，并在您的方法返回时恢复为 `idle`。如果在第一个公告播放期间收到第二个公告，则会引发 `SatelliteBusyError`。

## 状态

状态跟随流水线，取自 `AssistSatelliteState` 枚举。状态由 Home Assistant 设置；`state` 属性是 final（不可重写）。

| 值 | 描述 |
| ----- | ----------- |
| `idle` | 正在等待唤醒词或按钮按下。 |
| `listening` | 正在将语音命令流式传输到 Home Assistant。 |
| `processing` | Home Assistant 正在分析命令的含义。 |
| `responding` | 正在播报响应或公告。 |

## 示例

```python
from homeassistant.components import assist_satellite
from homeassistant.components.assist_pipeline import (
    PipelineEvent,
    PipelineEventType,
)
from homeassistant.core import callback

Feature = assist_satellite.AssistSatelliteEntityFeature


class MySatellite(assist_satellite.AssistSatelliteEntity):
    """A voice satellite speaker."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_supported_features = Feature.ANNOUNCE

    def __init__(self, device: MyDevice) -> None:
        """Set up the entity."""
        self.device = device
        self._attr_unique_id = f"{device.serial}_satellite"

    @callback
    def async_get_configuration(
        self,
    ) -> assist_satellite.AssistSatelliteConfiguration:
        """Return the cached configuration."""
        return self.device.configuration

    async def async_set_configuration(
        self, config: assist_satellite.AssistSatelliteConfiguration
    ) -> None:
        """Send the new wake words to the device."""
        await self.device.set_wake_words(config.active_wake_words)

    @callback
    def on_pipeline_event(self, event: PipelineEvent) -> None:
        """Forward the response audio to the device."""
        if event.type is not PipelineEventType.TTS_END or not event.data:
            return

        if tts_output := event.data["tts_output"]:
            self.device.play(
                tts_output["url"], on_done=self.tts_response_finished
            )

    async def async_announce(
        self, announcement: assist_satellite.AssistSatelliteAnnouncement
    ) -> None:
        """Play an announcement and wait until it is done."""
        await self.device.play_and_wait(announcement.media_id)
```
