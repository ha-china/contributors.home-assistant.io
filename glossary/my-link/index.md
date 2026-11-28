# My 链接

> 指向 my.home-assistant.io 的链接，可在读者自己的 Home Assistant 中打开相应页面，例如其集成页面或新建自动化。

Source: https://www.hasscn.top/contributors/glossary/my-link/

- In code: `my.home-assistant.io`
- Also: My Home Assistant, My links

文档和集成使用 My 链接（My link）将读者直接带到正确的位置，无论其 Home Assistant 运行在哪里。

My 链接的形式为 `https://my.home-assistant.io/redirect/<name>/`。有些链接带有参数，例如 `https://my.home-assistant.io/redirect/config_flow_start/?domain=hue`，它会开始设置 Hue 集成（integration）。每个链接还有一个徽章图片，位于 `https://my.home-assistant.io/badges/<name>.svg`，可用于 README 或论坛帖子中的按钮。有些名称仍使用旧名称，例如 `supervisor_add_addon_repository`，它会打开添加应用仓库的对话框。

[My 链接生成器](https://my.home-assistant.io/create-link/)列出了所有链接，并为你生成链接和徽章。贡献者在以下地方使用它们：

- [home-assistant.io 上的 `{% my %}` 标签](https://www.hasscn.top/contributors/writing/reference/liquid/#my-links)
- [用于添加应用仓库的徽章](https://www.hasscn.top/contributors/apps/guides/repository/#make-it-one-step)
- [指向 Marketplace 中仓库的链接](https://www.hasscn.top/contributors/marketplace/guides/catalog/#the-link-to-your-repository)
- [用于设置自定义集成的徽章](https://www.hasscn.top/contributors/marketplace/guides/integrations/#link-to-the-setup)
- [蓝图（blueprint）导入徽章](https://www.hasscn.top/contributors/marketplace/guides/blueprints/#share-it)

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/): 在用户界面中设置集成并创建配置条目的步骤。
- [蓝图（Blueprint）](https://www.hasscn.top/contributors/glossary/blueprint/): 一种自动化、脚本或模板实体，其中留有需要填写的空白，方便他人复用，例如一个运动感应灯，只需填入运动传感器和灯具即可。
- [应用（App）](https://www.hasscn.top/contributors/glossary/app/): 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。
- [Marketplace（市场）](https://www.hasscn.top/contributors/glossary/marketplace/): Home Assistant 中用户查找并安装社区自制自定义集成、仪表盘卡片、主题和模板宏的地方。自 2026.11 起内置。
