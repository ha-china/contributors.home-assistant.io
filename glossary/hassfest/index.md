# Hassfest

> Home Assistant Core 中用于验证每个集成的文件（如清单和翻译）并从中生成文件的工具。

Source: https://www.hasscn.top/contributors/glossary/hassfest/

- In code: `script/hassfest`, `python -m script.hassfest`

Hassfest 会检查集成代码周围的文件（如 `manifest.json`、`strings.json`、`services.yaml` 和 `quality_scale.yaml`）是否完整且一致。它还会从这些文件生成其他文件，例如 `CODEOWNERS` 以及 [`homeassistant/generated/`](https://github.com/home-assistant/core/tree/dev/homeassistant/generated) 中的列表。

它在每次针对 Home Assistant Core 的拉取请求（pull request）的 [CI](https://www.hasscn.top/contributors/glossary/ci/) 中运行，你也可以使用 `python -m script.hassfest` 自行运行。自定义集成同样可以使用它，即来自 home-assistant/actions 仓库的 hassfest action。参见 [Linters, hassfest, and CI](https://www.hasscn.top/contributors/core/development/checks/)。

## Related terms

- [清单文件（Manifest）](https://www.hasscn.top/contributors/glossary/manifest/): 集成的 `manifest.json` 文件：其域名、名称、集成负责人、依赖要求，以及如何被发现。
- [翻译键（translation key）](https://www.hasscn.top/contributors/glossary/translation-key/): 指向集成（integration）的 `strings.json` 中某段文本的键，以便该文本可以被翻译。集成使用键，而不是代码中的英文文本。
- [集成质量等级](https://www.hasscn.top/contributors/glossary/quality-scale/): 集成通过遵循代码质量和用户体验规则而获得的等级：铜牌、银牌、金牌和白金。
- [CI](https://www.hasscn.top/contributors/glossary/ci/): 持续集成（continuous integration）：在每次拉取请求（pull request）上运行的自动化检查，例如测试、代码风格检查和类型检查。
