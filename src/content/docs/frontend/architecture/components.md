---
title: 组件与 Lit
description: Web components、Lit 以及封装 Web Awesome 的共享 ha-* 组件。每个界面的构建基石。
order: 1
---

界面的每一部分都是一个自定义元素（custom element）：一个以标签名注册的类，在 shadow root 中拥有自己的模板和样式。前端使用 [Lit](https://lit.dev/) 编写它们，这是一个小型库，为标准 web components 添加了响应式属性和高效模板。

## 一个组件

一个典型的组件如下所示：

```ts
import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators";

@customElement("ha-example-row")
export class HaExampleRow extends LitElement {
  @property() public label?: string;

  @state() private _expanded = false;

  protected render() {
    if (!this.label) {
      return nothing;
    }

    return html`
      <button @click=${this._toggle}>${this.label}</button>
      ${this._expanded ? html`<slot></slot>` : nothing}
    `;
  }

  private _toggle() {
    this._expanded = !this._expanded;
  }

  static styles = css`
    :host {
      display: block;
      padding: var(--ha-space-2);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-example-row": HaExampleRow;
  }
}
```

- `@property()` 是公开 API，由使用该元素的代码设置。`@state()` 是内部状态。改变其中任何一个都会调度一次渲染。
- `render()` 返回一个模板。Lit 只更新 DOM 中发生变化的部分。
- 样式通过 shadow root 限定在组件内部。
- `HTMLElementTagNameMap` 声明为其他代码提供了该元素的类型。

[Lit 文档](https://lit.dev/docs/)涵盖了其余内容：生命周期、指令和响应式控制器。

## 命名

标签名能告诉你组件属于哪里：

- `ha-*`：位于 `src/components/` 的共享 Home Assistant 组件，例如 `ha-button` 或 `ha-entity-picker`。
- `hui-*`：位于 `src/panels/lovelace/` 的仪表盘（dashboard）组件，例如 `hui-tile-card`。这个前缀来自仪表盘的旧名称 Lovelace，它仍然出现在代码中。
- `dialog-*`：对话框。
- `more-info-*` 和 `state-card-*`：更多信息对话框的视图和状态卡片，每个域（domain）各有一个。

## 共享组件与 Web Awesome

`src/components/` 中的共享组件是每个界面的构建基石：按钮、输入框、对话框、选择器和控件。其中许多组件，例如 `ha-button`、`ha-dialog`、`ha-dropdown`、`ha-switch`、`ha-slider` 和 `ha-tooltip`，封装了 [Web Awesome](https://webawesome.com/) 中的组件。前端使用的是自己的 Web Awesome 构建，即 `@home-assistant/webawesome`。

封装器继承 Web Awesome 的类，并添加 Home Assistant 所需的主题和行为：

```ts
import Button from "@home-assistant/webawesome/dist/components/button/button";

@customElement("ha-button")
export class HaButton extends Button {
  // Home Assistant variants, styles, and theme variables
}
```

请始终使用 `ha-*` 元素，绝不要直接使用 Web Awesome 元素。封装器是主题、翻译以及针对 Home Assistant 的修复所在之处，它也是保持每个界面一致性的关键。

前端不再使用 Material Web Components（`mwc-*`）。不要将它们添加回来。某些 `--mdc-*` CSS 属性仍被用于主题化，但新代码使用 `--ha-*` 属性。

每个共享组件在[设计区域](/design/components/)中都有一个页面，包含使用指南、实时示例及其属性。在构建新东西之前，请先查看那里。

## Mixin 与控制器

某些行为通过 mixin 和响应式控制器而不是基类来共享：

- `src/mixins/subscribe-mixin.ts` 中的 `SubscribeMixin` 为组件管理 WebSocket 订阅。参见[数据层](/frontend/architecture/data/)。
- `src/dialogs/dialog-mixin.ts` 中的 `DialogMixin` 处理新对话框的打开和关闭。
- `src/common/decorators/` 包含用于消费上下文（context）的装饰器，例如 `@consume` 和 `@consumeEntityState`，以及用于转换它们的装饰器，例如 `@transform`。参见 [hass 对象与上下文](/frontend/architecture/hass-and-contexts/)。
