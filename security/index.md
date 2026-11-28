# 安全

> 报告漏洞，并构建能够保护其所运行家庭的软件。

Source: https://www.hasscn.top/contributors/security/

Home Assistant 运行着用户家中的门锁、警报器、摄像头和供暖设备。Home Assistant 中的一个安全漏洞，就是某人家前门上的一个漏洞。因此，在这里安全不是某个独立团队的问题：它出现在每一个集成（integration）、每一张卡片、每一个应用，以及每一次依赖升级中。

本区域面向所有贡献者。你将了解如何报告漏洞、在编写或审查代码时应注意什么，以及哪些检查机制已经在为你保驾护航。

> [!IMPORTANT]
> 发现了漏洞？请不要就此公开提交 issue、pull request 或聊天消息。请通过 [GitHub 安全公告](https://github.com/home-assistant/core/security/advisories/new)私下报告。有关应包含的内容以及后续流程，请参阅[报告漏洞](https://www.hasscn.top/contributors/security/report-a-vulnerability/)。

## 本区域面向谁

- **安全研究人员和用户**：如果你发现了问题，请从[报告漏洞](https://www.hasscn.top/contributors/security/report-a-vulnerability/)开始。
- **集成开发者**：你编写的代码运行在 Core 内部，可以访问一切。[集成指南](https://www.hasscn.top/contributors/security/guides/integrations/)涵盖了凭据、证书、脱敏、仅管理员访问、webhook 和文件路径。
- **前端开发者**：到达界面的名称、属性和 Markdown 可能来自任何地方。请参阅[前端中的不可信内容](https://www.hasscn.top/contributors/security/guides/frontend/)。
- **应用开发者**：你的应用运行在自己的容器中，与系统的其他部分相邻。请参阅[保护你的应用](https://www.hasscn.top/contributors/apps/guides/security/)和[安全评级](https://www.hasscn.top/contributors/apps/reference/security-rating/)，以及[保护应用](https://www.hasscn.top/contributors/security/guides/apps/)中来自过往公告的经验教训。
- **伴侣应用（Companion app）开发者**：伴侣应用保存着用户的登录信息，因此任何能让它自行执行操作的因素都是风险。请参阅[保护伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/)。
- **审查者**：你是代码进入用户家中的最后一道防线。请参阅[带着安全意识进行审查](https://www.hasscn.top/contributors/security/guides/reviewing/)。

## 从这里开始

- [你的第一次贡献](https://www.hasscn.top/contributors/security/first-contribution/)：检查你正在使用的某个集成的诊断数据，找出其中不应存在的数据。
- [Home Assistant 如何处理信任](https://www.hasscn.top/contributors/security/how-it-works/)：Home Assistant 信任谁、它可能在哪里受到攻击，以及系统已经为你做了什么。
- [报告漏洞](https://www.hasscn.top/contributors/security/report-a-vulnerability/)：如何报告、什么情况符合条件，以及可以期待什么。

## 指南

- [保护集成安全](https://www.hasscn.top/contributors/security/guides/integrations/)：让集成保持安全的模式和辅助元素（helper）。
- [前端中的不可信内容](https://www.hasscn.top/contributors/security/guides/frontend/)：转义、净化和安全链接。
- [保护应用安全](https://www.hasscn.top/contributors/security/guides/apps/)：关于应用和 Supervisor 的公告带给我们的启示。
- [保护伴侣应用安全](https://www.hasscn.top/contributors/security/guides/companion-apps/)：链接、导出的组件、WebView 和 JavaScript 桥接。
- [依赖与供应链](https://www.hasscn.top/contributors/security/guides/dependencies/)：Home Assistant 对一个库有哪些要求，以及它如何进行检查。
- [带着安全意识进行审查](https://www.hasscn.top/contributors/security/guides/reviewing/)：在 pull request 中应该注意什么。

## 参考

- [安全辅助元素](https://www.hasscn.top/contributors/security/reference/helpers/)：Core 和前端的每个辅助元素（helper）汇总在一页上。
- [自动化安全检查](https://www.hasscn.top/contributors/security/reference/checks/)：检查代码、依赖和工作流程的工具。
- [过往公告](https://www.hasscn.top/contributors/security/reference/advisories/)：所有已发布的公告，按类型分组，包含问题所在和经验教训。

## 相关内容

- [身份验证](https://www.hasscn.top/contributors/core/internals/auth/)和[权限](https://www.hasscn.top/contributors/core/internals/permissions/)：用户、令牌，以及如何检查某人可以执行哪些操作。
- [诊断](https://www.hasscn.top/contributors/core/integrations/diagnostics/)：让用户分享数据，而不泄露机密。
- [保护你的 Home Assistant](https://www.home-assistant.io/docs/configuration/securing/)：用户侧的内容，从密码到远程访问。

## 联系谁

- **漏洞**：请通过 [GitHub 安全公告](https://github.com/home-assistant/core/security/advisories/new)报告，切勿公开。项目的 [security.txt](https://www.home-assistant.io/.well-known/security.txt) 列出了 `security@home-assistant.io` 作为联系方式。
- **撰写关于 Home Assistant 安全性的文章**：[安全政策](https://www.home-assistant.io/security/)要求你先通过 [hello@home-assistant.io](mailto:hello@home-assistant.io) 联系我们，以便核实所有声明。
- **关于编写安全代码的疑问**（非漏洞）：请在 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道中提问，或在你的 pull request 中提问。看不到该频道？在 **Channels & Roles** 下，选择 **I want to contribute dev skills to Home Assistant**。
