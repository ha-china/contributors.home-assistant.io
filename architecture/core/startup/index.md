# 从启动到运行

> Home Assistant Core 从启动那一刻到你的家准备就绪之间做了什么，以及它如何再次关闭。

Source: https://www.hasscn.top/contributors/architecture/core/startup/

Home Assistant 启动时，并不会一次性加载所有内容。它分阶段加载，因此最重要的部分会先就绪，而一个损坏的集成（integration）也不会阻止家中其余部分的启动。

当你想知道为什么你的集成必须等待某些东西，或者为什么启动需要那么长时间时，了解这些阶段会很有帮助。

## 简而言之

1. Python 启动，Home Assistant 创建其[事件循环（event loop）](https://www.hasscn.top/contributors/core/internals/asyncio/)。
2. 日志、配置和注册表（registry）加载。
3. 集成分阶段设置：先是日志、前端和数据库等基础部分，然后是发现和云，最后是其余所有内容。
4. Home Assistant 触发 `homeassistant_start`，运行启动任务，并进入运行状态。它触发 `homeassistant_started`。

关闭过程以相反的方式运行，同样是分阶段并带有时间限制，因此它总能完成。

## 详细步骤

### 在任何内容加载之前

`hass` 命令运行 [`homeassistant/__main__.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/__main__.py)。它检查 Python 版本和操作系统，确保配置文件夹存在，并获取一个锁文件 `.ha_run.lock`，这样两份副本就无法在同一配置上运行。

然后 `runner.py` 创建 asyncio 事件循环，带有一个最多 64 个工作线程的线程池用于处理阻塞工作，并交由 `bootstrap.py` 接管。

### 引导（Bootstrap）

`bootstrap.py` 设置其他所有部分都需要的组件：

1. **日志**，写入配置文件夹中的 `home-assistant.log`。
2. **配置**：读取 `configuration.yaml`，包括其密钥（secrets）和包（packages）。
3. **基础部分**：注册表（区域、设备、实体、楼层、标签、类别和问题）、恢复的状态（state）以及配置条目（config entry）并行加载。
4. **核心集成**：`homeassistant` 本身和 `persistent_notification`。

从这里开始，Home Assistant 还会监视阻塞事件循环的代码。

### 集成，分阶段加载

哪些集成会加载，取决于三方面的总和：`configuration.yaml` 中的所有内容、每个带有[配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/)的集成，以及一组默认集成，如前端、自动化（automation）、脚本和辅助元素（helper）。在 Home Assistant OS 上，`hassio` 集成也会加入。

它们分三个阶段加载：

| 阶段 | 加载内容 | 时间限制 |
| --- | --- | --- |
| 0 | 日志、前端、记录器（recorder）和 zeroconf，按此顺序 | 基本没有：数据库迁移不能被中断 |
| 1 | 发现（Bluetooth、DHCP、SSDP、USB）、云和 Supervisor | 120 秒 |
| 2 | 其余所有内容 | 300 秒 |

在一个阶段内，集成在它们所依赖的集成之后并行设置。当一个阶段超时后，Home Assistant 会记录哪些集成仍在忙碌，然后继续进行。一个缓慢的集成会让启动变慢，但不会阻止启动。

### 运行

当各阶段完成后，Home Assistant：

1. 将其状态更改为 starting，并触发 `homeassistant_start`。
2. 运行集成注册的启动任务。
3. 将其状态更改为 running，并触发 `homeassistant_started`。

需要其他所有内容都就绪的集成，比如需要查看所有实体的集成，会等待 `homeassistant_started`。辅助函数 `async_at_start` 和 `async_at_started` 会在正确的时刻运行代码，即使集成是在启动之后才加载也是如此。

### 恢复模式

当配置无法读取、核心集成无法设置，或前端无法加载时，Home Assistant 会以恢复模式启动。只有前端、备份和云会加载，这样用户仍然可以进入并修复问题。

## 关闭

关闭分四个阶段运行，每个阶段都有时间限制，因此一个卡住的集成无法阻止家重新启动：

| 阶段 | 发生什么 | 时间限制 |
| --- | --- | --- |
| 1 | 集成注册的关闭任务 | 20 秒 |
| 2 | 后台任务被取消，`homeassistant_stop` 触发，集成关闭它们的连接 | 100 秒 |
| 3 | `homeassistant_final_write` 触发：保存数据的最后机会，就像记录器所做的那样 | 60 秒 |
| 4 | `homeassistant_close` 触发，剩余的内容被取消 | 30 秒 |

## Home Assistant 的状态

`hass.state` 表示 Home Assistant 所处的状态：`not_running`、`starting`、`running`、`stopping`、`final_write` 或 `stopped`。代码还可以检查 `hass.is_running` 和 `hass.is_stopping`。

## 在代码中

| 内容 | 位置 |
| --- | --- |
| 命令及其选项 | [`homeassistant/__main__.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/__main__.py) |
| 事件循环和工作线程 | [`homeassistant/runner.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/runner.py) |
| 阶段、默认集成、时间限制 | [`homeassistant/bootstrap.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/bootstrap.py) |
| 启动和停止、`CoreState` | [`homeassistant/core.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/core.py) |
| `async_at_start`、`async_at_started` | [`homeassistant/helpers/start.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/helpers/start.py) |

## 参与这项工作

- 刚接触 Core？从[你对 Core 的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。
- [设置失败和异常](https://www.hasscn.top/contributors/core/integrations/setup-failures/)：当你的集成暂时无法设置时它会怎么做。
- [阻塞操作](https://www.hasscn.top/contributors/core/internals/blocking-operations/)：事件循环看门狗会查找什么。
