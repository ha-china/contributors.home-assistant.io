# S6 overlay

> Home Assistant 基础镜像中的 init 系统。它启动、监视并停止容器内应用的各个程序。

Source: https://www.hasscn.top/contributors/glossary/s6-overlay/

- In code: `/init`, `/etc/s6-overlay/s6-rc.d/`
- Also: s6-overlay, S6

Docker 在每个容器中只运行一个命令。[S6 overlay](https://github.com/just-containers/s6-overlay) 让应用（app）可以按正确的顺序运行多个命令：先执行设置步骤，然后运行各个程序，并在程序崩溃时自动重启。基础镜像将其 `/init` 设为入口点，因此应用只需添加自己的服务定义即可。参见[使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/)。

## Related terms

- [应用（App）](https://www.hasscn.top/contributors/glossary/app/): 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。
- [Bashio](https://www.hasscn.top/contributors/glossary/bashio/): 一个面向应用的 Bash 函数库，提供读取应用选项、日志记录以及与 Supervisor API 通信的辅助功能。
