# hass 对象与上下文（contexts）

> 组件如何获取数据。承载一切的 hass 对象，以及只向组件提供其所需部分的 Lit 上下文。

Source: https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/

前端将 Home Assistant 的状态保存在一个对象中，即 `hass`。它包含所有实体的状态、各个注册表、配置、用户、翻译，以及调用 Core 的函数。每当有变化时，前端会创建一个新的 `hass` 对象，其中只有发生变化的部分会得到新版本。

这使得检查变化非常廉价：通过引用进行比较。

```ts
const changed = newHass.states !== oldHass.states;
```

## 获取数据的两种方式

**`hass` 属性。** 面板、卡片和许多组件将 `hass` 作为属性接收，并将其传递给子组件。这种方式简单，并且是[自定义卡片和面板](https://www.hasscn.top/contributors/frontend/custom-ui/)的公开 API。缺点是：家中每次变化都会带来新的 `hass`，因此接收 `hass` 的组件检查或重新渲染的频率远超实际需要，而且它掩盖了组件真正依赖哪些数据。

**上下文（contexts）。** 根元素以一组 [Lit 上下文](https://lit.dev/docs/data/context/)的形式提供相同的数据，并按主题拆分。组件只消费它读取的上下文，并且只在这些上下文变化时更新。

对于前端中的新代码：叶子组件应消费覆盖其读取内容的最窄上下文。拥有 `hass` 并将其向下传递的容器可以继续保留该属性。

## 上下文列表

这些上下文定义在 [`src/data/context/index.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/context/index.ts) 中。

| 上下文 | 包含内容 | 替代 |
| --- | --- | --- |
| `statesContext` | 所有实体的状态 | `hass.states` |
| `entitiesContext` | 实体注册表，用于显示 | `hass.entities` |
| `devicesContext` | 设备注册表 | `hass.devices` |
| `areasContext` | 区域注册表 | `hass.areas` |
| `floorsContext` | 楼层注册表 | `hass.floors` |
| `registriesContext` | 以上四个注册表的合集 | |
| `servicesContext` | 可用的动作 | `hass.services` |
| `internationalizationContext` | 语言、区域设置、`localize` 以及翻译加载器 | `hass.localize`、`hass.locale`、`hass.language` |
| `formattersContext` | 实体格式化器 | `hass.formatEntityState` 及其他 |
| `configContext` | Core 配置、用户和认证 | `hass.config`、`hass.user`、`hass.auth`、`hass.userData` |
| `connectionContext` | WebSocket 连接及其状态 | `hass.connection`、`hass.connected` |
| `apiContext` | 调用 Core 的函数 | `hass.callService`、`hass.callWS`、`hass.callApi` 等 |
| `uiContext` | 主题、面板、侧边栏及其他 UI 状态 | `hass.themes`、`hass.panels` 等 |
| `narrowViewportContext` | 主视图是否使用窄屏布局 | |
| `reducedMotionContext` | 用户是否偏好减少动态效果 | |

有些上下文是惰性的：只有当第一个组件消费它们时才会订阅 Core，并在最后一个组件离开后取消订阅。这些包括 `labelsContext`、`fullEntitiesContext`、`configEntriesContext`、`manifestsContext`、`triggerDescriptionsContext` 和 `conditionDescriptionsContext`。

较旧的单值上下文，如 `localizeContext`、`themesContext` 和 `userContext`，已被弃用。请使用分组后的上下文。

## 消费上下文

请从 `src/common/decorators/consume` 导入 `consume`，而不是从 `@lit/context`。`@lit/context` 的版本会在每个被消费的上下文每次变化时都重新渲染组件。前端的版本将这一决定留给字段本身，并且 ESLint 会阻止使用另一个版本。

```ts
@state()
@consume({ context: labelsContext, subscribe: true })
private _labels?: LabelRegistryEntry[];
```

如何组合这些装饰器决定了组件何时渲染：

- `@state()` 搭配 `@consume`：上下文变化时组件重新渲染。
- `@state()` 搭配 `@consume` 和 `@transform`：仅当转换后的值变化时组件才重新渲染。
- 仅使用 `@consume`：字段保持最新，但从不触发渲染。适用于只在事件处理器中读取的值，例如 `apiContext`。

要从分组上下文中取出单个值，请添加来自 `src/common/decorators/transform` 的 `@transform`：

```ts
@state()
@consume({ context: uiContext, subscribe: true })
@transform<HomeAssistantUI, Themes>({
  transformer: ({ themes }) => themes,
})
private _themes!: Themes;
```

### 单个实体

对于显示单个实体的组件，[`src/common/decorators/consume-context-entry.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/decorators/consume-context-entry.ts) 提供了一些辅助函数，可以跟踪组件上持有的实体 ID（entity ID）：

```ts
@state()
@consumeEntityState({ entityIdPath: ["_config", "entity"] })
private _stateObj?: HassEntity;

@state()
@consumeEntityRegistryEntry({ entityIdPath: ["_config", "entity"] })
private _entity?: EntityRegistryDisplayEntry;

@state() @consumeLocalize()
private _localize!: LocalizeFunc;
```

`consumeEntityStates` 对一组实体 ID 执行相同的操作，并且当这些实体都没有变化时保留之前的记录。

[`src/panels/lovelace/cards/hui-button-card.ts`](https://github.com/home-assistant/frontend/blob/dev/src/panels/lovelace/cards/hui-button-card.ts) 中的按钮卡片是使用上下文而非 `hass` 的组件的参考示例。

### 在响应式控制器中

响应式控制器（reactive controller）继承 `ContextController` 并使用 `consumeContext()` 声明其字段，两者均来自 [`src/common/decorators/consume.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/decorators/consume.ts)。`@state()` 和 `@transform` 在控制器上不起作用：当宿主需要渲染时，请调用 `host.requestUpdate()`。[`src/data/service-info-controller.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/service-info-controller.ts) 是一个示例。

## 前端之外

自定义卡片和面板也可以请求上下文，无需从前端导入任何内容，只需触发一个 `context-request` 事件即可。[自定义卡片](https://www.hasscn.top/contributors/frontend/custom-ui/card/#get-only-the-data-you-need)展示了具体做法。

`hass` 本身的方法和属性列在 [hass 对象参考](https://www.hasscn.top/contributors/frontend/reference/hass-object/)中。
