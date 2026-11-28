# 发布与构建

> Home Assistant OS 的更改如何从拉取请求（pull request）走到发布，包括涉及的分支、版本号和构建流水线。

Source: https://www.hasscn.top/contributors/os/operating-system/releases/

Home Assistant OS 没有固定的发布时间表。维护者会在有值得发布的内容时发布，比如内核更新、修复或新功能。本页介绍你的更改所经历的流程。

## 发起拉取请求

Fork [home-assistant/operating-system](https://github.com/home-assistant/operating-system)，创建一个分支，然后针对 `dev` 发起你的拉取请求（pull request）。

请解释这个更改*为什么*重要，而不仅仅是它做了什么。“更新内核”在 diff 中就能看到。“更新内核，因为它修复了 X 开发板上的以太网”才是审阅者需要知道的信息。简短的理由即可，只要有就行。

更改构建或系统的拉取请求可以加上 `run-ova-test` 标签。这会构建 OVA 镜像并在其上运行自动化测试，参见[测试你的构建](https://www.hasscn.top/contributors/os/operating-system/test/#run-the-automated-tests)。只有维护者才能设置标签，而且构建只针对主仓库中的分支运行。

## 分支

- `dev` 承载开发期间的下一个版本。每个更改都先进入这里，包括面向当前发布的修复。
- `rc` 承载发布候选版本。维护者将 `dev` 中已就绪的更改移入其中。
- `main` 承载稳定发布。发布之后，`main` 会合并回 `dev`。

较旧的大版本曾有各自的 `rel-<major>` 分支。这些分支不再用于新的发布。

## 版本号

版本号格式为 `MAJOR.MINOR`，例如 `18.3`。版本号位于 `buildroot-external/meta` 中，并带有一个可选的后缀：

| 类型 | 示例 | 来源 |
| --- | --- | --- |
| 开发构建 | `18.4.dev20261006` | `dev`，后缀为构建日期 |
| 发布候选版本 | `18.4.rc1` | `rc` |
| 稳定发布 | `18.4` | `main`，无后缀 |

本地构建会原样使用 `meta` 中的后缀，例如 `18.4.dev0`。CI 会将其替换为开发构建的日期。

## 部署类型

`buildroot-external/meta` 中的 `DEPLOYMENT` 值决定镜像信任哪些用于更新的证书，参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/#security)。

| 部署类型 | 通道 | 用途 |
| --- | --- | --- |
| `development` | dev | 开发构建 |
| `staging` | beta | 发布候选版本 |
| `production` | stable | 发布 |

当部署类型、版本号格式和通道不匹配时，构建流水线会拒绝发布该构建。

## 构建流水线

GitHub Actions 通过 [`.github/workflows/build.yaml`](https://github.com/home-assistant/operating-system/blob/dev/.github/workflows/build.yaml) 构建所有公开镜像。它在两种情况下运行：

- **发布 GitHub release 时。** 它构建所有开发板、运行测试，并将镜像附加到该 release。预发布（pre-release）进入 beta 通道，正式发布进入 stable 通道。
- **维护者手动启动时。** 它构建他们所选开发板（或全部开发板）的开发版本。镜像发布在 [os-artifacts.home-assistant.io](https://os-artifacts.home-assistant.io/index.html) 上。

针对 fork 的构建不会发布任何内容，并且使用一次性的自签名证书而不是发布证书进行签名。

## 发布之后

发布说明会根据已合并拉取请求的标签自动生成，例如 `board/raspberrypi` 或 `build`。用户通过 Supervisor 获取新版本，Supervisor 会检查 [version.home-assistant.io](https://version.home-assistant.io/stable.json) 以获取其通道的最新 OS 版本。更新本身通过 RAUC 进行，参见[更新系统](https://www.hasscn.top/contributors/os/operating-system/update-system/)。
