# Lint 和测试

> 前端的 linter、类型检查、单元测试和端到端测试，以及何时编写测试。

Source: https://www.hasscn.top/contributors/frontend/development/testing/

CI 会在你的 pull request 上运行所有这些检查。自己先运行一遍，比等 CI 来告诉你更快。

## Lint 和格式化

```shell
pnpm lint
pnpm format
```

`pnpm lint` 会运行 ESLint、Prettier、TypeScript 编译器以及 Lit 分析器，后者会根据模板中元素的属性来检查你的模板。`pnpm format` 会修复 ESLint 和 Prettier 能自行修复的问题。

只运行类型检查：

```shell
pnpm lint:types
```

> [!WARNING]
> 永远不要向 `pnpm lint:types` 或 `tsc` 传递文件参数。传入文件参数时，编译器会忽略 `tsconfig.json`，并可能把 `.js` 文件写入 [`src/`](https://github.com/home-assistant/frontend/tree/dev/src)。如果发生这种情况，请在提交前删除这些生成的文件。要快速获得单个文件的反馈，请使用编辑器中的诊断功能。

## 单元测试

单元测试使用 [Vitest](https://vitest.dev/) 运行。它们位于 [`test/`](https://github.com/home-assistant/frontend/tree/dev/test) 中，其文件夹结构与 [`src/`](https://github.com/home-assistant/frontend/tree/dev/src) 一一对应：

```shell
pnpm test
pnpm test:coverage
```

一个测试文件大致如下：

```ts
import { describe, expect, it } from "vitest";
import { ensureArray } from "../../../src/common/array/ensure-array";

describe("ensureArray", () => {
  it("wraps a single value in an array", () => {
    expect(ensureArray("light.kitchen")).toEqual(["light.kitchen"]);
  });
});
```

### 何时编写测试

对于会进行计算的代码，即错误可能悄无声息地溜过去的地方，应编写测试：数据处理、工具函数、配置校验以及仪表盘（dashboard）策略。

不要编写检查渲染效果的测试：比如组件的文本、样式或插槽，或者面板是否显示了它收到的数据。这类测试会随着每次设计改动而失效，却几乎保护不了什么。如果视觉效果发生了变化，请在你的 pull request 中附上截图。

测试永远不会与真实的 Home Assistant 通信。请用假实现替换 `callWS`、`callApi` 和连接。在编写新的 fixture 或辅助函数之前，先看看测试套件中已有的那些。

## 端到端测试

端到端测试使用 [Playwright](https://playwright.dev/) 运行，分为三个套件。每个套件都有自己的开发服务器：

| 套件 | 开发服务器 | 端口 | 测试命令 |
| --- | --- | --- | --- |
| App | `pnpm test:e2e:app:dev` | 8095 | `pnpm test:e2e:app` |
| Demo | `pnpm dev:demo` | 8090 | `pnpm test:e2e:demo` |
| Gallery | `pnpm dev:gallery` | 8100 | `pnpm test:e2e:gallery` |

App 套件针对一个为这些测试专门精简的测试环境来测试应用。Demo 和 Gallery 套件则使用它们正常的开发服务器。

在后台启动某个套件的开发服务器，然后运行该套件。Playwright 会复用已经在运行的服务器，而不是进行缓慢的完整构建，而且服务器会在你保存时重新构建，因此无需重启任何东西即可再次运行测试：

```shell
pnpm test:e2e:app:dev --background
pnpm test:e2e:app
```

可以用 `-g` 按测试名称缩小运行范围，用 `--project` 指定浏览器。可用的 project 为 `chromium` 和 `mobile-chrome`：

```shell
pnpm test:e2e:app -g "more-info" --project=chromium
```

`pnpm test:e2e` 会运行全部三个套件，`pnpm test:e2e:show-report` 会打开合并后的报告。

针对开发服务器的本地运行与 CI 使用的干净构建并不相同。请用它来快速迭代，同时也要确保你 pull request 上的端到端任务通过。

## 基准测试

图表背后的数据转换（如历史记录、统计和能源）都有基准测试。在优化其中某项之前，请先阅读 [`test/benchmarks/README.md`](https://github.com/home-assistant/frontend/blob/dev/test/benchmarks/README.md) 中的工作流程。优化必须保证输出完全一致：绝不要为了让测试通过而更新快照或 fixture。

## 何时运行什么

- **工具函数或数据变更**：相关的单元测试，然后运行 `pnpm lint:types`。
- **组件变更**：`pnpm lint`，以及覆盖其中逻辑的单元测试。
- **有端到端测试覆盖的流程变更**：相关的套件，并缩小到受影响的测试。
- **大范围重构**：`pnpm lint` 和 `pnpm test`。
