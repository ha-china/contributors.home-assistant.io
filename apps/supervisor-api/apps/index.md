# 应用（Apps）端点

> 用于已安装应用、其选项、状态和日志的 Supervisor API 端点。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/apps/

这些端点用于已安装的应用。要浏览和安装应用，请使用[商店端点](https://www.hasscn.top/contributors/apps/supervisor-api/store/)。

`<app>` 是已安装应用的 slug，例如 `core_mosquitto` 或 `local_hello_world`。您的应用始终可以使用 `self` 来指代自身。调用 `/addons/self/...` 不需要额外权限，请参阅[您的应用可以调用什么](https://www.hasscn.top/contributors/apps/supervisor-api/#what-your-app-may-call)。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/addons` | 列出已安装的应用 |
| `POST` | `/addons/reload` | 重新加载应用商店 |
| `GET` | `/addons/<app>/info` | 应用的详细信息 |
| `POST` | `/addons/<app>/options` | 更改应用的选项 |
| `POST` | `/addons/<app>/options/validate` | 验证选项 |
| `GET` | `/addons/<app>/options/config` | 读取您自己已验证的选项 |
| `POST` | `/addons/<app>/sys_options` | 将应用标记为由 Home Assistant 管理 |
| `POST` | `/addons/<app>/security` | 开启或关闭保护模式 |
| `POST` | `/addons/<app>/start` | 启动应用 |
| `POST` | `/addons/<app>/stop` | 停止应用 |
| `POST` | `/addons/<app>/restart` | 重启应用 |
| `POST` | `/addons/<app>/rebuild` | 重新构建本地构建的应用 |
| `POST` | `/addons/<app>/uninstall` | 卸载应用 |
| `POST` | `/addons/<app>/stdin` | 写入应用的标准输入 |
| `GET` | `/addons/<app>/stats` | 应用的资源使用情况 |
| `GET` | `/addons/<app>/logs` | 应用的日志，以及其他[日志端点](https://www.hasscn.top/contributors/apps/supervisor-api/#log-endpoints) |
| `POST` | `/addons/<app>/install` | [商店安装](https://www.hasscn.top/contributors/apps/supervisor-api/store/#post-storeaddonsappinstall)的旧路径 |
| `POST` | `/addons/<app>/update` | [商店更新](https://www.hasscn.top/contributors/apps/supervisor-api/store/#post-storeaddonsappupdate)的旧路径 |
| `GET` | `/addons/<app>/icon` | [商店图标](https://www.hasscn.top/contributors/apps/supervisor-api/store/#get-storeaddonsappicon)的旧路径 |
| `GET` | `/addons/<app>/logo` | [商店标志](https://www.hasscn.top/contributors/apps/supervisor-api/store/#get-storeaddonsapplogo)的旧路径 |
| `GET` | `/addons/<app>/changelog` | [商店更新日志](https://www.hasscn.top/contributors/apps/supervisor-api/store/#get-storeaddonsappchangelog)的旧路径 |
| `GET` | `/addons/<app>/documentation` | [商店文档](https://www.hasscn.top/contributors/apps/supervisor-api/store/#get-storeaddonsappdocumentation)的旧路径 |

## 列出与重新加载

### `GET /addons`

返回已安装的应用。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `addons` | 列表 | [应用模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#app)的列表 |

```json
{
  "addons": [
    {
      "name": "Hello world",
      "slug": "local_hello_world",
      "description": "My first real app!",
      "advanced": false,
      "stage": "stable",
      "version": "1.1.0",
      "version_latest": "1.1.0",
      "update_available": false,
      "available": true,
      "detached": false,
      "homeassistant": null,
      "state": "started",
      "repository": "local",
      "build": true,
      "url": null,
      "icon": false,
      "logo": false,
      "system_managed": false
    }
  ]
}
```

### `POST /addons/reload`

重新加载应用商店：重新读取所有仓库并查找新版本。与 [`POST /store/reload`](https://www.hasscn.top/contributors/apps/supervisor-api/store/#post-storereload) 的作用相同。

## 信息与选项

### `GET /addons/<app>/info`

返回应用的详细信息。当应用未安装时，将回退到该应用的商店信息，其中 `state` 设置为 `unknown`，并使用默认选项。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `name` | 字符串 | 应用名称 |
| `slug` | 字符串 | 应用的 slug，包括仓库前缀 |
| `hostname` | 字符串 | 应用在内部网络上的主机名 |
| `dns` | 列表 | 应用的 DNS 名称 |
| `description` | 字符串 | 简短描述 |
| `long_description` | 字符串或 null | `README.md` 的内容 |
| `advanced` | 布尔值 | 已弃用，始终为 `false` |
| `stage` | 字符串 | `stable`、`experimental` 或 `deprecated` |
| `repository` | 字符串 | 应用来源仓库的 slug |
| `version` | 字符串 | 已安装的版本 |
| `version_latest` | 字符串 | 可用的最新版本 |
| `update_available` | 布尔值 | 如果有可用更新则为 `true` |
| `protected` | 布尔值 | 如果保护模式已开启则为 `true` |
| `rating` | 整数 | 安全评级，从 1 到 8 |
| `boot_config` | 字符串 | 应用配置中的启动模式：`auto`、`manual` 或 `manual_only` |
| `boot` | 字符串 | 用户设置的启动模式：`auto` 或 `manual` |
| `options` | 字典 | 应用的选项。当其他应用请求时为空，除非该应用具有 `manager` 或 `admin` 角色。选项中可能包含密码 |
| `schema` | 列表或 null | 选项模式（schema），为 UI 中的选项表单准备 |
| `arch` | 列表 | 支持的架构 |
| `machine` | 列表 | 支持的机器类型 |
| `homeassistant` | 字符串或 null | 最低 Home Assistant 版本 |
| `url` | 字符串或 null | 应用的网站 |
| `detached` | 布尔值 | 如果应用不再属于任何仓库则为 `true` |
| `available` | 布尔值 | 如果应用可以在此系统上运行则为 `true` |
| `build` | 布尔值 | 如果应用是本地构建的则为 `true` |
| `network` | 字典或 null | 端口映射，容器端口到主机端口 |
| `network_description` | 字典或 null | 每个端口的描述 |
| `host_network` | 布尔值 | 使用主机网络 |
| `host_pid` | 布尔值 | 使用主机 PID 命名空间 |
| `host_ipc` | 布尔值 | 使用主机 IPC 命名空间 |
| `host_uts` | 布尔值 | 使用主机 UTS 命名空间 |
| `host_dbus` | 布尔值 | 可以访问主机 D-Bus |
| `privileged` | 列表 | 额外的 Linux 能力（capabilities） |
| `full_access` | 布尔值 | 拥有完整的硬件访问权限 |
| `apparmor` | 字符串 | `disable`、`default` 或 `profile` |
| `icon` | 布尔值 | 有图标 |
| `logo` | 布尔值 | 有标志 |
| `changelog` | 布尔值 | 有更新日志 |
| `documentation` | 布尔值 | 有文档 |
| `stdin` | 布尔值 | 接受标准输入 |
| `hassio_api` | 布尔值 | 可以访问 Supervisor API |
| `hassio_role` | 字符串 | Supervisor API 角色 |
| `auth_api` | 布尔值 | 可以校验用户凭据 |
| `homeassistant_api` | 布尔值 | 可以访问 Home Assistant Core API 代理 |
| `gpio` | 布尔值 | 拥有 GPIO 访问权限 |
| `usb` | 布尔值 | 拥有 USB 访问权限 |
| `uart` | 布尔值 | 可以访问串行设备 |
| `kernel_modules` | 布尔值 | 可以访问内核模块 |
| `devicetree` | 布尔值 | 可以访问设备树 |
| `udev` | 布尔值 | 可以访问 udev 数据库 |
| `docker_api` | 布尔值 | 可以访问 Docker API |
| `video` | 布尔值 | 可以访问视频设备 |
| `audio` | 布尔值 | 使用音频系统 |
| `startup` | 字符串 | `initialize`、`system`、`services`、`application` 或 `once` |
| `services` | 列表 | 应用提供或使用的服务，例如 `mqtt:provide` |
| `discovery` | 列表 | 应用可以为其发送发现消息的集成（integration） |
| `translations` | 字典 | 应用的翻译文件，按语言分类 |
| `ingress` | 布尔值 | 使用 ingress |
| `ingress_entry` | 字符串或 null | 应用的 ingress 路径 |
| `ingress_url` | 字符串或 null | 完整的 ingress URL，包括入口点 |
| `ingress_port` | 整数或 null | 应用为 ingress 监听的端口 |
| `ingress_panel` | 布尔值或 null | 如果应用显示在侧边栏中则为 `true` |
| `signed` | 布尔值 | 始终为 `false`，不检查镜像签名 |
| `state` | 字符串 | `startup`、`started`、`stopped`、`unknown` 或 `error` |
| `webui` | 字符串或 null | Web 界面的 URL，带有占位符 |
| `audio_input` | 字符串或 null | 所选的音频输入设备 |
| `audio_output` | 字符串或 null | 所选的音频输出设备 |
| `auto_update` | 布尔值 | 如果应用自动更新则为 `true` |
| `ip_address` | 字符串 | 内部网络上的 IP 地址 |
| `watchdog` | 布尔值 | 如果看门狗已开启则为 `true` |
| `devices` | 列表 | 映射到应用中的设备路径 |
| `system_managed` | 布尔值 | 如果 Home Assistant 管理该应用则为 `true` |
| `system_managed_config_entry` | 字符串或 null | 管理该应用的配置条目 ID |

### `POST /addons/<app>/options`

更改应用的设置。只发送您想要更改的键。要将 `network`、`audio_input`、`audio_output` 或 `options` 重置为默认值，请发送 `null`。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `boot` | 字符串 | 否 | `auto` 或 `manual`。当应用使用 `manual_only` 时会失败 |
| `auto_update` | 布尔值 | 否 | 自动更新应用 |
| `network` | 字典或 null | 否 | 端口映射，例如 `"8000/tcp": 8000`。端口为 `null` 将禁用该映射 |
| `options` | 字典或 null | 否 | 应用选项，根据应用的模式（schema）进行验证 |
| `audio_input` | 字符串或 null | 否 | 音频输入设备 |
| `audio_output` | 字符串或 null | 否 | 音频输出设备 |
| `ingress_panel` | 布尔值 | 否 | 在侧边栏中显示应用 |
| `watchdog` | 布尔值 | 否 | 开启或关闭看门狗 |

选项可以使用 `!secret name` 来引用 Home Assistant 的 `secrets.yaml` 中的条目。Supervisor 会存储该引用，并将解析后的值提供给应用。

```json
{
  "boot": "manual",
  "options": {
    "name": "world",
    "beer": true
  },
  "watchdog": true
}
```

对 `options` 的更改将在应用下次启动时生效。

### `POST /addons/<app>/options/validate`

根据应用的模式（schema）验证选项。将要检查的选项作为请求体发送，或者不发送任何内容以检查已存储的选项。当该检查开启时，还会根据已知泄露检查密码，请参阅 [`/security`](https://www.hasscn.top/contributors/apps/supervisor-api/supervisor/#security)。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `message` | 字符串 | 哪里有问题，或为空 |
| `valid` | 布尔值 | 如果选项有效则为 `true` |
| `pwned` | 布尔值或 null | 如果已知密码已泄露则为 `true`，如果检查失败则为 `null` |

### `GET /addons/<app>/options/config`

返回您自己应用的选项，已验证、已填入默认值并解析了 `!secret` 引用。仅适用于 `self`：任何应用都无法读取其他应用的渲染后选项。

### `POST /addons/<app>/sys_options`

将应用标记为由 Home Assistant 管理。只有 Home Assistant Core 可以调用此端点。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `system_managed` | 布尔值 | 否 | 如果 Home Assistant 管理该应用则为 `true` |
| `system_managed_config_entry` | 字符串或 null | 否 | 管理该应用的配置条目 ID |

### `POST /addons/<app>/security`

开启或关闭应用的保护模式。需要 `admin` 角色，即使应用通过 `self` 为自己调用也是如此。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `protected` | 布尔值 | 否 | `true` 表示开启保护模式 |

## 运行应用

### `POST /addons/<app>/start`

启动应用。会等待直到应用正在运行。当 Supervisor 仍在启动或正在恢复备份时会失败。

### `POST /addons/<app>/stop`

停止应用。

### `POST /addons/<app>/restart`

重启应用。当 Supervisor 仍在启动或正在恢复备份时会失败。

### `POST /addons/<app>/rebuild`

重新构建本地构建的应用的镜像并重启它。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `force` | 布尔值 | 否 | 即使应用使用预构建镜像也重新构建。默认为 `false` |

### `POST /addons/<app>/uninstall`

卸载应用。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `remove_config` | 布尔值 | 否 | 同时删除应用的公共配置文件夹（`app_config`）。默认为 `false` |

### `POST /addons/<app>/stdin`

将原始请求体写入应用的标准输入。应用需要在其配置中设置 `stdin: true`。

## 使用情况与日志

### `GET /addons/<app>/stats`

以[统计模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#stats)的形式返回应用的资源使用情况。添加 `one_shot` 查询参数可获得单个快速采样。在单次采样中，`cpu_percent` 为 `null`。

```json
{
  "cpu_percent": 14.0,
  "cpu_usage": 3412000000,
  "cpu_system_usage": 98231000000000,
  "online_cpus": 4,
  "memory_usage": 288888,
  "memory_limit": 322222,
  "memory_percent": 32.4,
  "network_tx": 110,
  "network_rx": 902,
  "blk_read": 12,
  "blk_write": 27
}
```

### `GET /addons/<app>/logs`

返回应用的日志。`follow`、`latest` 和 `boots` 变体也可用。它们的工作方式与其他[日志端点](https://www.hasscn.top/contributors/apps/supervisor-api/#log-endpoints)相同。
