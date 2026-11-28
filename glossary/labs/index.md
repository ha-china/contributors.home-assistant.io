# Home Assistant Labs

> 用户可以在此开启预览功能：这些新功能可以使用，但其设计仍可能根据反馈进行调整。

Source: https://www.hasscn.top/contributors/glossary/labs/

- In code: `labs`, `"preview_features" in manifest.json`
- In the UI: Labs
- Also: Labs, preview feature, preview features

集成在其 manifest 中的 `preview_features` 下声明预览功能。用户可以在 **设置** > **系统** > **Labs** 中找到它们，每个预览功能在用户开启之前都处于关闭状态。

Labs 与 [beta](https://www.hasscn.top/contributors/glossary/beta/) 不同。beta 测试的是下一个版本发布的稳定性，而预览功能本身已经是稳定的，Labs 则是塑造其发展方向的地方。参见 [Labs 预览功能](https://www.hasscn.top/contributors/core/development/labs/)。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
- [Beta](https://www.hasscn.top/contributors/glossary/beta/): 下一个发布版本的测试版本，在正式发布前一周发布，以便在所有人更新之前发现问题。
