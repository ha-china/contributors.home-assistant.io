# 仪表盘

> 一个由卡片组成的页面，用于显示和控制家庭。用户可以拥有任意数量的仪表盘。

Source: https://www.hasscn.top/contributors/glossary/dashboard/

- In code: `lovelace`, `hui-`
- Also: dashboards
- Formerly: Lovelace, Lovelace UI (old name: don't use it in new text)

一个仪表盘（dashboard）包含一个或多个[视图（view）](https://www.hasscn.top/contributors/glossary/view/)，每个视图承载若干[卡片（card）](https://www.hasscn.top/contributors/glossary/card/)。Home Assistant 可以通过[策略（strategy）](https://www.hasscn.top/contributors/glossary/strategy/)自动构建仪表盘。

仪表盘曾以其代号 Lovelace 命名，直到 Home Assistant 2022.4 才更改。代码中仍在使用该名称，例如 `lovelace` 面板以及仪表盘元素的 `hui-` 前缀。在文字中，请使用“仪表盘”。

## Related terms

- [视图（View）](https://www.hasscn.top/contributors/glossary/view/): 仪表盘中的一个页面。其类型（如 sections、masonry 或 panel）决定了卡片的布局方式。
- [卡片（Card）](https://www.hasscn.top/contributors/glossary/card/): 仪表盘上的一个区块，用于显示或控制某些内容，例如实体（entity）、图表或天气预报。
- [策略（Strategy）](https://www.hasscn.top/contributors/glossary/strategy/): 一种代码，用于根据家庭本身、其区域、设备和实体来构建仪表盘、视图或部分，而不是使用固定配置。
- [面板（Panel）](https://www.hasscn.top/contributors/glossary/panel/): Home Assistant 中一个独立的页面，通常显示在侧边栏中，例如仪表盘、地图或设置。
