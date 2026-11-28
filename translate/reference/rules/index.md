# 翻译规则

> 适用于所有语言的规则。内容简短，开始之前值得一读。

Source: https://www.hasscn.top/contributors/translate/reference/rules/

这些规则适用于所有语言。部分语言在此之上有[额外的指南](https://www.hasscn.top/contributors/translate/reference/languages/)。

- **只翻译成你的母语。** 机器翻译和第二语言是能看出来的，母语使用者一眼就能察觉。
- **不要翻译名称。** 产品和品牌名称保持原样：Home Assistant、Supervisor、Hue、Z-Wave、Matter。
- **保持占位符（placeholder）完整。** 花括号中的占位符名称，例如 `{name}`，必须原样保留。在复数和选择中，保留关键字和括号，只翻译内层括号中的文本。参见[占位符和引用](https://www.hasscn.top/contributors/translate/guides/placeholders/)。
- **符合 Home Assistant 的语气。** 友好、清晰、直接。像向朋友解释事情那样去写，而不是像说明书那样。
- **空间小的地方要简短。** 按钮、徽章和状态（state）名称通常空间有限。例如，`state_badge` 下的翻译会显示在小小的徽章上，因此必须简短。要实际测试一下，可以打开 **Settings** > **Tools** > **States**，在一个测试实体（entity）如 `device_tracker.test` 上设置一个状态，然后把你的翻译用作该状态。
- **复用，而不是重复。** 如果同一段文本出现在多个字符串中，请用引用将它们关联起来。
- **保持一致。** 同一个事物在所有地方都使用同一个词。如果你的语言已经就某个术语达成共识，就使用它。
- **有疑问就提问。** 在 Lokalise 中给该字符串留下评论。提问总比猜测好。
