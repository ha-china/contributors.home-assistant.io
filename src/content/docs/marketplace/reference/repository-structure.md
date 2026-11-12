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

Marketplace 还会拒绝包含适用于 Home Assistant OS 的 [应用（app）](/glossary/app/) 的仓库。这些应用会作为应用仓库添加到 **设置** > **应用** 下：参见 [创建并分享仓库](/apps/guides/repository/)。

## 在 Marketplace 中省略 README 的部分内容

你的 README 会在两个地方被阅读：在 GitHub 上，人们在那里找到你的仓库；以及在 Marketplace 中，在你的仓库页面上。安装说明、[我的链接（My link）](/glossary/my-link/) 徽章或安装徽章在 GitHub 上有帮助，但 Marketplace 中的页面已经有安装按钮，所以这些内容在那里会碍事。将仅用于 GitHub 的部分放在两个 HTML 注释之间，Marketplace 就会省略它们：

```markdown title="README.md"
# Awesome card

<!-- ha-marketplace:exclude-start -->
## Installation

Add this repository in the Marketplace, or install it through HACS.
<!-- ha-marketplace:exclude-end -->

## Configuration
```

GitHub 不显示 HTML 注释，所以 README 在那里读起来和以前一样。

- 一个区块从开始标记运行到下一个结束标记。如果没有结束标记，则运行到 README 的末尾。
- 标记内的空格是可选的。
- 代码块或行内代码中的标记是文本，而不是标记，因此 README 可以将它们作为示例展示。
