# 自定义面板

> 在 Home Assistant 中添加一个属于你自己的整页内容，并在侧边栏中提供链接，可实时访问家庭状态。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/panel/

[面板（panel）](https://www.hasscn.top/contributors/glossary/panel/)是 Home Assistant 中的一个整页内容，例如仪表盘、地图或设置。自定义面板是你自己的页面：一个自定义元素，它接收与其他部分相同的 `hass` 对象，并填满侧边栏旁边的整个屏幕。集成（integration）使用它们来展示自己的界面，用户也可以通过 YAML 添加它们。

## 一个示例

在你的配置文件夹中创建 `www/example-panel.js`：

```js
class ExamplePanel extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  set narrow(narrow) {
    this._narrow = narrow;
    this._render();
  }

  set panel(panel) {
    this._panel = panel;
    this._render();
  }

  _render() {
    if (!this._hass || !this._panel) {
      return;
    }
    const count = Object.keys(this._hass.states).length;
    this.innerHTML = `
      <p>There are ${count} entities.</p>
      <p>The screen is ${this._narrow ? "" : "not "}narrow.</p>
      <pre>${JSON.stringify(this._panel.config, null, 2)}</pre>
    `;
  }
}

customElements.define("example-panel", ExamplePanel);
```

然后在 `configuration.yaml` 中注册该面板，并重启 Home Assistant：

```yaml
panel_custom:
  - name: example-panel
    url_path: example
    sidebar_title: Example panel
    sidebar_icon: mdi:server
    module_url: /local/example-panel.js
    config:
      hello: world
```

该面板将在 `/example` 打开，并在侧边栏中显示一个链接。

## 配置选项

| 选项 | 含义 |
| --- | --- |
| `name` | 你的元素的标签名称。必填。 |
| `url_path` | 面板的 URL。默认为 `name`。必须唯一。 |
| `sidebar_title` | 侧边栏中显示的文字。如果没有设置，面板将不会出现在侧边栏中。 |
| `sidebar_icon` | 侧边栏中的图标。默认为 `mdi:bookmark`。 |
| `module_url` | 你的 JavaScript 模块的 URL。设置此项、`js_url`，或两者都设置：如果都不设置，面板将不会被注册。 |
| `js_url` | 传统 JavaScript 文件的 URL。当两者都设置时，前端的旧版构建使用此项，现代构建使用 `module_url`。 |
| `config` | 你想传递给面板的任何内容。它会以 `panel.config` 的形式出现，旁边还有一个由 Home Assistant 添加的、包含面板设置的 `_panel_custom` 键。 |
| `require_admin` | 仅向管理员显示该面板。默认为 `false`。 |
| `embed_iframe` | 在 iframe 中渲染面板，使其与前端的其余部分隔离。默认为 `false`。 |
| `trust_external_script` | 未经询问就从其他主机加载脚本。默认为 `false`，此时会要求用户确认，因为该脚本将获得对 Home Assistant 的完全访问权限。 |
| `handle_safe_area` | 当你的面板自行处理手机屏幕的安全区域（如刘海）时，设置为 `true`。这样 Home Assistant 就不会在面板周围添加自己的内边距。默认为 `false`。 |

集成可以通过 `panel_custom` 集成中的 `async_register_panel()` 从 Python 注册自定义面板。它接受相同的选项，但其中几个选项的名称不同：`name` 对应 `webcomponent_name`，`url_path` 对应 `frontend_url_path`，`trust_external_script` 对应 `trust_external`。

## 面板会收到什么

Home Assistant 会在你的元素上设置以下属性：

| 属性 | 说明 |
| --- | --- |
| `hass` | Home Assistant 的完整状态。每次变化时都会重新设置。参见 [hass 对象参考](https://www.hasscn.top/contributors/frontend/reference/hass-object/)。 |
| `narrow` | 当面板应使用适合窄屏的布局时为 `true`。 |
| `route` | 当前路由：`prefix` 是面板的 URL，`path` 是 URL 的其余部分。用它来实现面板内部的页面。 |
| `panel` | 面板信息。`config` 选项位于 `panel.config` 中，与 `_panel_custom` 键在一起。 |

你的面板需要负责整个页面，包括页眉以及在窄屏上打开侧边栏的方式。

## 编写标准类

前端会在其现代构建和旧版构建中加载自定义面板。请使用标准 JavaScript 类来定义你的元素。不支持转译为 ES5 函数的元素。
