---
title: 仓库结构
description: 每种类型的文件应放在仓库中的什么位置，Marketplace 会从仓库安装什么，以及这些内容最终会出现在用户配置的哪里。
order: 2
---

每种类型都需要一个公开的 GitHub 仓库，根目录中包含 `hacs.json` 和 README。除此之外，每种类型都有自己的布局。一个仓库只包含一种类型的一个项目。

## 所有仓库

| 内容 | 原因 |
| --- | --- |
| GitHub 上的公开仓库 | Marketplace 和 HACS 只读取公开的 GitHub 仓库。 |
| 根目录中的 `hacs.json` | 没有它，Marketplace 无法安装或更新仓库。参见 [hacs.json](/marketplace/reference/hacs-json/)。 |
| `README.md` | 用户在安装前阅读的内容。Marketplace 会在你的仓库页面上显示它，但不包括你[在 Marketplace 中省略的部分](#leave-part-of-your-readme-out-of-the-marketplace)。 |
| GitHub 上的描述 | 显示在 Marketplace 的列表中。目录（catalog）必需。 |
| GitHub 上的主题（Topics） | 帮助用户找到你的仓库。目录（catalog）必需。 |
| 开启 Issues | 用户在此报告问题。目录（catalog）必需。 |
| GitHub Releases | 建议所有类型都使用，模板和目录（catalog）必需。参见 [发布与更新](/marketplace/guides/releases/)。 |

## 将 README 的部分内容排除在 Marketplace 之外

你的 README 承担两项工作。在 GitHub 上，它是人们找到你仓库的地方，因此它告诉他们如何安装，通常带有 [My 链接](/glossary/my-link/) 徽章或安装徽章。在 Marketplace 中，它显示在你的仓库页面上，位于安装按钮的正下方。在那里，这些安装步骤会碍事。

将仅用于 GitHub 的部分放在两个 HTML 注释之间，Marketplace 会将其排除：

```markdown title="README.md"
# 3D printer dashboard

Keep an eye on every print: progress, temperatures, and the camera...

<!-- ha-marketplace:exclude-start -->
## Installation

Add this repository in the Marketplace, or install it through HACS.
<!-- ha-marketplace:exclude-end -->

...

## Configuration

...
```

GitHub 不显示 HTML 注释，因此你的 README 在那里照常显示。

- 一个区块从起始标记开始，到下一个结束标记结束。如果没有结束标记，则一直延伸到 README 的末尾。
- 标记内的空格是可选的，因此 `<!--ha-marketplace:exclude-start-->` 也可以。
- 代码块或行内代码中的标记是文本，不是标记。这样，模板 README 可以将其作为示例展示。
- 你可以标记任意数量的区块。

从 Home Assistant 2026.12 开始，Marketplace 会排除标记的区块。旧版本会显示整个 README，因此你现在就可以添加标记。

## 集成

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

- 一个以仓库命名的 JavaScript 文件：`<name>.js`、`<name>.umd.js` 或 `<name>-bundle.js`。对于 `<name>.js`，也会尝试去掉 `lovelace-` 前缀的名称。任何其他名称都放在 `hacs.json` 的 `filename` 中。
- 该文件附加在你的最新发布中，或位于根目录，或位于 `dist` 中。发布也可以将其打包在[以它命名的 ZIP 文件](/marketplace/guides/dashboard/#ship-it-as-a-zip-file)中，这需要 Home Assistant 2026.12 或更高版本。
- 模块所需的文件（如图像）与它一起放在 `dist` 中，附加在发布中，或位于 ZIP 文件中。
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

Marketplace 还会拒绝包含 [应用（app）](/glossary/app/) 的仓库，这些应用适用于 Home Assistant OS。它们会作为应用仓库添加到 **设置** > **应用** 下：参见 [创建并分享仓库](/apps/guides/repository/)。
