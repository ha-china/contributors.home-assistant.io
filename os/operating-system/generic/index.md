# 通用系统

> 通用 x86-64 和 aarch64 目标，适用于通过 UEFI 启动的 PC 和其他系统。

Source: https://www.hasscn.top/contributors/os/operating-system/generic/

有两个目标并非针对某一块开发板，而是针对任何通过 UEFI 启动的系统。

| 目标 | 构建目标 | 适用对象 |
| --- | --- | --- |
| 通用 x86-64 | `generic_x86_64` | 迷你 PC（如 Intel NUC）及其他 64 位 x86 计算机 |
| 通用 aarch64 | `generic_aarch64` | 支持 UEFI 的 64 位 Arm 系统，以及 Arm 虚拟机 |

两者都使用 GRUB、GPT 分区表和主线 Linux 内核。它们的开发板文件位于 [`buildroot-external/board/pc/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board/pc) 和 [`buildroot-external/board/arm-uefi/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board/arm-uefi)。

## 要求

- 正确架构的 64 位 CPU
- UEFI 启动，且安全启动（secure boot）已关闭
- 内核支持的磁盘，如 SATA、NVMe 或 eMMC
- 受支持的网络卡

x86-64 内核包含常见的 Intel 和 Realtek 以太网驱动，以及 Intel Wi-Fi 及其固件。Intel Wi-Fi 卡上的蓝牙可以工作。其他硬件取决于内核配置所包含的内容：[`buildroot-external/kernel/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/kernel) 以及开发板文件夹中的 `kernel.config`。

## 安装

没有安装程序。你需要将镜像写入内部磁盘：

1. 通过 USB 或网络，将计算机启动到 live Linux 系统。
2. 下载或复制镜像，并使用 `unxz` 解压。
3. 使用 `dd` 或 balenaEtcher 之类的工具将其写入内部磁盘。
4. 重启。

首次启动时，数据分区会自动扩展以填满整个磁盘。

## 控制台

x86-64 镜像使用屏幕作为其控制台。如果系统没有显示任何控制台输出，在启动分区的 `cmdline.txt` 中添加 `nomodeset` 可能会有帮助。aarch64 镜像还在 `ttyS0` 上提供串行控制台。

## 虚拟机中的通用 aarch64

除磁盘镜像外，aarch64 目标还会构建虚拟磁盘镜像（VMDK、VDI 和 QCOW2），用于 Arm 主机上的虚拟机。[虚拟机](https://www.hasscn.top/contributors/os/operating-system/virtual-machine/)页面介绍了相关要求，两者是相同的。
