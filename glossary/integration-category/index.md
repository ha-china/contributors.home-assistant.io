# 集成类别

> 集成所属的类别，例如照明（Lighting）或能源（Energy），以便人们能根据其功能找到它，例如在网站的集成页面上。

Source: https://www.hasscn.top/contributors/glossary/integration-category/

- In code: `categories`, `ha_categories`
- Also: integration categories

集成在其[清单文件（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/#categories)的 `categories` 键中列出一到三个类别。核心（core）中的每个集成都包含这些类别，但实体（entity）、系统（system）和虚拟（virtual）集成除外。对于自定义集成（custom integration），这些类别是可选的。核心集成的文档页面会在 home-assistant.io 的[前置元数据（front matter）](https://www.hasscn.top/contributors/writing/reference/front-matter/)中，以 `ha_categories` 列出相同的类别。一个类别可以包含子类别，例如 `energy.ev_charging`。[集成类别](https://www.hasscn.top/contributors/core/integrations/categories/)页面列出了所有类别，以及如何选择类别。

Home Assistant 中“类别（category）”一词也用于其他用途。它们并不相同：

- 在 Home Assistant 本身中创建的类别，用于组织自动化（automation）、脚本（script）、场景（scene）和辅助元素（helper）。这些类别保存在类别注册表中，对于使用该 Home Assistant 的所有用户都是相同的。
- [实体类别（entity category）](https://www.hasscn.top/contributors/glossary/entity-category/)用于将实体标记为配置（configuration）或诊断（diagnostic）。
- 在 Marketplace 和 HACS action 中，`category` 指的是仓库的类型：集成、仪表盘插件、主题或模板。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
- [自定义集成（custom integration）](https://www.hasscn.top/contributors/glossary/custom-integration/): 不属于 Home Assistant Core 的集成，由用户安装到 `custom_components` 文件夹中。
- [实体类别（entity category）](https://www.hasscn.top/contributors/glossary/entity-category/): 将实体标记为配置或诊断类别，使其不会显示在设备的主要控制项旁边。
