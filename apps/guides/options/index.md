# 添加选项

> 让用户配置您的应用。定义选项及其类型，在脚本中读取它们，并为它们提供翻译后的标签。

Source: https://www.hasscn.top/contributors/apps/guides/options/

选项（Options）是您的应用在**配置**选项卡中供用户更改的设置。您在 `config.yaml` 中定义它们，Supervisor 会验证用户输入的内容，而您的应用则从 `/data/options.json` 读取结果。

## 选项与模式

两个键协同工作：

- `options` 保存默认值。这是新用户开始时使用的值。
- `schema` 保存每个选项的类型。Supervisor 根据它验证用户的输入，UI 也根据它构建表单。

```yaml
options:
  message: "Hello world"
  port: 8080
  logins:
    - username: "beer"
      password: "123456"
  log_level: "info"
schema:
  message: str
  port: port
  logins:
    - username: str
      password: password
  log_level: "list(debug|info|warning|error)"
  api_key: "str?"
```

`schema` 中的每个键都是必需的，除非其类型以 `?` 结尾。在这里：

- `message`、`port`、`logins` 和 `log_level` 是必需的，并且有默认值。
- `api_key` 是可选的。它没有默认值，因此不在 `options` 中。

如果您给一个必需的选项没有设置默认值，或者默认值为 `null`，那么用户必须在应用启动之前填写它。将可选的选项从 `options` 中省略，这样在用户填写之前它们将保持未设置状态。

选项可以嵌套：一个值列表、一个映射列表，或者一个映射。列表不能直接包含另一个列表。

设置 `schema: false` 可以完全关闭验证。此时应用将按原样获取选项，UI 也不会显示表单。

## 模式类型

| 类型 | 接受 | 表单字段 |
| --- | --- | --- |
| `str` | 任意文本 | 文本 |
| `str(min,max)` | 具有最小和最大长度的文本。省略其中一个表示无限制，例如 `str(3,)` | 文本 |
| `password` | 文本，以隐藏方式显示。也可以使用 `(min,max)` | 密码 |
| `bool` | `true` 或 `false` | 开关 |
| `int` | 整数。也可以使用 `(min,max)`，例如 `int(1,10)` | 数字 |
| `float` | 数字。也可以使用 `(min,max)`，例如 `float(0.5,)` | 数字 |
| `email` | 电子邮件地址 | 电子邮件 |
| `url` | URL | URL |
| `port` | 网络端口，1 到 65535 | 数字 |
| `match(regex)` | 匹配正则表达式的文本 | 文本 |
| `list(a\|b\|c)` | 列出的值之一 | 下拉菜单 |
| `device` | 主机上设备的路径 | 设备下拉菜单 |
| `device(subsystem=tty)` | 该子系统的设备，例如串行端口 | 设备下拉菜单 |

Supervisor 会将每个 `password` 值的哈希值与 Have I Been Pwned 数据库进行比对，如果出现在其中则会警告用户。

## 密钥

用户可以使用 `!secret name` 引用 Home Assistant 的 `secrets.yaml` 中的密钥，而不是手动输入值。Supervisor 会查找并验证真实值。您的应用在 `options.json` 中收到的是解析后的值，因此您无需为此做任何额外工作。

## 读取选项

每次应用启动时，Supervisor 都会将验证后的选项写入 `/data/options.json`：

```json
{
  "message": "Hello world",
  "port": 8080,
  "logins": [{ "username": "beer", "password": "123456" }],
  "log_level": "info"
}
```

在 shell 脚本中，使用 [Bashio](https://www.hasscn.top/contributors/apps/bashio/config/) 读取它们。Bashio 不会直接读取该文件：它向 Supervisor API 请求相同的选项，因此请使用 `with-contenv` 启动脚本，以便为其提供所需的令牌。

```bash
#!/command/with-contenv bashio

message=$(bashio::config 'message')
first_user=$(bashio::config 'logins[0].username')

if bashio::config.has_value 'api_key'; then
  api_key=$(bashio::config 'api_key')
fi
```

键是一个 jq 路径，因此嵌套的选项也可以使用。在任何其他语言中，将 `/data/options.json` 作为 JSON 读取。

选项只有在用户保存时才会更改，并且 Supervisor 会在您的应用启动之前写入该文件。因此请在启动时读取它们；用户必须重启您的应用才能使新值生效。

## 翻译选项

如果没有翻译，表单将显示原始的选项键，例如 `log_level`。添加一个翻译文件，为每个选项提供一个可读的名称和描述：

```yaml
# translations/en.yaml
configuration:
  message:
    name: "Message"
    description: "The message to show in the log at startup."
  log_level:
    name: "Log level"
    description: "How much detail to write to the log."
  logins:
    name: "Logins"
    description: "The users that can log in."
    fields:
      username:
        name: "Username"
      password:
        name: "Password"
```

`configuration` 下的键与您的 `schema` 的键相匹配；`fields` 对嵌套的选项执行相同的操作。为每种语言添加一个文件，例如 `nl.yaml` 或 `de.yaml`。格式详见[应用文件](https://www.hasscn.top/contributors/apps/reference/files/#translation-file)。

## 移除选项

当您从 `schema` 中删除一个选项时，已经安装了您的应用的用户仍然保存着它。此后，Supervisor 每次验证选项时都会记录一条类似 `Option 'old_key' does not exist in the schema for My app (local_my_app)` 的警告。

要清理此问题，请在启动时从已保存的选项中移除该选项。使用 Bashio 时，不带值的 `bashio::app.option` 会删除该键：

```bash
#!/command/with-contenv bashio

if bashio::jq.exists "$(bashio::app.options)" ".old_key"; then
  bashio::log.info "Removing old option old_key"
  bashio::app.option 'old_key'
fi
```

这会调用 `/addons/self/options` 上的 Supervisor API，每个应用都可以在没有 `hassio_api` 的情况下使用它。

## 面向用户的配置文件

有些软件使用自己的配置文件比使用表单更容易配置。例如表单无法表达的复杂列表、像证书这样的二进制文件，或者软件在更改时会重新加载的文件。

对于这些情况，请映射 `app_config`：

```yaml
map:
  - type: app_config
    read_only: false
```

这样，每个应用都会获得自己的公共配置文件夹。在您的容器内，它位于 `/config`。用户可以在 `app_configs` 文件夹中（通过 Samba、SSH 或文件编辑器应用）找到它，位于以应用 ID 命名的子文件夹中，例如 `app_configs/local_my_app`。

在您的文档中告诉用户应将哪个文件放在那里，或者添加一个包含文件名的选项。如果用户需要，也可以将文件写入此文件夹：日志、生成的配置，或供检查的数据库。该文件夹是应用备份的一部分，当应用被卸载时，如果用户选择删除其数据，该文件夹也会被移除。
