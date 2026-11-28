# 自定义集成（custom integration）

> 不属于 Home Assistant Core 的集成，由用户安装到 `custom_components` 文件夹中。

Source: https://www.hasscn.top/contributors/glossary/custom-integration/

- In code: `custom_components/`
- Also: custom integrations, custom component

任何人都可以编写自定义集成（custom integration），它的工作方式与其他集成相同。项目不会对它们进行审核，Home Assistant Core 的变更也可能导致它们失效，因此面向开发者的不向后兼容变更（backward-incompatible changes）会在博客上公告。

自定义集成需要在其清单（manifest）中包含 `version`。用户可以通过 [Marketplace](https://www.hasscn.top/contributors/glossary/marketplace/) 查找并安装许多自定义集成，该功能从 2026.11 起内置于 Home Assistant。在此之前，Marketplace 是 [HACS](https://www.hasscn.top/contributors/glossary/hacs/)，它本身也是一个自定义集成。要发布自定义集成，请参阅 Marketplace 区域中的 [custom integrations](https://www.hasscn.top/contributors/marketplace/guides/integrations/)。这也是开始开发新集成的推荐方式，请参阅 [does it belong in core](https://www.hasscn.top/contributors/core/integrations/create/#does-it-belong-in-core)。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [向后不兼容的变更](https://www.hasscn.top/contributors/glossary/backward-incompatible-change/): 一种需要用户或开发者在他们那一侧做出更改的变更，例如修改他们的配置或自定义集成。
- [自定义卡片（Custom card）](https://www.hasscn.top/contributors/glossary/custom-card/): 不属于前端、由用户从 JavaScript 文件加载的卡片。
- [Marketplace（市场）](https://www.hasscn.top/contributors/glossary/marketplace/): Home Assistant 中用户查找并安装社区自制自定义集成、仪表盘卡片、主题和模板宏的地方。自 2026.11 起内置。
