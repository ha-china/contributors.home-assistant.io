# 媒体来源

> 在 Home Assistant 的媒体浏览器中公开您的集成提供的可浏览、可搜索和可播放的媒体。

Source: https://www.hasscn.top/contributors/core/integrations/media-source/

媒体来源（media source）使您集成（integration）的媒体可在 Home Assistant 的媒体浏览器中使用：摄像头的录像、音乐库、电台或生成的语音。用户像浏览文件夹一样浏览它，并在任何支持它们的媒体播放器（media player）上播放项目。

## 添加媒体来源

创建 `media_source.py`。清单（manifest）无需任何更改：Home Assistant 会自行找到该文件。它必须包含一个返回您的媒体来源的 `async_get_media_source` 函数：

```python
from homeassistant.components.media_player import BrowseError, MediaClass
from homeassistant.components.media_source import (
    BrowseMediaSource,
    MediaSource,
    MediaSourceItem,
    PlayMedia,
    Unresolvable,
)
from homeassistant.core import HomeAssistant


async def async_get_media_source(hass: HomeAssistant) -> ExampleMediaSource:
    """Set up the Example media source."""
    return ExampleMediaSource(hass)


class ExampleMediaSource(MediaSource):
    """Provide the recordings of Example cameras."""

    name = "Example"

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the media source."""
        super().__init__(DOMAIN)
        self.hass = hass

    async def async_browse_media(
        self, item: MediaSourceItem
    ) -> BrowseMediaSource:
        """Return the media at a location."""

    async def async_resolve_media(self, item: MediaSourceItem) -> PlayMedia:
        """Return a playable URL for an item."""
```

| 方法 | 作用 |
| --- | --- |
| `async_browse_media(item)` | 返回某个位置的 `BrowseMediaSource`。失败时抛出 `BrowseError`。 |
| `async_resolve_media(item)` | 将项目转换为包含可播放 URL 的 `PlayMedia`。失败时抛出 `Unresolvable`。 |
| `async_search_media(item, query)` | 可选。搜索您的媒体。参见[搜索](https://www.hasscn.top/contributors/core/integrations/media-source/#search)。 |

`name` 是用户看到的名称。若未设置，则使用域名。

## 标识符

每个项目都有一个类似 `media-source://<domain>/<identifier>` 的 URI。标识符的形式由您决定。对于层级结构，使用包含 `/` 的路径效果很好，例如 `albums/1234`。您的方法通过 `item.identifier` 获取它。对于媒体来源的根项目，它为空。

使用 `homeassistant.components.media_source` 中的 `generate_media_source_id(DOMAIN, "albums/1234")` 和 `is_media_source_id(value)` 来构建和检查这些 URI。

## 浏览

返回该位置的项目及其子项目：

```python
async def async_browse_media(
    self, item: MediaSourceItem
) -> BrowseMediaSource:
    """Return the media at a location."""
    if item.identifier:
        return await self._async_browse_camera(item.identifier)

    return BrowseMediaSource(
        domain=DOMAIN,
        identifier=None,
        media_class=MediaClass.APP,
        media_content_type="",
        title="Example",
        can_play=False,
        can_expand=True,
        children_media_class=MediaClass.DIRECTORY,
        children=[
            BrowseMediaSource(
                domain=DOMAIN,
                identifier=camera.id,
                media_class=MediaClass.DIRECTORY,
                media_content_type="",
                title=camera.name,
                can_play=False,
                can_expand=True,
            )
            for camera in self._cameras
        ],
    )
```

| 字段 | 说明 |
| --- | --- |
| `domain` | 您的域名 |
| `identifier` | 项目的标识符。根项目为 `None`。 |
| `media_class` | 项目的类型，例如 `MediaClass.DIRECTORY`、`MediaClass.MUSIC`、`MediaClass.VIDEO` 或 `MediaClass.IMAGE` |
| `media_content_type` | 内容的 MIME 类型或媒体类型，例如 `"audio/mpeg"` |
| `title` | 用户看到的名称 |
| `can_play` | 项目是否可播放 |
| `can_expand` | 项目是否有可浏览的子项目 |
| `can_search` | 用户是否可以从该项目进行搜索。默认为 `False`。 |
| `search_media_classes` | 用户在此处搜索时可用于筛选的媒体类别 |
| `children` | 子项目。仅在正被浏览的项目上存在。 |
| `children_media_class` | 子项目的媒体类别。如果您省略它，则会自动计算。 |
| `thumbnail` | 缩略图的 URL |
| `not_shown` | 被省略的子项目数量。默认为 `0`。 |

## 解析

当用户播放项目时，返回一个 URL 和 MIME 类型：

```python
async def async_resolve_media(self, item: MediaSourceItem) -> PlayMedia:
    """Return a playable URL for an item."""
    if (recording := self._recordings.get(item.identifier)) is None:
        raise Unresolvable(
            translation_domain=DOMAIN,
            translation_key="recording_not_found",
            translation_placeholders={"item": item.identifier},
        )

    return PlayMedia(recording.url, "video/mp4")
```

URL 可以是绝对路径，也可以是由 Home Assistant 提供服务的相对路径。如果您需要根据该播放器调整 URL，`item.target_media_player` 中保存了将要播放它的媒体播放器的实体 ID（entity ID）。`Unresolvable` 和 `BrowseError` 均支持已翻译的消息。

## 搜索

搜索是可选的。在用户可以从中进行搜索的项目（如根项目或某些文件夹）上设置 `can_search=True`，并实现 `async_search_media`：

```python
from homeassistant.components.media_player import (
    SearchMedia,
    SearchMediaQuery,
)


async def async_search_media(
    self, item: MediaSourceItem, query: SearchMediaQuery
) -> SearchMedia:
    """Search the media."""
    tracks = await self._client.search(query.search_query)

    return SearchMedia(
        result=[
            BrowseMediaSource(
                domain=DOMAIN,
                identifier=track.id,
                media_class=MediaClass.TRACK,
                media_content_type=track.mime_type,
                title=track.title,
                can_play=True,
                can_expand=False,
            )
            for track in tracks
            if not query.media_filter_classes
            or MediaClass.TRACK in query.media_filter_classes
        ]
    )
```

`item` 告诉您搜索是从哪里开始的，这样您可以将结果限制在媒体的该部分。查询包含 `search_query`（用户输入的内容），以及可选的 `media_content_type`、`media_content_id` 和 `media_filter_classes`。

要让用户能够筛选，可在可搜索的项目上设置 `search_media_classes`，例如 `[MediaClass.ALBUM, MediaClass.ARTIST, MediaClass.TRACK]`。用户选择的类别将通过 `media_filter_classes` 传入。只返回这些类别的项目。

## 从另一个集成中使用媒体来源

媒体播放器集成也可以浏览、搜索和解析媒体来源：

```python
from homeassistant.components.media_source import (
    async_browse_media,
    async_resolve_media,
)

result = await async_browse_media(hass, "media-source://example")
play_media = await async_resolve_media(
    hass,
    "media-source://example/recording_123",
    target_media_player="media_player.living_room",
)
```

`async_search_media(hass, media_content_id, query)` 以相同的方式进行搜索。
