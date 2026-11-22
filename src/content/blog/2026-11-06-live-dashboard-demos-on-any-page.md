---
title: 在任何网页上展示实时仪表盘演示
description: Home Assistant 演示现在发布了一些元素，可以将真实的卡片、分区、视图和整个仪表盘放到任何网页上，并在浏览器中针对模拟后端运行。
date: 2026-11-06
authors:
  - Aidan Timson
areas:
  - frontend
---

截图展示卡片的外观。实时演示展示其工作方式：人们可以打开灯、移动滑块，并观察其他卡片随之变化。[Home Assistant 演示](https://demo.home-assistant.io/) 现在发布了一个脚本，可以在任何网页上实现此功能，例如自定义卡片的 README 站点、您的博客或这些文档。所有内容都在浏览器中针对模拟后端运行，因此无需 Home Assistant 服务器。

## 元素

- `<ha-embed-provider>` 持有模拟后端及其实体和设备。
- `<ha-embed-card>` 渲染一张卡片，可以是内置或自定义的。
- `<ha-embed-section>` 渲染一个分区，或一个[分区策略](/frontend/custom-ui/strategy/#a-section-strategy)。
- `<ha-embed-view>` 渲染一个带有徽章的视图、一个[视图策略](/frontend/custom-ui/strategy/#a-view-strategy)，或仪表盘中的一个视图。
- `<ha-embed-dashboard>` 渲染带有选项卡的整个仪表盘，或一个[仪表盘策略](/frontend/custom-ui/strategy/#a-dashboard-strategy)。

该脚本跟随发布版本的前端，因此 `https://demo.home-assistant.io/embed.js` 始终包含当前版本的卡片。

## 加载脚本

每个元素都来自一个脚本。将其添加到您的页面一次，它会从演示站点加载其他文件：

```html
<script
  type="module"
  src="https://demo.home-assistant.io/embed.js"
></script>
```

## 添加卡片

将实体放入 provider，将卡片配置放入 card。两者都接受 script 标签中的 JSON 或 YAML，卡片配置与仪表盘中的相同：

```html
<ha-embed-provider>
  <script type="text/yaml">
    - entity_id: light.kitchen
      state: "on"
      attributes:
        friendly_name: Kitchen
        supported_color_modes:
          - brightness
        color_mode: brightness
        brightness: 180
  </script>
  <ha-embed-card>
    <script type="text/yaml">
      type: tile
      entity: light.kitchen
      features:
        - type: light-brightness
    </script>
  </ha-embed-card>
</ha-embed-provider>
```

同一 provider 中的所有卡片共享其实体，因此在一张卡片中更改灯光也会在其他卡片中更改。要展示您自己的卡片，请在演示脚本之后加载其脚本，并使用其 `custom:` 类型。自定义策略以相同方式加载。

## 分区、视图和仪表盘

同一个 provider 也可以驱动更大的布局。使用上面的 provider，以下内容展示了一个带有两个选项卡的仪表盘：

```html
<ha-embed-dashboard style="height: 480px">
  <script type="text/yaml">
    views:
      - title: Home
        path: home
        cards:
          - type: tile
            entity: light.kitchen
      - title: Kitchen
        path: kitchen
        cards:
          - type: light
            entity: light.kitchen
  </script>
</ha-embed-dashboard>
```

仪表盘保持其自身的当前视图，因此您页面的地址保持不变，并且同一页面上的两个仪表盘不会相互跟随。指向其自身视图、子视图及其返回按钮的链接，以及指向您页面上锚点的链接都可以正常工作。没有编辑模式。

## 提示：一个站点用于所有项目

如果您维护多个卡片或策略，则无需为每个项目单独建立演示站点。为每个项目提供一个演示配置，将实体放在 `entities` 中，将要展示的内容放在 `cards`、`sections`、`views` 或 `dashboard` 中。这些配置可以全部放在宿主站点中，也可以由每个项目自行维护，例如在其代码旁边放置一个 `demo.yml`：

```yaml
entities:
  - entity_id: light.kitchen
    state: "on"
    attributes:
      friendly_name: Kitchen
cards:
  - type: custom:my-card
    entity: light.kitchen
```

然后，站点渲染每个配置：实体进入 provider，每个卡片、分区、视图或仪表盘进入其元素，作为其 script 标签中的 YAML。在演示脚本之后加载每个卡片的脚本，每个项目都可以从一个站点获得实时演示。有关更多信息，请参阅[在一个站点上展示多个项目](/frontend/custom-ui/demo/#show-several-projects-on-one-site)。

## 工作原理

嵌入功能由与演示相同的代码构建，位于[前端仓库](https://github.com/home-assistant/frontend/tree/dev/demo/src/embed)的 `demo/src/embed/` 中。

### 一个脚本，可从任何位置加载

`embed.js` 根据其自身 URL 设置 bundle 的公共路径，因此其代码块、翻译和图标都从演示站点加载，而不是从您的页面加载。浏览器只从页面自身的源启动 worker，因此来自演示站点的 worker（例如 markdown 卡片的 worker）会从一个导入真实脚本的小型 blob 启动。演示站点通过 CORS 提供其文件。

### 每个 provider 一个模拟的 `hass`

`<ha-embed-provider>` 创建与演示和图库相同的模拟 `hass` 对象，并在其上注册 `demo/src/stubs/` 中的存根：根据当前状态生成的操作、历史和统计信息（演示中的一些能源传感器会获得自己的统计信息）、天气预报、待办事项列表、日历事件、能源，以及区域、设备和实体注册表。灯光、气候、窗帘和其他域具有专门的模拟，因此它们的操作会像 Home Assistant 那样改变其状态。provider 通过 Lit context 将 `hass` 传递给其元素。

### 元素找到它们的 provider

卡片、分区、视图或仪表盘使用其周围的 provider，并穿透 shadow roots 查找，因此它可以在您自己的组件内部工作。在 provider 之外，它使用页面上的第一个 provider，或者 `provider` 属性可以通过 ID 选择一个。这意味着页面顶部的一个 provider 可以为下方文本中的卡片提供数据。

### 真实的仪表盘代码

卡片通过 `hui-card` 渲染，分区通过 `hui-section` 渲染，视图通过 `hui-view` 渲染，仪表盘通过 `hui-root` 渲染，这些元素和策略代码与仪表盘面板相同。卡片采用它们在分区中应有的宽度，因此 12 列网格的布局与仪表盘一致。卡片将其样式保留在 shadow roots 中，并跟随浏览器的浅色或深色模式，或 provider 的 `color-scheme` 属性。

### 您的页面保持主导

provider 具有 `hass.mockEntities` API，可以从您的页面更改实体，并在实体更改时触发 `states-changed` 事件。元素在设置时读取其 script 标签，因此您也可以等到演示滚动到视图中再加载脚本。

## 您可以在哪里看到它

这些文档已经使用了嵌入功能。许多[实体页面](/core/entities/light/)展示了其实体类型的卡片，大多数[仪表盘卡片页面](/design/dashboards/tile-card/)实时展示了其卡片，而实时演示的文档展示了您可以探索的分区、视图和仪表盘。

## 了解更多

- [展示您的卡片的实时演示](/frontend/custom-ui/demo/)：每个元素和选项，带有实时示例。
- [区域、设备、日历和能源](/frontend/custom-ui/demo/#areas-devices-calendars-and-energy)：为需要更多实体的卡片提供数据。
- [从您的页面更改和观察实体](/frontend/custom-ui/demo/#change-and-watch-entities-from-your-page)：使用您自己的脚本驱动演示。
- [模拟后端可以做什么](/frontend/custom-ui/demo/#what-the-mocked-backend-can-do)：需要记住的限制。
- [图库和演示](/frontend/development/gallery-and-demo/#embed-cards-on-other-sites)：嵌入功能在前端中的位置，以及如何添加您的卡片所需的模拟。
