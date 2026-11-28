# 配置主机

> 使用 CONFIG USB 驱动器，或直接在主机的持久化文件夹中更改 Home Assistant OS 的主机设置。

Source: https://www.hasscn.top/contributors/os/operating-system/configuration/

Home Assistant OS 的根文件系统是只读的。需要在重启或更新后保留的设置存放在 overlay 分区上，并以绑定挂载（bind mount）的方式挂载到位。你可以通过两种方式更改它们：使用 `CONFIG` USB 驱动器，或直接在主机 shell 中操作。

大多数用户从不需要这些。Supervisor 通过 UI 和 `ha` 命令行管理网络、主机名、swap 和数据磁盘。本页面介绍的是它未涵盖的内容，以及用于开发和调试的内容。

## CONFIG USB 驱动器

将 USB 驱动器格式化为 FAT32、exFAT、ext4 或 NTFS，并将其卷标设置为 `CONFIG`（大写）。它必须是文件系统的卷标：Home Assistant OS 会忽略分区的名称。将你需要的文件放在其根目录中：

```text
network/
modules/
modprobe/
udev/
authorized_keys
timesyncd.conf
haos_<board>-<version>.raucb
```

| 条目 | 作用 |
| --- | --- |
| `network/` | NetworkManager 连接文件。会替换所有现有连接。参见[配置网络](https://www.hasscn.top/contributors/os/operating-system/networking/)。 |
| `modules/` | 用于 `/etc/modules-load.d` 的文件，在启动时加载内核模块。会替换现有文件。 |
| `modprobe/` | 用于 `/etc/modprobe.d` 的文件，用于设置内核模块选项。会替换现有文件。 |
| `udev/` | 用于 `/etc/udev/rules.d` 的文件。会替换现有规则。 |
| `authorized_keys` | root 的 SSH 公钥，并在端口 22222 上启动 SSH。参见[调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/)。 |
| `timesyncd.conf` | 你自己的时间服务器设置。以 drop-in 形式存储在 `/etc/systemd/timesyncd.conf.d/` 中。 |
| `*.raucb` | 要安装的更新包。仅能从 USB 驱动器安装，且仅在系统已运行 5 分钟后才会安装。 |

每个文本文件都使用 Unix 换行符（LF）。Windows 换行符（CRLF）会破坏它们。大多数代码编辑器（如 Visual Studio Code）都可以切换文件的换行符。

> [!WARNING]
> 导入操作会镜像该驱动器。没有 `authorized_keys` 文件的驱动器会删除主机上的密钥，并停止端口 22222 上的 SSH。文件夹也是如此：`network/` 中的内容会替换主机上的所有连接。

### 驱动器何时被读取

`haos-config.service` 在每次启动时都会读取该驱动器。要在运行中的系统上导入它，请运行以下命令之一：

```shell
# From the Home Assistant CLI
ha os import

# From the host shell
systemctl restart haos-config
```

你只需在导入期间插入驱动器，之后即可将其移除。

由于 5 分钟规则，更新包绝不会在启动期间安装。请在系统运行后插入驱动器，并运行 `ha os import`。

### 不使用 USB 驱动器

你也可以在启动分区的根目录中创建一个 `CONFIG` 文件夹，内容相同。这对于虚拟机，或在全新烧录的 SD 卡首次启动之前非常方便。它只在没有卷标为 `CONFIG` 的 USB 驱动器时使用，并且导入后该文件夹会被删除。更新包不会从中安装。

## 主机上的持久化文件夹

在主机 shell 中，这些路径是从 overlay 分区绑定挂载的。你在其中所做的更改在重启和操作系统更新后仍然保留：

| 路径 | 用途 |
| --- | --- |
| `/etc/NetworkManager/system-connections` | 网络连接 |
| `/etc/modules-load.d` | 启动时加载的内核模块 |
| `/etc/modprobe.d` | 内核模块选项 |
| `/etc/udev/rules.d` | udev 规则 |
| `/etc/sysctl.d` | 内核参数 |
| `/etc/systemd/timesyncd.conf.d` | 时间服务器设置 |
| `/etc/hostname`, `/etc/hosts` | 主机名和静态主机名 |
| `/etc/default` | 主机服务的设置，例如 swap 文件 |
| `/etc/usb_modeswitch.d` | 调制解调器的 USB 模式切换 |
| `/root/.ssh` | root 的 SSH 密钥 |

`/etc` 下的其他所有内容都来自只读镜像，在那里所做的更改会在下次重启时丢失。

## 内核命令行

将内核参数添加到启动分区上的 `cmdline.txt`。引导加载程序会读取它并将其附加到内核命令行。在主机上，启动分区挂载在 `/mnt/boot`。在大多数板子上，它也是你将 SD 卡或磁盘插入其他电脑时显示的第一个分区。

默认值因板子而异。在许多板子上，`cmdline.txt` 设置了控制台，参见[调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/#serial-console)。

## 时间服务器

Home Assistant OS 使用 systemd-timesyncd。它使用 DHCP 服务器通告的时间服务器，并回退到 `time.cloudflare.com`。要使用你自己的时间服务器，请将它们放在 `CONFIG` 驱动器上的 `timesyncd.conf` 中：

```ini
[Time]
NTP=ntp.example.com
```

或者直接在主机的 `/etc/systemd/timesyncd.conf.d/` 中创建一个文件。

## Swap

Home Assistant OS 在数据分区上使用 swap 文件。默认情况下，它是内存的三分之一，至少 1 GiB，至多 4 GiB。使用 CLI 更改它：

```shell
ha os config swap options --swap-size=2G --swappiness=10
```

OS Agent 将大小存储在 `/etc/default/haos-swapfile` 中，作为 `SWAPSIZE`。大小为 0 会关闭 swap 文件。更改在重启后生效，并且 Supervisor 会为此提出一个修复问题。
