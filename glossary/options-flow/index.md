# 选项流程（Options flow）

> 在用户界面中更改现有配置条目选项的步骤，例如轮询频率。

Source: https://www.hasscn.top/contributors/glossary/options-flow/

- In code: `OptionsFlow`, `entry.options`
- In the UI: Configure

选项（options）是用户可以随时更改而无需重新设置集成的设置。连接所需的设置（例如主机地址）应属于配置条目（config entry）本身，并通过[重新配置流程](https://www.hasscn.top/contributors/glossary/reconfigure-flow/)进行更改。

## Related terms

- [配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/): 在用户界面中设置集成并创建配置条目的步骤。
- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
- [重新配置流程](https://www.hasscn.top/contributors/glossary/reconfigure-flow/): 一种在不删除并重新添加配置条目的情况下更改其设置（例如主机地址）的流程。
