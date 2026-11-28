# 调试主机

> 通过 SSH 或控制台在 Home Assistant OS 上获取 root shell，并找到所需的日志。

Source: https://www.hasscn.top/contributors/os/operating-system/debugging/

要调试操作系统，你需要主机本身的 shell，而不是容器内的 shell。本页介绍进入的途径，以及进入后到哪里查找信息。

> [!IMPORTANT]
> 这面向开发者。想要终端的用户应改用**Terminal & SSH**应用。该应用在权限受限的容器中运行。本页内容会给你对主机的完整 root 访问权限，没有人能为以这种方式修改过的系统提供支持。

## 端口 22222 上的 SSH

Home Assistant OS 在端口 22222 上为开发者提供了一个 SSH 服务器 [Dropbear](https://matt.ucc.asn.au/dropbear/dropbear.html)。它与任何 SSH 应用相互独立，只有当 root 至少有一把授权密钥时才会运行。不支持密码登录。

### 添加你的密钥

1. 如果你还没有 SSH 密钥，请使用 `ssh-keygen -t ed25519` 创建一个。GitHub 的[生成新 SSH 密钥](https://docs.github.com/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)指南涵盖了所有操作系统。
2. 将一个 U 盘格式化，卷标设为 `CONFIG`，参见[CONFIG U 盘](https://www.hasscn.top/contributors/os/operating-system/configuration/#the-config-usb-drive)。
3. 在该盘的根目录下创建一个名为 `authorized_keys` 的文件，不带扩展名。将你的*公钥*放入其中，即以 `.pub` 结尾的文件的内容，每行一把密钥。使用 Unix 换行符（LF）和纯 ASCII。
4. 将 U 盘插入设备，然后运行 `ha os import`，或者保持 U 盘插入并重启设备。

自 Supervisor 2026.09.0 起，Supervisor API 也可以通过 `/os/ssh/authorized_keys` 端点管理这些密钥。参见[应用（Apps）](https://www.hasscn.top/contributors/apps/)板块中的 Supervisor API 参考。

### 连接

```shell
ssh root@homeassistant.local -p 22222
```

如果你改过主机名，或者你的网络不支持 mDNS，请改用设备的 IP 地址。

### 再次关闭

导入一个*不含* `authorized_keys` 文件的 `CONFIG` 盘。导入操作会移除所有密钥并停止 SSH 服务器。也可以通过 API 对 `/os/ssh/authorized_keys` 执行 `DELETE`，移除 root 的所有授权密钥。

## 本地控制台

在接有屏幕和键盘的设备上，或在虚拟机控制台中，设备会显示 Home Assistant CLI（`ha >`）。输入 `login` 即可在主机上获得 root shell。

如果 CLI 在三分钟内没有启动，或者你在等待期间按下 <kbd>Ctrl</kbd>+<kbd>C</kbd>，你会得到一个紧急 shell。当 Supervisor 无法启动时，这就是进入系统的途径。

## 串行控制台

许多开发板还提供串行控制台。它会显示启动信息，并给出登录提示：以 `root` 登录，无需密码。

控制台在启动分区的 `cmdline.txt` 中设置。各开发板的默认值：

| 开发板 | 串行控制台 |
| --- | --- |
| Home Assistant Green | `ttyS2`，1500000 波特率 |
| Home Assistant Yellow | `ttyAMA2`，115200 波特率 |
| ODROID-C2、ODROID-C4、ODROID-N2、Khadas VIM3 | `ttyAML0`，115200 波特率 |
| 通用 aarch64、虚拟机 | `ttyS0` |

内核会将其消息写入 `cmdline.txt` 中的每一个控制台，但 systemd 的启动消息只会输出到列在最后的那一个。在所有带屏幕的开发板上，最后一个是 `console=tty0`，因此这些消息会显示在屏幕上。Home Assistant Yellow 没有 HDMI 端口，所以它把串行控制台列在最后。要在其他开发板的串行控制台上查看启动消息，请把它的 `console=` 条目移到行尾。对于不在本表中的开发板，请自行添加串行控制台，参见[开发板页面](https://www.hasscn.top/contributors/os/operating-system/boards/)。

## 救援 shell

在带有 GRUB 的开发板（通用 x86-64、通用 aarch64 和虚拟机）上，启动菜单中每个槽位都有一个救援 shell 条目。它会将系统启动到 systemd 的恢复目标，并输出调试信息。当系统无法启动到足以打开控制台的程度时，这很有用。

## 日志

日志（journal）存储在数据分区上，因此重启后仍然保留。在主机 shell 中：

```shell
# The service that starts the Supervisor
journalctl -u haos-supervisor -f

# The Supervisor itself
docker logs -f hassio_supervisor

# Home Assistant Core
docker logs -f homeassistant

# Everything, newest last
journalctl -e
```

在没有主机访问权限的情况下，CLI 也能显示其中大部分内容：`ha supervisor logs`、`ha core logs` 和 `ha host logs`。添加 `--help` 可查看选项，例如选择某次启动。

## 查看容器内部

系统的每个部分都是一个 Docker 容器。要在某个容器中打开 shell：

```shell
docker ps
docker exec -it homeassistant /bin/bash
```

[Supervisor 概览](https://www.hasscn.top/contributors/os/supervisor/#what-the-supervisor-runs)列出了这些容器及其名称。
