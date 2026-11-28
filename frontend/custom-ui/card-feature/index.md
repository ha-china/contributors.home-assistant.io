# 自定义卡片功能

> 为磁贴卡片及其他支持功能的卡片添加你自己的快捷控制。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/card-feature/

[卡片功能（card feature）](https://www.hasscn.top/contributors/glossary/card-feature/)是磁贴卡片底部的小型控件：亮度滑块、一排风扇速度、启动扫地机器人的按钮。内置功能覆盖了许多实体（entity），你也可以添加自己的功能。功能是一种自定义元素，与[自定义卡片](https://www.hasscn.top/contributors/frontend/custom-ui/card/)类似，但更小。

## 一个示例

以下功能为[按钮实体（button entity）](https://www.hasscn.top/contributors/core/entities/button/)添加一个 **Press** 按钮：

```js
const supportsButtonPress = (hass, context) => {
  const entityId = context.entity_id;
  return Boolean(entityId?.startsWith("button.") && hass.states[entityId]);
};

class ButtonPressCardFeature extends HTMLElement {
  setConfig(config) {
    if (!config) {
      throw new Error("Invalid configuration");
    }
    this._config = config;
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  set context(context) {
    this._context = context;
    this._render();
  }

  static getStubConfig() {
    return { type: "custom:button-press-card-feature", label: "Press" };
  }

  _render() {
    if (!this._config || !this._hass || !this._context) {
      return;
    }
    if (!supportsButtonPress(this._hass, this._context)) {
      // Forget the button, so it is created again when the entity is back
      this.replaceChildren();
      this._button = undefined;
      return;
    }
    if (!this._button) {
      this._button = document.createElement("button");
      this._button.style.cssText =
        "width: 100%; height: var(--feature-height, 42px);" +
        "border: none; border-radius: var(--feature-border-radius, 12px);";
      this._button.addEventListener("click", (ev) => this._press(ev));
      this.replaceChildren(this._button);
    }
    this._button.textContent = this._config.label || "Press";
  }

  _press(ev) {
    ev.stopPropagation();
    this._hass.callService("button", "press", {
      entity_id: this._context.entity_id,
    });
  }
}

customElements.define(
  "button-press-card-feature",
  ButtonPressCardFeature
);

window.customCardFeatures = window.customCardFeatures || [];
window.customCardFeatures.push({
  type: "button-press-card-feature",
  name: "Button press",
  isSupported: supportsButtonPress,
  configurable: true,
});
```

将该文件作为[资源（resource）](https://www.hasscn.top/contributors/frontend/custom-ui/resources/)加载，并将该功能添加到磁贴卡片中：

```yaml
type: tile
entity: button.restart_router
features:
  - type: custom:button-press-card-feature
    label: Restart
```

要像 `_press()` 那样阻止事件向上冒泡，否则下层的卡片也会处理该事件并打开更多信息对话框。

## 功能会接收到什么

- `setConfig(config)`：该功能的配置，包含其 `type`。
- `hass`：Home Assistant 的完整状态，每次变化时都会设置。
- `context`：功能所在的卡片所针对的对象。当卡片显示实体时，它包含 `entity_id`；当卡片显示区域（area）时，它包含 `area_id`。

## 注册功能

要让你的功能出现在卡片编辑器的功能选择器中，需向 `window.customCardFeatures` 推送一个条目：

| 键 | 必需 | 含义 |
| --- | --- | --- |
| `type` | 是 | 你的功能的标签名，不含 `custom:`。 |
| `name` | | 在选择器中显示的名称。 |
| `isSupported(hass, context)` | | 返回该功能是否适用于它将被放入的卡片。只有当此方法返回 `true` 时，选择器才会提供该功能。 |
| `configurable` | | 当该功能有可编辑的选项时，设置为 `true`。默认为 `false`。 |

务必定义 `isSupported`。否则，该功能会为每个实体提供，包括那些它对其毫无作用的实体。

功能可以拥有可视化编辑器，就像卡片一样：静态方法 `getConfigElement()` 和 `getConfigForm()` 的用法与[自定义卡片](https://www.hasscn.top/contributors/frontend/custom-ui/card-editor/)相同。`getStubConfig(hass, context)` 返回新功能的初始配置，包括其 `type`。

## 融入界面

功能所处的空间很紧凑。请使用与内置功能相同的变量，这样你的功能才能与它们对齐：

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `--feature-height` | `42px` | 控件的高度。 |
| `--feature-border-radius` | `12px` | 按钮和滑块的圆角。 |
| `--feature-button-spacing` | `12px` | 按钮之间的间距。 |
