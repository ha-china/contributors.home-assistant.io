# 以安全为重进行审查

> 在拉取请求（pull request）中应关注什么，以避免安全问题进入用户的家中，以及发现问题后该怎么做。

Source: https://www.hasscn.top/contributors/security/guides/reviewing/

审查者是代码发布前的最后一道防线。你不需要是安全专家就能发现大多数问题：它们往往出现在同样几个地方。本页列出了这些地方，让你知道该往哪里看。

本页为常规审查指南增加了安全视角。完整流程请参阅 Core 的[拉取请求审查](https://www.hasscn.top/contributors/core/development/reviewing/)。

## 如果你发现漏洞

你在审查中发现的一些问题并不是新代码中缺少检查，而是已经发布的代码中存在的漏洞。不要在所有人都能看到的拉取请求中讨论它，而应[私下报告](https://www.hasscn.top/contributors/security/report-a-vulnerability/)。

## 从过去的错误中学习

Home Assistant 的[历史安全公告](https://www.hasscn.top/contributors/security/reference/advisories/)是最好的培训材料。它们反复出现同样的主题：

- **名称被渲染为 HTML。** 通过图表提示框（tooltip）和历史图表卡片中的实体（entity）名称，以及地图卡片中的设备（device）名称造成的存储型 XSS。
- **不安全的 URL。** 通过登录回调中的 `javascript:` URL 实现的完全接管，以及 Core 中的部分服务端请求伪造。
- **无需登录的端点。** 某个集成的警报面板状态，以及 Home Assistant 的用户账户，可被本地网络上的任何人读取。应用（app）的未认证端点通过 host 网络模式在本地网络上可达。
- **证书检查。** Core 及其使用的库中，对外请求的 SSL 验证不正确。
- **伴侣应用（companion app）擅自行动。** 链接和其他应用使应用在未经询问的情况下向服务器发送标签扫描、位置或操作，以及框架中的网页访问到了 JavaScript 桥。
- **项目自身的工具。** GitHub Action 中的表达式注入。

[参考页面](https://www.hasscn.top/contributors/security/reference/advisories/)按类型对每条公告进行分组，并附上经验教训和 GitHub 上详情的链接。阅读其中几篇会改变你阅读代码的方式。

## 需要关注什么

### 入口

- 新的 HTTP 视图：是否需要 `requires_auth = False`？如果是，每个方法（包括 `get`）是否都自行检查请求？
- 修改配置的新操作（action）、WebSocket 命令或视图：是否仅限管理员？参见[守护入口](https://www.hasscn.top/contributors/security/guides/integrations/#guard-the-ways-in)。
- 新的 webhook：是否应为 `local_only`？其 ID 是否使用 `webhook.async_generate_id()` 生成？
- 来自用户的路径：是否使用 `hass.config.is_allowed_path()` 进行检查？

### 数据

- 凭据应放在配置条目（config entry）的 `data` 中，而不是其他任何地方。
- 诊断信息应隐去所有隐私内容。检查测试中的快照：你看到的就是用户会分享的内容。
- 日志行不包含密码、令牌或完整密钥。
- 来自设备或服务的数据不会被传入 `eval()`、`exec()` 或 shell。

不要对操作（action）的 schema 已经校验的字段要求额外检查。Home Assistant 会在处理程序运行之前检查这些字段。应要求数据跳过 schema 或被转换为不太安全的形式时进行检查。

### 网络

- 集成使用 Home Assistant 的共享 Web 会话。
- 证书检查默认开启。如果有关闭它们的选项，那应是用户的选择，且关闭不是默认值。

### 前端

- 名称、属性和其他数据通过 Lit 模板到达页面，而不是 `innerHTML` 或 HTML 字符串。
- 如果某个库需要 HTML 字符串，不可信的部分应通过 `filterXSS` 处理。
- 来自数据的 URL 应通过 `sanitizeHttpUrl` 或 `sanitizeLinkUrl` 处理。
- 带有 `allow-svg` 的 `<ha-markdown>` 只渲染受信任的内容。

### 依赖

- 新的库符合[依赖透明度](https://www.hasscn.top/contributors/core/quality-scale/dependency-transparency/)规则。
- 对于更新，阅读上游 diff，并查看 Check requirements 工作流的评论。参见[依赖与供应链](https://www.hasscn.top/contributors/security/guides/dependencies/)。

### 应用

- 应用中每个会更改内容的端点都有登录验证，或只接受通过 ingress 访问的 Supervisor。监听内部地址不等于登录。参见[保护应用安全](https://www.hasscn.top/contributors/security/guides/apps/)。

### 伴侣应用

- 会更改服务器内容的新链接、intent 或快捷方式应先询问用户。
- 新的 Android 组件不被导出（exported），除非其他应用必须访问它。
- 发送到 JavaScript 桥的消息只来自服务器的主框架，且消息中的任何值都不会变成代码。参见[保护伴侣应用安全](https://www.hasscn.top/contributors/security/guides/companion-apps/)。

### 工作流

- 新的操作固定到 commit SHA。
- 在 `run:` 脚本中不使用包含外部数据（如分支名称或标题）的 `${{ }}` 表达式。参见[过去的错误](https://www.hasscn.top/contributors/security/guides/dependencies/#what-went-wrong-before)。
- 权限尽可能小，仅满足任务所需，检出（checkout）使用 `persist-credentials: false`。

## 当你不确定时

提问。说出你担心什么，以及为什么。提问永远好过猜测。如果作者也不确定，可以到 [Home Assistant Discord](https://www.home-assistant.io/join-chat/) 的 [**#developers**](https://discord.com/channels/330944238910963714/554842238073700352) 频道咨询，前提是这是关于新代码的问题，而不是已发布代码中的漏洞。

如果你自己编写代码，并且对其安全性有疑虑，请在你的拉取请求中说明。这有助于审查者关注正确的地方。
