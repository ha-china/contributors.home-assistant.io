# 校验检查

> 每次推送时检查你的仓库的 HACS action，以及 Marketplace 在判定安装完成之前运行的检查。

Source: https://www.hasscn.top/contributors/marketplace/reference/validation/

有两类检查会审视你的工作。HACS action 在你自己的仓库中运行，目录审查（catalog review）运行的也是它。Marketplace 在用户安装时会运行自己的检查，并拒绝未通过检查的安装。两者都在下面说明。

## HACS action

[hacs/action](https://github.com/hacs/action) 以 GitHub Action 的形式运行与 HACS 相同的校验。将它添加到你的仓库中，文件为 `.github/workflows/validate.yaml`：

```yaml title=".github/workflows/validate.yaml"
name: Validate

on:
  push:
  pull_request:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:

permissions: {}

jobs:
  validate-hacs:
    runs-on: "ubuntu-latest"
    steps:
      - name: HACS validation
        uses: "hacs/action@main"
        with:
          category: "integration"
```

将 `category` 设置为你的仓库类型：`integration`、用于仪表盘（dashboard）插件的 `plugin`、`theme` 或 `template`。该 action 还接受 `appdaemon` 和 `python_script`，但 Marketplace 不安装这些类型。

它会在每次推送和拉取请求（pull request）时运行，每晚运行，并且当你从 **Actions** 标签页手动启动时也会运行。要固定某个版本而不是 `main`，请在 `@` 后使用标签，并让 Dependabot 保持其更新。

### 输入

| 输入 | |
| --- | --- |
| `category` | 必填。仓库的类型。 |
| `ignore` | 要跳过的检查，以空格分隔。仅用于你自己的运行：目录不接受被忽略的检查。 |
| `repository` | 要检查的仓库的完整名称（如果不是当前仓库）。 |
| `comment` | 将结果作为评论发布到拉取请求上。默认为 `true`。 |
| `github_token` | 要使用的令牌。默认为工作流的令牌。 |

### 可以跳过的检查

| 检查 | 检查内容 |
| --- | --- |
| `archived` | 仓库未被归档。 |
| `brands` | 集成（integration）拥有品牌图片：一个包含 `icon.png` 的 `brand` 文件夹，或 [brands 仓库](https://github.com/home-assistant/brands) 中的图片。 |
| `description` | 仓库有描述。 |
| `hacsjson` | `hacs.json` 存在。 |
| `images` | README 中有图片。 |
| `information` | 仓库有信息文件，例如 README。 |
| `integration_categories` | 集成清单（manifest）中的 `categories` 有效：为已知的[集成类别](https://www.hasscn.top/contributors/core/integrations/categories/)，一到三个，且无重复。没有 `categories` 的清单只会收到警告。 |
| `issues` | Issue 功能已开启。 |
| `topics` | 仓库有主题（topics）。 |

[目录审查](https://www.hasscn.top/contributors/marketplace/guides/catalog/#what-the-review-checks)会运行比这些更多的检查。

## hassfest

对于集成，还要运行 [hassfest](https://github.com/home-assistant/actions#hassfest)，即核心（core）中的集成所接受的相同校验。目录要求运行它。

```yaml title=".github/workflows/hassfest.yaml"
name: Validate with hassfest

on:
  push:
  pull_request:
  schedule:
    - cron: "0 0 * * *"

jobs:
  validate:
    runs-on: "ubuntu-latest"
    steps:
      - uses: "actions/checkout@v4"
      - uses: "home-assistant/actions/hassfest@master"
```

## Marketplace 检查什么

Marketplace 在安装之前进行检查，并在写入文件之后再次检查。当写入后的检查失败时，文件会被恢复到安装之前的状态。

| 检查 | 类型 | 失败原因 |
| --- | --- | --- |
| 根目录中的 `hacs.json` | 全部 | 没有它的仓库无法安装或更新。 |
| 未归档、未移除 | 全部 | 已归档的仓库无法安装，目录移除的大多数仓库也无法安装。 |
| 文件位于正确位置 | 全部 | 没有文件位于[仓库结构](https://www.hasscn.top/contributors/marketplace/reference/repository-structure/)规定的位置。 |
| 最低 Home Assistant 版本 | 全部（有发布版本） | 该发布版本需要比用户拥有的更新版本的 Home Assistant。用户会被提供较旧的版本。 |
| 域名 | 集成 | `manifest.json` 中的 `domain` 包含小写字母、数字、下划线和连字符以外的字符。 |
| 域名的所有者 | 集成 | 另一个已安装的仓库具有相同的域名。 |
| 替换内置集成 | 集成 | 该域名属于核心，且用户未确认。 |
| 可加载的清单 | 集成 | 写入后：`manifest.json` 具有另一个域名，或没有加载器接受的 `version`。 |
| 文件夹的所有者 | 仪表盘、主题 | 另一个已安装的仓库使用相同的文件夹。 |
| 模块存在 | 仪表盘 | 写入后：JavaScript 文件缺失。 |
| 模块的 ZIP 文件 | 仪表盘 | 名为 JavaScript 文件、以 `.zip` 结尾的发布资产已损坏、过大、在卡片文件夹之外有文件，或在其根目录或根目录的单个文件夹中没有 JavaScript 文件。Marketplace 会安装发布版本的其他资产，并在 JavaScript 文件不在其中时失败。 |
| 主题 YAML | 主题 | 写入后：带有标签的 YAML 文件，或未通过主题校验的文件。 |
| 模板文件 | 模板 | `filename` 不是根目录中的 `.jinja` 文件，设置了 `zip_release`，或另一个仓库具有该名称的文件。写入后：文件不是 UTF-8 编码，或大于 5 MiB。 |
| 下载大小 | 全部 | 下载或解压后的 ZIP 文件超过 100 MiB，或超过 50,000 个文件。 |

这些检查位于核心的 `marketplace` 集成中：[`homeassistant/components/marketplace/repositories/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/marketplace/repositories)。
