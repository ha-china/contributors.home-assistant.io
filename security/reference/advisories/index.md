# 过往安全公告

> Home Assistant 已发布的所有安全公告，按类型分组，说明出了什么问题以及对贡献者的教训。

Source: https://www.hasscn.top/contributors/security/reference/advisories/

Home Assistant 会为每一个符合[安全政策标准](https://www.hasscn.top/contributors/security/report-a-vulnerability/#public-disclosure-and-cve-assignment)的有效漏洞发布安全公告。本页面按类型对它们进行分组，用一句话说明出了什么问题，并指出相应的教训。每条公告都链接到 GitHub 上的完整详情，每条教训都链接到涵盖该内容的指南。

包含严重程度、CVE、发现者和修复版本的列表本身位于[安全页面](https://www.home-assistant.io/security/#past-advisories)。那份列表是官方版本。本页面只是帮助你从中学习。

同样的一些错误不断重复出现。请阅读与你所负责代码相匹配的分组。

## 跨站脚本

到达前端的数据被当作 HTML 渲染，因此一个精心构造的名称或消息可以在查看者的浏览器中运行代码。

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2026‑03‑27 | 一个包含 HTML 的设备名称在[地图卡片](https://github.com/home-assistant/core/security/advisories/GHSA-r584-6283-p7xc)的工具提示中作为代码运行。 | 名称是数据，绝不是标记。让 Lit 来渲染它们，或者设置 `textContent`。参见[前端](https://www.hasscn.top/contributors/security/guides/frontend/#let-lit-do-the-escaping)。 |
| 2026‑03‑27 | 一个实体（entity）名称在[历史图表卡片](https://github.com/home-assistant/core/security/advisories/GHSA-46j8-vpx8-6p72)的工具提示中作为代码运行。 | 另一个卡片中的同样错误：检查每一个构建 HTML 字符串的地方。参见[前端](https://www.hasscn.top/contributors/security/guides/frontend/#when-you-must-build-an-html-string)。 |
| 2025‑10‑14 | 一个实体名称在能源仪表盘的[图表工具提示](https://github.com/home-assistant/core/security/advisories/GHSA-mq77-rv97-285m)中作为代码运行。该名称可能来自集成的云服务，而不仅仅来自用户。 | 任何名称都可能来自外部，包括集成设置的默认名称。参见[前端](https://www.hasscn.top/contributors/security/guides/frontend/)。 |
| 2017‑10‑11 | 前端没有对[Markdown 输出](https://github.com/home-assistant/frontend/pull/514)进行净化，例如在持久通知中。 | 通过净化器渲染 Markdown。如今那就是 `<ha-markdown>`。参见[前端](https://www.hasscn.top/contributors/security/guides/frontend/#markdown)。 |

## 登录与前端

来自 [Cure53 的 2023 年审计](https://www.home-assistant.io/blog/2023/10/19/security-audits-of-home-assistant/)的四项发现，全部在 Home Assistant Core 2023.9 中修复。

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2023‑10‑19 | 登录客户端发布的 `redirect_uri` 没有检查其协议方案，因此一个 [`javascript:` URL](https://github.com/home-assistant/core/security/advisories/GHSA-jvxq-x42r-f7mv) 可以在前端运行代码。 | 每个来自外部的 URL 在被用作链接或重定向之前都要检查其协议方案。参见[前端](https://www.hasscn.top/contributors/security/guides/frontend/#links)。 |
| 2023‑10‑19 | 一个登录链接可能将授权码发送到攻击者控制的[另一个站点](https://github.com/home-assistant/core/security/advisories/GHSA-qhhj-7hrc-gqj5)。 | 重定向目标需要与其所属客户端严格匹配。 |
| 2023‑10‑19 | 登录链接中的一个参数决定前端将其 WebSocket 连接到哪个服务器，因此一个链接可以[将其连接到伪造的服务器](https://github.com/home-assistant/core/security/advisories/GHSA-cr83-q7r2-7f5q)。 | 绝不要让 URL 参数选择前端信任的服务器。 |
| 2023‑10‑19 | Home Assistant 没有设置 `X-Frame-Options` 头，因此其他站点可以将其加载到框架中进行[点击劫持](https://github.com/home-assistant/core/security/advisories/GHSA-935v-rmg9-44mw)。 | Core 现在默认发送 `X-Frame-Options: SAMEORIGIN`。不要绕过它。 |

## 无需登录的端点

一个不检查请求者身份就响应的端点。处于本地网络上并不等于已登录。

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2026‑06‑18 | 旧版 [Konnected 集成](https://github.com/home-assistant/core/security/advisories/GHSA-x84v-g949-293w)的一个 HTTP 视图设置了 `requires_auth = False`，并在 `POST` 和 `PUT` 上检查令牌，但在 `GET` 上没有。网络上的任何人都可以读取报警面板的状态。该集成已被移除。 | 使用 `requires_auth = False` 时，视图的每个方法都要自行检查请求。参见[集成](https://www.hasscn.top/contributors/security/guides/integrations/#http-views)。 |
| 2023‑12‑14 | 登录页面向本地网络上打开它的任何人显示[所有用户账户](https://github.com/home-assistant/core/security/advisories/GHSA-jqpc-rc7g-vf83)。 | 在登录之前不要泄露关于用户的信息，即使在本地网络上也不行。 |
| 2023‑10‑19 | 标记为仅限本地的 Webhook 可以通过 Home Assistant Cloud（现为 Home Assistant Link）的远程连接[从互联网访问](https://github.com/home-assistant/core/security/advisories/GHSA-wx3j-3v2j-rf45)，该连接使请求看起来像是本地的。 | 请求来自哪里与谁发送它并不是一回事。使用 webhook 辅助元素（helper）中的 `local_only`，它会处理这种情况。参见[集成](https://www.hasscn.top/contributors/security/guides/integrations/#webhooks)。 |

## 服务器端请求伪造

来自调用者的数据最终进入了 Home Assistant 自己使用自身凭据发送的请求中。

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2023‑10‑19 | `hassio.addon_stdin` 动作的 `addon` 字段被放入 Supervisor API 请求的路径中，因此调用者可以访问[其他 Supervisor 端点](https://github.com/home-assistant/core/security/advisories/GHSA-4r74-h49q-rr3h)。 | 使用严格的模式验证每一个进入 URL 或路径的值。Core 现在会根据 slug 模式检查该字段。参见[集成](https://www.hasscn.top/contributors/security/guides/integrations/#treat-what-comes-in-as-untrusted)。 |

## 证书检查

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2025‑02‑18 | 当 aiohttp 的 `verify_ssl` 选项被 `ssl` 取代时，一些集成和库[将旧值直接传递下去](https://github.com/home-assistant/core/security/advisories/GHSA-m3pm-rpgg-5wj6)。根据公告，这关闭了证书检查。 | 使用 Home Assistant 的共享 Web 会话，并将用户的选择作为 `verify_ssl` 传递。参见[集成](https://www.hasscn.top/contributors/security/guides/integrations/#keep-certificate-checks-on)。 |

## 应用与 Supervisor

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2026‑03‑27 | 使用主机网络的应用在 Supervisor 的内部网络上提供[无需登录的端点](https://github.com/home-assistant/core/security/advisories/GHSA-gh5m-4m97-c95h)，并假设没有其他东西能访问它。本地网络上的设备却可以。 | 绑定到内部地址并不等于已登录。参见[应用](https://www.hasscn.top/contributors/security/guides/apps/#do-not-trust-the-network-alone)。 |
| 2023‑03‑08 | 攻击者可以绕过身份验证，并通过 Home Assistant 访问 [Supervisor API](https://github.com/home-assistant/core/security/advisories/GHSA-2j8f-h4mr-qr25)。 | 代理只转发显式列表中的内容。参见[应用](https://www.hasscn.top/contributors/security/guides/apps/#the-supervisor-api-bypass)。 |

## 伴侣应用

[伴侣应用](https://www.hasscn.top/contributors/companion/)持有用户服务器的令牌。任何能让应用自行执行操作的东西都会使用该令牌。

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2026‑07‑31 | 其他应用可以在 Android 应用中打开标签链接，该应用会在不询问用户的情况下将[标签扫描发送到服务器](https://github.com/home-assistant/core/security/advisories/GHSA-2xqv-hwrf-983f)。 | 来自应用外部的操作需要用户的批准。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#ask-before-acting-on-a-link)。 |
| 2026‑07‑31 | [iOS 应用](https://github.com/home-assistant/core/security/advisories/GHSA-j23v-9672-677j)也是如此，通过通用链接实现。 | 同样的教训，在两个平台上都适用。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#ask-before-acting-on-a-link)。 |
| 2026‑07‑26 | 一个邀请链接可以让 Android 应用针对[任意服务器](https://github.com/home-assistant/core/security/advisories/GHSA-68f4-97mf-f68w)开始引导流程，而不显示其地址。随后一个伪造的登录页面可以收集密码。 | 在用户信任一个链接之前，向他们展示该链接会将他们带到哪里。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#show-which-server-you-connect-to)。 |
| 2026‑06‑25 | iOS 应用对内部 URL [忽略了家庭 Wi-Fi 网络列表](https://github.com/home-assistant/core/security/advisories/GHSA-cm5v-547m-qh5h)，因此它可能在任何网络上通过纯 HTTP 发送其令牌。 | 只在用户标记为家庭的网络上使用内部 `http:` URL。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#keep-the-internal-url-at-home)。 |
| 2026‑06‑17 | Android 应用的一个[导出的接收器](https://github.com/home-assistant/core/security/advisories/GHSA-77r5-pw5w-mgj3)接受来自任何应用的位置更新，并将其作为真实位置发送到服务器。 | 不要导出组件。当某个东西必须可访问时，只接受它所需的那个操作，并丢弃随之而来的数据。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#keep-components-private)。 |
| 2026‑05‑11 | 两个应用的 JavaScript 桥会响应来自[其他来源](https://github.com/home-assistant/core/security/advisories/GHSA-7jp2-p2fw-mgvf)的帧，例如网页卡片，并将消息中的回调名称放入其运行的代码中。框架中的页面可以获取访问令牌。 | 只有服务器的主框架与桥通信，消息中的任何内容都不会变成代码。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#guard-the-javascript-bridge)。 |
| 2023‑10‑19 | Android 应用可能被诱导在其 WebView 中加载[任意 URL](https://github.com/home-assistant/core/security/advisories/GHSA-jvpm-q3hq-86rg)。 | WebView 只加载用户的服务器。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#load-only-the-server-in-the-webview)。 |
| 2023‑10‑19 | 一个链接或二维码可以让 iOS 和 macOS 应用在不询问的情况下[调用服务器上的动作](https://github.com/home-assistant/core/security/advisories/GHSA-h2jp-7grc-9xpp)。 | 来自应用外部的操作需要用户的批准。参见[伴侣应用](https://www.hasscn.top/contributors/security/guides/companion-apps/#ask-before-acting-on-a-link)。 |

## 工作流

| 日期 | 出了什么问题 | 教训 |
| --- | --- | --- |
| 2023‑10‑19 | 项目的一个共享 GitHub Action 将拉取请求的分支名称直接放入 shell 脚本中，这是一次[表达式注入](https://github.com/home-assistant/core/security/advisories/GHSA-jff5-5j3g-vhqc)。 | 绝不要将包含外部数据的 `${{ }}` 表达式放入 `run:` 步骤中。参见[依赖与供应链](https://www.hasscn.top/contributors/security/guides/dependencies/#what-went-wrong-before)。 |

## 相关内容

- [报告漏洞](https://www.hasscn.top/contributors/security/report-a-vulnerability/)：如何报告，以及什么符合条件。
- [以安全意识进行审查](https://www.hasscn.top/contributors/security/guides/reviewing/)：在拉取请求中应该查看哪些地方。
