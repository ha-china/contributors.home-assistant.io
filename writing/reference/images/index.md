# 图片和视频

> 如何在 home-assistant.io 的页面上添加截图、图表和 YouTube 视频，以及如何为每位读者描述它们。

Source: https://www.hasscn.top/contributors/writing/reference/images/

一张好的截图可以省去一段解释。一个视频可以展示文字无法表达的内容。本页介绍图片存放的位置、如何将图片添加到页面，以及如何嵌入视频。

## 图片存放的位置

将每张图片都存放在文档仓库中，位于 [`source/images`](https://github.com/home-assistant/home-assistant.io/tree/current/source/images) 下。选择与页面匹配的子文件夹：

- `source/images/integrations/<domain>/` 用于集成（integration），例如 [`source/images/integrations/matter/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/images/integrations/matter)。
- `source/images/docs/<topic>/` 用于一般文档。
- [`source/images/dashboards/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/images/dashboards) 用于仪表盘（dashboard）和卡片。

不要链接到托管在其他地方的图片，例如你自己的 GitHub 仓库或图床服务。外部图片会消失、变更，或拖慢页面加载速度。

在页面上，通过图片的发布路径来引用它。也就是去掉 `source` 之后的路径，因此 [`source/images/integrations/matter/matter_device-info.png`](https://github.com/home-assistant/home-assistant.io/blob/current/source/images/integrations/matter/matter_device-info.png) 会变成 `/images/integrations/matter/matter_device-info.png`。

> [!NOTE]
> GitHub 上的 **Edit** 按钮不支持上传图片。要添加图片，请在 fork 上操作，可以在你自己的电脑上进行，或者先将文件上传到你在 GitHub 上的 fork。参见[在本地预览网站](https://www.hasscn.top/contributors/writing/guides/local-preview/)。

## 添加图片

尽可能使用 Markdown 来添加图片：

```markdown
![Screenshot of the tile card with a brightness slider](/images/dashboards/features/screenshot-tile-feature-grid.png)
```

图片也可以用来展示某个步骤。将其缩进，使其属于该列表项：

```markdown
1. To adjust the brightness, move the slider:
   ![Screenshot of the tile card with a brightness slider](/images/dashboards/features/screenshot-tile-feature-grid.png)
2. Select **Save**.
```

## 添加图注

Markdown 没有图注语法。要在图片下方显示图注，请将其包裹在带有 `img` 类的段落中，并把图注文字放在图片之后：

```html
<p class='img'>
  <img
    src='/images/dashboards/features/screenshot-tile-feature-grid.png'
    alt='Screenshot of the tile card with a brightness slider'
  >
  The tile card with a brightness slider
</p>
```

这样，图片和图注会获得带边框、居中的布局，图注以斜体显示。

## 深色模式和 invertDark

对于在深色模式下显示时应反转颜色的图片，请添加 `invertDark` 类。这适用于在透明或白色背景上使用深色线条的简单图表和绘图。不要在截图或照片上使用它：反转会使它们看起来不正常。

```html
<p class='img'>
  <img
    class='invertDark'
    src='/images/integrations/infrared/infrared-overview.png'
    alt='Diagram of how commands reach a device through an infrared adapter'
  >
  How commands reach an infrared device
</p>
```

> [!NOTE]
> [home-assistant.io](https://www.home-assistant.io/) 目前没有深色模式，其样式表也尚未定义 `invertDark`，因此该类目前在网站上没有可见效果。已有少数页面在使用它。

## 灯箱效果

在 home-assistant.io 上，读者可以在文档页面或博客文章中选择一张图片，在灯箱（lightbox）中以全尺寸打开它。它也支持键盘操作。你无需为此做任何事情：图片会自动获得灯箱效果，除非：

- 图片很小。显示尺寸小于 160×100 像素、且原始尺寸也小于 300 像素的图片会被跳过。这是为了排除内联图标。
- 它是一个链接，或位于链接或按钮之内。
- 它是 SVG 文件。
- 它看起来像徽标。品牌徽标会被跳过，依据是其类名、包含 `logo` 或 `brand` 等字样的路径，或提到徽标的替代文本。
- 它被选择退出。

要让某张图片不使用灯箱，请添加 `data-no-lightbox` 属性或 `no-lightbox` 类。你可以将其中任意一个放在图片本身上，或放在其周围的元素上，以让整组图片退出灯箱：

```html
<img
  src="/images/example.png"
  alt="Description of the image"
  data-no-lightbox
>
```

```html
<img
  class="no-lightbox"
  src="/images/example.png"
  alt="Description of the image"
>
```

## 编写良好的替代文本

每张图片都需要替代文本（alt text）。屏幕阅读器会将其朗读出来，并且在图片加载失败时会显示它。替代文本也是灯箱打开图片时播报的内容。

- **描述图片展示的内容**，以及它为什么在那里。“集成设置页面的截图，轮询间隔设置为 30 秒”是有帮助的。只写“截图”则没有帮助。
- **保持简短。**通常一句话就足够了。
- **不要以“图片”开头。**屏幕阅读器已经会播报这是一张图片。“……的截图”或“……的图表”是可以的，因为它告诉读者图片的类型。
- **不要逐字重复图注。**如果图注已经说明了一切，替代文本可以改为描述视觉细节。
- **不要把信息只放在图片里。**读者完成某个步骤所需的任何内容也应写在正文中。

## 保持截图的实用性

- 只展示屏幕上重要的部分。裁剪掉其余部分。
- 使用 Home Assistant 的默认[主题](https://www.hasscn.top/contributors/glossary/theme/)和语言，使截图看起来与读者所见一致。
- 移除或模糊个人信息，例如姓名、地址、令牌和 IP 地址。
- 替换不再与界面相符的截图。过时的截图比没有截图更让人困惑。

## 嵌入 YouTube 视频

使用 `lite-youtube` 元素来嵌入 YouTube 视频。它首先显示一个轻量级的预览，只有当读者开始播放视频时才加载实际的 YouTube 播放器。这能保持页面的速度。

```html
<lite-youtube
  videoid="ZgoaoTpIhm8"
  videotitle="Introducing the Home Assistant Voice Preview Edition"
></lite-youtube>
```

- `videoid` 是 YouTube URL 中 `watch?v=` 之后的部分。对于 `https://www.youtube.com/watch?v=ZgoaoTpIhm8`，即 `ZgoaoTpIhm8`。
- `videotitle` 是视频的标题。屏幕阅读器会使用它，因此请务必添加。
- `videoStartAt` 从特定时刻开始播放，以从开头算起的秒数为单位。当长视频中只有部分内容相关时可以使用它。

例如，要让上面的视频从 1 小时 5 分 7 秒处开始播放：

```html
<lite-youtube
  videoid="ZgoaoTpIhm8"
  videoStartAt="3907"
  videotitle="Introducing the Home Assistant Voice Preview Edition"
></lite-youtube>
```

要在视频下方添加图注，请将其包裹在带有 `img` 类的段落中，方式与[图片图注](https://www.hasscn.top/contributors/writing/reference/images/#add-a-caption)相同：

```html
<p class='img'>
  <lite-youtube
    videoid="ZgoaoTpIhm8"
    videoStartAt="3907"
    videotitle="Introducing the Home Assistant Voice Preview Edition"
  ></lite-youtube>
  Watch the Voice Preview Edition announcement
</p>
```

视频永远不能替代书面步骤。不是每个人都能观看视频，而且文字更易于浏览和翻译。
