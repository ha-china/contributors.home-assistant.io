# 等级

> 铜牌（Bronze）、银牌（Silver）、金牌（Gold）和白金（Platinum）的含义，以及质量等级之外的等级，如 internal 和 legacy。

Source: https://www.hasscn.top/contributors/core/quality-scale/tiers/

质量等级（quality scale）包含四个正式等级：铜牌（Bronze）、银牌（Silver）、金牌（Gold）和白金（Platinum）。每个等级都建立在其下一级的基础之上：要达到某个等级，集成（integration）必须遵循该等级及其以下所有等级的每一项规则。金牌集成遵循所有铜牌、银牌和金牌规则。

除质量等级之外，还有一些适用于不适合纳入其中的集成的等级：核心（core）的内部构建模块、仅支持 YAML 的旧式集成，以及核心之外的集成。

该等级保存在集成 `manifest.json` 文件的 `quality_scale` 键中：

```json
{
  "domain": "my_integration",
  "name": "My integration",
  "quality_scale": "silver"
}
```

Hassfest 接受以下值：`bronze`、`silver`、`gold`、`platinum`、`internal`、`legacy`、`custom` 和 `no_score`。

## 铜牌（Bronze）

铜牌是基线，也是每个新集成的最低要求。铜牌集成：

- 可以通过 UI 进行设置，其配置流程（config flow）会测试连接。
- 遵循基本的编码规范，例如实体（entity）的唯一 ID 和通用的文件布局。
- 为其配置流程提供自动化测试。
- 拥有足以让用户循序渐进地上手的文档。

参见[铜牌规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#bronze)。

## 银牌（Silver）

银牌关乎可靠性。当周围环境不配合时，银牌集成仍能持续运行，或者能够自行恢复。在铜牌的基础上，银牌集成还要：

- 拥有一名或多名活跃的集成负责人（integration owner）。
- 能够自行从连接错误和设备离线中恢复，而不会刷满日志。
- 在凭据失效时自行启动重新认证（reauthentication）。
- 在操作失败时抛出清晰的错误。
- 拥有代码覆盖率超过 95% 的测试。
- 对用户在设置过程和选项中填写的所有内容提供文档说明。

参见[银牌规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#silver)。

## 金牌（Gold）

金牌是集成所能提供的最佳用户体验。在银牌的基础上，金牌集成还要：

- 在设备支持的情况下可被自动发现。
- 在设备支持的情况下，让你可以从 Home Assistant 更新设备的固件或软件。
- 会创建设备，并随设备的接入和移除而添加或删除它们。
- 可以通过 UI 重新配置。
- 拥有经过翻译的实体名称、图标和错误消息。
- 提供诊断功能，并在用户需要采取行动时提出修复（repair）问题。
- 其实体拥有合适的设备类别（device class）和分类（category），并默认禁用会产生大量噪音的实体。
- 为用户提供详尽的文档：支持的设备和功能、示例、使用场景、已知限制以及故障排除。

属于 [Works with Home Assistant](https://www.hasscn.top/contributors/glossary/works-with-home-assistant/) 计划的设备，其集成至少需要达到金牌。

参见[金牌规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#gold)。

## 白金（Platinum）

白金是质量等级的顶端：在最佳用户体验之上追求技术卓越。在金牌的基础上，白金集成还要：

- 完全使用类型注解，并经过严格的类型检查。
- 使用异步（async）库，因此其 I/O 不需要线程。
- 共享 Home Assistant 的 Web 会话，而不是自行开启会话。
- 高效处理数据，保持较低的网络和 CPU 占用。
- 拥有清晰的代码注释，使代码易于维护。

参见[白金规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#platinum)。

## 质量等级之外的等级

### 内部（internal）

`internal` 用于作为 Home Assistant 自身组成部分的集成，例如核心的构建模块，或者供其他集成在其之上构建的平台，如 `sensor` 或 `light`。它们由 Home Assistant 项目维护，并遵循其架构决策。内部集成不参与评级。Hassfest 在 [`script/hassfest/quality_scale.py`](https://github.com/home-assistant/core/blob/dev/script/hassfest/quality_scale.py) 中保存了这些集成的列表，新的内部集成必须添加到其中：如果它没有 `quality_scale.yaml` 文件，则添加到 `NO_QUALITY_SCALE`；如果它仅使用该文件来跟踪规则，则添加到 `INTEGRATIONS_WITHOUT_SCALE`。

### 旧式（legacy）

`legacy` 用于只能通过 YAML 设置的旧式集成，其中一些集成与 Home Assistant 本身一样历史悠久。它们中许多缺少活跃的集成负责人，也无法满足如今对设置和功能的期望。它们仍然可以正常工作，你可以通过添加配置流程和其他铜牌规则，帮助它们达到铜牌。

### 无评分（no_score）

`no_score` 表示该集成尚未根据质量等级进行评级。这并不是对其质量的评判。目前核心中没有任何集成使用它，而且新集成不能在没有评分的情况下起步：它需要达到铜牌。

### 自定义（custom）

`custom` 用于自定义集成：不属于核心、通过手动安装或通过 [Marketplace](https://www.hasscn.top/contributors/marketplace/) 安装的集成。Home Assistant 项目不审查、维护或支持它们。如果你维护一个自定义集成，质量等级的规则仍然是很好的指导，而且当你想将它贡献到核心时，就需要遵循这些规则。

## 等级可能会下降

等级并非永远不变。当集成不再遵循其等级的规则时，它可以被降级。一个常见的原因是失去了最后一名活跃的集成负责人：没有负责人，集成就无法保持银牌或更高等级，即使其代码足以达到白金水平。

规则也会随着 Home Assistant 和最佳实践的发展而随时间变化。当某项规则被添加到某个等级时，处于该等级的集成也需要遵循它。当这种情况发生时，设备属于 Works with Home Assistant 计划的集成仍可保留其等级。
