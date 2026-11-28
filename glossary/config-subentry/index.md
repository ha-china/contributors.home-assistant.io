# 配置子条目

> 配置条目（config entry）的一部分，由用户自行添加和管理，例如连接到 AI 服务的某个集成中的单个 AI 代理。

Source: https://www.hasscn.top/contributors/glossary/config-subentry/

- In code: `ConfigSubentry`, `ConfigSubentryFlow`
- Also: subentry, subentries

子条目（subentry）让一个配置条目可以包含多个共享其连接或凭据的内容。每个子条目都有自己独立的流程来添加和修改。

## Related terms

- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
- [配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/): 在用户界面中设置集成并创建配置条目的步骤。
