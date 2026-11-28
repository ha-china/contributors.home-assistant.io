# 你的第一次数据贡献

> 从你的 Home Assistant 安装实例共享分析数据，准确查看它发送了什么，并看到你的安装实例被计入。只需几分钟和一次重启。

Source: https://www.hasscn.top/contributors/data/first-contribution/

最简单的数据贡献方式是从你自己的 Home Assistant 安装实例共享分析数据（analytics）。这能帮助项目决定把时间花在哪里，也能让团队在向厂商争取本地控制时拿出真实的数据。在你开启之前，不会共享任何内容。

## 1. 打开分析设置

在 Home Assistant 中，前往 **设置** > **系统** > **分析**。如果你最近才设置 Home Assistant，可能在新手引导过程中已经在这里做过选择了。

## 2. 选择要共享的内容

有多个选项，每个都是独立的：

- **基础分析**：你的 Home Assistant 版本和安装类型，以及一些关于你系统的细节。使用情况和统计数据需要它。
- **使用情况**：你使用了哪些集成（integration）和应用。
- **统计数据**：仅包含数量，例如实体（entity）和自动化（automation）的数量。
- **诊断**：发生意外错误时的崩溃报告，发送到 Sentry。目前，这只涵盖 Supervisor 和 OS Agent。

[分析数据共享了什么](https://www.hasscn.top/contributors/data/reference/analytics-data/) 列出了每一个字段。开启你感到放心的选项即可。每个选项都有帮助。

## 3. 为分析开启日志记录

Home Assistant 每次发送报告时，都会把确切的数据写入它的日志。它以 `info` 级别写入，而默认情况下日志只显示警告和错误。所以要先为分析开启日志。把以下内容添加到你的 `configuration.yaml` 文件中。如果你已经有 `logger:` 部分，则把这一行添加到它的 `logs:` 下面：

```yaml
logger:
  logs:
    homeassistant.components.analytics: info
```

然后重启 Home Assistant。有关日志级别的更多信息，请参阅 [logger 集成](https://www.home-assistant.io/integrations/logger/)。

不想重启？可以在 **设置** > **工具** > **动作** 中运行 `logger.set_level` 动作，并以 `homeassistant.components.analytics: info` 作为其数据。这会持续到下次重启为止，而下一份报告最多可能在 24 小时之后。

## 4. 检查你发送了什么

Home Assistant 在启动 15 分钟后发送第一份报告，之后每 24 小时发送一次。前往 **设置** > **系统** > **日志**，在菜单中选择 **显示原始日志**，然后查找一条以下列内容开头的消息：

```text
Submitted analytics to Home Assistant servers. Information submitted includes
```

这一行就是完整的每日报告：你的基础数据、使用情况和统计数据。没有名称、没有实体 ID、没有地址。接收服务器会添加一项内容：你的国家，它由你的 IP 地址推导得出；对于美国，还包括你所在的州。

这并不是分析功能能发送的全部内容。**设备数据库** 数据会作为单独的报告发出，日志只会说明它已发送，而不会说明其中包含什么。**诊断** 崩溃报告会发送到 Sentry，完全不会出现在这里。

查看之后，请从 `configuration.yaml` 中删除这一行并再次重启，以保持日志简洁。

## 5. 查看结果

打开 [analytics.home-assistant.io](https://analytics.home-assistant.io/)。该网站显示了有多少安装实例共享分析数据、它们运行哪些版本，以及哪些集成最受欢迎。你的安装实例现在也是其中之一，是众多匿名计数中的一个。

## 接下来做什么

- 帮助构建设备数据库：在 **设置** > **系统** > **实验室** 中开启 **设备数据库** 预览功能，并共享关于你设备的匿名化数据。请参阅 [分析功能如何运作](https://www.hasscn.top/contributors/data/how-it-works/#the-device-database)。
- 阅读这一切背后的[隐私原则](https://www.hasscn.top/contributors/data/privacy/)。
- 对你自己家中的数据感到好奇？试试[探索你自己的数据](https://www.hasscn.top/contributors/data/guides/explore-your-data/)。
