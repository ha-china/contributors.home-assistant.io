---
title: "仪表盘卡片可以以 ZIP 文件形式发布"
description: 从 Home Assistant 2026.12 开始，Marketplace 可以从一个 ZIP 文件安装仪表盘卡片。如何发布这样的文件，以及为什么目前需要保留一个备用方案。
date: 2026-11-24
authors:
  - Wendelin Peleska
areas:
  - marketplace
  - frontend
---

较大的卡片很少能再容纳在单个 JavaScript 文件中。它们将代码拆分为按需加载的块，并附带翻译或图片。作为发布资产，所有这些都必须是彼此相邻的平面文件，用户需要下载每一个文件。

从 Home Assistant 2026.12 开始，Marketplace 可以从一个 ZIP 文件安装您的整个卡片。

## 工作原理

在您的发布中附加一个 ZIP 文件，其名称与您的 JavaScript 文件相同，但扩展名为 `.zip` 而不是 `.js`。这通常是您仓库的名称：例如，对于 `awesome-card`，文件名为 `awesome-card.zip`。如果在 `hacs.json` 中设置了 `filename`，则使用该名称。将 JavaScript 文件放在 ZIP 的根目录，或放在根目录下的单个文件夹（如 `dist`）中。`hacs.json` 无需任何更改。

```text title="awesome-card.zip"
awesome-card.js
chunks/
  editor-a1b2c3.js
  translations/
    en-d4e5f6.js
```

Marketplace 会将 ZIP 文件解压到您的卡片文件夹中（包括文件夹结构），并将 JavaScript 文件添加为仪表盘资源，与以往一样。[以 ZIP 文件形式发布](/marketplace/guides/dashboard/#ship-it-as-a-zip-file) 中有详细说明。

已经在发布中附加了与您的卡片同名的 ZIP 文件？那么从 2026.12 开始，您的用户将获得该文件，前提是 `hacs.json` 中没有将 `content_in_root` 设置为 `true`。如果已设置，请移除该设置或将其设置为 `false`，以便 Marketplace 查看发布资产。

## 暂时保留单文件构建

较早版本的 Home Assistant 不知道 ZIP 文件，只会查找 JavaScript 文件。因此，目前我们建议您在每次发布中同时附加两个文件：

- `awesome-card.zip`：包含分块代码的卡片，2026.12 及更高版本将安装此文件。
- `awesome-card.js`：单文件构建，较早版本将安装此文件。

两者安装后都作为 `awesome-card.js`，因此无论哪种方式，仪表盘资源都是相同的。单文件构建也是当 Marketplace 无法使用您的 ZIP 文件（例如文件损坏）时的备用方案。

何时放弃单文件构建由您决定。这取决于您希望支持的最早的 Home Assistant 版本，以及维护额外构建所需的成本。作为起点，我们建议保留大约六个月。一旦您放弃它，请在 `hacs.json` 中设置 `"homeassistant": "2026.12.0"`，这样较早版本就不会被提供无法安装的发布。请参阅[要求 Home Assistant 版本](/marketplace/guides/releases/#require-a-home-assistant-version)。
