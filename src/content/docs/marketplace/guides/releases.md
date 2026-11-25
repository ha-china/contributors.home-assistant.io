---
title: 发布与更新
description: 用户如何通过 Marketplace 获取你的新版本、如何发布预发布版本，以及如何防止某个发布版本被推送到过旧的 Home Assistant 上。
sidebarLabel: 发布与更新
order: 6
---

Marketplace 的用户可以在 **设置** > **更新** 中获取你的更新，与 Home Assistant 本身的更新并列。每个已安装的仓库都有一个更新实体（entity），其中包含你的发布说明。本页解释这些版本从何而来，以便你控制用户获取的内容。

这适用于集成（integration）、仪表盘（dashboard）插件、主题和模板。蓝图（blueprint）没有发布版本：请参阅[在不破坏蓝图的情况下修改它](/marketplace/guides/blueprints/#change-it-without-breaking-it)。

## 发布 GitHub release

你的版本号就是最新 GitHub release 的标签（tag）。仅有标签是不够的：它必须是一个已发布的 release。

如果没有任何 release，用户将获得你默认分支的最新提交，他们看到的版本号是一个提交哈希。这虽然可行，但用户无法区分一个小修复和一次重写。HACS 要求模板以及所有想进入目录的仓库必须有 release。

对于集成，请确保 `manifest.json` 中的版本与标签中的版本一致。Marketplace 拒绝安装清单中没有 `version` 的集成。

## 撰写发布说明

更新实体会显示你的 release 说明：即 GitHub release 的正文。用户正是在这里决定是立即更新还是稍后更新。说明改动了什么，并把用户需要先做的任何事情（例如选项变更或实体被移除）放在最前面。

## 发布版本如何到达用户

1. 你在 GitHub 上发布一个 release。
2. 目录会收录它。目录的 HACS 数据每 4 小时生成一次。
3. Marketplace 每 6 小时读取一次目录，更新实体随后显示新版本。

因此，一个 release 可能需要几个小时才会出现。通过链接添加了你仓库的用户则改为通过 GitHub API 获取更新，每 48 小时一次，且仅在连接了 GitHub 的情况下才会获取。

## 预发布版本

在 GitHub 上将一个 release 标记为预发布版本（pre-release），以便与愿意参与测试的用户一起测试。只有当用户打开你仓库的 **预发布版本** 开关时才会收到它，并且仅在该版本比你的最新正式版本更新时才会收到。

## 要求特定的 Home Assistant 版本

当某个 release 需要更新的 Home Assistant 时，请在该 release 的 `hacs.json` 中设置 `homeassistant`：

```json title="hacs.json"
{
  "name": "My integration",
  "homeassistant": "2026.11.0"
}
```

Marketplace 不会向使用较旧 Home Assistant 的用户提供该 release。当他们安装时，会显示可用的较早版本。若要同时允许该版本的 beta 版，请添加 `b0`，例如 `"2026.11.0b0"`。这仅适用于有 release 的仓库。

## 以 ZIP 文件形式发布

集成可以以附加到每个 release 的 ZIP 文件形式发布，而不是使用仓库中的文件。将 `zip_release` 设置为 `true`，并将 `filename` 设置为该资源的名称：

```json title="hacs.json"
{
  "name": "My integration",
  "zip_release": true,
  "filename": "my_integration.zip"
}
```

Marketplace 会下载该资源并将其解压到集成文件夹中。当你在发布工作流中构建或生成文件时，可以使用此方式。HACS 仅对集成支持此功能，Marketplace 拒绝对模板使用此方式。

仪表盘卡片不使用 `zip_release`。它们随附一个与其 JavaScript 文件同名的 ZIP 文件，通常以仓库命名：对于 `awesome-card`，即 `awesome-card.zip`。请参阅[以 ZIP 文件形式发布](/marketplace/guides/dashboard/#ship-it-as-a-zip-file)。

## 旧版本

用户可以从 Marketplace 中你仓库的菜单安装最新版本以外的其他版本。他们会从你的 release 中选择，因此请保留旧的 release。

## 安全地移除一个 release

如果你删除了一个 release 或其标签，已安装该版本的用户会保留他们的文件。当 Marketplace 在 GitHub 上再也找不到某个版本时，它会回退到默认会安装的版本。
