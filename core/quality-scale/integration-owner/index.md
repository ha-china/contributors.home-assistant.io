# 拥有集成负责人

> 银级（Silver）规则 integration-owner：该集成至少拥有一位集成负责人。

Source: https://www.hasscn.top/contributors/core/quality-scale/integration-owner/

这是一条银级（Silver）规则。在 `quality_scale.yaml` 中，它被称为 `integration-owner`。

集成必须至少有一位[集成负责人](https://www.hasscn.top/contributors/glossary/integration-owner/)（integration owner），列在其 `manifest.json` 的 `codeowners` 字段中。一个集成可以有多位负责人。

## 为什么这很重要

大多数集成是由核心团队之外的人编写的，他们对相关设备或服务的了解远超其他人。集成负责人会长期照看集成。每当该集成出现新的 issue 或 pull request 时，他们都会收到通知；在如何处理这些 issue 和 pull request 方面，他们有更大的话语权；而且审查者将他们视为专家：他们对于某项更改的意见更有分量。

有负责人的集成会得到更好的维护。这正是从 Silver 及以上的每个等级都需要一位负责人的原因，也是为什么没有活跃负责人的集成可以被降级为 Bronze（铜级），即使它满足更高等级的所有其他规则。

## 示例

将你的 GitHub 用户名（带 `@`）添加到清单中：

```json
{
  "domain": "my_integration",
  "name": "My integration",
  "codeowners": ["@my-github-username"]
}
```

然后运行 `python3 -m script.hassfest` 来更新仓库的 `CODEOWNERS` 文件，并提交这两个文件。

要成为某个现有集成的负责人，请提交一个 pull request，将你添加到该集成的 `codeowners` 中。如果事先曾为该集成做出过贡献，会有所帮助。

## 如何检查

- 当清单中标记为 Silver、Gold 或 Platinum 等级的集成没有集成负责人时，Hassfest 会报错。
- Hassfest 还会检查 `CODEOWNERS` 文件是否与各清单一致。
- 负责人是否仍然活跃，会在审查过程中进行检查。

## 例外情况

此规则没有例外。
