# 分析数据的工作原理

> 您的分析数据从您的安装实例到公开分析网站的路径，以及设备数据库在其中的作用。

Source: https://www.hasscn.top/contributors/data/how-it-works/

Home Assistant 有两种与项目共享数据的方式，均为自愿开启：分析（analytics），向项目报告安装情况；设备数据库（device database），向项目报告设备信息。本页将带您了解数据从您的家中到最终去向的完整过程。

## 为什么项目需要这些数据

Home Assistant 无法看到自己是怎样被使用的。这是有意为之，但也让一些决策变得困难。分析数据在三个方面提供帮助：

- **决定把时间花在哪里。** 了解哪些集成（integration）受欢迎，有助于团队决定改进、重写或扩展哪些内容。
- **与制造商沟通。** “成千上万的 Home Assistant 用户拥有您的设备”比功能请求更能说服一家公司添加本地 API。这已促使制造商添加了本地控制和隐私功能。
- **帮助用户选择。** 公开的分析网站展示了哪些集成和设备受欢迎。[home-assistant.io](https://www.home-assistant.io/) 上的集成页面使用相同的数据，显示每个集成有多少活跃安装。

## 分析

### 收集

[分析集成](https://github.com/home-assistant/core/tree/dev/homeassistant/components/analytics)是 Home Assistant 本身的一部分。当您开启分析后，它会在 Home Assistant 启动 15 分钟后发送一份报告，之后在 Home Assistant 运行期间每 24 小时发送一次。

报告的内容取决于您开启的选项。[分析数据共享的内容](https://www.hasscn.top/contributors/data/reference/analytics-data/)列出了每个字段。运行开发版本的安装实例会将其数据发送到单独的测试环境，因此不会与真实数据混在一起。

### 接收

报告会发送到分析接收器（analytics receiver），这是一个运行在 Cloudflare Workers 上的小程序。它会检查报告，根据 IP 地址添加来源国家/地区（美国则添加州），并将其存储在键值存储中，以安装实例的随机标识符作为键。

每个安装实例恰好有一条记录。当报告与已存储的内容不同时会重写该记录，即使没有变化也至少每 30 天重写一次。60 天未被重写的记录会被移除。

### 处理

计划任务会遍历存储的记录并计算汇总数据：

| 任务 | 运行时间 | 作用 |
| --- | --- | --- |
| 处理队列 | 每分钟一次，直到完成 | 遍历所有记录并进行统计。完成后，使用新数据重建网站。 |
| 更新历史 | 每小时一次 | 更新安装类型、版本和汇总数据的历史记录。 |
| 重建网站 | 每小时一次，在第 15 分钟 | 使用最新数据重建网站。 |
| 重置队列 | 每天一次，午夜刚过 | 开始新一轮处理。 |

### 发布

[分析网站](https://analytics.home-assistant.io/)会使用新的汇总数据重建。它展示随时间变化的安装数量、版本、安装类型、开发板、集成、应用和统计数据。相同的数据也以文件形式提供，供任何人使用。参见[使用公开数据](https://www.hasscn.top/contributors/data/guides/public-data/)。

所有这些——接收器、处理过程和网站——都在 [analytics.home-assistant.io 仓库](https://github.com/home-assistant/analytics.home-assistant.io)中开源。

## 诊断

诊断（Diagnostics）与其他部分不同。开启后，意外错误的崩溃报告会发送到 [Sentry](https://sentry.io/)，开发人员在那里使用它们来修复缺陷。只有开发人员可以看到这些报告。此选项目前涵盖 Supervisor 和 OS Agent。

## 设备数据库

Open Home Foundation 正在构建一个设备数据库：一个开放的、由社区驱动的资源，展示智能家居设备在真实家庭中的表现。这个传感器不用云端能工作吗？这个智能插座提供哪些实体（entity）？答案来自那些主人选择共享其设备匿名化数据的 Home Assistant 安装实例。

### 开启方式

设备数据库是一项预览功能。要共享数据，请在**设置** > **系统** > **实验室**中开启 **Device database** 功能。这也会同时开启**设置** > **系统** > **分析**中的 **Devices** 选项，您可以随时在那里关闭共享。在同一位置，**Preview device analytics** 可以精确下载将要共享的内容。

### 共享的内容

每天一次，在一个为每个安装实例随机选定的时间，Home Assistant 会发送其设备的快照：

- 仅包括随 Home Assistant 附带的集成所对应的设备，且仅限设备和集线器（hub）类集成。自定义集成以及天气提供商等服务不在其中。
- 对于每台设备：制造商、型号、型号 ID、硬件和软件版本、是否有配置 URL，以及它通过哪台设备连接。
- 对于每个实体：其域名（domain）、设备类别（device class）、实体类别（entity category）、计量单位、是否使用实体名称，以及其状态（state）是否为假定状态。

您设备的 ID 不会被发送。设备之间仅通过它们在列表中的位置相互引用。您为设备、区域（area）和实体起的名称绝不会包含在内。

集成可以选择不共享其部分或全部设备和实体。参见[集成中的分析](https://www.hasscn.top/contributors/data/guides/integration-analytics/)。

### 数据去向

快照会发送到 Open Home Foundation 的设备数据库，而不是分析接收器。这些数据的处理方式在[数据使用声明](https://www.openhomefoundation.org/device-database-data-use-statement)中有所说明。设备数据库的计划和进展会在博客上分享，首篇文章是[我们如何共同构建设备数据库](https://www.home-assistant.io/blog/2026/02/02/about-device-database/)。
