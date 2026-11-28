# hacs.json

> 仓库根目录下 hacs.json 文件中的每个键、HACS 对它的文档说明，以及 Marketplace 如何处理它。

Source: https://www.hasscn.top/contributors/marketplace/reference/hacs-json/

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
| `name` | string | 用户看到的名称。HACS 和目录（catalog）均要求提供。如果没有它，Marketplace 会显示集成清单（manifest）中的 `name`，或根据你的仓库名称生成的名称。 |
| `content_in_root` | boolean | 你的内容位于仓库根目录，而不是在 `custom_components/<domain>/` 或 `themes/` 中。对于仪表盘插件，文件将只在根目录中查找，而不会在发布版本或 `dist` 中查找，因此也不会使用 [ZIP 文件](https://www.hasscn.top/contributors/marketplace/guides/dashboard/#ship-it-as-a-zip-file)。 |
| `filename` | string | 对于仪表盘插件或模板，这是要安装的文件名。使用 `zip_release` 时，这是 ZIP 资产的名称。模板必须提供此键。对于仪表盘插件，如果发布资产中有一个同名但以 `.zip` 结尾的文件，则会安装该文件，参见 [以 ZIP 文件形式发布](https://www.hasscn.top/contributors/marketplace/guides/dashboard/#ship-it-as-a-zip-file)。 |
| `zip_release` | boolean | 从每个发布版本附带的 ZIP 文件中安装，该文件由 `filename` 指定。HACS 仅支持集成使用此选项，Marketplace 拒绝将其用于模板。 |
| `persistent_directory` | string | 集成内部的一个文件夹，在更新时保留，路径相对于集成文件夹。仅适用于集成。 |
| `homeassistant` | string | 此版本所需的最低 Home Assistant 版本，例如 `"2026.11.0"`。添加 `b0`，例如 `"2026.11.0b0"`，以允许该版本的测试版。仅对具有发布版本的仓库进行检查。 |
| `hide_default_branch` | boolean | HACS 不将默认分支作为可安装的版本提供。 |
| `hacs` | string | 最低 HACS 版本。Marketplace 会读取它，但不会进行比较。 |
| `country` | string 或 list | 两位字母的国家代码（[ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)），用于仅在某些国家/地区可用的仓库。在这种情况下，目录会要求提供此信息。Marketplace 不使用它。 |

Marketplace 会忽略类型错误的键，并记录一条警告。其他键会被忽略。

## 版本

`homeassistant` 和 `hacs` 中的版本号使用 [AwesomeVersion](https://github.com/ludeeus/awesomeversion) 进行比较，这也是 Home Assistant 使用的同一个库。[AwesomeVersion 演示](https://awesomeversion.ludeeus.dev/)展示了两个版本如何比较。

## 来源

- Marketplace 读取的内容：core 中 `marketplace` 集成的 [`utils/validate.py`](https://github.com/home-assistant/core/blob/dev/homeassistant/components/marketplace/utils/validate.py) 中的 `REPOSITORY_MANIFEST_VALUES`。
- HACS 文档记录的内容：HACS 发布文档中的 [hacs.json 部分](https://hacs.xyz/docs/publish/start#hacsjson)。
