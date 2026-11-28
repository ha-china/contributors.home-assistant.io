# 测试覆盖超过 95% 的代码

> Silver 级规则 test-coverage：测试覆盖集成每个模块中超过 95% 的代码。

Source: https://www.hasscn.top/contributors/core/quality-scale/test-coverage/

这是一条 Silver 级规则。在 `quality_scale.yaml` 中，它被称为 `test-coverage`。

集成的测试必须覆盖集成每个模块中超过 95% 的代码。

## 为什么重要

项目中没有人拥有 Home Assistant 支持的所有设备。当有人更改共享代码，或者升级你的集成所使用的库时，测试是唯一能发现哪里出问题的方式。良好的覆盖率可以防止回归（regression），并让新的贡献者即使手头没有设备，也能充满信心地修改集成。

## 示例

带覆盖率运行集成的测试，并查看未被覆盖的行：

```shell
pytest tests/components/my_integration \
  --cov=homeassistant.components.my_integration \
  --cov-report term-missing
```

报告列出了每个模块及其覆盖率，以及没有任何测试运行到的行号。请按照 Home Assistant 使用集成的方式来编写测试：先设置一个配置条目（config entry），然后检查状态并调用动作（action），而不是直接调用集成的函数。有关如何编写这些测试，请参阅[编写测试](https://www.hasscn.top/contributors/core/development/tests/)。

## 如何检查

- CI 在每个拉取请求（pull request）上带覆盖率运行测试，Codecov 会在拉取请求中报告该变更的覆盖率。
- Codecov 要求在某些模块（如 `config_flow.py` 和 `diagnostics.py`）中，每个变更的行都必须被覆盖。
- 集成的每个模块是否都高于 95% 会在代码审查时进行检查。

## 例外

此规则没有例外。

## 相关规则

- [config-flow-test-coverage](https://www.hasscn.top/contributors/core/quality-scale/config-flow-test-coverage/)：完整地测试配置流程。
