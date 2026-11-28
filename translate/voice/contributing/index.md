# 贡献句子和回复

> 如何在 intents 仓库中修改您所用语言的句子、回复和测试，检查您的工作，并创建拉取请求（pull request）。

Source: https://www.hasscn.top/contributors/translate/voice/contributing/

所有句子、回复和测试都存放在 GitHub 上的 [intents 仓库](https://github.com/OHF-Voice/intents)中。您通过拉取请求（pull request）来修改它们，由您所用语言的语言负责人进行审核。本页面将引导您完成整个过程。

## 在浏览器中添加一个句子

最小而有用的改动，就是为 Assist 已经认识的命令添加一种新的说法。您可以在 GitHub 上、在浏览器中完成，无需安装任何东西。初次接触 GitHub？[像非开发者一样使用 GitHub](https://www.hasscn.top/contributors/start/github/) 介绍了基础知识。

每个句子都需要一个测试，因此您的改动总是会涉及两个路径相同的文件：句子文件及其测试文件。例如，要教荷兰语一种按名称打开设备的新说法：

1. 打开 [`sentences/nl/HassTurnOn/name_only.yaml`](https://github.com/OHF-Voice/intents/blob/main/sentences/nl/HassTurnOn/name_only.yaml)，选择铅笔图标进行编辑。
2. 将您的句子模板添加到所属代码块的 `sentences` 列表中。
3. 选择 **Commit changes** 并创建一个新分支。如果您没有该仓库的写入权限，GitHub 会为您创建一个副本（即 fork），并将分支放在那里。
4. 在创建拉取请求之前，在同一分支上打开 [`tests/nl/HassTurnOn/name_only.yaml`](https://github.com/OHF-Voice/intents/blob/main/tests/nl/HassTurnOn/name_only.yaml) 并以相同的方式进行编辑。将一个使用您新模板的测试句子添加到测试组中，使用相同的槽位（slot）和回复，然后提交到该分支。
5. 创建拉取请求。

拉取请求上的检查随后会告诉您是否有问题。当句子文件没有对应的测试文件、文件中的测试句子少于句子模板、某个句子模板没有被任何测试句子使用，或者某个测试句子与预期的意图（intent）、槽位或回复不匹配时，检查会失败。它们还会检查您的 YAML 格式。之后，您所用语言的语言负责人会审核您的改动。

准备好添加更多句子了吗？请继续阅读。

## 什么在哪里

每种语言都有自己的文件夹。将 `<language>` 替换为您的语言代码，例如 `nl` 或 `pt-BR`：

| 文件夹 | 内容 |
| --- | --- |
| `sentences/<language>/<intent>/<slot_combination>.yaml` | 某个意图和槽位组合的句子模板 |
| `sentences/<language>/_common.yaml` | 错误回复、跳过词以及整个语言的设置 |
| `responses/<language>/<intent>.yaml` | 某个意图的回复 |
| `lists/<language>/` | 槽位列表，例如颜色或状态 |
| `rules/<language>/` | 展开规则，例如用于打开设备的动词 |
| `tests/<language>/<intent>/<slot_combination>.yaml` | 某个意图和槽位组合的测试 |

根目录下有两个文件适用于所有语言：

- [`intents.yaml`](https://github.com/OHF-Voice/intents/blob/main/intents.yaml) 声明了各个意图及其槽位组合。
- [`languages.yaml`](https://github.com/OHF-Voice/intents/blob/main/languages.yaml) 列出了各语言及其负责人。

因此，如果您想改进荷兰语使用者按名称打开和关闭设备的表达方式，您需要修改这四个文件：

- [`sentences/nl/HassTurnOn/name_only.yaml`](https://github.com/OHF-Voice/intents/blob/main/sentences/nl/HassTurnOn/name_only.yaml)
- [`sentences/nl/HassTurnOff/name_only.yaml`](https://github.com/OHF-Voice/intents/blob/main/sentences/nl/HassTurnOff/name_only.yaml)
- [`tests/nl/HassTurnOn/name_only.yaml`](https://github.com/OHF-Voice/intents/blob/main/tests/nl/HassTurnOn/name_only.yaml)
- [`tests/nl/HassTurnOff/name_only.yaml`](https://github.com/OHF-Voice/intents/blob/main/tests/nl/HassTurnOff/name_only.yaml)

## 谁负责什么

每种语言的文件夹归其语言负责人所有。[`CODEOWNERS`](https://github.com/OHF-Voice/intents/blob/main/CODEOWNERS) 文件由 `languages.yaml` 生成，会自动请求他们进行审核。

`intents.yaml` 则不同。对它的修改会同时影响所有语言，因此只有仓库维护者才能修改它。其他任何人创建的触及该文件的拉取请求都会导致 `guard-core-files` 检查失败。如果缺少某个槽位组合、某个组合被标记错误，或者某个组合不适合您的语言，请[创建一个 issue](https://github.com/OHF-Voice/intents/issues) 说明您的需求。

> [!NOTE]
> 拉丁字母书写的塞尔维亚语（`sr-Latn`）由西里尔字母书写的塞尔维亚语（`sr`）生成。请在 `sr` 中进行修改。当两者出现不一致时，检查会失败。

## 保持小改动

将每个拉取请求限制为一种语言和一个意图。小的拉取请求更容易审核，因此能更快被合并。十个小的拉取请求胜过一个巨大的拉取请求。

## 选择您的工作方式

有三种方式可以在这个仓库上工作。请根据您改动的规模选择合适的方式。

### 在 GitHub 上编辑

对于单个文件中的小修复，例如回复中的错别字，您无需安装任何东西。初次接触 GitHub？[像非开发者一样使用 GitHub](https://www.hasscn.top/contributors/start/github/) 更详细地介绍了相同的步骤。

1. 在 GitHub 上打开该文件，选择铅笔图标进行编辑。
2. 进行您的修改。
3. 选择 **Commit changes**，选择创建新分支并开始拉取请求，然后描述您所做的修改。

检查会在您的拉取请求上运行，因此您仍然能发现是否有问题。

### 使用 codespace

对于更大的改动，[GitHub codespace](https://docs.github.com/codespaces/overview) 可以在浏览器中为您提供完整的环境，包括编辑器和终端。无需安装任何东西。

1. 在[仓库页面](https://github.com/OHF-Voice/intents)上，选择 **Code** > **Codespaces** > **Create codespace on main**。启动需要一两分钟。
2. 在底部的状态栏中选择分支名称，并创建一个新分支。
3. 进行您的修改。
4. 为当前打开的文件运行检查：打开菜单，选择 **Terminal** > **Run Task**，然后选择 **Run tests for current file**。
5. 在 **Source Control** 中提交您的修改，并选择 **Create Pull Request**。

仓库中的 [codespace 演练](https://github.com/OHF-Voice/intents/blob/main/docs/codespace/README.md)包含每个步骤的截图。

### 在本地工作

如果您更喜欢使用自己的电脑，请 fork 并克隆该仓库，然后进行设置：

```shell
git clone https://github.com/<your-username>/intents
cd intents
script/setup
```

`script/setup` 会在 `venv/` 中创建一个 Python 虚拟环境，并安装您需要的一切。在运行下面的命令之前，请先使用 `source venv/bin/activate` 激活它。如果您的编辑器支持，该仓库也可以作为 [devcontainer](https://containers.dev/) 使用。

创建一个分支，进行修改，然后推送到您的 fork 以创建拉取请求。

## 检查您的工作

在拉取请求上运行的检查也可以在您的电脑或 codespace 中运行。在创建拉取请求之前先运行它们，可以省去一个来回。

验证您所用语言的文件：

```shell
python3 -m script.intentfest validate --language nl
```

验证会检查每个文件是否符合 `intents.yaml` 中的槽位组合、您使用的每个列表和规则是否存在，以及所有 `required` 槽位组合是否都有句子。

运行您所用语言的测试：

```shell
pytest tests --language nl
```

添加 `-k HassTurnOn` 可以只测试一个意图，添加 `-n auto` 可以并行运行测试。测试会检查每个句子是否匹配正确的意图、填充正确的槽位，并给出正确的回复。当某个句子模板从未被任何测试句子使用时，测试也会失败。

`script/test` 会同时运行两者：验证和所有测试。您可以传递相同的选项，例如 `script/test --language nl`。

## 尝试各种功能

在编写时，还有几个工具可以帮到您。

查看您的语言如何解析一个句子：

```shell
python3 -m script.intentfest parse --language en \
  --sentence 'turn on the lights in the kitchen'
```

它会以 JSON 格式打印匹配到的意图和槽位。

查看一个模板会生成哪些句子：

```shell
python3 -m script.intentfest sample_template 'turn on [the] light[s]'
```

您也可以为它提供列表值、数字范围和规则，例如 `--values color red green`、`--range brightness 1 2` 或 `--rule color '[the] {color}'`。

为某些意图采样您的语言所接受的句子：

```shell
python3 -m script.intentfest sample --language nl \
  --intents HassTurnOn HassTurnOff -n 5
```

统计您的模板总共能组成多少个句子：

```shell
python3 -m script.intentfest count_sentences --language nl --summary
```

可选词和备选说法会使数量成倍增长。一个拥有数百万可能句子的语言在小型设备上会变慢。去掉 `--summary` 可以查看每个模板的数量，从而找出增长过大的模板。

## 拉取请求会检查什么

除了验证和测试之外，拉取请求还会检查：

- 没有意图会抢占其他意图的句子。例如，用于播放媒体的贪婪模板不应捕获“把灯调到最大”。
- 您的语言中没有留下任何无人使用的规则或列表。
- `CODEOWNERS` 仍然与 `languages.yaml` 一致。
- 您的 YAML 文件按照 [Prettier](https://prettier.io/) 的格式进行格式化。`script/lint` 可以在本地运行此检查以及 Python 检查。

只有当所有检查都通过时，拉取请求才能被合并。

## 合并之后

新句子会在 `home-assistant-intents` 包的下一个版本中发布。Home Assistant 会更新到该包的新版本，从那时起，您的句子就会随 Home Assistant 一起发布。
