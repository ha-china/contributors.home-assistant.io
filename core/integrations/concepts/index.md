# 集成如何融入整体

> 用通俗的语言介绍每个集成所基于的少数几个核心概念，并提供指向更深入页面的链接。

Source: https://www.hasscn.top/contributors/core/integrations/concepts/

在编写集成之前，先认识这些术语会很有帮助。它们只有寥寥几个，而且每个集成对它们的使用方式都相同。本页用几句话逐一解释，并链接到更深入的页面。读一遍之后，就到[教程](https://www.hasscn.top/contributors/core/integrations/tutorial/)里动手构建点什么吧。

## 整体图景

假设你的网络中有一台空气质量监测仪。要把它接入 Home Assistant：

1. 一个 Python **库（library）**知道如何与监测仪通信。
2. 你的**集成（integration）**使用该库，并通过**配置流程（config flow）**在 UI 中完成设置。
3. 配置流程会创建一个**配置条目（config entry）**：一台监测仪，以及它的地址。
4. 针对该配置条目，一个**协调器（coordinator）**每分钟向监测仪请求一次新数据。
5. 一个**平台（platform）**（比如 `sensor`）将这些数据转换为**实体（entity）**：一个温度传感器、一个湿度传感器。
6. 这些实体属于一个**设备（device）**：即监测仪本身。

这一切都运行在同一个**事件循环（event loop）**上，而这一切都通过一个对象与 Home Assistant 的其余部分交互：**`hass`**。

## 集成

[集成（integration）](https://www.hasscn.top/contributors/glossary/integration/)是一个 Python 代码文件夹，它把 Home Assistant 连接到一个设备、一项服务（service）或一个想法。随 Home Assistant 一起发布的集成位于[核心仓库](https://github.com/home-assistant/core)的 `homeassistant/components/<domain>/` 中，它们的测试则位于 `tests/components/<domain>/` 中。

[域（domain）](https://www.hasscn.top/contributors/glossary/domain/)是集成的简短且唯一的名称，比如 `hue` 或 `airgradient`。它就是文件夹的名称，永远不会改变，并且会出现在该集成动作（action）的名称中。

每个集成都有一个描述它的 `manifest.json`：包括它的名称、它的集成负责人、它所需的库，以及它能通过哪些方式被发现。参见[清单文件](https://www.hasscn.top/contributors/core/integrations/manifest/)和[文件结构](https://www.hasscn.top/contributors/core/integrations/file-structure/)。

## 库

集成从不直接与设备或服务通信。所有协议代码，比如 HTTP 请求或数据包解析，都放在 PyPI 上一个独立的 Python 库中。集成只负责在该库与 Home Assistant 之间进行转换。这样能让集成保持小巧、易于审查，也让其他人可以使用这个库。参见[构建 Python 库](https://www.hasscn.top/contributors/core/integrations/api-library/)。

## 配置流程与配置条目

[配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/)是用户在**设置** > **设备与服务**下添加你的集成时所经历的对话框。它会询问所需的信息，比如主机名，测试连接，然后创建一个配置条目。

[配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/)是你的集成的一个已设置实例：一台监测仪、一个账户、一个集线器。它存储配置流程所收集的信息。Home Assistant 会在启动时以及用户添加新配置条目时，为每个配置条目调用你 `__init__.py` 中的 `async_setup_entry`。在该函数运行期间，你的集成会把它需要的东西（比如 API 客户端）保存在 `entry.runtime_data` 中。

参见[配置流程](https://www.hasscn.top/contributors/core/integrations/config-flow/)和[配置条目](https://www.hasscn.top/contributors/core/integrations/config-entries/)。

## 平台与实体

[实体（entity）](https://www.hasscn.top/contributors/glossary/entity/)是 Home Assistant 可以显示、测量或控制的一个东西：一个温度传感器、一盏灯、一个开关。每个实体都有一个状态（state），比如 `21.5` 或 `on`，用户基于实体来构建他们的仪表盘（dashboard）和自动化（automation）。

[平台（platform）](https://www.hasscn.top/contributors/glossary/platform/)是你的集成提供某一类型实体的方式。要提供传感器，就添加 `sensor.py`。要提供灯，就添加 `light.py`。每个平台文件都有自己的 `async_setup_entry`，由它来创建实体。你的集成会把自己的配置条目转发给它所支持的平台。

每个实体都需要一个永不改变的[唯一 ID（unique ID）](https://www.hasscn.top/contributors/glossary/unique-id/)。这个 ID 会把它登记到实体注册表中，用户正是因此才能重命名它、把它移动到某个区域（area）或禁用它。

参见[实体与平台](https://www.hasscn.top/contributors/core/entities/)和[实体类](https://www.hasscn.top/contributors/core/entities/entity-class/)。

## 设备

[设备（device）](https://www.hasscn.top/contributors/glossary/device/)是实体所属的物理设备，或者服务。这台空气质量监测仪就是一个拥有多个实体的设备。你的实体通过 `DeviceInfo` 来描述它们所属的设备，Home Assistant 会把它放入设备注册表。用户会看到一个包含其所有实体的设备页面。参见[设备注册表](https://www.hasscn.top/contributors/core/integrations/device-registry/)。

## 协调器

大多数设备会在一次请求中返回它们的全部数据。[协调器（coordinator）](https://www.hasscn.top/contributors/glossary/coordinator/)（即 `DataUpdateCoordinator` 类）会按计划一次性获取这些数据，并把它们交给所有实体。它还负责处理错误：当一次更新失败时，它会把实体标记为不可用，并在稍后重试。参见[获取数据](https://www.hasscn.top/contributors/core/integrations/fetching-data/)。

## 事件循环与异步

Home Assistant 运行在 Python 的 `asyncio` 之上。几乎所有事情都发生在一个线程中，也就是[事件循环（event loop）](https://www.hasscn.top/contributors/glossary/event-loop/)，而且同一时刻只有一段代码能在其中运行。只要没有人阻塞它，这就既快速又简单：当你的代码在没有 `await` 的情况下等待网络时，Home Assistant 中的所有事情都会跟着一起等待。

由此可以得出两点：

- 使用异步库，并用 `await` 等待它的调用。阻塞调用应通过 `hass.async_add_executor_job` 交给线程执行。
- 名称以 `async_` 开头的函数，比如 `async_setup_entry` 或 `async_add_entities`，必须在事件循环中运行。这是核心代码中的命名约定，这样你就能从名称看出一个函数属于哪里。

参见 [Home Assistant 中的异步](https://www.hasscn.top/contributors/core/internals/asyncio/)。

## hass 对象

每个设置函数都会拿到 `hass`，即正在运行的 Home Assistant 实例。你的集成与系统其余部分的一切交互都要通过它：`hass.states` 保存每个实体的状态，`hass.bus` 承载事件，`hass.services` 保存动作，而 `hass.config_entries` 管理配置条目。在实体或流程内部，它就是 `self.hass`。参见 [hass 对象](https://www.hasscn.top/contributors/core/internals/hass/)。

## 后续步骤

- 在[教程](https://www.hasscn.top/contributors/core/integrations/tutorial/)中从头到尾构建一个小型集成。
- 想修复现有集成中的某个问题？从[你的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。
