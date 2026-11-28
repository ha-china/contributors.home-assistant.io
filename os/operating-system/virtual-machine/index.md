# 虚拟机

> ova 目标、它构建的虚拟磁盘格式，以及运行 Home Assistant OS 的虚拟机所需的条件。

Source: https://www.hasscn.top/contributors/os/operating-system/virtual-machine/

`ova` 目标为 x86-64 虚拟机构建 Home Assistant OS。其板级文件位于 [`buildroot-external/board/pc/ova/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board/pc/ova)。它也是自动化测试所使用的目标，参见[测试你的构建](https://www.hasscn.top/contributors/os/operating-system/test/)。

## 格式

一次构建会以多种格式生成相同的系统。虚拟磁盘大小为 32 GB。

| 格式 | 文件 | 用途 |
| --- | --- | --- |
| OVA | `.ova` | 作为完整的虚拟机导入，例如在 VMware 或 VirtualBox 中 |
| VMDK | `.vmdk.zip` | VMware、VirtualBox |
| VHDX | `.vhdx.zip` | Hyper-V |
| VDI | `.vdi.zip` | VirtualBox |
| QCOW2 | `.qcow2.xz` | QEMU、KVM、Proxmox |

## 要求

- UEFI 启动。传统的 BIOS 启动无法工作。
- 64 位 Linux 客户机类型，内核 4.x 或更高版本。
- 至少 2 个虚拟 CPU 和 2 GB 内存。配置越高越好。
- 一个网络适配器。

镜像中包含常见虚拟机管理程序的客户机工具，例如 QEMU guest agent 和 Hyper-V 守护进程。

## 控制台

控制台显示在虚拟屏幕以及第一个串行端口 `ttyS0` 上。GRUB 启动菜单允许你选择一个槽位或救援 shell，参见[调试宿主机](https://www.hasscn.top/contributors/os/operating-system/debugging/#rescue-shell)。
