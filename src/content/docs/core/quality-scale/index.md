---
title: 集成质量等级
description: 描述集成好坏程度的等级与规则：集成如何获得某个等级，以及如何提升等级。
order: 30
sidebarGroups:
  - Bronze
  - Silver
  - Gold
  - Platinum
---

Home Assistant 拥有由数千人编写的数千个集成（integration）。集成质量等级（quality scale）是本项目用一个词描述每个集成好坏程度的方式：铜牌（Bronze）、银牌（Silver）、金牌（Gold）或铂金（Platinum）。每个等级（tier）都是一组具体的规则，集成只有遵循该等级及其以下所有等级的每一条规则，才能获得该等级。

> [!TIP]
> 正在开发集成？请从[所有规则](/core/quality-scale/rules/)开始：每个等级的所有规则都在一页上，每条规则用一行文字说明其要求，并附有可复制到拉取请求（pull request）中的清单。

## 为什么要有质量等级

对用户来说，等级是一种承诺。他们会在文档中的集成页面以及 **设置** > **设备与服务** 中看到它。铜牌集成可通过 UI 设置，并且有测试。金牌集成可通过网络发现、可重新配置，拥有经过翻译的名称和错误信息，并附带说明哪些设备可正常使用的文档。用户会据此选择设备，因此等级必须真实可信。

对于作为贡献者的你来说，这套等级标准是“完成”的统一定义。这里有的是成文的规则及其背后的理由，而不是审查者的个人偏好。在打开拉取请求之前，你就知道别人期望什么；当你想改进某个集成时，也知道接下来该做什么。

对于维护者和审查者来说，它让数千个集成保持一致。声称满足某条规则的集成会被对照该规则进行检查（部分由工具完成），这样当代码库向前发展时，这些声明才是可信的。

## 工作原理

- 集成的等级是其 `manifest.json` 中的 `quality_scale` 键。许多较旧的集成从未被评级，因此还没有等级。新集成则必须有一个等级。
- 有等级的集成还会有一个 `quality_scale.yaml` 文件。它列出每条规则及其状态：`done`、`todo`，或附带原因的 `exempt`。
- Hassfest（core 的验证脚本）会检查该文件。当该等级所需的某条规则既不是 `done` 也不是 `exempt` 时，检查会失败；此外，它还会对某些标记为 `done` 的规则运行额外检查。
- 审查者检查其余部分，然后由核心团队成员批准新等级。

新集成必须达到铜牌。低于铜牌的集成无法进入 core。

## 从这里开始

1. [等级](/core/quality-scale/tiers/)：铜牌、银牌、金牌和铂金的含义，以及等级标准之外的等级，例如 internal（内部）和 legacy（遗留）。
2. [所有规则](/core/quality-scale/rules/)：按等级将所有规则列在一页上，并附有可复制到拉取请求中的清单。在这里你可以找到该做什么。
3. [提升集成的等级](/core/quality-scale/raise-tier/)：如何逐步提升等级、如何检查你的工作，以及如何让新等级接受审查。
4. [质量等级文件](/core/quality-scale/quality-scale-file/)：`quality_scale.yaml` 的格式，以及检查该文件的所有机制。

正在构建新集成？它需要满足每一条[铜牌规则](/core/quality-scale/rules/#bronze)。[教程](/core/integrations/tutorial/)构建的集成就满足这些规则。

## 规则

每条规则都有自己的页面。[所有规则](/core/quality-scale/rules/)按等级列出它们，并附上各自的链接。每个页面都会解释该规则要求什么、为什么、如何实现、如何检查，以及何时不适用。规则页面使用与 `quality_scale.yaml` 中相同的名称，因此 `/core/quality-scale/entity-unique-id/` 就是 `entity-unique-id` 规则的页面。

### 铜牌（Bronze）

基础要求：可通过 UI 设置、经过测试的配置流程（config flow）、唯一 ID 以及基本文档。从 [config-flow](/core/quality-scale/config-flow/) 开始，或查看[全部 20 条铜牌规则](/core/quality-scale/rules/#bronze)。

### 银牌（Silver）

可靠性：处理错误和离线设备、支持重新认证、拥有集成负责人（integration owner），以及超过 95% 的测试覆盖率。从 [integration-owner](/core/quality-scale/integration-owner/) 开始，或查看[全部 10 条银牌规则](/core/quality-scale/rules/#silver)。

### 金牌（Gold）

最佳用户体验：发现（discovery）、设备、翻译、诊断、修复，以及面向用户的完整文档。从 [devices](/core/quality-scale/devices/) 开始，或查看[全部 21 条金牌规则](/core/quality-scale/rules/#gold)。

### 铂金（Platinum）

技术卓越：异步依赖、共享的 Web 会话以及严格类型检查（strict typing）。从 [strict-typing](/core/quality-scale/strict-typing/) 开始，或查看[全部 3 条铂金规则](/core/quality-scale/rules/#platinum)。


## 相关页面

- [构建集成](/core/integrations/)：集成如何工作，以及它们由哪些文件组成。
- [编写测试](/core/development/tests/)：多条规则所要求的测试。
- [编写集成文档](/writing/guides/integration/)：文档类规则针对的是 [home-assistant.io](https://www.home-assistant.io/) 上的集成页面。
- [让你的字符串可翻译](/translate/guides/developers/)：对应翻译相关的规则。

## 与谁交流

- Ask about a rule, or whether an exemption is reasonable, in a thread in **#coding-support** on the [Home Assistant Discord](https://www.home-assistant.io/join-chat/).
- The integration owners of an integration, listed as `codeowners` in its `manifest.json`, know best where it stands. Mention them in your pull request.
- Ideas to change a rule, or to add one, belong in the [architecture discussions](https://github.com/home-assistant/architecture/discussions).
