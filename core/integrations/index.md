# 构建集成

> 关于集成组成的全部内容，从清单文件（manifest）和配置流程到数据获取、发现和诊断。

Source: https://www.hasscn.top/contributors/core/integrations/

一个[集成（integration）](https://www.hasscn.top/contributors/glossary/integration/)将 Home Assistant 连接到设备（device）、服务（service）或某种想法。它位于自己的文件夹中，通过清单文件（manifest）描述自身，根据配置条目（config entry）完成设置，并将其数据以实体（entity）的形式交给 Home Assistant。

本部分的文档按任务逐一带你了解所有这些内容。它是为编写 Python 的人准备的。你不必从头读到尾：先从教程开始，当你的集成需要时，再回来查阅其余部分。

> [!TIP]
> 想为新的设备或服务添加支持？请阅读[集成如何融入整体](https://www.hasscn.top/contributors/core/integrations/concepts/)，然后在[教程](https://www.hasscn.top/contributors/core/integrations/tutorial/)中构建一个。先确认它是否[属于核心](https://www.hasscn.top/contributors/core/integrations/create/#does-it-belong-in-core)：项目建议先在 [Marketplace](https://www.hasscn.top/contributors/marketplace/) 上发布新集成，而且核心中的新集成需要至少达到[质量标准（quality scale）](https://www.hasscn.top/contributors/core/quality-scale/)的 Bronze 级别。

## 入门

- [集成如何融入整体](https://www.hasscn.top/contributors/core/integrations/concepts/)：用通俗的语言介绍集成、配置条目、平台、实体、设备、协调器（coordinator）和事件循环。
- [构建你的第一个集成](https://www.hasscn.top/contributors/core/integrations/tutorial/)：一个完整的集成，从脚手架到拉取请求（pull request），一步一步完成。
- [构建 Python 库](https://www.hasscn.top/contributors/core/integrations/api-library/)：每个集成与设备或服务通信所用的库。
- [创建集成](https://www.hasscn.top/contributors/core/integrations/create/)：核心接受哪些内容、脚手架脚本，以及最小可行的集成。
- [文件结构](https://www.hasscn.top/contributors/core/integrations/file-structure/)：哪个文件做什么，以及 Home Assistant 在哪里查找集成。
- [编写测试](https://www.hasscn.top/contributors/core/development/tests/)（属于开发工作流程）：如何测试集成，包括夹具（fixture）、模拟（mock）和快照（snapshot）。

## 设置与配置

- [配置条目](https://www.hasscn.top/contributors/core/integrations/config-entries/)：对集成进行设置、卸载和迁移，并保留其运行时数据。
- [配置流程（config flow）](https://www.hasscn.top/contributors/core/integrations/config-flow/)：让用户从 UI 中添加你的集成。
- [表单、菜单和进度](https://www.hasscn.top/contributors/core/integrations/flow-steps/)：构成每个流程的基本模块。
- [选项流程（options flow）](https://www.hasscn.top/contributors/core/integrations/options-flow/)：让用户更改集成的行为方式。
- [子条目（subentry）](https://www.hasscn.top/contributors/core/integrations/subentries/)：存储配置条目中可重复的部分，例如位置。
- [重新认证与重新配置](https://www.hasscn.top/contributors/core/integrations/reauth-reconfigure/)：在不移除集成的情况下修复凭据和连接详情。
- [OAuth 2.0 和应用程序凭据](https://www.hasscn.top/contributors/core/integrations/oauth2/)：关联用户在云服务上的账户。
- [YAML 配置](https://www.hasscn.top/contributors/core/integrations/yaml/)：何时仍然允许使用，以及它如何工作。
- [设置失败与异常](https://www.hasscn.top/contributors/core/integrations/setup-failures/)：在设备离线时进行重试，并抛出正确的错误。

## 数据与更新

- [获取数据](https://www.hasscn.top/contributors/core/integrations/fetching-data/)：轮询、推送和数据更新协调器（data update coordinator）。
- [事件（event）](https://www.hasscn.top/contributors/core/integrations/events/)：触发事件，并监听 Home Assistant 中发生的事情。
- [实例 URL](https://www.hasscn.top/contributors/core/integrations/instance-url/)：找到设备或服务可用于访问 Home Assistant 的 URL。

## 发现

- [发现（discovery）](https://www.hasscn.top/contributors/core/integrations/discovery/)：Home Assistant 如何发现设备并启动你的配置流程。
- [网络发现](https://www.hasscn.top/contributors/core/integrations/network-discovery/)：zeroconf、SSDP、DHCP、USB 和网络 API。
- [蓝牙集成](https://www.hasscn.top/contributors/core/integrations/bluetooth/)：最佳实践和蓝牙 API。
- [获取蓝牙数据](https://www.hasscn.top/contributors/core/integrations/bluetooth-data/)：由广播驱动的协调器。

## 设备与注册表

- [设备注册表（device registry）](https://www.hasscn.top/contributors/core/integrations/device-registry/)：注册设备，并对它们进行链接和拆分。
- [实体注册表（entity registry）](https://www.hasscn.top/contributors/core/integrations/entity-registry/)：查找并迁移你的集成的实体。
- [区域注册表（area registry）](https://www.hasscn.top/contributors/core/integrations/area-registry/)：Home Assistant 对区域（area）的了解。

## 集成功能

- [动作（action）](https://www.hasscn.top/contributors/core/integrations/actions/)：注册用户可以从自动化和脚本中调用的动作。
- [设备自动化](https://www.hasscn.top/contributors/core/integrations/device-automations/)：设备触发器、条件和动作。
- [触发器与条件](https://www.hasscn.top/contributors/core/integrations/triggers-and-conditions/)：提供自动化触发器和条件。
- [诊断（diagnostics）](https://www.hasscn.top/contributors/core/integrations/diagnostics/)：让用户下载数据来排查问题。
- [系统健康（system health）](https://www.hasscn.top/contributors/core/integrations/system-health/)：在系统信息页面上显示你的集成的状态。
- [修复（repairs）](https://www.hasscn.top/contributors/core/integrations/repairs/)：告知用户存在的问题，并帮助他们修复。
- [请求重启](https://www.hasscn.top/contributors/core/integrations/restart-required/)：告知 Home Assistant 需要重启才能应用更改。
- [重现状态](https://www.hasscn.top/contributors/core/integrations/reproduce-state/)：让场景与你的实体协同工作。
- [重大变更（significant change）](https://www.hasscn.top/contributors/core/integrations/significant-change/)：告知导出器（exporter）哪些状态变更重要。
- [备份](https://www.hasscn.top/contributors/core/integrations/backup/)：将备份存储在某处，或为备份做准备。
- [媒体源（media source）](https://www.hasscn.top/contributors/core/integrations/media-source/)：公开可浏览和可播放的媒体。

## 参考

- [清单文件](https://www.hasscn.top/contributors/core/integrations/manifest/)：`manifest.json` 的每一个键。
- [集成品牌与图片](https://www.hasscn.top/contributors/core/integrations/brands/)：图标、徽标，以及将集成归入同一个品牌之下。
- [翻译](https://www.hasscn.top/contributors/core/integrations/translations/)：`strings.json` 的每个部分、引用和占位符。

## 相关主题

- [实体与平台](https://www.hasscn.top/contributors/core/entities/)：你的集成所提供的实体类型，例如传感器和灯。
- [开发工作流程](https://www.hasscn.top/contributors/core/development/)：环境、测试、代码风格，以及如何提交你的工作。
- [核心的工作原理](https://www.hasscn.top/contributors/core/internals/)：`hass` 对象、事件循环，以及集成底层的 API。
- [让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)：如何编写便于翻译人员处理的字符串。
- [为你的集成编写文档](https://www.hasscn.top/contributors/writing/guides/integration/)：每个集成在 [home-assistant.io](https://www.home-assistant.io/) 上都有一个页面。

## 与谁交流

- 有技术问题？在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 [**#coding-support**](https://discord.com/channels/330944238910963714/1257019582112334014) 中发起一个主题。分享你的分支链接，以便人们可以看到你正在询问的代码。
- 查看一个维护良好且功能类似的集成。质量规模中 Platinum 级别的许多集成，如 `airgradient`，都是当前模式的良好示例。
- 不确定你的想法是否适合 Home Assistant？在编写大量代码之前，先在[架构仓库](https://github.com/home-assistant/architecture/discussions)中发起讨论。

## All pages in this section

### Getting started

- [集成如何融入整体](https://www.hasscn.top/contributors/core/integrations/concepts/): 用通俗的语言介绍每个集成所基于的少数几个核心概念，并提供指向更深入页面的链接。
- [构建 Python 库](https://www.hasscn.top/contributors/core/integrations/api-library/): 为什么集成需要通过独立的库与设备通信、该库必须满足哪些要求，以及如何设计身份验证和数据模型的结构。
- [集成文件结构](https://www.hasscn.top/contributors/core/integrations/file-structure/): 集成的文件、每个文件的用途，以及 Home Assistant 在何处查找集成。

### Setup and configuration

- [配置项](https://www.hasscn.top/contributors/core/integrations/config-entries/): 配置项（config entry）如何被设置、卸载、删除和迁移，以及你的集成将运行时数据存储在哪里。
- [配置流程](https://www.hasscn.top/contributors/core/integrations/config-flow/): 让用户通过配置流程（config flow）从 UI 添加您的集成，并确保同一设备永远不会被设置两次。
- [表单、菜单与进度](https://www.hasscn.top/contributors/core/integrations/flow-steps/): 配置流程、选项流程和修复流程的构建基石，涵盖从表单和分区到菜单、外部步骤和进度。
- [选项流程](https://www.hasscn.top/contributors/core/integrations/options-flow/): 让用户在设置完成后更改集成的行为方式，并在更改时重新加载集成。
- [配置子条目](https://www.hasscn.top/contributors/core/integrations/subentries/): 将配置条目拆分为用户逐个添加的部分，例如天气服务的各个位置。
- [重新认证与重新配置](https://www.hasscn.top/contributors/core/integrations/reauth-reconfigure/): 让用户修复过期的凭据并更改现有配置条目（config entry）的连接详细信息，而无需删除后重新添加。
- [YAML 配置](https://www.hasscn.top/contributors/core/integrations/yaml/): 集成何时仍可以在 configuration.yaml 中进行配置，以及 Home Assistant 如何验证该配置。

### Data and updates

- [获取数据](https://www.hasscn.top/contributors/core/integrations/fetching-data/): 通过轮询（poll）或推送（push）从您的设备或服务获取数据，并使用数据更新协调器（data update coordinator）在实体（entity）之间共享数据。
- [集成中的事件](https://www.hasscn.top/contributors/core/integrations/events/): 让设备的事件对用户可用，并使用事件辅助元素（helper）响应 Home Assistant 内部发生的事情。
- [获取实例 URL](https://www.hasscn.top/contributors/core/integrations/instance-url/): 查找设备、服务或用户浏览器可用来访问 Home Assistant 的 URL。

### Discovery

- [发现](https://www.hasscn.top/contributors/core/integrations/discovery/): Home Assistant 如何通过网络、USB 或蓝牙查找你的设备，并将其交给你的配置流程。
- [网络发现](https://www.hasscn.top/contributors/core/integrations/network-discovery/): 在您的集成运行时，使用 Home Assistant 的 zeroconf、SSDP、DHCP、USB、MQTT 和网络 API 来查找设备。
- [Bluetooth 集成](https://www.hasscn.top/contributors/core/integrations/bluetooth/): 使用 Bluetooth 的集成的最佳实践，以及 Bluetooth 集成的 API。
- [获取蓝牙数据](https://www.hasscn.top/contributors/core/integrations/bluetooth-data/): 为蓝牙设备选择合适的协调器，并将其广播数据转换为实体。

### Devices and registries

- [设备注册表](https://www.hasscn.top/contributors/core/integrations/device-registry/): 注册集成的设备，将它们链接到集线器，把产品拆分为子设备，并允许用户删除设备。
- [实体注册表](https://www.hasscn.top/contributors/core/integrations/entity-registry/): 在实体注册表中查找集成的实体，并在其唯一 ID 发生变化时对它们进行迁移。
- [区域注册表](https://www.hasscn.top/contributors/core/integrations/area-registry/): Home Assistant 对区域的了解，以及你的集成如何为设备建议区域。

### Integration features

- [集成中的动作](https://www.hasscn.top/contributors/core/integrations/actions/): 注册用户可从自动化、脚本和仪表盘中调用的动作，在 services.yaml 中描述这些动作，并返回响应数据。
- [触发器和条件](https://www.hasscn.top/contributors/core/integrations/triggers-and-conditions/): 通过触发器和条件平台为您的集成提供自动化触发器和条件，并进行命名，让用户能够预测它们。
- [设备自动化](https://www.hasscn.top/contributors/core/integrations/device-automations/): 面向已拥有设备自动化的集成，介绍设备触发器、条件和动作的工作方式。
- [诊断](https://www.hasscn.top/contributors/core/integrations/diagnostics/): 让用户下载配置条目或设备的数据，以便他们在报告问题时进行分享，且不会泄露机密信息。
- [系统健康](https://www.hasscn.top/contributors/core/integrations/system-health/): 在系统信息页面上显示您的集成的状态，例如服务器是否可访问以及剩余配额还有多少。
- [请求重启](https://www.hasscn.top/contributors/core/integrations/restart-required/): 告诉 Home Assistant 需要重启才能应用更改，而无需创建修复（repair）问题。
- [维修](https://www.hasscn.top/contributors/core/integrations/repairs/): 告知用户需要处理的问题，并通过维修流程（repair flow）帮助他们解决这些问题。
- [重现状态](https://www.hasscn.top/contributors/core/integrations/reproduce-state/): 通过将存储的状态转换回动作调用，让场景与您的实体集成中的实体协同工作。
- [重大变化](https://www.hasscn.top/contributors/core/integrations/significant-change/): 告诉导出数据的集成（如语音助手），您的实体类型有哪些状态变化是重要的。
- [媒体来源](https://www.hasscn.top/contributors/core/integrations/media-source/): 在 Home Assistant 的媒体浏览器中公开您的集成提供的可浏览、可搜索和可播放的媒体。

### Reference

- [集成清单（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/): manifest.json 中每个键的作用及其接受的值。
- [集成品牌与图片](https://www.hasscn.top/contributors/core/integrations/brands/): 为您的集成添加图标和标志，并将同一品牌的集成归为一组，方便用户查找。
- [集成翻译](https://www.hasscn.top/contributors/core/integrations/translations/): 集成的 strings.json 的各个章节、引用与占位符的工作方式，以及自定义集成如何提供自己的翻译。
- [集成分类](https://www.hasscn.top/contributors/core/integrations/categories/): 用户浏览集成时依据的分类，以及如何为你的集成选择合适的分类。
