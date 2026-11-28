# 配置条目（config entry）

> 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。

Source: https://www.hasscn.top/contributors/glossary/config-entry/

- In code: `ConfigEntry`, `async_setup_entry`, `entry.runtime_data`
- In the UI: Integration entry
- Also: config entries, entry

当用户在 UI 中添加一个集成时，[配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/)会创建一个配置条目。添加第二个网桥会创建同一集成的第二个配置条目。

一个配置条目可以单独被禁用、重新加载和移除。负责设置它的代码是 `async_setup_entry`，而集成在运行时所需的任何内容（例如 API 客户端）都存放在 `entry.runtime_data` 中。

## Related terms

- [配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/): 在用户界面中设置集成并创建配置条目的步骤。
- [配置子条目](https://www.hasscn.top/contributors/glossary/config-subentry/): 配置条目（config entry）的一部分，由用户自行添加和管理，例如连接到 AI 服务的某个集成中的单个 AI 代理。
- [选项流程（Options flow）](https://www.hasscn.top/contributors/glossary/options-flow/): 在用户界面中更改现有配置条目选项的步骤，例如轮询频率。
- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [唯一 ID（Unique ID）](https://www.hasscn.top/contributors/glossary/unique-id/): 集成分配给实体（entity）或配置条目（config entry）的一个 ID，它永远不会改变，因此 Home Assistant 在重启后仍能识别它。
