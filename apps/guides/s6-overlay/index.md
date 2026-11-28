# 使用 S6 overlay 运行服务

> 基础镜像如何使用 S6 overlay 启动你的应用。Oneshot 和 longrun 服务、依赖关系、停止容器的 finish 脚本，以及环境变量。

Source: https://www.hasscn.top/contributors/apps/guides/s6-overlay/

每个 Home Assistant 基础镜像都以 [S6 overlay](https://github.com/just-containers/s6-overlay) 作为其 init 系统启动。它是容器中的第一个进程：它运行你的设置步骤、启动你的程序、在程序崩溃时重新启动它们，并在应用停止时按顺序关闭所有内容。本指南介绍它在应用中的工作原理，以及如何像 [hassio-addons/app-example](https://github.com/hassio-addons/app-example) 那样设置你的服务。

以上内容均针对 S6 overlay 版本 3，即当前基础镜像中使用的版本。

## 为什么应用要使用它

一个应用通常需要不止一个进程。比如在你的程序前面用 nginx 搭建一个 Web 界面、旁边运行一个数据库，或者在程序启动之前先写入一个配置文件的步骤。Docker 每个容器只运行一条命令。S6 overlay 可以按正确的顺序运行多条命令。

它还做了优秀的 1 号进程应该做的事情：清理僵尸进程、传递信号，并给容器一个有意义的退出码。S6 overlay 项目将其策略表述为：一个容器只做一件事，当这件事失败时，容器也应该失败。这非常契合应用。当你的容器因错误停止时，Supervisor 的看门狗（watchdog）会发现并重启你的应用。

## 基础镜像做了哪些设置

基础镜像安装了 S6 overlay，并将 `/init` 设为入口点（entrypoint）。请保留该入口点：不要设置你自己的 `ENTRYPOINT`。要启动你的程序，可以将其作为 `CMD` 提供，或者向镜像中添加服务定义。`/init` 会同时启动两者，参见[启动应用的三种方式](https://www.hasscn.top/contributors/apps/guides/s6-overlay/#three-ways-to-start-your-app)。

在 `config.yaml` 中，设置 `init: false`。S6 overlay 必须作为 1 号进程运行。如果使用默认的 `init: true`，Docker 会把它自己的 init 进程放在它前面，容器会立即停止并报错 `s6-overlay-suexec: fatal: can only run as pid 1`。

基础镜像还为 S6 overlay 设置了几个环境变量：

| 变量 | 基础镜像中的值 | 作用 |
| --- | --- | --- |
| `S6_BEHAVIOUR_IF_STAGE2_FAILS` | `2` | 当某个设置步骤或 oneshot 服务失败时停止容器。S6 overlay 的默认值 `0` 会静默继续运行。 |
| `S6_CMD_WAIT_FOR_SERVICES` | `1` | 在启动 `CMD` 之前，等待 `/etc/services.d` 中的服务就绪。 |
| `S6_CMD_WAIT_FOR_SERVICES_MAXTIME` | `0` | 启动服务不设时间限制。这也是 S6 overlay 在 3.1.6.2 之后版本中的默认值；在此之前的版本中，它会在五秒后放弃。 |
| `S6_SERVICES_READYTIME` | `50` | 检查 `/etc/services.d` 中的服务是否就绪之前等待的毫秒数。只有 Home Assistant 基础镜像设置了这个变量，值为 S6 overlay 的默认值。 |

Home Assistant 基础镜像和 Home Assistant Community Apps 的基础镜像都会在 `/usr/bin` 中安装可选的链接。这就是为什么带有 `#!/usr/bin/with-contenv` 的脚本仍然可以工作，与 S6 overlay 版本 3 使用的 `#!/command/with-contenv` 并存。

Home Assistant Community Apps 的基础镜像还添加了两个自己的 oneshot 服务：一个在应用启动时记录包含应用名称、版本和系统信息的横幅，另一个根据 `log_level` 选项设置 Bashio 的日志级别。Home Assistant 基础镜像没有这些。

## 启动应用的三种方式

S6 overlay 提供了三种运行程序的方式。选择其中一种。

| 方式 | 位置 | 何时使用 |
| --- | --- | --- |
| `CMD` | `Dockerfile` 中的 `CMD` | 只有一个程序，且应用随其停止而停止。用于[你的第一个应用](https://www.hasscn.top/contributors/apps/first-app/)。 |
| 旧式服务 | `/etc/cont-init.d/` 和 `/etc/services.d/` | 仍然受支持。许多现有应用都在使用它，包括 [home-assistant/apps-example](https://github.com/home-assistant/apps-example)。 |
| s6-rc 服务 | `/etc/s6-overlay/s6-rc.d/` | S6 overlay 推荐的格式。支持服务之间的依赖关系。[hassio-addons/app-example](https://github.com/hassio-addons/app-example) 使用的就是这种格式。 |

使用旧式格式时，`/etc/cont-init.d/` 中的可执行脚本会在服务启动之前依次运行。`/etc/services.d/` 中的每个文件夹都是一个服务，包含一个 `run` 脚本和一个可选的 `finish` 脚本。这对于简单的应用来说已经足够了。

本指南的其余部分介绍 s6-rc 格式。它能完成旧式格式的一切，而且你可以指定什么在什么之后启动。

## s6-rc 的目录结构

你的服务定义放在应用的 `rootfs` 文件夹中，`Dockerfile` 会通过 `COPY rootfs /` 将其复制到镜像中。这是 Home Assistant Community Apps 示例应用的目录结构，包含一个设置步骤和两个程序：

```text
rootfs/etc/s6-overlay/
├── s6-rc.d/
│   ├── init-example/
│   │   ├── dependencies.d/
│   │   │   └── base
│   │   ├── run
│   │   ├── type
│   │   └── up
│   ├── example1/
│   │   ├── dependencies.d/
│   │   │   └── init-example
│   │   ├── finish
│   │   ├── run
│   │   └── type
│   └── example2/
│       ├── dependencies.d/
│       │   └── example1
│       ├── finish
│       ├── run
│       └── type
└── user-bundles.d/
    └── user/
        └── contents.d/
            ├── example1
            ├── example2
            └── init-example
```

`s6-rc.d` 中的每个文件夹都是一个服务。文件夹的名称就是服务的名称。其中放什么内容取决于服务的类型。

### type 文件

`type` 中包含一个单词，`oneshot` 或 `longrun`，以及一个换行符：

- **oneshot** 运行一次后退出。用于设置工作：写入配置文件、创建文件夹、检查选项。
- **longrun** 是一个持续运行的程序。S6 会监督它，并在它退出时重新启动。

你的主程序是一个 longrun。所有必须在它之前完成的事情，都是 oneshot。

### longrun 服务

longrun 需要一个 `run` 脚本。它会被直接执行，因此需要 shebang 行并且必须是可执行的：

```bash
#!/command/with-contenv bashio
# rootfs/etc/s6-overlay/s6-rc.d/example1/run

bashio::log.info "Starting Example1..."

exec /usr/bin/example1.sh
```

这里有两个重要细节：

- 使用 `exec` 启动你的程序。这样程序会替换脚本本身，S6 监督的就是你的程序本身，而不是包裹它的 shell。
- 让你的程序保持在前台运行。一个 fork 到后台的程序在 S6 看来就是退出了，S6 会一次又一次地重新启动它。出于这个原因，S6 overlay 的 README 使用 `nginx -g "daemon off;"` 来运行 nginx。

longrun 还可以有一个 `finish` 脚本，每次程序退出时都会运行。参见[当服务失败时停止容器](https://www.hasscn.top/contributors/apps/guides/s6-overlay/#stop-the-container-when-a-service-fails)。

### oneshot 服务

oneshot 需要一个 `up` 文件。这个文件不是脚本：它包含一条单独的命令行，S6 使用 execline 解析器读取它。最简单的用法是让它指向一个脚本：

```text
/etc/s6-overlay/s6-rc.d/init-example/run
```

然后把你的设置逻辑放在那个脚本中，并使其可执行：

```bash
#!/command/with-contenv bashio
# rootfs/etc/s6-overlay/s6-rc.d/init-example/run

bashio::log.info "Writing the configuration..."

mkdir -p /data/config
```

该脚本命名为 `run` 只是示例应用的一个约定。对于 oneshot，S6 只查看 `up`，以及一个可选的、在应用停止时运行的 `down`。

如果 oneshot 失败，由于 `S6_BEHAVIOUR_IF_STAGE2_FAILS=2`，基础镜像会停止容器。因此 oneshot 也是检查选项的好地方：当 `bashio::config.require` 退出时，你的应用会停止，并在日志中留下清晰的消息。

### 依赖关系

服务的 `dependencies.d` 文件夹中，为每个必须先启动的服务放置一个空文件。在示例中：

- `init-example` 依赖于 `base`。这是 S6 overlay 自带的一个 bundle，包含容器的基本设置。S6 overlay 建议每个服务都直接或通过其他服务依赖于 `base`。否则，服务可能在容器完全设置好之前就启动。
- `example1` 依赖于 `init-example`，因此它在设置步骤完成后启动。
- `example2` 依赖于 `example1`。

S6 按此顺序启动服务。当应用停止时，它按相反的顺序停止它们：先停 `example2`，最后停 `base`。

### user bundle

只有位于 `user` bundle 中的服务才会启动。在 `user-bundles.d/user/contents.d/` 中添加一个以服务名称命名的空文件。如果忘记这一步，你的服务永远不会启动，而且不会有任何错误提示。

## 当服务失败时停止容器

S6 会在 longrun 每次退出时重新启动它。这并不总是你想要的行为。如果你的程序崩溃了，通常更好的做法是停止整个容器：Supervisor 会看到容器已停止，如果用户开启了看门狗（watchdog），它就会重启应用。

要做到这一点，请为该服务添加一个 `finish` 脚本。S6 每次程序退出时都会运行它，并传入两个参数：

- `$1`：程序的退出码，如果程序是被信号杀死的，则为 `256`。
- `$2`：信号的编号（如果有的话）。

脚本决定接下来发生什么。要停止容器，它将容器应有的退出码写入 `/run/s6-linux-init-container-results/exitcode`，然后运行 `/run/s6/basedir/bin/halt`。这是示例应用的 `finish` 脚本，略有精简：

```bash
#!/command/with-contenv bashio
# rootfs/etc/s6-overlay/s6-rc.d/example1/finish

readonly results="/run/s6-linux-init-container-results/exitcode"
readonly exit_code_service="${1}"
readonly exit_code_signal="${2}"
exit_code_container=$(<"${results}")

bashio::log.info "Service example1 exited with code ${exit_code_service}"

if [[ "${exit_code_service}" -eq 256 ]]; then
  # Killed by a signal. Keep the exit code of the first service that failed.
  if [[ "${exit_code_container}" -eq 0 ]]; then
    echo $((128 + exit_code_signal)) > "${results}"
  fi

  # SIGTERM means the container is stopping: take everything down.
  [[ "${exit_code_signal}" -eq 15 ]] && exec /run/s6/basedir/bin/halt

elif [[ "${exit_code_service}" -ne 0 ]]; then
  # The program crashed: stop the container with its exit code.
  if [[ "${exit_code_container}" -eq 0 ]]; then
    echo "${exit_code_service}" > "${results}"
  fi

  exec /run/s6/basedir/bin/halt

else
  # A clean exit: let S6 start it again.
  bashio::log.info "Service example1 restarting..."
fi
```

对 `exit_code_container` 的检查保留了第一个退出码。当一个服务崩溃、其他服务因此被停止时，容器仍然会以引发问题的那个服务的退出码退出。

一个更简短的版本，来自 [home-assistant/apps-example](https://github.com/home-assistant/apps-example)，只在崩溃时停止，其余一切交给 S6 处理：

```bash
#!/usr/bin/env bashio

if [[ "${1}" -ne 0 ]] && [[ "${1}" -ne 256 ]]; then
  bashio::log.warning "Halt app with exit code ${1}"
  echo "${1}" > /run/s6-linux-init-container-results/exitcode
  exec /run/s6/basedir/bin/halt
fi
```

## 容器环境

S6 使用一个最小化的环境来启动每个服务以及 `CMD`。容器的变量，比如 `SUPERVISOR_TOKEN` 以及 `config.yaml` 中 `environment` 里的变量，被单独存放。`with-contenv` 会在运行你的脚本之前加载它们。

因此，每个与 Supervisor 通信的脚本都应以 `#!/command/with-contenv bashio` 开头。这包括每个使用 [Bashio](https://www.hasscn.top/contributors/apps/bashio/) 读取选项的脚本，因为 `bashio::config` 是从 Supervisor API 获取它们的。

oneshot 还可以为它之后的服务添加变量。将值写入以变量命名的文件，放在 `/var/run/s6/container_environment/` 中。Home Assistant Community Apps 的基础镜像就是这样设置 `LOG_LEVEL` 的：

```bash
echo -n "${log_level}" > /var/run/s6/container_environment/LOG_LEVEL
```

之后每个以 `with-contenv` 开头的脚本都能看到新值。

## 调整 S6 overlay

S6 overlay 读取的环境变量比基础镜像设置的更多。在 `Dockerfile` 中用 `ENV` 设置它们。以下几个在应用中很有用：

| 变量 | 默认值 | 作用 |
| --- | --- | --- |
| `S6_VERBOSITY` | `2` | S6 在启动和停止时记录多少日志。`1` 只记录警告和错误，`0` 只记录错误。 |
| `S6_KILL_GRACETIME` | `3000` | 关机时，S6 在杀死未停止的进程之前等待的毫秒数。 |
| `S6_SERVICES_GRACETIME` | `3000` | S6 等待 `/etc/services.d` 中的服务停止的毫秒数。 |
| `S6_KILL_FINISH_MAXTIME` | `5000` | 关机时，`/etc/cont-finish.d` 中的脚本最多可占用的毫秒数。 |

完整列表见 [S6 overlay README](https://github.com/just-containers/s6-overlay#customizing-s6-overlay-behaviour)。

## 常见错误

- **`init: true`。** 容器停止并报错 `can only run as pid 1`。在 `config.yaml` 中设置 `init: false`。
- **脚本不可执行。** S6 overlay 版本 3 直接执行脚本，而不是把它们交给 shell。在 Git 中将它们设为可执行，或在 `Dockerfile` 中为它们添加 `RUN chmod a+x`。
- **Windows 换行符。** 以 CRLF 换行符保存的脚本无法启动，而且报错往往完全不提换行符。请用 LF 保存脚本。
- **没有 `with-contenv`。** 脚本中没有 `SUPERVISOR_TOKEN`，所有 Bashio 对 Supervisor 的调用都会失败，包括 `bashio::config`。
- **服务未加入 user bundle。** 它永远不会启动。在 `user-bundles.d/user/contents.d/` 中为它添加一个空文件。
- **把脚本放在 `up` 文件中。** `up` 只包含一条命令行。把脚本放在单独的文件中，并让 `up` 指向它。
- **会 fork 的守护进程。** S6 认为它已退出，并重新启动它。让它在前台运行。
- **没有依赖 `base`。** 服务可能在容器就绪之前启动。添加 `dependencies.d/base`，或依赖于一个已依赖 `base` 的服务。
- **`host_pid: true`。** S6 overlay 无法在宿主机的 PID 命名空间中工作。

## 了解更多

- [S6 overlay README](https://github.com/just-containers/s6-overlay)：init 阶段、旧式格式、日志记录，以及每个环境变量。
- [s6-rc source format](https://skarnet.org/software/s6-rc/s6-rc-compile.html#source)：服务定义可以包含的每个文件。
- [构建一个真正的应用](https://www.hasscn.top/contributors/apps/build-a-real-app/)：Home Assistant Community Apps 的示例应用，一步一步讲解。
