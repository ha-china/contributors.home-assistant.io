# 你的第一个应用

> 构建一个“Hello world”应用，安装到你自己的 Home Assistant 上，并逐步将其扩展为一个带选项的小型 Web 服务器。

Source: https://www.hasscn.top/contributors/apps/first-app/

理解应用最快的方法就是亲手构建一个。在本教程中，你将编写一个极小的应用，安装到你自己的 Home Assistant 上，然后一步步扩展它。整个过程大约需要半小时。

你需要一个能运行应用的 Home Assistant 安装，也就是 Home Assistant OS，以及一种往上面放文件的方式。

## 1. 获取本地应用文件夹的访问权限

Supervisor 会在一个名为 `local_apps` 的文件夹中查找你自己构建的应用。其中的每个应用都会显示在应用商店的 **Local apps**（本地应用）下。要访问该文件夹，请先安装以下应用之一：

- [Samba share](https://my.home-assistant.io/redirect/supervisor_app/?app=core_samba)：你的 Home Assistant 会作为网络共享出现在你的电脑上，其中有一个名为 `local_apps` 的文件夹。在 macOS 上，如果它没有出现，请打开 Finder，按下 <kbd>Cmd</kbd> + <kbd>K</kbd>，并输入 `smb://homeassistant.local`。
- [Terminal & SSH](https://my.home-assistant.io/redirect/supervisor_app/?app=core_ssh)：打开它的 Web 终端，或通过 SSH 登录，然后在 `/local_apps` 中操作。若使用 SSH，请先将你的公钥添加到该应用的配置中，详见其文档。

## 2. 创建应用

在 `local_apps` 中，创建一个名为 `hello_world` 的文件夹，其中包含三个文件：`Dockerfile`、`config.yaml` 和 `run.sh`。

`Dockerfile` 描述了你的应用的容器镜像。它基于 Home Assistant 基础镜像构建，该镜像已经包含了大多数应用所需的工具：

```dockerfile
FROM ghcr.io/home-assistant/base:3.24

# Copy the start script into the image
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

`config.yaml` 告诉 Supervisor 你的应用是什么以及它需要什么：

```yaml
name: "Hello world"
description: "My first real app!"
version: "1.0.0"
slug: "hello_world"
init: false
arch:
  - aarch64
  - amd64
```

`run.sh` 脚本会在你的应用启动时运行：

```bash
#!/command/with-contenv bashio

bashio::log.info "Hello world!"
```

> [!IMPORTANT]
> 保存 `run.sh` 时请使用 Unix 换行符（LF），而不是 Windows 换行符（CRLF）。如果使用 CRLF，脚本将无法启动，且报错信息完全不会提到换行符。

关于这些文件，有几点值得了解：

- `slug` 是你的应用的 ID。它在仓库内必须唯一，并且最好让文件夹使用相同的名称。
- 需要 `init: false`，因为基础镜像自带了 init 系统 S6 overlay。[使用 S6 overlay 运行服务](https://www.hasscn.top/contributors/apps/guides/s6-overlay/)解释了原因。
- `run.sh` 的第一行会加载 [Bashio](https://www.hasscn.top/contributors/apps/bashio/)，这是一个面向应用的 shell 函数库，并带有容器的环境。`bashio::log.info` 会写入一条带有时间和级别的日志。在第 6 步中，你还会使用 Bashio 来读取选项。

## 3. 安装并启动你的应用

1. 在 Home Assistant 中，前往 **Settings**（设置）> **Apps**（应用），然后选择 **Install app**（安装应用）。这会打开 **App store**（应用商店）。
2. 在右上角菜单中，选择 **Check for updates**（检查更新）。如有需要，刷新页面。
3. 会出现一个新板块 **Local apps**（本地应用），其中包含你的应用。选择它。
4. 选择 **Install**（安装）。Supervisor 现在会根据你的 `Dockerfile` 构建镜像，这需要一点时间。
5. 选择 **Start**（启动），然后打开 **Log**（日志）标签页。你会看到类似 `[12:34:56] INFO: Hello world!` 的一行日志。

### 我的应用没有显示

首先，使用 <kbd>Ctrl</kbd> + <kbd>F5</kbd>（Windows 和 Linux）或 <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>R</kbd>（macOS）强制刷新浏览器。如果它仍然没有出现，说明 Supervisor 无法读取你的 `config.yaml`。要么是 YAML 无效，要么是某个键的值不被 Supervisor 接受。

Supervisor 日志会告诉你具体是哪个问题。前往 **Settings**（设置）> **System**（系统）> **Logs**（日志），在右上角菜单中选择 **Supervisor**，然后查找提到你的应用的那一行。修复问题后，再次在应用商店中选择 **Check for updates**（检查更新）。

## 4. 提供一个网页

一个只打印一行内容的应用还不太有用。让我们把它变成一个 Web 服务器，使用 Python 自带的 HTTP 服务器。

在 `Dockerfile` 中安装 Python，并将 `/data` 设为工作目录。`/data` 是你的应用的持久化存储；稍后会详细介绍。

```dockerfile
FROM ghcr.io/home-assistant/base:3.24

# Install the requirements of the app
RUN apk add --no-cache python3

# The Python HTTP server serves the working directory
WORKDIR /data

COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
```

在 `run.sh` 中启动服务器：

```bash
#!/command/with-contenv bashio

bashio::log.info "Hello world!"

python3 -m http.server 8000
```

然后将容器的 8000 端口暴露在主机的 8000 端口上，并提升版本号：

```yaml
name: "Hello world"
description: "My first real app!"
version: "1.1.0"
slug: "hello_world"
init: false
arch:
  - aarch64
  - amd64
startup: services
ports:
  8000/tcp: 8000
```

## 5. 安装更新

因为你提升了 `version`，Home Assistant 会为你的应用提供更新。如果你还没有看到，请在应用商店中选择 **Check for updates**（检查更新），然后更新应用。Supervisor 会根据你的更改重新构建镜像。忘记提升版本号了？那就卸载应用后重新安装。

启动应用，并在浏览器中打开 `http://homeassistant.local:8000`。你会看到一个文件列表，其中只有一个文件：`options.json`。

## 6. 添加选项

`options.json` 保存了用户为你的应用选择的设置。Supervisor 会在你的应用启动之前将它写入 `/data`。它现在是空的，因为你的应用还没有任何选项。在 `config.yaml` 中添加一些：`options` 保存默认值，`schema` 说明每个选项的类型。

```yaml
options:
  name: "world"
  beer: true
  year: 2017
schema:
  name: str
  beer: bool
  year: int
```

再次提升版本号并更新应用。你的应用的 **Configuration**（配置）标签页现在会显示一个包含这三个选项的表单。修改其中一个，保存，然后重启应用。从你的 Web 服务器下载 `options.json`，你会看到其中的值。

你的脚本可以使用 Bashio 读取这些选项。修改 `run.sh`：

```bash
#!/command/with-contenv bashio

name=$(bashio::config 'name')
bashio::log.info "Hello ${name}!"

if bashio::config.true 'beer'; then
  bashio::log.info "Cheers, it is $(bashio::config 'year')."
fi

python3 -m http.server 8000
```

提升版本号，更新，然后再次启动应用。日志现在会问候你设置的名字。`bashio::config` 会从 Supervisor 获取选项，这也是脚本以 `with-contenv` 开头的原因之一：它为脚本提供了询问所需的令牌。[Bashio 选项参考](https://www.hasscn.top/contributors/apps/bashio/config/)列出了所有用于选项的函数。

## 接下来做什么

你现在已经掌握了基础：一个 `Dockerfile`、一个 `config.yaml`、选项、日志记录和一个端口。

下一步：[构建一个真正的应用](https://www.hasscn.top/contributors/apps/build-a-real-app/)。它将带你完成一个完整的示例应用，包括按顺序启动的服务、使用 Bashio 的选项和日志记录、翻译、文档、CI 和发布。这就是你搭建一个供他人安装的应用的方式。

之后，[应用的工作原理](https://www.hasscn.top/contributors/apps/how-apps-work/)会解释 Supervisor 对你的应用做了什么。

从这里还可以前往的其他地方：

- 使用 [ingress](https://www.hasscn.top/contributors/apps/guides/ingress/) 在 Home Assistant UI 中展示你的 Web 服务器，而不是开放端口。
- 复制[示例应用仓库](https://github.com/home-assistant/apps-example)作为你自己的起点。它带有构建工作流、文档文件和现成的 AppArmor 配置文件。
- 在[应用配置](https://www.hasscn.top/contributors/apps/reference/configuration/)参考中查找每个键的含义。
- 准备好为官方应用或其背后的工具贡献力量了吗？请继续阅读[为官方应用做贡献](https://www.hasscn.top/contributors/apps/first-contribution/#2-pick-where-to-help)。
