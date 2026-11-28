# Supervisor 架构

> Supervisor 代码是如何组织的、它如何启动，以及更新和备份在其中的工作方式。

Source: https://www.hasscn.top/contributors/os/supervisor/architecture/

Supervisor 是一个基于 asyncio 和 aiohttp 构建的异步 Python 进程。它通过 API 与 Docker 通信，通过 D-Bus 与主机通信，并通过 HTTP 与其他一切通信。本页是代码的导览图，让你知道该去哪里找。

## CoreSys：一个可以访问一切的对象

Supervisor 中的每个管理器都挂在一个对象上，即 [`supervisor/coresys.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/coresys.py) 中的 `CoreSys`。需要它的类继承自 `CoreSysAttributes`，并通过 `sys_*` 属性访问其他部分：

```python
from ..coresys import CoreSys, CoreSysAttributes


class Example(CoreSysAttributes):
    """Do something with the system."""

    def __init__(self, coresys: CoreSys) -> None:
        """Initialize the example."""
        self.coresys = coresys

    async def check(self) -> bool:
        """Check if Core needs an update."""
        return self.sys_homeassistant.need_update
```

你最常用到的一些管理器：

| 属性 | 管理的内容 | 代码 |
| --- | --- | --- |
| `sys_homeassistant` | Home Assistant Core | [`supervisor/homeassistant/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/homeassistant) |
| `sys_apps` | 已安装的应用 | [`supervisor/apps/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/apps) |
| `sys_store` | 应用仓库 | [`supervisor/store/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/store) |
| `sys_backups` | 备份与恢复 | [`supervisor/backups/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/backups) |
| `sys_plugins` | 插件 | [`supervisor/plugins/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/plugins) |
| `sys_os` | Home Assistant OS、其更新和数据磁盘 | [`supervisor/os/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/os) |
| `sys_host` | 主机的网络、服务、日志和硬件信息 | [`supervisor/host/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/host) |
| `sys_dbus` | systemd、NetworkManager、RAUC、OS Agent 的 D-Bus 客户端 | [`supervisor/dbus/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/dbus) |
| `sys_docker` | Docker 容器、镜像和 `hassio` 网络 | [`supervisor/docker/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/docker) |
| `sys_updater` | 可用版本 | [`supervisor/updater.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/updater.py) |
| `sys_jobs` | 正在运行的任务 | [`supervisor/jobs/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/jobs) |
| `sys_resolution` | 问题、建议和系统健康状况 | [`supervisor/resolution/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/resolution) |
| `sys_api` | REST API | [`supervisor/api/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/api) |

请使用这些管理器，而不是直接调用 Docker 或 D-Bus 库。所有 I/O 都是异步的：阻塞调用请使用 `self.sys_run_in_executor()` 运行。

## 启动过程

Supervisor 会在多个状态之间流转，这些状态在 [`supervisor/const.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/const.py) 中定义为 `CoreState`：

1. **initialize**：创建 `CoreSys` 和每个管理器。
2. **setup**：加载配置，连接 D-Bus 和 Docker，并评估系统。
3. **startup**：如果有更新的版本且开启了自动更新，则更新自身；启动插件，然后按启动阶段依次启动 Core 和应用。
4. **running**：一切已就绪。定时任务和健康检查开始运行。
5. **freeze**、**shutdown**、**stopping**、**close**：在冻结系统的备份期间，以及关闭过程中。

许多检查和任务只在特定状态下运行。这就是为什么存在像 `running` 这样的任务条件。

在启动期间，Supervisor 还会将已启动的 OS 槽位标记为良好。在此之前，引导加载程序会认为 OS 更新尚未确认。参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/)。

## 定时任务

[`supervisor/misc/tasks.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/misc/tasks.py) 注册了周期性工作：检查应用和插件的更新、重新加载应用商店和备份，以及在 Core、应用或观察者停止响应时重启它们的看门狗。问题解决中心会添加其每小时的健康检查。参见[问题解决中心](https://www.hasscn.top/contributors/os/supervisor/resolution-center/)。

## 更新

Supervisor 从 `version.home-assistant.io/<channel>.json` 读取可用版本，该文件在 [home-assistant/version](https://github.com/home-assistant/version) 仓库中维护。频道（channel）为 `stable`、`beta` 或 `dev`，用户可以通过 `ha supervisor options --channel` 更改它。

- **Supervisor** 默认自动更新自身。当其运行的版本低于最新版本时，它会拉取新镜像并重启。
- **插件**自动更新。
- **Home Assistant Core**、**应用**和 **Home Assistant OS** 在用户请求时更新，或者在用户为某个应用开启了自动更新时更新。

Core 更新可以先进行部分备份。更新之后，Supervisor 会检查 Core 是否启动。如果没有启动，Supervisor 会回滚到之前的版本，将启动失败的日志写入配置文件夹中的 `home-assistant-rollback.log`，并抛出 `update_rollback` 问题。

## 备份

备份是一个未压缩的 tar 文件，其中包含描述它的 `backup.json`，以及每个部分一个内部归档：Home Assistant Core 及其配置、每个应用、每个文件夹（`share`、`ssl`、`media` 和本地应用），以及 Supervisor 自身的配置。如果设置了密码，内部归档会使用 [SecureTar](https://github.com/home-assistant-libs/securetar) 加密。

完整备份包含所有部分，部分备份则只包含所选的部分。备份默认存储在数据分区的 `/backup` 中，也可以存储到网络存储挂载点。Home Assistant Core 的 `backup` 集成构建在此之上，负责将备份上传到其他地方。

应用可以声明它们希望如何被备份：停止后备份，或运行中备份，并可使用前置和后置命令。在备份运行期间，Supervisor 可以冻结 Core，使其数据库处于一致状态。

## API

[`supervisor/api/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/api) 中每个区域一个模块，例如 `backups.py` 或 `network.py`。路由在 [`supervisor/api/__init__.py`](https://github.com/home-assistant/supervisor/blob/main/supervisor/api/__init__.py) 中注册。处理器使用 `@api_process` 装饰器，它将 Supervisor 错误转换为规范的错误响应，并使用 `api_validate()` 验证输入。[`supervisor/api/middleware/`](https://github.com/home-assistant/supervisor/tree/main/supervisor/api/middleware) 中的中间件会检查每个调用者的令牌和角色。每个端点及其请求负载和响应都记录在 [Supervisor API](https://www.hasscn.top/contributors/apps/supervisor-api/) 参考文档中。

当你修改 API 时，[ha CLI](https://github.com/home-assistant/cli) 和 [Python 客户端库](https://github.com/home-assistant-libs/python-supervisor-client) 通常也需要相应的修改。Supervisor 的拉取请求模板会同时询问这两者。
