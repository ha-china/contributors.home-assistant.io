---
title: 发布仪表盘卡片或插件
description: 打包自定义卡片、卡片功能、徽章或其他 JavaScript 模块，让 Marketplace 能够安装它并在每个仪表盘上加载。
sidebarLabel: 仪表盘卡片和插件
order: 2
---

卡片、卡片功能（card feature）、徽章（badge）、视图布局（view layout）和仪表盘策略（dashboard strategy）都是 Home Assistant 加载到前端的 JavaScript 模块。如何构建它们请参阅前端区域的[自定义卡片及更多](/frontend/custom-ui/)。本页介绍如何打包，以便 Marketplace 能够安装它。

目录、`hacs.json` 和 HACS action 将此类型称为 `plugin`。Marketplace 将其显示为**仪表盘**。它们是同一种东西。

## Marketplace 会用它做什么

当用户安装你的仓库时，Marketplace 会：

1. 将你的 JavaScript 文件及其旁边的其他文件下载到配置文件夹中的 `www/community/<repository name>/`。
2. 将该文件添加为类型为 `module` 的[仪表盘资源](/frontend/custom-ui/resources/)，路径为 `/local/community/<repository name>/<file name>`，并在 URL 中带上版本号，例如 `?v=<id>-1.2.0`。版本号在每次更新时都会变化，这样浏览器会加载新文件而不是缓存的文件。
3. 其余工作交给用户，由用户重新加载浏览器以加载你的模块。

当用户在 YAML 中管理资源时，Marketplace 无法添加资源。安装对话框会向用户显示需要添加的内容。当你的模块已经通过 `frontend` 配置中的 `extra_module_url` 加载时，Marketplace 不会添加资源，因此不会被重复加载。

卸载时，Marketplace 会移除这些文件和资源。

## 以仓库名称命名你的文件

Marketplace 会查找一个文件，并通过文件名找到它。如果 `hacs.json` 中没有 `filename`，它会尝试以下名称，其中 `<name>` 是你的仓库名称：

1. `<name>.js`，并移除 `lovelace-` 前缀。仓库 `lovelace-awesome-card` 对应 `awesome-card.js`。
2. `<name>.js`
3. `<name>.umd.js`
4. `<name>-bundle.js`

它会首先在最新 GitHub release 的资产中查找。如果没有包含这些文件的 release，它会在仓库根目录中查找，然后在 `dist` 文件夹中查找。如果 `hacs.json` 中将 `content_in_root` 设置为 `true`，则只会在根目录中查找。

如果你的卡片需要其他文件，如图片或翻译，请将它们与卡片一起放在 `dist` 中，将它们全部附加到 release 中，或者[将其作为 ZIP 文件发布](#ship-it-as-a-zip-file)。

使用其他名称的文件需要在 `hacs.json` 中指定 `filename`：

```json
{
  "name": "Awesome card",
  "filename": "awesome-card-bundle.js"
}
```

[仓库结构](/marketplace/reference/repository-structure/#dashboard)中有示例。

## 在发布之前先构建

用户得到的就是你发布的文件：Marketplace 不会构建任何东西。将构建好的文件提交到 `dist`，或者更好的做法是，在发布 release 时通过 GitHub Action 进行构建，并将其作为资产附加到 release 上。这样你的仓库只保存源代码，而每个 release 都带有自己的构建产物。

单个打包文件最容易安装。将你的依赖项（例如 Lit）打包进去：前端不会共享它自己的副本，正如[使用哪些工具](/frontend/custom-ui/#which-tools-to-use)中所解释的。

## 将其作为 ZIP 文件发布

当你的卡片包含多个文件时，例如构建时将代码拆分为按需加载的块，请将整个卡片作为一个 ZIP 文件附加到你的 release 中。Release 资产不能包含文件夹，但 ZIP 文件可以，而且用户下载一个文件而不是多个文件。

给 ZIP 文件起一个与你的 JavaScript 文件相同的名称，只是将 `.js` 改为 `.zip`。如果 `hacs.json` 中没有 `filename`，那就是[根据你的仓库名称生成的名称](#以仓库名称命名你的文件)：对于仓库 `awesome-card`，即 `awesome-card.zip`。如果有 `filename`，则使用该名称，因此 `"filename": "my-card.js"` 对应 `my-card.zip`。`hacs.json` 中其他内容不变：`filename` 仍然指定 JavaScript 文件，而不是 ZIP 文件。

将 JavaScript 文件放在 ZIP 文件的根目录中，或放在其根目录下的单个文件夹（如 `dist`）中。Marketplace 会将该文件夹及其中的所有内容解压到你的卡片文件夹中，并将 JavaScript 文件添加为资源：

```text title="awesome-card.zip"
awesome-card.js
chunks/
  editor-a1b2c3.js
  translations/
    en-d4e5f6.js
```

- 当你的 release 同时包含 JavaScript 文件和 ZIP 文件时，Marketplace 会安装 ZIP 文件。
- 当它无法使用 ZIP 文件时，例如 ZIP 文件损坏、过大，或在预期位置找不到 JavaScript 文件，它会安装 release 的其他资产，只要你的 JavaScript 文件是其中之一。如果没有，安装将失败，已安装的版本保持不变。
- ZIP 文件仅来自 release。从你的默认分支或提交安装时，你的卡片来自仓库，如上所述。
- 当 `hacs.json` 中将 `content_in_root` 设置为 `true` 时，Marketplace 不会查看 release 资产，因此也不会使用 ZIP 文件。请移除该设置，或将其设置为 `false`。

Home Assistant 2026.12 是第一个安装 ZIP 文件的版本。更早的版本只查找 JavaScript 文件。为了支持它们，请在 ZIP 文件旁边附加一个单文件构建作为 JavaScript 文件。如果你的 release 只有 ZIP 文件，请在 `hacs.json` 中设置 `"homeassistant": "2026.12.0"`，这样更早的版本就不会被提供该版本。参见[要求 Home Assistant 版本](/marketplace/guides/releases/#require-a-home-assistant-version)。

## 两个卡片不能共享一个文件夹

文件夹以仓库名称命名，不包含所有者。当用户已经安装了来自 `someone/awesome-card` 的卡片时，Marketplace 会拒绝在其旁边安装 `someone-else/awesome-card`。

## 展示它的外观

用户根据卡片的外观来选择卡片。将截图放在你的 README 中，Marketplace 会在你的仓库页面上显示它。目录会检查仪表盘仓库的 README 中是否包含图片。

为了让人们在安装之前试用你的卡片，请在你自己的网站上放置一个[实时演示](/frontend/custom-ui/demo/)，并从你的 README 中链接到它。

## 在你的仓库中检查它

在每次 push 和 pull request 上运行带有 `category: "plugin"` 的 [HACS action](https://github.com/hacs/action)。参见[验证检查](/marketplace/reference/validation/)。

## 将它带入前端

当你的卡片成熟并拥有用户群后，请联系维护者，例如在 [Discord](https://www.home-assistant.io/join-chat/) 上的 **#frontend** 频道，看看它是否应该作为内置功能发布。将新卡片加入前端既是代码决策，也是设计决策：参见[需要设计输入的变更](/frontend/development/review-and-release/#changes-that-need-design-input)。
