# 安装类型

> Home Assistant OS 和 Supervisor 在哪些安装类型中使用，在哪些中不使用，以及这对你的代码意味着什么。

Source: https://www.hasscn.top/contributors/os/installation-types/

Home Assistant 支持两种[安装类型](https://www.hasscn.top/contributors/glossary/installation-type/)。其中只有一种包含操作系统和 Supervisor。

| | Home Assistant OS | Home Assistant Container |
| --- | --- | --- |
| 操作系统 | Home Assistant OS | 用户自行运行的系统 |
| Supervisor | 有 | 无 |
| 应用（Apps） | 有 | 无 |
| 系统更新 | 通过 Supervisor | 由用户自行处理 |

在 Home Assistant Container 上，Home Assistant Core 运行在用户自行管理的容器中。本区域的任何内容都不会在那里运行。架构区域中的 [Around Core](https://www.hasscn.top/contributors/architecture/platform/) 页面展示了各部分如何协同工作。

## 不再受支持

另外两种安装类型已于 2025 年 5 月被弃用，并随 Home Assistant 2025.12 结束支持：

- **Home Assistant Supervised**：将 Supervisor 安装在用户自行维护的 Linux 系统上。
- **Home Assistant Core**：将 Home Assistant 作为 Python 包安装在虚拟环境中。

32 位架构 `i386`、`armhf` 和 `armv7` 也同时被移除。Home Assistant OS 17 移除了最后一批 32 位开发板。[公告](https://www.home-assistant.io/blog/2025/05/22/deprecating-core-and-supervised-installation-methods-and-32-bit-systems/)解释了原因。

## 这对 Supervisor 意味着什么

Supervisor 仍然可以在 Home Assistant OS 之外启动，但它会将此类系统标记为不受支持。该检查是[解决方案中心](https://www.hasscn.top/contributors/os/supervisor/resolution-center/)中的一项评估：当操作系统不可用时，系统会得到 `os` 这一不受支持的原因。某些功能完全依赖 Home Assistant OS。这些任务使用 `haos` 任务条件，拒绝在其他任何地方运行。

因此，在开发 Supervisor 时，请以 Home Assistant OS 为前提。只在其他主机上有意义的代码已不再是本项目维护的内容。
