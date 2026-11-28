# 隐私原则

> Home Assistant 对其收集的每一份数据所遵循的规则，以及原因。

Source: https://www.hasscn.top/contributors/data/privacy/

Home Assistant 的建立基于这样一个信念：你的数据属于你，全部都属于你，而且你无需分享数据也能从中获益。拥有 Home Assistant 的 [Open Home Foundation](https://www.hasscn.top/contributors/glossary/open-home-foundation/) 将隐私与选择权和可持续性并列为它的核心原则。本区域的全部内容都源于此。

## 你的数据留在家中

Home Assistant 记录的关于你家庭的一切，比如设备（device）的状态（state）、你的历史记录和能源使用情况，都存储在你自己的硬件上，存放在你自己的数据库中。除非你设置了某些将数据发送到别处的功能，否则数据绝不会离开你的家。这也是为什么该项目不知道有多少人在运行 Home Assistant：它无法统计未主动加入的安装数量。

## 主动加入，绝不默认开启

除非你主动开启，否则不会与项目共享任何内容。分析功能在你选择启用之前是关闭的，无论是在引导设置期间还是在之后的设置中。设备数据库也是如此，这是一个单独的选择。

## 你选择分享什么

分析功能被拆分为多个独立选项，从基本系统信息到使用情况、统计数量和崩溃报告。你可以单独开启或关闭每一项，并随时改变主意。关闭某个选项会立即生效。

## 你可以看到自己分享了什么

每次 Home Assistant 发送分析数据时，它都会将所发送的确切数据写入你的日志。没有任何隐藏的部分。对于设备数据库，你可以从分析设置中下载将要共享内容的预览。

## 只有数量，绝无个人

共享的数据不包含任何名称、实体（entity）ID、地址，以及任何你自己命名的内容。每个安装会发送一个随机标识符，仅用于确保只被统计一次，即使它每天都会报告。国家信息是在数据到达时根据 IP 地址推导出来的。IP 地址本身不会与分析数据一起存储。

只会发布汇总的总量。单个安装的数据绝不会公开，你也无法在公开数据中找到某个单独的安装。

## 数据不会永久保留

分析数据接收端最多只保留某个安装在其最后一次报告之后 60 天内的数据。停止共享后，你的安装会在该期限之后从数据中消失。

## 全程开放

收集分析数据的代码是 Home Assistant 本身的一部分，位于[分析集成（integration）](https://github.com/home-assistant/core/tree/dev/homeassistant/components/analytics)中。接收和处理数据的代码同样是开源的，位于 [analytics.home-assistant.io 仓库](https://github.com/home-assistant/analytics.home-assistant.io)。任何人都可以查看数据是如何被处理的。

Open Home Foundation 的网站也遵循同样的理念：它们使用 [Plausible](https://www.openhomefoundation.org/blog/making-our-web-analytics-open-source-with-plausible/)，这是一个不收集个人数据、不进行追踪的开源分析工具。

## 关于设备数据库

设备数据库有其自己的[数据使用声明](https://www.openhomefoundation.org/device-database-data-use-statement)，其中详细说明了设备数据是如何被处理的。它只包含关于设备的详细信息，比如制造商和型号，绝不包含个人身份信息，例如你为设备起的名称。
