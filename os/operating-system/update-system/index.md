# 更新系统

> Home Assistant OS 如何通过 RAUC 和双启动槽位进行自我更新、更新包如何签名，以及如何安装自己构建的版本。

Source: https://www.hasscn.top/contributors/os/operating-system/update-system/

Home Assistant OS 使用 [RAUC](https://rauc.io/) 进行更新，这是一种面向嵌入式 Linux 的基于镜像的更新系统。更新不会改变正在运行的系统上的文件。它将一个完整的新内核和根文件系统写入当前未运行的槽位（slot），然后启动进入该槽位。如果启动失败，设备会回到原来的槽位。

[RAUC 文档](https://rauc.readthedocs.io/)介绍 RAUC 本身。本页介绍 Home Assistant OS 如何使用它。

## 更新包

每次构建都会为新安装生成一个磁盘镜像，并为现有安装生成一个 RAUC 更新包（update bundle），即一个 `.raucb` 文件。两者都由相同的分区镜像制成。一个更新包包含：

- 启动分区内容
- 内核镜像
- 根文件系统
- 二级程序加载器（SPL），适用于带有该组件的板卡

清单模板 [`buildroot-external/ota/manifest.raucm.gtpl`](https://github.com/home-assistant/operating-system/blob/dev/buildroot-external/ota/manifest.raucm.gtpl) 定义了更新包的内容。它对所有板卡都相同。更新包的 `compatible` 值为 `haos-<board id>`，例如 `haos-rpi4-64`，因此一个更新包只能安装在它所针对的板卡上。

启动分区不属于 A/B 方案：更新会就地写入该分区。更新钩子 `buildroot-external/ota/rauc-hook` 会保留其上的 `.txt` 文件，例如 `cmdline.txt` 和 `config.txt`，因此用户对这些文件的修改在更新后仍然保留。

## 更新的运行方式

RAUC 作为系统服务运行，并提供 D-Bus API。在正常使用中，由 Supervisor 驱动它：

1. Supervisor 下载新版本的更新包。
2. 它通过 D-Bus 请求 RAUC 安装该更新包。对 RAUC 而言，这是从文件进行的本地安装。
3. RAUC 写入非活动槽位，并告知引导加载程序下次尝试该槽位。
4. 此时更新已安装，但尚未激活。Supervisor 将其报告为 `version_pending`，并产生一个需要重启的修复问题。它不会自行重启。
5. 用户或发起更新的程序重启系统，系统启动进入新槽位。
6. Supervisor 启动后，会将已启动的槽位标记为良好（good）。

你也可以在主机 shell 中手动执行相同的操作。要安装更新包，请参阅[调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/)获取 shell：

```shell
cd /mnt/data
REPO=https://github.com/home-assistant/operating-system
curl -LO "$REPO/releases/download/18.3/haos_rpi4-64-18.3.raucb"
rauc install haos_rpi4-64-18.3.raucb
systemctl reboot
```

> [!NOTE]
> 在 Raspberry Pi 5 上，请始终使用 `systemctl reboot` 重启。它通过固件的 tryboot 机制启动新槽位，该机制需要 `systemctl reboot` 传递的重启参数。直接使用 `reboot` 会再次启动旧槽位。

## 启动槽位

有两个槽位：A 和 B。新安装只有槽位 A 被填充。第一次更新写入 B，下一次更新又写入 A，依此类推。

`ha os info` 显示当前正在运行的槽位。在主机 shell 中，`rauc status` 显示完整情况：

```text
=== System Info ===
Compatible:  haos-rpi4-64
Booted from: kernel.0 (A)

=== Slot States ===
x [kernel.0] (/dev/disk/by-partlabel/hassos-kernel0, raw, booted)
        bootname: A
        boot status: good
    [rootfs.0] (/dev/disk/by-partlabel/hassos-system0, raw, active)

o [kernel.1] (/dev/disk/by-partlabel/hassos-kernel1, raw, inactive)
        bootname: B
        boot status: good
    [rootfs.1] (/dev/disk/by-partlabel/hassos-system1, raw, inactive)
```

更新后，引导加载程序会尝试新槽位有限的次数，在 GRUB 上为三次。如果该槽位从未被标记为良好，引导加载程序会回退到另一个槽位。其工作方式取决于引导加载程序：

- **GRUB** 将槽位顺序保存在其环境文件（启动分区上的 `EFI/BOOT/grubenv`）中并进行尝试。其启动菜单还允许你手动选择槽位。
- **U-Boot** 将它们保存在 `hassos-bootstate` 分区上的环境中。
- **Raspberry Pi 5** 通过自定义的 RAUC 后端使用固件的 tryboot 机制。

要自行切换槽位，请使用 `ha os boot-slot A` 或 `ha os boot-slot B`。所选槽位将保持为默认槽位，直到你再次更改它，或某次更新更改了它。

## 安全性

更新包是经过签名的，RAUC 在安装任何内容之前会根据 `/etc/rauc/keyring.pem` 中的密钥环检查签名。Home Assistant OS 拥有自己的公钥基础设施，包括一个开发证书颁发机构和一个发布证书颁发机构。所有公开构建都由发布链签名。

镜像信任哪些证书取决于其[部署类型](https://www.hasscn.top/contributors/os/operating-system/releases/#deployment-types)：

- **Production 和 staging** 镜像信任发布证书颁发机构。
- **Development** 镜像信任开发证书颁发机构和发布证书颁发机构。

除此之外，你自己构建的每个镜像都信任你自己的自签名证书，即仓库根目录中的 `cert.pem`。参见[构建镜像](https://www.hasscn.top/contributors/os/operating-system/build/#signing)。因此，你构建的镜像会接受你后续构建的更新包，同时也接受官方发布版本。

### 安装自签名的构建版本

官方安装不信任你的证书。在其中安装你的更新包会失败：

```text
LastError: signature verification failed: Verify error:self signed certificate
```

不过，Home Assistant OS 并未锁定。拥有主机 root 权限后，你可以将证书添加到密钥环中，仅对当前启动有效。先将仓库根目录中的 `cert.pem` 复制到设备上的 `/mnt/data`：

```shell
cp -r /etc/rauc/ /tmp/rauc
cat /mnt/data/cert.pem >> /tmp/rauc/keyring.pem
mount -o bind /tmp/rauc/ /etc/rauc/
systemctl restart rauc
rauc install /mnt/data/haos_rpi4-64-18.4.dev0.raucb
```

重启后绑定挂载会消失，但你的构建版本在其自身的密钥环中包含你的证书。从那时起，设备会接受你后续的构建版本，也接受官方发布版本，因此你始终可以更新回某个发布版本。
