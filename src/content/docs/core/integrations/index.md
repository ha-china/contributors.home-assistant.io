---
title: 构建集成
description: 关于集成组成的全部内容，从清单文件（manifest）和配置流程到数据获取、发现和诊断。
order: 10
sidebarGroups:
  - Getting started
  - Setup and configuration
  - Data and updates
  - Discovery
  - Devices and registries
  - Integration features
  - Reference
---

一个[集成（integration）](/glossary/integration/)将 Home Assistant 连接到设备（device）、服务（service）或某种想法。它位于自己的文件夹中，通过清单文件（manifest）描述自身，根据配置条目（config entry）完成设置，并将其数据以实体（entity）的形式交给 Home Assistant。

本部分的文档按任务逐一带你了解所有这些内容。它是为编写 Python 的人准备的。你不必从头读到尾：先从教程开始，当你的集成需要时，再回来查阅其余部分。

> [!TIP]
> 想为新的设备或服务添加支持？请阅读[集成如何融入整体](/core/integrations/concepts/)，然后在[教程](/core/integrations/tutorial/)中构建一个。先确认它是否[属于核心](/core/integrations/create/#does-it-belong-in-core)：项目建议先在 [Marketplace](/marketplace/) 上发布新集成，而且核心中的新集成需要至少达到[质量标准（quality scale）](/core/quality-scale/)的 Bronze 级别。

## 入门

- [集成如何融入整体](/core/integrations/concepts/)：用通俗的语言介绍集成、配置条目、平台、实体、设备、协调器（coordinator）和事件循环。
- [构建你的第一个集成](/core/integrations/tutorial/)：一个完整的集成，从脚手架到拉取请求（pull request），一步一步完成。
- [构建 Python 库](/core/integrations/api-library/)：每个集成与设备或服务通信所用的库。
- [创建集成](/core/integrations/create/)：核心接受哪些内容、脚手架脚本，以及最小可行的集成。
- [文件结构](/core/integrations/file-structure/)：哪个文件做什么，以及 Home Assistant 在哪里查找集成。
- [编写测试](/core/development/tests/)（属于开发工作流程）：如何测试集成，包括夹具（fixture）、模拟（mock）和快照（snapshot）。

## 设置与配置

- [配置条目](/core/integrations/config-entries/)：对集成进行设置、卸载和迁移，并保留其运行时数据。
- [配置流程（config flow）](/core/integrations/config-flow/)：让用户从 UI 中添加你的集成。
- [表单、菜单和进度](/core/integrations/flow-steps/)：构成每个流程的基本模块。
- [选项流程（options flow）](/core/integrations/options-flow/)：让用户更改集成的行为方式。
- [子条目（subentry）](/core/integrations/subentries/)：存储配置条目中可重复的部分，例如位置。
- [重新认证与重新配置](/core/integrations/reauth-reconfigure/)：在不移除集成的情况下修复凭据和连接详情。
- [OAuth 2.0 和应用程序凭据](/core/integrations/oauth2/)：关联用户在云服务上的账户。
- [YAML 配置](/core/integrations/yaml/)：何时仍然允许使用，以及它如何工作。
- [设置失败与异常](/core/integrations/setup-failures/)：在设备离线时进行重试，并抛出正确的错误。

## 数据与更新

- [获取数据](/core/integrations/fetching-data/)：轮询、推送和数据更新协调器（data update coordinator）。
- [事件（event）](/core/integrations/events/)：触发事件，并监听 Home Assistant 中发生的事情。
- [实例 URL](/core/integrations/instance-url/)：找到设备或服务可用于访问 Home Assistant 的 URL。

## 发现

- [发现（discovery）](/core/integrations/discovery/)：Home Assistant 如何发现设备并启动你的配置流程。
- [网络发现](/core/integrations/network-discovery/)：zeroconf、SSDP、DHCP、USB 和网络 API。
- [蓝牙集成](/core/integrations/bluetooth/)：最佳实践和蓝牙 API。
- [获取蓝牙数据](/core/integrations/bluetooth-data/)：由广播驱动的协调器。

## 设备与注册表

- [设备注册表（device registry）](/core/integrations/device-registry/)：注册设备，并对它们进行链接和拆分。
- [实体注册表（entity registry）](/core/integrations/entity-registry/)：查找并迁移你的集成的实体。
- [区域注册表（area registry）](/core/integrations/area-registry/)：Home Assistant 对区域（area）的了解。

## 集成功能

- [动作（action）](/core/integrations/actions/)：注册用户可以从自动化和脚本中调用的动作。
- [设备自动化](/core/integrations/device-automations/)：设备触发器、条件和动作。
- [触发器与条件](/core/integrations/triggers-and-conditions/)：提供自动化触发器和条件。
- [诊断（diagnostics）](/core/integrations/diagnostics/)：让用户下载数据来排查问题。
- [系统健康（system health）](/core/integrations/system-health/)：在系统信息页面上显示你的集成的状态。
- [修复（repairs）](/core/integrations/repairs/)：告知用户存在的问题，并帮助他们修复。
- [请求重启](/core/integrations/restart-required/)：告知 Home Assistant 需要重启才能应用更改。
- [重现状态](/core/integrations/reproduce-state/)：让场景与你的实体协同工作。
- [重大变更（significant change）](/core/integrations/significant-change/)：告知导出器（exporter）哪些状态变更重要。
- [备份](/core/integrations/backup/)：将备份存储在某处，或为备份做准备。
- [媒体源（media source）](/core/integrations/media-source/)：公开可浏览和可播放的媒体。

## 参考

- [清单文件](/core/integrations/manifest/)：`manifest.json` 的每一个键。
- [集成品牌与图片](/core/integrations/brands/)：图标、徽标，以及将集成归入同一个品牌之下。
- [翻译](/core/integrations/translations/)：`strings.json` 的每个部分、引用和占位符。

## 相关主题

- [实体与平台](/core/entities/)：你的集成所提供的实体类型，例如传感器和灯。
- [开发工作流程](/core/development/)：环境、测试、代码风格，以及如何提交你的工作。
- [核心的工作原理](/core/internals/)：`hass` 对象、事件循环，以及集成底层的 API。
- [让你的字符串可翻译](/translate/guides/developers/)：如何编写便于翻译人员处理的字符串。
- [为你的集成编写文档](/writing/guides/integration/)：每个集成在 [home-assistant.io](https://www.home-assistant.io/) 上都有一个页面。

## 与谁交流

- Have a technical question? Start a thread in **#coding-support** on the [Home Assistant Discord](https://www.home-assistant.io/join-chat/). Share a link to your branch, so people can see the code you are asking about.
- Look at a well maintained integration that does something similar. Many integrations at the Platinum tier of the quality scale, like `airgradient`, are good examples of current patterns.
- Not sure if your idea fits Home Assistant? Open a discussion in the [architecture repository](https://github.com/home-assistant/architecture/discussions) before you write a lot of code.
