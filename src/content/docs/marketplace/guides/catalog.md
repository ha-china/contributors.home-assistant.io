---
title: 进入目录
description: 将你的仓库添加到 Marketplace 和 HACS 向所有人展示的目录中，了解审查会检查什么，以及重命名和移除是如何运作的。
sidebarLabel: 进入目录
order: 7
source: https://github.com/hacs/documentation/blob/main/source/docs/publish/include.md
lastVerified: 2026-10-12
---

任何用户都可以通过链接添加你的仓库。要让它在没有链接的情况下对所有人显示，它需要被收录进目录。目录是 [hacs/default](https://github.com/hacs/default) 仓库，由 HACS 团队维护，Marketplace 读取同一个目录。你通过一个 pull request 即可加入。

请做好等待的准备。HACS 文档对此很坦诚：新收录的审查需要数月时间。你可以在[积压列表](https://github.com/hacs/default/pulls?q=is%3Apr+is%3Aopen+draft%3Afalse+sort%3Acreated-asc)中查看你的 pull request 的进度。在此期间，用户仍然可以通过链接添加你的仓库。

## 你的仓库的链接

用户用来添加你的仓库的链接是一个 [My link](/glossary/my-link/)。它会在他们自己的 Home Assistant 的 Marketplace 中打开你的仓库。当 Marketplace 还不知道你的仓库，且链接中指明了其类别时，它会先提议将其添加为自定义仓库。类别为 `integration`、`plugin`、`template` 或 `theme`，与目录中对应类型的文件相同。

[My link 创建器](https://my.home-assistant.io/create-link/?redirect=marketplace_repository)会根据你仓库的所有者、名称和类别生成链接。将徽章放入你的 README 中：

```markdown
[![Open your Home Assistant instance and open a repository in the Marketplace.](https://my.home-assistant.io/badges/marketplace_repository.svg)](https://my.home-assistant.io/redirect/marketplace_repository/?owner=me&repository=my-card&category=plugin)
```

`marketplace_repository` 链接是 Home Assistant 2026.11 中新增的。较旧的 `hacs_repository` 链接接受相同的 `owner`、`repository` 和 `category`。它在 2026.11 之前打开 HACS，之后打开 Marketplace，因此可以覆盖两边的用户。HACS 在其 [My Home Assistant](https://hacs.xyz/docs/use/my/) 页面上对此进行了说明。

> [!TIP]
> The badge is for GitHub. On the page of your repository in the Marketplace, users already have an install button. Mark the badge, and any installation steps, to [leave them out of the Marketplace](/marketplace/reference/repository-structure/#leave-part-of-your-readme-out-of-the-marketplace).

## Who can submit

只有仓库的所有者或主要贡献者才能提交。

仅用于测试核心集成的 alpha 或 beta 版本的集成，或者替换核心集成的集成，不会被接受。用户仍然可以通过链接添加它们。

## 在打开 pull request 之前

1. 确保你的仓库满足[其类型的要求](/marketplace/reference/repository-structure/)，并且有描述、topics、已开启的 issues 以及 README。
2. 将 [HACS action](https://github.com/hacs/action) 添加到你的仓库，并使其在不忽略任何检查的情况下通过。参见[验证检查](/marketplace/reference/validation/)。
3. 对于集成，添加 [hassfest action](https://github.com/home-assistant/actions#hassfest)，并使其也通过。
4. 在两者都通过后，发布一个完整的 GitHub release。仅有 tag 是不够的。

## 打开 pull request

1. Fork [hacs/default](https://github.com/hacs/default)，并从 `master` 创建一个新分支。不要直接在 `master` 上工作。
2. 将你的仓库以 `owner/repository` 的形式添加到其对应类型的文件中：`integration`、`plugin`、`theme` 或 `template`。每个文件都是一个 JSON 列表。按字母顺序添加你的仓库，而不是加在末尾。
3. 从你自己的账户（而不是组织）打开 pull request，以便 HACS 团队可以编辑它。
4. 完整填写 pull request 模板：检查清单、指向你最新 release 的链接、指向一次未使用 `ignore` 且通过的 HACS action 运行的链接，对于集成，还需要指向一次通过的 hassfest 运行的链接。

模板填写不完整或包含不实陈述的 pull request 会被直接关闭，不予通知。请求他人审查的 pull request 也是如此。有小问题的仓库，其 pull request 会被设为草稿：修复问题后，再次将其标记为准备好接受审查。有重大问题则会关闭。

这些文件中还有 `appdaemon`、`python_script` 和 `netdaemon` 列表。HACS 仍然会读取它们，但 Marketplace 不会安装这些类型。

## 审查会检查什么

当你的 pull request 进入审查时，会运行自动化检查。所有检查都必须通过，除非 HACS 团队在你打开之前另有约定：

| 检查 | 检查内容 |
| --- | --- |
| Brands | 仅限集成。一个至少包含 `icon.png` 的 `brand` 文件夹，或者在 [brands 仓库](https://github.com/home-assistant/brands)中该域名的图片。 |
| Manifest | 仅限集成。一个有效的 `manifest.json`，包含 `domain`、`documentation`、`issue_tracker`、`codeowners`、`name` 和 `version`。 |
| HACS validation | HACS 对仓库运行的相同验证。 |
| HACS manifest | 一个至少包含 `name` 的 `hacs.json`。 |
| Archived | 仓库未被归档。 |
| Releases | 至少有一个 release。 |
| Owner | 你拥有该仓库，或者是主要贡献者。 |
| Images | 仅限仪表盘插件和主题。README 中有图片。 |
| Repository | 有描述、已开启的 issues 以及 topics。 |
| Lint | 你修改的文件是有效的 JSON，并且已排序。 |

在你的 pull request 合并后，你的仓库将被包含在下一次计划扫描中。

## 重命名或移动你的仓库

当你重命名你的仓库，或将其转移到另一个账户时，你不需要做任何事情。HACS 团队会更新目录。

## 将其移除

当你在 GitHub 上归档你的仓库时，HACS 团队会将其从目录中移除。已安装它的用户会保留它，但不会再收到更新，并且一个修复提示会告知他们原因。

如果因其他原因需要将其移除，请在 [hacs/integration](https://github.com/hacs/integration/issues/new?template=removal.yml) 中使用 **Request for repository removal** 模板打开一个 issue。请在删除仓库之前这样做：如果你删除了一个已在目录中的仓库，你将来将无法向目录添加任何仓库。

仓库在被放弃、破坏 Home Assistant、窃取凭据或被删除时也会被移除。有害的仓库会被标记为 critical：Marketplace 随后会立即从每一台安装了它的 Home Assistant 中将其卸载。
