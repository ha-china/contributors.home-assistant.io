# 编写集成文档

> 面向为 Home Assistant 添加新集成的开发者。文档需要包含哪些内容，以及如何让文档与代码一起合并。

Source: https://www.hasscn.top/contributors/writing/guides/integration/

Home Assistant 中的每个集成（integration）在 [home-assistant.io](https://www.home-assistant.io/) 上都有一个页面。当你添加一个集成时，它的页面也是工作的一部分。用户通过该页面找到集成，集成概览也是由它生成的。

## 开始之前

- 目标分支为 `next`。你的集成尚未发布，因此其页面也尚未发布。
- 每个核心拉取请求对应一个文档拉取请求，并在另一个请求中列出每个请求，标注为 **This PR belongs together with**。
- 将集成的图标和徽标添加到 [brands 仓库](https://github.com/home-assistant/brands)，并以相同方式将该拉取请求与核心拉取请求配对。

## 创建页面

1. 将[集成页面模板](https://github.com/home-assistant/home-assistant.io/blob/current/source/_integrations/_integration_docs_template.markdown)复制到 [`source/_integrations/`](https://github.com/home-assistant/home-assistant.io/tree/current/source/_integrations)。
2. 以集成的域名（domain）命名文件，并使用 `.markdown` 扩展名，例如 `my_device.markdown`。
3. 填写 front matter。它驱动集成概览、质量等级徽章等。每个键都在[集成 front matter](https://www.hasscn.top/contributors/writing/reference/front-matter/) 中有说明。
4. 按照模板的结构编写页面。[集成页面结构](https://www.hasscn.top/contributors/writing/reference/integration-page/)解释了每个部分的用途。
5. 将该集成及其集成负责人添加到文档仓库的 `CODEOWNERS` 文件中。如果你拥有该集成，你也就拥有它的文档：你会被要求审阅对该页面的更改，并且在读者留下反馈时会收到通知。
6. 在将拉取请求标记为可以审阅之前，请删除模板中的注释。

## 优秀的集成页面应涵盖的内容

模板会引导你完成各个部分。审阅者会关注以下几点：

- **集成的作用**，以及用户可以用它做什么，写在开头几行。
- **支持的设备**，以及已知无法工作的设备。在重要的情况下，请提及你测试时所用的固件版本。
- **如何获取凭据**，例如 API 密钥或访问令牌，逐步说明。
- 步骤或示例中**不使用自定义集成或自定义卡片**。一切都应能通过 Home Assistant 自带的功能实现。
- **已知的限制和故障排除**，让用户不必通过踩坑才发现。

## 当功能被移除时

在功能被弃用（deprecated）时就应立即移除其文档，而不是等到它被删除时：从集成页面中删除其对应的部分，并且不要添加弃用通知。当整个集成被弃用或删除时，请参阅[移动、重命名或删除页面](https://www.hasscn.top/contributors/writing/guides/move-or-remove/)。
