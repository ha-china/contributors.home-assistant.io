# 测试你的构建

> 在 QEMU 中启动你的镜像、运行自动化测试，并将你的构建安装到真实设备上。

Source: https://www.hasscn.top/contributors/os/operating-system/test/

构建完成并不代表构建可用。在提交拉取请求（pull request）之前，请先启动你的镜像。对于大多数更改，虚拟机就足够了；对于特定开发板的更改，则需要相应的开发板。

## 在 QEMU 中启动

`ova` 目标会为虚拟机构建镜像，其中包括一个压缩的 QCOW2 镜像，解压后即可在 QEMU 中运行。`--keep` 会保留压缩文件，因为下文的自动化测试会再次解压它。Home Assistant OS 需要 UEFI，因此 QEMU 也需要 UEFI 固件。在 Debian 和 Ubuntu 上，`ovmf` 软件包提供了该固件。

```shell
scripts/enter.sh make O=output_ova ova
unxz --keep output_ova/images/haos_ova-*.qcow2.xz
```

然后启动它。固件文件的路径因发行版而异，请检查你的 `ovmf` 软件包将其放在了哪里：

```shell
IMAGE=output_ova/images/haos_ova-18.4.dev0.qcow2
FIRMWARE=/usr/share/OVMF/OVMF_CODE.fd

qemu-system-x86_64 -enable-kvm -name haos -smp 2 -m 2G \
  -drive file="$IMAGE",if=virtio,format=qcow2 \
  -drive file="$FIRMWARE",if=pflash,format=raw,readonly=on
```

启动结束后会停在 Home Assistant CLI 提示符 `ha >`。输入 `login` 即可在宿主机上获得 root shell。

在 Arm 机器上，请使用 `generic_aarch64` 目标。除了磁盘镜像之外，它还会为 Arm 虚拟机构建 QCOW2、VMDK 和 VDI 镜像。

## 运行自动化测试

[`tests/`](https://github.com/home-assistant/operating-system/tree/dev/tests) 文件夹中包含一些测试，它们会在 QEMU 中启动 OVA 镜像，并检查系统和 Supervisor 是否正常启动。这些测试使用 [labgrid](https://labgrid.readthedocs.io/) 和 pytest。测试环境要求镜像位于 `tests/haos.qcow2`，OVMF 固件位于 `/usr/share/ovmf/OVMF.fd`：

```shell
unxz -c output_ova/images/haos_ova-*.qcow2.xz > tests/haos.qcow2
tests/run_tests.sh
```

除非你已经在 Python 虚拟环境中工作，否则该脚本会在 `tests/venv` 中创建一个虚拟环境，并将测试依赖安装到其中。同样的测试也会在 CI 中运行，包括每次发布构建，以及带有 `run-ova-test` 标签的拉取请求。

## 将你的构建安装到设备上

你可以像刷写任何正式版本一样，将磁盘镜像刷写到 SD 卡或磁盘上。如果想保留现有安装中的数据，可以改为安装 RAUC 更新包（update bundle）。

> [!IMPORTANT]
> 官方发布版本只信任由发布证书签名的更新包。你的构建使用你自己的自签名证书签名，因此安装会因签名错误而失败。[安装自签名的构建](https://www.hasscn.top/contributors/os/operating-system/update-system/#install-a-self-signed-build)介绍了如何让设备接受它。

一旦设备接受了你的证书，将 `.raucb` 文件复制到设备上，然后在宿主 shell 中运行以下命令（参见[调试宿主机](https://www.hasscn.top/contributors/os/operating-system/debugging/)）：

```shell
cd /mnt/data
rauc install haos_rpi4-64-18.4.dev0.raucb
systemctl reboot
```

设备会重启进入刚刚写入的槽位（slot）。如果该槽位无法启动，则会回退到另一个槽位。参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/)。

## 使用开发版构建

你并不总是需要自己构建。`dev` 分支的开发版构建发布在 [os-artifacts.home-assistant.io](https://os-artifacts.home-assistant.io/index.html) 上。它们由与正式版本相同的流水线构建和签名，因此你无需搭建构建环境即可试用最近合并的更改。[发布与构建](https://www.hasscn.top/contributors/os/operating-system/releases/#build-pipelines)解释了它们的制作方式。
