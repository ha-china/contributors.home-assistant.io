# Bashio

> 一个面向应用的 Bash 函数库，提供读取应用选项、日志记录以及与 Supervisor API 通信的辅助功能。

Source: https://www.hasscn.top/contributors/glossary/bashio/

- In code: `bashio::`, `hassio-addons/bashio`

Bashio 打包了大多数应用所需的功能，避免每个应用都重复编写，例如用 `bashio::config` 读取选项。它是官方 Home Assistant 基础镜像和 Home Assistant Community Apps 基础镜像的一部分，代码位于 [hassio-addons/bashio](https://github.com/hassio-addons/bashio) 仓库中。参见 [Bashio 参考](https://www.hasscn.top/contributors/apps/bashio/)。

## Related terms

- [应用（App）](https://www.hasscn.top/contributors/glossary/app/): 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。
- [Supervisor API](https://www.hasscn.top/contributors/glossary/supervisor-api/): Supervisor 的 REST API，Home Assistant Core、命令行和应用使用它来管理系统、应用、备份和更新。
- [S6 overlay](https://www.hasscn.top/contributors/glossary/s6-overlay/): Home Assistant 基础镜像中的 init 系统。它启动、监视并停止容器内应用的各个程序。
