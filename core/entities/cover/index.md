# 卷帘实体

> 构建用于百叶窗、遮光帘、车库门、大门及其他可开合物体的卷帘实体。

Source: https://www.hasscn.top/contributors/core/entities/cover/

卷帘实体（cover entity）控制遮挡开口并可开合的物体：百叶窗、遮光帘、窗帘、遮阳篷、车库门、大门以及电动窗户。它可以报告和设置位置，以及带有叶片的百叶窗的倾斜角度。继承自 `homeassistant.components.cover` 中的 `CoverEntity`。

卷帘只能用于遮挡开口的物体。控制水或气体流动的设备应使用[阀门（valve）](https://www.hasscn.top/contributors/core/entities/valve/)。需要上锁和解锁的门应使用[锁（lock）](https://www.hasscn.top/contributors/core/entities/lock/)。对于其他任何情况，请使用其他实体（entity）类型，例如[数字（number）](https://www.hasscn.top/contributors/core/entities/number/)，即使在旧集成中使用的是卷帘。

有关前端如何显示卷帘，请参阅[卷帘更多信息视图](https://www.hasscn.top/contributors/design/more-info/cover/)。

Live demo of dashboard cards, from the embed of the Home Assistant demo. A cover that opens, closes, stops, and sets a position, in a tile card. The card is live: open, close, or move the blinds.

```html
<ha-embed-provider
  style="
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 8px;
    align-items: start;
    max-width: 500px;
  "
>
  <script type="application/json">
    [
      {
        "entity_id": "cover.living_room_blinds",
        "state": "open",
        "attributes": {
          "friendly_name": "Living room blinds",
          "device_class": "blind",
          "current_position": 70,
          "supported_features": 15
        }
      }
    ]
  </script>
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "cover.living_room_blinds",
        "features": [
          {
            "type": "cover-open-close"
          },
          {
            "type": "cover-position"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 属性

卷帘实体除了具有[通用实体属性](https://www.hasscn.top/contributors/core/entities/entity-class/)之外，还具有以下属性。每个属性都可以通过其对应的 `_attr_` 属性来设置，例如 `_attr_is_closed`。

| 名称 | 类型 | 默认值 | 描述 |
| ---- | ---- | ------- | ----------- |
| `is_closed` | `bool \| None` | 必填 | 卷帘是否已关闭。用于确定状态。 |
| `is_opening` | `bool \| None` | `None` | 卷帘是否正在打开。用于确定状态。 |
| `is_closing` | `bool \| None` | `None` | 卷帘是否正在关闭。用于确定状态。 |
| `current_cover_position` | `int \| None` | `None` | 位置，从 0（关闭）到 100（完全打开）。 |
| `current_cover_tilt_position` | `int \| None` | `None` | 倾斜角度，从 0 到 100。默认在 0 时关闭，在 100 时打开，除非您另行描述。参见[倾斜位置](https://www.hasscn.top/contributors/core/entities/cover/#tilt-position)。 |
| `open_tilt_position` | `int \| None` | `None` | 叶片打开时的倾斜角度，从 0 到 100。`None` 表示默认值。参见[倾斜位置](https://www.hasscn.top/contributors/core/entities/cover/#tilt-position)。 |
| `closed_tilt_positions` | `list[int] \| None` | `None` | 叶片关闭时的倾斜角度：0、100 或两者。`None` 表示默认值。参见[倾斜位置](https://www.hasscn.top/contributors/core/entities/cover/#tilt-position)。 |
| `tilt_start_angle` | `int \| None` | `None` | 倾斜角度为 0 时叶片的角度，从 -90 到 90 度。与 `tilt_end_angle` 一起设置，且值不同。 |
| `tilt_end_angle` | `int \| None` | `None` | 倾斜角度为 100 时叶片的角度，从 -90 到 90 度。与 `tilt_start_angle` 一起设置，且值不同。 |
| `device_class` | `CoverDeviceClass \| None` | `None` | 卷帘的类型。参见[设备类别](https://www.hasscn.top/contributors/core/entities/cover/#device-classes)。 |
| `supported_speeds` | `list[str] \| None` | `None` | 卷帘在打开、关闭或移动到某个位置时可以移动的速度。`None` 或空列表表示不支持速度选择。在适合您的设备时，使用 `homeassistant.components.cover` 中的标准速度 `CoverSpeed.FAST`、`CoverSpeed.MEDIUM` 和 `CoverSpeed.SLOW`。不带速度的操作会以设备的默认速度移动卷帘。 |

当您将 `supported_speeds` 设置为列表时，Home Assistant 会将其添加为 `supported_speeds` 属性，并在调用您之前检查操作中的 `speed` 是否在列表中。不在列表中的速度会被丢弃，卷帘会以默认速度移动。如果没有速度，操作中的 `speed` 会被丢弃。

## 倾斜位置

倾斜角度是一个从 0 到 100 的数字。默认情况下，叶片在 0 时关闭，在 100 时打开。如果您的卷帘工作方式不同，请使用以下属性进行描述：

- `open_tilt_position` 是叶片打开时的倾斜角度。您的 `open_cover_tilt` 会将叶片移动到该位置。
- `closed_tilt_positions` 包含叶片关闭时的倾斜角度：`[0]`、`[100]` 或 `[0, 100]`。您的 `close_cover_tilt` 会将叶片移动到最关闭的位置。对于 `[0, 100]`，您需要决定其含义：如果一端遮挡光线更多，则始终关闭到该端。如果两端关闭程度相同，您可以让已知处于关闭状态的叶片保持原位，或者始终关闭到同一端。如果倾斜角度只是推测（因为设备不报告），仍然要关闭。
- `tilt_start_angle` 和 `tilt_end_angle` 是倾斜角度为 0 和 100 时叶片的角度，单位为度。两者要么都设置，要么都不设置。

一个在刻度中间打开、在 0 和 100 处关闭的百叶窗：

```python
class MyBlind(CoverEntity):
    _attr_supported_features = (
        CoverEntityFeature.OPEN_TILT
        | CoverEntityFeature.CLOSE_TILT
        | CoverEntityFeature.SET_TILT_POSITION
    )
    _attr_open_tilt_position = 50
    _attr_closed_tilt_positions = [0, 100]
```

如果您知道叶片如何转动，请改为设置角度。Home Assistant 随后会计算出位置，而需要叶片形状的代码（如 HomeKit 桥接器或卷帘的绘图）可以使用这些角度。一个叶片转动 180° 的百叶窗在 50 处打开，在 0 和 100 处关闭：

```python
class MyBlind(CoverEntity):
    _attr_supported_features = (
        CoverEntityFeature.OPEN_TILT
        | CoverEntityFeature.CLOSE_TILT
        | CoverEntityFeature.SET_TILT_POSITION
    )
    _attr_tilt_start_angle = -90
    _attr_tilt_end_angle = 90
```

当设备在角度所示位置之外的其他位置打开或关闭时，也要设置位置。

对于角度，0° 表示叶片垂直于卷帘，-90° 和 90° 表示叶片平放。角度在倾斜角度 0 和 100 之间均匀变化。负角度表示叶片的内边缘高于外边缘。对于垂直叶片，从内部看，表示内边缘位于外边缘的左侧。如果您不知道卷帘的安装方式，或者它没有内外之分（如凉棚屋顶），请让角度随倾斜角度增加，例如 -90 和 90。角度是近似值：足以绘制叶片，不足以追踪太阳。

当您只设置角度时，卷帘在角度最接近 0°（四舍五入为整数）处打开，在叶片最平放处关闭。当两端同样平放时，两端都是关闭位置。如果设备只在一端关闭，请自行设置 `closed_tilt_positions`。

位置是精确的。当叶片关闭时，请精确报告关闭位置，例如 100 而不是 98。如果角度给出 50，但设备在打开时报告 51，请将 `open_tilt_position` 设置为 51。

当卷帘支持 `SET_TILT_POSITION` 时，Home Assistant 会将打开和关闭位置添加为状态属性，并填入默认值。当您设置角度时，它也会添加角度。记录器不会存储这些属性。仅在设备或其配置更改时更改这些值，而不是随叶片位置更改，并在设备不可用时保持这些值。请自行设置 `supported_features`，如示例所示。如果 Home Assistant [猜测功能](https://www.hasscn.top/contributors/core/entities/cover/#supported-features)，则每当倾斜角度未知时，`SET_TILT_POSITION` 和这些属性都会消失。

`toggle_tilt` 对每个卷帘都使用这些值，也包括没有 `SET_TILT_POSITION` 的卷帘。

当值无效或相互矛盾时，Home Assistant 会引发 `ValueError`：

- 只设置了一个角度，角度不是 -90 到 90 的整数，或两个角度相同。
- `open_tilt_position` 不是 0 到 100 的整数，或 `closed_tilt_positions` 不包含 0、100 或两者。
- 打开位置也是关闭位置，包括默认值。仅在 100 处关闭的卷帘也必须设置 `open_tilt_position`，因为默认的打开位置是 100。

Home Assistant 在写入支持 `SET_TILT_POSITION` 的卷帘状态时以及运行 `toggle_tilt` 时会检查这些值。如果检查在添加实体时失败，则不会添加该实体。如果检查在后续状态写入时失败，实体的状态将停止更新。如果检查在 `toggle_tilt` 中失败，操作将失败。在设置从设备读取的值之前，请先检查这些值。

## 设备类别

从 `CoverDeviceClass` 中设置一个[设备类别（device class）](https://www.hasscn.top/contributors/glossary/device-class/)。它决定了图标、前端中状态的措辞，以及语音助手对卷帘的称呼。

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

将 `CoverEntityFeature` 标志用 `|` 组合起来，并将其设置为 `supported_features`。参见[支持的功能（supported features）](https://www.hasscn.top/contributors/glossary/supported-features/)。

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

如果您完全不设置 `supported_features`，Home Assistant 会进行猜测：`OPEN`、`CLOSE` 和 `STOP`，加上当卷帘报告位置时的 `SET_POSITION`，当它报告倾斜角度时的所有倾斜功能，以及当它有速度时的 `SPEED`。猜测会跟随当前状态，因此每当位置或倾斜角度未知时（例如设备不可用时），卷帘会失去 `SET_POSITION` 及其倾斜功能。请自行设置功能，以便它们描述卷帘能做什么，并且不随其状态变化。

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

切换操作由系统为您处理。`toggle` 会停止支持 `STOP` 的移动中的卷帘，打开已关闭或正在关闭的卷帘，并关闭正在打开或完全打开的卷帘。部分打开后停止的卷帘会从其最后报告的方向反向移动，如果从未报告过方向，则关闭。`toggle_tilt` 在倾斜角度恰好处于关闭位置时打开倾斜，否则关闭，倾斜角度未知时也是如此。参见[倾斜位置](https://www.hasscn.top/contributors/core/entities/cover/#tilt-position)。

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
