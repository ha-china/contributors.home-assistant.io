# 支持的语言

> Assist 通过内置对话代理（conversation agent）所理解的语言、各语言的负责人，以及如何添加新语言。

Source: https://www.hasscn.top/contributors/translate/voice/languages/

[意图（intents）仓库](https://github.com/OHF-Voice/intents)列出了 66 种语言。每种语言的完成程度差异很大：有些几乎覆盖了所有意图，有些才刚刚起步。[进度总览](https://ohf-voice.github.io/intents/)页面按意图展示了每种语言的得分。

## 列表的来源

意图仓库中的 [`languages.yaml`](https://github.com/OHF-Voice/intents/blob/main/languages.yaml) 是数据来源。对于每种语言，它包含：

- `nativeName`：该语言以其自身语言书写的名称。
- `isRTL`：对于从右到左书写的语言为 `true`。
- `leaders`：[语言负责人](https://www.hasscn.top/contributors/translate/voice/language-leaders/)的 GitHub 用户名。
- `support`：按地区列出哪些语音转文本（speech-to-text）和文本转语音（text-to-speech）引擎支持该语言，例如 Whisper、Speech-to-Phrase、Piper 或 Home Assistant Link。

下表是该文件的一个快照。如果两者不一致，以 `languages.yaml` 为准。

## 语言

| 代码 | 语言 | 语言负责人 |
| --- | --- | --- |
| `af` | 南非荷兰语 | 暂无 |
| `ar` | العربية | [Ahmed-farag36](https://github.com/Ahmed-farag36)、[Natfaji](https://github.com/Natfaji) |
| `bg` | Български | [hristo-atanasov](https://github.com/hristo-atanasov) |
| `bn` | বাংলা | [poltalashka](https://github.com/poltalashka)、[DrHaque](https://github.com/DrHaque) |
| `ca` | Català | [duhow](https://github.com/duhow) |
| `cs` | Čeština | [halecivo](https://github.com/halecivo)、[schizza](https://github.com/schizza) |
| `cy` | Cymraeg | 暂无 |
| `da` | Dansk | [fadamsen](https://github.com/fadamsen)、[MTrab](https://github.com/MTrab) |
| `de` | Deutsch | [andreasbrett](https://github.com/andreasbrett)、[easterapps](https://github.com/easterapps)、[hecktech27](https://github.com/hecktech27)、[mib1185](https://github.com/mib1185) |
| `de-CH` | Schwyzerdütsch | [dontinelli](https://github.com/dontinelli) |
| `el` | Ελληνικά | [apo-mak](https://github.com/apo-mak)、[chatziko](https://github.com/chatziko) |
| `en` | English | [mrdarrengriffin](https://github.com/mrdarrengriffin)、[vividboarder](https://github.com/vividboarder) |
| `es` | Español | [davefx](https://github.com/davefx)、[duhow](https://github.com/duhow) |
| `et` | Eesti | 暂无 |
| `eu` | Euskara | [urtzai](https://github.com/urtzai) |
| `fa` | فارسی | 暂无 |
| `fi` | Suomi | [Arkkimaagi](https://github.com/Arkkimaagi)、[salleq](https://github.com/salleq) |
| `fr` | Français | [jlpouffier](https://github.com/jlpouffier)、[piitaya](https://github.com/piitaya) |
| `ga` | Gaeilge | [AlanGreene](https://github.com/AlanGreene) |
| `gl` | 加利西亚语 | [cibernox](https://github.com/cibernox) |
| `gu` | 古吉拉特语 | 暂无 |
| `he` | עברית | [leranp](https://github.com/leranp)、[haim-b](https://github.com/haim-b) |
| `hi` | हिन्दी | [amankrokx](https://github.com/amankrokx) |
| `hr` | Hrvatski | [spuljko](https://github.com/spuljko) |
| `hu` | Magyar | [nagyrobi](https://github.com/nagyrobi)、[v1k70rk4](https://github.com/v1k70rk4) |
| `hy` | հայերեն | [eantonya](https://github.com/eantonya)、[shahen94](https://github.com/shahen94) |
| `id` | Bahasa Indonesia | 暂无 |
| `is` | íslenska | [thdg](https://github.com/thdg) |
| `it` | Italiano | [auanasgheps](https://github.com/auanasgheps)、[xraver](https://github.com/xraver) |
| `ja` | 日本語 | 暂无 |
| `ka` | ქართული | [hertzg](https://github.com/hertzg) |
| `kn` | ಕನ್ನಡ | 暂无 |
| `ko` | 한국어 | [limitless00net](https://github.com/limitless00net) |
| `kw` | kernewek | 暂无 |
| `lb` | Lëtzebuergesch | [mojikosu](https://github.com/mojikosu) |
| `lt` | Lietuvių | 暂无 |
| `lv` | Latviešu | [makstech](https://github.com/makstech)、[klejejs](https://github.com/klejejs) |
| `ml` | മലയാളം | [arunshekher](https://github.com/arunshekher) |
| `mn` | монгол хэл | [chuk-a](https://github.com/chuk-a) |
| `mr` | 马拉地语 | 暂无 |
| `ms` | Bahasa Melayu | [zubir2k](https://github.com/zubir2k) |
| `nb` | Norsk Bokmål | [LaStrada](https://github.com/LaStrada) |
| `ne` | नेपाली | [Rrp13](https://github.com/Rrp13) |
| `nl` | Nederlands | [TheFes](https://github.com/TheFes) |
| `pa` | 旁遮普语 | [kmlkrwl](https://github.com/kmlkrwl) |
| `pl` | Polski | [Uriziel01](https://github.com/Uriziel01)、[witold-gren](https://github.com/witold-gren) |
| `pt` | Português | [joaorgoncalves](https://github.com/joaorgoncalves)、[abmantis](https://github.com/abmantis) |
| `pt-BR` | Português (Brasil) | [mhentschke](https://github.com/mhentschke)、[luyzfernando08](https://github.com/luyzfernando08)、[staticdev](https://github.com/staticdev) |
| `ro` | Română | [tetele](https://github.com/tetele)、[gabimarchidan](https://github.com/gabimarchidan) |
| `ru` | Русский | [HepoH3](https://github.com/HepoH3) |
| `sk` | Slovenčina | [LubosKadasi](https://github.com/LubosKadasi) |
| `sl` | Slovenščina | [andrejs2](https://github.com/andrejs2) |
| `sr` | Српски | [cvladan](https://github.com/cvladan)、[ddxic](https://github.com/ddxic)、[darkobg79](https://github.com/darkobg79)、[PengBG](https://github.com/PengBG) |
| `sr-Latn` | Srpski | 暂无 |
| `sv` | Svenska | [larsdunemark](https://github.com/larsdunemark)、[Robin-St](https://github.com/Robin-St) |
| `sw` | Kiswahili | [BCorbeek](https://github.com/BCorbeek) |
| `ta` | தமிழ் | 暂无 |
| `te` | తెలుగు | 暂无 |
| `th` | ภาษาไทย | 暂无 |
| `tr` | Türkçe | [alpdmrel](https://github.com/alpdmrel) |
| `uk` | Українська | [skynetua](https://github.com/skynetua) |
| `ur` | اُردُو | [AalianKhan](https://github.com/AalianKhan) |
| `vi` | Tiếng Việt | [dinhchinh82](https://github.com/dinhchinh82) |
| `zh-CN` | 简体中文 | [al-one](https://github.com/al-one) |
| `zh-HK` | 繁體中文（香港） | [swonge](https://github.com/swonge) |
| `zh-TW` | 繁體中文（台灣） | [bluefoxlee](https://github.com/bluefoxlee) |

马拉地语（`mr`）已列出，但尚无任何句子。`sr-Latn` 是从 `sr` 生成的：修改 `sr` 中的塞尔维亚语内容，拉丁字母版本会随之更新。

## 添加新语言

你的语言不在列表中？你可以添加它。这比改进现有语言是更大的一步，因此请预留几轮审阅的时间。

### 1. 创建文件

按照[贡献句子和回复](https://www.hasscn.top/contributors/translate/voice/contributing/#pick-your-setup)中的说明设置仓库，然后运行：

```shell
python3 -m script.intentfest add_language <code> <native name>
```

- `<code>` 是语言代码。如果存在两位字母的 [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 代码，请使用它，例如 `pl`。地区或文字变体需添加后缀，例如 `pt-BR` 或 `sr-Latn`。
- `<native name>` 是该语言以其自身语言书写的名称，例如 `Polski`。
- 对于从右到左书写的语言，请添加 `--rtl`。

该脚本会将你的语言添加到 `languages.yaml`，并根据英文文件创建其句子、回复和测试文件。句子会留空，回复则以 `TODO` 开头，以便你了解还有哪些内容需要翻译。

无法自己运行该脚本？请在 Home Assistant [Discord 服务器](https://www.home-assistant.io/join-chat)的 [**#language-leaders**](https://discord.com/channels/330944238910963714/1257022942961991781) 频道中询问，维护者可以帮你运行。

### 2. 保持第一个拉取请求（pull request）小而精

将你的第一个拉取请求限制在以下内容：

- `sentences/<code>/_common.yaml` 中的错误回复。
- `intents.yaml` 中标记为 `required` 的 `HassTurnOn` 和 `HassTurnOff` 槽位组合，及其测试。
- 这些句子所需的 `lists/<code>/` 中的列表和 `rules/<code>/` 中的规则。

这就足以让人们开始用你的语言打开和关闭设备了。更多意图将在后续的拉取请求中添加，每次一个。

### 3. 寻找一位负责人

新语言开始时没有负责人。如果你持续贡献，可以考虑[成为语言负责人](https://www.hasscn.top/contributors/translate/voice/language-leaders/#become-a-language-leader)。

> [!NOTE]
> 语音和界面是相互独立的。在此处添加语言并不会将其添加到 Home Assistant 界面中。如需添加界面语言，请参阅[申请新语言](https://www.hasscn.top/contributors/translate/guides/new-language/)。
