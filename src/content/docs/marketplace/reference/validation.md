---
title: 校验检查
description: 每次推送时检查你的仓库的 HACS action，以及 Marketplace 在判定安装完成之前运行的检查。
order: 3
---

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
| `integration_categories` | 集成清单（manifest）中的 `categories` 有效：为已知的[集成类别](/core/integrations/categories/)，一到三个，且无重复。没有 `categories` 的清单只会收到警告。 |
| `issues` | Issue 功能已开启。 |
| `topics` | 仓库有主题（topics）。 |

[目录审查](/marketplace/guides/catalog/#what-the-review-checks)会运行比这些更多的检查。

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
| `hacs.json` in the root | All | A repository without it can not be installed or updated. |
| Not archived, not removed | All | An archived repository can not be installed, and neither can most repositories the catalog removed. |
| Files in the right place | All | No files where the [repository structure](/marketplace/reference/repository-structure/) says they go. |
| Minimum Home Assistant version | All with releases | The release needs a newer Home Assistant than the user has. The user is offered older versions instead. |
| Domain | Integration | A `domain` in `manifest.json` with other characters than lowercase letters, numbers, underscores, and hyphens. |
| Owner of the domain | Integration | Another installed repository has the same domain. |
| Replaces a built-in integration | Integration | The domain is one of core, and the user did not confirm. |
| Loadable manifest | Integration | After writing: the `manifest.json` has another domain, or no `version` the loader accepts. |
| Owner of the folder | Dashboard, theme | Another installed repository uses the same folder. |
| Module present | Dashboard | After writing: the JavaScript file is missing. |
| ZIP file of the module | Dashboard | A release asset named like the JavaScript file, ending in `.zip`, is damaged, too large, has a file outside the folder of the card, or has no JavaScript file in its root or in a single folder at its root. The Marketplace installs the other assets of the release instead, and fails when the JavaScript file is not one of them. |
| Theme YAML | Theme | After writing: a YAML file with tags, or one that does not pass the validation of themes. |
| Template file | Template | `filename` is not a `.jinja` file in the root, `zip_release` is set, or another repository has a file with that name. After writing: the file is not UTF-8, or larger than 5 MiB. |
| Download size | All | A download, or a ZIP file unpacked, of more than 100 MiB, or more than 50,000 files. |

这些检查位于核心的 `marketplace` 集成中：[`homeassistant/components/marketplace/repositories/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/marketplace/repositories)。
