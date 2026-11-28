# 前端中的翻译

> 前端文本存放的位置、如何在代码中使用它，以及 Core 和集成的文本如何进入界面。

Source: https://www.hasscn.top/contributors/frontend/architecture/translations/

前端被用于数十种语言，因此人们看到的任何文本都不会直接写在代码中。英文源文本存放在一个文件中，由社区将其翻译成其他所有语言。

## 文本存放的位置

- **前端文本**位于 [`src/translations/en.json`](https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json)。它是仓库中唯一的翻译文件。当它在 `dev` 分支上发生变更时，会被上传到 [Lokalise](https://www.hasscn.top/contributors/glossary/lokalise/)，翻译人员在那里进行翻译工作。翻译结果会以每夜构建的形式返回。
- **来自 Core 和集成的文本**，比如实体（entity）名称、状态（state）以及配置流程的各个步骤，来自每个集成的 `strings.json`。前端在运行时从 Core 加载它。

翻译人员永远不会看到你的代码，只会看到字符串及其键。[让你的字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)介绍了如何编写便于他们处理的字符串。

## 使用字符串

将英文文本添加到 [`src/translations/en.json`](https://github.com/home-assistant/frontend/blob/dev/src/translations/en.json) 中，放在一个标明其用途的键下面。下面这个是维修卡片上维修问题的数量，位于 `ui` > `card` > `repairs` 下：

```json
"count_issues": "{count} {count, plural, one {issue} other {issues}}"
```

然后通过 `localize` 使用它，传入完整的键和占位符的值：

```ts
this._localize("ui.card.repairs.count_issues", { count: 3 });
```

键会根据 `en.json` 进行类型检查，因此键中的拼写错误会导致类型检查失败。

通过 `@consumeLocalize()` 从国际化上下文中获取 `localize`，或者在已经拥有 `hass` 的组件中从 `hass.localize` 获取。参见 [hass 对象与上下文](https://www.hasscn.top/contributors/frontend/architecture/hass-and-contexts/)。

### 占位符与复数

字符串使用 [ICU 消息格式](https://formatjs.github.io/docs/core-concepts/icu-syntax/)。占位符放在花括号中，比如 `{count}`。上面示例中的 `plural` 形式会根据数字选择正确的词语。每种语言都有自己的复数规则，翻译人员会填写其语言所需的形式。

始终翻译完整的句子，并为变化的部分使用占位符。绝不要用单独翻译的片段拼凑句子：其他语言中的语序是不同的。

### 复用字符串

当相同的文本已经存在时，指向它而不是重新编写。引用使用另一个键的路径，各部分之间用 `::` 分隔：

```json
{
  "armed_home": "[%key:state_badge::alarm_control_panel::armed%]"
}
```

每复用一个字符串，就意味着每种语言都少一个需要翻译的字符串。

## 来自 Core 的文本

来自集成的文本按类别按需加载。在使用某个类别的键之前，先加载该类别：

```ts
const localize = await hass.loadBackendTranslation("title");
localize(`component.${domain}.title`);
```

后端键以 `component.<domain>.` 开头，后面是该集成的 `strings.json` 中的路径。

前端文本的很大一部分，比如设置或仪表盘（dashboard）编辑器，被拆分成随其面板一起加载的片段。`hass.loadFragmentTranslation()` 会加载其中一个片段，例如当一个面板的对话框在另一个面板中打开时。

## 在翻译环境下运行

在开发过程中，除非你获取翻译，否则前端只有英文。在任何开发服务器上添加 `--fetch-translations`，例如 `pnpm dev --fetch-translations`。参见[设置环境](https://www.hasscn.top/contributors/frontend/development/environment/#translations)。

要检查从右到左的布局，请将你的个人资料切换到从右到左的语言，如希伯来语或阿拉伯语，或者使用[画廊](https://www.hasscn.top/contributors/frontend/development/gallery-and-demo/)中的从右到左切换开关。
