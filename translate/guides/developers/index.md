# 让你的字符串可翻译

> 面向向 Home Assistant 添加文本的开发者。如何编写便于翻译者处理的字符串。

Source: https://www.hasscn.top/contributors/translate/guides/developers/

你添加的每个字符串都会呈现在 64 种语言的翻译者面前。你稍加留意，就能为他们省去大量猜测。

## 字符串放在哪里

- 在**集成（integration）**中，文本存放在代码旁边的 `strings.json` 中。它涵盖设置流程、实体（entity）名称和状态、操作、错误以及修复问题。
- 在**前端（frontend）**中，文本存放在 [`src/translations/en.json`](https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json) 中。

切勿将面向用户的文本直接写在代码里。代码中的文本无法被翻译。

## 先复用，再编写

许多字符串已经存在，例如“设备已配置”或“连接失败”。常用字符串位于 core 中的 [`homeassistant/strings.json`](https://github.com/home-assistant/core/blob/dev/homeassistant/strings.json)。请使用引用指向它们，而不是自己编写：

```json
{
  "config": {
    "abort": {
      "already_configured": "[%key:common::config_flow::abort::already_configured_device%]"
    }
  }
}
```

每复用一个字符串，就意味着每种语言都少一个需要翻译的字符串。

## 为翻译者而写

- **对值使用占位符**，切勿把句子拼接在一起。`"Found {count} devices"` 可以被翻译。`"Found " + count + " devices"` 则不行，因为每种语言的语序不同。
- **在前端正确使用复数形式。** 请编写 `{count, plural, one {# device} other {# devices}}`，而不是 "device(s)"。`strings.json` 中的集成字符串不使用这种语法，因此请将这些字符串表述为适用于任何数字的形式，例如 "Devices found: {count}"。
- **根据占位符的内容为其命名。** `{device_name}` 比 `{name}` 能让翻译者了解更多信息。
- **保持句子完整。** 不要把一个句子拆分到两个字符串中。

## 测试你的字符串

在 core 中，编译你的集成的字符串以便在界面中查看它们。将 `wled` 替换为你的集成的域名（domain），或使用 `--all` 来处理所有集成：

```shell
python3 -m script.translations develop --integration wled
```

## 合并之后会发生什么

一旦你的 pull request 被合并，新的英文字符串会自动上传到 Lokalise。翻译者会从那里获取它们，翻译将随项目的下一次构建一同发布，参见[翻译如何回流](https://www.hasscn.top/contributors/translate/how-it-works/#how-translations-get-back)。你无需再做任何其他事情。
