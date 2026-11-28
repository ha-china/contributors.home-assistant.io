# 保护应用安全

> 在应用领域安全指南的基础上，关于应用和 Supervisor 的安全公告带给我们的经验教训。

Source: https://www.hasscn.top/contributors/security/guides/apps/

[应用](https://www.hasscn.top/contributors/glossary/app/)运行在自己的容器中，与 Home Assistant 和 [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/) 并存。应用领域已经介绍了如何保证应用安全：[保护你的应用](https://www.hasscn.top/contributors/apps/guides/security/)讲解了需要申请哪些权限、AppArmor、保护模式、API 角色和登录，而[安全评级](https://www.hasscn.top/contributors/apps/reference/security-rating/)则展示了用户如何看待你的选择。请从这里开始。

本页补充了[过往安全公告](https://www.hasscn.top/contributors/security/reference/advisories/#apps-and-the-supervisor)中与应用和 Supervisor 相关的经验教训。

## 不要仅依赖网络隔离

应用中一个常见的模式：运行在宿主网络上，并在 Supervisor 的内部网络 `hassio` 上提供一个无需登录的端点。当时的想法是只有其他容器才能访问该地址。2026 年，一份安全公告表明这[并非事实](https://github.com/home-assistant/core/security/advisories/GHSA-gh5m-4m97-c95h)。本地网络上的一台设备可以通过宿主机添加一条通往内部地址的路由，从而直接访问这些端点。该公告点名了一个终端应用中的 shell，以及另外两个应用的 WebSocket API。

Supervisor 2026.03.2 为所有安装修复了此问题：它在宿主机上添加了防火墙规则，丢弃发往该网络网关地址的流量，除非流量来自该网络本身或来自宿主机。

这一教训的意义远不止这一次修复。端点监听的位置并不等于登录。

- 为每个可以更改内容或显示私密内容的端点添加登录。为此请使用 [Home Assistant 用户](https://www.hasscn.top/contributors/apps/guides/security/#use-home-assistant-users)，而不是自己实现。
- 对于 Web 界面，请使用 [ingress](https://www.hasscn.top/contributors/apps/guides/ingress/)，并且只接受来自 Supervisor 在 `172.30.32.2` 的连接。这样登录就由 Home Assistant 处理。
- 只有当你的应用确实需要时才使用宿主网络。使用宿主网络还会降低[安全评级](https://www.hasscn.top/contributors/apps/reference/security-rating/)。

## Supervisor API 绕过漏洞

2023 年，一份安全公告表明攻击者可以绕过身份验证，并通过 Home Assistant 远程访问 [Supervisor API](https://github.com/home-assistant/core/security/advisories/GHSA-2j8f-h4mr-qr25)。该 API 可以安装更新、管理应用和备份。[公告](https://www.home-assistant.io/blog/2023/03/08/supervisor-security-disclosure/)指出，这个问题自 2017 年 Supervisor 推出以来就一直存在。

Core 和 Supervisor 中的修复展示了两种适用于任何转发请求的应用的模式：

- **只转发白名单中的内容。** Core 中 Supervisor API 的代理现在只转发与显式列表匹配的路径，其中一份列表用于无需登录的请求，另一份用于管理员。其他所有请求都会被拒绝。
- **先解码再检查。** Core 会拒绝解码后发生变化的路径。Supervisor 会在检查路径和查询字符串中是否存在 `../` 之类的模式之前，根据需要进行多次解码。

同年的一份相关安全公告展示了一个由外部数据构建的路径：`hassio.addon_stdin` 动作的 `addon` 字段最终进入了 [Supervisor API 请求](https://github.com/home-assistant/core/security/advisories/GHSA-4r74-h49q-rr3h)的路径中。Core 现在会根据严格的 slug 模式检查该字段。如果你的应用根据输入构建 URL 或路径，请以同样的方式检查该输入。

## 申请最小的角色

Supervisor API 会保护自己，但你的应用持有它的令牌。如果你的应用被攻破，攻击者将获得该令牌所允许的一切。选择能正常工作的最低 [API 角色](https://www.hasscn.top/contributors/apps/guides/security/#api-roles)，并且只在需要调用时才启用 `hassio_api`、`homeassistant_api` 或 `auth_api`。

## 相关内容

- [保护你的应用](https://www.hasscn.top/contributors/apps/guides/security/)：应用领域的完整指南。
- [安全评级](https://www.hasscn.top/contributors/apps/reference/security-rating/)：每项选择如何影响评级。
- [过往安全公告](https://www.hasscn.top/contributors/security/reference/advisories/)：按类型分组的所有安全公告。
