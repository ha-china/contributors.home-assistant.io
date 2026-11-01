---
title: 摄像头实体
description: 显示摄像头的静态图像，以及可选的通过 HLS 或 WebRTC 传输的实时视频流。
sidebarLabel: Camera
sidebarGroup: Media
---

摄像头实体（camera entity）提供来自摄像头的图像：按需提供静态图像，并且在摄像头支持的情况下提供实时视频流。它支撑着仪表盘（dashboard）上的摄像头画面、通知中的快照，以及通过 `camera.record` 动作进行的录制。

继承自 `Camera`，从 `homeassistant.components.camera` 导入。任何显示实时或准实时画面的场景都可以使用它。如果你的设备只有一张会不时更新的静态图像，例如地图或二维码，那么[图像实体](/core/entities/image/)（image entity）会更简单。

## 属性

这些属性是摄像头实体特有的。每个实体都具有的通用属性请参见[实体类](/core/entities/entity-class/)（entity class）。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `brand` | `str \| None` | `None` | The brand of the camera. |
| `camera_entity_capabilities` | `CameraEntityCapabilities` | `CameraEntityCapabilities()` | What the camera supports. See [Two-way audio](#two-way-audio). |
| `model` | `str \| None` | `None` | The model of the camera. |
| `frame_interval` | `float` | `0.5` | Seconds between frames of the MJPEG stream that Home Assistant builds from still images. |
| `is_on` | `bool` | `True` | Whether the camera is on. When it is off, image requests fail with a "service unavailable" response. |
| `is_recording` | `bool` | `False` | Whether the camera is recording. Sets the state. |
| `is_streaming` | `bool` | `False` | Whether the camera is streaming. Sets the state. |
| `motion_detection_enabled` | `bool` | `False` | Whether motion detection is on. |
| `use_stream_for_stills` | `bool` | `False` | Take still images from the stream instead of calling `async_camera_image`. Only a property: there is no `_attr_` for it. |
| `content_type` | `str` | `"image/jpeg"` | The MIME type of the images you return. A plain instance attribute set in `__init__`, not a property. |
| `stream_options` | `dict` | `{}` | Options passed to the stream integration when it opens your stream source. A plain instance attribute. |

摄像头默认不进行轮询（`should_poll` 为 `False`）。当你重写 `__init__` 时，请调用 `super().__init__()`：它会完成访问令牌、视频流以及 WebRTC 内部记录的设置。

## 支持的功能

使用按位或（`|`）运算符组合 `CameraEntityFeature` 的各个标志。

| 标志 | 描述 |
| --- | --- |
| `ON_OFF` | 摄像头可以开启和关闭。需实现 `turn_on` 和 `turn_off`。 |
| `STREAM` | 摄像头具有实时视频流。需实现用于 HLS 的 `stream_source`，或原生 WebRTC 方法。 |

## 静态图像

每个摄像头都通过 `async_camera_image`（或 `camera_image`）返回静态图像。前端会为缩略图和仪表盘调用它，`camera.snapshot` 动作会将其结果保存到磁盘。

前端可以请求 `width` 和 `height`。缩放是尽力而为的：

- 如果你的摄像头能够缩放，请传递该尺寸，并返回不小于该尺寸的最小图像。
- 保持宽高比。当宽高比不匹配时，返回的图像可能比请求的更宽或更高。
- 如果你无法缩放且返回的是 JPEG，Home Assistant 会代你进行缩放。

如果摄像头有视频流但没有单独的快照端点，请将 `use_stream_for_stills` 设置为 `True`，Home Assistant 将从视频流中抓取静态图像。另一种常见方法是将流源传递给 FFmpeg 集成（`homeassistant.components.ffmpeg`）的 `async_get_image`，它会从中抓取一帧。

## 视频流

具有 `CameraEntityFeature.STREAM` 的摄像头通过以下两种方式之一提供实时视频流。前端会根据摄像头提供的内容选择播放器。

### 通过 stream 集成的 HLS

实现 `stream_source` 并返回一个 FFmpeg 可以打开的 URL，通常是 RTSP URL。Home Assistant 的 stream 集成会将其转换为 HLS 供前端使用，同时也将其用于 `camera.record` 和 `camera.play_stream`。

当另一个集成（例如 go2rtc 集成）注册了能够处理你的流源的 WebRTC 提供程序（provider）时，前端也会为你的摄像头使用 WebRTC。你无需为此执行任何操作。

### 原生 WebRTC

如果你的摄像头或云端本身支持 WebRTC，请改为实现以下方法：

- `async_handle_async_webrtc_offer(offer_sdp, session_id, send_message)`：为前端的 SDP offer 启动一个会话。通过 `send_message` 回调发回应答、候选（candidate）和错误，对应 `WebRTCAnswer`、`WebRTCCandidate` 和 `WebRTCError`。
- `async_on_webrtc_candidate(session_id, candidate)`：处理前端在 offer 之后发送的 ICE candidate。实现 offer 方法时必须实现此方法。
- `close_webrtc_session(session_id)`：可选。当前端关闭视频流时进行清理。

一旦重写了 `async_handle_async_webrtc_offer`，前端将仅使用 WebRTC，永远不会回退到 HLS。原生 WebRTC 流不经过 stream 集成，因此无法使用录制功能。要向 WebRTC 客户端传递额外设置（例如数据通道），请重写 `_async_get_webrtc_client_configuration` 并返回一个 `WebRTCClientConfiguration`。

### WebRTC 提供程序

集成也可以基于其他集成的摄像头的流源，为这些摄像头提供 WebRTC。实现 `CameraWebRTCProvider`，并通过 `async_register_webrtc_provider(hass, provider)` 注册它。提供程序通过 `async_is_supported` 告诉 Home Assistant 它支持哪些流源，并为这些摄像头处理 offer 和 candidate。go2rtc 就是这样工作的，你很少会需要用到它。

### Two-way audio

When the camera has a speaker, people can talk through it while they watch the live stream. To offer this, set `camera_entity_capabilities` to a `CameraEntityCapabilities` with `two_way_audio` as `True`, imported from `homeassistant.components.camera`.

Only declare it when the camera can receive audio over the stream Home Assistant uses.

```python
self._attr_camera_entity_capabilities = CameraEntityCapabilities(
    two_way_audio=device.supports_two_way_audio and device.protocol == "rtsp"
)
```

The frontend gets two-way audio only when all of these hold:

- Your entity declares two-way audio.
- The camera streams over WebRTC, natively or through a WebRTC provider. Two-way audio is not available over HLS.
- The user turned on the **Two-way audio** preview feature of the camera integration in [Labs](/core/development/labs/). The browser only gives access to the microphone over HTTPS, so two-way audio needs Home Assistant to be opened over HTTPS.


## Methods

每个方法都有一个同步（sync）和一个异步（async）变体。实现其中之一即可。

| 方法 | 同步变体 | 描述 |
| --- | --- | --- |
| `async_camera_image(width=None, height=None)` | `camera_image` | 返回静态图像的字节，或 `None`。 |
| `stream_source()` | 无 | 仅异步。返回流 URL，或 `None`。需要 `STREAM`。 |
| `async_turn_on()` | `turn_on` | 开启摄像头。需要 `ON_OFF`。 |
| `async_turn_off()` | `turn_off` | 关闭摄像头。需要 `ON_OFF`。 |
| `async_enable_motion_detection()` | `enable_motion_detection` | 开启移动侦测。 |
| `async_disable_motion_detection()` | `disable_motion_detection` | 关闭移动侦测。 |
| `handle_async_mjpeg_stream(request)` | 无 | 可选。直接代理来自摄像头的 MJPEG 流。默认情况下，Home Assistant 每隔 `frame_interval` 秒从静态图像构建一个流。 |

原生 WebRTC 方法列在[原生 WebRTC](#native-webrtc)部分中。

## 状态

状态是最终确定的，依次取决于 `is_recording` 和 `is_streaming`。这些值定义在 `CameraState` 枚举中。

| 状态 | 何时 |
| --- | --- |
| `recording` | `is_recording` 为 `True`。 |
| `streaming` | `is_streaming` 为 `True`，且摄像头未在录制。 |
| `idle` | 两者皆非。 |

摄像头会将 `access_token` 添加为属性，并且在设置了相应值时，还会添加 `model_name`、`brand` 和 `motion_detection`。访问令牌和实体图片被排除在[记录器](/glossary/recorder/)（recorder）之外，因为令牌每五分钟轮换一次。

## 示例

一个带有 RTSP 流和快照 URL 的网络摄像头。

```python
from homeassistant.components.camera import Camera, CameraEntityFeature


class MyCamera(Camera):
    """A network camera."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_supported_features = CameraEntityFeature.STREAM

    def __init__(self, device: MyDevice) -> None:
        """Initialize the camera."""
        super().__init__()
        self._device = device
        self._attr_unique_id = device.serial
        self._attr_brand = "Example"
        self._attr_model = device.model

    async def async_camera_image(
        self, width: int | None = None, height: int | None = None
    ) -> bytes | None:
        """Return a snapshot."""
        return await self._device.snapshot(width=width, height=height)

    async def stream_source(self) -> str | None:
        """Return the RTSP URL of the main stream."""
        return self._device.rtsp_url
```
