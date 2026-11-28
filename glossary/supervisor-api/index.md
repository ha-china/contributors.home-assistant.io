# Supervisor API

> Supervisor 的 REST API，Home Assistant Core、命令行和应用使用它来管理系统、应用、备份和更新。

Source: https://www.hasscn.top/contributors/glossary/supervisor-api/

- In code: `http://supervisor/`, `SUPERVISOR_TOKEN`, `hassio_api`

在应用（app）内部，该 API 位于 `http://supervisor/`，Supervisor 会在 `SUPERVISOR_TOKEN` 环境变量中为每个应用分配自己的令牌。应用可以调用哪些内容取决于它在配置中请求的权限，例如 `hassio_api: true`。

许多路径仍然使用应用的旧名称，例如 `/addons`。请参阅 [Supervisor API 参考](https://www.hasscn.top/contributors/apps/supervisor-api/)。

## Related terms

- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
- [应用（App）](https://www.hasscn.top/contributors/glossary/app/): 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。
- [Bashio](https://www.hasscn.top/contributors/glossary/bashio/): 一个面向应用的 Bash 函数库，提供读取应用选项、日志记录以及与 Supervisor API 通信的辅助功能。
