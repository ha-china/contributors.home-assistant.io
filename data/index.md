# 数据

> Home Assistant 从数据中学到什么，如何在此过程中尊重您的隐私，以及如何探索您自己家庭的数据。

Source: https://www.hasscn.top/contributors/data/

Home Assistant 从设计上就注重隐私。您的数据保存在您的家中，除非您决定如此，否则不会有任何数据离开您的家。尽管如此，项目仍需要一些数据来做出正确的决策：人们使用哪些集成（integration）、运行哪些版本、哪些设备运行良好。本部分介绍 Home Assistant 如何在不放弃隐私的前提下获取这些数据，以及您如何亲自处理数据。

您不需要成为数据科学家也能提供帮助。在自己的安装实例中开启分析（analytics）就已经是一种贡献。如果您喜欢钻研数字，您自己家庭的数据和公开数据集正等着您。

## 从这里开始

- [您的第一次贡献](https://www.hasscn.top/contributors/data/first-contribution/)：从您的安装实例分享分析数据，并确切查看您发送了什么。
- [隐私原则](https://www.hasscn.top/contributors/data/privacy/)：Home Assistant 在收集任何数据时遵循的规则。
- [分析的工作原理](https://www.hasscn.top/contributors/data/how-it-works/)：从您的安装实例到公开分析网站的全过程。

## 指南

- [使用公开数据](https://www.hasscn.top/contributors/data/guides/public-data/)：下载分析数据集，或将其抓取到您自己的工具中。
- [探索您自己的数据](https://www.hasscn.top/contributors/data/guides/explore-your-data/)：设置 JupyterLab 并对您家庭的数据运行第一份报告。
- [查询数据库](https://www.hasscn.top/contributors/data/guides/query-the-database/)：针对状态（state）、事件（event）和上下文（context）的 SQL 查询示例。
- [集成中的分析](https://www.hasscn.top/contributors/data/guides/integration-analytics/)：面向开发者，控制设备数据库从您的集成中接收哪些内容。

## 参考

- [分析共享的内容](https://www.hasscn.top/contributors/data/reference/analytics-data/)：每个选项下的所有字段。
- [数据模型](https://www.hasscn.top/contributors/data/reference/data-model/)：事件、状态和上下文，Home Assistant 所记录一切的基础构建块。
- [数据库架构](https://www.hasscn.top/contributors/data/reference/database-schema/)：记录器（recorder）数据库的数据表。
- [统计](https://www.hasscn.top/contributors/data/reference/statistics/)：短期和长期统计，以及它们的存储方式。

## 联系谁

- 关于分析网站或其数据的问题？请在 [analytics.home-assistant.io 仓库](https://github.com/home-assistant/analytics.home-assistant.io)中提交 issue 或发起讨论。
- 关于设备数据库的问题？请加入 Home Assistant Discord 服务器上的[设备数据库项目频道](https://discord.com/channels/330944238910963714/1463602457924997236)。
- 关于记录器数据库的问题？请在[社区论坛](https://community.home-assistant.io/)中提问。
