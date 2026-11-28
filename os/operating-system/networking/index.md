# 配置网络

> Home Assistant OS 如何通过 NetworkManager 管理网络，以及如何配置 UI 未覆盖的部分。

Source: https://www.hasscn.top/contributors/os/operating-system/networking/

Home Assistant OS 使用 [NetworkManager](https://networkmanager.dev/) 管理主机网络。开箱即用时没有任何连接配置文件（connection profile）：NetworkManager 会自动连接有线接口，IPv4 使用 DHCP，IPv6 使用自动配置。

## 三种配置方式

1. **UI**：在 **设置** > **系统** > **网络** 下。大多数用户不需要其他方式。
2. **CLI**：`ha network` 覆盖 UI 能做的所有操作，还支持更多功能，比如 VLAN。
3. **直接使用 NetworkManager**：通过 `CONFIG` U 盘上的连接文件，或在主机上使用 `nmcli`。适用于前两种方式不支持的场景。

当你通过 UI 或 CLI 更改设置时，Supervisor 会更新该接口的活动连接配置文件。如果不存在，它会创建一个名为 `Supervisor <interface>` 的配置文件，例如 `Supervisor eth0`。因此，你自己编写的配置文件之后可能会被用户在 UI 中修改。

## 使用 CLI

`ha network info` 列出所有接口。`default` 是主接口的快捷方式。要将其恢复为 DHCP：

```shell
ha network update default --ipv4-method auto
```

设置静态 IPv4 地址：

```shell
ha network update eth0 --ipv4-method static \
  --ipv4-address 192.168.1.10/24 --ipv4-gateway 192.168.1.1 \
  --ipv4-nameserver 192.168.1.1
```

在有 Wi-Fi 硬件的板子上也可以使用 Wi-Fi。有线连接更可靠，因此建议尽可能使用有线连接：

```shell
ha network update wlan0 --ipv4-method auto \
  --wifi-mode infrastructure --wifi-ssid "My network" \
  --wifi-auth wpa-psk --wifi-psk "My password"
```

运行 `ha network update --help` 查看所有选项。

## 使用连接文件

NetworkManager 从 `/etc/NetworkManager/system-connections` 读取 keyfile 格式的连接配置文件，该目录是持久化的。你可以在主机 shell 中将文件放到那里，或者将它们放在 [CONFIG U 盘](https://www.hasscn.top/contributors/os/operating-system/configuration/#the-config-usb-drive) 的 `network/` 文件夹中。U 盘会用它自己的连接替换所有现有连接。

仅支持连接文件。不支持对 `NetworkManager.conf` 本身的修改，它是只读镜像的一部分。[NetworkManager 设置参考](https://networkmanager.dev/docs/api/latest/nm-settings-keyfile.html) 记录了所有选项。

为每个连接分配一个只生成一次的 UUID，例如使用 `uuidgen`。如果没有固定的 UUID，连接的身份会发生变化，每次启动后可能会获得不同的地址。保存文件时请使用 Unix 换行符（LF）。

### 有线连接，使用 DHCP

```ini
[connection]
id=my-network
uuid=d55162b4-6152-4310-9312-8f4c54d86afa
type=ethernet

[ipv4]
method=auto

[ipv6]
addr-gen-mode=stable-privacy
method=auto
```

### 静态 IPv4 地址

替换 `[ipv4]` 部分：

```ini
[ipv4]
method=manual
address1=192.168.1.111/24,192.168.1.1
dns=192.168.1.1;
```

`address1` 是地址及其前缀长度，然后是网关。

### 使用 WPA 的 Wi-Fi

```ini
[connection]
id=my-wifi
uuid=72111c67-4a5d-4d5c-925e-f8ee26efb3c3
type=wifi

[wifi]
mode=infrastructure
ssid=MY_SSID
# 当网络不广播其名称时取消注释
# hidden=true

[wifi-security]
auth-alg=open
key-mgmt=wpa-psk
psk=MY_PASSWORD

[ipv4]
method=auto

[ipv6]
addr-gen-mode=stable-privacy
method=auto
```

Home Assistant OS 默认关闭 Wi-Fi 省电模式。要为某个连接开启它，请在其 `[wifi]` 部分中添加 `powersave=3`。

## 在主机上使用 nmcli

在主机 shell 中，`nmcli` 提供了 NetworkManager 的全部功能。`nmcli con show` 列出所有配置文件。例如，为名为 `Supervisor eth0` 的配置文件设置静态地址：

```shell
nmcli con mod "Supervisor eth0" ipv4.method manual \
  ipv4.addresses 192.168.1.10/24 ipv4.gateway 192.168.1.1 \
  ipv4.dns 192.168.1.1
nmcli con up "Supervisor eth0"
```

如果还没有配置文件，请使用 `nmcli con add` 创建一个，或者先通过 CLI 设置一次该接口。

## 重置网络

要丢弃所有连接配置文件并恢复默认设置，请在主机 shell 中删除它们并重启：

```shell
rm -r /mnt/overlay/etc/NetworkManager/system-connections/*
reboot
```

## 值得了解的默认设置

其中大部分来自镜像中的 `NetworkManager.conf`：

- 每个连接都启用了 mDNS 和 LLMNR，因此系统会响应 `homeassistant.local`。
- NetworkManager 每 10 分钟检查一次连接性，检查对象是 `checkonline.home-assistant.io`。
- Docker 的网桥和虚拟接口不由 NetworkManager 管理。
- DHCP 服务器通告的时间服务器会通过 NetworkManager dispatcher 脚本 `10-ntp` 传递给 systemd-timesyncd。
