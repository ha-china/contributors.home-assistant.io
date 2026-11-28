# 深入了解 Home Assistant Core

> 一场关于 Home Assistant 核心所在 Python 应用的导览，并指引通往每个部分细节的路径。

Source: https://www.hasscn.top/contributors/architecture/core/

[Home Assistant Core](https://www.hasscn.top/contributors/glossary/core/) 是一个单一的 Python 应用程序。无论周围运行着什么，每种安装方式都会运行它。它保存着家庭的状态，运行各个集成（integration），并响应前端、应用程序和语音助手。

本页就是这场导览：各个部分是什么，以及它们如何协同工作。每个部分的细节位于 [Core 与集成](https://www.hasscn.top/contributors/core/) 区域，链接见下文。

## 各个部分

| 部分 | 一句话概括 | 详细内容 |
| --- | --- | --- |
| 事件循环 | 在单一线程上逐个运行所有任务 | [Home Assistant 中的异步](https://www.hasscn.top/contributors/core/internals/asyncio/)、[阻塞操作](https://www.hasscn.top/contributors/core/internals/blocking-operations/) |
| `hass` 对象 | 所有其他东西都挂载其上的唯一对象 | [hass 对象](https://www.hasscn.top/contributors/core/internals/hass/) |
| 状态机 | 保存每个实体（entity）的当前状态 | [状态](https://www.hasscn.top/contributors/core/internals/states/) |
| 事件总线 | 告诉所有人刚刚发生了什么 | [事件](https://www.hasscn.top/contributors/core/internals/events/) |
| 动作注册表 | 知道 Home Assistant 能做的一切 | [动作](https://www.hasscn.top/contributors/core/internals/actions/) |
| 各类注册表 | 记住实体、设备和区域（area），以及用户所做的更改 | [注册表与存储](https://www.hasscn.top/contributors/architecture/core/registries/) |
| 集成 | 将这一切连接到外部世界 | [构建集成](https://www.hasscn.top/contributors/core/integrations/) |
| 实体 | 集成与 Home Assistant 其余部分交汇之处 | [实体](https://www.hasscn.top/contributors/core/entities/) |
| 记录器 | 保存历史记录 | [历史与统计](https://www.hasscn.top/contributors/architecture/core/history/) |

## 它们如何协同工作

以一盏通过自身开关点亮的灯为例：

1. 灯的集成从网络得知这一变化。
2. 灯的[实体](https://www.hasscn.top/contributors/glossary/entity/)将其新状态写入状态机。
3. 状态机在事件总线上触发一个 `state_changed` 事件。
4. 所有监听者做出反应：前端显示灯已打开，记录器将其写入历史，等待此事件的自动化（automation）执行一个动作。
5. 该动作经由动作注册表返回到某个集成，由它告诉另一台设备该做什么。

这些部分彼此互不相识。它们在状态机和事件总线上相遇。这就是为什么新集成从第一天起就能与每个仪表盘（dashboard）、自动化和语音助手协同工作。

## 集成的类型

集成承担不同的工作，大多数属于以下几类之一：

- **定义一种设备类型**：像 `light` 这样的实体集成决定了在 Home Assistant 中什么是灯、它拥有哪些数据及何种格式，以及哪些动作可以控制它。新的设备类型以提案形式在[架构讨论](https://github.com/home-assistant/architecture/discussions)中启动，包含其保存的数据、控制方式，以及来自多个品牌的示例。
- **连接设备与服务**：像 `hue` 这样的集成与 Philips Hue 通信，并将其灯具作为 `light` 实体提供。这类集成通常不使用来自其他集成的实体状态。例外是带有位置的实体，例如 `zone` 和 `device_tracker` 的实体。
- **提供虚拟或计算的数据**：`input_boolean` 是一个只存在于 Home Assistant 中的开关。`template` 和 `utility_meter` 根据 Home Assistant 中的其他数据计算其实体。
- **自动化**：`automation` 运行用户的自动化，而更具体的集成（如 `flux`）会根据太阳的位置调整灯光。

## Home Assistant 自身的生命周期

- [从启动到运行](https://www.hasscn.top/contributors/architecture/core/startup/)：Home Assistant 如何分阶段启动，使一个损坏的集成无法让整个家停摆，以及它如何关闭。
- [获取数据](https://www.hasscn.top/contributors/architecture/core/data-updates/)：集成如何通过推送或轮询得知变化，以及协调器（coordinator）的作用。
- [注册表与存储](https://www.hasscn.top/contributors/architecture/core/registries/)：Home Assistant 在重启之间记住什么。
- [历史与统计](https://www.hasscn.top/contributors/architecture/core/history/)：过去的数据如何保存，保存多久。

## 代码仓库

Home Assistant Core 位于 [home-assistant/core](https://github.com/home-assistant/core) 仓库中：

| 文件夹 | 内容 |
| --- | --- |
| [`homeassistant/`](https://github.com/home-assistant/core/tree/dev/homeassistant) | 核心本身：`core.py`、`bootstrap.py`、`config_entries.py`、`loader.py` |
| [`homeassistant/components/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components) | 每个内置集成，各占一个文件夹 |
| [`homeassistant/helpers/`](https://github.com/home-assistant/core/tree/dev/homeassistant/helpers) | 共享的构建模块：实体、注册表、协调器、存储 |
| [`homeassistant/util/`](https://github.com/home-assistant/core/tree/dev/homeassistant/util) | 不包含 Home Assistant 的小型工具：日期、单位、颜色 |
| [`tests/`](https://github.com/home-assistant/core/tree/dev/tests) | 测试，采用相同的目录结构 |
| [`script/`](https://github.com/home-assistant/core/tree/dev/script) | 工具，例如检查每个集成的 hassfest |

它要求 Python 3.14 或更新版本，带有类型标注，并在每次拉取请求（pull request）时使用 Ruff、mypy 和 pylint 等工具进行检查。用于配置和动作的模式（schema）使用 [probatio](https://pypi.org/project/probatio/) 编写。

## 参与其中

- 刚接触 Core？从[你对 Core 的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。
- [构建集成](https://www.hasscn.top/contributors/core/integrations/)：连接设备或服务。
- [Core 的工作原理](https://www.hasscn.top/contributors/core/internals/)：本页各部分的详细内容。
