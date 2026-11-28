# 备份端点

> 用于创建、恢复、上传、下载和管理备份的 Supervisor API 端点。

Source: https://www.hasscn.top/contributors/apps/supervisor-api/backups/

通过这些端点，您的应用可以创建和恢复备份，例如将备份复制到其他位置的备份应用。您的应用需要 `hassio_api: true` 和 `backup` 角色，或者 `manager` 或 `admin` 角色。

`<backup>` 是备份的 slug，即一个简短的随机 ID，例如 `a1b2c3d4`。

| 方法 | 路径 | 描述 |
| --- | --- | --- |
| `GET` | `/backups` | 列出备份 |
| `GET` | `/backups/info` | 列出备份以及备份设置 |
| `POST` | `/backups/options` | 更改备份设置 |
| `POST` | `/backups/reload` | 重新读取备份位置 |
| `POST` | `/backups/new/full` | 创建完整备份 |
| `POST` | `/backups/new/partial` | 创建部分备份 |
| `POST` | `/backups/new/upload` | 上传备份文件 |
| `GET` | `/backups/<backup>/info` | 备份的详细信息 |
| `GET` | `/backups/<backup>/download` | 下载备份文件 |
| `DELETE` | `/backups/<backup>` | 删除备份 |
| `POST` | `/backups/<backup>/restore/full` | 从备份恢复所有内容 |
| `POST` | `/backups/<backup>/restore/partial` | 恢复备份中的部分内容 |
| `POST` | `/backups/freeze` | 为外部备份准备系统 |
| `POST` | `/backups/thaw` | 解除冻结 |

## 位置

一个备份可以存储在多个位置。位置可以是以下之一：

- `null` 或 `.local`：系统的本地备份文件夹
- 用于备份的[网络挂载](https://www.hasscn.top/contributors/apps/supervisor-api/host/#mounts)的名称
- `.cloud_backup`：Home Assistant Link。只有 Home Assistant Core 可以使用此位置

## 文件夹

备份可以包含以下文件夹：`share`、`ssl`、`media` 和 `addons/local`（本地应用）。API 也接受 `apps/local` 来表示本地应用。在请求中，文件夹 `homeassistant` 与 `homeassistant: true` 含义相同。

## 列表和设置

### `GET /backups`

返回备份列表。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `backups` | 列表 | [备份模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#backup)的列表 |

```json
{
  "backups": [
    {
      "slug": "a1b2c3d4",
      "name": "Before the update",
      "date": "2026-10-01T09:30:00.000000+00:00",
      "type": "partial",
      "size": 0.17,
      "size_bytes": 178257,
      "location": null,
      "locations": [null],
      "protected": false,
      "location_attributes": {
        ".local": {
          "protected": false,
          "size_bytes": 178257
        }
      },
      "compressed": true,
      "content": {
        "homeassistant": false,
        "addons": ["core_mosquitto"],
        "folders": ["share"]
      }
    }
  ]
}
```

### `GET /backups/info`

返回与 `GET /backups` 相同的列表，外加备份设置。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `backups` | 列表 | [备份模型](https://www.hasscn.top/contributors/apps/supervisor-api/models/#backup)的列表 |
| `days_until_stale` | 整数 | 多少天后备份被视为过期 |

### `POST /backups/options`

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `days_until_stale` | 整数 | 否 | 多少天后备份被视为过期。至少为 1 |

### `POST /backups/reload`

重新读取所有备份位置，以获取在 Supervisor 之外添加或删除的备份文件。

## 创建备份

### `POST /backups/new/full`

创建所有内容的备份：Home Assistant、所有应用和所有文件夹。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `name` | 字符串 | 否 | 备份的名称 |
| `filename` | 字符串 | 否 | 备份的文件名。必须以 `.tar` 结尾且不包含斜杠 |
| `password` | 字符串或 null | 否 | 用于加密备份的密码 |
| `compressed` | 布尔值或 null | 否 | 是否压缩备份。默认为 `true` |
| `location` | 字符串、null 或列表 | 否 | 备份的存储位置。如果使用列表，第一个条目是主要位置，副本存储到其他位置 |
| `homeassistant_exclude_database` | 布尔值 | 否 | 不包含 Home Assistant 数据库 |
| `background` | 布尔值 | 否 | 立即返回 `job_id` 而不是等待。默认为 `false` |
| `extra` | 字典 | 否 | 与备份一起存储的额外数据 |

备份完成后，响应中包含新备份的 `job_id` 和 `slug`：

```json
{
  "job_id": "e2b7a9c4f1d34e5a8b6c0d1e2f3a4b5c",
  "slug": "a1b2c3d4"
}
```

### `POST /backups/new/partial`

创建您所选部分的备份。接受 `POST /backups/new/full` 的所有键，外加：

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `addons` | 列表或字符串 | 否 | 要包含的应用的 slug，或使用 `ALL` 表示所有已安装的应用 |
| `folders` | 列表 | 否 | 要包含的[文件夹](https://www.hasscn.top/contributors/apps/supervisor-api/backups/#folders) |
| `homeassistant` | 布尔值 | 否 | 包含 Home Assistant |

```json
{
  "name": "Mosquitto and share",
  "addons": ["core_mosquitto"],
  "folders": ["share"]
}
```

### `POST /backups/new/upload`

上传备份文件。将 `.tar` 文件作为 `multipart/form-data` 发送。响应中包含备份的 `slug`。

| 查询参数 | 描述 |
| --- | --- |
| `location` | 备份的存储位置。重复使用该参数可将副本存储到多个位置 |
| `filename` | 存储备份时使用的文件名。必须以 `.tar` 结尾 |

## 使用备份

### `GET /backups/<backup>/info`

返回备份的详细信息。

| 键 | 类型 | 描述 |
| --- | --- | --- |
| `slug` | 字符串 | 备份的 ID |
| `type` | 字符串 | `full` 或 `partial` |
| `name` | 字符串 | 备份的名称 |
| `date` | 字符串 | 备份的创建时间，采用 ISO 8601 格式 |
| `size` | 浮点数 | 大小（MB） |
| `size_bytes` | 整数 | 大小（字节） |
| `compressed` | 布尔值 | 如果备份已压缩则为 `true` |
| `protected` | 布尔值 | 如果备份设有密码则为 `true` |
| `location_attributes` | 字典 | 每个位置的 `protected` 和 `size_bytes`。本地文件夹为 `.local` |
| `supervisor_version` | 字符串 | 创建备份的 Supervisor 版本 |
| `homeassistant` | 字符串或 null | 备份中的 Home Assistant 版本，如果未包含则为 `null` |
| `location` | 字符串或 null | 主要位置 |
| `locations` | 列表 | 备份存储的所有位置 |
| `addons` | 列表 | 备份中的应用，每个应用包含 `slug`、`name`、`version` 和 `size` |
| `repositories` | 列表 | 当时已添加的应用仓库的 URL |
| `folders` | 列表 | 备份中的文件夹 |
| `homeassistant_exclude_database` | 布尔值 | 如果未包含 Home Assistant 数据库则为 `true` |
| `extra` | 字典 | 与备份一起存储的额外数据 |

### `GET /backups/<backup>/download`

以 `.tar` 文件的形式返回备份。使用 `location` 查询参数选择要下载的副本。如果不使用该参数，则返回主要位置中的副本。

### `DELETE /backups/<backup>`

删除备份。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `location` | 字符串、null 或列表 | 否 | 仅删除这些位置中的副本。如果不使用该参数，则删除所有副本 |

### `POST /backups/<backup>/restore/full`

恢复备份中的所有内容。在恢复过程中，Home Assistant 和应用会重启。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `password` | 字符串或 null | 否 | 备份的密码 |
| `location` | 字符串或 null | 否 | 用于恢复的副本 |
| `background` | 布尔值 | 否 | 立即返回 `job_id` 而不是等待。默认为 `false` |

响应中包含恢复操作的 `job_id`。

### `POST /backups/<backup>/restore/partial`

恢复您所选的部分。接受完整恢复的所有键，外加：

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `addons` | 列表 | 否 | 要恢复的应用的 slug |
| `folders` | 列表 | 否 | 要恢复的[文件夹](https://www.hasscn.top/contributors/apps/supervisor-api/backups/#folders) |
| `homeassistant` | 布尔值 | 否 | 恢复 Home Assistant |

## 外部备份

### `POST /backups/freeze`

为在 Supervisor 之外进行的备份（例如虚拟机的快照）准备系统。Home Assistant 和正在运行的应用会像进行普通备份一样为备份做好准备。带有 `backup: cold` 的应用会停止运行。

| 键 | 类型 | 必需 | 描述 |
| --- | --- | --- | --- |
| `timeout` | 整数 | 否 | 系统自动解冻的秒数。默认为 600 |

### `POST /backups/thaw`

结束冻结。Home Assistant 和应用恢复正常运行。
