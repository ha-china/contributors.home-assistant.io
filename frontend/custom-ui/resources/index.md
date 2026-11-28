# 注册资源

> 让你的 JavaScript 文件可供 Home Assistant 使用，并加载到每个仪表盘中。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/resources/

在仪表盘可以使用你的卡片（card）、徽章（badge）、功能（feature）、视图（view）或策略（strategy）之前，Home Assistant 必须先加载它的 JavaScript。这需要两个步骤：提供文件，然后将其注册为资源。

## 提供文件

在 Home Assistant 配置文件夹中、`configuration.yaml` 旁边，创建一个名为 `www` 的文件夹。其中的文件会通过 `/local/` 路径提供，因此 `www/my-card.js` 会变成 `/local/my-card.js`。

Home Assistant 只在启动时读取 `www` 文件夹。如果你刚刚创建了它，请重启一次 Home Assistant。

> [!WARNING]
> `www` 中的文件在提供时不需要身份验证。任何能访问你的 Home Assistant 的人都可以下载它们。不要把机密信息放在那里。

你也可以从任何其他 URL 加载资源，比如你的项目发布的文件。

## 注册资源

默认情况下，资源在 UI 中管理：

1. 前往 **设置** > **仪表盘**。
2. 在右上角菜单中，选择 **资源**。
3. 选择 **添加资源**，输入 URL，例如 `/local/my-card.js`，并选择 **JavaScript 模块**。

资源会为所有仪表盘加载。更改资源后，请在浏览器中重新加载页面。你的浏览器可能会缓存旧文件：在 URL 中添加版本号，例如 `/local/my-card.js?v=2`，可以强制获取新副本。

### 在 YAML 中

要改为在 YAML 中管理资源，请在 `configuration.yaml` 的 `lovelace` 部分将 `resource_mode` 设置为 `yaml`，并在那里列出它们：

```yaml
lovelace:
  resource_mode: yaml
  resources:
    - url: /local/my-card.js
      type: module
```

使用 `resource_mode: yaml` 后，UI 中的 **资源** 页面将不再管理它们。更改后，请运行 `lovelace.reload_resources` [动作](https://www.hasscn.top/contributors/glossary/action/)，或重启 Home Assistant，然后在浏览器中重新加载页面。

## 资源类型

| 类型 | 用途 |
| --- | --- |
| `module` | JavaScript 模块。所有新内容都使用此类型。 |
| `css` | 样式表。 |
| `js` | 经典 JavaScript 文件，不使用 `import` 和 `export`。已弃用。 |
| `html` | HTML 导入。已弃用，前端不再加载。 |

对于新资源，UI 只提供 `module` 和 `css`。只有当现有资源已经具有该类型时，才会显示 `js` 和 `html`。

在安全模式下，Home Assistant 不会加载任何资源，因此自定义卡片不会在那里显示。

## 注册选择器

某些注册只有在资源加载后才会生效：卡片选择器中的卡片、功能选择器中的功能，或新建仪表盘对话框中的仪表盘。如果你的没有显示，请检查资源是否已加载（在浏览器控制台中查找错误），然后重新加载页面并再次打开对话框。
