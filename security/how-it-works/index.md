# Home Assistant 如何处理信任

> Home Assistant 信任谁、它可能在哪里受到攻击，以及系统在运行你的代码之前已经做了哪些保护。

Source: https://www.hasscn.top/contributors/security/how-it-works/

Home Assistant 控制着人们家中的门锁、警报器、摄像头和供暖设备。Home Assistant 的安全问题，就是某人家前门的问题。本页解释其背后的模型：Home Assistant 信任谁、它可能在哪里受到攻击，以及在你的代码运行之前已经有哪些保护措施。[指南](https://www.hasscn.top/contributors/security/guides/)会把这些落实到你所编写的代码上。

## Home Assistant 信任谁

| 谁 | 被信任的内容 |
| --- | --- |
| **管理员** | 一切。他们可以安装自定义集成（integration）和应用，这些会运行代码，并且可以读取所有设置。 |
| **用户** | 使用这个家：查看状态（state）、执行操作。不能更改设置。 |
| **只读用户** | 查看状态。 |
| **其他任何人** | 什么都不行。除了 webhook ID，它本身就是一种权限。参见 [webhooks](https://www.hasscn.top/contributors/architecture/connections/)。 |

这些角色决定了界面和 API 所提供的内容，但它们并不是安全边界。[安全策略](https://www.home-assistant.io/security/)指出，Home Assistant 假定每个已登录的用户都是可信的，并且不强制执行用户权限，因此已登录用户获得更多权限不算作漏洞。

在 Home Assistant 内部运行的代码是完全可信的。[自定义集成](https://www.hasscn.top/contributors/glossary/custom-integration/)是与 Core 运行在同一进程中的 Python，可以做 Core 能做的一切。[应用](https://www.hasscn.top/contributors/apps/how-apps-work/)运行在自己的容器中，但可以请求广泛的访问权限。安装其中任何一种都是管理员的选择，Home Assistant 正因如此会对自定义集成发出警告。

代码中最重要的一条界线是管理员与其他所有人之间的界线。参见[身份验证](https://www.hasscn.top/contributors/core/internals/auth/)和[权限](https://www.hasscn.top/contributors/core/internals/permissions/)。

## Home Assistant 可能在哪里受到攻击

- **它的 Web 服务器。** 许多家庭让 Home Assistant 可以从互联网访问。每一个不需要登录的端点，以及每一个需要登录的端点，都是一扇门。
- **来自设备和服务的数据。** 集成会从网络、云服务或设备读取数据。这些数据可能是错误的，也可能是被故意伪造的。
- **它的依赖项。** 每一个[依赖项（requirement）](https://www.hasscn.top/contributors/glossary/requirement/)都是在 Core 中运行的代码。一个被攻陷的库会攻陷 Home Assistant。
- **用户自己的配置**，例如转发了错误请求头的反向代理。Home Assistant 无法修复这些问题，但它可以拒绝信任本不该信任的内容。

## Home Assistant 已经做了什么

- 每个请求都需要有效的令牌，除了 webhook 和少数有意公开的端点，例如登录页面。
- 登录失败会报告给用户，并且当用户开启了该功能时，来自同一地址的重复登录失败可能导致封禁。
- 带有路径欺骗或可疑字节的请求会在到达任何集成之前被拒绝。
- 在反向代理之后，只有用户配置过的代理所转发的地址才会被信任。
- 共享的 Web 会话（来自 `async_get_clientsession`）会检查 SSL 证书，并拒绝从互联网重定向到本地机器。
- 在用户给定的路径上读取或写入文件的功能，例如拍摄摄像头快照或在通知中附加文件，会根据用户允许的文件夹（`allowlist_external_dirs`）检查该路径。这是这些功能所调用的检查，而不是沙箱：集成运行时的文件访问权限与 Core 相同。

这些保护措施内置于 Home Assistant 中。它们并不涵盖你自己的代码对所获得的数据或所拥有的访问权限所做的处理。这部分取决于你，[安全](https://www.hasscn.top/contributors/security/)区域会按贡献类型展示具体做法。
