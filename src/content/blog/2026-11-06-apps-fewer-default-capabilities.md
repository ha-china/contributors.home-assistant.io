---
title: "应用将失去四个默认的 Linux 能力"
description: Supervisor 正在为应用容器采用更小的默认能力集。本文概述了此变更、受影响的应用以及如何测试。
date: 2026-11-06
authors:
  - Stefan Agner
areas:
  - apps
---

如今，每个应用容器都会获得 Docker 的完整默认能力集，无论其清单（manifest）声明了什么。Supervisor 正在转向更小的能力集：`NET_RAW`、`MKNOD`、`AUDIT_WRITE` 和 `SETFCAP` 将不再被隐式授予。在 `privileged` 中列出的能力永远不会被丢弃。

如果您开发或维护一个应用，我们请求您：检查您的应用是否打开原始套接字或数据包套接字，或以其他方式依赖这些能力之一，如果是，请立即将其添加到 `privileged` 中。此变更已在 Supervisor 2026.09.3 中通过功能标志提供，因此您可以立即测试您的应用。Supervisor 2026.12 将为新安装启用新的默认值，之后将适用于所有安装。

## 原因

Docker 的默认能力集可以追溯到容器旨在运行任意软件并尽可能兼容的时代。其中几个默认值对于行为良好的服务来说从未需要，有些则带有实际风险。`NET_RAW` 是最突出的一个：它允许原始套接字和数据包套接字，被攻破的应用可以利用它干扰其网络上的流量。Kubernetes 的受限配置文件多年来已丢弃了这四个能力，containerd 正在添加一个[缩减能力配置文件](https://github.com/containerd/containerd/pull/12588)，该文件恰好移除了这四个能力。丢弃它们也使 `privileged` 能更准确地描述应用的额外权限。

## 变更内容

| 能力 | 允许的操作 | 谁需要它 |
| --- | --- | --- |
| `NET_RAW` | 原始套接字和数据包套接字（`SOCK_RAW`、`AF_PACKET`），绑定到任何地址 | 数据包捕获、端口扫描器、DHCP 服务器、ARP 工具和原始蓝牙 HCI |
| `MKNOD` | 使用 `mknod` 创建设备节点 | 应用中的任何内容都不需要：Supervisor 会绑定挂载应用声明的设备节点 |
| `AUDIT_WRITE` | 向内核审计日志写入记录 | 使用 libaudit 构建的 `sshd` 和 PAM |
| `SETFCAP` | 在可执行文件上设置文件能力 | 在安装后步骤中运行 `setcap` 的软件包安装 |

大多数应用不需要这些能力。如果您的应用没有执行“谁需要它”下列出的任何操作，则很可能无需更改：在核心和社区商店中大约 90 个应用中，少数需要 `NET_RAW`，没有应用需要其他三个能力。

Supervisor 会将这些能力添加到容器的 `CapDrop` 中，除非应用在 `privileged` 中列出它们。这适用于所有应用，包括具有 `full_access: true` 的应用：Supervisor 永远不会以 Docker 的特权模式运行应用，`full_access` 仅扩大设备访问权限。

## 如何立即测试您的应用

Supervisor 2026.09.3 及更新版本在默认关闭的两个功能标志后面包含了此变更：`app_drop_net_raw` 丢弃 `NET_RAW`，`app_reduced_capabilities` 丢弃其他三个能力。使用 `ha` CLI（5.1.0 或更新版本）同时启用两者：

```shell
ha supervisor options \
  --feature-flag app_drop_net_raw=true \
  --feature-flag app_reduced_capabilities=true
```

能力在容器创建时固定。重启您要测试的应用，这会重新创建其容器，然后测试其网络功能并查看应用日志中是否有来自打开套接字的工具或库的 `Operation not permitted` 错误。此类错误是起点，而非证据：在将其添加到清单之前，请确认该操作需要哪种能力。在容器内部，`grep CapBnd /proc/self/status` 显示您自己进程的边界集：在启用两个标志且未请求任何内容的情况下，它是 `00000000000405fb`，低于 Docker 默认值 `00000000a80425fb`。要恢复，请将标志设置为 `false` 并重启应用。`ha supervisor info` 显示所有标志的当前状态。

## 该怎么做

如果测试显示您的应用打开原始套接字或数据包套接字，请将 `NET_RAW` 添加到 `privileged`：

```yaml
privileged:
  - NET_RAW
```

`AUDIT_WRITE`、`MKNOD` 和 `SETFCAP` 也是如此；[配置参考](/apps/reference/configuration/)列出了所有可接受的值。仅为实际失败的操作请求能力，而不是为仅记录警告的操作（例如软件包安装期间失败的 `setcap`）请求能力。

## Ping 仍然有效

关于丢弃 `NET_RAW` 最常见的担忧是 `ping`，因为 ICMP 回显传统上需要原始套接字。它不会中断，您也无需测试。Linux 自内核 3.0 起就支持 ICMP 数据报套接字（IPv6 自 3.11 起），只要进程的组在 `net.ipv4.ping_group_range` sysctl 范围内，这些套接字无需 `NET_RAW` 即可工作。该 sysctl 是每个网络命名空间独立的，并且已在所有受支持的安装上允许所有组：

- 对于具有自己网络命名空间的应用，Docker 守护进程在创建容器时将其设置为 `0 2147483647`（[自 Docker 20.10 起](https://github.com/moby/moby/pull/41030)，与能力集无关）。
- 对于具有 `host_network: true` 的应用，适用主机的值。systemd 通过其 `50-default.conf` sysctl drop-in 默认设置相同的值，Home Assistant OS 随附了该文件：

  ```shell
  $ cat /proc/sys/net/ipv4/ping_group_range
  0       2147483647
  ```

我们验证了 Alpine 基础镜像上的 busybox `ping` 和 Debian 基础镜像上的 `iputils-ping` 在丢弃 `NET_RAW` 的情况下均适用于 IPv4 和 IPv6。这涵盖了 Uptime Kuma 的 ping 监视器、Node-RED 的 ping 节点以及任何其他调用 `ping` 的内容。自带 ICMP 实现（在库中或自己的代码中）的应用需要测试：有些使用数据报套接字，有些需要原始套接字。

使用原始套接字或数据包套接字的工具可能会中断，包括 `nmap`（以 root 身份运行时假定原始套接字，除非使用 `--unprivileged` 运行，否则会退出）、`tcpdump`、`mtr`、`arping`、`fping`、ICMP 模式下的 `traceroute` 以及 DHCP 服务器。另一个陷阱：二进制文件上的文件能力（如 `cap_net_raw+ep`）无法授予容器边界集中缺失的内容，并且如果设置了有效位，内核会完全拒绝执行该二进制文件。一些上游镜像对 `ping` 执行此操作。使用 `getcap -r /` 检查您的镜像并移除此类文件能力，或请求该能力。

## 我们在现有应用中发现的

在添加标志之前，我们检查了核心和社区应用商店。需要 `NET_RAW` 的应用要么已经声明了它，要么正在更新以声明它：核心商店中的 OpenThread Border Router 和 Matter Server（通过原始 HCI 套接字进行蓝牙调试），以及社区商店中的 AdGuard Home（其 DHCP 服务器使用数据包套接字）、Tailscale、Advanced SSH & Web Terminal 和 Studio Code Server（网络工具如 `nmap`）。WireGuard 和 ZeroTier 等 VPN 应用只需要 `NET_ADMIN` 和 `/dev/net/tun` 设备，并且在丢弃所有四个能力的情况下也能正常工作。

其他三个能力目前在应用中没有使用者。没有应用脚本调用 `mknod`，没有应用运行使用 libaudit 构建的 `sshd`，`setcap` 仅出现在运行时安装的软件包（如 `fping` 或 `mtr-tiny`）的安装后步骤中。`apt` 和 `apk` 在这种情况下都会记录警告并完成安装。这可能会出现在具有用户可配置软件包列表的应用中，例如 Advanced SSH & Web Terminal、Studio Code Server、JupyterLab 和 AppDaemon。

## 找出应用实际使用哪些能力

使用标志进行测试可以显示哪些功能会中断。如果您的应用附带 `apparmor.txt`，AppArmor 也可以报告应用在中断之前使用了哪些能力。请在两个标志都关闭的情况下执行此操作，因为丢弃的能力会在 AppArmor 看到之前失败。向配置文件添加审计规则：

```text
audit capability net_raw,
audit capability mknod,
audit capability audit_write,
audit capability setfcap,
```

Supervisor 在应用安装或更新时加载配置文件，因此请提升版本并更新应用，或重新安装。每次通过的能力检查都会记录到主机日志中（`ha host logs`，或主机上的 `journalctl -k`）：

```text
audit: type=1400 audit(...): apparmor="AUDIT" operation="capable"
  profile="my_app" pid=1234 comm="tcpdump" capability=13 capname="net_raw"
```

在阅读结果时请考虑进程名称。尝试原始套接字并回退的工具（如 `ping`）会显示为使用 `NET_RAW`，即使它们无需它也能工作。反之亦然：内核会跳过某些检查的审计并限制消息速率，因此缺少一行并不能证明能力未被使用。

## 推出计划

1. Supervisor 2026.09.3 添加了两个功能标志，默认关闭（[home-assistant/supervisor#7230](https://github.com/home-assistant/supervisor/pull/7230) 和 [home-assistant/supervisor#7233](https://github.com/home-assistant/supervisor/pull/7233)）。`NET_RAW` 有自己的标志，因为它具有自身的安全影响和已知的应用影响。同一版本使 `AUDIT_WRITE`、`MKNOD` 和 `SETFCAP` 成为 `privileged` 中可接受的值。
2. Supervisor 2026.12 默认为新安装启用两个标志（[home-assistant/supervisor#7402](https://github.com/home-assistant/supervisor/pull/7402)）。现有安装除非设置标志，否则保持当前行为。恢复备份不会携带功能标志，因此恢复到新安装的应用将使用新的默认值运行。
3. 最迟在 Supervisor 2027.05，缩减的能力集将成为所有安装的默认值。我们可能会提前此步骤；如果是这样，将在 Supervisor 发布说明中宣布。标志在切换后仍会保留一段时间，以便通过重新启用旧行为来确认应用中的回归，并将在后续版本中移除。

如果您遇到问题或对此变更有所顾虑，请在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 中告知我们，或在 [Supervisor 仓库](https://github.com/home-assistant/supervisor/issues) 中打开问题。
