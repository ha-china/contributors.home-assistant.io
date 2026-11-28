# 添加状态卡片

> 显示实体及其图标、名称和状态或控件的行，以及如何为某个集成域添加一个。

Source: https://www.hasscn.top/contributors/frontend/extending/state-card/

状态卡片（state card）是针对单个实体的紧凑行：包含它的图标、名称、上次变更时间，以及它的状态，或者一个用于更改它的小控件。你可以在使用旧版设计的域的更多信息对话框顶部，以及示例库中找到它们。

大多数域并不需要自己的状态卡片。如果没有，实体在可以开关时会显示一个开关（toggle），否则以文本形式显示其状态。只有当某个域需要在该行中使用不同的控件（如数字输入框或下拉选择）时，才添加状态卡片。

状态卡片位于 [`src/state-summary/`](https://github.com/home-assistant/frontend/tree/dev/src/state-summary) 中，每个域对应一个元素。

## 为某个域添加状态卡片

此示例为一个名为 `example` 的域添加状态卡片。

1. 在 [`src/common/const.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/const.ts) 中，将 `"example"` 添加到 `DOMAINS_WITH_CARD`。
2. 创建 `src/state-summary/state-card-example.ts`，其中包含一个名为 `state-card-example` 的元素。它会接收 `hass`、`stateObj` 和 `inDialog`，当卡片显示在更多信息对话框中时，`inDialog` 为 `true`。
3. 在 [`src/state-summary/state-card-content.ts`](https://github.com/home-assistant/frontend/blob/dev/src/state-summary/state-card-content.ts) 中导入它：

   ```ts
   import "./state-card-example";
   ```

`state-card-content` 会根据域来选择元素：列表中的域使用 `state-card-<domain>`，其他可切换的实体使用 `state-card-toggle`，其余的则使用 `state-card-display`。不可用的实体使用 `state-card-display`。带有 `custom_ui_state_card` 属性的实体会跳过所有这些逻辑：该属性指定了要使用的元素。

请参考现有的状态卡片，例如 `state-card-number.ts` 或 `state-card-select.ts`，了解其结构以及它们所共用的 `state-info` 元素。
