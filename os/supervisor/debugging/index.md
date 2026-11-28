# 调试 Supervisor

> 将 Python 调试器附加到本地或远程设备上正在运行的 Supervisor，并查找其日志。

Source: https://www.hasscn.top/contributors/os/supervisor/debugging/

Supervisor 内置了 [debugpy](https://github.com/microsoft/debugpy)，因此你可以将 Visual Studio Code 调试器附加到它上面，设置断点并单步调试代码。这在开发容器和真实设备上都适用。

## 开启调试模式

调试器只有在调试模式开启时才会启动。调试模式在启动时读取，因此修改后需要重启 Supervisor：

```shell
ha supervisor options --debug=true
ha supervisor restart
```

请完整写出 `=true`。CLI 会将单独的 `--debug` 读取为 `false`，因此这样会关闭调试模式。

现在 Supervisor 会在端口 33333 上监听调试器。要调试启动过程中发生的事情，请同时添加 `--debug-block=true`。这样 Supervisor 会等待调试器附加后才继续运行。

使用 `ha supervisor options --debug=false` 可以再次关闭调试模式。

## 附加调试器

仓库中为此提供了一个启动配置 **Supervisor remote debug**，位于 [`.vscode/launch.json`](https://github.com/home-assistant/supervisor/blob/main/.vscode/launch.json)：

```json
{
  "name": "Supervisor remote debug",
  "type": "python",
  "request": "attach",
  "port": 33333,
  "host": "172.30.32.2",
  "pathMappings": [
    {
      "localRoot": "${workspaceFolder}",
      "remoteRoot": "/usr/src/supervisor"
    }
  ]
}
```

`172.30.32.2` 是 Supervisor 在 `hassio` 网络上的地址，在开发容器内部可以访问。在 **Run and Debug** 视图中选择该配置并启动。

## 调试远程设备

在设备上，你的计算机无法直接访问 `hassio` 网络。**Remote ptvsd debugger** 应用会将主机的端口 33333 转发到 Supervisor：

1. 将[开发应用仓库](https://github.com/home-assistant/apps-development)添加到设备的应用商店中。
2. 安装并启动 **Remote ptvsd debugger** 应用。
3. 按上文所述开启调试模式。
4. 在你的启动配置中，将 `host` 设置为设备的 IP 地址。

请确保你工作区中的代码与设备上的版本一致。否则，断点会落在错误的行上。

## 日志

可以通过以下任一方式查看 Supervisor 的日志：

```shell
# From the Home Assistant CLI
ha supervisor logs

# From the host shell
docker logs -f hassio_supervisor
```

如需更详细的信息，可以使用 `ha supervisor options --logging debug` 提高日志级别。

如果 Supervisor 完全无法启动，请查看启动它的服务：在主机 shell 中运行 `journalctl -u haos-supervisor`。[调试主机](https://www.hasscn.top/contributors/os/operating-system/debugging/)介绍了如何进入主机 shell。当 Supervisor 宕机时，端口 4357 上的观察者（observer）仍会显示其状态和日志。
