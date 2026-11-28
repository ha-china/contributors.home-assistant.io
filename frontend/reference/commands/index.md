# 命令

> 前端仓库的每一个命令、其作用以及所使用的端口。

Source: https://www.hasscn.top/contributors/frontend/reference/commands/

请在[前端仓库](https://github.com/home-assistant/frontend)的根目录下运行这些命令。

## 设置

| 命令 | 作用 |
| --- | --- |
| `script/setup` | 安装依赖。在 devcontainer 中，还会安装合适的 Node.js。 |
| `script/core` | 仅限 devcontainer：从其 `dev` 分支安装并启动 Home Assistant Core，配置为使用你的前端。`-r <ref>` 可选择其他分支或标签，`-s` 跳过安装。 |
| `script/setup_translations` | 获取最新翻译，首次运行时会请求 GitHub 授权。 |

## 开发服务器

| 命令 | 端口 | 提供的内容 |
| --- | --- | --- |
| `pnpm dev` | | 将应用构建到 `hass_frontend/` 中，供设置了 `development_repo` 的 Core 使用。在该 Core 的端口上打开它。 |
| `pnpm dev:serve` | 8124 | 构建并提供应用服务，连接到一个 Core。`-c <url>` 设置 Core（默认 `http://localhost:8123`），`-p <port>` 设置端口。在 devcontainer 中默认端口是 8123，对应你电脑上的 8124。 |
| `pnpm dev:demo` | 8090 | [演示](https://www.hasscn.top/contributors/frontend/development/gallery-and-demo/#the-demo)。 |
| `pnpm dev:gallery` | 8100 | [画廊](https://www.hasscn.top/contributors/frontend/development/gallery-and-demo/#the-gallery)。 |
| `pnpm test:e2e:app:dev` | 8095 | 用于端到端测试的应用测试环境。 |

所有开发服务器都支持 `--background`、`--status`、`--logs [--follow]` 和 `--stop`。除端到端测试环境外，其余都支持 `--fetch-translations`。参见[运行前端](https://www.hasscn.top/contributors/frontend/development/run/#keep-a-server-running-in-the-background)。

## 检查与测试

| 命令 | 作用 |
| --- | --- |
| `pnpm lint` | ESLint、Prettier、TypeScript 编译器以及 Lit 分析器。 |
| `pnpm format` | 修复 ESLint 和 Prettier 能修复的问题。 |
| `pnpm lint:types` | 仅运行 TypeScript 编译器。切勿向其传递文件参数。 |
| `pnpm lint:lit` | 仅运行 Lit 分析器。 |
| `pnpm test` | 使用 Vitest 运行单元测试。 |
| `pnpm test:coverage` | 运行单元测试，并生成覆盖率报告。 |
| `pnpm test:e2e:app` | 应用的端到端测试。 |
| `pnpm test:e2e:demo` | 演示的端到端测试。 |
| `pnpm test:e2e:gallery` | 画廊的端到端测试。 |
| `pnpm test:e2e` | 全部三个端到端测试套件。 |
| `pnpm test:e2e:show-report` | 打开合并后的端到端测试报告。 |

## 构建

| 命令 | 作用 |
| --- | --- |
| `pnpm build` | 完整的生产构建，输出到 `hass_frontend/`。支持后台运行标志。 |
| `pnpm build --modern` | 仅进行现代构建，用于体积和性能对比。 |
| `script/gen_demo_core_data` | 重新生成来自 Core 的演示数据。 |
