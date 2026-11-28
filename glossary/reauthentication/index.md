# 重新认证（Reauthentication）

> 当配置项（config entry）无法再登录时，要求用户提供新凭据的流程，无需重新设置。

Source: https://www.hasscn.top/contributors/glossary/reauthentication/

- In code: `async_step_reauth`, `ConfigEntryAuthFailed`
- Also: reauth

当密码更改或令牌过期时，集成（integration）会抛出 `ConfigEntryAuthFailed`。随后 Home Assistant 会要求用户重新登录，并保持配置项（config entry）的其他所有内容不变。

## Related terms

- [配置流程（config flow）](https://www.hasscn.top/contributors/glossary/config-flow/): 在用户界面中设置集成并创建配置条目的步骤。
- [配置条目（config entry）](https://www.hasscn.top/contributors/glossary/config-entry/): 一个集成（integration）的一次设置实例，例如一个 Hue 网桥，以及 Home Assistant 为其存储的配置。
