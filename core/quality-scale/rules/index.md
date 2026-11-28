# 所有规则

> 集成质量标准（integration quality scale）各等级的每一条规则，并附有可复制到你的拉取请求（pull request）中的清单。

Source: https://www.hasscn.top/contributors/core/quality-scale/rules/

质量标准共有 54 条规则：青铜（Bronze）20 条、白银（Silver）10 条、黄金（Gold）21 条、铂金（Platinum）3 条。一个等级需要满足该等级及其以下所有等级的每一条规则。此列表遵循 hassfest 所认定的规则，位于 core 的 [`script/hassfest/quality_scale.py`](https://github.com/home-assistant/core/blob/dev/script/hassfest/quality_scale.py) 中。

## 青铜（Bronze）

core 中每个集成的基准要求。共 20 条规则。

| 规则 | 要求 |
| ---- | ------------ |
| [action-setup](https://www.hasscn.top/contributors/core/quality-scale/action-setup/) | 动作（action）在集成加载时注册，而不是按配置条目（config entry）注册。 |
| [appropriate-polling](https://www.hasscn.top/contributors/core/quality-scale/appropriate-polling/) | 轮询型集成使用适合其数据的轮询间隔。 |
| [brands](https://www.hasscn.top/contributors/core/quality-scale/brands/) | 该集成在[品牌仓库](https://github.com/home-assistant/brands)中有标志和图标。 |
| [common-modules](https://www.hasscn.top/contributors/core/quality-scale/common-modules/) | 协调器（coordinator）位于 coordinator.py 中，基础实体位于 entity.py 中。 |
| [config-flow](https://www.hasscn.top/contributors/core/quality-scale/config-flow/) | 集成通过 UI 设置，并具有清晰明了的配置流程（config flow）。 |
| [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/) | 配置流程具有完整的测试覆盖，包括从错误中恢复。 |
| [dependency-transparency](https://www.hasscn.top/contributors/core/quality-scale/dependency-transparency/) | 依赖项开源、发布在 PyPI 上，并在公共 CI 中构建和发布。 |
| [docs-actions](https://www.hasscn.top/contributors/core/quality-scale/docs-actions/) | 文档描述了集成的动作。 |
| [docs-conditions](https://www.hasscn.top/contributors/core/quality-scale/docs-conditions/) | 文档描述了集成的条件（condition）。 |
| [docs-high-level-description](https://www.hasscn.top/contributors/core/quality-scale/docs-high-level-description/) | 文档描述了该集成连接到什么。 |
| [docs-installation-instructions](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-instructions/) | 文档包含分步设置说明，并列出了前提条件。 |
| [docs-removal-instructions](https://www.hasscn.top/contributors/core/quality-scale/docs-removal-instructions/) | 文档说明了如何移除该集成。 |
| [docs-triggers](https://www.hasscn.top/contributors/core/quality-scale/docs-triggers/) | 文档描述了集成的触发器（trigger）。 |
| [entity-event-setup](https://www.hasscn.top/contributors/core/quality-scale/entity-event-setup/) | 实体在 async_added_to_hass 中订阅，并在被移除时取消订阅。 |
| [entity-unique-id](https://www.hasscn.top/contributors/core/quality-scale/entity-unique-id/) | 每个实体都有唯一 ID，以便用户对其进行自定义。 |
| [has-entity-name](https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/) | 实体将 has_entity_name 设置为 True，并根据其所属设备进行命名。 |
| [runtime-data](https://www.hasscn.top/contributors/core/quality-scale/runtime-data/) | 运行时数据存储在 ConfigEntry.runtime_data 中。 |
| [test-before-configure](https://www.hasscn.top/contributors/core/quality-scale/test-before-configure/) | 配置流程在创建条目之前先测试连接。 |
| [test-before-setup](https://www.hasscn.top/contributors/core/quality-scale/test-before-setup/) | 设置时会检查其是否正常工作，如果不正常则抛出正确的异常。 |
| [unique-config-entry](https://www.hasscn.top/contributors/core/quality-scale/unique-config-entry/) | 同一设备或服务不能被设置两次。 |

## 白银（Silver）

可靠性：错误、离线设备、重新认证（reauthentication）和归属（ownership）。共 10 条规则。

| 规则 | 要求 |
| ---- | ------------ |
| [action-exceptions](https://www.hasscn.top/contributors/core/quality-scale/action-exceptions/) | 动作失败时会抛出 ServiceValidationError 或 HomeAssistantError。 |
| [config-entry-unloading](https://www.hasscn.top/contributors/core/quality-scale/config-entry-unloading/) | 集成可以在不重启的情况下卸载和重新加载。 |
| [docs-configuration-parameters](https://www.hasscn.top/contributors/core/quality-scale/docs-configuration-parameters/) | 文档描述了选项流程（options flow）的每个选项。 |
| [docs-installation-parameters](https://www.hasscn.top/contributors/core/quality-scale/docs-installation-parameters/) | 文档描述了设置过程中要求填写的每个字段。 |
| [entity-unavailable](https://www.hasscn.top/contributors/core/quality-scale/entity-unavailable/) | 当无法连接到设备或服务时，实体变为不可用（unavailable）状态。 |
| [integration-owner](https://www.hasscn.top/contributors/core/quality-scale/integration-owner/) | 该集成至少有一名集成负责人（integration owner）。 |
| [log-when-unavailable](https://www.hasscn.top/contributors/core/quality-scale/log-when-unavailable/) | 集成在连接丢失时记录一次日志，在连接恢复时再记录一次。 |
| [parallel-updates](https://www.hasscn.top/contributors/core/quality-scale/parallel-updates/) | 每个实体平台都设置了 PARALLEL_UPDATES。 |
| [reauthentication-flow](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/) | 用户可以在不移除集成的情况下输入新的凭据。 |
| [test-coverage](https://www.hasscn.top/contributors/core/quality-scale/test-coverage/) | 测试覆盖了集成每个模块 95% 以上的代码。 |

## 黄金（Gold）

最佳的用户体验：发现（discovery）、设备、翻译以及面向用户的文档。共 21 条规则。

| 规则 | 要求 |
| ---- | ------------ |
| [devices](https://www.hasscn.top/contributors/core/quality-scale/devices/) | 实体按设备分组，并具有完整的设备信息。 |
| [diagnostics](https://www.hasscn.top/contributors/core/quality-scale/diagnostics/) | 用户可以下载诊断信息，其中敏感数据已被隐去。 |
| [discovery](https://www.hasscn.top/contributors/core/quality-scale/discovery/) | 设备可被自动发现，用户无需手动查找。 |
| [discovery-update-info](https://www.hasscn.top/contributors/core/quality-scale/discovery-update-info/) | 当已知设备的地址发生变化时，发现功能会更新其地址。 |
| [docs-data-update](https://www.hasscn.top/contributors/core/quality-scale/docs-data-update/) | 文档说明了数据如何更新以及更新频率。 |
| [docs-examples](https://www.hasscn.top/contributors/core/quality-scale/docs-examples/) | 文档提供了自动化（automation）示例或蓝图（blueprint）。 |
| [docs-known-limitations](https://www.hasscn.top/contributors/core/quality-scale/docs-known-limitations/) | 文档列出了已知的限制。 |
| [docs-supported-devices](https://www.hasscn.top/contributors/core/quality-scale/docs-supported-devices/) | 文档列出了已知支持和不受支持的设备。 |
| [docs-supported-functions](https://www.hasscn.top/contributors/core/quality-scale/docs-supported-functions/) | 文档描述了其提供的实体和功能。 |
| [docs-troubleshooting](https://www.hasscn.top/contributors/core/quality-scale/docs-troubleshooting/) | 文档帮助用户自行解决常见问题。 |
| [docs-use-cases](https://www.hasscn.top/contributors/core/quality-scale/docs-use-cases/) | 文档展示了使用该集成可以做什么。 |
| [dynamic-devices](https://www.hasscn.top/contributors/core/quality-scale/dynamic-devices/) | 设置后出现的新设备无需重新加载即可添加。 |
| [entity-category](https://www.hasscn.top/contributors/core/quality-scale/entity-category/) | 配置类和诊断类实体具有实体类别（entity category）。 |
| [entity-device-class](https://www.hasscn.top/contributors/core/quality-scale/entity-device-class/) | 在适用的地方，实体都使用设备类别（device class）。 |
| [entity-disabled-by-default](https://www.hasscn.top/contributors/core/quality-scale/entity-disabled-by-default/) | 只有少数用户才需要的实体默认被禁用。 |
| [entity-translations](https://www.hasscn.top/contributors/core/quality-scale/entity-translations/) | 实体名称来自 strings.json，因此可以被翻译。 |
| [exception-translations](https://www.hasscn.top/contributors/core/quality-scale/exception-translations/) | 向用户显示的错误信息来自 strings.json，因此可以被翻译。 |
| [icon-translations](https://www.hasscn.top/contributors/core/quality-scale/icon-translations/) | 实体图标定义在 icons.json 中。 |
| [reconfiguration-flow](https://www.hasscn.top/contributors/core/quality-scale/reconfiguration-flow/) | 用户可以在不移除条目的情况下更改其设置。 |
| [repair-issues](https://www.hasscn.top/contributors/core/quality-scale/repair-issues/) | 集成会针对用户可以修复的问题提出修复（repair）问题。 |
| [stale-devices](https://www.hasscn.top/contributors/core/quality-scale/stale-devices/) | 已消失的设备会被移除，或者可以由用户手动移除。 |

## 铂金（Platinum）

技术卓越：异步、高效且严格类型化。共 3 条规则。

| 规则 | 要求 |
| ---- | ------------ |
| [async-dependency](https://www.hasscn.top/contributors/core/quality-scale/async-dependency/) | 集成所使用的库使用 asyncio。 |
| [inject-websession](https://www.hasscn.top/contributors/core/quality-scale/inject-websession/) | 该库接受 Home Assistant 的 Web 会话（web session）。 |
| [strict-typing](https://www.hasscn.top/contributors/core/quality-scale/strict-typing/) | 集成完全类型化，并使用严格的 mypy 设置进行检查。 |

## 清单

当你申请提升到新等级时，请将该等级及其以下所有等级的清单复制到你的拉取请求描述中。勾选每一条已完成的规则，在被豁免的规则后面写上 "exempt"，并为每条规则附上相应代码的链接。参见[提升集成的等级](https://www.hasscn.top/contributors/core/quality-scale/raise-tier/)。

```markdown
## Bronze

- [ ] `action-setup`: Register actions in async_setup
- [ ] `appropriate-polling`: Poll at an appropriate interval
- [ ] `brands`: Provide brand assets
- [ ] `common-modules`: Put common patterns in common modules
- [ ] `config-flow`: Set up from the UI with a config flow
  - [ ] Uses `data_description` to give context to fields
  - [ ] Uses `ConfigEntry.data` and `ConfigEntry.options` correctly
- [ ] `config-flow-test-coverage`: Test the config flow fully
- [ ] `dependency-transparency`: Use transparent dependencies
- [ ] `docs-actions`: Document the actions
- [ ] `docs-conditions`: Document the conditions
- [ ] `docs-high-level-description`: Describe the brand, product, or service
- [ ] `docs-installation-instructions`: Document the installation
- [ ] `docs-removal-instructions`: Document how to remove the integration
- [ ] `docs-triggers`: Document the triggers
- [ ] `entity-event-setup`: Subscribe to events in the entity lifecycle
- [ ] `entity-unique-id`: Give entities a unique ID
- [ ] `has-entity-name`: Use has_entity_name
- [ ] `runtime-data`: Store runtime data in runtime_data
- [ ] `test-before-configure`: Test the connection in the config flow
- [ ] `test-before-setup`: Check the connection during setup
- [ ] `unique-config-entry`: Prevent duplicate config entries

## Silver

- [ ] `action-exceptions`: Raise exceptions when actions fail
- [ ] `config-entry-unloading`: Support unloading the config entry
- [ ] `docs-configuration-parameters`: Document the options
- [ ] `docs-installation-parameters`: Document the setup parameters
- [ ] `entity-unavailable`: Mark entities unavailable when appropriate
- [ ] `integration-owner`: Have an integration owner
- [ ] `log-when-unavailable`: Log once when unavailable, and once when back
- [ ] `parallel-updates`: Set the number of parallel updates
- [ ] `reauthentication-flow`: Reauthenticate from the UI
- [ ] `test-coverage`: Test more than 95% of the code

## Gold

- [ ] `devices`: Create devices
- [ ] `diagnostics`: Implement diagnostics
- [ ] `discovery`: Support discovery
- [ ] `discovery-update-info`: Update network information from discovery
- [ ] `docs-data-update`: Document how data is updated
- [ ] `docs-examples`: Document automation examples
- [ ] `docs-known-limitations`: Document known limitations
- [ ] `docs-supported-devices`: Document supported devices
- [ ] `docs-supported-functions`: Document supported functionality
- [ ] `docs-troubleshooting`: Document troubleshooting
- [ ] `docs-use-cases`: Document use cases
- [ ] `dynamic-devices`: Add new devices automatically
- [ ] `entity-category`: Assign entity categories
- [ ] `entity-device-class`: Use device classes
- [ ] `entity-disabled-by-default`: Disable noisy or less popular entities
- [ ] `entity-translations`: Translate entity names
- [ ] `exception-translations`: Translate exception messages
- [ ] `icon-translations`: Use icon translations
- [ ] `reconfiguration-flow`: Reconfigure from the UI
- [ ] `repair-issues`: Raise repair issues when the user needs to act
- [ ] `stale-devices`: Remove stale devices

## Platinum

- [ ] `async-dependency`: Use an async dependency
- [ ] `inject-websession`: Pass in the web session
- [ ] `strict-typing`: Use strict typing
```
