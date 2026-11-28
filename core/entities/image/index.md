# 图片实体

> 显示一张会不时变化的静态图片，例如地图、快照或二维码。

Source: https://www.hasscn.top/contributors/core/entities/image/

图片实体（image entity）提供一张单一的静态图片。可以想见扫地机器人的地图、门铃的最新快照，或访客网络的二维码。它是[摄像头实体](https://www.hasscn.top/contributors/core/entities/camera/)简单得多的同类：没有视频流，没有录像，也没有开与关。当图片发生变化时，实体会告知这一变化，前端随后获取新图片。

继承自 `ImageEntity`，从 `homeassistant.components.image` 导入。当你的设备或服务拥有会不时更新的图片时使用它。如果它显示实时视频，或者你需要按需抓取帧，请改用摄像头实体。

你可以通过以下两种方式之一提供图片：

- **URL**：设置 `image_url`，Home Assistant 会下载图片、检测其内容类型并缓存它。
- **字节**：实现 `async_image`（或 `image`）并自行返回图片数据。

## 属性

这些属性是图片实体特有的。每个实体都具有的通用属性见[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)。

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `content_type` | `str` | `"image/jpeg"` | 图片的 MIME 类型。当图片来自 `image_url` 时自动设置。 |
| `image_last_updated` | `datetime \| None` | `None` | 图片上次变化的时间。这是实体的状态，前端会在其变化时重新获取图片。 |
| `image_url` | `str \| None` | `UNDEFINED` | 用于下载图片的 URL。如果你改为从 `async_image` 返回字节数据，则将其保持为未设置。 |

图片实体默认不进行轮询（`should_poll` 为 `False`），因为你通过更改 `image_last_updated` 来告知 Home Assistant 有新图片。

> [!IMPORTANT]
> `ImageEntity` 的构造函数接受 `hass`（以及可选的 `verify_ssl`，默认为 `False`）。它会设置用于 `image_url` 和访问令牌的 HTTP 客户端。请在你自己的 `__init__` 中调用 `super().__init__(hass)`。

## 支持的功能

图片实体没有任何受支持的功能。

## 获取与缓存

每当有人请求图片时，Home Assistant 都会调用 `async_image`。前端在包含该实体的页面加载时请求，并在每次状态变化时再次请求。`image.snapshot` 动作也会发起请求。当客户端在 `/api/image_proxy_stream/<entity_id>` 观看 MJPEG 流时，Home Assistant 会在每次状态变化时发送一帧，包括每五分钟一次的令牌轮换，并且至少每 55 秒发送一帧。你无法控制 `async_image` 何时运行，因此请保持其开销低廉。

这意味着顺序很重要。当有新图片可用时（来自协调器（coordinator）更新、推送消息或定时器），你需要更新 `image_last_updated` 并写入状态。前端看到新状态后便会获取图片。不要在 `async_image` 内部更新 `image_last_updated`：那会导致每次获取都触发一次新的获取。

使用 `image_url` 时，下载的图片会缓存在 `self._cached_image` 中。当 URL 或其背后的图片发生变化时，将其设置为 `None`，这样下一次获取便会重新下载。

图片实体的实体图片指向 `/api/image_proxy/<entity_id>`，并附带一个短期有效的访问令牌。Home Assistant 每五分钟轮换一次这些令牌，因此你完全无需自行处理。

## 方法

### 返回图片

当你返回字节数据而不是设置 `image_url` 时，请实现其中之一。没有图片时返回 `None`。

```python
class MyImage(ImageEntity):
    def image(self) -> bytes | None:
        """Return bytes of the image."""

    async def async_image(self) -> bytes | None:
        """Return bytes of the image."""
```

如果你从远程来源获取图片，请将其缓存，并且只在 `image_last_updated` 发生变化后才再次获取。

## 状态

状态是以 ISO 8601 时间戳表示的 `image_last_updated`，例如 `2026-10-10T08:15:00+00:00`。当 `image_last_updated` 为 `None` 时，状态为 `unknown`。你不能直接设置状态：它在基类中是 final 的。

该实体还有一个 `access_token` 属性，它与 `entity_picture` 一样被排除在[记录器（recorder）](https://www.hasscn.top/contributors/glossary/recorder/)之外。

## 示例

一个用于扫地机器人地图的图片实体，通过[协调器](https://www.hasscn.top/contributors/glossary/coordinator/)刷新。

```python
from homeassistant.components.image import ImageEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.util import dt as dt_util

from .coordinator import MyCoordinator


class MyMapImage(CoordinatorEntity[MyCoordinator], ImageEntity):
    """The cleaning map of a vacuum."""

    _attr_has_entity_name = True
    _attr_translation_key = "map"
    _attr_content_type = "image/png"

    def __init__(
        self, hass: HomeAssistant, coordinator: MyCoordinator
    ) -> None:
        """Initialize the map image."""
        CoordinatorEntity.__init__(self, coordinator)
        ImageEntity.__init__(self, hass)
        self._attr_unique_id = f"{coordinator.serial}_map"
        self._attr_image_last_updated = dt_util.utcnow()

    @callback
    def _handle_coordinator_update(self) -> None:
        """Mark the image as changed, the frontend fetches it again."""
        self._attr_image_last_updated = dt_util.utcnow()
        super()._handle_coordinator_update()

    async def async_image(self) -> bytes | None:
        """Return the map as PNG bytes."""
        return self.coordinator.data.map_png
```
