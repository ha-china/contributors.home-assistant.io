# 修复（Repair）

> Home Assistant 在“修复”（Repairs）中向用户显示的问题，以及相应的处理方法，例如即将失效的配置。

Source: https://www.hasscn.top/contributors/glossary/repair/

- In code: `ir.async_create_issue`, `repairs.py`
- In the UI: Repairs
- Also: repairs, repair issue, issue registry

集成会在问题注册表（issue registry）中创建修复问题（repair issue），并附带翻译后的说明。有些修复问题还带有为用户自动解决问题的流程。

请勿与 GitHub 上的 issue 混淆。

## Related terms

- [弃用（Deprecation）](https://www.hasscn.top/contributors/glossary/deprecation/): 宣布某项内容将在后续版本中移除，在此之前它仍可正常工作，以便人们有时间进行迁移。
- [翻译键（translation key）](https://www.hasscn.top/contributors/glossary/translation-key/): 指向集成（integration）的 `strings.json` 中某段文本的键，以便该文本可以被翻译。集成使用键，而不是代码中的英文文本。
- [诊断](https://www.hasscn.top/contributors/glossary/diagnostics/): 包含配置条目或设备的数据和状态的下载文件，用户将其附加到 issue 中以帮助调试。
