# Raspberry Pi

> Home Assistant OS 在 Raspberry Pi 上的特定内容，例如串行控制台、I2C 以及从 USB 启动。

Source: https://www.hasscn.top/contributors/os/operating-system/raspberry-pi/

Home Assistant OS 支持 Raspberry Pi 3、4 和 5，均为 64 位。Home Assistant Yellow 基于相同的板卡支持构建，使用 Compute Module 4 或 5。

| 板卡 | 构建目标 | 引导加载程序 |
| --- | --- | --- |
| Raspberry Pi 3 Model B 和 B+ | `rpi3_64` | U-Boot |
| Raspberry Pi 4 Model B | `rpi4_64` | U-Boot |
| Raspberry Pi 5 | `rpi5_64` | Firmware tryboot |
| Home Assistant Yellow | `yellow` | U-Boot |

它们都使用 [Raspberry Pi Linux 内核](https://github.com/raspberrypi/linux)，而非主线内核。板卡文件位于 [`buildroot-external/board/raspberrypi/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/board/raspberrypi)。

## 启动方式

在 Raspberry Pi 3 和 4 上，Raspberry Pi 固件会加载 U-Boot（`config.txt` 中的 `kernel=u-boot.bin`），然后由 U-Boot 选择启动槽位。Raspberry Pi 5 无需 U-Boot 即可启动：固件直接加载活动槽位的内核，更新时则使用固件的 tryboot 机制来测试新槽位。手动更新后，请务必使用 `systemctl reboot` 重启 Raspberry Pi 5，参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/#how-an-update-runs)。

`config.txt` 和 `cmdline.txt` 位于启动分区上。对它们的更改在操作系统更新后仍然保留。

## 串行控制台

在 Raspberry Pi 3 和 4 上，串行控制台默认未启用。要在 GPIO 排针上启用它（引脚 6 为地线，引脚 8 为 TX，引脚 10 为 RX）：

1. 在 `config.txt` 中添加 `enable_uart=1` 和 `dtoverlay=disable-bt`。该 overlay 会将蓝牙从主 UART 上移开。
2. 在 `cmdline.txt` 中添加 `console=ttyAMA0,115200`。

Home Assistant Yellow 的串行控制台已启用，位于 `ttyAMA2`，波特率为 115200。

## I2C

1. 在 `config.txt` 中添加 `dtparam=i2c_arm=on`。
2. 在启动时加载 `i2c-dev` 模块：在 [CONFIG USB 闪存盘](https://www.hasscn.top/contributors/os/operating-system/configuration/#the-config-usb-drive)的 `modules/` 文件夹中放置一个包含 `i2c-dev` 一行的文件，或在主机的 `/etc/modules-load.d/` 中放置。

## 从 USB 启动

Raspberry Pi 4 和 5 可以从 USB 驱动器启动，前提是它们 EEPROM 中的引导加载程序足够新。Home Assistant OS 包含 EEPROM 工具。`ha os boards raspberrypi firmware update` 可从 CLI 更新引导加载程序。

需要了解的一些事项：

- 移除所有可启动的 SD 卡。固件会首先尝试 SD 卡。
- 启动速度较慢，因为固件在 USB 之前会先检查 SD 卡。
- 并非所有 USB 转 SATA 适配器都能正常工作。在 Raspberry Pi 4 上，`cmdline.txt` 已包含针对已知需要它的适配器的 `usb-storage.quirks`。Raspberry Pi 5 镜像则没有。如果你的适配器表现异常，请找到它的 USB ID 并为其添加一个 quirk。
- 在没有 SD 卡的情况下，在 `config.txt` 中添加 `dtparam=sd_poll_once=on`，以阻止内核轮询空槽位。

Raspberry Pi 3 Model B 在 `config.txt` 中设置一次 `program_usb_boot_mode=1` 后即可从 USB 启动。该更改是永久性的：它会被写入一次性可编程存储器。

## 蓝牙

蓝牙默认开启。如果不需要，可在 `config.txt` 中使用 `dtoverlay=disable-bt` 将其关闭。
