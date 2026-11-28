# 实例发现

> Home Assistant 如何使用 Zeroconf 在本地网络上宣布自己的存在，使应用程序无需用户输入地址即可找到它。

Source: https://www.hasscn.top/contributors/core/internals/instance-discovery/

Home Assistant 在本地网络上以 mDNS（Zeroconf）服务 `_home-assistant._tcp.local.` 的形式宣布自己的存在。像伴侣应用（companion apps）这样的应用程序会浏览该服务来查找实例（instance），而无需用户手动输入地址。

作为默认配置一部分的 `zeroconf` 集成（integration）会在 `frontend` 集成设置完成或 Home Assistant 启动后发布该记录。到那时 HTTP 服务器已经启动，因此记录中的地址是可用的。

## 服务记录

| 字段 | 值 |
| --- | --- |
| 服务类型 | `_home-assistant._tcp.local.` |
| 实例名称 | `<location_name>._home-assistant._tcp.local.`。位置名称中的点会被替换为空格，并且名称会被截断以符合 DNS 标签 63 字节的限制。如果该名称已被占用，Zeroconf 会添加后缀。 |
| 主机 | `<uuid>.local.`，其中 `<uuid>` 是实例 ID。 |
| 端口 | HTTP 服务器的端口：默认为 8123；当 Home Assistant 在 Supervisor 下运行时（例如在 Home Assistant OS 上）为 80。环境变量 `SETUP_PORT` 会覆盖该默认值。 |

## TXT 属性

| 属性 | 含义 |
| --- | --- |
| `location_name` | 实例的名称，来自 `hass.config.location_name`，如果未设置则为 `Home`。它与实例名称中经过清理的名称相同：点被替换为空格，并截断至不超过 63 字节。 |
| `uuid` | 实例 ID：一个稳定且不透明的标识符，由 32 个十六进制字符组成，在首次运行时创建。即使实例的地址发生变化，也可以用它来识别之前见过的实例。 |
| `version` | Home Assistant Core 的版本。 |
| `internal_url` | 本地网络的 URL（如果 Home Assistant 知道的话）。否则为空。 |
| `external_url` | 网络外部的 URL（如果 Home Assistant 知道的话）。否则为空。 |
| `base_url` | 已弃用，为旧客户端保留。为外部 URL；如果没有外部 URL，则为内部 URL。 |

TXT 值最多为 230 字节。Home Assistant 会用空字符串替换超长的值，这样单个过长的 URL 就不会破坏整个公告。

## 在核心（core）安装之前

在 Home Assistant OS 的首次设置过程中，[着陆页（landing page）](https://github.com/home-assistant/landingpage)会代替核心运行，并发布相同的服务类型。它的记录包含一个设置为 `True` 的 `landingpage` 属性，以及一个值为 `0000.0.0` 的 `version`，这不是一个真实的版本。正在运行的核心绝不会设置 `landingpage`。请将缺失或占位符式的 `version` 视为未知。

旧的记录可能还带有 `requires_api_password`。它指的是一种已在 Home Assistant 2024.7 中移除的身份验证方法，核心不再发送它。请忽略它。
