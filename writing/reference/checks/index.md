# 自动化文档检查

> 文档拉取请求上的自动化检查会检查什么，如何自己运行这些检查，以及如何修改它们。

Source: https://www.hasscn.top/contributors/writing/reference/checks/

每个提交到 [home-assistant.io 仓库](https://github.com/home-assistant/home-assistant.io) 的拉取请求都会运行一组自动化检查。它们能发现一些小问题，比如没有指定语言的代码块或拼写错误的产品名称，这样审阅者就可以专注于内容本身。

这些检查在 [`test.yml`](https://github.com/home-assistant/home-assistant.io/blob/current/.github/workflows/test.yml) GitHub Actions 工作流中运行。其中两项与你的写作有关：

- **Lint Markdown** 使用 [remark](https://remark.js.org/) 检查你的 Markdown 的结构和格式。
- **Lint Text** 使用 [textlint](https://textlint.github.io/) 检查拼写、术语和措辞。

Markdown 任务还会检查 [`source/_integrations/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_integrations) 中的集成页面是否使用 `.markdown` 文件扩展名。该目录下的 `.md` 文件会导致检查失败。

第三个任务 **Build Astro site** 会构建 `astro` 文件夹中的网站部分。它不会检查你的写作，但也必须通过。

## 在本地运行检查

你需要 [Node.js](https://nodejs.org/)。CI 中的 lint 任务使用版本 20。仓库的 `.nvmrc` 文件和 devcontainer 使用版本 26。

1. 在你克隆的仓库中，安装依赖项：

   ```shell
   npm install
   ```

2. 运行 Markdown 检查：

   ```shell
   npm run markdown:lint
   ```

3. 运行文本检查：

   ```shell
   npm run textlint
   ```

这些命令与 CI 运行的命令相同。它们定义在 [`package.json`](https://github.com/home-assistant/home-assistant.io/blob/current/package.json) 中。

要在工作时检查单个页面，可以直接对该文件运行这些工具：

```shell
npx remark --quiet --frail source/_integrations/my_integration.markdown
npx textlint source/_integrations/my_integration.markdown
```

> [!TIP]
> 仓库推荐使用 Visual Studio Code 的 textlint 和 markdownlint 扩展。安装这些扩展后，你可以在输入时就在编辑器中看到大部分问题。

## Markdown 检查

`markdown:lint` 脚本会在整个仓库上运行 `remark --quiet --frail .`。`--frail` 标志会将警告转换为失败，因此每个发现的问题都会阻塞检查。

这些规则位于 [`.remarkrc.js`](https://github.com/home-assistant/home-assistant.io/blob/current/.remarkrc.js) 中。它们检查：

- **代码块**：每个围栏代码块都要指定其语言。Shell 示例的每一行不应以 `$` 开头，因为这会破坏复制粘贴。当你需要将命令与其输出区分开时，使用 `$` 是可以的。
- **标题**：标题使用 `#` 样式，并且一次只能下降一级。不允许从 `##` 直接跳到 `####`。
- **列表**：无序列表使用 `-`。有序列表在数字后使用句点，如 `1.`，并且编号方式要一致。递增编号 `1.`、`2.`、`3.` 是约定俗成的做法。
- **名称拼写**：一份禁止字符串列表，比如用 `Github` 代替 `GitHub`、用 `websocket` 或 `Websocket` 代替 `WebSocket`、用 `Speech-To-Text` 代替 `Speech-to-text`。
- **指向本站的链接**：完整的 `https://www.home-assistant.io/` 链接应使用相对路径，如 `/integrations/hue/`。

某些文件会被有意跳过，比如博客文章和更新日志。它们列在 [`.remarkignore`](https://github.com/home-assistant/home-assistant.io/blob/current/.remarkignore) 中。

### 添加 remark 规则

1. 安装该规则的软件包，这会更新 `package.json` 和 `package-lock.json`：

   ```shell
   npm install --save-dev remark-lint-some-rule
   ```

2. 在 `.remarkrc.js` 中启用并配置该规则。
3. 运行 `npm run markdown:lint`。
4. 修复现有的违规项，或者在 `.remarkignore` 中添加有正当理由的排除项。

## 文本检查

`textlint` 脚本会检查以下文件夹：

- `source/_docs`
- `source/_faq`
- `source/_integrations`
- `source/_dashboards`
- `source/cloud`
- `source/getting-started`
- `source/hassio`
- `source/dashboards`

其他文件夹（如博客）不会被 CI 检查。要检查 `source` 下的所有内容，请运行 `npm run textlint:all`。

这些规则位于 [`.textlintrc.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.textlintrc.json) 中：

- `common-misspellings` 捕捉常见的拼写错误。
- `terminology` 强制执行产品名称、首选术语和措辞。它会跳过引用块中的文本。
- `comments` 过滤器允许你为页面的某一部分关闭 textlint。
- `allowlist` 过滤器会忽略那些原本会产生误报的文本，比如 `mqtt:` 或 `homeassistant:` 这样的 YAML 键。

### 添加术语条目

术语位于 `.textlintrc.json` 中 `terminology` 规则的 `terms` 列表里。条目有两种形式之一。

普通字符串是一个必须保持完全相同拼写和大小写的术语：

```json
"Home Assistant",
"Z-Wave",
"GitHub"
```

一个键值对标记一种拼写并建议另一种拼写。第一个值是要匹配的模式，第二个值是向贡献者显示的建议：

```json
["addon", "add-on"],
["colour", "color"],
["repo\\b", "repository"]
```

该模式是 JSON 字符串中的正则表达式。请转义在其中任何一方具有特殊含义的字符，比如上面 `\\b` 中的反斜杠。

将新条目放在相关条目的附近。然后运行 `npm run textlint` 来查看这一更改会捕捉到什么。

### 为页面的某一部分禁用 textlint

有时 textlint 会标记一些实际上是正确的内容。在这种情况下，请将该文本包裹在 HTML 注释中：

```html
<!-- textlint-disable -->

Text that textlint should skip.

<!-- textlint-enable -->
```

要只关闭某一条规则，请添加其名称：

```html
<!-- textlint-disable terminology -->

Text that the terminology rule should skip.

<!-- textlint-enable terminology -->
```

一些准则：

- 让被禁用的部分尽可能小。
- 在每条注释前后各放一个空行，除非这会破坏周围的 Markdown。
- 不要将这些注释放在[文本框](https://www.hasscn.top/contributors/writing/reference/liquid/#text-boxes)内。

### 添加 textlint 规则

1. 将该规则的软件包添加到 `package.json`，并更新 `package-lock.json`。
2. 在 `.textlintrc.json` 中启用并配置该规则。
3. 运行 `npm run textlint`。
4. 修复现有的违规项，或者在 `.textlintrc.json` 的 `allowlist` 中添加范围狭窄的排除项。

## Markdownlint

仓库中还有一个 [`.markdownlint.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.markdownlint.json) 文件。它为编辑器配置 [markdownlint](https://github.com/DavidAnson/markdownlint)：

- 页面的第一个标题为 2 级（`MD002`），因为标题来自 front matter。
- 没有行长度限制（`MD013`），因此你可以书写流畅的文本。
- 允许存在文本相同的标题，只要它们不是同一父级下的同级标题（`MD024`）。
- 允许内联 HTML（`MD033`）。

markdownlint 扩展位于 [`.vscode/extensions.json`](https://github.com/home-assistant/home-assistant.io/blob/current/.vscode/extensions.json) 推荐的扩展列表中，因此你可能会在 Visual Studio Code 中看到它的警告。

> [!NOTE]
> Markdownlint 不会在 CI 中运行，也没有对应的 `package.json` 脚本。它的警告只是提示，而不是阻塞项。如果必须在拉取请求上强制执行某条 markdownlint 规则，它还需要一个脚本以及工作流中的一个步骤。
