# 架构决策是如何做出的

> 架构在哪里讨论、决策如何记录，以及你如何参与其中。

Source: https://www.hasscn.top/contributors/architecture/decisions/

架构会议守护着 Home Assistant 的技术架构。任何对 Home Assistant 构建方式的更改都需要经过它的批准。

会议做出决策，但并不是关起门来决定的。每个提案都始于 GitHub 上[架构仓库](https://github.com/home-assistant/architecture)中的讨论，讨论结果也会发布在那里。任何人都可以阅读，任何人都可以发起讨论。

## 什么属于架构问题

大多数更改不需要事先讨论：修复 bug、在集成（integration）中添加新功能，或者一个[已达到进入核心（core）标准](https://www.hasscn.top/contributors/core/integrations/create/#does-it-belong-in-core)的新集成。直接提交 pull request 即可。

当更改会影响所有人基于 Home Assistant 进行开发的方式时，请发起讨论，例如：

- 一种新的实体（entity）类型，或对现有实体类型的重大更改
- 一条针对集成的新规则，或对某条规则的例外
- 项目支持范围的更改，例如安装方式或 Python 版本
- Home Assistant 其他部分将基于其构建的新概念

如果你不确定，请在 [Discord](https://www.home-assistant.io/join-chat) 的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道中询问。这能避免你写出不得不中途返工的代码。

## 从讨论到决策

1. **讨论。** 有人发起一个[讨论](https://github.com/home-assistant/architecture/discussions)，说明问题并提出提案。其他人提问、挑毛病并提出替代方案。一个讨论只围绕一个主题。
2. **决策。** 当讨论尘埃落定后，提案会在架构会议上做出决定。结果会发布在讨论中并标记为该讨论的答案：批准或拒绝，附上会议日期，以及备注或理由。
3. **记录。** 为整个项目设定长期规则的决策，还会以架构决策记录（Architecture Decision Record，ADR）的形式写入 [`adr` 文件夹](https://github.com/home-assistant/architecture/tree/master/adr)。

## 决策与路线图

架构会议不属于路线图流程的一部分，而是与之并行：任何对 Home Assistant 构建方式的更改都需要经过它的批准，无论该更改来自路线图还是贡献者自己的想法。

更大的工作会作为机会规划在 Open Home Foundation 的[路线图](https://www.hasscn.top/contributors/roadmap/)上，并通过[史诗（epic）](https://github.com/home-assistant/epics)交付。当一个机会改变了 Home Assistant 的构建方式，例如为实体组件添加新的触发器和条件，那么在工作合入之前需要先做出架构决策。

这个过程也可以双向进行。以[太阳触发器](https://github.com/home-assistant/architecture/discussions/1394)为例，机会先出现：讨论将其链接为推理所在之处，架构会议批准了修订后的提案，机会再链接回该批准，工作则在一个史诗中规划。另一些机会则建立在先存在的架构讨论之上。[从想法到发布](https://www.hasscn.top/contributors/roadmap/how-it-works/)从头到尾遵循的就是后一种模式。

## 架构决策记录（ADR）

ADR 是一份格式固定的简短文档：背景、决策及其后果。它有编号，且永远不会被删除。当决策发生变化时，其状态会说明这一点，并链接到取代它的内容。

这使得 ADR 成为项目的一部历史。一些值得了解的 ADR：

| ADR | 决策 |
| --- | --- |
| [0007](https://github.com/home-assistant/architecture/blob/master/adr/0007-integration-config-yaml-structure.md) | 集成的 YAML 配置存放在其自身的域名（domain）之下。 |
| [0008](https://github.com/home-assistant/architecture/blob/master/adr/0008-code-owners.md) | 成为集成负责人意味着什么。 |
| [0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md) | 连接设备或服务的集成在 UI 中设置。 |
| [0011](https://github.com/home-assistant/architecture/blob/master/adr/0011-discovery-requires-unique-id.md) | 可被发现的集成会设置唯一 ID，以便用户可以忽略某次发现。 |
| [0012](https://github.com/home-assistant/architecture/blob/master/adr/0012-define-supported-installation-method.md) | 什么是受支持的安装方式。 |
| [0018](https://github.com/home-assistant/architecture/blob/master/adr/0018-supported-databases.md) | 记录器（recorder）支持哪些数据库。 |
| [0019](https://github.com/home-assistant/architecture/blob/master/adr/0019-GPIO.md) | 不再接受直接使用 GPIO 引脚的新集成。 |
| [0020](https://github.com/home-assistant/architecture/blob/master/adr/0020-minimum-supported-python-version.md) | 一次只支持一个 Python 次要版本。 |
| [0021](https://github.com/home-assistant/architecture/blob/master/adr/0021-YAML-integration-configuration-deprecation-policy.md) | YAML 配置在移除前至少弃用六个月。 |
| [0022](https://github.com/home-assistant/architecture/blob/master/adr/0022-integration-quality-scale.md) | 集成质量等级及其四个级别。 |

一些 ADR 后来已被撤销：例如关于 Home Assistant Core 和 Supervised 安装方式的那些。它们的状态在文档顶部有说明。

## 在讨论中使用 AI

架构仓库中还包含 Open Home Foundation 的 [AI 政策](https://github.com/home-assistant/architecture/blob/master/AI_POLICY.md)。它适用于所有项目中的讨论、issue 和 pull request。简而言之：你可以将 AI 作为工具使用，但你必须理解并能够解释你发布的所有内容，且不允许自主代理（autonomous agent）进行贡献。

## 参与其中

- 有提案？先阅读[开放的讨论](https://github.com/home-assistant/architecture/discussions)：你的提案可能已经在那里了。
- 想知道某项决策如何融入整体规划？请参阅[从想法到发布](https://www.hasscn.top/contributors/roadmap/how-it-works/)。
- 完全不知道从哪里开始贡献？[你的第一次贡献](https://www.hasscn.top/contributors/start/first-contribution/)可以帮你做出选择。
