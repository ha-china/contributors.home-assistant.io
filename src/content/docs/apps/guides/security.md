---
title: 保护你的应用安全
description: 保证你的应用及其运行系统的安全。尽量少申请权限，添加 AppArmor 配置文件，选择合适的 API 角色，并使用 Home Assistant 进行登录。
order: 9
---

你的应用运行在别人的家中，与他们的摄像头、门锁和警报系统相邻。用户对此给予你信任。Supervisor 通过将应用限制在容器内，以及向用户展示你应用的[安全评级](/apps/reference/security-rating/)来提供帮助。本指南介绍你可以做些什么来保持高评级并降低风险。

## 尽量少申请权限

最有效的一步不需要任何成本：只申请你的应用所需的访问权限。

- 除非必要，不要在主机网络上运行。
- 除非你的应用需要写入，否则将文件夹映射为只读。
- 优先使用 `device` 选项或 `devices`，而不是 `uart`、`usb` 或 `full_access`。
- 只在 `privileged` 中添加你的软件真正使用的权限。
- 只申请你会调用的 API 访问权限，并使用可行的最低角色。
- 为你的网页界面使用 ingress，而不是暴露端口。

## 保护模式

每个应用默认都开启**保护模式**。开启时，即使你的 `config.yaml` 申请了 `full_access`、`docker_api` 或 `host_pid`，Supervisor 也不会授予这些权限。用户可以在应用页面关闭保护模式，UI 会在他们这样做时发出警告。通过 Supervisor API，只有拥有 `admin` 角色的调用者才能更改它。这包括拥有 `hassio_api: true` 和 `hassio_role: admin` 的应用，无论是对自身还是对任何其他应用。

如果你的应用需要关闭它，请在你的文档中说明，并解释原因。

## AppArmor

AppArmor 限制容器中的进程可以做什么：它们可以读写哪些文件、可以运行哪些程序、可以发送哪些信号。除非你设置 `apparmor: false`（这会降低评级），否则每个应用都使用 Docker 的默认 AppArmor 配置文件运行。

在你的应用文件夹中放置一个 `apparmor.txt`，Supervisor 就会将其加载为你的应用的配置文件。一个为你的应用量身定制的配置文件是强大的第二道防线：即使攻击者在你的软件中找到了漏洞，他们也只能做配置文件允许的事情。它还会提高安全评级。

该文件必须恰好包含一行顶层 `profile` 行。Supervisor 在加载配置文件时，会将该行上的名称替换为你的应用的 ID，例如 `local_example`，因此请使用你的应用的 slug 作为名称。此示例适用于一个 slug 为 `example`、使用 S6 overlay 运行 `/usr/bin/my_program` 的应用。`/etc/services.d`、`/etc/cont-init.d` 和 `/etc/cont-finish.d` 的规则涵盖旧版服务格式，`/etc/s6-overlay` 的规则涵盖 [s6-rc 格式](/apps/guides/s6-overlay/#the-s6-rc-layout)。该规则包含写权限：如果你的应用将其 `user` bundle 保存在 `s6-rc.d` 而不是 `user-bundles.d` 中，S6 overlay 会在启动时写入该文件夹。

```text
#include <tunables/global>

profile example flags=(attach_disconnected,mediate_deleted) {
  #include <abstractions/base>

  # Capabilities
  file,
  signal (send) set=(kill,term,int,hup,cont),

  # S6 overlay
  /init ix,
  /bin/** ix,
  /usr/bin/** ix,
  /run/{s6,s6-rc*,service}/** ix,
  /package/** ix,
  /command/** ix,
  /etc/services.d/** rwix,
  /etc/cont-init.d/** rwix,
  /etc/cont-finish.d/** rwix,
  /etc/s6-overlay/** rwix,
  /run/{,**} rwk,
  /dev/tty rw,

  # Bashio
  /usr/lib/bashio/** ix,
  /tmp/** rwk,

  # Options and other files of the app
  /data/** rw,

  # Run the program in its own, stricter profile
  /usr/bin/my_program cx -> my_program,

  profile my_program flags=(attach_disconnected,mediate_deleted) {
    #include <abstractions/base>

    # Receive signals from S6 overlay
    signal (receive) peer=*_example,

    # Files the program needs
    /data/** rw,
    /share/** rw,
    /usr/bin/my_program r,
    /bin/bash rix,
    /bin/echo ix,
    /etc/passwd r,
    /dev/tty rw,
  }
}
```

要为你的应用编写配置文件：

1. 从示例开始。S6 overlay 部分对每个使用基础镜像的应用都是相同的；如果你的启动脚本需要更多权限，可以添加，但不要删除任何内容。
2. 如果你打包的软件自带 AppArmor 配置文件，请将其用于该软件的进程。软件开发者提供的配置文件比你猜测的更好。
3. 否则，添加你所知道的软件需要的访问权限，并在配置文件的 flags 中添加 `complain`。
4. 运行应用并使用每个功能。在 complain 模式下，AppArmor 会记录它本会阻止的操作，而不是阻止它。在主机上使用 `journalctl _TRANSPORT="audit" -g 'apparmor="ALLOWED"'` 读取日志。
5. 补充缺失的权限，直到使用应用时不再记录警告。
6. 移除 `complain`，让 AppArmor 阻止其他所有操作。

更新软件时重复此过程，因为新版本可能需要新的访问权限。

## API 角色

设置 `hassio_api: true` 后，你的应用可以调用 Supervisor API 中基本端点之外的端点。`hassio_role` 决定可以访问的范围：

| 角色 | 可以调用 |
| --- | --- |
| `default` | 每个 `info` 端点，例如 `/supervisor/info` 或 `/addons/<app>/info` |
| `homeassistant` | 上述内容，以及所有 `/core` 端点 |
| `backup` | 上述 `info` 端点，以及所有 `/backups` 端点 |
| `manager` | API 的大部分内容：应用、商店、备份、Core、主机、操作系统和插件。不包括应用的安全设置、擦除数据盘或主机的 SSH 密钥 |
| `admin` | 一切，包括任何应用的保护模式，包括它自己的 |

`manager` 和 `admin` 会降低安全评级，分别降低 1 和 2。它们是为管理系统设计的应用准备的，例如终端或 Supervisor 的仪表盘。

没有 `hassio_api` 时，你的应用仍然可以使用它自己的大部分 `/addons/self` 端点（不包括 `security` 和 `update`）、`/info`、服务、发现和身份验证。请参阅[与 Home Assistant 和 Supervisor 通信](/apps/guides/communication/#the-supervisor-api)。

`homeassistant_api` is separate from these roles: it controls access to the Home Assistant Core API proxy at `/core/api`. Through the proxy, your app acts as an administrator of Home Assistant, so it can call everything an administrator can, including managing users. The roles above do not limit this. See [Home Assistant Core](/apps/guides/communication/#home-assistant-core).

## 使用 Home Assistant 用户

如果你的应用有一个不通过 ingress 的登录功能，不要在应用选项中发明自己的带密码的用户数据库。请改为检查用户的 Home Assistant 凭据。添加 `auth_api: true`，并将用户名和密码发送给 Supervisor。在这里，请将你的令牌放在 `X-Supervisor-Token` 头中，而不是 `Authorization` 中：此端点将 `Authorization` 头读取为用户的 HTTP 基本身份验证，在那里放置 `Bearer` 令牌会得到 `401`。

```bash
curl -sSL -X POST \
  -H "X-Supervisor-Token: ${SUPERVISOR_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"username": "jane", "password": "secret"}' \
  http://supervisor/auth
```

`200` 响应表示凭据有效；其他任何响应都表示无效。该端点还接受表单数据，以及在 `Authorization` 头中携带用户凭据的 HTTP 基本身份验证。

使用 ingress 时，你通常不需要这样做：Home Assistant 已经让用户登录，并且当 ingress 会话有用户时，[用户头](/apps/guides/ingress/#know-who-is-there)会告诉你这个人是谁。

## 为你的镜像签名

[builder](/apps/guides/publishing/) 的 `build-image` 和 `publish-multi-arch-manifest` 操作可以使用 Cosign 为你的镜像签名。签名让任何人都可以验证镜像是否来自你的仓库的工作流。Supervisor 目前不检查签名，签名也不会改变安全评级，但开启它的成本很低。
