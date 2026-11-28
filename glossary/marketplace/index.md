# Marketplace（市场）

> Home Assistant 中用户查找并安装社区自制自定义集成、仪表盘卡片、主题和模板宏的地方。自 2026.11 起内置。

Source: https://www.hasscn.top/contributors/glossary/marketplace/

- In code: `marketplace`, `hacs.json`

Marketplace（市场）是核心中的 `marketplace` 集成，其面板位于 **Settings** > **Marketplace**。它是引入 Home Assistant 的 [HACS](https://www.hasscn.top/contributors/glossary/hacs/)：显示相同的目录，并从每个仓库读取相同的 `hacs.json` 文件。

它安装的内容由社区制作和支持，而非 Home Assistant 项目。[蓝图（blueprint）](https://www.hasscn.top/contributors/glossary/blueprint/)不在 Marketplace 中：用户通过链接导入它们。[Marketplace 区域](https://www.hasscn.top/contributors/marketplace/)介绍了如何为其发布内容。

## Related terms

- [HACS](https://www.hasscn.top/contributors/glossary/hacs/): Home Assistant 社区商店（Home Assistant Community Store）：在 2026.11 中 Marketplace 取代它之前，用于安装社区制作的集成、卡片和主题的自定义集成。它的目录和工具仍在使用。
- [自定义集成（custom integration）](https://www.hasscn.top/contributors/glossary/custom-integration/): 不属于 Home Assistant Core 的集成，由用户安装到 `custom_components` 文件夹中。
- [自定义卡片（Custom card）](https://www.hasscn.top/contributors/glossary/custom-card/): 不属于前端、由用户从 JavaScript 文件加载的卡片。
- [主题](https://www.hasscn.top/contributors/glossary/theme/): 一组 CSS 变量，用于更改前端界面的颜色及部分尺寸。
