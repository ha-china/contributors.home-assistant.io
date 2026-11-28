# 运行前端

> 将开发中的前端连接到开发版 Home Assistant，或连接到你已有的 Home Assistant。

Source: https://www.hasscn.top/contributors/frontend/development/run/

前端需要一个 Home Assistant Core 来与之通信。有两种连接方式：

- **Core 提供你的前端。** 你运行一个开发版 Core，并告诉它使用你的[前端仓库](https://github.com/home-assistant/frontend)而不是内置的前端。这与生产环境的工作方式相同，因此一切功能都正常，包括登录页面和引导流程。
- **你的前端连接到一个 Core。** 你自己提供前端服务，并将其指向任何 Home Assistant，甚至是正在为你家中服务的那一台。设置快速，且不会影响那个 Home Assistant。缺点是：某些部分（如登录页面）始终来自你所连接的 Core。

> [!CAUTION]
> 切勿在生产环境中使用开发模式。Home Assistant 会积极缓存前端以使其在移动设备上运行更快。开发模式会关闭该缓存，这样你就无需在每次更改之间重启。

## Core 提供你的前端

开发服务器会将前端构建到仓库的 `hass_frontend` 文件夹中，并在你保存时重新构建。当 `frontend` 集成的 `development_repo` 选项指向你的仓库时，Core 就会提供它。

### 在前端 devcontainer 中

devcontainer 可以为你运行 Core：

1. 在终端中运行 `script/core`。第一次运行时，它会安装 Core 的 `dev` 分支，并创建一个已设置 `development_repo` 的 `config` 文件夹，以及用于提供一些可操作实体的 `demo` 集成。使用 `script/core -r <ref>` 安装其他分支或标签，或使用 `script/core -s` 跳过安装。
2. 在第二个终端中，启动开发服务器：

   ```shell
   pnpm dev
   ```

3. 当日志显示 `Build done` 时，打开 `http://localhost:8124`。

### 使用你自己的 Core 开发环境

如果你已经在开发 Core，请将其配置指向你的前端克隆。在你开发版 Core 的 `configuration.yaml` 中：

```yaml
frontend:
  development_repo: /path/to/frontend
```

如果路径错误或无法访问，前端将无法加载。然后启动 Core，在前端仓库中运行 `pnpm dev`，并像往常一样在 8123 端口打开 Home Assistant。

当你使用 Core devcontainer 时，前端仓库必须在该容器内可见。在 [Core 仓库](https://github.com/home-assistant/core)的 [`.devcontainer/devcontainer.json`](https://github.com/home-assistant/frontend/blob/dev/.devcontainer/devcontainer.json) 中添加以下内容来挂载它，然后使用 **Dev Containers: Rebuild Container** 重建容器：

```json
"mounts": [
  "source=/path/to/frontend,target=/workspaces/frontend,type=bind"
]
```

然后在 `development_repo` 中使用容器内的路径 `/workspaces/frontend`。

> [!WARNING]
> 不要将 `mounts` 的更改提交到 Core：其中包含你机器上的路径。该设置仅在容器构建时读取，因此重建完成后你可以撤销它。

[Core 开发环境](https://www.hasscn.top/contributors/core/development/environment/)介绍了如何设置 Core 本身。

## 你的前端连接到一个 Core

`pnpm dev:serve` 会构建前端并在 8124 端口提供服务，连接到 `http://localhost:8123` 上的 Core：

```shell
pnpm dev:serve
```

要连接到另一个 Home Assistant，请使用 `-c` 传入其 URL。它不必是开发版本：

```shell
pnpm dev:serve -c http://homeassistant.local:8123
```

该 Home Assistant 必须接受来自你开发前端的请求。将其地址添加到你所连接的 Home Assistant 的 `configuration.yaml` 的 `http` 部分中，然后重启它：

```yaml
http:
  cors_allowed_origins:
    - http://localhost:8124
```

一些需要了解的事项：

- 使用 `-p` 在其他端口上提供服务，例如 `pnpm dev:serve -p 8654`。此时应将该地址添加到 `cors_allowed_origins` 中。
- 在 devcontainer 内，前端在容器的 8123 端口上提供服务，该端口对应你计算机上的 8124 端口。你通过 `-c` 传入的 URL 是由你的浏览器打开的，而不是由容器打开，因此 `localhost` 指的是你的计算机。
- 前端会记住你登录的是哪个 Home Assistant。当你更改 `-c` 时，请先登出，否则它会继续使用旧的那个。

## 在后台保持服务器运行

所有开发服务器都接受相同的标志，用于在无需保持终端打开的情况下管理它们：

| 标志 | 作用 |
| --- | --- |
| `--background` | 以分离模式启动服务器，等待其就绪，打印其 URL 和进程 ID，然后退出。 |
| `--status` | 报告服务器是否正在运行。 |
| `--logs` | 打印服务器的日志。添加 `--follow` 可持续查看。 |
| `--stop` | 停止在后台运行的服务器。 |

例如：

```shell
pnpm dev:serve --background
pnpm dev:serve --logs --follow
pnpm dev:serve --stop
```

由于它们共享构建输出，因此一次只能运行一个开发服务器或生产构建。启动第二个时会告诉你当前哪个正在运行，以及如何停止它。冷构建最多需要等待 180 秒才能就绪。设置 `HA_DEV_SERVER_TIMEOUT` 为一个秒数可以更改此时间。

当服务器在后台运行时，其日志会写入 `node_modules/.cache/ha-dev-server/`。当脚本检测到它是由编码智能体（coding agent）启动的，普通的 `pnpm dev` 或 `pnpm dev:*` 会自动转入后台，从而不会阻塞智能体。设置 `HA_DEV_BACKGROUND=0` 可使其保持在前台运行。

## 浏览器设置

前端使用了 service worker 和缓存，这可能会在更改后向你显示旧的构建版本。在浏览器的开发者工具中：

1. 在 **Network** 标签页中，启用 **Disable cache**。
2. 在 **Application** > **Service workers** 下，启用 **Bypass for network**。

这些是 Chrome 及其他 Chromium 浏览器中的名称。其他浏览器也有类似的设置。

## 查看 hass 对象

前端的每个部分都从一个对象 `hass` 获取数据。要查看其中的内容，请打开开发者工具，在 **Elements** 标签页中选择 `<home-assistant>` 元素，然后在控制台中运行：

```js
$0.hass
```

这仅用于探索。在代码中，请使用传递给你的组件的数据。[hass 对象与上下文](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)解释了具体方法。
