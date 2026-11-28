# Marketplace 的工作原理

> Marketplace 如何找到你的仓库、检查它、安装它并保持更新，以及蓝图（blueprint）如何在不经过 Marketplace 的情况下共享和更新。

Source: https://www.hasscn.top/contributors/marketplace/how-it-works/

[Marketplace](https://www.hasscn.top/contributors/glossary/marketplace/) 是 Home Assistant Core 中的一个集成（integration），名为 `marketplace`，在 **设置** > **Marketplace** 下有一个面板。它随 Home Assistant 2026.11 一起发布，并且默认启用。本页将带你了解你的作品从 GitHub 仓库到用户 Home Assistant 的全过程，让你知道它在途中经历了什么。

Marketplace 就是 [HACS](https://www.hasscn.top/contributors/glossary/hacs/)，以尽可能少的改动被引入 Home Assistant。[添加它的 pull request](https://github.com/home-assistant/core/pull/183502) 是这样说的，并表示进一步扩展它的想法以后再说。以下所有内容描述的都是 Marketplace 目前在 core 中的样子。它与 HACS 不同的地方，本页会明确指出。

## 目录

Marketplace 展示目录（catalog）中的内容。目录是一份按类型分类的 GitHub 仓库列表，保存在 [hacs/default](https://github.com/hacs/default) 仓库中：一个文件用于集成，一个用于 `plugin`（仪表盘卡片和插件），一个用于主题，一个用于模板。你通过在那里打开一个 pull request 来把你的仓库加进去：参见[进入目录](https://www.hasscn.top/contributors/marketplace/guides/catalog/)。

目录以数据的形式从 `data-v2.hacs.xyz` 提供，与 HACS 使用的数据相同。它包含的不只是列表：还有每个仓库的最新版本、描述、星标数，以及两个被移除的仓库列表：

- **Removed（已移除）**：该仓库不再提供，例如因为它已被放弃或归档。已安装的副本仍可继续工作，但不会再收到更新，并且用户会收到一个说明原因的修复（repair）提示。
- **Critical（严重）**：该仓库有害。Marketplace 会立即卸载它，并重启 Home Assistant。

Marketplace 在启动时读取目录，之后每 6 小时读取一次。

用户也可以添加一个不在目录中的仓库，通过[链接](https://www.hasscn.top/contributors/marketplace/guides/catalog/#the-link-to-your-repository)添加：即自定义仓库。这需要 GitHub 连接，并且该仓库必须满足与目录中仓库相同的要求。Marketplace 会拒绝 core 仓库以及包含应用（app）的仓库。

## 类型

Marketplace 认识四种类型。每种类型在用户的配置文件夹中都有自己的文件夹：

| 类型 | 在目录中 | 安装到 | 安装后 |
| --- | --- | --- | --- |
| 集成 | `integration` | `custom_components/<domain>/` | 如果它有配置流程（config flow）且之前未被加载过，则立即加载。否则会通过修复提示要求重启。 |
| 仪表盘 | `plugin` | `www/community/<repository name>/` | 作为仪表盘资源添加。用户需要刷新浏览器。 |
| 主题 | `theme` | `themes/<theme file name>/` | 主题会被重新加载。 |
| 模板 | `template` | `custom_templates/` | 自定义模板会被重新加载。 |

HACS 还支持 AppDaemon 应用和 Python 脚本。Marketplace 不支持。安装过这些内容的用户会保留文件，但不会再收到更新，并且会有修复提示告知他们这一点。

## 检查内容

Marketplace 在安装每个版本时都会从你仓库的根目录读取 `hacs.json`。没有这个文件，它就无法安装或更新你的仓库。[hacs.json 参考](https://www.hasscn.top/contributors/marketplace/reference/hacs-json/)列出了每一个键。

然后它会在[仓库结构](https://www.hasscn.top/contributors/marketplace/reference/repository-structure/)所描述的位置查找你所属类型的文件。如果文件不在那里，该仓库就不合规，也就无法安装。

在写入文件之后、宣布安装完成之前，它会检查 Home Assistant 能否使用这些文件。当某项检查失败时，安装就会失败，文件会被恢复原样：

- 集成需要一个具有相同 `domain` 的 `manifest.json`，以及一个加载器（loader）能接受的 `version`。
- 主题文件必须是有效的 YAML，不能包含像 `!include` 这样的标签，并且要通过与 `configuration.yaml` 中主题相同的验证。
- 模板文件必须是 UTF-8 编码，且不能超过 Home Assistant 读取的大小限制。
- 仪表盘插件需要其 JavaScript 文件存在。

完整列表（连同 HACS action 的检查）见[验证检查](https://www.hasscn.top/contributors/marketplace/reference/validation/)。

## 版本

当你的仓库有 GitHub release 时，最新 release 的标签就是用户获得的版本。预发布（pre-release）版本只提供给开启了你仓库预发布开关的用户，并且仅在其比你的最新 release 更新时提供。没有 release 时，用户会获得你默认分支的最新提交。[release 指南](https://www.hasscn.top/contributors/marketplace/guides/releases/)有详细说明。

来自目录的版本直接从该版本的 release 资源或归档文件安装，不经过 GitHub API，因此无需 GitHub 连接即可工作。其他版本以及自定义仓库则通过 GitHub API。

每个已安装的仓库都会获得一个[更新实体（update entity）](https://www.home-assistant.io/integrations/update/)，因此新版本会显示在 **设置** > **更新** 下，与 Home Assistant 自身的更新并列。用户可以在那里阅读你的 release 说明。

## Home Assistant 2026.11 之前

在 Marketplace 出现之前，HACS 是一个由用户自行安装的自定义集成。更新后的首次启动时，Marketplace 会接管 HACS 的安装：已安装的仓库、自定义仓库和更新实体会被保留，而 HACS 会被移除。指向 `/hacs` 的链接会打开 Marketplace，仪表盘文件在旧的 `/hacsfiles/` 路径下仍然可以访问。

对于作为发布者的你来说，几乎没有变化。目录、`hacs.json`、文件夹结构以及 [HACS action](https://github.com/hacs/action) 都保持不变。[My Home Assistant](https://www.hasscn.top/contributors/glossary/my-link/) 中类型为 `hacs_repository` 的链接仍然有效，并会在 Marketplace 中打开你的仓库。新的类型是 `marketplace_repository`。

## 蓝图

[蓝图（blueprint）](https://www.hasscn.top/contributors/glossary/blueprint/)不在 Marketplace 中。Home Assistant 通过 URL 导入它们：

- [社区论坛](https://community.home-assistant.io/)上的一个主题。Home Assistant 会从第一个帖子中提取第一个包含蓝图的 YAML 代码块。
- GitHub 上的一个文件，或一个 GitHub gist。
- home-assistant.io 上的一个 YAML 文件。
- 任何其他返回蓝图 YAML 的 URL。当 URL 不在 GitHub 或 Home Assistant 网站上时，导入对话框会警告用户。

Home Assistant 会将 URL 保存在蓝图中，作为 `source_url`。这个 URL 就是更新的工作方式：用户选择 **重新导入蓝图**，Home Assistant 会从同一位置重新下载蓝图，并覆盖已有的副本。基于该蓝图构建的自动化和脚本从那时起就会使用新版本。没有更新实体，也没有新版本存在的通知：用户在听说有新版本时才会重新导入。[蓝图指南](https://www.hasscn.top/contributors/marketplace/guides/blueprints/)解释了如何在不破坏他人已有成果的情况下修改蓝图。
