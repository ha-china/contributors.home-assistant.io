# Web 视图

> 在应用内显示 Home Assistant 前端，而无需用户再次登录。

Source: https://www.hasscn.top/contributors/companion/mobile-app-api/webview/

用户在设置您的应用时已经登录过了。他们不应该为了查看自己的仪表盘（dashboard）而再次登录。前端支持这一点：当前端运行在应用内时，它可以向应用请求访问令牌（access token），而不是显示登录页面。

## 外部认证

应用会向 Web 视图中注入一个小型的 JavaScript 桥接。当前端需要令牌时，它会通过该桥接调用应用，应用则以访问令牌作为回应。当用户在前端中注销时，前端会请求应用撤销该令牌。

应用会使用在[登录](https://www.hasscn.top/contributors/companion/mobile-app-api/setup/#log-the-user-in)时获取的刷新令牌（refresh token）自行刷新访问令牌。前端永远不会看到刷新令牌。

## 外部总线

同一个桥接还承载着外部总线（external bus）：前端与应用之间的双向消息。通过它，前端可以打开应用的原生设置、启动条码扫描器、启动 Assist，或者将实体（entity）交给应用自身的 **Add to** 操作，而应用也可以告知前端它支持哪些功能。

这两种协议都在前端一侧有文档说明：[外部认证](https://www.hasscn.top/contributors/frontend/reference/external-auth/)和[外部总线](https://www.hasscn.top/contributors/frontend/reference/external-bus/)。关于 Android 应用如何实现它们，请参阅[前端界面](https://www.hasscn.top/contributors/companion/android/frontend-screen/#talking-to-the-frontend)。

## 需要直接连接

Web 视图从实例本身加载前端：使用内部 URL、外部 URL 或 Home Assistant Link 的远程 URL。Webhook 的 cloudhook URL 在这里没有用处。
