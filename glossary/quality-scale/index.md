# 集成质量等级

> 集成通过遵循代码质量和用户体验规则而获得的等级：铜牌、银牌、金牌和白金。

Source: https://www.hasscn.top/contributors/glossary/quality-scale/

- In code: `quality_scale.yaml`, `"quality_scale" in manifest.json`
- Also: quality scale, IQS, Bronze, Silver, Gold, Platinum

每个等级都会增加规则，从铜牌的配置流程和测试，到金牌的翻译错误和修复问题，再到白金的完全类型化、高效的代码。集成在其 `quality_scale.yaml` 中记录它遵循了哪些规则。

新集成需要达到铜牌等级。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [集成所有者](https://www.hasscn.top/contributors/glossary/integration-owner/): 负责某个集成（integration）的个人或团队，列在该集成的清单（manifest）中，会收到其相关问题的通知，并被请求审查其拉取请求（pull request）。
