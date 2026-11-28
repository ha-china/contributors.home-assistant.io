# 集成（Integration）

> 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。

Source: https://www.hasscn.top/contributors/glossary/integration/

- In code: `homeassistant/components/<domain>/`
- Also: integrations
- Formerly: component (old name: don't use it in new text)

Home Assistant Core 几乎全部由集成（integration）组成。有些集成连接 Home Assistant 之外的东西，例如 Philips Hue 或 Z-Wave。另一些则是其他集成使用的构建模块，例如 `light`、`sensor` 或 `automation`。

每个集成都位于以它的[域（domain）](https://www.hasscn.top/contributors/glossary/domain/)命名的独立文件夹中，并在[清单（manifest）](https://www.hasscn.top/contributors/glossary/manifest/)中描述自身。用户大多在 UI 中通过[配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/)添加集成。

代码中有些地方仍在使用旧名称：集成存放在 [`homeassistant/components/`](https://github.com/home-assistant/core/tree/dev/homeassistant/components) 中，一些函数名中包含 component。在文字中，请始终使用 integration（集成）一词。

## Related terms

- [域（Domain）](https://www.hasscn.top/contributors/glossary/domain/): 集成的简短唯一标识符，例如 `hue` 或 `light`。它也是每个实体 ID 的第一部分。
- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
- [平台（Platform）](https://www.hasscn.top/contributors/glossary/platform/): 集成如何提供一种类型的实体，例如 Hue 集成的 `light` 平台。也用于集成平台，即插入另一个集成的文件。
- [自定义集成（custom integration）](https://www.hasscn.top/contributors/glossary/custom-integration/): 不属于 Home Assistant Core 的集成，由用户安装到 `custom_components` 文件夹中。
