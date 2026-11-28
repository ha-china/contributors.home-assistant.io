# 配置流程（config flow）

> 在用户界面中设置集成并创建配置条目的步骤。

Source: https://www.hasscn.top/contributors/glossary/config-flow/

- In code: `ConfigFlow`, `config_flow.py`, `async_step_user`
- Also: config flows

配置流程（config flow）会向用户询问所需的信息，例如主机地址和密码，然后进行检查并创建[配置条目](https://www.hasscn.top/contributors/glossary/config-entry/)。它会设置一个[唯一 ID](https://www.hasscn.top/contributors/glossary/unique-id/)，因此同一台设备不会被添加两次。

当设备被[发现](https://www.hasscn.top/contributors/glossary/discovery/)时，配置流程也可以自行启动。此时用户只需确认即可。

连接到设备或服务的新集成应通过配置流程进行设置，而不是通过 YAML。

## Related terms

- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
- [选项流程（Options flow）](https://www.hasscn.top/contributors/glossary/options-flow/): 在用户界面中更改现有配置条目选项的步骤，例如轮询频率。
- [重新认证（Reauthentication）](https://www.hasscn.top/contributors/glossary/reauthentication/): 当配置项（config entry）无法再登录时，要求用户提供新凭据的流程，无需重新设置。
- [重新配置流程](https://www.hasscn.top/contributors/glossary/reconfigure-flow/): 一种在不删除并重新添加配置条目的情况下更改其设置（例如主机地址）的流程。
- [发现（Discovery）](https://www.hasscn.top/contributors/glossary/discovery/): 查找设备和服务的位置，例如在网络中或通过蓝牙，以便 Home Assistant 可以提供设置它们的选项。
