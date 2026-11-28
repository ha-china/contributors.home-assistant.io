# Supervisor

> Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。

Source: https://www.hasscn.top/contributors/glossary/supervisor/

- In code: `home-assistant/supervisor`, `hassio`

Supervisor 拥有一个 API，即 [Supervisor API](https://www.hasscn.top/contributors/glossary/supervisor-api/)，Core、前端和应用（app）使用它来安装更新、创建备份以及管理应用。

## Related terms

- [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/): 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。
- [应用（App）](https://www.hasscn.top/contributors/glossary/app/): 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。
- [Supervisor API](https://www.hasscn.top/contributors/glossary/supervisor-api/): Supervisor 的 REST API，Home Assistant Core、命令行和应用使用它来管理系统、应用、备份和更新。
- [Supervisor 插件](https://www.hasscn.top/contributors/glossary/supervisor-plugin/): Supervisor 为系统自身运行的容器，例如 DNS 或音频，由 Home Assistant Core 和应用共享。
- [解决方案中心](https://www.hasscn.top/contributors/glossary/resolution-center/): Supervisor 中查找系统问题（如磁盘空间不足）并建议修复方法的部分。
