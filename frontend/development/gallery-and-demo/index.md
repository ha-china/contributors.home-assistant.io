# 画廊与演示

> 在没有 Home Assistant 的情况下运行真实前端的两种方式。画廊用于组件和卡片，演示用于整个应用。

Source: https://www.hasscn.top/contributors/frontend/development/gallery-and-demo/

并非每次修改都需要运行中的 Home Assistant。[前端仓库](https://github.com/home-assistant/frontend) 包含两个应用，它们使用假数据运行真实的前端代码：画廊（gallery）和演示（demo）。

## 画廊

画廊单独展示组件、仪表盘卡片和更多信息（more-info）视图，并覆盖所有重要的状态：开启、关闭、不可用、加载中、浅色与深色模式，以及从右到左布局。它是一个开发工具：在本地运行它，即可在没有 Home Assistant 的情况下构建和检查组件。

在本地 8100 端口运行：

```shell
pnpm dev:gallery
```

画廊位于 [`gallery/`](https://github.com/home-assistant/frontend/tree/dev/gallery) 文件夹中：

- `gallery/src/pages/<category>/<page>.markdown`：页面的描述，带有可选的 front matter，用于 `title` 和 `subtitle`。
- `gallery/src/pages/<category>/<page>.ts`：同一页面的实时演示。它定义了一个以页面命名的自定义元素，例如 `components/ha-button` 对应的 `demo-components-ha-button`。
- [`gallery/sidebar.js`](https://github.com/home-assistant/frontend/blob/dev/gallery/sidebar.js)：侧边栏的各个分区以及页面在其中的顺序。
- [`gallery/src/data/`](https://github.com/home-assistant/frontend/tree/dev/gallery/src/data) 和 [`gallery/src/components/`](https://github.com/home-assistant/frontend/tree/dev/gallery/src/components)：假的 `hass` 对象、示例状态，以及像 `demo-cards` 和 `demo-more-infos` 这样的辅助元素，用于渲染卡片配置或实体（entity）列表。

画廊页面使用来自 [`src/`](https://github.com/home-assistant/frontend/tree/dev/src) 的真实组件，而不是副本。当你的修改改变了某个已记录组件的行为时，请在同一个拉取请求（pull request）中更新它的画廊页面。维护者可以添加 `needs design preview` 标签，为你的拉取请求部署画廊预览。

> [!NOTE]
> 已发布的设计指南位于本网站的 [Design](https://www.hasscn.top/contributors/design/) 区域，而不是画廊中。它取代了 design.home-assistant.io。[组件](https://www.hasscn.top/contributors/design/components/)、[仪表盘卡片](https://www.hasscn.top/contributors/design/dashboards/) 和 [更多信息视图](https://www.hasscn.top/contributors/design/more-info/) 在那里各有一个页面，包含用法、规格、无障碍性和实时示例。当你的修改改变了组件的外观或行为时，也请通过向[本网站](https://github.com/home-assistant/contributors.home-assistant.io)提交拉取请求来更新其对应页面。

## 演示

演示是完整的 Home Assistant 前端，在浏览器中针对模拟的后端运行。它发布于 [demo.home-assistant.io](https://demo.home-assistant.io/)。这是在没有服务器的情况下加载完整应用的最简单方式，例如检查仪表盘或截取屏幕截图。

在本地 8090 端口运行：

```shell
pnpm dev:demo
```

演示有多个可选的主界面。使用 `demo` 查询参数选择一个，并用 `#` 之后的部分指定页面：

```text
http://localhost:8090/?demo=<slug>#/energy
```

这些 slug 位于 [`demo/src/configs/demo-configs.ts`](https://github.com/home-assistant/frontend/blob/dev/demo/src/configs/demo-configs.ts) 中。每个主界面在 [`demo/src/configs/`](https://github.com/home-assistant/frontend/tree/dev/demo/src/configs) 中都有自己的文件夹，包含其实体、仪表盘和主题。模拟的 WebSocket 和 REST API 位于 [`demo/src/stubs/`](https://github.com/home-assistant/frontend/tree/dev/demo/src/stubs) 中。

画廊也导入了其中一些 stub。当你修改某个 stub 时，请同时检查使用它的演示和画廊页面。

一些演示数据由 Core 生成：[`src/fake_data/demo_services.ts`](https://github.com/home-assistant/frontend/blob/dev/src/fake_data/demo_services.ts) 中的动作描述，以及 [`demo/src/stubs/`](https://github.com/home-assistant/frontend/tree/dev/demo/src/stubs) 中的触发器和条件描述。不要手动编辑它们。运行 `script/gen_demo_core_data` 可以从 Core 的 `dev` 分支重新生成它们。

## 在其他网站上嵌入卡片

演示还构建了 `embed.js`，它通过 `<ha-embed-provider>` 和 `<ha-embed-card>` 元素将仪表盘卡片放到任何网页上。卡片作者使用它来[实时演示他们的卡片](https://www.hasscn.top/contributors/frontend/custom-ui/demo/)。其代码位于 [`demo/src/embed/`](https://github.com/home-assistant/frontend/tree/dev/demo/src/embed)，而 [`demo/src/html/components.html.template`](https://github.com/home-assistant/frontend/blob/dev/demo/src/html/components.html.template) 是记录该功能的页面，位于演示的 `/components.html`。

提供者注册了自己的一组模拟数据。大多数来自 [`demo/src/stubs/`](https://github.com/home-assistant/frontend/tree/dev/demo/src/stubs) 中的 stub，少数（如能源）在 `ha-embed-provider.ts` 中定义。对某个 stub 的修复会影响到导入该 stub 的演示、嵌入和画廊页面，而它们并不都导入相同的 stub。例如，日历 stub 被嵌入和画廊使用，但演示不使用。对于新的 stub，请在 `ha-embed-provider.ts` 中导入它，并在构造函数中调用它。

脚本的生产构建会从其来源网站加载其他文件，因此它也能在其他网站上运行。开发和旧版构建则改为从页面所在网站加载这些文件，因此请尝试使用生产构建来测试需要在其他网站上运行的更改。

## 画廊和演示中的翻译

两者默认以英文启动。添加 `--fetch-translations` 可以加载最新翻译，例如 `pnpm dev:demo --fetch-translations`。两者也接受[后台运行标志](https://www.hasscn.top/contributors/frontend/development/run/#keep-a-server-running-in-the-background)。
