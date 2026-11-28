# 设计原则

> 每一个设计决策背后的价值观。开放之家（Open Home）对界面意味着什么，以及 Home Assistant 的个性如何在其中体现。

Source: https://www.hasscn.top/contributors/design/principles/

Home Assistant 中的每一个设计决策都可以追溯到几条价值观。当两个都不错的方案相互竞争时，由它们来决定取舍。

本页讨论这些价值观对界面意味着什么。[我们的原则](https://www.hasscn.top/contributors/start/principles/) 介绍整个项目的价值观以及我们如何协作。[架构原则](https://www.hasscn.top/contributors/architecture/principles/) 介绍它们对代码意味着什么。

## 开放之家（Open Home）

开放之家是 Home Assistant 对智能家居的愿景。它建立在 [Open Home Foundation](https://www.hasscn.top/contributors/glossary/open-home-foundation/) 的三大价值观之上：隐私、选择和可持续性。

### 隐私

你的家是你的安全空间。设备在本地工作，没有人需要知道你何时开了一盏灯。云连接可以作为额外的选项，但它必须是自愿开启的，绝不能是必需的。

在设计上：本地优先。绝不要设计一个明明可以在本地工作、却只能通过云端才能使用的流程。

### 选择

你的设备收集的数据属于你。你可以组合来自任何制造商的设备，任何厂商都无法把你锁死在他们的生态里。

在设计上：不要偏袒任何品牌或生态系统。向人们展示什么是可能的，然后让他们自己决定。

### 可持续性

一个智能家居应该在未来十年里持续工作，而不是直到某个制造商转向别处就失效。设备和软件都应为长久使用而构建。

在设计上：谨慎对待变更。界面上的每一次变更，都会对数百万已经熟悉旧方式的人提出要求。只有当变更能明显带来改善时才进行变更，并帮助人们找到方向。

## Home Assistant 的行为方式

Home Assistant 有自己的个性，由五个特质来描述。在界面中，它们体现在细微之处：如何解释一个错误，如何命名一个设置，一个空白的屏幕如何邀请你采取行动。

- **热情好客（Welcoming）**：以人们自己的水平与他们相遇。绝不要让任何人因为不了解某件事而感到愚蠢。
- **坦诚直率（Candid）**：诚实地说明什么能用、什么不能用。不要用虚假的简单来掩盖复杂性。
- **支持引导（Supportive）**：引导人们前进，而不是取而代之。解释出了什么问题，以及接下来该怎么做。
- **慷慨大方（Generous）**：把控制权交给人们。没有人为的限制，没有暗黑模式（dark patterns）。
- **独立自主（Independent）**：以 Home Assistant 自己的方式做事，而不是因为某个大型科技平台那样做。

每个特质的完整描述见 [个性](https://www.hasscn.top/contributors/brand/personality/)。
