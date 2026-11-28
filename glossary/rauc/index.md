# RAUC

> Home Assistant OS 的更新系统。它将整个系统的新版本安装到正在运行的系统旁边，因此当更新失败时，设备可以回退。

Source: https://www.hasscn.top/contributors/glossary/rauc/

- In code: `.raucb`, `buildroot-external/ota/`
- Also: update bundle

Home Assistant OS 有两个系统插槽。[RAUC](https://rauc.io/) 将更新包（update bundle）写入未在运行的插槽，然后设备启动进入该插槽。如果无法正常工作，设备会回退到原来的插槽。Supervisor 会启动这些更新。参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/)。

## Related terms

- [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/): 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。
- [Buildroot](https://www.hasscn.top/contributors/glossary/buildroot/): Home Assistant OS 的构建工具。它从源码构建一个完整的小型 Linux 系统，而不是基于 Ubuntu 之类的发行版。
- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
