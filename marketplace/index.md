# 市场（Marketplace）

> 与所有运行 Home Assistant 的用户分享你的作品。发布自定义集成、仪表盘卡片、主题、模板宏和蓝图，并保持它们及时更新。

Source: https://www.hasscn.top/contributors/marketplace/

人们为 Home Assistant 构建的东西，并非所有都适合放进 Home Assistant 本体。一张针对某个特定设备的卡片、一个使用你喜爱配色的主题、一个只有少数人使用的服务的集成、一个解决了你家中问题的自动化：它们都值得分享，而且有成千上万的人正在这样做。

分享是让 Home Assistant 成为 Home Assistant 的重要原因之一。有人为自己的壁挂平板做了一张卡片并分享出来。另一个人在自己家中使用它，发现了一个 bug，并提交了修复。第三个人看到它，萌生了一个新想法。你分享的内容会启发他人、帮助他们前进，而他们分享的内容也会同样回馈于你。这就是社区：热爱 Home Assistant、并乐于分享自己用它所做成果的人们。

[市场（Marketplace）](https://www.hasscn.top/contributors/glossary/marketplace/)是用户查找并安装这些作品的地方。从 2026.11 版本开始，它内置于 Home Assistant 中，位于**设置** > **市场**。它源自 [HACS](https://www.hasscn.top/contributors/glossary/hacs/)——多年来人们作为自定义集成安装的社区商店——并使用相同的目录和相同的 `hacs.json` 文件。今天能与 HACS 配合使用的集成、卡片、主题或模板，大概率也能在市场中使用，不过市场在安装前会以更严格的标准检查一些事项。AppDaemon 应用和 Python 脚本是例外：市场不支持它们。

市场也是新集成或仪表盘卡片的起点。在这里发布它，等它成熟并拥有用户群后，联系维护者，看看它是否应该作为内置功能发布。参见[它是否属于 core](https://www.hasscn.top/contributors/core/integrations/create/#does-it-belong-in-core)。

## 你可以分享什么

| 内容 | 作用 | 分享方式 |
| --- | --- | --- |
| [自定义集成](https://www.hasscn.top/contributors/marketplace/guides/integrations/) | 为设备或服务添加支持，就像内置集成一样 | 市场 |
| [仪表盘卡片或插件](https://www.hasscn.top/contributors/marketplace/guides/dashboard/) | 为仪表盘添加卡片、卡片功能、徽章或其他构建模块 | 市场 |
| [主题](https://www.hasscn.top/contributors/marketplace/guides/themes/) | 更改界面的颜色和部分尺寸 | 市场 |
| [模板宏](https://www.hasscn.top/contributors/marketplace/guides/templates/) | 可供他人导入到自己模板中的可复用 Jinja 宏 | 市场 |
| [蓝图（blueprint）](https://www.hasscn.top/contributors/marketplace/guides/blueprints/) | 带有留空供他人填写的自动化、脚本或模板实体 | 通过导入链接，以及论坛上的 [Blueprint Exchange](https://community.home-assistant.io/c/blueprints-exchange/53) |

蓝图不在市场中。用户通过链接导入它们，Home Assistant 会记住该链接以获取更新。它们出现在这里是因为分享的精神是相同的：你发布，他人安装，你保持它正常运作。

## 这适合谁

如果你为自己的 Home Assistant 构建了一些东西，并希望他人也能使用，那么这个板块就是为你准备的。你需要什么取决于你分享的内容：

- 蓝图需要 YAML 和一个在你自己家中可正常运行的自动化。无需编程。
- 主题需要 YAML 和对色彩的敏锐眼光。
- 卡片或其他仪表盘插件需要 JavaScript。
- 集成需要 Python。

除蓝图外的所有类型都存放在公开的 GitHub 仓库中。你不需要成为 Git 专家，但需要一个账号，并且能够发布 release。

以这种方式分享的一切都由你制作和支持，而非 Home Assistant 项目。用户在从市场安装任何内容之前，都会看到说明这一点的警告。请准备好回复 issue，并在 Home Assistant 发生变化时更新你的作品。

## 从这里开始

1. [你的第一次贡献](https://www.hasscn.top/contributors/marketplace/first-contribution/)：把你已经在使用的自动化变成蓝图，并分享它。
2. [工作原理](https://www.hasscn.top/contributors/marketplace/how-it-works/)：市场如何查找、检查、安装和更新你发布的内容，以及蓝图如何被分享和更新。
3. 在下方选择与你构建内容对应的指南。

## 指南

- [自定义集成](https://www.hasscn.top/contributors/marketplace/guides/integrations/)：当你的集成位于 core 之外时有什么不同。
- [仪表盘卡片和插件](https://www.hasscn.top/contributors/marketplace/guides/dashboard/)：打包卡片、卡片功能或其他 JavaScript 模块。
- [主题](https://www.hasscn.top/contributors/marketplace/guides/themes/)：结构、可设置的变量、浅色和深色模式，以及测试。
- [模板宏](https://www.hasscn.top/contributors/marketplace/guides/templates/)：以模板文件的形式分享 Jinja 宏。
- [蓝图](https://www.hasscn.top/contributors/marketplace/guides/blueprints/)：编写、测试、版本管理和分享蓝图。
- [发布与更新](https://www.hasscn.top/contributors/marketplace/guides/releases/)：用户如何获取你的新版本，以及如何保持它们正常运作。
- [进入目录](https://www.hasscn.top/contributors/marketplace/guides/catalog/)：将你的仓库添加到目录中，让所有人都能找到它。

## 参考

- [hacs.json](https://www.hasscn.top/contributors/marketplace/reference/hacs-json/)：该文件的每个键，以及市场如何处理它们。
- [仓库结构](https://www.hasscn.top/contributors/marketplace/reference/repository-structure/)：按类型划分的文件存放位置。
- [校验检查](https://www.hasscn.top/contributors/marketplace/reference/validation/)：HACS action 检查什么，以及市场拒绝安装什么。

## 相关板块

- [Core 与集成](https://www.hasscn.top/contributors/core/integrations/)：如何构建集成，无论是否为自定义。
- [自定义卡片等](https://www.hasscn.top/contributors/frontend/custom-ui/)：如何构建卡片、卡片功能、徽章、视图、策略和面板。
- [主题与设计令牌](https://www.hasscn.top/contributors/frontend/architecture/theming/)：从前端角度了解主题会更改的 CSS 变量。
- [安全](https://www.hasscn.top/contributors/security/)：在他人家中运行的代码需要注意什么。

## 联系谁

- [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 上的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道是构建集成和卡片的人们互相帮助的地方。看不到该频道？在 **Channels & Roles** 下，选择 **I want to contribute dev skills to Home Assistant**。
- 关于目录、`hacs.json` 或 HACS action 的问题：[HACS Discord 服务器](https://discord.gg/apgchf8)，以及 [hacs/integration](https://github.com/hacs/integration/issues) 的 issues。
- 蓝图在社区论坛的 [Blueprint Exchange](https://community.home-assistant.io/c/blueprints-exchange/53) 中分享和讨论。
- 在市场本身发现了 bug？在 [core 仓库](https://github.com/home-assistant/core/issues)中提交 issue。
