# 自定义徽章（badge）

> 为仪表盘视图顶部构建你自己的徽章。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/badge/

[徽章（badge）](https://www.hasscn.top/contributors/glossary/badge/)是视图顶部、卡片上方的小胶囊。它们可以一目了然地显示某个状态，比如室外温度或亮着的灯的数量。自定义徽章的构建方式与[自定义卡片（card）](https://www.hasscn.top/contributors/frontend/custom-ui/card/)相同，只是更小。

## 示例

```js
class TextBadge extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    if (!this._config || !this._hass) {
      return;
    }
    const stateObj = this._hass.states[this._config.entity];
    this.textContent = stateObj
      ? this._hass.formatEntityState(stateObj)
      : "Unavailable";
  }
}

customElements.define("text-badge", TextBadge);
```

将其作为[资源（resource）](https://www.hasscn.top/contributors/frontend/custom-ui/resources/)加载，并添加到视图中：

```yaml
views:
  - title: Home
    badges:
      - type: custom:text-badge
        entity: sensor.outside_temperature
```

## 徽章会获得什么

- `setConfig(config)`：徽章的配置。如果配置无效，请抛出错误，Home Assistant 将显示一个错误徽章。
- `hass`：Home Assistant 的完整状态，每次变化时都会更新。
- `preview`：当徽章显示在徽章编辑器中时为 `true`。

## 徽章选择器和编辑器

要在徽章选择器中显示你的徽章，请向 `window.customBadges` 推送一个条目：

```js
window.customBadges = window.customBadges || [];
window.customBadges.push({
  type: "text-badge",
  name: "Text badge",
  description: "Shows the state of an entity as text.",
  preview: true,
  documentationURL: "https://example.com/text-badge",
});
```

这些键与[卡片选择器中的卡片](https://www.hasscn.top/contributors/frontend/custom-ui/card-editor/#show-up-in-the-card-picker)相同，并且徽章还可以通过 `getEntitySuggestion` 为实体（entity）推荐自己。

徽章也可以拥有可视化编辑器和默认配置。静态方法 `getStubConfig()`、`getConfigForm()` 和 `getConfigElement()` 的工作方式与[自定义卡片](https://www.hasscn.top/contributors/frontend/custom-ui/card-editor/)完全相同。
