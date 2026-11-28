# 空状态

> 当屏幕或列表中没有任何内容时应该显示什么，以及如何帮助用户继续操作。

Source: https://www.hasscn.top/contributors/design/patterns/empty-states/

每个列表迟早都会变空。有人刚安装了 Home Assistant，搜索没有找到结果，或者筛选器隐藏了所有内容。空状态（empty state）将这片空白转化为一条清晰的信息：发生了什么，以及用户可以怎么做。

## 何时使用

当屏幕、面板或列表已完成加载且没有任何内容可显示时，使用空状态。空状态有两种，需要不同的措辞：

- **暂无内容**：用户尚未选择或创建任何内容。告诉他们如何开始。
- **无结果**：有数据，但当前的搜索或筛选没有匹配到任何内容。告诉他们需要更改什么。

历史记录面板同时展示了这两种情况。在你选择任何内容之前，它会显示**暂无内容可显示**：“选择区域、设备、实体（entity）或标签以查看其历史记录”。当你的选择没有历史记录时，它会显示**未找到结果**：“当前选择没有历史记录。请尝试更改目标、筛选器或时间范围。”

选择器（picker）也做了同样的区分：一个文本用于完全没有条目的列表，另一个文本用于没有匹配到任何内容的搜索。

在内容仍在加载时，不要显示空状态。在你确认列表为空之前，请显示[加载状态](https://www.hasscn.top/contributors/design/patterns/loading/)。

## 工作原理

前端有一个用于此目的的组件：`ha-empty-state`。它将其内容居中显示在所获得的空间中，最大宽度为 500 像素，包含：

- 顶部一个图标，64 像素，使用次要文本颜色
- 一个说明当前情况的标题
- 一个可选的描述，说明原因或下一步该做什么
- 其下方可选的操作，例如用于添加第一个条目的按钮

Live demo of `ha-empty-state`. 历史记录面板的空状态，使用其真实文本。

```html
<ha-empty-state
  icon="M9 17H7V10H9V17M13 17H11V7H13V17M17 17H15V13H17V17M19 19H5V5H19V19.1M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
  heading="No results found"
  description="No history for the current selection. Try changing the targets, filters, or time range."
></ha-empty-state>
```

### 撰写文本

- 标题应简短明了：**未找到结果**、**暂无内容可显示**。
- 描述应说明用户可以做什么：“请尝试更改目标、筛选器或时间范围。”
- 当有一个明确的下一步操作时，将其作为按钮提供，按钮标签应说明其功能。

有关措辞的更多信息，请参阅[消息](https://www.hasscn.top/contributors/design/ui-text/messages/)。

## 无障碍

- 标题是一个真正的标题（`h2`），因此屏幕阅读器用户可以找到它。
- 图标仅作装饰。标题和描述本身就能传达信息。

## 组件

- `ha-empty-state`，位于前端的 [`src/components/ha-empty-state.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-empty-state.ts)。
- [按钮](https://www.hasscn.top/contributors/design/components/button/)，用于下一步操作
- [实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)及其他选择器，用于它们各自的空状态和无匹配文本

## 代码示例

```ts
html`
  <ha-empty-state
    .icon=${mdiChartBoxOutline}
    .heading=${this.hass.localize("ui.panel.history.no_results_title")}
    .description=${this.hass.localize("ui.panel.history.no_results")}
  ></ha-empty-state>
`;
```

将操作（例如 `ha-button`）放入默认插槽（slot）中。设置 `--ha-empty-state-icon-size` 可以更改图标的大小。
