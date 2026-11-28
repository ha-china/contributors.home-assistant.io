# 占位符和引用

> 字符串中不应翻译的部分，以及如何处理它们。

Source: https://www.hasscn.top/contributors/translate/guides/placeholders/

有些字符串并不是纯文本。它们包含 Home Assistant 在运行时填入的部分，或指向其他字符串的部分。这些部分必须保持原样。

## 花括号：运行时填入的值

花括号之间的部分，例如 `{name}`，会被一个实时值替换。在这个字符串中：

```text
{count} devices found
```

Home Assistant 会把实际数字填到 `{count}` 的位置。请保持占位符原样不动，并把它移动到在你的语言中合适的位置：

```text
{count} Geräte gefunden
```

花括号的规则：

- 英文字符串中的每个占位符都必须出现在你的翻译中。
- 永远不要翻译括号之间的名称。`{count}` 保持为 `{count}`。
- 你可以移动占位符的位置，以你的语序为准。

### 复数和选择

有些占位符会在多个变体之间进行选择，例如用于单数或复数的情况：

```text
{count, plural,
  one {# device}
  other {# devices}
}
```

请翻译内部括号中的文本，而不是它周围的关键字。拥有更多复数形式的语言可以添加它们，例如 `few` 或 `many`。其语法遵循 ICU 消息格式（ICU message format）。[format.js 指南](https://formatjs.github.io/docs/core-concepts/icu-syntax/) 对此有完整说明。

## 方括号：对其他字符串的引用

方括号之间的文本（在 Lokalise 中显示为绿色）是一个引用。它指向另一个字符串，因此相同的文本只需翻译一次。当你翻译包含引用的字符串时，通常可以直接沿用：在编辑器中使用**插入源文（Insert source）**。

你的语言中可能存在英语中没有的重复项。我们也欢迎你用引用将它们关联起来。Lokalise 在其关于[键引用（key referencing）](https://docs.lokalise.com/en/articles/1400528-key-referencing)的文档中对此有说明。
