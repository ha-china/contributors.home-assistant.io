# 路由与面板

> URL 如何变成一个页面。Core 注册的面板、面板解析器，以及每个面板内部的路由器。

Source: https://www.hasscn.top/contributors/frontend/architecture/routing-and-panels/

Home Assistant 中的每个页面都是一个[面板（panel）](https://www.hasscn.top/contributors/glossary/panel/)：仪表盘、地图、日志簿、设置，或者由某个集成添加的面板。侧边栏列出这些面板，URL 的第一部分决定选择哪一个。

## 面板来自 Core

Core 决定存在哪些面板。集成通过 `frontend` 集成的 `async_register_built_in_panel()` 注册面板，该函数接受渲染面板的前端组件名称、URL 路径、侧边栏标题和图标，以及是否仅管理员可见：

```python
from homeassistant.components import frontend

frontend.async_register_built_in_panel(
    hass,
    component_name="logbook",
    sidebar_title="logbook",
    sidebar_icon="mdi:format-list-bulleted-type",
)
```

如果没有指定 `frontend_url_path`，URL 路径就是组件名称，因此该面板会在 `/logbook` 打开。内置面板的侧边栏标题是一个翻译键。

前端在启动时获取面板列表，它可以通过 `hass.panels` 或 `uiContext` 访问。

`component_name` 指的是前端内置的面板。要在不修改前端的情况下添加面板，集成和用户可以注册自定义面板。参见[自定义面板](https://www.hasscn.top/contributors/frontend/custom-ui/panel/)。

## 从 URL 到面板

前端中的路由是分散式的。每一层只知道自己负责的 URL 部分，并将其余部分向下传递。

1. [`src/layouts/partial-panel-resolver.ts`](https://github.com/home-assistant/frontend/blob/dev/src/layouts/partial-panel-resolver.ts) 查看 URL 的第一部分，找到为其注册的面板，并加载其组件的代码。组件名称到代码的映射位于该文件的顶部，因此添加内置面板意味着在那里添加它。
2. 面板会获得一个 `route` 属性：一个包含 `prefix`（已经处理过的 URL 部分）和 `path`（剩余部分）的对象。
3. 拥有自己页面的面板会将路由的剩余部分传递给它们，依此类推。

面板只有在有人打开它们时才会被加载。

## 面板内部的路由器

拥有多个页面的面板会继承 [`src/layouts/hass-router-page.ts`](https://github.com/home-assistant/frontend/blob/dev/src/layouts/hass-router-page.ts) 中的 `HassRouterPage`。它将 URL 的下一部分映射到一个元素，并在首次需要时加载该元素的代码：

```ts
@customElement("ha-panel-profile")
class HaPanelProfile extends HassRouterPage {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow = false;

  protected routerOptions: RouterOptions = {
    defaultPage: "dashboard",
    routes: {
      dashboard: {
        tag: "ha-profile-dashboard",
        load: () => import("./ha-profile-dashboard"),
      },
      security: {
        tag: "ha-profile-section-security",
        load: () => import("./ha-profile-section-security"),
      },
    },
  };

  protected updatePageEl(el) {
    el.route = this.routeTail;
    el.hass = this.hass;
    el.narrow = this.narrow;
  }
}
```

`updatePageEl()` 传递页面所需的数据，包括 `routeTail`，即留给页面的路由剩余部分。`RouterOptions` 还有更多选项，比如用于将页面保留在内存中的 `cacheAll`，以及用于重定向的 `beforeRender`。

## 导航

要跳转到另一个页面，请使用 [`src/common/navigate.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/navigate.ts) 中的 `navigate()`，切勿直接使用 `history.pushState`：

```ts
navigate("/config/areas/dashboard");
navigate("/config/areas/dashboard", { replace: true });
```

`navigate()` 会更新历史记录，通知应用位置已更改，并遵守未保存更改的守卫（guard）。
