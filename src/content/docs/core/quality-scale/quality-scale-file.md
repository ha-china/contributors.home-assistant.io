---
title: 质量分级文件
description: quality_scale.yaml 的格式，以及确保集成如实对待其各项规则的 hassfest、pylint 和评审检查。
sidebarLabel: Quality scale file
order: -2
---

每个已定级（tier）的集成都会在其 `manifest.json` 旁边保留一个 `quality_scale.yaml` 文件。该文件列出了质量分级（quality scale）的每一条规则及其状态。它是集成的进度报告：哪些已完成，哪些尚待完成，以及哪些规则不适用及其原因。

## 格式

该文件只有一个键 `rules`，分级的每一条规则都列在其下。规则要么是一个简单的状态，要么是一个包含 `status` 和 `comment` 的映射：

```yaml
rules:
  # Bronze
  action-setup:
    status: exempt
    comment: This integration does not provide actions.
  appropriate-polling: done
  brands: done
  config-flow: done
  test-before-setup:
    status: todo
    comment: Setup does not catch authentication errors yet.
```

共有三种状态：

- `done`：集成遵循该规则。
- `todo`：集成尚未遵循。注释是可选的，是解释还缺少什么的好地方。
- `exempt`：该规则不适用。必须提供 `comment`，且必须说明原因。

规则名称必须与规则页面上显示的完全一致，使用连字符，例如 `config-flow-test-coverage`。文件必须列出分级的_每一条_规则，也包括高于当前级别的各级别规则。Hassfest 会拒绝缺少规则或包含未知规则的文件。

最简单的入门方式是使用脚手架（scaffold）脚本为新集成创建的模板：每条规则都设为 `todo`，并按级别分组。你可以在 core 仓库的 `script/scaffold/templates/integration/integration/quality_scale.yaml` 找到它，或者运行 `python3 -m script.scaffold integration` 来用它创建一个新集成。

### 豁免

豁免也是一种声明，就像 `done` 一样。每个规则页面都有一个“Exceptions”（例外）章节，列出了规则不适用的情形。请严格遵守这些情形。如果你认为你的集成因其他原因不适用某条规则，请在注释和拉取请求（pull request）中说明，并做好评审者会就此提问的准备。

好的注释是具体的：“该设备没有身份验证”比“不适用”更好。

## hassfest 检查的内容

[Hassfest](/core/development/checks/) 在 CI 中对每个拉取请求运行，你也可以在本地使用 `python3 -m script.hassfest` 运行它。对于质量分级，它会检查：

- core 中的集成是否拥有 `quality_scale.yaml` 文件。新集成必须达到铜级（Bronze），因此当文件缺失时 hassfest 会检查失败。没有该文件的旧集成被列在 `script/hassfest/quality_scale.py` 中，而且这个列表只会越来越短。
- 文件是否符合上述格式，包含每条规则且状态有效。
- `manifest.json` 中所定级别及其以下各级别的每条规则是否为 `done` 或 `exempt`。当某条规则不满足时，hassfest 会列出缺失的规则。
- 银级（Silver）及更高级别的集成在 `manifest.json` 中是否至少有一位集成负责人（integration owner）。
- 虚拟集成以及被列为无质量分级的内部集成是否没有该文件。

除此之外，当某些规则被标记为 `done` 时，hassfest 还会在代码中验证它们：

| 规则 | hassfest 查找的内容 |
| ---- | ----------------------- |
| [config-flow](/core/quality-scale/config-flow/) | 清单（manifest）中的 `config_flow: true`，以及一个 `config_flow.py` |
| [discovery](/core/quality-scale/discovery/) | 清单中的 discovery 键，或配置流程中的 discovery 步骤 |
| [reconfiguration-flow](/core/quality-scale/reconfiguration-flow/) | 配置流程中的 `async_step_reconfigure` |
| [runtime-data](/core/quality-scale/runtime-data/) | `async_setup_entry` 会为 `entry.runtime_data` 赋值。当 `strict-typing` 也被标记为 `done` 时，各 entry 函数还会使用类型化的配置条目，例如 `MyConfigEntry` |
| [strict-typing](/core/quality-scale/strict-typing/) | 集成被列在 `.strict-typing` 中，且其 requirements 带有类型标注 |
| [test-before-setup](/core/quality-scale/test-before-setup/) | 集成的某个模块会抛出 `ConfigEntryNotReady`、`ConfigEntryAuthFailed` 或 `ConfigEntryError`，或者 `async_setup_entry` 会等待 `async_config_entry_first_refresh` 或 `async_ensure_token_valid`（这两个函数会替你抛出这些异常） |
| [unique-config-entry](/core/quality-scale/unique-config-entry/) | 清单中的 `single_config_entry: true`，或调用了 `_async_abort_entries_match` 的配置流程，或同时使用了 `async_set_unique_id` 和 `_abort_if_unique_id_configured` |

当此类检查失败时，错误信息会用方括号标明规则名称，例如 `[runtime-data]`，并链接到其文档。

## pylint 检查的内容

Core has its own pylint plugin, in `packages/pylint-home-assistant/` of the [core repository](https://github.com/home-assistant/core). Some of its checks only run for integrations that mark a rule as `done`. This keeps a claim honest after it was made, also when other people change the code later:

| 规则 | 检查 |
| ---- | ----- |
| [config-entry-unloading](/core/quality-scale/config-entry-unloading/) | `home-assistant-missing-config-entry-unloading` |
| [diagnostics](/core/quality-scale/diagnostics/) | `home-assistant-missing-diagnostics` |
| [entity-unique-id](/core/quality-scale/entity-unique-id/) | `home-assistant-missing-entity-unique-id`、`home-assistant-entity-unique-id-static` |
| [exception-translations](/core/quality-scale/exception-translations/) | `home-assistant-exception-not-translated` |
| [has-entity-name](/core/quality-scale/has-entity-name/) | `home-assistant-missing-has-entity-name` |
| [parallel-updates](/core/quality-scale/parallel-updates/) | `home-assistant-missing-parallel-updates` |
| [reauthentication-flow](/core/quality-scale/reauthentication-flow/) | `home-assistant-missing-reauthentication-flow` |
| [test-before-configure](/core/quality-scale/test-before-configure/) | `home-assistant-missing-test-before-configure` |

Other checks of the plugin run for every integration, and many of them enforce a rule too, like `home-assistant-use-runtime-data` or `home-assistant-service-registered-in-setup-entry`. The rule pages list them under "How it is checked". The [pylint plugin README](https://github.com/home-assistant/core/blob/dev/packages/pylint-home-assistant/README.md) describes every check.

## 评审检查的内容

大多数规则无法通过工具检查。轮询间隔是否合适？文档是否解释了用例？这些要由人来判断。

- 自动评审者会在涉及带有 `quality_scale.yaml` 的集成的拉取请求上运行。它会根据集成标记为 `done` 或 `exempt` 的规则来检查变更，并在违反规则的行上留下评审评论。像对待其他评审评论一样对待它：它可能是错的，但通常有它的道理。
- 评审者会检查工具无法检查的规则。当你申请提升到新级别时，他们会逐条审查每条规则。参见[提升集成的级别](/core/quality-scale/raise-tier/)。
