# 搭建环境

> 获取前端代码及其依赖，使用 devcontainer 或在自己的机器上进行。

Source: https://www.hasscn.top/contributors/frontend/development/environment/

你可以在 devcontainer 中进行前端开发，也可以直接在自己的机器上进行。devcontainer 是更简单的入门方式：它自带合适的 Node.js、pnpm 和 Python，并且可以在前端旁边运行 Home Assistant Core。

## 获取代码

在 GitHub 上 fork [前端仓库](https://github.com/home-assistant/frontend)，然后克隆你的 fork，并将主仓库添加为 `upstream`：

```shell
git clone git@github.com:YOUR_GIT_USERNAME/frontend.git
cd frontend
git remote add upstream https://github.com/home-assistant/frontend.git
```

每次修改都应从 `dev` 分支切出新分支。拉取请求（pull request）都是提交到 `dev` 分支的。

## 使用 devcontainer

你需要安装了 Dev Containers 扩展的 Visual Studio Code，以及 Docker 或兼容的容器运行时。

1. 在 Visual Studio Code 中打开克隆的仓库。
2. 在提示时选择 **Reopen in Container**。或者打开命令面板并运行 **Dev Containers: Reopen in Container**。
3. 等待容器构建完成。容器每次启动时都会运行 `script/bootstrap`，它会安装 `.nvmrc` 中指定的 Node.js 版本以及依赖项。

容器中预装了 ESLint、Prettier 和 Lit 的推荐扩展，并在你保存文件时自动格式化。

容器中的 8123 端口会映射为你电脑上的 **8124** 端口。无论容器内 8123 端口上运行着什么，你都可以通过 `http://localhost:8124` 访问。

## 在自己的机器上

你需要：

- **Node.js**，版本以 [`.nvmrc`](https://github.com/home-assistant/frontend/blob/dev/.nvmrc) 文件中指定的为准。如果使用 [nvm](https://github.com/nvm-sh/nvm)，只需在仓库中运行 `nvm install`，它会自动选择正确的版本。
- **pnpm**，版本以 `package.json` 中 `packageManager` 字段锁定的版本为准。如果使用 Corepack，该版本会被自动使用：

  ```shell
  corepack enable pnpm
  ```

  如果你的 Node.js 不包含 Corepack，可以用 `npm install -g corepack` 安装它，或者[直接安装 pnpm](https://pnpm.io/installation)。

然后安装依赖项：

```shell
nvm use
script/setup
```

`script/setup` 会运行 `script/bootstrap`，后者会运行 `pnpm install`。当你拉取的更改涉及 `package.json` 或 `pnpm-lock.yaml` 时，请重新运行它。

## 翻译

默认情况下，前端仅以英文运行。要获取所有语言的最新翻译，请使用 `--fetch-translations` 参数启动开发服务器，例如 `pnpm dev --fetch-translations`。首次运行时，它会要求你通过 GitHub 进行授权，并将令牌保存在 `translations/token.json` 中。如果该授权失效，例如出现 "Bad credentials" 错误，请删除该文件并重新运行命令。

## AI 工具

仓库在 `AGENTS.md` 中提供了面向 AI 编程工具的说明，并在 [`.agents/skills/`](https://github.com/home-assistant/frontend/tree/dev/.agents/skills) 中提供了关于组件、样式、面向用户的文本、测试和审查的技能（skills）。Claude Code、GitHub Copilot 和 Codex 会自动识别它们。[使用 AI 工具贡献](https://www.hasscn.top/contributors/start/ai-tools/)列出了这些工具，并提供了添加卡片的流程，还解释了 [AI 政策](https://www.hasscn.top/contributors/start/ai-policy/)对你的要求。

## 下一步

[运行前端](https://www.hasscn.top/contributors/frontend/development/run/)，连接到一个 Home Assistant 实例。
