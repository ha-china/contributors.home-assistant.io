# 支持的开发板

> Home Assistant OS 构建所面向的每一块开发板，包括其构建目标、引导加载程序和机器类型。

Source: https://www.hasscn.top/contributors/os/operating-system/boards/

Home Assistant OS 为每个目标构建一个镜像。每个目标在 `buildroot-external/configs/<target>_defconfig` 中有一个配置，并在 [`buildroot-external/board/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board) 中有一个包含其[元数据](https://www.hasscn.top/contributors/os/operating-system/board-metadata/)的开发板文件夹。自 Home Assistant OS 17 起，所有目标均为 64 位。

## 所有目标

| 开发板 | 构建目标 | 引导加载程序 | 分区表 | 机器 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Home Assistant Green | `green` | U-Boot | 混合 | `green` | |
| Home Assistant Yellow | `yellow` | U-Boot | 混合 | `yellow` | Raspberry Pi Compute Module 4 和 5 的载板 |
| Raspberry Pi 3 | `rpi3_64` | U-Boot | 混合 | `raspberrypi3-64` | [Raspberry Pi](https://www.hasscn.top/contributors/os/operating-system/raspberry-pi/) |
| Raspberry Pi 4 | `rpi4_64` | U-Boot | 混合 | `raspberrypi4-64` | [Raspberry Pi](https://www.hasscn.top/contributors/os/operating-system/raspberry-pi/) |
| Raspberry Pi 5 | `rpi5_64` | Tryboot | GPT | `raspberrypi5-64` | [Raspberry Pi](https://www.hasscn.top/contributors/os/operating-system/raspberry-pi/) |
| ODROID-C2 | `odroid_c2` | U-Boot | MBR | `odroid-c2` | [ODROID](https://www.hasscn.top/contributors/os/operating-system/odroid/) |
| ODROID-C4 | `odroid_c4` | U-Boot | MBR | `odroid-c4` | [ODROID](https://www.hasscn.top/contributors/os/operating-system/odroid/) |
| ODROID-M1 | `odroid_m1` | U-Boot | 混合 | `odroid-m1` | [ODROID](https://www.hasscn.top/contributors/os/operating-system/odroid/) |
| ODROID-M1S | `odroid_m1s` | U-Boot | 混合 | `odroid-m1` | [ODROID](https://www.hasscn.top/contributors/os/operating-system/odroid/) |
| ODROID-N2 和 N2+ | `odroid_n2` | U-Boot | MBR | `odroid-n2` | [ODROID](https://www.hasscn.top/contributors/os/operating-system/odroid/)，也是 Home Assistant Blue |
| Khadas VIM3 | `khadas_vim3` | U-Boot | MBR | `khadas-vim3` | |
| 通用 x86-64 | `generic_x86_64` | GRUB | GPT | `generic-x86-64` | [通用系统](https://www.hasscn.top/contributors/os/operating-system/generic/) |
| 通用 aarch64 | `generic_aarch64` | GRUB | GPT | `qemuarm-64` | [通用系统](https://www.hasscn.top/contributors/os/operating-system/generic/)，也是虚拟机镜像 |
| 虚拟机 | `ova` | GRUB | GPT | `qemux86-64` | [虚拟机](https://www.hasscn.top/contributors/os/operating-system/virtual-machine/) |

构建目标是传递给 `make` 的参数，参见[构建镜像](https://www.hasscn.top/contributors/os/operating-system/build/)。镜像文件名中的开发板标识符则使用连字符，例如 `haos_rpi4-64-18.3.img.xz`。

## 内核

大多数开发板运行主线 Linux 内核。Raspberry Pi 开发板和 Home Assistant Yellow 运行 [Raspberry Pi 分支（fork）](https://github.com/raspberrypi/linux)。当前版本见仓库中的 [`Documentation/kernel.md`](https://github.com/home-assistant/operating-system/blob/dev/Documentation/kernel.md)。

## 已移除的开发板

Home Assistant OS 17 移除了 32 位目标：Raspberry Pi 2、Raspberry Pi 3 和 4 的 32 位构建、ODROID-XU4 以及 ASUS Tinker Board。Raspberry Pi 1 和 Zero W 在此之前已被弃用。这些开发板上的现有安装不再获得更新。

## 添加开发板

支持哪些开发板是项目的决定，而不仅仅是代码问题。[ADR-0015](https://github.com/home-assistant/architecture/blob/master/adr/0015-home-assistant-os.md) 定义了支持的硬件，[ADR-0017](https://github.com/home-assistant/architecture/blob/master/adr/0017-hardware-screening-os.md) 列出了新开发板必须满足的条件，例如长期供货和上游内核支持。在开始之前，请先在[架构仓库](https://github.com/home-assistant/architecture)中提议新开发板。
