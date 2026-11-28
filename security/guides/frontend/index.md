# 前端中的不可信内容

> 实体名称、属性、Markdown 和 URL 可能来自任何地方。前端如何对它们进行转义、清理和检查，以及你需要做什么。

Source: https://www.hasscn.top/contributors/security/guides/frontend/

前端展示的数据并非它自己编写的。设备名称来自设备。属性来自云服务。Markdown 卡片显示的是用户或模板放入的内容。这些内容中的任何一个都可能包含 HTML，如果前端按原样渲染该 HTML，它就会在打开仪表盘（dashboard）的每个人的浏览器中运行。这就是跨站脚本攻击（XSS）。

这并非纸上谈兵。XSS 是 Home Assistant [历史安全公告](https://www.hasscn.top/contributors/security/reference/advisories/#cross-site-scripting)中最常见的错误类型。请参阅[以前出过什么问题](https://www.hasscn.top/contributors/security/guides/frontend/#what-went-wrong-before)。

规则很简单：把每一个到达前端的字符串都当作数据，绝不当作标记（markup）。

## 让 Lit 来做转义

Lit 会转义你放入模板中的值，因此一个充满 HTML 的名称会以文本形式显示。这是渲染任何内容最安全的方式，也是前端将其图表提示框（tooltip）迁移到 Lit 模板的原因：像友好名称和设备名称这样由用户控制的字段会被自动转义，而不必依赖对每个字符串单独进行过滤。

```ts
// Escaped by Lit: a name with HTML in it shows as text
return html`${entityName}: ${value}`;
```

当你把 HTML 构建为字符串，并将该字符串交给某个会渲染它的东西时，麻烦就开始了。

- 不要用外部数据设置 `innerHTML`。改用 `textContent`。地图卡片的修复正是这样做的。
- 避免 `unsafeHTML`。目前，前端仅在 `ha-markdown-element` 中使用它，用于渲染已经过清理的 Markdown。
- 一些库，例如图表和地图，接受 HTML 字符串作为提示框或弹窗。当库支持 Lit 模板时，优先使用 Lit 模板。

## 当你必须构建 HTML 字符串时

如果实在无法避免使用字符串，请将每个不可信的部分通过 [`src/common/util/xss.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/util/xss.ts) 中的 `filterXSS` 进行处理：

```ts
import { filterXSS } from "../../common/util/xss";

return `${filterXSS(path.name ?? "")}<br>${formattedTime}`;
```

`filterXSS` 的允许列表（allowlist）为空，因此任何标签都无法通过。请将它用于最终会进入 HTML 的纯文本，而不是用于应保留其格式的内容。

## Markdown

使用 `<ha-markdown>` 组件渲染 Markdown。它会将 Markdown 转换为 HTML，然后使用标签和属性的允许列表过滤结果。只有列表中的内容才能通过。

`<ha-markdown>` 有一个 `allow-svg` 选项。代码对此说得很清楚：不要在不可信内容上允许 SVG，它会导致 XSS。在前端中，它仅在配置流程对话框和操作编辑器等地方启用。

## 链接

URL 也可能是危险的：链接中的 `javascript:` URL 会在有人点击它时运行代码。每一个作为数据到达前端的 URL，无论是来自集成（integration）清单、应用程序、配置流程还是实体（entity）属性，都应该先经过检查。这些辅助函数位于 [`src/common/url/sanitize-http-url.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/url/sanitize-http-url.ts) 中：

- `sanitizeHttpUrl(url)` 仅当 URL 是绝对的 `http:` 或 `https:` URL 时才返回该 URL，否则返回 `undefined`。
- `sanitizeLinkUrl(url)` 还接受 `homeassistant://` 深度链接，并将它们转换为前端内部的路径。仅替换协议（scheme）是不够的：`homeassistant:///example.com` 会变成 `//example.com`，这会指向另一个站点。

```ts
const releaseUrl = sanitizeHttpUrl(stateObj.attributes.release_url);
```

## 以前出过什么问题

- **提示框中的名称。** [能源仪表盘的图表提示框](https://github.com/home-assistant/core/security/advisories/GHSA-mq77-rv97-285m)中的实体名称、[历史图表卡片](https://github.com/home-assistant/core/security/advisories/GHSA-46j8-vpx8-6p72)中的实体名称，以及[地图卡片](https://github.com/home-assistant/core/security/advisories/GHSA-r584-6283-p7xc)中的设备名称，最终都进入了 HTML 字符串。能源仪表盘中的名称可能来自集成的云服务，而不仅仅来自用户。
- **没有清理器的 Markdown。** 2017 年的第一份安全公告就是 [Markdown 输出中的 XSS](https://github.com/home-assistant/frontend/pull/514)。
- **一个 `javascript:` URL。** 登录客户端发布的 `redirect_uri` 未检查其协议，并[在前端运行了代码](https://github.com/home-assistant/core/security/advisories/GHSA-jvxq-x42r-f7mv)。
- **一个选择服务器的 URL 参数。** 一个登录链接可以让前端[连接到伪造的 WebSocket 服务器](https://github.com/home-assistant/core/security/advisories/GHSA-cr83-q7r2-7f5q)，然后该服务器可以向它发送任何它想要的内容。

## 相关内容

- [历史安全公告](https://www.hasscn.top/contributors/security/reference/advisories/)：每一份安全公告，按类型分组。
- [安全辅助函数](https://www.hasscn.top/contributors/security/reference/helpers/#frontend)：以表格形式呈现的前端辅助函数。
- [安全的集成](https://www.hasscn.top/contributors/security/guides/integrations/)：另一面，即数据的来源。
- [前端](https://www.hasscn.top/contributors/frontend/)：前端是如何构建的。
