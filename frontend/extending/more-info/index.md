# 添加更多信息视图

> 让某个域的实体在更多信息对话框中拥有自己的控件。

Source: https://www.hasscn.top/contributors/frontend/extending/more-info/

当你选择一个实体（entity）时，会打开[更多信息对话框](https://www.hasscn.top/contributors/glossary/more-info-dialog/)。它显示的内容取决于实体所属的域（domain）：灯会有亮度滑块，锁会有一个大的锁定按钮。没有自己视图的域会显示默认内容：一行状态、历史记录，以及（对大多数域而言）日志簿。实体的属性不属于视图的一部分：对话框会通过其三点菜单，在单独的详情视图中显示它们。

在构建之前，请先查看设计区域中的[更多信息视图](https://www.hasscn.top/contributors/design/more-info/)。它们展示了所有现有的视图，以及新视图应遵循的原则：一个大的主控件，其下方是次要控件，并且只显示设备支持的控件。

## 为一个域添加视图

本示例为一个名为 `example` 的域添加视图。

1. 创建 `src/dialogs/more-info/controls/more-info-example.ts`，其中包含一个名为 `more-info-example` 的元素。对话框会在其上设置 `hass`、`stateObj` 和 `entry`（实体注册表条目）。

   ```ts
   @customElement("more-info-example")
   class MoreInfoExample extends LitElement {
     @property({ attribute: false }) public hass!: HomeAssistant;

     @property({ attribute: false }) public stateObj?: HassEntity;

     protected render() {
       if (!this.stateObj) {
         return nothing;
       }
       return html`<!-- the controls of the domain -->`;
     }
   }
   ```

2. 在 [`src/dialogs/more-info/const.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/const.ts) 中，将 `"example"` 添加到 `DOMAINS_WITH_MORE_INFO`。
3. 在 [`src/dialogs/more-info/state_more_info_control.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/state_more_info_control.ts) 中，向 `LAZY_LOADED_MORE_INFO_CONTROL` 添加一个懒加载导入：

   ```ts
   example: () => import("./controls/more-info-example"),
   ```

4. 对于遵循较新设计的视图（以大号状态显示代替状态行），还需在同一 `const.ts` 中将该域添加到 `DOMAINS_WITH_NEW_MORE_INFO`。

`const.ts` 中的其他列表用于微调对话框。`DOMAINS_HIDE_DEFAULT_MORE_INFO` 列出了没有自己视图、会跳过默认视图元素的域，而 `DOMAINS_MORE_INFO_NO_HISTORY` 则隐藏历史记录和日志簿。

## 复用控件

不要从零开始构建控件。更多信息视图共享来自 [`src/dialogs/more-info/components/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components) 的组件，以及来自 [`src/components/`](https://github.com/home-assistant/frontend/tree/dev/src/components) 的大型触控控件，例如 `ha-control-slider` 和 `ha-control-switch`。现有的视图，例如 `more-info-lock.ts` 或 `more-info-fan.ts`，都是很好的起点。

只显示实体支持的内容：在渲染控件之前，先检查其 `supported_features` 和属性。

## 将其添加到画廊

将新视图添加到[画廊](https://www.hasscn.top/contributors/frontend/development/gallery-and-demo/)的更多信息部分，并附带几个处于不同状态的实体，以便审核者无需设备即可查看它。
