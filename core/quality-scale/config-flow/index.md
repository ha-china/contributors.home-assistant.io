# 使用配置流程从 UI 进行设置

> 铜级（Bronze）规则 config-flow：集成通过用户界面（UI）进行设置，并带有清晰的配置流程（config flow），将其数据存储在正确的位置。

Source: https://www.hasscn.top/contributors/core/quality-scale/config-flow/

这是一条铜级（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `config-flow`。

本页介绍该规则的要求以及如何进行检查。关于如何逐步构建配置流程，请参阅构建集成文档中的[配置流程](https://www.hasscn.top/contributors/core/integrations/config-flow/)。

集成必须通过用户界面（UI）并使用[配置流程](https://www.hasscn.top/contributors/glossary/config-flow/)进行设置。该流程必须易于理解：为每个字段使用合适的[选择器（selector）](https://www.hasscn.top/contributors/glossary/selector/)，在需要的地方进行验证，并在 `strings.json` 中提供解释每个字段的 `data_description`。将连接所需的信息存储在 `ConfigEntry.data` 中，将与连接无关的设置存储在 `ConfigEntry.options` 中。

## 为什么重要

自 2018 年以来，配置流程一直是设置集成的标准方式。它为每个集成提供相同的设置体验，引导用户完成各个步骤，并且意味着任何人无需编辑 YAML 即可开始使用。配置流程是用户对您的集成的第一印象，因此它应该清晰而友好。

将连接数据与选项分开存放，使用户以后可以在选项流程（options flow）中更改选项，而无需触及连接设置。

## 示例

在 `manifest.json` 中将 `config_flow` 设置为 `true`，并添加一个包含继承自 `ConfigFlow` 的类的 `config_flow.py`。[配置流程](https://www.hasscn.top/contributors/core/integrations/config-flow/#add-a-config-flow)展示了一个完整的示例，[教程](https://www.hasscn.top/contributors/core/integrations/tutorial/#4-build-the-config-flow)则从脚手架开始构建一个配置流程。

表单的文本位于 `strings.json` 中。为每个字段在 `data` 中提供一个标签，并在 `data_description` 中提供说明：

```json
{
  "config": {
    "step": {
      "user": {
        "data": {
          "host": "[%key:common::config_flow::data::host%]"
        },
        "data_description": {
          "host": "The hostname or IP address of your device."
        }
      }
    }
  }
}
```

真实的配置流程还会测试连接并防止重复。这些是独立的规则：[test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/) 和 [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/)。

## 如何进行检查

- Hassfest，当规则为 `done` 时：`manifest.json` 中的 `config_flow` 必须为 `true`，并且 `config_flow.py` 必须存在。
- 当配置流程要求输入名称（`home-assistant-config-flow-name-field`）或轮询间隔（`home-assistant-config-flow-polling-field`）时，Pylint 会发出警告。名称应来自设备，而轮询间隔由集成自行决定。
- 当配置流程、选项流程或子条目（subentry）流程的字段在 `strings.json` 中没有翻译时，Pylint 会发出警告（`home-assistant-config-flow-field-not-translated` 及其相关规则）。
- 选择器的使用、`data_description`，以及 `data` 与 `options` 的区分，将在代码审查（review）中检查。

## 例外

被 [ADR-0010](https://github.com/home-assistant/architecture/blob/master/adr/0010-integration-configuration.md) 豁免于 UI 设置的集成可豁免此规则。

## 相关规则

- [test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/)：在配置流程中测试连接。
- [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/)：防止重复的配置条目。
- [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)：全面测试配置流程。
- [discovery](https://www.hasscn.top/contributors/core/quality-scale/discovery/)：支持发现（discovery）。
- [reauthentication-flow](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/)：从 UI 重新进行身份验证。
- [reconfiguration-flow](https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/)：从 UI 重新配置。
