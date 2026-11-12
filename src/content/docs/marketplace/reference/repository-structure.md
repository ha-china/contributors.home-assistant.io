---
title: 仓库结构
description: 每种类型的文件应放在仓库中的什么位置，Marketplace 会从仓库安装什么，以及这些内容最终会出现在用户配置的哪里。
order: 2
---

每种类型都需要一个公开的 GitHub 仓库，根目录中包含 `hacs.json` 和 README。除此之外，每种类型都有自己的布局。一个仓库只包含一种类型的一个项目。

## 所有仓库

| 内容 | 原因 |
| --- | --- |
| Public repository on GitHub | The Marketplace and HACS only read public GitHub repositories. |
| `hacs.json` in the root | The Marketplace can not install or update a repository without it. See [hacs.json](/marketplace/reference/hacs-json/). |
| `README.md` | What users read before they install. The Marketplace shows it on the page of your repository, without the parts you [leave out](#leave-part-of-your-readme-out-of-the-marketplace). |
| A description on GitHub | Shown in the list of the Marketplace. Required for the catalog. |
| Topics on GitHub | Help users find your repository. Required for the catalog. |
| Issues turned on | Where users report problems. Required for the catalog. |
| GitHub releases | Recommended for every type, required for templates and for the catalog. See [releases and updates](/marketplace/guides/releases/). |

## 集成（integration）

```text
custom_components/awesome/__init__.py
custom_components/awesome/manifest.json
custom_components/awesome/sensor.py
custom_components/awesome/brand/icon.png
hacs.json
README.md
```

- 每个仓库一个集成，位于 `custom_components/<domain>/`。Marketplace 会取 `custom_components/` 中的第一个文件夹。
- 集成所需的一切都在该文件夹内。
- `manifest.json` 中的 `domain` 只能包含小写字母、数字、下划线和连字符，并且要有 `version`。HACS 还要求提供 `documentation`、`issue_tracker`、`codeowners` 和 `name`。
- 使用 `content_in_root` 时，集成的文件改为放在仓库的根目录中。
- 安装到 `custom_components/<domain>/`。

参见 [自定义集成](/marketplace/guides/integrations/)。

## 仪表盘（dashboard）

```text
dist/awesome-card.js
hacs.json
README.md
```

- 一个以仓库命名的 JavaScript 文件：`<name>.js`、`<name>.umd.js` 或 `<name>-bundle.js`。对于 `<name>.js`，还会尝试去掉名称中的 `lovelace-` 再匹配。其他任何名称都需在 `hacs.json` 的 `filename` 中指定。
- 该文件附加在你最新的 release 上，或位于根目录，或位于 `dist` 中。
- 模块所需的文件（如图片）与它一起放在 `dist` 中，或附加在 release 上。
- 安装到 `www/community/<repository name>/`，并作为仪表盘资源添加。

参见 [仪表盘卡片与插件](/marketplace/guides/dashboard/)。

## 主题（theme）

```text
themes/awesome.yaml
hacs.json
README.md
```

- 一个位于 `themes/` 中的 YAML 文件。HACS 为每个仓库管理一个主题文件。
- 使用 `content_in_root` 时，该文件改为放在仓库的根目录中。
- 必须是有效的 YAML，不能包含 `!include` 或 `!secret` 之类的标签。
- 安装到 `themes/<name of the theme file>/`。

参见 [主题](/marketplace/guides/themes/)。

## 模板（template）

```text
awesome.jinja
hacs.json
README.md
```

- 一个位于根目录的 `.jinja` 文件，其名称在 `hacs.json` 的 `filename` 中指定。不能放在子文件夹中。
- UTF-8 编码，且小于 5 MiB。
- 不使用 `zip_release`。
- 安装到 `custom_templates/`。

参见 [模板宏](/marketplace/guides/templates/)。

## Marketplace 不安装的类型

HACS 还支持 AppDaemon 应用（`apps/`）和 Python 脚本（`python_scripts/`），目录中也有它们的列表。但 Marketplace 不安装这两者。从 2026.11 开始，Home Assistant 还会屏蔽 HACS 自定义集成，因为 Marketplace 已取代它。因此在 2026.11 及更高版本上，这两者都无法安装。

The Marketplace also refuses repositories with [apps](/glossary/app/) for Home Assistant OS. Those are added as an app repository under **Settings** > **Apps** instead: see [create and share a repository](/apps/guides/repository/).

## Leave part of your README out of the Marketplace

Your README is read in two places: on GitHub, where people find your repository, and in the Marketplace, on the page of your repository. Installation instructions, a [My link](/glossary/my-link/) badge, or an install badge help on GitHub, but the page in the Marketplace already has an install button, so there they are in the way. Put the parts that are only for GitHub between two HTML comments, and the Marketplace leaves them out:

```markdown title="README.md"
# Awesome card

<!-- ha-marketplace:exclude-start -->
## Installation

Add this repository in the Marketplace, or install it through HACS.
<!-- ha-marketplace:exclude-end -->

## Configuration
```

GitHub does not show HTML comments, so there the README reads as before.

- A section runs from the start marker to the next end marker. Without an end marker, it runs to the end of the README.
- The spaces inside the markers are optional.
- Markers inside a code block or inline code are text, not markers, so a README can show them as an example.
