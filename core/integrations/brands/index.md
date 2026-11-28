# 集成品牌与图片

> 为您的集成添加图标和标志，并将同一品牌的集成归为一组，方便用户查找。

Source: https://www.hasscn.top/contributors/core/integrations/brands/

Home Assistant 会为每个集成（integration）显示一个图标和一个标志。图标是正方形的，用于空间紧凑的地方。标志更宽，用于空间充裕的地方，比如集成的页面。两者都有浅色和深色版本。

品牌则是另一回事：品牌文件将同一家公司的多个集成归为一组，让用户可以在一个名称下找到它们。

本页面介绍的是集成品牌：即 Home Assistant 所连接的公司和产品。Home Assistant 自身的品牌——它的个性、名称和标志——有专门的板块：[品牌](https://www.hasscn.top/contributors/brand/)。

## 核心集成的品牌图片

核心（core）中集成的图片存放在 [brands 仓库](https://github.com/home-assistant/brands)中，而不是 [core 仓库](https://github.com/home-assistant/core)中。请在那里打开一个拉取请求（pull request），向 [`core_integrations/`](https://github.com/home-assistant/brands/tree/master/core_integrations) 添加一个以您的域（domain）命名的文件夹。Philips Hue 集成的图片位于 [`core_integrations/hue/`](https://github.com/home-assistant/brands/tree/master/core_integrations/hue)。

一个文件夹可以包含以下文件：

| 文件 | 说明 |
| --- | --- |
| `icon.png` | 正方形图标 |
| `icon@2x.png` | 用于高分辨率屏幕的图标 |
| `logo.png` | 标志 |
| `logo@2x.png` | 用于高分辨率屏幕的标志 |
| `dark_icon.png`、`dark_logo.png` 及其 `@2x` 版本 | 针对深色背景优化的版本，仅在需要时提供 |

缺失的文件会自动回退：缺少标志时使用图标，缺少深色版本时使用浅色版本。如果品牌的标志是正方形的，则只需添加图标。

图片必须满足以下要求：

- PNG 格式，并针对网页进行适当压缩。首选无损且交错的格式。
- 首选透明背景。默认图片适用于白色背景，`dark_` 版本适用于深色背景。
- 已裁剪：主体周围没有空白、边框或内边距。
- 图标为正方形：256 × 256 像素，`@2x` 为 512 × 512 像素。
- 标志保持品牌标志的宽高比，最好为横向。最短边在 128 到 256 像素之间，`@2x` 在 256 到 512 像素之间。在该范围内越大越好。

图片会被缓存，因此已合并的更改可能需要一段时间才能显示出来。

### 没有品牌的集成

一些集成（例如辅助元素（helper））没有可显示的品牌。此时不添加图片，而是在文件夹中添加一个 `icon.txt` 文件，其中包含 [Material Design Icon](https://pictogrammers.com/library/mdi/) 的名称，例如 `mdi:calculator`。

### 与品牌共享的图片

如果公司品牌与其某个集成使用相同的图片，请将图片放在 `core_brands/<brand>/` 中，并从集成文件夹创建符号链接（symlink）指向它们，以避免重复副本。Samsung TV 集成就是通过这种方式链接到 Samsung 品牌的图片的。仅允许在核心集成和品牌的域文件夹之间使用符号链接。

## 自定义集成的品牌图片

自 Home Assistant 2026.3 起，自定义集成可以自带图片，放在集成文件夹内的 `brand/` 文件夹中：`custom_components/my_integration/brand/`。在此之前，自定义集成也是将图片添加到 brands 仓库。本地图片优先于 brands 仓库中的任何图片。

如果您之后将该集成贡献给核心（core），请删除 `brand/` 文件夹，改为将图片添加到 brands 仓库。自定义集成不得使用带有 Home Assistant 品牌的图片，以免用户将其误认为官方集成。

## Home Assistant 如何提供这些图片

Home Assistant 通过自己的 API 提供品牌图片，与前端同源：

- `/api/brands/integration/{domain}/{image}` 用于集成图标和标志
- `/api/brands/hardware/{category}/{image}` 用于硬件图片

这些端点需要身份验证，可以是普通的已验证会话，也可以是在 `token` 查询参数中提供的访问令牌。前端通过 `brands/access_token` WebSocket 命令获取该令牌，并自动为您添加。如果图片不存在，这些端点会返回占位图片。添加 `?placeholder=no` 则会返回 404。

## 品牌文件

一家公司可以拥有针对不同产品的多个集成。Google 有用于 Google Calendar 的 `google` 和用于 Google Sheets 的 `google_sheets`。公司也可以生产使用 Zigbee 等标准的设备，而自身没有集成。品牌文件将这些归为一组，让用户可以在品牌名称下找到它们。

品牌文件位于核心仓库的 [`homeassistant/brands/`](https://github.com/home-assistant/core/tree/dev/homeassistant/brands) 中，每个品牌一个 JSON 文件：

```json
{
  "domain": "google",
  "name": "Google",
  "integrations": ["google", "google_sheets"]
}
```

```json
{
  "domain": "inovelli",
  "name": "Inovelli",
  "iot_standards": ["zigbee", "zwave"]
}
```

| 键 | 说明 |
| --- | --- |
| `domain` | 品牌的唯一域。必须与文件名一致。 |
| `name` | 品牌的名称 |
| `integrations` | 该品牌所包含集成的域。如果某个集成与品牌具有相同的域，则必须列在此列表中。 |
| `iot_standards` | 该品牌设备使用的标准：`homekit`、`matter`、`zigbee` 或 `zwave` |

一个品牌至少需要两个集成，或者至少一个 IoT 标准。否则就没有可分组的内容。品牌的图片放在 brands 仓库的 `core_brands/<domain>/` 中。
