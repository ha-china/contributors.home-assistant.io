# 报告缺陷（bug）

> 应该在哪个仓库报告缺陷、缺陷报告表单会询问什么内容以及在哪里找到这些信息，以及报告之后会发生什么。

Source: https://www.hasscn.top/contributors/start/report-a-bug/

一份好的缺陷报告是您能为项目做出的最有用的事情之一。您不需要为此编写代码，只需要一个免费的 [GitHub](https://github.com/signup) 账号和一点耐心。本页面帮助您选择正确的位置、收集表单所需的信息，并了解之后会发生什么。

缺陷报告用于那些没有按预期工作的问题。关于您自己配置的疑问请前往[帮助页面](https://www.home-assistant.io/help/)，新功能的想法请前往[功能请求](https://github.com/home-assistant/feature-requests/discussions)。

## 报告之前

- **先更新。** 确认问题在最新版本上仍然存在。多个表单都要求您确认这一点。
- **搜索已有的 issue。** 使用仓库 **Issues** 标签页中的搜索框。找到了匹配的 issue？请添加 👍，或在评论中补充您知道的任何新信息，而不是再开一个新 issue。
- **安全问题？** 不要在这里报告：issue 是公开的。请改为私下[报告漏洞](https://www.hasscn.top/contributors/security/report-a-vulnerability/)。
- **用英文撰写。** 这样所有人都能看懂。使用翻译工具是可以的：请参阅 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/#non-native-english-speakers)。

## 选择仓库

Home Assistant 的每个部分都有自己的 issue 跟踪器。请在代码所在的地方报告问题：

| 问题所在位置 | 在此报告 |
| --- | --- |
| 集成（integration）、自动化（automation）或 Home Assistant Core 中的其他任何内容 | [core](https://github.com/home-assistant/core/issues) |
| 界面：仪表盘（dashboard）、卡片、设置页面和对话框 | [frontend](https://github.com/home-assistant/frontend/issues) |
| Supervisor：更新、备份和安装应用 | [supervisor](https://github.com/home-assistant/supervisor/issues) |
| Home Assistant OS，即操作系统本身 | [operating-system](https://github.com/home-assistant/operating-system/issues) |
| 官方插件（add-on） | [addons](https://github.com/home-assistant/addons/issues) |
| Android 应用、Wear OS 或 Android Auto | [android](https://github.com/home-assistant/android/issues) |
| iOS、iPadOS、watchOS 或 macOS 应用 | [iOS](https://github.com/home-assistant/iOS/issues) |
| home-assistant.io 上的文档 | [home-assistant.io](https://github.com/home-assistant/home-assistant.io/issues) |

不确定？看起来显示异常的仪表盘属于 frontend，即使在伴侣应用（companion app）中也是如此。iOS 表单建议了一个快速测试：如果问题在 Safari 中也出现，请在 frontend 中报告。仍然不确定它属于哪里？请先在 [Discord](https://www.home-assistant.io/join-chat/) 上询问。

在仓库的 **New issue** 页面上，选择缺陷报告表单。该页面上的其他选项会指引您前往正确的支持与功能请求位置。

## 表单会询问什么

每个表单都要求对问题进行清晰的描述，大多数还要求提供重现步骤。请将步骤写成别人可以照着做的编号步骤。然后每个表单还会要求各自的详细信息。

### Home Assistant Core

- 出现问题的 Home Assistant Core 版本，以及（如果您知道的话）最后一个正常的版本。
- 您的安装类型：Home Assistant OS、Container、Supervised 或 Core。
- 导致问题的集成，以及它在 home-assistant.io 上文档页面的链接。该链接能帮助相关的人找到您的 issue。
- 设备或集成的[诊断信息](https://www.hasscn.top/contributors/glossary/diagnostics/)（如果它提供的话）。
- 能重现问题的 YAML 示例（如果适用），以及日志中任何有用的内容。

### Frontend

- 一份检查清单：您已更新 Home Assistant、清除了浏览器缓存、尝试了其他浏览器，并尝试了[安全模式](https://www.home-assistant.io/blog/2023/11/01/release-202311/#restarting-into-safe-mode)以排除自定义卡片和其他自定义资源的影响。
- 您期望发生什么，以及实际发生了什么。
- Home Assistant Core 版本、您的浏览器及其版本，以及它运行的操作系统。
- 对于实体（entity）显示方式的问题：其状态（state）和属性（attribute），可从更多信息对话框的 **Details** 视图中获取。
- 相关卡片的 YAML，以及浏览器控制台中的任何错误。

### Supervisor

- 该表单仅适用于受支持的安装方式。它仍然提供 Home Assistant OS 和 Home Assistant Supervised 作为安装类型，但 Supervised 已不再是受支持的安装类型。请参阅[安装类型](https://www.hasscn.top/contributors/os/installation-types/)。
- Supervisor 日志、系统信息，以及（如果可以的话）Supervisor 诊断信息。

### Home Assistant OS

- 您使用的镜像，例如 `generic-x86-64` 或 `rpi5-64`，以及 Home Assistant OS 的版本。
- 问题是否在操作系统更新之后才出现。
- 硬件细节，尤其是裸机 x86 安装，以及您连接的任何 USB 设备。在虚拟机中，则是虚拟机管理程序（hypervisor）及其版本。
- Supervisor 日志和主机（host）日志。

表单会要求您先在最新版本上测试。如果看起来像是回归问题（regression），请确认问题在之前的版本上是否消失。您可以使用 `ha os update --version x.y` 回退，其中 `x.y` 是您想要的版本。

### Android

- 应用版本、Android 版本和设备型号。对于 Wear OS，请同时列出手机和手表。
- Home Assistant 版本，以及最后一个正常的版本。
- 应用的日志，以及问题的截图或视频。对于通知问题，请附上您使用的 YAML。

### iOS 和 macOS

- 设备型号和软件版本，可在设备的 **Settings** > **General** > **About** 中找到。
- 应用版本，可在应用中的 **App Configuration** > **About** 中找到。请包含括号中的数字。
- Home Assistant Core 版本、您期望发生什么，以及截图。

## 在哪里找到这些信息

只要您知道去哪里找，Home Assistant 会显示表单所需的大部分信息。

- **版本和安装类型：** 前往 **Settings** > **System** > **Repairs**，打开右上角的三点菜单，选择 **System information**。底部的复制按钮可以复制全部内容，适用于要求提供完整系统信息的表单。
- **诊断信息：** 前往 **Settings** > **Devices & services**，打开该集成或设备，在其三点菜单中选择 **Download diagnostics**。将下载的文件拖入表单。不要粘贴其内容。home-assistant.io 上的 [Debug logs and diagnostics](https://www.home-assistant.io/docs/configuration/troubleshooting/#debug-logs-and-diagnostics) 有更多说明。
- **日志：** 前往 **Settings** > **System** > **Logs**。在右上角选择 **Supervisor** 或 **Host** 以查看相应日志。在 Home Assistant CLI 中，`ha supervisor logs` 和 `ha host logs` 显示相同内容。
- **Android 应用日志：** 在应用中，前往 **Settings** > **Companion App Troubleshooting** > **Show and Share Logs**。对于 Wear OS，表单要求提供手表的 LogCat 日志。
- **浏览器错误：** 打开浏览器的开发者工具，并从其控制台复制错误。

在粘贴任何内容之前，请删除密码、私有 URL 和其他个人隐私信息。

## 报告之后

frontend、Android 和 iOS 的缺陷报告表单会自动添加 `bug` 标签。Home Assistant Core 会做更多事情：

- **集成标签。** 一个机器人会根据您报告中的文档链接添加类似 `integration: hue` 的[标签](https://www.hasscn.top/contributors/glossary/label/)。它还会提及该集成的[集成负责人](https://www.hasscn.top/contributors/glossary/integration-owner/)，让他们知道您的 issue。
- **重复检查。** 一旦添加了集成标签，一个工作流会使用 AI 模型将您的 issue 与同一集成在过去六个月内的其他 issue 进行比较。如果发现可能的重复项，它会在评论中列出它们，并添加 `potential-duplicate` 标签。请查看它们：如果其中一个是相同的问题，请关闭您的 issue 并在那里补充您的详细信息。如果您的不同，请说明不同之处。
- **语言检查。** 非英文的 issue 会被关闭并添加 `non-english` 标签，同时会有评论要求您用英文重新提交。
- **提问。** 集成负责人或维护者可能会要求更多详细信息，例如日志或诊断信息，或添加 `needs-more-information` 标签。请尽可能回复。没有回复，issue 就无法推进。

### 保持 issue 活跃

一段时间没有活动的 issue 会被添加 `stale` 标签，如果之后仍无动静则会被关闭。在 Home Assistant Core 中，这个期限是 90 天，之后 7 天 issue 会被关闭。问题仍然存在？请确认它在最新版本上仍然出现，并在评论中说明。这会重置计时。issue 关闭后，机器人会在一段时间后将其锁定。[Stale and locked](https://www.hasscn.top/contributors/start/pull-requests/#stale-and-locked) 列出了每个仓库的时限。

### 修复之后

修复会以拉取请求（pull request）的形式提交，由接手的人完成。那个人可以是您。一旦合并，它会在下一个版本中到达所有用户。紧急修复可以更早进入补丁版本：由审查者决定，并将该拉取请求添加到下一个补丁版本的里程碑中。想比别人先体验下一个版本？[加入 beta 测试](https://www.hasscn.top/contributors/releases/first-contribution/)。
