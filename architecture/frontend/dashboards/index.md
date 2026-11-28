# 仪表盘是如何工作的

> 仪表盘如何由视图、分区、卡片和徽章组成，策略如何生成它们，以及自定义卡片如何融入其中。

Source: https://www.hasscn.top/contributors/architecture/frontend/dashboards/

[仪表盘](https://www.hasscn.top/contributors/glossary/dashboard/)是一个由[卡片](https://www.hasscn.top/contributors/glossary/card/)组成的页面，也是大多数人最常看到的前端部分。在底层，它是一个配置，由视图、分区、卡片和徽章组成，前端会将其转换为元素。

> [!NOTE]
> 仪表盘过去被称为 Lovelace，代码中仍然使用这个名称：面板是 `lovelace`，仪表盘元素以 `hui-` 开头。在文字中，请使用“仪表盘”。

## 简而言之

- 一个仪表盘包含视图。一个视图包含分区，分区包含卡片，或者根据视图类型直接包含卡片。
- 每种卡片类型都是一个 Web 组件，例如 `hui-tile-card`，在仪表盘使用它时加载。
- 仪表盘存储在 Home Assistant 中，或者用 YAML 编写。
- 策略（strategy）可以根据家庭本身生成仪表盘或视图。
- 自定义卡片是从 JavaScript 文件加载的 Web 组件。

## 从配置到元素

仪表盘是一个配置，如下所示：

```yaml
views:
  - title: Home
    type: sections
    sections:
      - type: grid
        cards:
          - type: tile
            entity: light.kitchen
```

前端读取它，并为每个部分创建一个元素：一个视图、一个分区、一个带有其配置的 `hui-tile-card`。卡片类型在仪表盘首次使用时加载。

## 视图

| 视图类型 | 布局方式 |
| --- | --- |
| `sections` | 分区排列在网格上，每个分区有自己的卡片。新仪表盘的默认类型。 |
| `masonry` | 卡片按列排列，根据高度放置 |
| `sidebar` | 一列宽的卡片和一列窄的卡片 |
| `panel` | 一张卡片，覆盖整个页面 |

## 卡片、徽章和功能

- **卡片**显示和控制事物。它们的配置说明了具体内容。许多卡片都有可视化编辑器。
- **徽章**是视图顶部的小药丸形元素。
- **[卡片功能](https://www.hasscn.top/contributors/glossary/card-feature/)**为卡片添加控件，例如亮度滑块。

卡片及其配置选项在[仪表盘卡片](https://www.hasscn.top/contributors/design/dashboards/)中，附有实时示例。

## 仪表盘存储在哪里

- **存储中**：默认方式。用户在 UI 中编辑它，Home Assistant 通过 WebSocket API 保存它。
- **YAML 中**：用户在文件中编写它。UI 无法编辑它。

## 策略和自定义元素

[策略](https://www.hasscn.top/contributors/glossary/strategy/)是生成仪表盘、视图或分区的代码，而不是固定的配置。用户首次打开 Home Assistant 时看到的仪表盘就是一个策略：它根据区域（area）和设备（device）自动构建，并在添加新内容时保持更新。用户可以接管生成的仪表盘，并从那里编辑其配置。

卡片、徽章、视图和策略也可以来自前端之外，作为从 JavaScript 文件加载的 Web 组件，并使用 `custom:` 类型，例如 `custom:my-card`。它们获得与内置组件相同的 `hass` 对象和配置。如何构建它们请参阅[自定义卡片及更多](https://www.hasscn.top/contributors/frontend/custom-ui/)。

## 在代码中

| 内容 | 位置 |
| --- | --- |
| 仪表盘面板 | [`src/panels/lovelace/`](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace) |
| 视图、分区、卡片、徽章、功能 | 仪表盘面板中的 `views/`、`sections/`、`cards/`、`badges/`、`card-features/` |
| 策略 | 仪表盘面板中的 `strategies/` |
| 从配置创建元素 | 仪表盘面板中的 `create-element/` |
| 编辑器 | 仪表盘面板中的 `editor/` |

## 参与这项工作

- 从[你的第一个前端贡献](https://www.hasscn.top/contributors/frontend/first-contribution/)开始。
- 构建你自己的卡片、徽章或策略：[自定义卡片及更多](https://www.hasscn.top/contributors/frontend/custom-ui/)。
- 内置卡片及其应有的外观和行为：设计区域中的[仪表盘卡片](https://www.hasscn.top/contributors/design/dashboards/)。
