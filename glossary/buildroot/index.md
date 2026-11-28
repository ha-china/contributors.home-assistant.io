# Buildroot

> Home Assistant OS 的构建工具。它从源码构建一个完整的小型 Linux 系统，而不是基于 Ubuntu 之类的发行版。

Source: https://www.hasscn.top/contributors/glossary/buildroot/

- In code: `buildroot/`, `buildroot-external/`

home-assistant/operating-system 仓库将 [Buildroot](https://buildroot.org/) 作为 Git 子模块（submodule），并把所有与 Home Assistant OS 相关的内容（如板卡配置和软件包）保存在 [`buildroot-external/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external) 中。参见 [Build Home Assistant OS](https://www.hasscn.top/contributors/os/operating-system/build/)。

## Related terms

- [Home Assistant OS](https://www.hasscn.top/contributors/glossary/home-assistant-os/): 专为运行 Home Assistant 而打造的操作系统，包含 Supervisor、应用和备份。推荐的 Home Assistant 安装方式。
- [RAUC](https://www.hasscn.top/contributors/glossary/rauc/): Home Assistant OS 的更新系统。它将整个系统的新版本安装到正在运行的系统旁边，因此当更新失败时，设备可以回退。
