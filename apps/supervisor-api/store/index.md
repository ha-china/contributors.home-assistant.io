# 商店端点

> 用于应用商店的 Supervisor API 端点，可浏览、安装和更新应用，并管理应用仓库。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/store/

商店保存着 Supervisor 已知的所有应用（无论是否已安装），来自所有已添加的仓库。`<app>` 是应用的 slug，包含仓库前缀，例如 `core_mosquitto` 或 `a0d7b954_vscode`。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/store` | 商店中的应用和仓库 |
| `POST` | `/store/reload` | 重新读取所有仓库 |
| `GET` | `/store/addons` | 列出商店中的应用 |
| `GET` | `/store/addons/<app>` | 应用的详细信息 |
| `GET` | `/store/addons/<app>/<version>` | 应用的详细信息 |
| `GET` | `/store/addons/<app>/availability` | 检查应用是否可以安装 |
| `POST` | `/store/addons/<app>/install` | 安装应用 |
| `POST` | `/store/addons/<app>/update` | 更新应用 |
| `GET` | `/store/addons/<app>/icon` | 应用的图标 |
| `GET` | `/store/addons/<app>/logo` | 应用的标志 |
| `GET` | `/store/addons/<app>/changelog` | 应用的更新日志 |
| `GET` | `/store/addons/<app>/documentation` | 应用的文档 |
| `GET` | `/store/repositories` | 列出仓库 |
| `POST` | `/store/repositories` | 添加仓库 |
| `GET` | `/store/repositories/<repository>` | 仓库的详细信息 |
| `DELETE` | `/store/repositories/<repository>` | 移除仓库 |
| `POST` | `/store/repositories/<repository>/repair` | 重置损坏的仓库 |

## 商店

### `GET /store`

返回商店中的所有应用和所有仓库。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `addons` | 列表 | [商店应用模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#store-app)的列表 |
| `repositories` | 列表 | [仓库模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#repository)的列表 |

### `POST /store/reload`

重新读取所有仓库：拉取 Git 仓库的最新更改并读取本地应用文件夹。在修改本地应用的文件后使用它。

## 商店中的应用

### `GET /store/addons`

返回商店中的应用。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `addons` | 列表 | [商店应用模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#store-app)的列表 |

```json
{
  "addons": [
    {
      "advanced": false,
      "arch": ["aarch64", "amd64"],
      "available": true,
      "build": false,
      "description": "An Open Source MQTT broker",
      "documentation": true,
      "homeassistant": null,
      "icon": true,
      "installed": true,
      "logo": true,
      "name": "Mosquitto broker",
      "repository": "core",
      "slug": "core_mosquitto",
      "stage": "stable",
      "update_available": false,
      "url": null,
      "version_latest": "6.5.1",
      "version": "6.5.1"
    }
  ]
}
```

### `GET /store/addons/<app>`

返回商店中某个应用的详细信息。`/store/addons/<app>/<version>` 路径返回相同的内容：它会忽略版本。

包含[商店应用模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#store-app)的所有键，外加：

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `apparmor` | 字符串 | `disable`、`default` 或 `profile` |
| `auth_api` | 布尔值 | 可以校验用户凭据 |
| `detached` | 布尔值 | 如果应用已不在任何仓库中，则为 `true` |
| `docker_api` | 布尔值 | 可以访问 Docker API |
| `full_access` | 布尔值 | 拥有完整的硬件访问权限 |
| `hassio_api` | 布尔值 | 可以访问 Supervisor API |
| `hassio_role` | 字符串 | Supervisor API 角色 |
| `homeassistant_api` | 布尔值 | 可以访问 Home Assistant Core API 代理 |
| `host_network` | 布尔值 | 使用主机网络 |
| `host_pid` | 布尔值 | 使用主机 PID 命名空间 |
| `ingress` | 布尔值 | 使用 ingress |
| `long_description` | 字符串或 null | `README.md` 的内容 |
| `rating` | 整数 | 安全评级，从 1 到 8。数值越高越安全 |
| `signed` | 布尔值 | 始终为 `false` |

### `GET /store/addons/<app>/availability`

检查应用的最新版本是否可以安装在此系统上。如果可以，返回成功。如果不可以，则返回包含原因的错误，例如不支持的架构或机器，或者 Home Assistant 版本过旧。

### `POST /store/addons/<app>/install`

安装应用的最新版本。`POST /store/addons/<app>/install/<version>` 的作用相同：它会忽略版本。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `background` | 布尔值 | 否 | 立即返回 `job_id`，而不是等待安装完成。默认为 `false` |

当 `background: true` 时，响应为：

```json
{
  "job_id": "e2b7a9c4f1d34e5a8b6c0d1e2f3a4b5c"
}
```

### `POST /store/addons/<app>/update`

将已安装的应用更新到最新版本。`POST /store/addons/<app>/update/<version>` 的作用相同：它会忽略版本。应用不能更新自身。在 Supervisor 仍在启动或恢复备份期间会失败。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `backup` | 布尔值 | 否 | 在更新前为应用创建备份。默认为 `false` |
| `background` | 布尔值 | 否 | 立即返回 `job_id`，而不是等待更新完成。默认为 `false` |

### `GET /store/addons/<app>/icon`

以 PNG 图像的形式返回应用的 `icon.png`。

### `GET /store/addons/<app>/logo`

以 PNG 图像的形式返回应用的 `logo.png`。

### `GET /store/addons/<app>/changelog`

以纯文本形式返回应用的 `CHANGELOG.md`。如果没有，则响应是一条简短的纯文本消息，说明没有更新日志。

### `GET /store/addons/<app>/documentation`

以纯文本形式返回应用的 `DOCS.md`。如果没有，则响应是一条简短的纯文本消息，说明没有文档。

## 仓库

### `GET /store/repositories`

以[仓库模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#repository)列表的形式返回所有仓库。

```json
[
  {
    "slug": "1a2b3c4d",
    "name": "Example repository",
    "source": "https://github.com/example/apps",
    "url": "https://github.com/example/apps",
    "maintainer": "Jane Doe <jane@example.com>"
  }
]
```

### `POST /store/repositories`

向商店添加一个仓库。Supervisor 会克隆它并读取其中的应用。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `repository` | 字符串 | 是 | 仓库的 Git URL。添加 `#branch` 可以使用默认分支以外的其他分支 |

```json
{
  "repository": "https://github.com/home-assistant/apps-example"
}
```

### `GET /store/repositories/<repository>`

返回一个[仓库模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#repository)。`<repository>` 是仓库的 slug。

### `DELETE /store/repositories/<repository>`

从商店中移除一个仓库。对于内置仓库，以及当该仓库中的应用仍在安装时，会失败。

### `POST /store/repositories/<repository>/repair`

丢弃仓库的本地副本并重新克隆。当仓库损坏或显示过时信息时使用它。
