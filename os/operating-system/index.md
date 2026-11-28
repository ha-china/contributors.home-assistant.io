# Home Assistant OS

> Home Assistant OS 的组成、启动方式，以及其代码仓库的组织结构。

Source: https://www.hasscn.top/contributors/os/operating-system/

Home Assistant OS 是一个只做一件事的 Linux 系统：运行 Home Assistant。它不基于 Debian 或 Ubuntu 之类的发行版，而是使用 [Buildroot](https://buildroot.org/) 从源码构建，每种板子一个镜像，只包含 Home Assistant 所需的内容。

Buildroot 是一个构建系统，而不是发行版。它交叉编译工具链、内核、引导加载程序以及每一个软件包，并将它们组装成一个磁盘镜像。这使它非常适合小型 Arm 板卡——在这类设备上直接构建会耗费极长时间。

## 系统组成

- **引导加载程序**：UEFI 系统（x86-64、通用 Arm 和虚拟机）上使用 [GRUB](https://www.gnu.org/software/grub/)，大多数单板计算机上使用 [U-Boot](https://docs.u-boot.org/)，Raspberry Pi 5 上则使用固件自带的 tryboot 机制。
- **内核**：大多数板卡使用主线 Linux，Raspberry Pi 和 Home Assistant Yellow 使用 Raspberry Pi 的 Linux 分支。仓库中的 [`Documentation/kernel.md`](https://github.com/home-assistant/operating-system/blob/dev/Documentation/kernel.md) 列出了当前版本。
- **根文件系统**：[EROFS](https://docs.kernel.org/filesystems/erofs.html)，经过压缩且为只读。
- **Init 与服务**：systemd，配合 NetworkManager 管理网络、systemd-timesyncd 同步时间、BlueZ 支持 Bluetooth。
- **容器**：Docker 引擎，用于运行 Supervisor 及其管理的一切。
- **更新**：[RAUC](https://rauc.io/)，采用双系统槽位。参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/)。
- **安全**：[AppArmor](https://apparmor.net/) 内核安全模块，为 Supervisor 和应用提供配置文件。
- **内存**：为 `/var` 和 `/tmp` 使用 ZRAM，并在数据分区上提供交换文件。
- **OS Agent**：[os-agent](https://github.com/home-assistant/os-agent) 仓库中的一个小程序。Supervisor 通过 D-Bus 使用它执行主机任务，例如移动数据磁盘。

## 启动流程

1. 引导加载程序选择一个槽位（A 或 B），并引导其内核和根文件系统。
2. systemd 挂载 overlay 和数据分区，并将持久化文件夹绑定到位。参见[分区](https://www.hasscn.top/contributors/os/operating-system/partitions/)。
3. `haos-config.service` 导入 `CONFIG` USB 驱动器（如果插入了的话）。参见[配置主机](https://www.hasscn.top/contributors/os/operating-system/configuration/)。
4. Docker 启动，`haos-supervisor.service` 启动 Supervisor 容器 `hassio_supervisor`。如果镜像缺失或损坏，该服务会先下载一个新的镜像。
5. Supervisor 使用 RAUC 将该槽位标记为良好，然后启动其插件、Home Assistant Core 以及各个应用。

全新镜像中已包含 Supervisor 及其插件，但不包含 Home Assistant Core。它改为提供一个简单的落地页。首次启动时，Supervisor 会下载最新的 Core，因此每个新安装都从当前版本开始。

## 代码仓库

[home-assistant/operating-system](https://github.com/home-assistant/operating-system) 使用了 Buildroot 的 [br2-external 机制](https://buildroot.org/downloads/manual/manual.html#outside-br-custom)：所有特定于 Home Assistant OS 的内容都存放在 Buildroot 之外的 [`buildroot-external/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external) 中。Buildroot 本身是 [`buildroot/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot) 中的一个 Git 子模块，指向 [home-assistant/buildroot](https://github.com/home-assistant/buildroot) 分支。该分支在 upstream 之上只保留了尽可能少的补丁。

| 路径 | 内容 |
| --- | --- |
| [`buildroot-external/configs/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/configs) | 每个构建目标一个 `<target>_defconfig` |
| [`buildroot-external/board/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board) | 每种板子的[元数据](https://www.hasscn.top/contributors/os/operating-system/board-metadata/)、引导文件、内核配置和钩子 |
| [`buildroot-external/kernel/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/kernel) | 所有板卡共享的内核配置片段 |
| [`buildroot-external/package/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/package) | 额外的软件包，例如 `hassio`（预加载 Supervisor）和 `os-agent` |
| [`buildroot-external/rootfs-overlay/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/rootfs-overlay) | 复制到每个镜像中的文件，例如 `haos-*` systemd 单元 |
| [`buildroot-external/genimage/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/genimage) | 磁盘布局，参见[分区](https://www.hasscn.top/contributors/os/operating-system/partitions/) |
| [`buildroot-external/ota/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/ota) | RAUC 配置、更新清单和证书 |
| `buildroot-external/meta` | OS 版本和部署类型 |
| [`scripts/`](https://github.com/home-assistant/operating-system/tree/dev/scripts) | 辅助脚本，例如用于构建容器的 `enter.sh` |
| [`tests/`](https://github.com/home-assistant/operating-system/tree/dev/tests) | 在 QEMU 中启动镜像的自动化测试 |

## 后续步骤

- [构建镜像](https://www.hasscn.top/contributors/os/operating-system/build/)以获得可用的环境。
- [支持的板卡](https://www.hasscn.top/contributors/os/operating-system/boards/)列出了所有构建目标。
- [发布与构建](https://www.hasscn.top/contributors/os/operating-system/releases/)解释了你的更改如何进入发布版本。

## All pages in this section

### Guides

- [构建镜像](https://www.hasscn.top/contributors/os/operating-system/build/): 设置构建容器并为开发板构建 Home Assistant OS。
- [测试你的构建](https://www.hasscn.top/contributors/os/operating-system/test/): 在 QEMU 中启动你的镜像、运行自动化测试，并将你的构建安装到真实设备上。
- [配置主机](https://www.hasscn.top/contributors/os/operating-system/configuration/): 使用 CONFIG USB 驱动器，或直接在主机的持久化文件夹中更改 Home Assistant OS 的主机设置。
- [配置网络](https://www.hasscn.top/contributors/os/operating-system/networking/): Home Assistant OS 如何通过 NetworkManager 管理网络，以及如何配置 UI 未覆盖的部分。
- [调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/): 通过 SSH 或控制台在 Home Assistant OS 上获取 root shell，并找到所需的日志。
- [发布与构建](https://www.hasscn.top/contributors/os/operating-system/releases/): Home Assistant OS 的更改如何从拉取请求（pull request）走到发布，包括涉及的分支、版本号和构建流水线。

### Reference

- [分区](https://www.hasscn.top/contributors/os/operating-system/partitions/): Home Assistant OS 的磁盘布局、每个分区的内容，以及数据磁盘功能如何移动数据分区。
- [更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/): Home Assistant OS 如何通过 RAUC 和双启动槽位进行自我更新、更新包如何签名，以及如何安装自己构建的版本。
- [板卡元数据](https://www.hasscn.top/contributors/os/operating-system/board-metadata/): 每块板卡的 meta 文件中的变量，以及所有板卡共享的版本文件。

### Boards

- [支持的开发板](https://www.hasscn.top/contributors/os/operating-system/boards/): Home Assistant OS 构建所面向的每一块开发板，包括其构建目标、引导加载程序和机器类型。
- [Raspberry Pi](https://www.hasscn.top/contributors/os/operating-system/raspberry-pi/): Home Assistant OS 在 Raspberry Pi 上的特定内容，例如串行控制台、I2C 以及从 USB 启动。
- [ODROID](https://www.hasscn.top/contributors/os/operating-system/odroid/): Hardkernel ODROID 在 Home Assistant OS 下的 specifics，例如 eMMC 安装、M1 和 M1S 的启动流程以及控制台。
- [通用系统](https://www.hasscn.top/contributors/os/operating-system/generic/): 通用 x86-64 和 aarch64 目标，适用于通过 UEFI 启动的 PC 和其他系统。
- [虚拟机](https://www.hasscn.top/contributors/os/operating-system/virtual-machine/): ova 目标、它构建的虚拟磁盘格式，以及运行 Home Assistant OS 的虚拟机所需的条件。
