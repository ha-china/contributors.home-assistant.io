# 将 Core 连接到 Supervisor

> 在你的开发环境中运行 Home Assistant Core，连接真实的 Supervisor，以便开发 hassio 集成。

Source: https://www.hasscn.top/contributors/os/supervisor/core-connection/

Home Assistant Core 通过 `hassio` 集成（位于 [`homeassistant/components/hassio/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/hassio)）与 Supervisor 通信。要开发该集成，你需要让开发环境中的 Core 连接到一个真实的 Supervisor。[Core 开发环境](https://www.hasscn.top/contributors/core/development/environment/)已经提供了前一半，本页面将添加 Supervisor。

## 获取 Supervisor API 的访问权限

Supervisor API 需要一个令牌（token）。**Remote API proxy** 应用可以提供一个，并使该 API 可以从设备外部访问：

1. 将[开发应用仓库](https://github.com/home-assistant/apps-development)添加到运行 Supervisor 的设备的应用商店中。该设备可以是测试设备，也可以是 [Supervisor 开发容器](https://www.hasscn.top/contributors/os/supervisor/development/)。
2. 安装 **Remote API proxy** 应用，并选择 **Start**。
3. 令牌会显示在该应用的日志中。

在你工作期间，该应用需要保持运行。它监听主机的 8880 端口。

代理令牌的权限比 Core 在生产环境中获得的令牌略少。如果你需要真正的令牌，可以在主机 shell 中获取，参见[调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/)：

```shell
docker inspect homeassistant | grep SUPERVISOR_TOKEN
```

两种令牌在重启或更新后都可能发生变化。

## 让 Core 连接它启动

`hassio` 集成通过两个环境变量找到 Supervisor。在启动 Core 时设置它们：

```shell
SUPERVISOR=192.168.1.100:8880 SUPERVISOR_TOKEN=abcdefgh1234 hass
```

- `SUPERVISOR` 是设备的地址，加上代理应用的端口。
- `SUPERVISOR_TOKEN` 是来自应用日志的令牌。

你的 Core 现在会加载 `hassio` 集成，并显示该设备的应用、备份和系统设置。

## 前端

前端通过 Core 访问 Supervisor，Core 会为管理员用户代理 Supervisor API。因此，以这种方式连接的 Core，指向它的[前端开发环境](https://www.hasscn.top/contributors/frontend/)也可以与 Supervisor 一起使用。
