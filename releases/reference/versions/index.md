# 版本与渠道

> Home Assistant 版本号的含义，以及 stable、beta 和 dev 渠道。

Source: https://www.hasscn.top/contributors/releases/reference/versions/

Home Assistant 采用日历版本号：版本号能告诉你发布的时间。

## 版本号

版本号由三部分组成：年份、月份和补丁号。`2026.11.0` 是 2026 年 11 月的发布版本，`2026.11.1` 是它的第一个补丁版本。测试版（beta）会加上 `b` 和一个数字，例如 `2026.11.0b0`。每夜构建版和开发版会加上 `.dev`。

版本号格式由 Home Assistant Core 定义和维护。[版本号规范](https://www.hasscn.top/contributors/core/development/versioning/) 包含完整的格式说明、每种版本类型及示例，以及版本号在代码中是如何设置的。

## 渠道

带有 Supervisor 的安装方式（如 Home Assistant OS）通过渠道获取更新。每个渠道在新功能与稳定性之间有不同的平衡。

| 渠道 | 你会获得 | 适合 |
| --- | --- | --- |
| Stable | 正式版本和补丁版本 | 所有人。这是默认渠道。 |
| Beta | 测试周期间的测试版，以及所有正式版本 | 想帮助测试下一个版本的人。 |
| Dev | 开发分支的每夜构建版 | 开发者以及测试最新代码、并能接受其可能出错的人。 |

你可以在 **设置** > **系统** > **更新** 中在 stable 和 beta 之间切换。参见[你的第一次贡献](https://www.hasscn.top/contributors/releases/first-contribution/)。

Home Assistant Container 则使用镜像标签：`stable`（也是 `latest`）、`beta` 和 `dev`，此外每个版本都有对应的标签。

## 版本从哪里来

安装实例通过 [version.home-assistant.io](https://version.home-assistant.io/stable.json) 获取新版本信息。它为每个渠道发布一个文件，包含 Home Assistant、Supervisor、Home Assistant OS 以及其他组件在每种硬件类型上的当前版本。这些文件在 [version 仓库](https://github.com/home-assistant/version) 中维护。

你无需手动修改它们。当发布版本时，core 的构建工作流会构建镜像、运行端到端测试，然后更新对应渠道的版本文件。正式版本也会推送到 beta 渠道，因此 beta 测试者同样能获取到它。

## 分支

| 仓库 | 开发 | 测试版和补丁版本 | 已发布 |
| --- | --- | --- | --- |
| core | `dev` | `rc` | `master` |
| frontend | `dev` | `rc` | `master` |
| home-assistant.io | `next` | `rc` | `current` |

贡献者向 core 和 frontend 的 `dev` 分支提交 pull request。在 home-assistant.io 中，对现有文档的修复提交到 `current`，而新功能的文档提交到 `next`。

## 各渠道对应的网站

- [www.home-assistant.io](https://www.home-assistant.io/)：当前版本的文档。
- [rc.home-assistant.io](https://rc.home-assistant.io/)：测试版的文档和发布说明。
- [next.home-assistant.io](https://next.home-assistant.io/)：为下一个版本正在构建的内容的文档。
