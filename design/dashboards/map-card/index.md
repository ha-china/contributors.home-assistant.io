# 地图卡片

> 地图卡片在交互式地图上显示人员、设备和地理位置区域（zone）的位置，并可选显示它们曾经到过的轨迹。

Source: https://www.hasscn.top/contributors/design/dashboards/map-card/

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
        "type": "map",
        "entities": [
          "person.alex",
          "person.sam",
          "zone.home",
          "zone.work"
        ]
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

## 用法

地图卡片回答一个问题：大家都在哪里？它为每个具有位置的实体（entity）在地图上放置一个标记，例如人员、设备跟踪器或地理位置区域。选择一个标记会打开该实体的更多信息对话框。用户可以平移和缩放地图，侧边的按钮可以重置视图并开启或关闭聚合功能。

在位置本身很重要时使用它。如果人们只想知道某个人是否在家，那么该人员实体的[平铺卡片](https://www.hasscn.top/contributors/design/dashboards/tile-card/)或[概览卡片](https://www.hasscn.top/contributors/design/dashboards/glance-card/)用少得多的空间就能说明这一点。地图为一条信息占用大量空间，所以要给它一个存在的理由。

地图默认跟随 Home Assistant 的主题。浅色主题下地图是浅色的，深色主题下地图是深色的。

### 标记

人员或设备跟踪器显示为带有其名称首字母的圆形标记，如果它有图片则显示图片。地理位置区域显示为其图标。对实体使用 `label_mode` 时，标记会显示状态、属性或图标，而不是名称。

靠得很近的标记会合并为一个带有数量的气泡，直到你放大为止。当实体较少时，可以使用 `cluster: false` 关闭此功能。

### 历史位置路径

使用 `hours_to_show` 时，地图会为每个实体在该小时数内到过的地方绘制一条线。这对于会移动的东西很有用，比如汽车或割草机。请保持小时数较低：一周的位置会变成一团乱麻，谁也看不懂。

### 主题模式

使用 `theme_mode` 时，无论主题如何，地图始终为 `light` 或始终为 `dark`。默认值 `auto` 跟随主题。深色地图在夜间的壁挂平板上效果很好，但强制指定模式意味着它不再与仪表盘（dashboard）的其余部分匹配。

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
        "type": "map",
        "entities": [
          "person.alex",
          "person.sam"
        ],
        "theme_mode": "dark"
      }
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

### 地图样式

地图有几种内置外观，通过 `map_style` 选择：`default`、`colorful`、`natural`、`muted`、`gray` 和 `toner`。每种样式都有浅色和深色版本，主题模式决定显示哪一个。默认样式使用与 Home Assistant 主题相配的颜色。在 YAML 中，`map_style` 也可以是一个映射，从这些样式之一出发并修改其颜色。

### 内容

- 只添加需要显示在地图上的实体，不要更多。每个多余的标记都会让人们要找的那个更难找到。
- 当地理位置区域能赋予标记意义时才添加它们，比如家和办公室。标记旁边有地理位置区域时，一眼就能读懂。
- 当实体的首字母有歧义时，比如两个人的名字以同一个字母开头，请对该实体使用 `name`。

## 配置

- `entities`（列表）：要显示的实体。每项是一个实体 ID，或者是一个包含 `entity` 和以下选项的映射。必填，除非你使用 `show_all` 或 `geo_location_sources`。
- `geo_location_sources`（列表）：要显示其所有实体的地理位置来源，例如来自数据源的地震或野火。使用 `all` 表示所有来源。
- `show_all`（布尔值）：显示每个具有位置的实体。不能与 `entities` 或 `geo_location_sources` 同时使用。默认为 `false`。
- `title`（字符串）：地图上方的标题。
- `aspect_ratio`（字符串）：地图高度与宽度的比例，例如 `16:9` 或 `50%`。
- `default_zoom`（数字）：地图打开时的缩放级别。默认为 `14`。
- `theme_mode`（字符串）：`auto`、`light` 或 `dark`。默认为 `auto`。
- `map_style`（字符串或映射）：地图的外观。默认为 `default`。
- `hours_to_show`（数字）：绘制多少小时的历史位置。默认为 `0`，即不显示路径。
- `auto_fit`（布尔值）：每当实体移动时移动并缩放地图，使所有实体保持在视野内。默认为 `false`。
- `fit_zones`（布尔值）：当地图适配实体时，也让地理位置区域保持在视野内。默认为 `false`。
- `show_zone_radius`（布尔值）：始终绘制显示地理位置区域大小的圆圈。默认为 `false`。
- `cluster`（布尔值）：合并靠得近的标记。默认为 `true`。
- `scale_ruler`（布尔值）：显示带有地图比例尺的标尺。默认为 `false`。
- `conditions`（列表）：仅在满足所有条件时才显示这些实体。

`entities` 中实体的选项：

- `entity`（字符串，必填）：要显示的实体。
- `name`（字符串）：标记上的标签。
- `color`（字符串）：标记及其路径的颜色。
- `label_mode`（字符串）：标记显示的内容：`name`、`state`、`attribute` 或 `icon`。默认为 `name`。
- `attribute`（字符串）：当 `label_mode: attribute` 时要显示的属性。
- `unit`（字符串）：显示在属性之后的单位。
- `focus`（布尔值）：当地图适配时，使该实体保持在视野内。默认为 `true`。

```yaml
type: map
hours_to_show: 24
entities:
  - person.alex
  - entity: person.sam
    color: "#93c47d"
  - zone.home
  - zone.work
```

## 代码实现

该卡片位于 [`src/panels/lovelace/cards/hui-map-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-map-card.ts)，元素为 `<hui-map-card>`。地图本身是 [`src/components/map/`](https://github.com/home-assistant/frontend/tree/dev/src/components/map) 中的 `<ha-map>`，它也被人员实体的更多信息对话框以及设置中的位置编辑器使用。它使用 MapLibre 绘制矢量地图，并在无法显示矢量地图的设备上回退到 Leaflet。样式位于 [`src/common/map/map-styles.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/map/map-styles.ts)。

在分区视图中，地图占据全宽和 4 行。它可以缩小到 6 列和 2 行。

[源代码](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-map-card.ts)
