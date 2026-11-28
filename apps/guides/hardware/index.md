# 访问硬件和宿主机

> 让你的应用访问串口、USB 设备、GPIO、音频以及宿主机的部分内容，并且只授予它真正需要的最小权限。

Source: https://www.hasscn.top/contributors/apps/guides/hardware/

默认情况下，应用看不到任何硬件，也只能看到宿主机的一小部分。这是有意为之：你添加的每一分访问权限，都可能被应用中的一个 bug 所滥用。本指南介绍从窄到宽的各种选项。请选择能满足需求的最窄选项。

## 让用户选择设备

对于 U 盘或串口适配器，最佳方案通常根本不在 `config.yaml` 中，而是在你的选项（options）里。`device` 选项会向用户显示一个系统上设备的下拉列表，然后 Supervisor 会将所选设备映射进你的容器：

```yaml
options:
  device:
schema:
  device: "device(subsystem=tty)"
```

用户选择设备后，它在重启后依然有效，因为下拉列表在系统支持时会提供稳定的 `/dev/serial/by-id/...` 路径，而且你的应用只会获得对这一个设备的访问权限。官方的 Z-Wave JS 应用就是这样做的。

## 固定设备

如果你的应用总是使用同一个设备，可以在 `devices` 中列出它的路径：

```yaml
devices:
  - /dev/ttyAMA0
```

## 设备组

这些选项会映射一整类设备，包括应用启动后才插入的设备：

| 键 | 访问权限 |
| --- | --- |
| `uart: true` | 所有串口设备 |
| `usb: true` | 原始 USB 访问，通过 `/dev/bus/usb` |
| `video: true` | 所有视频设备 |
| `gpio: true` | GPIO，通过 `/sys/class/gpio`。某些库还需要 `/dev/mem` 和 `SYS_RAWIO` 能力（capability） |
| `udev: true` | 宿主机的 udev 数据库，只读，用于查询设备详情 |
| `devicetree: true` | 宿主机的设备树（device tree），位于 `/device-tree` |

在启用 AppArmor 的系统上，GPIO 访问通常还需要自定义的 AppArmor 配置文件。参见[保护你的应用](https://www.hasscn.top/contributors/apps/guides/security/#apparmor)。

## 音频

设置 `audio: true` 后，你的应用会通过 PulseAudio 连接到 Home Assistant 的音频系统，用户可以在应用页面上选择输入和输出设备。如果你的软件只支持 ALSA，请安装 ALSA 的 PulseAudio 插件：Alpine 上是 `alsa-plugins-pulse`，Debian 和 Ubuntu 上是 `libasound2-plugins`。

## 宿主机

有些应用需要的不仅仅是设备，还有宿主机的更多内容：

| 键 | 提供的内容 |
| --- | --- |
| `host_network: true` | 宿主机的网络。mDNS 等发现协议以及必须看到真实网络接口的软件需要它。会降低安全评级。 |
| `host_dbus: true` | 宿主机的 D-Bus 系统总线，只读，用于与 NetworkManager 或 BlueZ 等服务通信。 |
| `journald: true` | 系统日志，只读。它位于某些系统的 `/var/log/journal`，另一些系统的 `/run/log/journal`，所以请两处都检查。 |
| `kernel_modules: true` | 宿主机的内核模块，只读，以及加载它们的权限。 |
| `realtime: true` | 实时调度，适用于需要低延迟的音频软件。 |
| `host_uts: true` | 宿主机的主机名。 |

完整列表（包括通过 `privileged` 获得的能力）请参见[应用配置](https://www.hasscn.top/contributors/apps/reference/configuration/#host-and-privileges)。

## 保护模式

某些选项只有在关闭**保护模式（Protection mode）**时才能生效：`full_access`、`docker_api` 和 `host_pid`。保护模式默认开启，当它被关闭时 UI 会向用户发出警告。在保护模式关闭且设置了这些选项的情况下，你的应用几乎可以对系统做任何事情。

这些选项只应用于职责本身就是管理系统管理的应用，并在你的文档中解释为什么你的应用需要它。尤其是 `full_access`，它会授予对所有设备的访问权限，并使 `devices`、`uart`、`usb` 和 `gpio` 变得毫无意义。`full_access` 和 `docker_api` 会将[安全评级](https://www.hasscn.top/contributors/apps/reference/security-rating/)设为 1，`host_pid` 会将其降低 2。
