# 架构原则

> Home Assistant 构建方式背后的理念。了解它们之后，代码评审中的许多规则就不再令人意外。

Source: https://www.hasscn.top/contributors/architecture/principles/

Home Assistant 已经发展了十多年，拥有数千名贡献者。让它凝聚在一起的是一小组随处可见的理念：体现在代码中、评审中，以及记录在[架构仓库](https://www.hasscn.top/contributors/architecture/decisions/)中的决策里。

你不需要把它们背下来。但当评审者要求你修改某些东西而你不知道为什么时，答案几乎总是其中之一。

本页讲的是这些价值观对代码及其构建方式意味着什么。[我们的原则](https://www.hasscn.top/contributors/start/principles/)介绍整个项目的价值观以及我们如何协作。[设计原则](https://www.hasscn.top/contributors/design/principles/)介绍它们对界面的意义。

## 你的家，你的数据

Home Assistant 在你的家中运行，并且只要可能就可以在没有互联网的情况下工作。关于你家的数据会留在那里，除非你选择将其发送到别处。这也是 [Open Home Foundation](https://www.hasscn.top/contributors/glossary/open-home-foundation/) 所代表的：隐私、选择和可持续性。

这对你的构建意味着：

- 优先通过本地网络与设备通信，而不是通过制造商的云。[集成的 IoT class](https://www.hasscn.top/contributors/glossary/iot-class/) 告诉用户他们会得到哪一种。
- 在用户不知情且未选择的情况下，不向任何人发送任何东西。分析功能是可选加入的。
- 基础功能不依赖项目自身的服务。Home Assistant Link 是一个选项，绝不是必需品。

## 一个进程，一个事件循环

Home Assistant Core 是单个 Python 进程。几乎所有东西都运行在一个[事件循环](https://www.hasscn.top/contributors/core/internals/asyncio/)（event loop）上：每个集成、每个自动化、每个 API 请求。这使它足够轻量，可以在小型计算机上运行，而且速度快——但前提是每个人都遵守规则。

这对你的构建意味着：

- 绝不阻塞事件循环。在没有 `await` 的情况下等待网络或磁盘会冻结整个家，而不仅仅是你的集成。
- 只能阻塞的代码，比如不支持 async 的库，应在工作线程中运行。

## 设备逻辑放在库中

集成在 Home Assistant 与设备或服务之间进行转换。知道如何与该设备通信的代码，即其协议和 API，放在 PyPI 上一个独立的 Python 库中。集成将该库作为[依赖](https://www.hasscn.top/contributors/glossary/requirement/)（requirement）使用。

这让 Home Assistant Core 专注于 Home Assistant 本身。该库可以独立地测试、发布并被其他项目使用，而集成也保持得足够小，便于评审。

## 在 UI 中设置

用户在 UI 中向他们的家添加[集成](https://www.hasscn.top/contributors/glossary/integration/)，而不是通过编辑 YAML。连接到设备或服务的集成通过[配置流程](https://www.hasscn.top/contributors/glossary/config-flow/)（config flow）进行设置。这是在 [ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md) 中决定的。

YAML 仍然存在，用于自动化、模板以及一些不连接任何东西的集成。但对于设备来说，UI 是入口。

## 一切都变成实体和操作

Philips Hue 的灯和 IKEA 的灯在 Home Assistant 中的外观和行为是一样的。集成将设备的任何功能转换为带有状态的[实体](https://www.hasscn.top/contributors/glossary/entity/)（entity），以及控制它们的操作。

正是这个共享模型让其余一切成为可能。仪表盘、自动化、语音和历史记录都能与任何集成协同工作，因为它们只看到实体。当你构建集成时，你的任务是把设备适配到这个模型中，而不是创建一个新模型。

## 用户的选择优先

用户重命名实体、把设备放入区域（area）、隐藏他们不需要的东西。这些更改保存在[注册表](https://www.hasscn.top/contributors/architecture/core/registries/)中，而不是集成中，并且它们能在重启和更新后保留。

这就是为什么实体需要一个[唯一 ID](https://www.hasscn.top/contributors/glossary/unique-id/)，也是为什么集成绝不决定用户可以更改的东西，比如实体 ID。

## 谨慎变更

数百万个家庭运行着 Home Assistant，人们依靠它来控制灯光、供暖和警报。一个破坏他们配置的变更就是破坏了他们的家。

- 旧的东西不会立即移除。它首先被弃用（deprecation），并附带警告和日期。参见[弃用](https://www.hasscn.top/contributors/glossary/deprecation/)。
- 向后不兼容的变更很少见，会有说明，并列入发布说明中。
- [集成质量标准](https://www.hasscn.top/contributors/glossary/quality-scale/)设定了“好”的标准。

## 支持得少，支持得好

项目限制其支持的范围，以便能把这些支持做好。以下是一些来自架构决策的例子：

- **安装方式**：Home Assistant OS 和 Home Assistant Container。自行安装 Core，或在自己的操作系统上安装 Supervisor，已不再受支持。
- **Python**：一次只支持一个 Python 次要版本，目标是支持最新版本（[ADR-0020](https://github.com/home-assistant/architecture/blob/master/adr/0020-minimum-supported-python-version.md)）。
- **数据库**：SQLite、尚未到达生命周期终点的 PostgreSQL 版本，以及同样尚未到达生命周期终点的 MariaDB 和 MySQL 的 LTS 版本（[ADR-0018](https://github.com/home-assistant/architecture/blob/master/adr/0018-supported-databases.md)）。
- **不再新增**抓取网站（[ADR-0004](https://github.com/home-assistant/architecture/blob/master/adr/0004-webscraping.md)）或直接与 GPIO 引脚通信（[ADR-0019](https://github.com/home-assistant/architecture/blob/master/adr/0019-GPIO.md)）的集成。它们太容易损坏，或者无法为所有人提供支持。它们仍然可以作为自定义集成存在。

## 参与其中

- 在[集成质量标准](https://www.hasscn.top/contributors/core/quality-scale/)中逐条查看这些原则如何应用于集成。
- 不确定从哪里开始贡献？[你的第一次贡献](https://www.hasscn.top/contributors/start/first-contribution/)帮助你选择一个领域。
