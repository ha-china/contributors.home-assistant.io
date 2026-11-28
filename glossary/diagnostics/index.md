# 诊断

> 包含配置条目或设备的数据和状态的下载文件，用户将其附加到 issue 中以帮助调试。

Source: https://www.hasscn.top/contributors/glossary/diagnostics/

- In code: `diagnostics.py`, `async_redact_data`
- In the UI: Download diagnostics

集成通过 `diagnostics.py` 平台提供诊断信息。密码、令牌、位置和其他隐私数据必须使用 `async_redact_data` 从中移除。

## Related terms

- [平台（Platform）](https://www.hasscn.top/contributors/glossary/platform/): 集成如何提供一种类型的实体，例如 Hue 集成的 `light` 平台。也用于集成平台，即插入另一个集成的文件。
- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
- [修复（Repair）](https://www.hasscn.top/contributors/glossary/repair/): Home Assistant 在“修复”（Repairs）中向用户显示的问题，以及相应的处理方法，例如即将失效的配置。
