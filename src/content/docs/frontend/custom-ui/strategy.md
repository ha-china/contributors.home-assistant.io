---
title: Custom strategies
description: Generate a whole dashboard, a view, or a section from code, and offer it in the dashboard editor.
order: 6
---

[策略（strategy）](/glossary/strategy/)是一段用于生成仪表盘配置的代码。仪表盘不再是一列卡片，而是声明“使用这个策略”，策略会在每次仪表盘加载时根据家中的内容生成卡片。Home Assistant 为你构建的**概览**仪表盘、区域仪表盘、地图和能源仪表盘都是策略。

共有三种类型：

- **仪表盘策略（dashboard strategy）**生成整个仪表盘及其所有视图。
- **视图策略（view strategy）**生成一个视图。
- **分区策略（section strategy）**在分区视图中生成一个分区。

它们协同工作。仪表盘策略通常会生成一个视图列表，每个视图都使用一个视图策略，这样每个视图只有在有人打开时才会被构建。

## How a strategy works

A strategy is a custom element with a static `generate()` method. It gets the strategy configuration and `hass`, and returns the configuration of what it generates: a dashboard, a view, or a section.

The tag name decides the kind: `ll-strategy-dashboard-<name>`, `ll-strategy-view-<name>`, or `ll-strategy-section-<name>`. The `<name>` is what follows `custom:` in the configuration. Everything in the `strategy` section, including your own options, is passed to `generate()` as `config`.

Load your strategy as a [resource](/frontend/custom-ui/resources/), like a custom card.

The [built-in strategies](https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace/strategies) are good examples. The [map dashboard strategy](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/strategies/map/map-dashboard-strategy.ts) is a small one.

## A dashboard strategy

A dashboard strategy returns a whole dashboard configuration:

```js
class MyDemoDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    const name = hass.config.location_name || "Home Assistant";

    return {
      title: config.title || "My demo dashboard",
      views: [
        {
          title: "Home",
          path: "home",
          cards: [
            { type: "markdown", content: `# Welcome to ${name}` },
            { type: "entities", entities: ["sun.sun"] },
          ],
        },
      ],
    };
  }
}

customElements.define(
  "ll-strategy-dashboard-my-demo",
  MyDemoDashboardStrategy
);
```

Use it as the configuration of a dashboard:

```yaml
strategy:
  type: custom:my-demo
  title: Generated dashboard
```

[Register it](#register-your-strategy) with `strategyType: "dashboard"`, and users can pick it under **Community dashboards** in the dialog to add a dashboard.

### Suggest a title and icon

A dashboard strategy can suggest the title and icon of the new dashboard with a static `getCreateSuggestions(hass)`. Users can still change both before they create it.

```js
static getCreateSuggestions(hass) {
  return { title: "My demo dashboard", icon: "mdi:view-dashboard" };
}
```

## 视图策略

视图策略返回一个视图的配置。可以在任何仪表盘的视图中使用它：

```yaml
views:
  - strategy:
      type: custom:my-area
      area: living_room
```

下面的视图策略显示一个区域（area）的实体（entity）。它上面的仪表盘策略为每个区域创建一个使用该视图策略的视图。`hass.areas`、`hass.devices` 和 `hass.entities` 中保存着注册表，因此两者都不需要获取任何数据。

```js
class MyAreaDashboardStrategy extends HTMLElement {
  static async generate(config, hass) {
    return {
      title: config.title || "Areas",
      views: Object.values(hass.areas).map((area) => ({
        title: area.name,
        path: area.area_id,
        strategy: { type: "custom:my-area", area: area.area_id },
      })),
    };
  }
}

class MyAreaViewStrategy extends HTMLElement {
  static async generate(config, hass) {
    const areaId = config.area;
    const areaDevices = new Set(
      Object.values(hass.devices)
        .filter((device) => device.area_id === areaId)
        .map((device) => device.id)
    );

    const cards = Object.values(hass.entities)
      .filter(
        (entity) =>
          entity.area_id === areaId ||
          (!entity.area_id && areaDevices.has(entity.device_id))
      )
      .map((entity) => ({ type: "tile", entity: entity.entity_id }));

    return { cards: [{ type: "grid", cards }] };
  }
}

customElements.define(
  "ll-strategy-dashboard-my-area",
  MyAreaDashboardStrategy
);
customElements.define("ll-strategy-view-my-area", MyAreaViewStrategy);
```

两者都使用名称 `my-area`：一个作为仪表盘策略，一个作为视图策略。这是允许的，因为类型是标签名的一部分。

## A section strategy

A section strategy returns the configuration of one section, with its cards. Use it in a sections view, next to regular sections:

```yaml
views:
  - type: sections
    sections:
      - strategy:
          type: custom:my-domain
          domain: light
```

The section strategy below shows a tile for every registered entity of one domain, like all the lights:

```js
class MyDomainSectionStrategy extends HTMLElement {
  static async generate(config, hass) {
    const cards = Object.keys(hass.entities)
      .filter((entityId) => entityId.startsWith(`${config.domain}.`))
      .map((entityId) => ({ type: "tile", entity: entityId }));

    return { type: "grid", cards };
  }
}

customElements.define(
  "ll-strategy-section-my-domain",
  MyDomainSectionStrategy
);
```

[Register it](#register-your-strategy) with `strategyType: "section"`, and users can pick it under **Community sections** when they create a section and choose **Automatic section**. After they pick it, the section editor opens with your [settings](#settings).

### Show a preview

The dialog shows each section strategy as a tile with a live preview. To get one, add a static `getStubConfig(hass)` that returns a strategy configuration with good defaults. It can be async. The dialog passes it to `generate()` to render the preview, and the new section starts with it.

```js
static getStubConfig(hass) {
  return { type: "custom:my-domain", domain: "light" };
}
```

Include `custom:` in the `type`, like in the configuration. Without `getStubConfig()`, or when it throws, the tile shows no preview. Pick defaults that show something in most homes.

## Register your strategy

Register your strategy in `window.customStrategies`, and users can pick it in the dashboard editor without writing any YAML:

```js
window.customStrategies = window.customStrategies || [];
window.customStrategies.push({
  type: "my-demo",
  strategyType: "dashboard",
  name: "My demo dashboard",
  description: "A starter dashboard generated from JavaScript.",
  documentationURL: "https://example.com/my-demo-dashboard",
});
```

| Key | Required | Meaning |
| --- | --- | --- |
| `type` | Yes | The name of the strategy, without `custom:`. |
| `strategyType` | Yes | `"dashboard"` or `"section"`. |
| `name` | | The name in the dialog. |
| `description` | | A short description below the name. |
| `documentationURL` | | A link to your documentation. The frontend does not show it anywhere yet. |

View strategies can't be picked in the editor yet, so there is no need to register them.

The resource has to be loaded for the dialog to see it. After adding or updating it, reload the page and open the dialog again.

## When to generate again

策略在仪表盘加载时运行。默认情况下，当实体、设备、区域或楼层注册表发生变化时，它会再次运行，因此新设备无需重新加载页面即可显示。状态（state）变化不会触发它。

要改变这一行为，可以添加一个静态的 `registryDependencies`，列出你的策略所依赖的注册表：可以是 `entities`、`devices`、`areas`、`floors`、`labels` 和 `panels` 中的任意组合。对于永远不需要再次运行的策略，使用空列表。若要完全控制，可以添加一个静态的 `shouldRegenerate(config, oldHass, newHass)`，当策略应该再次运行时返回 `true`。

```js
class MyDemoDashboardStrategy extends HTMLElement {
  static registryDependencies = ["areas"];

  static async generate(config, hass) {
    // ...
  }
}
```

## Settings

策略可以为其选项提供一个可视化编辑器。从静态的 `getConfigElement()` 返回一个编辑器元素。它的工作方式类似于[卡片编辑器](/frontend/custom-ui/card-editor/#a-visual-editor-of-your-own)：Home Assistant 会使用策略配置调用 `setConfig()` 并设置 `hass`，编辑器则通过 `config-changed` 事件发出新的配置。

Give every section strategy an editor: it is the first thing users see after they pick your section in the dialog. Without one, they only get a YAML editor.

```js
class MyDomainSectionStrategy extends HTMLElement {
  static getConfigElement() {
    return document.createElement("my-domain-strategy-editor");
  }

  static async generate(config, hass) {
    // ...
  }
}
```

A dashboard strategy has two more static options:

- `configRequired = true`: the strategy can't work without settings. Home Assistant shows the editor before it creates the dashboard.
- `noEditor = true`: the strategy has no settings to edit.

## Tips

- 保持 `generate()` 的速度。它在每次加载时都会运行，仪表盘会等待它完成。
- `hass` 中已经以简短形式包含了区域、设备和实体。对于它没有的数据，例如完整的实体注册表条目，请使用 `hass.callWS()`。在仪表盘策略中只调用一次，并通过配置将结果传递给你的视图策略。
- 策略可以使用任何卡片，包括你自己的自定义卡片。
- 为策略编写测试。它们是从数据到配置的纯函数，因此很容易测试。
