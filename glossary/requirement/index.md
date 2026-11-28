# 依赖要求（Requirement）

> 集成所需的来自 PyPI 的 Python 包，在其清单（manifest）中以固定版本列出。

Source: https://www.hasscn.top/contributors/glossary/requirement/

- In code: `"requirements" in manifest.json`
- Also: requirements, dependency

与特定设备或服务通信的代码应放在 PyPI 上的库中，而不是放在集成（integration）里。集成将该库列为依赖要求（requirement），Home Assistant 会在需要时安装它。

依赖要求被固定到确切的版本，因此每次安装运行的代码都是相同的。

## Related terms

- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
