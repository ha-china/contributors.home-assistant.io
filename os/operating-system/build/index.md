# 构建镜像

> 设置构建容器并为开发板构建 Home Assistant OS。

Source: https://www.hasscn.top/contributors/os/operating-system/build/

Home Assistant OS 在一个基于 Debian 的容器中构建，该容器包含 Buildroot 所需的所有工具。你无需在自己的机器上安装 Buildroot 的依赖，而且每位贡献者都在相同的环境中构建。

刚接触嵌入式 Linux 和 Buildroot？[Bootlin](https://bootlin.com/docs/) 的免费培训资料是一个很好的起点。[Buildroot 手册](https://buildroot.org/downloads/manual/manual.html) 则是你需要经常查阅的参考文档。

## 你需要什么

- 一台装有 Docker 的 Linux 机器，并且有运行特权容器的权限。无根（rootless）Docker 无法工作：构建过程会在容器内的 loop 设备上挂载一个文件系统镜像。
- 一个拥有 `sudo` 权限的普通用户账户。构建脚本拒绝以 root 身份运行，但某些步骤需要提升的权限。
- 磁盘空间和时间。首次构建会下载并编译所有内容，需要一小时或更长时间，具体取决于你的机器。

## 获取源码

该仓库通过 Git 子模块（submodule）引入 Buildroot。克隆时请包含子模块：

```shell
git clone https://github.com/home-assistant/operating-system.git
cd operating-system
git submodule update --init
```

拉取新更改时，也要更新子模块。Buildroot 会定期更新，版本不匹配会导致令人困惑的构建错误：

```shell
git pull
git submodule update
```

要丢弃所有本地更改并恢复到干净状态：

```shell
git reset --hard
git submodule update --init --force
```

## 为开发板构建

每个构建目标在 [`buildroot-external/configs/`](https://github.com/home-assistant/operating-system/tree/dev/buildroot-external/configs) 中都有一个配置文件，命名为 `<target>_defconfig`。将目标名称传给 `make`，不带 `_defconfig` 部分。[`scripts/enter.sh`](https://github.com/home-assistant/operating-system/blob/dev/scripts/enter.sh) 会构建构建容器并在其中运行命令：

```shell
scripts/enter.sh make rpi4_64
```

`make help` 列出了所有目标。[支持的开发板](https://www.hasscn.top/contributors/os/operating-system/boards/) 说明了哪个目标对应哪块开发板。

构建输出位于 `output/`。完成的镜像在 `output/images/` 中，以开发板和版本命名，例如 `haos_rpi4-64-18.4.dev0.img.xz`。磁盘镜像旁边还有一个 RAUC 更新包（`.raucb`），可用于更新现有安装。参见[测试你的构建](https://www.hasscn.top/contributors/os/operating-system/test/)。

下载文件和编译器缓存保存在仓库之外的 `~/hassos-cache` 中。可以设置 `CACHE_DIR` 将它们放到其他位置。得益于缓存，后续构建会快得多。

## 构建多个目标

一个输出文件夹只保存一个目标。要从同一份代码检出（checkout）构建多块开发板，请使用 `O=` 为每个目标指定各自的输出文件夹：

```shell
scripts/enter.sh make O=output_rpi4_64 rpi4_64
scripts/enter.sh make O=output_ova ova
```

如果将一个输出文件夹复用于不同的目标，构建会发出警告并等待十秒。在这种情况下，请先运行 `make distclean`。

## 重新构建软件包

Buildroot 从源码构建软件包，并记住已构建的内容。第二次构建只会重新生成有变化的部分以及最终镜像。要强制重新构建某个软件包，请删除其构建文件夹：

```shell
rm -rf output/build/linux-custom/
```

不确定镜像中的某个文件来自哪个软件包？`output/build/packages-file-list.txt` 将每个文件映射到其所属的软件包。

## 在构建容器内工作

不带参数运行 [`scripts/enter.sh`](https://github.com/home-assistant/operating-system/blob/dev/scripts/enter.sh) 会在构建容器中打开一个 shell。从那里你可以运行相同的构建，以及其他 Buildroot 目标：

```shell
scripts/enter.sh
make O=output_rpi4_64 rpi4_64
```

仓库的 `Makefile` 不认识的目标会被传递给 Buildroot。例如，以交互方式更改某个目标的配置，然后绘制软件包之间的依赖关系图：

```shell
make O=output_rpi4_64 menuconfig
make O=output_rpi4_64 graph-depends
```

运行 `make buildroot-help` 可查看 Buildroot 提供的所有功能。

## 签名

每次构建都会为其更新包签名。首次构建时，会创建一个自签名证书和密钥，作为 `cert.pem` 和 `key.pem` 保存在仓库根目录下，并添加到镜像的密钥环中。之后的每次构建都使用同一对证书和密钥。这样，你自己构建的镜像就能接受来自你后续构建的更新包。详情见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/#security)。

如果你想继续更新运行你构建的镜像的设备，请保留这对证书和密钥。删除它意味着会生成新的证书，而持有旧证书的设备将拒绝你的新更新包。
