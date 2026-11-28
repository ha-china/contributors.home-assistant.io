# 申请新语言

> 你的语言还没有被支持？这里介绍如何申请添加。

Source: https://www.hasscn.top/contributors/translate/guides/new-language/

如果你的语言不在列表中，你可以申请添加。一旦添加完成，它就会出现在 Lokalise 中，任何人都可以开始翻译。

## 提出申请

在前端仓库的[本地化分类](https://github.com/home-assistant/frontend/discussions/categories/localization)中发起一个讨论。请同时包含你的语言的英文名称和本地名称：

```text
English name: German
Native name: Deutsch
```

## 地区变体

地区变体，例如加拿大法语或巴西葡萄牙语，也是可以支持的。但只有当文本确实与基础语言不同时，地区变体才有意义。只有当某个变体拥有与基础语言不同的翻译时，才会被收录。

在翻译地区变体时，对于在你的地区相同的字符串，请复制基础语言的翻译，而不是将其留空。这样可以清楚地知道哪些字符串已经过审核。

## 接下来会发生什么

维护者会将该语言添加到 Home Assistant 和 Lokalise 中。语言通过 [BCP 47](https://www.rfc-editor.org/info/bcp47) 标签来标识，例如 `fr`、`fr-CA` 或 `zh-Hans`。只有当某个地区需要自己的翻译，且基础语言已经完成翻译时，标签中才会包含地区代码。完成这些之后，你就可以加入项目并开始翻译了。

对于维护者来说，添加一种语言需要两个步骤：

1. 将语言标签及其本地名称（例如 "Français" 或 "Français (CA)"）添加到前端仓库的 [`src/translations/translationMetadata.json`](https://github.com/home-assistant/frontend/blob/dev/src/translations/translationMetadata.json) 中。
2. 在 Lokalise 中添加该语言。有时需要在语言设置中将 Lokalise 中的标签修改为自定义 ISO 代码以保持一致。
