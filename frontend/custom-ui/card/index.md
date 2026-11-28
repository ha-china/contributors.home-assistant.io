# 自定义卡片

> 构建你自己的仪表盘卡片。包括元素、其配置、在分区视图和瀑布流视图中的尺寸，以及前端提供的辅助工具。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/card/

自定义卡片（custom card）是一个自定义元素，Home Assistant 会像内置卡片一样把它放在仪表盘上。它接收自己的配置和 Home Assistant 的状态，并渲染你想要的任何内容。

## 第一个卡片

在你的配置文件夹中创建 `www/state-card-example.js`：

```js
class StateCardExample extends HTMLElement {
  // Called with the YAML configuration of the card. Throw an
  // error and Home Assistant shows it instead of the card.
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this._config = config;
    this._render();
  }

  // Called with a new hass object on every change in the home.
  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._config || !this._hass) {
      return;
    }

    const stateObj = this._hass.states[this._config.entity];
    const state = stateObj
      ? this._hass.formatEntityState(stateObj)
      : "not found";

    if (!this._content) {
      this.innerHTML = `<ha-card><div class="content"></div></ha-card>`;
      this._content = this.querySelector(".content");
      this._content.style.padding = "16px";
    }
    this._content.textContent = `${this._config.entity} is ${state}`;
  }

  // Height in the masonry view, in units of 50 pixels.
  getCardSize() {
    return 1;
  }

  // Size in the grid of the sections view.
  getGridOptions() {
    return { columns: 6, rows: 1, min_rows: 1 };
  }
}

customElements.define("state-card-example", StateCardExample);
```

[将其注册为资源](https://www.hasscn.top/contributors/frontend/custom-ui/resources/)，URL 为 `/local/state-card-example.js`，类型为 **JavaScript module**。然后在 YAML 中把它添加到仪表盘：

```yaml
type: custom:state-card-example
entity: light.living_room
```

你注册的标签名 `state-card-example` 会成为类型 `custom:state-card-example`。

`ha-card` 是内置卡片用于背景、边框和阴影的元素。请使用它，这样你的卡片看起来与其他卡片一致，并遵循主题。与所有 `ha-*` 元素一样，它不是承诺的 API，请参阅[应使用哪些工具](https://www.hasscn.top/contributors/frontend/custom-ui/#which-tools-to-use)。

## 卡片 API

| 成员 | 必需 | 作用 |
| --- | --- | --- |
| `setConfig(config)` | 是 | 接收配置。调用频率低：在卡片创建时以及配置更改时调用。配置无效时抛出 `Error`。 |
| `hass` | | 每当 Home Assistant 的状态变化时，都会设置一个新的 `hass` 对象。这很频繁。只更新发生变化的部分。 |
| `getCardSize()` | | 卡片在瀑布流视图中的高度，可以是数字或数字的 Promise。1 代表 50 像素。默认为 1。 |
| `getGridOptions()` | | 卡片在分区视图中的尺寸。 |
| `preview` | | 当卡片显示在卡片编辑器中时，设置为 `true`。 |

`hass` 对象在 [hass 对象参考](https://www.hasscn.top/contributors/frontend/reference/hass-object/)中有描述。它的格式化工具，如 `hass.formatEntityState()` 和 `hass.formatEntityName()`，会把状态和名称转换为用户语言和单位的文本。请使用它们，而不是直接显示原始状态。

## 分区视图中的尺寸

分区（section）是一个 12 列的网格。行高为 56 像素，行间距为 8 像素。`getGridOptions()` 告诉网格你的卡片默认多大，以及用户可以把它调整到多大：

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `columns` | `12` | 列数，或 `"full"` 表示全宽。 |
| `rows` | `"auto"` | 行数。使用 `"auto"` 时，卡片与其内容一样高，且无法调整高度。 |
| `min_columns`, `max_columns` | | 宽度限制。 |
| `min_rows`, `max_rows` | | 高度限制。 |

如果没有 `getGridOptions()`，卡片会占据分区的全部宽度，其高度随内容而定。

`columns` 请使用 3 的倍数，例如 3、6、9 或 12。这样能与其他卡片对齐。`rows: 2` 的卡片高 120 像素：两行各 56 像素，加一个 8 像素的间距。

```js
getGridOptions() {
  return { columns: 6, rows: 2, min_rows: 2 };
}
```

## 瀑布流视图中的尺寸

瀑布流（masonry）视图将卡片排列在列中，并使用 `getCardSize()` 来均匀分布它们。当你向另一个元素询问其尺寸时，请等待它被定义，因为卡片是懒加载的：

```js
await customElements.whenDefined(element.localName);
return element.getCardSize();
```

## 只获取你需要的数据

`hass` 在家中的每次状态变化时都会更新，即使你的卡片显示的内容没有变化。卡片可以改为只请求部分数据，方法是请求一个[上下文（context）](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)。在卡片被添加到页面时触发 `context-request` 事件：

```js
connectedCallback() {
  const event = new CustomEvent("context-request", {
    bubbles: true,
    composed: true,
  });
  event.context = "states";
  event.subscribe = true;
  event.callback = (states, unsubscribe) => {
    this._unsubscribe = unsubscribe;
    this._states = states;
    this._render();
  };
  this.dispatchEvent(event);
}

disconnectedCallback() {
  this._unsubscribe?.();
  this._unsubscribe = undefined;
}
```

回调会收到上下文的值，并且设置了 `subscribe` 后，每次变化时都会再次调用。卡片被移除时务必取消订阅。上下文的键，如 `states`、`entities`、`hassApi` 和 `hassInternationalization`，定义在 [`src/data/context/index.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/context/index.ts) 中。

## 卡片辅助工具

前端为自定义卡片提供了一些辅助工具，例如在你的卡片内创建一个内置卡片：

```js
const helpers = await window.loadCardHelpers();
const card = helpers.createCardElement({
  type: "tile",
  entity: "light.living_room",
});
card.hass = this._hass;
```

`loadCardHelpers()` 在仪表盘面板加载后可用。它返回 `createCardElement`、`createBadgeElement`、`createRowElement`、`createHeaderFooterElement` 和 `createHuiElement`，对话框 `showAlertDialog`、`showConfirmationDialog`、`showPromptDialog` 和 `showEnterCodeDialog`，以及 `importMoreInfoControl`。以这种方式创建的卡片需要设置 `hass`，就像你自己的卡片一样。

## 后续步骤

- 添加可视化编辑器，并把你的卡片放入卡片选择器：[卡片编辑器和选择器](https://www.hasscn.top/contributors/frontend/custom-ui/card-editor/)。
- 为平铺卡片添加快捷控制：[自定义卡片功能](https://www.hasscn.top/contributors/frontend/custom-ui/card-feature/)。
