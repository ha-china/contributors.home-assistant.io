# 编码规范

> 前端代码的编写方式，从 TypeScript 和 Lit 到事件、对话框、样式和文本。审阅者在每个 pull request 中关注的内容。

Source: https://www.hasscn.top/contributors/frontend/development/guidelines/

这些是[前端仓库](https://github.com/home-assistant/frontend)的约定。其中一部分由 linter 强制执行，其余则是审阅者会要求的内容，因此遵循这些约定可以为你省去一轮审阅。

## TypeScript

- TypeScript 以严格模式运行。避免使用 `any`：使用现有的 Home Assistant 类型，或者编写一个窄化的类型。
- 对于仅包含类型的导入，使用 `import type`。ESLint 会强制执行这一点。
- 类型应根据拥有数据的源头来定义，例如 Core 中的 WebSocket 命令，而不是根据某个组件碰巧的使用方式。
- 将共享类型放在拥有它的数据模块中，位于 [`src/data/`](https://github.com/home-assistant/frontend/tree/dev/src/data) 下，并从那里导入。
- 不要在生产代码中使用 `console`。向用户显示错误，或使用现有的日志记录。

## Lit 组件

- 元素使用前缀命名：`ha-` 用于共享的 Home Assistant 组件，`hui-` 用于仪表盘（"Lovelace"）组件，`dialog-` 用于对话框。
- 使用 `@property()` 定义组件的公共 API，使用 `@state()` 定义其内部状态。
- 项目使用 Lit 的 TypeScript 装饰器，并设置 `useDefineForClassFields: false`。请与现有的声明保持一致。不要使用 `accessor` 关键字。
- 对于自己模板中的元素，使用 `@query()`，而不是手动查询 DOM。
- 在 `render()` 中计算开销较小的值。对于其他生命周期步骤需要的值，使用 `willUpdate()`，只有当 `memoizeOne` 能真正节省工作时才使用它。
- 在生命周期方法中，将变更的属性类型标注为 `PropertyValues<this>`，或者在读取私有属性时使用普通的 `PropertyValues`。

## 数据访问

叶子组件应使用能覆盖其所需数据的最窄的 [Lit context](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)，而不是获取整个 `hass` 对象。读取 `hass` 的组件会在家中的每次状态（state）变化时重新渲染，即使它显示的内容没有任何变化。拥有 `hass` 并将其传递下去的容器可以保留它。

从 `src/common/decorators/consume` 导入 `consume`，而不是从 `@lit/context`。ESLint 同样会强制执行这一点。

## 事件

- 使用 [`src/common/dom/fire_event.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/dom/fire_event.ts) 中的 `fireEvent()` 触发事件。事件默认会冒泡并跨越 shadow root。
- 通过扩展 `HASSDomEvents` 接口来声明每个自定义事件及其 detail 类型，这样 `fireEvent()` 就能检查载荷。
- 使用同一文件中的辅助类型为事件处理器标注类型：`HASSDomEvent<T>` 用于 `detail`，`HASSDomCurrentTargetEvent<T>` 用于读取监听器所在的元素，`HASSDomTargetEvent<T>` 用于触发事件的元素。对于 `value-changed`，使用 [`src/types.ts`](https://github.com/home-assistant/frontend/blob/dev/src/types.ts) 中的 `ValueChangedEvent<T>`。

```ts
fireEvent(this, "item-selected", { id: item.id });

declare global {
  interface HASSDomEvents {
    "item-selected": { id: string };
  }
}
```

## 应使用的组件

在编写自己的组件之前，请先使用 [`src/components/`](https://github.com/home-assistant/frontend/tree/dev/src/components) 中的共享组件。其中许多组件（如 `ha-button`、`ha-dialog`、`ha-switch` 和 `ha-tooltip`）包装了 [Web Awesome](https://webawesome.com/) 组件。不要添加 `mwc-*` Material 组件：前端已不再使用它们。

- **对话框**：使用 `ha-dialog` 以及 [`src/dialogs/dialog-mixin.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/dialog-mixin.ts) 中的 `DialogMixin`。通过触发 `show-dialog` 事件并传入标签、导入函数和参数来打开对话框。将操作按钮放在 `ha-dialog-footer` 的 `primaryAction` 和 `secondaryAction` 插槽中。
- **按钮**：`ha-button` 有 `variant`（`brand`、`neutral`、`danger`、`warning`、`success`）、`appearance`（`accent`、`filled`、`outlined`、`plain`）和 `size`。取消操作使用 `appearance="plain"`，破坏性操作使用 `variant="danger"`。
- **表单**：`ha-form` 根据[选择器（selector）](https://www.hasscn.top/contributors/glossary/selector/)的模式渲染表单。使用 `computeLabel`、`computeHelper` 和 `computeError` 为其提供翻译后的文本。
- **消息**：使用 `ha-alert`，`alert-type` 可选 `error`、`warning`、`info` 或 `success`。
- **键盘快捷键**：[`src/common/keyboard/shortcuts.ts`](https://github.com/home-assistant/frontend/blob/dev/src/common/keyboard/shortcuts.ts) 中的 `ShortcutManager`。

每个组件在[设计区域](https://www.hasscn.top/contributors/design/components/)中都有一个页面，说明何时使用它以及如何使用。

## 样式

- 使用主题变量和[设计令牌（design token）](https://www.hasscn.top/contributors/frontend/architecture/theming/)，绝不硬编码颜色。间距使用 `--ha-space-*` 令牌。
- 将样式限定在组件范围内。不要依赖全局样式来处理组件内部。
- 优先为移动端设计，然后再添加宽屏所需的内容。
- 保持布局对从右到左（RTL）语言安全。优先使用逻辑属性，例如用 `margin-inline-start` 代替 `margin-left`。
- 确保触摸目标足够大，并为每个控件提供清晰的悬停、聚焦、激活和禁用状态。
- 保持动效克制，并使用 `--ha-animation-duration-*` 令牌。它们会遵循减少动效的设置。

## 面向用户的文本

- 用户看到的每个字符串都要经过翻译系统。将其添加到 [`src/translations/en.json`](https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json) 中，并在代码中使用 `localize`。[前端的翻译](https://www.hasscn.top/contributors/frontend/architecture/translations/)介绍了具体方法。
- 使用带占位符的完整句子。绝不要将翻译后的片段拼接在一起。
- 使用美式英语、句首大写和主动语态。完整写出 "Home Assistant"。
- 对于可以重新添加的内容使用 "Remove"，对于永久删除的内容使用 "Delete"。对于已存在的内容使用 "Add"，对于新创建的内容使用 "Create"。

设计区域的 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)部分提供了完整的指南。

## 状态与清理

- 处理加载、错误、不可用和缺失实体（entity）的情况。在读取实体之前，先检查该实体是否存在。
- 在组件断开连接时，移除事件监听器、定时器、观察者和订阅。
- 确保每个控件都可以通过键盘和屏幕阅读器使用。

## 提交与依赖

pre-commit 钩子会对你提交的文件运行 ESLint、Prettier 和 Lit 分析器，并尽可能自动修复。只编辑英文文本，即 [`src/translations/en.json`](https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json)。其他语言在 [Lokalise](https://www.hasscn.top/contributors/glossary/lokalise/) 中翻译，并在构建时下载，该钩子会拒绝修改这些已下载文件的提交。

将依赖更新放在单独的 pull request 中。
