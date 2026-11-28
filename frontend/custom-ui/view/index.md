# 自定义视图

> 编写自己的视图布局，以内置视图无法实现的方式排列仪表盘视图中的卡片。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/view/

[视图](https://www.hasscn.top/contributors/glossary/view/)决定其卡片的排列方式。内置的视图类型包括 sections、masonry、sidebar 和 panel。自定义视图类型让你可以编写自己的布局，例如自由画布或固定网格。

Home Assistant 仍会创建卡片和徽章（badge），并保持它们处于最新状态。你的视图只负责放置它们。

> [!NOTE]
> 想通过代码生成视图中的卡片？那是[视图策略（view strategy）](https://www.hasscn.top/contributors/frontend/custom-ui/strategy/#a-view-strategy)，而不是自定义视图。

## 一个示例

```js
class MyNewView extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  set cards(cards) {
    this._cards = cards;
    this._render();
  }

  _render() {
    this.style.display = "grid";
    this.style.gridTemplateColumns = "repeat(auto-fill, minmax(300px, 1fr))";
    this.style.gap = "8px";
    this.replaceChildren(...this._cards);
  }
}

customElements.define("my-new-view", MyNewView);
```

将其作为[资源（resource）](https://www.hasscn.top/contributors/frontend/custom-ui/resources/)加载，并将其设置为某个视图的类型：

```yaml
views:
  - title: Home
    type: custom:my-new-view
    cards:
      - type: tile
        entity: light.living_room
```

## 视图会获得什么

| 属性 | 说明 |
| --- | --- |
| `setConfig(config)` | 视图的配置。 |
| `hass` | Home Assistant 的完整状态。 |
| `lovelace` | 仪表盘：其配置、是否处于编辑模式，以及保存配置的函数。 |
| `narrow` | 在窄屏上为 `true`。 |
| `path` | 视图在仪表盘配置中的位置，例如 `["views", 0]`。 |
| `cards` | 卡片元素，已准备好放置。 |
| `badges` | 徽章元素。 |

[masonry 视图](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/views/hui-masonry-view.ts)是内置的视图元素示例。

## 为每张卡片存储布局数据

如果你的视图需要记住每张卡片的某些信息，例如位置或大小，可以将其存储在卡片的 `view_layout` 选项中。Home Assistant 会将其与卡片配置一起保存，其他情况下会忽略它：

```yaml
- type: tile
  entity: light.living_room
  view_layout:
    column: 2
    row: 1
```

## 编辑、删除和添加卡片

在编辑模式下，你的视图可以通过触发事件来打开仪表盘编辑器的对话框。每个事件都带有卡片在仪表盘配置中的 `path`：即你视图的 `path`，后跟 `"cards"` 和卡片的索引。

| 事件 | Detail | 作用 |
| --- | --- | --- |
| `ll-create-card` | `{ path: [...path, "cards"] }` | 卡片选择器，用于向视图添加卡片。 |
| `ll-edit-card` | `{ path: [...path, "cards", index] }` | 卡片的编辑器。 |
| `ll-delete-card` | `{ path: [...path, "cards", index], silent: false }` | 删除卡片。设置 `silent: false` 后，随后会显示一条带有撤销按钮的消息。 |

触发事件时，要让它们能够冒泡并穿越 shadow root：

```js
this.dispatchEvent(
  new CustomEvent("ll-edit-card", {
    detail: { path: [...this.path, "cards", 3] },
    bubbles: true,
    composed: true,
  })
);
```

较旧的视图只发送由数字组成的路径，例如第一个视图的第四张卡片为 `[0, 3]`。目前这种方式仍然有效。
