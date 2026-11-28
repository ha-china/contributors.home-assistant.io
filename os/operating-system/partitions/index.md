# 分区

> Home Assistant OS 的磁盘布局、每个分区的内容，以及数据磁盘功能如何移动数据分区。

Source: https://www.hasscn.top/contributors/os/operating-system/partitions/

Home Assistant OS 的磁盘布局与典型的 Linux 系统不同。系统本身存储了两份，以便安全更新，而所有会变化的内容都存放在单独的分区上。

## 分区表

Home Assistant OS 在可能的情况下使用 GPT 分区表。一些开发板的引导固件需要使用磁盘的第二个块，而 GPT 正是在那里存储其头部信息。这些开发板使用混合分区表，即 GPT 与 MBR 并存，或者使用纯 MBR 表。[开发板元数据](https://www.hasscn.top/contributors/os/operating-system/board-metadata/)中的 `PARTITION_TABLE_TYPE` 决定使用哪一种。

## 布局

| 分区 | 标签 | 大小 | 内容 |
| --- | --- | --- | --- |
| 引导 | `hassos-boot` | 因开发板而异，16 到 64 MB | 引导加载程序文件、`cmdline.txt` 和引导配置 |
| 内核 A | `hassos-kernel0` | 24 MB | 槽位 A 的内核 |
| 系统 A | `hassos-system0` | 256 MB | 槽位 A 的根文件系统 |
| 内核 B | `hassos-kernel1` | 24 MB | 槽位 B 的内核 |
| 系统 B | `hassos-system1` | 256 MB | 槽位 B 的根文件系统 |
| 引导状态 | `hassos-bootstate` | 8 MB | U-Boot 环境变量（在使用 U-Boot 的开发板上） |
| Overlay | `hassos-overlay` | 96 MB | 持久化的主机设置 |
| 数据 | `hassos-data` | 磁盘的剩余空间 | 容器、Home Assistant、应用和用户数据 |

带有二级程序加载器（SPL）的开发板还会在磁盘起始处、引导分区之前为其预留空间。这些大小在 [`buildroot-external/scripts/hdd-image.sh`](https://github.com/home-assistant/operating-system/blob/dev/buildroot-external/scripts/hdd-image.sh) 和开发板元数据中设置。布局本身位于 [`buildroot-external/genimage/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/genimage) 中。

分区名称保留了旧的 `hassos` 前缀。操作系统和 Supervisor（管理器）中的大量代码都是通过这些标签来查找分区的。

## 引导分区

一个 FAT 分区，挂载在 `/mnt/boot`。在 UEFI 系统上，它是 EFI 系统分区，包含 GRUB 及其环境文件。在其他开发板上，它存放 U-Boot 或 Raspberry Pi 的固件文件。它还存放 `cmdline.txt`，在 Raspberry Pi 上还有 `config.txt`。

## 内核和系统分区

每个槽位都有一个内核分区和一个系统分区。系统分区存放根文件系统，即一个只读的、压缩的 EROFS 镜像。在正常使用期间，两者都不会被写入。只有更新时才会写入它们，而且只写入未在运行的槽位。参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/)。

## Overlay 分区

一个 ext4 文件系统，挂载在 `/mnt/overlay`。它存放需要持久化的主机设置，例如网络连接、主机名和 SSH 密钥。它们在启动时以绑定挂载（bind mount）的方式挂载到 `/etc` 及其他位置。[配置主机](https://www.hasscn.top/contributors/os/operating-system/configuration/#persistent-folders-on-the-host)列出了这些设置。

## 数据分区

一个 ext4 文件系统，挂载在 `/mnt/data`。它存放所有不属于操作系统的内容：Docker 存储（绑定到 `/var/lib/docker`）、位于 `/mnt/data/supervisor` 的 Supervisor 数据、系统日志以及交换文件。它的读写量远远超过其他分区，因此最能从高速存储中受益。

镜像中的数据分区很小。在首次启动时，`haos-expand` 会将其扩展以填满磁盘的剩余空间。

全新镜像在数据分区上已预装了 Supervisor 及其插件，但没有 Home Assistant Core。它只有一个简单的着陆页。Supervisor 会在首次启动时下载当前的 Core，因此新安装的系统总是从最新版本开始。

## 数据磁盘

用户可以将数据分区移动到另一个磁盘，例如在 SD 卡旁边使用 USB SSD。Supervisor 和 OS Agent 会准备目标磁盘（使用标签为 `hassos-data-external` 的分区）并重启。

在下次启动期间，`haos-data.service` 会使用 `e2image` 将数据分区复制到新磁盘，并将旧分区的标签更改为 `hassos-data-old`。此后，新分区是唯一带有 `hassos-data` 标签的分区，因此它就是会被挂载的那个分区。如果复制失败，新分区会被标记为 `hassos-data-fail`，系统将继续使用旧分区。

在全新安装的首次启动时，`haos-data-disk-detach.service` 会在其他磁盘上查找 `hassos-data` 分区，例如之前安装遗留的数据磁盘。它会将它们重命名为 `hassos-data-dis`，这样新安装的系统就不会挂载它们。Home Assistant Yellow 是个例外：其第一个 NVMe 磁盘上的数据分区会被保留，并优先于 eMMC 上的数据分区。
