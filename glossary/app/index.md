# 应用（App）

> 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。

Source: https://www.hasscn.top/contributors/glossary/app/

- In code: `addons`, `config.yaml`
- Also: apps
- Formerly: add-on, addon (old name: don't use it in new text)

应用（App）以前被称为加载项（add-on）。代码中仍然使用旧名称，例如在 Supervisor API 中、在 `config.yaml` 的键中，以及在像 home-assistant/addons 这样的仓库名称中。在文字中请使用“应用”。

不要与手机和电脑上的[伴侣应用（companion apps）](https://www.hasscn.top/contributors/glossary/companion-app/)混淆。

## Related terms

- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
- [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/): 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。
- [伴侣应用（Companion app）](https://www.hasscn.top/contributors/glossary/companion-app/): 适用于 Android、iOS 和 macOS 的 Home Assistant 应用。它显示前端（frontend），并从设备添加传感器、通知和小组件。
