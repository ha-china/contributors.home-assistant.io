---
title: hacs.json
description: 仓库根目录下 hacs.json 文件中的每个键、HACS 对它的文档说明，以及 Marketplace 如何处理它。
order: 1
---

`hacs.json` 向 Marketplace 和 HACS 描述你的仓库。它位于仓库的根目录，每个仓库都需要一个：Marketplace 在安装每个版本时都会读取它，没有它就无法安装或更新仓库。

```json title="hacs.json"
{
  "name": "My awesome card",
  "filename": "my-awesome-card.js",
  "homeassistant": "2026.11.0"
}
```

## 键

| 键 | 类型 | 作用 |
| --- | --- | --- |
| `name` | string | The name users see. Required by HACS and by the catalog. Without it, the Marketplace shows the `name` from the manifest of an integration, or a name made from your repository name. |
| `content_in_root` | boolean | Your content is in the root of the repository, instead of in `custom_components/<domain>/` or `themes/`. For a dashboard plugin, the file is then only looked for in the root, not in a release or in `dist`, so a [ZIP file](/marketplace/guides/dashboard/#ship-it-as-a-zip-file) is not used either. |
| `filename` | string | The name of the file to install, for a dashboard plugin or a template. With `zip_release`, the name of the ZIP asset. Required for templates. For a dashboard plugin, a release asset with the same name ending in `.zip` instead of `.js` is installed in its place, see [ship it as a ZIP file](/marketplace/guides/dashboard/#ship-it-as-a-zip-file). |
| `zip_release` | boolean | Install from a ZIP file attached to each release, named by `filename`. HACS supports it for integrations only, the Marketplace refuses it for templates. |
| `persistent_directory` | string | A folder inside an integration that is kept across updates, as a path relative to the integration folder. Integrations only. |
| `homeassistant` | string | The minimum Home Assistant version for this release, like `"2026.11.0"`. Add `b0`, like `"2026.11.0b0"`, to allow the betas of that release. Only checked for repositories with releases. |
| `hide_default_branch` | boolean | HACS does not offer the default branch as a version to install. |
| `hacs` | string | The minimum HACS version. The Marketplace reads it, but does not compare it. |
| `country` | string or list | Two-letter country codes ([ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)), for a repository that only works in some countries. The catalog asks for it in that case. The Marketplace does not use it. |

Marketplace 会忽略类型错误的键，并记录一条警告。其他键会被忽略。

## 版本

`homeassistant` 和 `hacs` 中的版本号使用 [AwesomeVersion](https://github.com/ludeeus/awesomeversion) 进行比较，这也是 Home Assistant 使用的同一个库。[AwesomeVersion 演示](https://awesomeversion.ludeeus.dev/)展示了两个版本如何比较。

## 来源

- Marketplace 读取的内容：core 中 `marketplace` 集成的 [`utils/validate.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/marketplace/utils/validate.py) 中的 `REPOSITORY_MANIFEST_VALUES`。
- HACS 文档记录的内容：HACS 发布文档中的 [hacs.json 部分](https://hacs.xyz/docs/publish/start#hacsjson)。
