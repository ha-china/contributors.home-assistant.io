# Home Assistant OS

> 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。

Source: https://www.hasscn.top/contributors/glossary/home-assistant-os/

- In code: `home-assistant/operating-system`, `hassos`
- Also: operating system, OS

Home Assistant OS 可运行在 Home Assistant Green 和 Raspberry Pi 等设备上，也可以在虚拟机中运行。它能够自我更新，并构建于 home-assistant/operating-system 仓库之中。

## Related terms

- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
- [应用（App）](https://www.hasscn.top/contributors/glossary/app/): 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。
- [安装类型](https://www.hasscn.top/contributors/glossary/installation-type/): Home Assistant 的安装方式：Home Assistant OS 或 Home Assistant Container。它们的区别在于哪些内容由系统代为管理。
