# 数据层

> 前端如何与 Core 通信。src/data 中的 WebSocket 命令、订阅和集合，以及组件如何使用它们。

Source: https://www.hasscn.top/contributors/frontend/architecture/data/

前端所了解的关于 Home Assistant 的一切都通过一条 WebSocket 连接传输，由 [`home-assistant-js-websocket`](https://github.com/home-assistant/home-assistant-js-websocket) 库管理。状态的核心部分，比如实体（entity）和注册表，通过 `hass` 和[上下文（contexts）](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)获取。其余内容则由组件自行请求。

## src/data

与 Core 的所有通信都通过 [`src/data/`](https://github.com/home-assistant/frontend/tree/dev/src/data) 进行。每个文件或文件夹负责一个主题：它的类型，以及为它调用 Core 的函数。组件导入这些函数，而不是自己发送消息。这样就把每条消息的结构保存在一处，与它的类型放在一起。

一个典型的数据模块包含一个与 Core 发送内容相匹配的类型，以及每个命令对应的函数：

```ts
export interface LabelRegistryEntry extends RegistryEntry {
  label_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
}

export const createLabelRegistryEntry = (
  hass: HomeAssistant,
  values: LabelRegistryEntryMutableParams
) =>
  hass.callWS<LabelRegistryEntry>({
    type: "config/label_registry/create",
    ...values,
  });
```

类型遵循拥有该数据的源头，即 Core 中的 WebSocket 命令，而不是某个组件恰好需要的内容。类型中的可选和可空字段与 Core 实际发送的内容保持一致。

## 命令

对于单次请求和应答，使用 `hass.callWS()`。它发送一条消息并返回结果的 promise。当 Core 报告失败时，它会以错误对象拒绝。

```ts
const labels = await hass.callWS<LabelRegistryEntry[]>({
  type: "config/label_registry/list",
});
```

`hass.callService()` 调用[动作（action）](https://www.hasscn.top/contributors/glossary/action/)，`hass.callApi()` 调用 REST API。新功能使用 WebSocket 命令，而不是 REST。

## 订阅

要与发生变化的内容保持同步，请使用订阅。之后 Core 会将每次变更推送到前端，直到你取消订阅。

```ts
export const subscribeFrontendUserData = (
  conn: Connection,
  key: string,
  onChange: (data: { value: unknown }) => void
) =>
  conn.subscribeMessage(onChange, {
    type: "frontend/subscribe_user_data",
    key,
  });
```

`subscribeMessage` 返回一个取消订阅函数的 promise。当数据不再需要时，务必调用它，否则 Core 会继续向已经不存在的组件发送更新。

## 集合

当多个组件需要相同的数据时，集合（collection）会在它们之间共享一个订阅。`home-assistant-js-websocket` 中的 `createCollection` 接受一个键、一个获取数据的函数，以及一个订阅更新的函数。每个订阅者都获得相同的数据。当最后一个订阅者离开后，与 Core 的订阅会在 5 秒的宽限期后关闭，这样马上返回的组件就不会重新建立新的订阅。

```ts
export const subscribeLabelRegistry = (
  conn: Connection,
  onChange: (labels: LabelRegistryEntry[]) => void
) =>
  createCollection<LabelRegistryEntry[]>(
    "_labelRegistry",
    fetchLabelRegistry,
    subscribeLabelRegistryUpdates,
    conn,
    onChange
  );
```

在这里，`subscribeLabelRegistryUpdates` 监听 `label_registry_updated` 事件，并在事件触发时重新获取列表。

## 从组件中订阅

[`src/mixins/subscribe-mixin.ts`](https://github.com/home-assistant/frontend/blob/dev/src/mixins/subscribe-mixin.ts) 中的 `SubscribeMixin` 会为你处理生命周期。从 `hassSubscribe()` 返回你的订阅。该 mixin 在组件已连接并拥有 `hass` 时进行订阅，在组件断开连接时取消订阅。

```ts
@customElement("ha-config-repairs-dashboard")
class HaConfigRepairsDashboard extends SubscribeMixin(LitElement) {
  @state() private _issues: RepairsIssue[] = [];

  public hassSubscribe(): UnsubscribeFunc[] {
    return [
      subscribeRepairsIssueRegistry(this.hass.connection!, (repairs) => {
        this._issues = repairs.issues;
      }),
    ];
  }
}
```

当订阅依赖于另一个属性时，请将该属性列在 `hassSubscribeRequiredHostProps` 中。mixin 会等到它被设置后再订阅。

对于许多组件共享的数据，比如标签，建议使用[惰性上下文（lazy context）](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/#the-contexts)，而不是每个组件各建一个订阅。

## Core 中的新功能

当你需要的数据尚不可用时，Core 需要一个新的 WebSocket 命令。[添加 WebSocket 命令](https://www.hasscn.top/contributors/frontend/extending/websocket-api/)展示了两侧的实现。
