# 开发工作流

> 代码如何从你的机器进入 Home Assistant 发布版本。包括环境、工具、检查和评审流程。

Source: https://www.hasscn.top/contributors/core/development/

对 Home Assistant Core 的每一项更改都遵循相同的路径。你在开发环境中编写代码，测试和代码检查工具对其进行检查，然后针对 `dev` 分支发起一个拉取请求（pull request），有人对其进行评审，一旦合并，它就会在此之后从 `dev` 分支切出 beta 版的第一个月度发布中发布。

本节介绍这条路径。它适用于 core 中的所有内容，从一行修复到新的集成（integration）。

## 编写代码

- [开发环境](https://www.hasscn.top/contributors/core/development/environment/)：开发容器，或在 Linux、macOS 或 Windows 上的手动安装。
- [代码风格](https://www.hasscn.top/contributors/core/development/style/)：格式化、文档字符串（docstring）、日志记录，以及评审者关注的约定。
- [类型注解](https://www.hasscn.top/contributors/core/development/typing/)：core 如何使用 mypy，以及如何启用严格检查。
- [运行测试](https://www.hasscn.top/contributors/core/development/testing/)：pytest、覆盖率、快照，以及 CI 运行的内容。
- [编写测试](https://www.hasscn.top/contributors/core/development/tests/)：集成的测试如何组织，包括 fixture、mock 和快照。
- [代码检查工具、hassfest 和 CI](https://www.hasscn.top/contributors/core/development/checks/)：在每次提交和每个拉取请求上运行的检查。
- [输入验证](https://www.hasscn.top/contributors/core/development/input-validation/)：用于配置流程、动作和 YAML 的模式（schema）。

## 拉取请求

- [开发清单](https://www.hasscn.top/contributors/core/development/checklist/)：提交前需要检查的内容。
- [提交拉取请求](https://www.hasscn.top/contributors/core/development/submitting/)：分支、提交、模板，以及如何界定你的更改范围。
- [发起拉取请求之后](https://www.hasscn.top/contributors/core/development/review-process/)：接下来会发生什么，以及如何加快速度。
- [保持分支最新](https://www.hasscn.top/contributors/core/development/catching-up/)：引入 `dev` 分支的最新更改。
- [评审拉取请求](https://www.hasscn.top/contributors/core/development/reviewing/)：评审他人工作时应该关注什么。
- [技巧与窍门](https://www.hasscn.top/contributors/core/development/tips/)：让你工作更轻松的小技巧。

## 更改行为

- [弃用](https://www.hasscn.top/contributors/core/development/deprecating/)：如何在不一夜之间破坏用户家庭的情况下移除或更改某些内容。
- [版本控制](https://www.hasscn.top/contributors/core/development/versioning/)：Home Assistant 版本号的构成方式。
- [Labs 预览功能](https://www.hasscn.top/contributors/core/development/labs/)：在功能成为标准之前，发布可供用户选择加入的功能。

## 简要版本

如果你只从本节记住一件事，那就是：保持拉取请求小而精。每个拉取请求只包含一个修复、一个功能或一次重构。小的拉取请求评审更快、更不容易出问题，对包括你自己在内的所有人都更容易。

## All pages in this section

### Write code

- [搭建你的开发环境](https://www.hasscn.top/contributors/core/development/environment/): 通过开发容器或在 Linux、macOS 或 Windows 上手动安装，获得一个可用的 Home Assistant Core 开发环境。
- [代码风格](https://www.hasscn.top/contributors/core/development/style/): Home Assistant Core 中 Python 的风格规则。格式化、docstring、日志、错误处理，以及审查者所关注的约定。
- [类型提示](https://www.hasscn.top/contributors/core/development/typing/): Home Assistant Core 如何使用类型提示和 mypy，以及如何让模块启用严格检查。
- [运行测试](https://www.hasscn.top/contributors/core/development/testing/): 使用 pytest 运行 Home Assistant Core 的测试，检查覆盖率，更新快照，并了解 CI 会运行哪些内容。
- [编写测试](https://www.hasscn.top/contributors/core/development/tests/): 集成的测试是如何组织的，如何通过 Home Assistant 而不是绕过它进行测试，以及如何使用 fixture、mock 和快照。
- [Linter、hassfest 与 CI](https://www.hasscn.top/contributors/core/development/checks/): 每次 commit 和每个针对 Home Assistant Core 的 pull request 都会运行的检查，以及如何自己运行它们。
- [验证输入](https://www.hasscn.top/contributors/core/development/input-validation/): 在配置流程、动作和 YAML 中，使用 probatio 模式（schema）以及 config_validation 中的辅助函数来验证用户提交给集成的数据。

### Pull requests

- [开发检查清单](https://www.hasscn.top/contributors/core/development/checklist/): 在提交之前，请对照此清单检查你的更改，以便你的拉取请求（pull request）可以进入评审。
- [提交拉取请求](https://www.hasscn.top/contributors/core/development/submitting/): Home Assistant Core 拉取请求的特有事项，从分支和提交信息到模板、新集成以及依赖更新。
- [打开拉取请求之后](https://www.hasscn.top/contributors/core/development/review-process/): 打开 Home Assistant Core 的拉取请求后会发生什么，以及你可以做些什么来推动它。
- [保持分支最新](https://www.hasscn.top/contributors/core/development/catching-up/): 将 Home Assistant Core 的 dev 分支的最新更改合并到你的分支，并解决冲突。
- [审查拉取请求](https://www.hasscn.top/contributors/core/development/reviewing/): 关于审查 Home Assistant Core 拉取请求的实用指南。首先检查什么、针对不同类型的变更关注什么，以及如何给出反馈。
- [技巧与窍门](https://www.hasscn.top/contributors/core/development/tips/): 一些让 Home Assistant Core 开发更轻松的小技巧，从堆叠拉取请求（pull request）到在自己的系统上测试更改。

### Changing behavior

- [弃用](https://www.hasscn.top/contributors/core/development/deprecating/): 如何在不一夜之间破坏用户家庭的情况下移除或更改 Home Assistant Core 中的行为。弃用期、修复问题，以及面向开发者 API 的辅助工具。
- [版本管理](https://www.hasscn.top/contributors/core/development/versioning/): Home Assistant Core 的版本是如何构建的，从稳定版到 beta 版、nightly 版和开发版本。
- [Labs 预览功能](https://www.hasscn.top/contributors/core/development/labs/): 发布一个已完成的功能，让用户可以通过 Home Assistant Labs 选择启用，收集反馈，并将其转正为标准功能。
