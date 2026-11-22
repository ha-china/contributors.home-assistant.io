---
title: "多播插件即将弃用"
description: Supervisor 正在逐步淘汰多播插件。本文概述了这一变更、受影响的应用程序以及如何进行测试。
date: 2026-11-17
authors:
  - Stefan Agner
areas:
  - apps
---

每个 Supervisor 安装都会运行一个多播插件：一个名为 `hassio_multicast` 的容器，它将局域网（LAN）上接收到的 IPv4 mDNS 数据包复制到内部 `hassio` 网络，应用程序（以前称为附加组件）连接在该网络上。Supervisor 正在逐步淘汰它。Supervisor 2026.10.0 添加了禁用它的选项，Supervisor 2026.12 不再在新安装中安装它，后续版本将移除它。

解析 `.local` 主机名不受影响。内部网络上的应用程序通过 DNS 插件解析名称，其中 CoreDNS 将 `.local` 查询转发到主机上的 systemd-resolved，后者执行 mDNS 查找。这通过常规 DNS 工作，无论是否使用多播插件。

如果您开发或维护应用程序，我们请求您：如果您的应用程序在内部网络上运行且未设置 `host_network: true`，并自行监听 mDNS 流量（例如浏览服务或发现设备），请在禁用插件的情况下进行测试。使用 `host_network: true` 的应用程序以及仅解析主机名的应用程序无需更改。

## 如何今天测试您的应用程序

Supervisor 2026.10.0 及更新版本为插件提供了 `enabled` 选项，默认开启。使用 `ha` CLI 将其关闭：

```shell
ha multicast options --enabled=false
```

禁用会停止并移除容器及其镜像。插件不再启动、更新或修复，`ha multicast info` 报告 `enabled: false`。然后测试您应用程序的发现功能。要恢复：

```shell
ha multicast options --enabled
```

启用会拉取当前插件镜像并重新启动容器。

相同的选项也可通过 Supervisor API 使用，即 `POST /multicast/options` 配合 `{"enabled": false}`，而 `GET /multicast/info` 包含 `enabled` 字段。

## 该做什么

如果您的应用程序仅解析 `.local` 主机名，则无需更改。

如果您的应用程序通过 mDNS、SSDP 或其他多播协议发现设备，或在局域网（LAN）上通告服务，则它必须位于物理网络上。在应用程序配置中设置 `host_network: true`：

```yaml
host_network: true
```

如果测试表明您的应用程序依赖该插件，且 `host_network: true` 不可行，请在[架构讨论](https://github.com/home-assistant/architecture/discussions/1457)中告知我们。

## 背景

该插件于 2020 年引入，作为内部网络多播的通用解决方案。它在主机接口和 `hassio` 桥接之间运行 `mdns-repeater`，以 mDNS 反射为第一步，其他多播协议作为预期的更广泛范围。

随着时间的推移，范围被缩小。双向重复可能与路由器上的 mDNS 中继器形成循环，并且它会重新广播携带内部地址的通告，这些地址无法从局域网（LAN）访问。因此，自 2022 年 2 月起，该插件是单向的：主机上接收到的 IPv4 mDNS 被复制到 `hassio` 桥接，而来自应用程序的数据包不会重复到局域网（LAN）。IPv6、SSDP 和其他多播流量不受处理。通过多播路由覆盖诸如 Homematic IP 等协议被证明是不可能的，因为 Linux 内核不会路由链路本地多播。这些协议需要应用程序存在于物理网络上，这正是 `host_network: true` 所提供的。

剩余的局域网（LAN）到桥接复制有一个副作用：在主机网络上监听所有接口的应用程序会收到每个局域网（LAN）mDNS 帧两次，一次在物理接口上，一次在 `hassio` 上。大多数软件可以无问题地处理这种情况，但对于那些无法处理的设置，在 Supervisor 2026.10.0 之前没有受支持的方式来关闭该插件。

### 谁在使用它

系统组件中没有通过该插件获取 mDNS。Home Assistant Core 在主机网络上运行，使用自己的 zeroconf 实现。名称解析通过上述 DNS 插件进行，而 `homeassistant.local` 在局域网（LAN）上的通告由 systemd-resolved 完成。

我们查看的应用程序也是如此。根据自愿参与的分析，前 30 名中具有 mDNS 或多播角色的每个应用程序，例如 Matter Server、ESPHome Device Builder、Samba、OpenThread Border Router、Spotify Connect 和 AirCast，都使用 `host_network: true` 运行，不经过该插件。对约 1,300 个社区应用程序仓库的扫描发现了一个围绕该插件设计的方案，即一个 CUPS 应用程序从桥接向局域网（LAN）通告 AirPrint。这依赖于自 2022 年以来不再重复的方向。

插件使用情况无法直接测量，因为复制数据包不会在分析中留下痕迹。因此，下面的推出是分阶段的：如果某个应用程序或设置依赖于局域网（LAN）到桥接的 mDNS 反射，第一步旨在在插件仍可重新启用时将其暴露出来。

## 展望未来

`host_network: true` 使应用程序可以访问所有主机接口和端口，这比大多数具有发现角色的应用程序所需的更多。两项提案旨在以更有针对性的方式提供多播插件最初旨在覆盖的功能。两者都不是此弃用的先决条件。

- 隔离的物理网络访问（[architecture#1034](https://github.com/home-assistant/architecture/discussions/1034)、[home-assistant/supervisor#6937](https://github.com/home-assistant/supervisor/pull/6937)）为应用程序提供其在局域网（LAN）上的地址，支持双向多播（包括 IPv6），而无需共享主机的网络命名空间。应用程序仍连接到内部 `hassio` 网络。这涵盖了通过 mDNS、SSDP 和其他多播协议进行的设备发现。
- 用于服务通告的 Supervisor API（[architecture#1458](https://github.com/home-assistant/architecture/discussions/1458)）通过 systemd-resolved 的 DNS-SD 注册发布应用程序的服务。内部网络上的应用程序随后可以在局域网（LAN）上被发现，而无需 `host_network` 或 `host_dbus`。

## 推出计划

1. Supervisor 2026.10.0 添加了 `enabled` 选项，默认开启（[home-assistant/supervisor#7219](https://github.com/home-assistant/supervisor/pull/7219)）。`ha` 5.6.0 添加了 `ha multicast options`（[home-assistant/cli#686](https://github.com/home-assistant/cli/pull/686)）。
2. Supervisor 2026.12 不再在新安装中安装该插件。现有安装保持其当前状态。
3. Supervisor 2027.02 在所有安装上禁用该插件。该选项仍然可用，因此如果某个设置被证明依赖它，可以重新启用该插件。
4. 后续版本将移除该插件：代码、`ha multicast` 命令、前端中的日志查看器条目以及 Home Assistant OS 构建中的镜像。

如果您遇到问题或对此变更有所顾虑，请在[架构讨论](https://github.com/home-assistant/architecture/discussions/1457)中告知我们，或在[Supervisor 仓库](https://github.com/home-assistant/supervisor/issues)中打开一个问题。
