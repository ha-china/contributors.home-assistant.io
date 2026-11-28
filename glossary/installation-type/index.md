# 安装类型

> Home Assistant 的安装方式：Home Assistant OS 或 Home Assistant Container。它们的区别在于哪些内容由系统代为管理。

Source: https://www.hasscn.top/contributors/glossary/installation-type/

- Also: installation types, installation method, Home Assistant Container

Home Assistant OS 自带 Supervisor、应用和备份。Home Assistant Container 则在用户自行管理的容器中运行 Core。

Home Assistant Core 和 Home Assistant Supervised 安装方式（即用户自行安装各个组件）自 Home Assistant 2025.12 起不再受支持。

## Related terms

- [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/): 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。
- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
- [Home Assistant Core](https://www.hasscn.top/contributors/glossary/core/): Home Assistant 核心的 Python 应用程序，包含所有集成，位于 home-assistant/core 仓库中。
