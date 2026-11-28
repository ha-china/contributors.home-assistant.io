# 板卡元数据

> 每块板卡的 meta 文件中的变量，以及所有板卡共享的版本文件。

Source: https://www.hasscn.top/contributors/os/operating-system/board-metadata/

[`buildroot-external/board/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board) 中的每个板卡文件夹都有一个名为 `meta` 的文件。它向构建脚本描述板卡：如何命名镜像、使用哪个引导加载程序和分区表，以及拉取哪些 Supervisor 镜像。构建脚本将其作为 shell 变量读取，同时还会读取共享的 `buildroot-external/meta`。

下面是 Home Assistant Green 的文件：

```shell
BOARD_ID=green
BOARD_NAME="Home Assistant Green"
CHASSIS=embedded
BOOTLOADER=uboot
KERNEL_FILE=Image
PARTITION_TABLE_TYPE=hybrid
BOOT_SIZE=16M
BOOT_SPL=true
BOOT_SPL_SIZE=16M
BOOT_ENV_SIZE=0x8000
SUPERVISOR_MACHINE=green
SUPERVISOR_ARCH=aarch64
```

## 板卡（Board）

| 变量 | 含义 |
| --- | --- |
| `BOARD_ID` | 板卡标识符，小写。用于镜像文件名（如 `haos_green-18.3.img.xz`）、RAUC 的 `compatible` 值，以及 `/usr/lib/os-release` 中的 `VARIANT_ID`。 |
| `BOARD_NAME` | 人类可读的名称。用于 `/usr/lib/os-release` 中的 `VERSION` 和 `VARIANT`。 |
| `CHASSIS` | systemd 的机箱（chassis）类型，写入 `/etc/machine-info`。板卡使用 `embedded`，虚拟机镜像使用 `vm`。 |

## 引导（Boot）

| 变量 | 含义 |
| --- | --- |
| `BOOTLOADER` | `uboot`、`grub` 或 `tryboot`。GRUB 用于 UEFI 系统，tryboot 用于 Raspberry Pi 5，其他地方使用 U-Boot。它设置 RAUC 的引导加载程序后端，参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/#boot-slots)。 |
| `KERNEL_FILE` | 内核二进制文件的文件名：aarch64 上为 `Image`，x86-64 上为 `bzImage`。 |
| `PARTITION_TABLE_TYPE` | `gpt`、`hybrid` 或 `mbr`。Home Assistant OS 尽可能使用 GPT。GPT 需要磁盘的第二个块来存放其头部。某些引导 ROM 自身需要使用该块，此时板卡使用 `mbr`。`hybrid` 会同时写入两种分区表，适用于 GPT 可用但固件仍会读取 MBR 的板卡。参见[分区](https://www.hasscn.top/contributors/os/operating-system/partitions/)。 |
| `BOOT_SIZE` | 引导分区的大小，如 `32M`。 |
| `BOOT_SPL` | `true` 或 `false`。板卡是否具有二级程序加载器（SPL），即 U-Boot 为某些板卡构建的小型第一阶段加载器。设为 `true` 时，镜像会为其预留空间，更新包中也会包含它。 |
| `BOOT_SPL_SIZE` | 为 SPL 预留的空间，如 `8M`。仅在 `BOOT_SPL=true` 时使用。 |
| `BOOT_ENV_SIZE` | U-Boot 环境的大小，十六进制表示，如 `0x4000`。RAUC 需要它来在 `hassos-bootstate` 分区上读写环境。仅适用于 U-Boot 板卡。 |

## Supervisor

| 变量 | 含义 |
| --- | --- |
| `SUPERVISOR_MACHINE` | 机器类型。Supervisor 用它来选择正确的 Home Assistant Core 镜像，插件（app）也用它来限制所支持的机器。多块板卡可以共用一个值，例如 ODROID-M1 和 M1S 共用 `odroid-m1`。当前取值列在[支持的板卡](https://www.hasscn.top/contributors/os/operating-system/boards/)页面上。 |
| `SUPERVISOR_ARCH` | 容器的 CPU 架构：`aarch64` 或 `amd64`。不再支持 32 位架构。 |

这两个变量最终都会写入 `/usr/lib/os-release`。`haos-supervisor` 服务使用架构来选择 Supervisor 镜像，并将机器类型传递给 Supervisor 容器。

## 共享的版本文件

`buildroot-external/meta` 适用于所有板卡：

```shell
VERSION_MAJOR="18"
VERSION_MINOR="4"
VERSION_SUFFIX="dev0"

HAOS_NAME="Home Assistant OS"
HAOS_ID="haos"

DEPLOYMENT="development"
```

| 变量 | 含义 |
| --- | --- |
| `VERSION_MAJOR`, `VERSION_MINOR`, `VERSION_SUFFIX` | 它们共同组成版本号，如 `18.4.dev0`，没有后缀时为 `18.4`。参见[发布与构建](https://www.hasscn.top/contributors/os/operating-system/releases/#version-numbers)。 |
| `HAOS_NAME`, `HAOS_ID` | 操作系统的名称和标识符，用于 `/usr/lib/os-release` 和镜像文件名。 |
| `DEPLOYMENT` | `development`、`staging` 或 `production`。设置镜像在更新时信任哪些证书，参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/#security)。 |
