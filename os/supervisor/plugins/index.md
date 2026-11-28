# 插件

> Supervisor 在 Home Assistant Core 旁边运行的五个插件、每个插件的作用，以及它们的代码所在位置。

Source: https://www.hasscn.top/contributors/os/supervisor/plugins/

插件（plugin）是 Supervisor 为系统本身（而非为用户）运行的容器。它们提供 Core 和应用共享的服务，例如 DNS 和音频。用户不能安装或移除它们，Supervisor 会自动更新它们。

在 Supervisor 一侧，每个插件都是 [`supervisor/plugins/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/plugins) 中的一个类，基于 `PluginBase`。它负责安装、启动、更新和修复容器，并且有一个看门狗（watchdog）会在容器停止时重启它。每个插件的镜像为 `ghcr.io/home-assistant/<arch>-hassio-<plugin>`，版本与其他组件一样来自同一个版本文件。

| 插件 | 容器 | 仓库 | 是什么 |
| --- | --- | --- | --- |
| DNS | `hassio_dns` | [plugin-dns](https://github.com/home-assistant/plugin-dns) | CoreDNS，用于容器内的名称解析 |
| Audio | `hassio_audio` | [plugin-audio](https://github.com/home-assistant/plugin-audio) | PulseAudio，用于声音的输入和输出 |
| CLI | `hassio_cli` | [plugin-cli](https://github.com/home-assistant/plugin-cli) | `ha` 命令行 |
| Multicast | `hassio_multicast` | [plugin-multicast](https://github.com/home-assistant/plugin-multicast) | 一个 mDNS 中继器 |
| Observer | `hassio_observer` | [plugin-observer](https://github.com/home-assistant/plugin-observer) | 一个在其他一切都失效时仍然可用的状态页面 |

## DNS

`hassio` 网络上的每个容器都使用 DNS 插件作为其名称服务器。它运行 [CoreDNS](https://coredns.io/)，并带有两个自己的插件：

- **mdns** 通过 D-Bus 询问主机上的 systemd-resolved 来解析 `.local` 名称。
- **fallback** 在启用回退时，通过 TLS 向 Cloudflare 的 DNS 重试失败的查询。

Supervisor 会写入一个包含容器名称的 hosts 文件，例如 `supervisor` 和 `homeassistant`，这样它们就可以通过名称相互访问。其他查询会发送到主机的 DNS 服务器，或用户通过 `ha dns options` 设置的服务器。配置模板位于插件仓库中的 `rootfs/usr/share/tempio/corefile`。

## Audio

音频插件在 ALSA 之上运行 PulseAudio，因此 Core 和需要音频的应用共享同一个声音系统。当应用的配置请求音频时，它们会获得访问权限。所有音频配置都保存在这个容器中，这让用户无需接触主机即可调整 PulseAudio。`ha audio` 可以显示设备并设置默认值。

## CLI

CLI 插件是 `ha` 命令行，由 [home-assistant/cli](https://github.com/home-assistant/cli) 仓库构建。在 Home Assistant OS 上，它是控制台上的登录 shell：当你登录时，主机运行它，参见[调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/#the-local-console)。插件仓库只负责打包 CLI。对命令本身的修改应提交到 cli 仓库。

## Multicast

多播插件在主机网络上运行 [mdns-repeater](https://github.com/pvizeli/mdns-repeater)。它在主机网络和 `hassio` 网络之间转发 mDNS 流量，使发现功能可以跨越该边界工作。可以通过 Supervisor API 将其关闭。

## Observer

观察器（observer）是一个用 Go 编写的小型 Web 服务器，运行在主机的 4357 端口上。它显示 Supervisor 是否正在运行且健康，以及它的日志。它特意与 Supervisor 分开运行：当 Supervisor 或 Core 宕机时，观察器是用户了解当前状况的方式。

## 开发插件

每个插件仓库都会构建一个容器镜像，主要基于一个 `Dockerfile` 和一个 `rootfs/` 文件夹，其中几个还有开发容器。大多数插件都有 `ha <plugin>` 命令来查看日志、重启或更新它们，例如 `ha dns logs` 或 `ha audio restart`。

要在设备上尝试你自己的构建，请为设备的架构构建镜像，并使用该插件当前运行的镜像名称和版本打标签（主机上的 `docker ps` 会显示它）。然后重启该插件。其方法与[在真实系统上测试 Supervisor](https://www.hasscn.top/contributors/os/supervisor/development/#test-on-a-real-system) 相同。请记住，Supervisor 会自动更新插件，当新版本发布时会替换你的构建。
