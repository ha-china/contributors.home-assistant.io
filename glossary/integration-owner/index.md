# 集成所有者

> 负责某个集成（integration）的个人或团队，列在该集成的清单（manifest）中，会收到其相关问题的通知，并被请求审查其拉取请求（pull request）。

Source: https://www.hasscn.top/contributors/glossary/integration-owner/

- In code: `codeowners (manifest)`, `CODEOWNERS`
- Also: integration owners
- Formerly: code owner (old name: don't use it in new text)

集成所有者（integration owner）以 GitHub 用户名的形式列在集成清单（manifest）的 `codeowners` 字段中。Hassfest 会根据这些列表生成 Home Assistant Core 的 `CODEOWNERS` 文件，GitHub 使用该文件来请求他们进行审查。当某个问题（issue）被加上其集成对应的标签时，机器人会提及（mention）他们。

代码中称他们为 code owners：例如 `codeowners` 字段、`CODEOWNERS` 文件，以及像 `by-code-owner` 这样的标签。在关于集成的文字中，请使用“集成所有者”。“代码所有者（code owner）”这一说法仍适用于与集成无关的仓库的 `CODEOWNERS` 文件，例如负责前端部分代码的团队。

## Related terms

- [集成（Integration）](https://www.hasscn.top/contributors/glossary/integration/): 一段代码包，用于将 Home Assistant 连接到设备、服务或协议，或添加自动化等功能。
- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
- [拉取请求（Pull request）](https://www.hasscn.top/contributors/glossary/pull-request/): 在 GitHub 上将更改合并到代码仓库的请求，合并前会先进行审查。
- [维护者（Maintainer）](https://www.hasscn.top/contributors/glossary/maintainer/): 能够批准并合并仓库中拉取请求（pull request）的贡献者。
