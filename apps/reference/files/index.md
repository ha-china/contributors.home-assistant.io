# 应用（App）文件

> Supervisor 从应用文件夹和仓库中读取的文件，以及每个文件的用途。

Source: https://www.hasscn.top/contributors/apps/reference/files/

Supervisor 会从你的应用文件夹中读取一组固定的文件名。文件夹中的其他内容仅由你的 `Dockerfile` 使用。

## 应用文件夹

```text
hello_world/
  translations/
    en.yaml
  rootfs/
  apparmor.txt
  CHANGELOG.md
  config.yaml
  Dockerfile
  DOCS.md
  icon.png
  logo.png
  README.md
```

| 文件 | 是否必需 | Supervisor 对它的处理方式 |
| --- | --- | --- |
| `config.yaml` | 是 | [应用配置](https://www.hasscn.top/contributors/apps/reference/configuration/)。也接受 `config.yml` 或 `config.json`。 |
| `Dockerfile` | 本地构建时需要 | 当 `config.yaml` 中没有 `image` 时用于构建镜像。`Dockerfile.aarch64` 或 `Dockerfile.amd64` 对相应架构优先。 |
| `README.md` | 否 | 应用商店中应用的介绍。 |
| `DOCS.md` | 否 | 应用的**文档**标签页。 |
| `CHANGELOG.md` | 否 | 变更内容，在有更新可用时显示。 |
| `icon.png` | 否 | 应用的方形图标。 |
| `logo.png` | 否 | 标志（logo），显示在应用页面上。 |
| `apparmor.txt` | 否 | 自定义 AppArmor 配置文件，加载后会替代默认配置。 |
| `translations/` | 否 | 选项和端口的翻译名称与描述，每种语言一个文件，例如 `en.yaml`。YAML 或 JSON 格式。 |
| `build.yaml` | 否 | 已弃用。参见[构建容器镜像](https://www.hasscn.top/contributors/apps/guides/dockerfile/#buildyaml)。 |

`rootfs/` 对 Supervisor 来说并没有特殊之处，但它是示例应用和官方应用中的惯例：一个由 `Dockerfile` 通过 `COPY rootfs /` 复制进镜像的文件夹。Supervisor 在查找 `config.yaml` 文件时会跳过名为 `rootfs` 的文件夹，因此其中的配置文件是安全的。

关于文档文件、图标和标志中应包含的内容，请参见[展示你的应用](https://www.hasscn.top/contributors/apps/guides/presentation/)。

## 翻译文件

翻译文件有两个键：`configuration` 用于选项，`network` 用于端口。

```yaml
configuration:
  ssl:
    name: "Enable SSL"
    description: "Use SSL for the web server of the app."
  ssh:
    name: "SSH options"
    description: "Configure SSH authentication."
    fields:
      public_key:
        name: "Public key"
        description: "The public key of your client."
network:
  80/tcp: "The web server port (not used for ingress)"
```

| 键 | 描述 |
| --- | --- |
| `configuration.<option>.name` | 必需。选项的标签。`<option>` 对应 `schema` 中的一个键。 |
| `configuration.<option>.description` | 选项下方的帮助文本。 |
| `configuration.<option>.fields` | 相同的结构，用于嵌套选项的键。 |
| `network.<port>` | 端口的描述。`<port>` 对应 `ports` 中的一个键。 |

文件名是语言代码，例如 `en.yaml` 或 `pt-BR.yaml`。当缺少某种语言时，界面会回退到英语。有关如何使用它，请参见[添加选项](https://www.hasscn.top/contributors/apps/guides/options/#translate-the-options)。

## 仓库

仓库（repository）是一个 Git 仓库，其根目录包含一个 `repository.yaml`（或 `repository.yml`，或 `repository.json`），并且每个应用各有一个文件夹。

```text
my-apps/
  hello_world/
    config.yaml
    Dockerfile
  another_app/
    config.yaml
  repository.yaml
```

```yaml
name: "My apps"
url: "https://github.com/me/my-apps"
maintainer: "Jane Doe <jane@example.com>"
```

| 键 | 是否必需 | 描述 |
| --- | --- | --- |
| `name` | 是 | 仓库名称，显示在应用商店中。 |
| `url` | 否 | 仓库的主页。 |
| `maintainer` | 否 | 仓库的维护者，以及联系方式。 |

如果没有有效的 `repository.yaml`，Supervisor 将不会加载该仓库。参见[创建并分享仓库](https://www.hasscn.top/contributors/apps/guides/repository/)。
