# 重新配置流程

> 一种在不删除并重新添加配置条目的情况下更改其设置（例如主机地址）的流程。

Source: https://www.hasscn.top/contributors/glossary/reconfigure-flow/

- In code: `async_step_reconfigure`
- In the UI: Reconfigure
- Also: reconfigure

删除并重新添加配置条目（config entry）会丢失用户为其实体（entity）和设备（device）设置的名称、区域（area）及其他设置。重新配置流程（reconfigure flow）则可以保留这些设置。

## Related terms

- [配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/): 在用户界面中设置集成并创建配置条目的步骤。
- [选项流程（Options flow）](https://www.hasscn.top/contributors/glossary/options-flow/): 在用户界面中更改现有配置条目选项的步骤，例如轮询频率。
- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
