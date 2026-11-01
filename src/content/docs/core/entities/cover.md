---
title: 卷帘实体
description: 构建用于百叶窗、遮光帘、车库门、大门及其他可开合物体的卷帘实体。
sidebarLabel: Cover
sidebarGroup: Openings and security
---

卷帘（cover）实体用于控制通过开口进行开合的物体：百叶窗、遮光帘、窗帘、遮阳篷、车库门、大门以及电动窗。它可以报告和设置位置，对于带有叶片的百叶窗还可以报告和设置倾斜角度（tilt）。请继承 `homeassistant.components.cover` 中的 `CoverEntity`。

卷帘只能用于遮挡开口的物体。控制水或气体流动的设备应使用[阀门（valve）](/core/entities/valve/)。需要上锁和解锁的门应使用[锁（lock）](/core/entities/lock/)。对于其他任何情况，请使用其他实体（entity）类型，例如[数字（number）](/core/entities/number/)，即使在旧集成中使用的是卷帘。

有关前端如何显示卷帘，请参阅[卷帘更多信息视图](/design/more-info/cover/)。

## 属性

卷帘实体除了具有[通用实体属性](/core/entities/entity-class/)之外，还具有以下属性。每个属性都可以通过其对应的 `_attr_` 属性来设置，例如 `_attr_is_closed`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `is_closed` | `bool \| None` | 必填 | 卷帘是否处于关闭状态。用于状态（state）。 |
| `is_opening` | `bool \| None` | `None` | 卷帘是否正在打开。用于状态。 |
| `is_closing` | `bool \| None` | `None` | 卷帘是否正在关闭。用于状态。 |
| `current_cover_position` | `int \| None` | `None` | 位置，取值从 0（关闭）到 100（完全打开）。 |
| `current_cover_tilt_position` | `int \| None` | `None` | 倾斜角度，取值从 0（关闭或无倾斜）到 100（打开或最大倾斜）。 |
| `device_class` | `CoverDeviceClass \| None` | `None` | 卷帘的类别。参见[设备类别](#device-classes)。 |
| `supported_speeds` | `list[str] \| None` | `None` | 卷帘在打开、关闭或移动到某个位置时的运行速度。`None` 或空列表表示不支持速度选择。 |

当您将 `supported_speeds` 设置为列表时，Home Assistant 会将其添加为 `supported_speeds` 属性，并在调用您之前检查操作中的 `speed` 是否在列表中。不在列表中的速度会被丢弃，卷帘会以默认速度移动。如果没有速度，操作中的 `speed` 会被丢弃。

## 设备类别

从 `CoverDeviceClass` 中设置一个[设备类别（device class）](/glossary/device-class/)。它决定了图标、前端中状态的措辞，以及语音助手对卷帘的称呼。

| 值 | 描述 |
| ----- | ----------- |
| `AWNING` | 遮阳篷，例如窗户、门或露台外侧的可伸缩遮篷。 |
| `BLIND` | 百叶窗：通过展开、收拢或倾斜来遮挡开口的联动叶片，例如窗用百叶窗。 |
| `CURTAIN` | 窗帘或帷幔，通常是悬挂在窗户或门上方、可拉开和拉上的布料。 |
| `DAMPER` | 用于减少气流、声音或光线的机械风门。 |
| `DOOR` | 供人员进出某个区域的门，通常是建筑物的一部分。 |
| `GARAGE` | 车库门。 |
| `GATE` | 通向车道或其他区域的大门，位于建筑物外部，通常是围栏的一部分。 |
| `SHADE` | 遮光帘：一整块连续的材料或相连的帘布单元，通过展开或收拢来遮挡开口，例如窗用遮光帘。 |
| `SHUTTER` | 护窗板：通过向外或向内摆动或倾斜叶片来遮挡开口的联动叶片，例如窗用护窗板。 |
| `WINDOW` | 可以打开、关闭或倾斜的窗户。 |

## 支持的功能

将 `CoverEntityFeature` 标志用 `|` 组合起来，并将其设置为 `supported_features`。参见[支持的功能（supported features）](/glossary/supported-features/)。

| 值 | 描述 |
| ----- | ----------- |
| `OPEN` | 卷帘可以打开。实现 `open_cover`。 |
| `CLOSE` | 卷帘可以关闭。实现 `close_cover`。 |
| `SET_POSITION` | 卷帘可以移动到某个位置。实现 `set_cover_position`。 |
| `STOP` | 卷帘在移动过程中可以停止。实现 `stop_cover`。 |
| `OPEN_TILT` | 卷帘可以倾斜打开。实现 `open_cover_tilt`。 |
| `CLOSE_TILT` | 卷帘可以倾斜关闭。实现 `close_cover_tilt`。 |
| `STOP_TILT` | 卷帘在倾斜过程中可以停止。实现 `stop_cover_tilt`。 |
| `SET_TILT_POSITION` | 卷帘可以倾斜到某个位置。实现 `set_cover_tilt_position`。 |
| `SPEED` | 卷帘可以以不同速度移动。设置 `supported_speeds`。 |

如果您完全没有设置 `supported_features`，Home Assistant 会自动推断：包括 `OPEN`、`CLOSE` 和 `STOP`；当卷帘报告位置时会加上 `SET_POSITION`；当它报告倾斜角度时会加上所有倾斜功能；当它支持速度时会加上 `SPEED`。请自行设置这些功能，让前端只显示卷帘真正支持的操作。

## 方法

实现每个方法的同步或异步变体之一，不要同时实现两者。

| 方法 | 异步变体 | 功能 |
| ------ | ------------- | ------- |
| `open_cover(**kwargs: Any)` | `async_open_cover` | `OPEN` |
| `close_cover(**kwargs: Any)` | `async_close_cover` | `CLOSE` |
| `set_cover_position(**kwargs: Any)` | `async_set_cover_position` | `SET_POSITION` |
| `stop_cover(**kwargs: Any)` | `async_stop_cover` | `STOP` |
| `open_cover_tilt(**kwargs: Any)` | `async_open_cover_tilt` | `OPEN_TILT` |
| `close_cover_tilt(**kwargs: Any)` | `async_close_cover_tilt` | `CLOSE_TILT` |
| `set_cover_tilt_position(**kwargs: Any)` | `async_set_cover_tilt_position` | `SET_TILT_POSITION` |
| `stop_cover_tilt(**kwargs: Any)` | `async_stop_cover_tilt` | `STOP_TILT` |

`set_cover_position` 接收 `ATTR_POSITION`，`set_cover_tilt_position` 接收 `ATTR_TILT_POSITION`，两者的取值范围均为 0 到 100。当卷帘具有 `supported_speeds` 时，`open_cover`、`close_cover` 和 `set_cover_position` 可以接收 `ATTR_SPEED`。

切换（toggle）操作已为您处理好。`toggle` 会在卷帘支持 `STOP` 时停止正在移动的卷帘，打开已关闭或正在关闭的卷帘，并关闭正在打开或已完全打开的卷帘。停在半开状态的卷帘会沿其最后报告方向的反方向移动；如果它从未报告过方向，则会关闭。`toggle_tilt` 会在倾斜角度为 0 时打开倾斜，否则关闭倾斜。

## 状态

状态由 `is_opening`、`is_closing` 和 `is_closed` 按此顺序确定，为一个 `CoverState`：

| 值 | 描述 |
| ----- | ----------- |
| `CoverState.OPENING` | 卷帘正在打开。 |
| `CoverState.CLOSING` | 卷帘正在关闭。 |
| `CoverState.CLOSED` | 卷帘已关闭。 |
| `CoverState.OPEN` | 卷帘处于打开状态，可以是完全打开或部分打开。 |

当卷帘未在移动且 `is_closed` 为 `None` 时，状态为 `unknown`。

## 示例

```python
from typing import Any

from homeassistant.components.cover import (
    ATTR_POSITION,
    CoverDeviceClass,
    CoverEntity,
    CoverEntityFeature,
)


class MyBlind(CoverEntity):
    """A blind that moves to a position."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_device_class = CoverDeviceClass.BLIND
    _attr_supported_features = (
        CoverEntityFeature.OPEN
        | CoverEntityFeature.CLOSE
        | CoverEntityFeature.STOP
        | CoverEntityFeature.SET_POSITION
    )

    def __init__(self, device: MyDevice) -> None:
        """Set up the blind."""
        self._device = device
        self._attr_unique_id = device.serial

    @property
    def current_cover_position(self) -> int:
        """Return the position, 0 is closed."""
        return self._device.position

    @property
    def is_closed(self) -> bool:
        """Return if the blind is closed."""
        return self._device.position == 0

    async def async_open_cover(self, **kwargs: Any) -> None:
        """Open the blind."""
        await self._device.move_to(100)

    async def async_close_cover(self, **kwargs: Any) -> None:
        """Close the blind."""
        await self._device.move_to(0)

    async def async_set_cover_position(self, **kwargs: Any) -> None:
        """Move the blind to a position."""
        await self._device.move_to(kwargs[ATTR_POSITION])

    async def async_stop_cover(self, **kwargs: Any) -> None:
        """Stop the blind."""
        await self._device.stop()
```
