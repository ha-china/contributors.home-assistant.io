---
title: 发布自定义集成
description: 当你的集成位于独立仓库而不是 core 中时有什么不同，以及 Marketplace 对它的要求。
sidebarLabel: 自定义集成
order: 1
---

[自定义集成](/glossary/custom-integration/)的构建方式与 core 中的集成相同。[构建集成](/core/integrations/)中的所有内容都适用：manifest、配置流程、实体（entity）、获取数据和测试。本页只介绍你自己发布时有什么不同。

对于新集成，Marketplace 是推荐的起点，即使你希望有一天它能进入 core 也是如此。参见[它是否属于 core](/core/integrations/create/#does-it-belong-in-core)。

## 放在独立的仓库中

一个仓库只放一个集成，位于 `custom_components/<domain>/`：

```text
custom_components/my_integration/__init__.py
custom_components/my_integration/manifest.json
custom_components/my_integration/sensor.py
custom_components/my_integration/translations/en.json
custom_components/my_integration/brand/icon.png
hacs.json
README.md
```

Marketplace 会安装它在 `custom_components/` 下找到的第一个文件夹，安装到用户配置文件夹中的 `custom_components/<domain>/`。集成所需的每个文件都必须位于该文件夹内。[仓库结构](/marketplace/reference/repository-structure/#integrations)列出了它接受的其他布局。

## manifest

自定义集成需要两个 core 中的集成会省略的键：

- `version`：必填。如果加载器无法接受版本号，Marketplace 会拒绝安装。使用与你发布标签相同的版本号。
- `issue_tracker`：用户报告 bug 的地方。HACS 要求目录中的集成提供它。

`documentation` 指向你自己的文档，比如你的 README。[manifest 参考](/core/integrations/manifest/#custom-integrations-only)中有详细信息。

只列出那些还不是 Home Assistant 本身依赖的 `requirements`。

## 类别

在 manifest 中添加 `categories`：一到三个[集成类别](/glossary/integration-category/)，说明你的集成是做什么的。自定义集成不需要它们，但目录会在为 Marketplace 发布的数据中包含它们。

```json title="manifest.json"
{
  "categories": ["energy.ev_charging"]
}
```

选择方式与 core 中的集成相同。[集成类别](/core/integrations/categories/)列出了所有类别以及如何选择。HACS action 会检查它们：缺少该键是警告，未知类别会导致检查失败。

## 选择属于你的 domain

`domain` 是文件夹名称，也是 Home Assistant 识别你的集成的标识。选择一个 core 中没有集成使用的名称。

使用与内置集成相同 domain 的自定义集成会替换它。Home Assistant 允许这样做，但用户会失去内置集成的更新，并且 Marketplace 会要求用户在安装前确认。目录不接受替换 core 集成的集成。用户仍然可以通过链接添加它们。

两个仓库不能安装相同的 domain。当用户已经安装了其中一个时，Marketplace 会拒绝另一个。

## 翻译

自定义集成不使用 `strings.json`，也不会在 Lokalise 上翻译。请在 `translations/` 中提供已完成的文件，并包含完整的 `en.json`。参见[自定义集成的翻译](/core/integrations/translations/#custom-integrations)。

## 品牌图片

把你的图标和 logo 放在集成文件夹内的 `brand/` 文件夹中。一旦你的集成被安装，Home Assistant 就会显示它们。在此之前 Marketplace 也会显示它们：brands 网站会从目录中每个集成的最新发布中获取它们。

不要使用 Home Assistant 品牌的图片。用户会把你的集成误认为是官方的。[brands 页面](/core/integrations/brands/#brand-images-for-custom-integrations)列出了图片的名称和尺寸。

## 在更新时保留用户文件

更新会替换整个集成文件夹。如果你的集成在该文件夹中写入了用户需要保留的文件，请把它们放在一个子文件夹中，并在 `hacs.json` 中指定名称：

```json
{
  "name": "My integration",
  "persistent_directory": "userfiles"
}
```

Marketplace 会在更新期间把该文件夹移开，更新后再放回原处。

## 重启

首次安装时，带有配置流程的集成会立即加载，因此用户无需重启即可添加它。通过 YAML 设置的集成需要重启，Home Assistant 已加载的集成在每次更新或移除时也需要重启。Marketplace 会为此创建一个修复项，并带有重启按钮。

## 链接到设置

一旦你的集成被安装，[My 链接](/glossary/my-link/)可以让用户直接进入它的设置。`config_flow_start` 链接会在用户自己的 Home Assistant 中启动你指定的 domain 的[配置流程](/glossary/config-flow/)。[My 链接创建器](https://my.home-assistant.io/create-link/?redirect=config_flow_start)可以为你的 README 生成徽章：

```markdown
[![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=my_integration)
```

要在 Marketplace 中链接到你的仓库，以便用户先安装它，参见[指向你仓库的链接](/marketplace/guides/catalog/#the-link-to-your-repository)。

## 在你的仓库中进行检查

在每次推送和拉取请求上运行两个 GitHub Actions：

- [hassfest](https://github.com/home-assistant/actions#hassfest) 检查你的 manifest、翻译以及集成的其他文件。
- 使用 `category: "integration"` 的 [HACS action](https://github.com/hacs/action) 检查目录所需的内容。参见[验证检查](/marketplace/reference/validation/)。

两者都必须通过才能[进入目录](/marketplace/guides/catalog/)。

## 跟上 Home Assistant 的步伐

core 中的更改可能会破坏自定义集成。对自定义集成所使用的 core 内容（如辅助元素（helper）、常量和实体属性）的更改，会先被弃用 12 个月，并在[博客](/blog/)上公布。[弃用政策](/core/development/deprecating/#developer-facing-deprecations)中有详细信息。针对[测试版](/releases/)测试你的集成，当某个发布需要更新的 Home Assistant 时，在 `hacs.json` 中设置 `homeassistant`。参见[发布与更新](/marketplace/guides/releases/)。

[集成质量分级](/core/quality-scale/)没有针对自定义集成的级别，但它的规则仍然是很好的指南。

## 将它带入 core

一旦你的集成成熟并拥有用户群，请在 [Discord](https://www.home-assistant.io/join-chat/) 的 **#developers** 频道询问它是否应该内置。[它是否属于 core](/core/integrations/create/#does-it-belong-in-core) 列出了 core 的要求，而 core 中的每个新集成都需要质量分级的 [Bronze 规则](/core/quality-scale/rules/#bronze)。

本页中的一些差异在 core 中会反过来。例如，品牌图片要放到 [brands 仓库](/core/integrations/brands/)中，翻译则来自 `strings.json`。
