---
title: Builds
description: Make a production build of the frontend, or run the build of a pull request on a real Home Assistant without a development setup.
order: 6
---

大多数情况下，开发服务器就足够了。这些内容适用于其他情况：当你处理前端的打包方式时，或者当你想在真实的 Home Assistant 上测试拉取请求时。

## 制作正式构建

```shell
pnpm build
```

这会在 `hass_frontend/` 中生成完整的正式构建：包括现代版和旧版构建，经过压缩和打包，并带有 service worker。这需要一些时间。

当你只需要现代版构建时，例如比较打包体积或测量性能，可以跳过旧版构建：

```shell
pnpm build --modern
```

正式构建接受与[开发服务器](/frontend/development/run/#keep-a-server-running-in-the-background)相同的 `--background`、`--status`、`--logs` 和 `--stop` 标志。构建和开发服务器不能同时运行，因为它们写入同一个文件夹。

### 在 Home Assistant 中使用你的构建

要让 Core 使用你的构建而不是它通常安装的前端，请将[前端仓库](https://github.com/home-assistant/frontend)作为 Python 包安装到你的开发 Core 的环境中，并告诉 Home Assistant 不要替换它：

```shell
pip3 install -e /path/to/frontend --config-settings editable_mode=compat
hass --skip-pip-packages home-assistant-frontend
```

## 试用拉取请求

你可以在自己的 Home Assistant 上运行任何打开的前端拉取请求的构建，无需克隆或构建任何东西。这适用于所有安装类型，包括 Home Assistant OS。这对于检查某个修复在你的硬件、浏览器或环境上是否有效非常有用。

### 创建 GitHub 令牌

Home Assistant 会从 GitHub 下载构建，这需要一个令牌（token）：

1. 在 GitHub 中，前往 [**Settings** > **Developer settings** > **Personal access tokens** > **Fine-grained tokens**](https://github.com/settings/personal-access-tokens)。
2. 选择 **Generate new token**，并给它起一个你能认出的名字，比如 "Home Assistant frontend testing"。
3. 选择一个较短的过期时间，比如 90 天。
4. 在 **Repository access** 下，选择 **Public repositories**。权限留空即可。
5. 选择 **Generate token**，并复制它。你将不会再看到它。

### 配置 Home Assistant

将拉取请求的编号和你的令牌添加到 Home Assistant 的 `configuration.yaml` 中，然后重启：

```yaml
frontend:
  development_pr: 12345
  github_token: !secret github_token
```

令牌本身请保存在 `secrets.yaml` 中，切勿放在你会分享的文件里。

启动时，Home Assistant 会下载该拉取请求的构建并使用它，而不是内置的前端。它会保留一份副本，并在之后的重启时检查该拉取请求是否有新的提交，如果有则下载新的构建。如果下载失败，Home Assistant 会回退到内置的前端，并记录失败原因。

如果同时设置了 `development_repo`，则它优先，拉取请求会被忽略。

要恢复原状，请删除这两行并重启。Home Assistant 会移除下载的构建。

### 限制

- 拉取请求需要在 CI 中有成功的构建。
- GitHub 会将这些构建保留 7 天。之后，必须重新构建。作者可以通过更新分支来做到这一点，例如将 `dev` 合并进去。如果你不是作者，请向他们提出请求。
- 这仅用于测试。不要一直开启。
