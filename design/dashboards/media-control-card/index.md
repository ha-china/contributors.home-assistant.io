# 媒体控制卡片

> 媒体控制卡片显示媒体播放器正在播放的内容，包括封面图片、控制按钮和播放进度。

Source: https://www.hasscn.top/contributors/design/dashboards/media-control-card/

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "media-control",
        "entity": "media_player.living_room_speaker"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

媒体控制卡片显示一个媒体播放器。顶部是播放器的图标和名称，然后是正在播放内容的标题和艺术家，接着是控制按钮，例如播放、暂停和下一曲。当播放器知道时长和播放位置时，底部会显示一条进度条。显示哪些按钮取决于播放器支持的功能，例如浏览媒体或关闭播放器的按钮。

卡片的颜色取自封面图片。图片位于右侧，背景采用图片的主色调，文字则使用在背景上保持可读的颜色。没有封面图片时，卡片使用主色调。当播放器处于关闭状态时，卡片呈灰色，只保留电源按钮。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "media-control",
        "entity": "media_player.living_room_tv"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

当正在播放的内容值得占据空间时，可以使用媒体控制卡片，例如客厅的音箱。对于人们主要只是开关或只调节音量的播放器，带有播放或音量功能的[磁贴卡片（tile card）](https://www.hasscn.top/contributors/design/dashboards/tile-card/)会更小巧。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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
  <ha-embed-card style="grid-column: span 12">
    <script type="application/json">
      {
        "type": "tile",
        "entity": "media_player.living_room_speaker",
        "features": [
          {
            "type": "media-player-playback"
          }
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 窄卡片

卡片会测量自身的宽度，并舍弃放不下的内容。宽度低于 350 像素时，进度条会消失。宽度低于 300 像素时，在正在播放内容的情况下，控制按钮也会消失。将卡片放在窄列或网格中时，请记住这一点。

Live demo of dashboard cards, from the embed of the Home Assistant demo, connected to the sample home of this site.

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
  <ha-embed-card style="grid-column: span 8">
    <script type="application/json">
      {
        "type": "media-control",
        "entity": "media_player.living_room_speaker",
        "grid_options": {
          "columns": 8
        }
      }
    </script>
  </ha-embed-card>
  <ha-embed-card style="grid-column: span 7">
    <script type="application/json">
      {
        "type": "media-control",
        "entity": "media_player.living_room_speaker",
        "grid_options": {
          "columns": 7
        }
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 内容

- 标题和艺术家信息来自播放器。放不下的标题会在鼠标悬停时滚动显示。
- 播放器的名称请保持简短。它与菜单按钮共用顶部一行。

## 配置

- `entity`（字符串，必填）：要显示的媒体播放器。仅支持 `media_player` 域的实体（entity）。
- `name`（字符串）：要显示的名称。默认为实体的名称。
- `theme`（字符串）：仅应用于此卡片的主题。

```yaml
type: media-control
entity: media_player.living_room_speaker
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-media-control-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-media-control-card.ts)，元素为 `<hui-media-control-card>`。控制按钮来自 [`src/data/media-player.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/media-player.ts) 中的 `computeMediaControls`，更多信息弹窗也使用它，因此卡片和弹窗提供相同的按钮。颜色来自 [`src/common/image/extract_color.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/image/extract_color.ts) 中的 `extractColors`，它从封面图片中提取颜色。

卡片使用 `ResizeObserver` 监测自身大小，并据此设置窄和极窄布局。进度条是一个 [`<ha-slider>`](https://www.hasscn.top/contributors/design/components/slider/)，在媒体播放期间保持更新。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-media-control-card.ts)
