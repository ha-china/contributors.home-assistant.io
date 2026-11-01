---
title: "摄像头实体的双向音频"
description: "摄像头实体现在可以声明支持双向音频，因此人们可以通过摄像头和门铃进行通话。"
date: 2026-10-24
authors:
  - Robert Resch
areas:
  - core
---

许多摄像头和门铃都配有扬声器，因此你可以与站在门口的人通话。自 Home Assistant Core 2026.11 起，摄像头实体（entity）可以声明支持双向音频。用户随后可以在观看实时流的同时通过摄像头进行通话。

双向音频作为 Home Assistant Labs 中的预览功能推出。用户可以在 **设置** > **系统** > **实验室** 中开启该功能。

## 你的集成需要做什么

将新的 `camera_entity_capabilities` 属性设置为 `CameraEntityCapabilities` 实例，并将 `two_way_audio` 设为 `True`。此属性默认为 `CameraEntityCapabilities()`，其中 `two_way_audio` 为 `False`。

仅当摄像头确实可以通过 Home Assistant 使用的流接收音频时，才声明双向音频。例如，Reolink 集成仅在摄像头支持双向音频且 Home Assistant 通过 RTSP 从摄像头进行流传输时声明该功能（[home-assistant/core#184716](https://github.com/home-assistant/core/pull/184716)）。

示例：

```python
from homeassistant.components.camera import (
    Camera,
    CameraEntityCapabilities,
    CameraEntityFeature,
)


class MyCamera(Camera):
    """A doorbell camera with a speaker."""

    _attr_supported_features = CameraEntityFeature.STREAM

    def __init__(self, device: MyDevice) -> None:
        """Initialize the camera."""
        super().__init__()
        self._device = device
        self._attr_camera_entity_capabilities = CameraEntityCapabilities(
            two_way_audio=device.supports_two_way_audio and device.protocol == "rtsp"
        )
```

## 前端何时获得双向音频

你的实体声明摄像头能做什么。摄像头平台决定前端获得什么。仅当以下所有条件成立时，它才会报告双向音频：

- 你的实体声明了双向音频。
- 摄像头通过 WebRTC 进行流传输，无论是原生方式还是通过 go2rtc 等 WebRTC 提供商。双向音频不适用于 HLS。
- 用户在实验室中开启了 **双向音频** 预览功能。

浏览器仅在安全连接下才允许访问麦克风。目前，双向音频仅在通过 HTTPS 打开 Home Assistant 时才能使用。

## 更多信息

[摄像头实体文档](/core/entities/camera/#two-way-audio) 描述了双向音频，[实验室文档](/core/development/labs/) 解释了预览功能的工作原理。
