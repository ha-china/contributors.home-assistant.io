# 更新

> 更新实体（entity）的更多信息视图，包含版本、发行说明以及跳过或安装按钮。

Source: https://www.hasscn.top/contributors/design/more-info/update/

Live demo of `ha-demo-more-info`, connected to a demo Home Assistant.

```html
<ha-demo-more-info entity="update.home_assistant_core"></ha-demo-more-info>
<ha-demo-more-info entity="update.desk_plug_firmware"></ha-demo-more-info>
```

## 显示内容

更新是你在操作之前需要先阅读的内容，因此这个视图是一个简短的页面，而不是一个控制界面。它没有采用带大号状态的新设计。它以状态行开始，例如**有可用更新**或**已是最新版本**，并且对话框使用屏幕的全部高度，以便为发行说明留出空间。

从上到下依次为：

- **标题**：被更新对象的名称，例如 **Home Assistant Core**。
- **版本**：已安装的版本和最新版本。
- **发布公告**：一个链接（当更新有发布公告时显示）。
- **发行说明**：完整的说明（当集成（integration）能够提供时显示）。否则，显示简短的更新摘要（如果有）。
- **备份**：对于支持备份的更新，提供在更新前创建备份的选项。
- **操作**：底部的**跳过**和**更新**按钮。

Home Assistant Core 更新有一个新版本，并带有发行说明。桌面插头固件已是最新版本，因此**跳过**和**更新**按钮处于禁用状态。

## 设计说明

- 当更新正在安装时，标题上方会显示一个进度条。当集成报告进度时，进度条会填充；当集成不报告进度时，进度条会来回移动。
- 当你跳过了一个版本且没有其他可安装的内容时，**跳过**会变为**清除跳过**，以便你可以撤销跳过操作。
- **更新**按钮在更新安装期间会显示加载动画。当没有新内容时它处于禁用状态，但对于你跳过的版本仍然可用，以便你以后仍可安装。
- **更新**按钮仅在该更新可以从 Home Assistant 安装时显示。有些更新只能阅读了解。
- 发行说明在对话框打开后加载，加载期间会显示加载动画。

## 代码实现

该视图是 [`src/dialogs/more-info/controls/more-info-update.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-update.ts) 中的 `more-info-update`。备份选项是 [`src/dialogs/more-info/components/update/`](https://github.com/home-assistant/frontend/tree/dev/src/dialogs/more-info/components/update) 中的 `ha-more-info-update-backup`。顶部的状态行是 [`src/state-summary/`](https://github.com/home-assistant/frontend/tree/dev/src/state-summary) 中的 `state-card-update`。`UpdateEntityFeature` 枚举以及 `updateIsInstalling` 等辅助函数位于 [`src/data/update.ts`](https://github.com/home-assistant/frontend/blob/dev/src/data/update.ts) 中。

Source: [`more-info-update.ts`](https://github.com/home-assistant/frontend/blob/dev/src/dialogs/more-info/controls/more-info-update.ts)
