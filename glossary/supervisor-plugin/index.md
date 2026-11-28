# Supervisor 插件

> Supervisor 为系统自身运行的容器，例如 DNS 或音频，由 Home Assistant Core 和应用共享。

Source: https://www.hasscn.top/contributors/glossary/supervisor-plugin/

- In code: `supervisor/plugins/`, `plugin-dns`, `plugin-audio`
- Also: plugin, plugins

共有五个：DNS、音频、命令行（CLI）、多播（multicast）和观察者（observer）。每个插件都有自己的仓库，例如 home-assistant/plugin-dns。用户不会安装或移除它们，Supervisor 会保持它们更新。参见 [Plugins](https://www.hasscn.top/contributors/os/supervisor/plugins/)。

## Related terms

- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
- [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/): 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。
