# 前端中的 hass 对象

> 每个卡片、面板和组件都会获取的 hass 对象的属性、方法和格式化工具。

Source: https://www.hasscn.top/contributors/frontend/reference/hass-object/

`hass` 对象保存着 Home Assistant 在前端中的状态，以及与 Core 通信的函数。自定义卡片、徽章、特性、视图、策略和面板都会获取它。完整类型定义在 [`src/types.ts`](https://github.com/home-assistant/frontend/blob/dev/src/types.ts) 中的 `HomeAssistant`。

每次变化都会生成一个新的 `hass` 对象，但未发生变化的部分会保持其引用不变。使用 `!==` 进行比较以判断某项是否发生了变化：

```js
if (newHass.states[entityId] !== oldHass.states[entityId]) {
  // This entity changed
}
```

要查看实时 `hass` 对象中的内容，请在浏览器的开发者工具中打开它，如[运行前端](https://www.hasscn.top/contributors/frontend/development/run/#look-at-the-hass-object)所示。

在前端内部，叶子组件使用[上下文（contexts）](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)而不是 `hass`。

## 属性

| 属性 | 说明 |
| --- | --- |
| `states` | 所有实体的状态，以实体 ID 为键。 |
| `entities` | 实体注册表，以实体 ID 为键，包含界面所需的字段，如名称、图标、区域和设备。 |
| `devices` | 设备注册表，以设备 ID 为键。 |
| `areas` | 区域注册表，以区域 ID 为键。 |
| `floors` | 楼层注册表，以楼层 ID 为键。 |
| `services` | 按域分类的可用[动作（action）](https://www.hasscn.top/contributors/glossary/action/)。 |
| `config` | Core 的配置：位置、单位、时区、版本和已加载的组件。 |
| `user` | 当前登录的用户，包含 `name`、`is_admin` 和 `is_owner`。 |
| `language` | 界面的语言。 |
| `locale` | 用户的数字、日期和时间格式设置。 |
| `themes` 和 `selectedTheme` | 可用的主题，以及当前使用的主题。 |
| `panels` | 已注册的面板。 |
| `connection` | 来自 `home-assistant-js-websocket` 的 WebSocket 连接。 |
| `connected` | 连接是否已建立。 |

状态对象如下所示：

```json
{
  "entity_id": "light.ceiling",
  "state": "on",
  "attributes": {
    "brightness": 180,
    "friendly_name": "Ceiling",
    "supported_features": 32
  },
  "last_changed": "2026-10-10T13:46:59.129248+00:00",
  "last_updated": "2026-10-10T13:46:59.129248+00:00",
  "context": {
    "id": "01J9Z4V8M0R3XGQ2W4E5T6Y7U8",
    "parent_id": null,
    "user_id": null
  }
}
```

## 调用 Core

以下所有方法都返回一个 promise。

### callService

```js
hass.callService("light", "turn_on", { brightness_pct: 50 }, {
  entity_id: "light.kitchen",
});
```

执行一个[动作（action）](https://www.hasscn.top/contributors/glossary/action/)。参数依次为域、动作、其数据，以及可选的[目标（target）](https://www.hasscn.top/contributors/glossary/target/)。另外两个可选参数：`notifyOnError`（默认为 `true`）在动作失败时显示消息，`returnResponse` 用于请求返回数据的动作的响应。

### callWS

```js
const areas = await hass.callWS({ type: "config/area_registry/list" });
```

发送一条 WebSocket 命令，并以结果完成（resolve）。当 Core 返回错误时则以该错误拒绝（reject）。要持续接收更新，请改用 `hass.connection.subscribeMessage()`。参见[数据层](https://www.hasscn.top/contributors/frontend/architecture/data/)。

### callApi

```js
const result = await hass.callApi("GET", "history/period");
```

使用用户的身份验证信息调用 `/api/` 下的 REST API。参数为方法、路径和可选数据。新功能应使用 WebSocket 命令。`callApiRaw()` 功能相同，但返回原始的 `Response`。

### fetchWithAuth

使用用户的访问令牌获取 Home Assistant 的任意 URL，并返回 `Response`。

### hassUrl

`hass.hassUrl("/api/camera_proxy/camera.front")` 返回 Home Assistant 上某个路径的完整 URL。

## 文本

### localize

`hass.localize(key, values)` 返回前端的翻译字符串，或已加载翻译的集成的翻译字符串。参见[前端中的翻译](https://www.hasscn.top/contributors/frontend/architecture/translations/)。

### loadBackendTranslation

`hass.loadBackendTranslation(category, integrations)` 从 Core 加载翻译，例如 `"title"` 或 `"entity"`，并以一个能识别这些翻译的 `localize` 函数完成。

## 格式化工具

这些格式化工具会根据用户的语言、数字格式、日期格式、时区和单位，将状态、属性和名称转换为文本。请使用它们，而不是直接显示原始值。每个工具都接受一个状态对象，例如 `hass.states["light.kitchen"]`。

### formatEntityState

```js
hass.formatEntityState(stateObj); // "On"
hass.formatEntityState(stateObj, "off"); // "Off"
```

格式化实体的状态，或你作为第二个参数传入的其他状态。

### formatEntityAttributeValue

```js
hass.formatEntityAttributeValue(stateObj, "current_temperature");
// "20.5 °C"
hass.formatEntityAttributeValue(stateObj, "current_temperature", 18);
// "18 °C"
```

格式化某个属性的值，或你作为第三个参数传入的其他值。

### formatEntityAttributeName

```js
hass.formatEntityAttributeName(stateObj, "current_temperature");
// "Current temperature"
```

格式化某个属性的名称。

### Parts

`formatEntityStateToParts()` 和 `formatEntityAttributeValueToParts()` 接受相同的参数，并以分段形式返回结果，每段都有一个 `type`，取值为 `value`、`unit` 或 `literal`。使用它们可以对数字和单位应用不同的样式。

### formatEntityName

```js
hass.formatEntityName(stateObj, name, options);
```

根据实体的注册表上下文格式化实体名称：实体本身、其设备、父设备、区域和楼层。内置卡片使用它，因此同样使用它的自定义卡片会以相同的方式命名实体。`name` 可以是：

- 省略：使用实体的友好名称。
- 一个字符串：原样返回。用于用户输入的名称。
- 单个名称项，如 `{ type: "entity" }`，或由它们组成的列表，以空格或 `options` 中的 `separator` 连接。

项的类型有 `entity`、`device`、`parent_device`、`area`、`floor`，以及带有自定义 `text` 的 `text`。无法解析出内容的项会被省略。

以一个名为 **Thermostat** 的温控器的温度传感器为例，它位于**一楼**的**客厅**：

```js
hass.formatEntityName(stateObj);
// "Thermostat Temperature"
hass.formatEntityName(stateObj, { type: "area" });
// "Living room"
hass.formatEntityName(
  stateObj,
  [{ type: "device" }, { type: "entity" }],
  { separator: " · " }
);
// "Thermostat · Temperature"
hass.formatEntityName(stateObj, [
  { type: "text", text: "Floor:" },
  { type: "floor" },
]);
// "Floor: Ground floor"
```

`parent_device` 仅为子设备的实体填充，例如插线板上的其中一个插座。这使得 `[{ type: "parent_device" }, { type: "device" }, { type: "entity" }]` 成为生成完整名称的安全选择：对于插座，它会生成 "Power strip Outlet 1 Switch"，而对于其他实体，父设备部分会被省略。这个列表也是前端组合名称时的默认值。

要让用户在卡片编辑器中选择名称，请使用 `entity_name` 选择器。它的值就是 `hass.formatEntityName()` 所接受的内容，因此可以直接传递配置。参见[卡片编辑器和选择器](https://www.hasscn.top/contributors/frontend/custom-ui/card-editor/#entity-names)。
