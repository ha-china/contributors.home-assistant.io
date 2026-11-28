# 扩展前端

> 与 Core 中的更改相配套的前端更改，例如为新域（domain）提供更多信息视图，或为集成提供 WebSocket 命令。

Source: https://www.hasscn.top/contributors/frontend/extending/

有时 Core 中的更改需要前端提供一些新功能：新的实体（entity）域需要控件，或者集成需要发送界面尚不支持的数据。这些页面介绍了这方面的前端部分。

每一项都是向[前端仓库](https://github.com/home-assistant/frontend)提交的拉取请求（pull request），通常还会同时向 Core 提交一个。请在拉取请求模板中将两者相互链接，以便审查者看到完整的上下文。[审查与发布](https://www.hasscn.top/contributors/frontend/development/review-and-release/#changes-that-need-the-backend)解释了这两者是如何合并的。

- [添加更多信息视图](https://www.hasscn.top/contributors/frontend/extending/more-info/)：某个域在更多信息对话框中的控件。
- [添加状态卡片](https://www.hasscn.top/contributors/frontend/extending/state-card/)：显示实体及其状态的那一行。
- [添加 WebSocket 命令](https://www.hasscn.top/contributors/frontend/extending/websocket-api/)：将数据从你的集成发送到前端。

大多数集成都不需要这些。现有域的实体已经拥有各自的控件、卡片和更多信息视图。请查看设计区域中的[更多信息视图](https://www.hasscn.top/contributors/design/more-info/)和[仪表盘卡片](https://www.hasscn.top/contributors/design/dashboards/)，了解已有的内容。
