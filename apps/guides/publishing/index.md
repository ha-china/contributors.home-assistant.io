# 发布你的应用

> 使用 builder actions 为每种架构构建镜像，发布到容器镜像仓库，并为你的发布进行版本管理。

Source: https://www.hasscn.top/contributors/apps/guides/publishing/

让用户用上你的应用有两种方式：让他们的设备自行构建，或者你自己构建镜像并发布到容器镜像仓库（container registry）。发布镜像在几乎所有方面都对用户更好。

## 在设备上构建，还是预构建

如果 `config.yaml` 中没有 `image`，每个用户的设备在安装或更新你的应用时都会根据 `Dockerfile` 进行构建。这对你来说很省事，在你尝试想法的阶段也没问题。但对用户来说，这很慢，会损耗 SD 卡，而且一旦构建所下载的软件包发生变化或消失，构建就会失败。

配置了 `image` 后，Supervisor 会拉取现成的镜像。安装快速且可靠，每个用户运行的都正是你测试过的内容。一旦有人开始使用你的应用，就应发布镜像。

## 使用 GitHub Actions 构建

[builder](https://github.com/home-assistant/builder) 仓库提供可组合的 GitHub Actions，用于构建、签名和发布多架构镜像：

| Action | 作用 |
| --- | --- |
| `prepare-multi-arch-matrix` | 将架构列表转换为构建矩阵 |
| `build-image` | 为单个架构构建并推送镜像，例如 `ghcr.io/me/aarch64-my-app` |
| `publish-multi-arch-manifest` | 将各架构的镜像合并为一个多架构镜像，例如 `ghcr.io/me/my-app` |
| `cosign-verify` | 验证 Cosign 签名，供其他 action 使用 |

[示例应用仓库](https://github.com/home-assistant/apps-example) 包含一个完整的工作流，在每次推送到 `main` 时构建所有发生变更的应用。可以复制它作为起点。builder 的 README 中有一个针对单个镜像的更简单的示例。

需要设置的一些事项：

- 工作流使用工作流自身的令牌推送到 GitHub Container Registry，这需要 `packages: write` 权限。使用 Cosign 签名需要 `id-token: write`。
- 首次推送镜像时，它是私有的。请在 GitHub 的软件包设置中将其设为公开，否则用户无法拉取它。
- 将 action 固定到 builder 的某个发布版本，而不是分支。

> [!NOTE]
> 旧的一体化 `home-assistant/builder` action 已弃用且不再维护。如果你的工作流仍在使用它，请迁移到上述 action。[示例应用仓库](https://github.com/home-assistant/apps-example) 展示了新的配置方式。

## 让 config.yaml 指向镜像

将 `image` 设置为多架构镜像的名称，不带标签：

```yaml
image: "ghcr.io/me/my-app"
```

Supervisor 会拉取与 `version` 匹配的标签，Docker 会从 manifest 中选择正确的架构。较旧的应用会为每个架构发布一个镜像，并使用 `{arch}` 占位符，例如 `ghcr.io/me/{arch}-my-app`。这仍然可用，但对于新应用来说，多架构镜像是更好的选择。

## 版本

`config.yaml` 中的 `version` 是唯一的权威来源：它是用户看到的版本、Supervisor 拉取的标签，也是更新通知所比较的依据。因此：

- 在修改仓库中的 `version` 之前，先以新标签推送镜像。否则，用户会收到一个无法下载的更新。
- 绝不要在已有标签下推送不同的镜像。已经拥有该镜像的用户不会得到变更，而新用户会得到与老用户不同的内容。
- 使用能正确排序的版本方案，例如[语义化版本（Semantic Versioning）](https://semver.org/)，或基于日期的方案如 `2026.10.0`。

示例工作流会从 `config.yaml` 中的 `version` 读取标签，并在应用的 `config.yaml`、`Dockerfile` 或 `rootfs` 在 `main` 上发生变更时构建并推送该应用。从这次推送直到构建结束之间，如果用户的 Supervisor 重新加载了你的仓库，用户已经能看到更新，但还无法下载。请保持这个时间窗口尽量短，并且不要在构建失败时发布版本更新。

## 不向后兼容的变更

用户可以为每个应用开启自动更新。如果某个发布需要用户关注，例如配置变更或无法撤销的迁移，请将其版本添加到 `breaking_versions` 中：

```yaml
version: "3.0.1"
breaking_versions:
  - "3.0.0"
```

这样，对于使用较旧版本的用户，Supervisor 绝不会自动安装该版本或其之后的版本。他们会看到更新，阅读你的更新日志，然后自行安装。请在 `CHANGELOG.md` 的顶部说明这个不向后兼容的变更。

## 最低版本要求

如果你的应用需要较新版 Home Assistant Core 的某项功能，请将 `homeassistant` 设置为最低版本。在较旧的安装中，该应用将不可安装。

## 让用户添加你的应用

用户从你的仓库安装你的应用。README 中的 [My link](https://www.hasscn.top/contributors/glossary/my-link/) 徽章会打开在他们自己的 Home Assistant 中添加你的仓库的对话框，并自动填入 URL。参见[一步到位](https://www.hasscn.top/contributors/apps/guides/repository/#make-it-one-step)。
