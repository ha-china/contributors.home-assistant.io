# ODROID

> Hardkernel ODROID 在 Home Assistant OS 下的 specifics，例如 eMMC 安装、M1 和 M1S 的启动流程以及控制台。

Source: https://www.hasscn.top/contributors/os/operating-system/odroid/

Home Assistant OS 支持五款 Hardkernel ODROID 开发板。它们的板级文件位于 [`buildroot-external/board/hardkernel/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board/hardkernel)。

| 开发板 | 构建目标 | SoC 系列 | 备注 |
| --- | --- | --- | --- |
| ODROID-C2 | `odroid_c2` | Amlogic | 已被 Hardkernel 停产 |
| ODROID-C4 | `odroid_c4` | Amlogic | |
| ODROID-N2 和 N2+ | `odroid_n2` | Amlogic | Home Assistant Blue 就是一台 ODROID-N2+ |
| ODROID-M1 | `odroid_m1` | Rockchip | 自 Home Assistant OS 10 起 |
| ODROID-M1S | `odroid_m1s` | Rockchip | 自 Home Assistant OS 12 起 |

它们都使用 U-Boot 启动，并运行主线（mainline）Linux 内核。

## Wi-Fi 和蓝牙模块

Hardkernel 的 [WiFi Module 3](https://www.hardkernel.com/shop/wifi-module-3/) 和 [Bluetooth Module 2](https://www.hardkernel.com/shop/bluetooth-module-2/) 曾在 Home Assistant OS 上测试过。WiFi Module 5A 没有上游驱动，不推荐使用。

## ODROID-C2、C4 和 N2

镜像在 eMMC 上的使用方式与 SD 卡相同：将其烧录到 eMMC 模块即可。

串口控制台位于串口排针上，为 `ttyAML0`，波特率 115200，位于 HDMI 控制台旁边。内核会同时向两者发送消息，但 systemd 的启动消息只会输出到 `cmdline.txt` 中列在最后的控制台。默认情况下是 HDMI：

```text
console=ttyAML0,115200n8 console=tty0
```

如果想在串口控制台上查看启动消息，请将两者顺序对调。

在 ODROID-N2 上，GPIO 引脚 11 可用作电源按键，低电平有效。关于 GPIO 排针，请参阅 ODROID wiki 中 [C2](https://wiki.odroid.com/odroid-c2/hardware/expansion_connectors)、[C4](https://wiki.odroid.com/odroid-c4/hardware/expansion_connectors) 和 [N2](https://wiki.odroid.com/odroid-n2/hardware/expansion_connectors) 的相关页面。

## ODROID-M1

镜像包含了直接启动 SoC 所需的一切，无需 Hardkernel 的 Petitboot。但 M1 会首先从其 SPI 闪存启动。要直接从 SD 卡或 eMMC 启动，请按住恢复（recovery）按钮。SPI 闪存中较新版本的 Petitboot 也能自行找到 Home Assistant OS 的 U-Boot，因此无需按按钮。

要通过 SPI 闪存从 eMMC 启动，需要 Petitboot 版本 20230328 或更高。更新方法如下：

1. 从 [Hardkernel 的 Petitboot 镜像](http://ppa.linuxfactory.or.kr/images/petitboot/odroidm1/) 下载 SPI 更新器和 SPI 启动镜像。
2. 将更新器烧录到一张 SD 卡上。
3. 将 SPI 启动镜像复制到该 SD 卡的 FAT 分区，命名为 `spiboot.img`。
4. 从该 SD 卡启动 M1。HDMI 输出会显示进度，成功时左上角会显示新版本号。

然后将 Home Assistant OS 烧录到 eMMC。NVMe 硬盘无法作为启动盘，但可以用作[数据盘（data disk）](https://www.hasscn.top/contributors/os/operating-system/partitions/#data-disk)。

串口控制台位于 CON1 排针上，波特率为 1500000。`cmdline.txt` 中包含 `console=tty0`，因此 systemd 的启动消息会显示在 HDMI 上，而不是串口控制台上。

## ODROID-M1S

M1S 会先从 SD 卡启动，然后才是 eMMC，因此带有 Home Assistant OS 的 SD 卡可以直接使用。即使 eMMC 上仍是出厂加载器（loader），也能正常工作。

要安装到 eMMC，请使用 Hardkernel 的 [UMS 工具镜像](https://wiki.odroid.com/odroid-m1s/getting_started/os_installation_guide#user_installer)。它会把 M1S 变成一个 USB 大容量存储设备，这样你就可以通过 Micro USB OTG 接口从电脑上烧录 eMMC。

安装 Home Assistant OS 会将 eMMC 上的加载器替换为主线版本。此后，UMS 工具镜像将无法再从 SD 卡启动。要重新进入 UMS 模式，请在 Home Assistant OS 的主机 shell 中将 Hardkernel 的镜像写入 eMMC：

```shell
dd if=/tmp/ODROID-M1S_EMMC2UMS.img of=/dev/mmcblk0
```

设备下次启动时（无需 SD 卡）就会进入 UMS 模式。请在另一台电脑上下载该镜像：Hardkernel 的下载站点会阻止脚本化下载。然后将其复制到设备上，例如使用 `scp`。

NVMe 硬盘无法作为启动盘，但可以用作数据盘。14 针扩展排针已部分获得主线内核支持，包括 UPS 和内部 USB。

串口控制台的波特率为 1500000。与 M1 一样，systemd 的启动消息会显示在 HDMI 上。
