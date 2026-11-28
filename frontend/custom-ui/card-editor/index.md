# 卡片编辑器与卡片选择器

> 为你的自定义卡片提供可视化编辑器、合理的默认配置，并在卡片选择器及其建议中占有一席之地。

Source: https://www.hasscn.top/contributors/frontend/custom-ui/card-editor/

人们期望无需编写 YAML 就能添加和设置卡片。你的自定义卡片也可以参与其中：它可以出现在卡片选择器中、以一个可用的配置起步，并拥有可视化编辑器。

## 出现在卡片选择器中

在你的模块中向 `window.customCards` 添加一个条目：

```js
window.customCards = window.customCards || [];
window.customCards.push({
  type: "state-card-example",
  name: "State card",
  description: "Shows the state of one entity.",
  preview: true,
  documentationURL: "https://example.com/state-card",
});
```

| 键 | 必需 | 含义 |
| --- | --- | --- |
| `type` | 是 | 你的卡片的标签名，不带 `custom:`。 |
| `name` | | 在选择器中显示的名称。 |
| `description` | | 名称下方的一段简短描述。 |
| `preview` | | 在选择器中显示卡片的实时预览。默认为 `false`。 |
| `documentationURL` | | 在卡片编辑器中添加一个帮助链接。 |
| `getEntitySuggestion` | | 为某个实体（entity）建议你的卡片。见下文。 |

你的卡片会出现在选择器中一个专门展示社区卡片的区域。

## 默认配置

当有人选择了你的卡片时，Home Assistant 会向静态方法 `getStubConfig()` 请求一个起始配置。返回时不带 `type`：

```js
static getStubConfig(hass, entities, entitiesFallback) {
  const light = entities.find((id) => id.startsWith("light."));
  return { entity: light ?? "sun.sun" };
}
```

`entities` 包含尚未添加到仪表盘（dashboard）的实体，`entitiesFallback` 则包含已添加的实体。两者都会排除不可用或未知的实体，因此任一列表都可能为空：请保留一个后备选项，例如示例中的 `sun.sun`。如果没有 `getStubConfig()`，卡片将仅以其类型启动。

## 为实体建议你的卡片

当有人在卡片选择器中选择一个实体时，Home Assistant 会为该实体建议一些卡片。你的卡片可以加入这些建议，在内置卡片下方的一个社区卡片区域中展示，方法是在其 `window.customCards` 条目上提供 `getEntitySuggestion`：

```js
getEntitySuggestion: (hass, entityId) => {
  if (!entityId.startsWith("light.")) {
    return null;
  }
  return {
    config: { type: "custom:state-card-example", entity: entityId },
  };
},
```

当你的卡片不适合该实体时返回 `null`，否则返回一条建议，或针对多个变体返回一个建议列表。一条建议包含：

- `config`（必需）：卡片的配置，包括带 `custom:` 的类型。
- `label`：该变体的简短名称，显示在卡片名称之后。仅在返回多条建议时才设置它。

只在有意义的地方建议你的卡片。请检查实体的域名（domain）、设备类（device class）或支持的功能特性。为每个实体都建议的卡片会让选择器对所有人来说都很嘈杂。

## 基于表单的可视化编辑器

对于大多数卡片，一个表单就足够了。从静态方法 `getConfigForm()` 返回一个 schema，Home Assistant 就会使用与内置卡片相同的控件来渲染表单：

```js
static getConfigForm() {
  return {
    schema: [
      { name: "entity", required: true, selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "name",
            selector: { entity_name: {} },
            context: { entity: "entity" },
          },
          {
            name: "icon",
            selector: { icon: {} },
            context: { icon_entity: "entity" },
          },
        ],
      },
      { name: "theme", selector: { theme: {} } },
    ],
    computeLabel: (schema) =>
      schema.name === "icon" ? "Special icon" : undefined,
    computeHelper: (schema) =>
      schema.name === "entity" ? "The entity to show" : undefined,
    assertConfig: (config) => {
      if (config.other_option) {
        throw new Error("'other_option' is not supported.");
      }
    },
  };
}
```

| 键 | 必需 | 含义 |
| --- | --- | --- |
| `schema` | 是 | 表单的字段。 |
| `computeLabel(schema, localize)` | | 返回字段的标签。返回 `undefined` 则使用默认值：Home Assistant 知道诸如 `entity` 等常见名称的标签。 |
| `computeHelper(schema, localize)` | | 返回一段较长的帮助文本，显示在字段下方。 |
| `assertConfig(config)` | | 在每次更改时调用。抛出错误即可关闭可视化编辑器，例如当有人编写了表单无法显示的 YAML 时。一旦错误消失，可视化编辑器会重新可用。 |

### Schema 字段

一个字段有一个 `name`（即配置中的键），并且通常有一个 `selector`（选择器）。[选择器（selector）](https://www.hasscn.top/contributors/glossary/selector/)与蓝图（blueprint）和自动化（automation）编辑器使用的相同，例如 `entity`、`number`、`boolean`、`select`、`icon` 和 `theme`。[选择器文档](https://www.home-assistant.io/docs/blueprint/selectors/)列出了所有选择器。字段的其他选项：

- `required`：该字段必须有一个值。
- `default`：字段留空时使用的值。
- `context`：将该字段链接到另一个字段。在示例中，图标选择器会显示在 `entity` 字段中所选实体的图标。
- `visible`：仅在满足某个条件时才显示该字段，例如 `{ field: "mode", value: "advanced" }`。

字段可以分组：

- `type: "grid"` 将其 `schema` 并排排列。可以设置 `column_min_width`（例如 `"200px"`）来控制何时换行。
- `type: "expandable"` 将其 `schema` 放入一个可展开和收起的区域中，并带有一个 `title`。

两者都有一个 `name` 和一个 `flatten` 选项。当设置 `flatten: true` 或 `name` 为空时，该组的值会进入主配置；否则它们会进入该名称下的一个子对象。完整的选项集见 [`src/components/ha-form/types.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-form/types.ts)。

### 实体名称

示例中的 `entity_name` 选择器让人们可以选择实体的命名方式：使用实体自身的名称、其设备、区域（area）或楼层，或者使用他们自己输入的文本。它的值正是 `hass.formatEntityName()` 所接受的格式，因此可以直接传递：

```js
const name = this._hass.formatEntityName(stateObj, this._config.name);
```

该选择器有两个自己的选项：

- `entity_id`：用于预览名称的固定实体，而不是来自 `context.entity` 的实体。
- `default_name`：在字段尚无已配置的值（`undefined`）时显示的值。它接受与值相同的形态：一个字符串、一个名称项，或它们的列表。

关于它能做什么，请参阅 [hass 对象参考](https://www.hasscn.top/contributors/frontend/reference/hass-object/#formatentityname)。

## 自定义可视化编辑器

当表单不够用时，可以编写你自己的编辑器元素，并从静态方法 `getConfigElement()` 中返回它：

```js
static getConfigElement() {
  return document.createElement("state-card-example-editor");
}
```

Home Assistant 会以配置调用编辑器上的 `setConfig()`，并在其上设置 `hass`，就像对卡片一样。如果你的编辑器有一个 `lovelace` 属性，Home Assistant 也会设置它，其中包含关于仪表盘的信息。没有该属性的普通元素则不会获得它。当用户更改了某些内容时，触发一个带有完整新配置的 `config-changed` 事件：

```js
class StateCardExampleEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
  }

  _changed(newConfig) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define(
  "state-card-example-editor",
  StateCardExampleEditor
);
```

当卡片两者兼有时，会使用 `getConfigElement()`。
