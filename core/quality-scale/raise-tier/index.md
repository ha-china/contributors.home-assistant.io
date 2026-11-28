# 提升集成的等级

> 一次攻克一条规则，逐步提升质量标准，并让新等级经过审核后发布。

Source: https://www.hasscn.top/contributors/core/quality-scale/raise-tier/

将集成（integration）在质量标准（quality scale）上向上提升，是你在 core 中能做的最有用的事情之一。它让每一位使用该集成的人都受益，而你也会在此过程中学到很多关于 Home Assistant 的知识。这项工作也很适合拆分进行：一条规则往往就是一个小型拉取请求（pull request）。

## 开始之前

- 确认该集成的所有者是谁。其 `manifest.json` 中的 `codeowners` 就是你要沟通的人。在着手大的改动之前，先在 issue 或 [Discord](https://www.home-assistant.io/join-chat/) 上提及他们，以免与正在进行的工作发生冲突。
- 阅读它的 `quality_scale.yaml`。它会告诉你哪些规则已完成（done）、哪些是 `todo`、哪些已豁免（exempt）。
- 还没有 `quality_scale.yaml`？那么该集成低于 Bronze 等级，或者它早于该文件出现。请先添加该文件，并为每条规则如实填写状态。可以从 core 中的 [`script/scaffold/templates/integration/integration/quality_scale.yaml`](https://github.com/home-assistant/core/blob/dev/script/scaffold/templates/integration/integration/quality_scale.yaml) 复制模板。

## 逐步提升

1. 在尚未完成的最低等级中，挑选一条状态为 `todo` 的规则。先完成 Bronze 规则，再完成 Silver 规则，因为一个等级要求其下方的所有规则都已完成。
2. 阅读规则页面。它解释了该规则的要求，其中的“Exceptions（例外）”部分会告诉你该规则是否可能不适用。
3. 实现该规则，并附带测试。在可能的情况下，让拉取请求只针对这一条规则。小型拉取请求能更快地通过审核。
4. 在同一个拉取请求中，将该规则在 `quality_scale.yaml` 中设置为 `done`。如果该规则不适用，则将其设置为 `exempt` 并附上说明。
5. 在推送之前，运行 hassfest 和该集成的测试。参见[自行检查](https://www.hasscn.top/contributors/core/quality-scale/raise-tier/#check-it-yourself)。

重复上述步骤，直到该等级的每条规则都为 `done` 或 `exempt`。你不必等到等级变更才逐条合并：每个拉取请求都会让集成变得更好，而这个文件会展示进度。

> [!TIP]
> 有些规则相互依赖。[dynamic-devices](https://www.hasscn.top/contributors/core/quality-scale/dynamic-devices/) 和 [stale-devices](https://www.hasscn.top/contributors/core/quality-scale/stale-devices/) 需要 [devices](https://www.hasscn.top/contributors/core/quality-scale/devices/)；[reauthentication-flow](https://www.hasscn.top/contributors/core/quality-scale/reauthentication-flow/) 需要 [test-before-setup](https://www.hasscn.top/contributors/core/quality-scale/test-before-setup/) 来抛出 `ConfigEntryAuthFailed`；Gold 等级的翻译规则建立在 [has-entity-name](https://www.hasscn.top/contributors/core/quality-scale/has-entity-name/) 之上。每条规则页面底部的“Related rules（相关规则）”部分指出了这些关联。

## 自行检查

仅凭阅读代码不足以确认一条规则已达成。许多规则带有 CI 会强制执行的阈值或校验器，因此请运行这些工具并阅读其结果。以下步骤遵循 [core 仓库](https://github.com/home-assistant/core)中的 `ha-quality-scale-verify` 技能（[`.claude/skills/ha-quality-scale-verify/SKILL.md`](https://github.com/home-assistant/core/blob/dev/.claude/skills/ha-quality-scale-verify/SKILL.md)），其中描述了如何验证一条规则。

请使用你的改动所锁定的版本：来自 `requirements_test_pre_commit.txt` 的 `ruff`、来自 `requirements_test.txt` 的 `syrupy`，以及来自 `manifest.json` 的库。版本不一致会导致误报通过和误报失败。

### Hassfest

使用以下命令验证单个集成：

```shell
python3 -m script.hassfest --integration-path homeassistant/components/example
```

它会检查 `quality_scale.yaml`，以及带有校验器的规则，例如 `config-flow`、`runtime-data`、`test-before-setup`、`unique-config-entry`、`discovery`、`reconfiguration-flow` 和 `strict-typing`。有两点需要了解：

- 校验器只对标记为 `done` 的规则运行。一次干净的运行并不能说明 `todo` 或 `exempt` 规则的任何情况：这些需要你自己检查。
- `--integration-path` 只运行检查单个集成的插件。针对整个仓库的检查会被跳过，例如 `mypy_config`，还有只在完整执行 `python3 -m script.hassfest` 时才运行的品牌元数据检查。

### 严格类型检查

对于 [strict-typing](https://www.hasscn.top/contributors/core/quality-scale/strict-typing/)，该集成必须列在 `.strict-typing` 中，否则 mypy 会在没有严格设置的情况下运行，并因错误的原因而通过。请对该集成运行 mypy，并检查 `mypy.ini` 是否保持同步，且不要重新生成它：

```shell
python3 -m script.hassfest -p mypy_config --action validate
```

如果不带 `--action validate`，hassfest 会重新生成该文件，从而掩盖它已过期的事实。

### 测试覆盖率

在测量覆盖率之前，请先重新生成英文翻译。测试读取的是生成出的 `translations/en.json`，而不是 `strings.json`：

```shell
python3 -m script.translations develop --integration example
pytest tests/components/example \
  --cov=homeassistant.components.example \
  --cov-report term-missing
```

对于 [test-coverage](https://www.hasscn.top/contributors/core/quality-scale/test-coverage/)，每个模块都必须高于 95%，而不是集成的平均值。请查看精确数字：四舍五入后的 95% 可能实际是 94.7%。

### 配置流测试

对于 [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)，仅有 `config_flow.py` 的 100% 行覆盖率还不够。验证技能还会检查以下内容：

- 每个流程都沿其错误路径进行了测试并达到正确的最终结果：用户、发现（discovery）和导入（import）流程应创建条目（`CREATE_ENTRY`）；重新认证和重新配置流程应以 `reauth_successful` 或 `reconfigure_successful` 中止。
- 有测试验证重复项会被拒绝：第二次设置同一设备或账户必须以中止结束，例如 `already_configured` 或 `single_instance_allowed`。
- 选项流程（options flow），它们同样位于 `config_flow.py` 中。

### 工具不检查的内容

- **brands**：hassfest 不会检查图标和 logo。它们存放在 [brands 仓库](https://github.com/home-assistant/brands)中：请在那里检查，或在你提交给该仓库的拉取请求中检查。
- **文档规则**：检查各章节是否存在于 [home-assistant.io](https://www.home-assistant.io/) 的集成页面中，或在你随改动一同提交的文档拉取请求中。

## 申请新等级

当下一个等级的每条规则都为 `done` 或 `exempt` 时，请创建一个拉取请求，修改该集成 `manifest.json` 中的 `quality_scale`。

1. 修改等级，例如从 `"bronze"` 改为 `"silver"`。
2. 在拉取请求的描述中，添加 [所有规则](https://www.hasscn.top/contributors/core/quality-scale/rules/#checklist) 中针对新等级及其下方每个等级的清单。勾选每条已完成的规则，并将豁免的规则标记为豁免。
3. 为每条规则链接到实现它的代码，或说明豁免原因。这正是让审核快速进行的关键：审核者无需自行查找。

当该等级中有规则不为 `done` 或 `exempt` 时，hassfest 会使拉取请求失败，因此你能在早期发现遗漏之处。

### 审核

审核者会逐条过一遍清单，并检查工具无法检查的部分。请预期会有提问，尤其是关于豁免的问题。一旦 core 团队的成员批准并合并了拉取请求，新等级就会随下一个主要版本发布。

你无需为文档单独创建拉取请求。home-assistant.io 集成页面上的等级会在发布时从 manifest 更新。

## 保持等级

达到某个等级之后仍需用心维护。当你修改一个集成时，要保持其规则：为新代码添加测试，为新字符串添加翻译，并在有变化时更新 `quality_scale.yaml`。多个 pylint 检查和一个自动化审核工具会将拉取请求与集成所声明的规则进行比对，因此破坏规则的改动通常会被及早发现。关于会检查哪些内容，请参见[质量标准文件](https://www.hasscn.top/contributors/core/quality-scale/quality-scale-file/)。

集成也可能失去其等级，例如当它失去最后一位活跃的集成所有者时。参见[等级可能会下降](https://www.hasscn.top/contributors/core/quality-scale/tiers/#a-tier-can-go-down)。
