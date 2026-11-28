# 清单文件（Manifest）

> 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。

Source: https://www.hasscn.top/contributors/glossary/manifest/

- In code: `manifest.json`

Home Assistant 在加载集成的任何代码之前会先读取清单文件（manifest）。它指明了需要先设置哪些其他集成、需要安装哪些 Python 包、该集成是否具有配置流程（config flow），以及它可以在哪些网络或总线上被发现。

清单文件也是设置集成的 [IoT 类别](https://www.hasscn.top/contributors/glossary/iot-class/)和[质量等级](https://www.hasscn.top/contributors/glossary/quality-scale/)的地方。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [依赖要求（Requirement）](https://www.hasscn.top/contributors/glossary/requirement/): 集成所需的来自 PyPI 的 Python 包，在其清单（manifest）中以固定版本列出。
- [集成所有者](https://www.hasscn.top/contributors/glossary/integration-owner/): 负责某个集成（integration）的个人或团队，列在该集成的清单（manifest）中，会收到其相关问题的通知，并被请求审查其拉取请求（pull request）。
- [发现（Discovery）](https://www.hasscn.top/contributors/glossary/discovery/): 查找设备和服务的位置，例如在网络中或通过蓝牙，以便 Home Assistant 可以提供设置它们的选项。
- [IoT class](https://www.hasscn.top/contributors/glossary/iot-class/): 集成（integration）如何获取数据：本地还是云端，轮询还是推送。在 manifest 中设置。
