# Home Assistant Link

> Home Assistant Link 如何让家庭从任何地方都能访问，并将其连接到语音助手，而无需向互联网开放。

Source: https://www.hasscn.top/contributors/architecture/platform/cloud/

Home Assistant Link 是 [Nabu Casa](https://www.hasscn.top/contributors/glossary/nabu-casa/) 提供的一项订阅服务。它解决了从家庭内部难以做到的事情：从任何地方都能访问、与 Amazon Alexa 和 Google Assistant 配合使用，以及为语音提供语音服务。在 [2026 年 10 月](https://www.home-assistant.io/blog/2026/10/02/big-tech-ruined-the-cloud-so-were-renaming-ours/)之前，它被称为 Home Assistant Cloud。在代码中，它仍然是 `cloud` 集成（integration）。

它始终是可选的。它所做的每一件事都可以在没有它的情况下完成，只是需要更多的工作。

## 简而言之

- Core 中的 `cloud` 集成通过 hass-nabucasa 库连接到 Nabu Casa。
- **远程访问**通过 Home Assistant 自行建立的加密隧道进行。家中不开放任何端口。
- **Alexa 和 Google Assistant** 通过云端将它们的命令发送到 Home Assistant。
- **Cloudhooks** 为 [webhooks](https://www.hasscn.top/contributors/architecture/connections/) 提供一个公共 URL，因此伴侣应用（companion apps）可以在离家时正常工作。
- 为[语音](https://www.hasscn.top/contributors/architecture/platform/voice/)提供语音转文字和文字转语音服务，以及异地备份。

## 远程访问，无需敞开大门

通常，从外部访问 Home Assistant 意味着要在路由器上开放端口并管理证书。Home Assistant Link 反其道而行之：Home Assistant 主动连接到云端，并保持该连接打开。来自外部的请求通过它返回。

从用户的浏览器到 Home Assistant 的整个连接都是加密的，使用的是属于该家庭的证书。云端只负责传递流量，但无法读取它。

## 语音助手

Amazon Alexa 和 Google Assistant 需要一个互联网上的服务来进行通信。云端就是那个服务：它接收它们的命令，并通过同一连接将它们传递给 Home Assistant 中的 `alexa` 和 `google_assistant` 集成。用户可以选择将哪些实体（entity）暴露给它们。

## 在代码中

| 内容 | 位置 |
| --- | --- |
| Core 侧 | [`homeassistant/components/cloud/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components/cloud) |
| 库 | [hass-nabucasa](https://pypi.org/project/hass-nabucasa/) |

## 参与贡献

- `cloud` 集成是 Core 的一部分：从[你对 Core 的第一次贡献](https://www.hasscn.top/contributors/core/first-contribution/)开始。
- 云端使 webhooks 可以从外部访问，请参阅[各部分如何通信](https://www.hasscn.top/contributors/architecture/connections/)。
