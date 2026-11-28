# 代码仓库

> Home Assistant 的代码在 GitHub 上的分布情况，以及针对不同需求应前往哪个仓库。

Source: https://www.hasscn.top/contributors/architecture/repositories/

Home Assistant 的代码分布在许多仓库中，其中大部分位于 GitHub 上的 [home-assistant](https://github.com/home-assistant) 组织中。你通常只需要在其中一两个仓库中工作。本页将告诉你应该去哪个仓库。

## 主要仓库

| 仓库 | 内容 | 语言 |
| --- | --- | --- |
| [core](https://github.com/home-assistant/core) | Home Assistant Core 以及每个内置集成（integration） | Python |
| [frontend](https://github.com/home-assistant/frontend) | 网页界面、组件展示库和演示页面 | TypeScript |
| [android](https://github.com/home-assistant/android) | Android 应用，适用于手机、Wear OS 和车载系统 | Kotlin |
| [iOS](https://github.com/home-assistant/iOS) | 适用于 iPhone、iPad、Mac、Apple Watch 和 CarPlay 的应用 | Swift |
| [supervisor](https://github.com/home-assistant/supervisor) | Supervisor | Python |
| [operating-system](https://github.com/home-assistant/operating-system) | Home Assistant OS | Buildroot、shell |

## 文档与设计

| 仓库 | 内容 |
| --- | --- |
| [home-assistant.io](https://github.com/home-assistant/home-assistant.io) | 用户文档，包括每个集成的专属页面 |
| [companion.home-assistant](https://github.com/home-assistant/companion.home-assistant) | 伴侣应用（companion apps）的文档 |
| [brands](https://github.com/home-assistant/brands) | 集成的标志和图标 |
| [architecture](https://github.com/home-assistant/architecture) | 架构讨论与决策，参见[决策是如何制定的](https://www.hasscn.top/contributors/architecture/decisions/) |

## Supervisor 相关

| 仓库 | 内容 |
| --- | --- |
| [addons](https://github.com/home-assistant/addons) | 官方应用 |
| [apps-example](https://github.com/home-assistant/apps-example) | 用于起步的应用示例 |
| [cli](https://github.com/home-assistant/cli) | `ha` 命令行工具 |
| [os-agent](https://github.com/home-assistant/os-agent) | Home Assistant OS 宿主机上的辅助程序 |
| [docker-base](https://github.com/home-assistant/docker-base) | Home Assistant 和应用的基础镜像 |
| `plugin-dns`, `plugin-audio`, `plugin-cli`, `plugin-multicast`, `plugin-observer` | Supervisor 的插件 |

## 库

| 仓库 | 内容 |
| --- | --- |
| [home-assistant-js-websocket](https://github.com/home-assistant/home-assistant-js-websocket) | WebSocket API 的 JavaScript 客户端 |
| [home-assistant-libs](https://github.com/home-assistant-libs) | 一个由本项目维护的 Python 库组织，例如 Supervisor 客户端 |
| [OHF-Voice](https://github.com/OHF-Voice) | Open Home Foundation 的语音项目，例如 Assist 能理解的语句 |

## 按需求选择仓库

| 你想要 | 前往 |
| --- | --- |
| 修复某个集成中的缺陷 | core |
| 添加新的集成 | core，然后到 home-assistant.io 编写其文档，到 brands 添加其标志 |
| 修改界面中的内容 | frontend，如果是集成的文本则到 core |
| 修复文档 | home-assistant.io |
| 报告缺陷 | 存在缺陷的那部分代码所在的仓库。不确定？请在 [Discord](https://www.home-assistant.io/join-chat) 上询问。 |
| 建议新功能 | [功能请求](https://github.com/home-assistant/feature-requests/discussions)讨论区 |

## 参与贡献

上面列出的每个仓库都对应本网站的一个板块，其中说明了如何在那里进行你的第一次修改。请查看[准备好贡献了吗？](https://www.hasscn.top/contributors/architecture/#ready-to-contribute)以了解全貌。
