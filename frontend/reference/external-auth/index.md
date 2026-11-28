# 外部认证

> 嵌入前端的 应用（如伴侣应用）如何自行保留登录，并将访问令牌交给前端。

Source: https://www.hasscn.top/contributors/frontend/reference/external-auth/

通常前端会自行处理登录：它显示登录页面、存储令牌并刷新它们。而在 Web 视图中嵌入前端的应用，比如[伴侣应用](https://www.hasscn.top/contributors/companion/)，则希望自行保留登录，只在需要时才向前端提供访问令牌（access token）。这就是外部认证的用途。

## 开启外部认证

在 URL 中使用 `?external_auth=1` 加载前端。随后前端会期望在 `window` 上定义以下桥接之一：

- `window.externalAppV2`：Android，推荐的桥接。它需要一个支持 [`WebViewFeature.WEB_MESSAGE_LISTENER`](https://developer.android.com/reference/androidx/webkit/WebViewCompat.WebMessageListener) 的 Web 视图。
- `window.externalApp`：Android，用于不支持该功能的 Web 视图的回退方案。
- `window.webkit.messageHandlers`：iOS 和 macOS。

当存在多个时，前端会按此顺序使用它们。如果都不存在，前端将无法启动。

## 获取访问令牌

前端在加载时会请求令牌，并在其令牌过期时再次请求。它会发送一个包含回调名称的载荷（payload），并在即使旧令牌尚未过期也需要新令牌时附带 `force: true`：

```js
// Android, V2
window.externalAppV2.postMessage(
  JSON.stringify({
    type: "getExternalAuth",
    payload: { callback: "externalAuthSetToken", force: true },
  })
);

// Android, V1
window.externalApp.getExternalAuth(
  JSON.stringify({ callback: "externalAuthSetToken", force: true })
);

// iOS and macOS
window.webkit.messageHandlers.getExternalAuth.postMessage({
  callback: "externalAuthSetToken",
  force: true,
});
```

在 Android 上载荷是 JSON 字符串，在 iOS 和 macOS 上则是对象。

应用通过调用回调来应答，传入是否成功，以及令牌及其有效秒数：

```js
window.externalAuthSetToken(true, {
  access_token: "ABCDEFGH",
  expires_in: 1800,
});

// 当应用无法获取令牌时
window.externalAuthSetToken(false);
```

## 撤销令牌

当用户在其个人资料中退出登录时，前端会请求应用执行退出登录。应用必须通过 Core 的[认证 API](https://www.hasscn.top/contributors/core/internals/auth-api/) 撤销其刷新令牌（refresh token），并让用户退出登录：

```js
// Android, V2
window.externalAppV2.postMessage(
  JSON.stringify({
    type: "revokeExternalAuth",
    payload: { callback: "externalAuthRevokeToken" },
  })
);

// Android, V1
window.externalApp.revokeExternalAuth(
  JSON.stringify({ callback: "externalAuthRevokeToken" })
);

// iOS and macOS
window.webkit.messageHandlers.revokeExternalAuth.postMessage({
  callback: "externalAuthRevokeToken",
});
```

完成后，应用会调用回调：

```js
window.externalAuthRevokeToken(true);

// 当应用无法退出登录时
window.externalAuthRevokeToken(false);
```

## 回调名称

回调名称 `externalAuthSetToken` 和 `externalAuthRevokeToken` 永远不会改变。应用应检查请求中的回调是否是它所期望的那个，这样伪造的请求就无法让它调用其他内容。

应用和前端之间传递的其他所有内容都通过[外部总线](https://www.hasscn.top/contributors/frontend/reference/external-bus/)进行。
