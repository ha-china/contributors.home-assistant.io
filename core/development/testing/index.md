# 运行测试

> 使用 pytest 运行 Home Assistant Core 的测试，检查覆盖率，更新快照，并了解 CI 会运行哪些内容。

Source: https://www.hasscn.top/contributors/core/development/testing/

对 core 的每一处更改都会经过测试。Core 使用 [pytest](https://docs.pytest.org/)，本页介绍如何运行测试：使用哪些命令、哪些选项，以及 CI 会如何处理它们。关于如何为集成（integration）编写良好的测试（包括 fixtures、mock 和快照），请参阅[编写测试](https://www.hasscn.top/contributors/core/development/tests/)。

## 运行测试

先激活你的虚拟环境（开发容器会自动完成这一步）。然后运行你所修改的集成的测试：

```shell
pytest tests/components/example
```

在未激活的环境之外，`uv run --no-sync pytest` 的效果相同。

完整的测试套件耗时很长。只有当你修改了许多集成都会用到的内容时才运行它，否则运行你自己更改相关的测试就足够了。

一些实用的选项：

```shell
# 在第一个失败处停止
pytest tests/components/example -x

# 只运行名称匹配的测试
pytest tests/components/example -k test_setup

# 让运行超过 10 秒的测试失败
pytest tests/components/example --timeout 10

# 显示最慢的 10 个测试
pytest tests/components/example --durations=10
```

> [!NOTE]
> 测试从生成的 `translations/en.json` 中加载英文文本，而不是从 `strings.json`。在修改 `strings.json` 之后，请先运行 `python3 -m script.translations develop --integration example`，再运行测试。

## 检查覆盖率

要查看你的测试尚未覆盖哪些行：

```shell
pytest tests/components/example \
  --cov=homeassistant.components.example \
  --cov-report term-missing
```

报告会列出该集成的每个模块，以及没有测试触及的行。质量等级要求从 Bronze 级开始 `config_flow.py` 需要完全覆盖，从 Silver 级开始每个模块的覆盖率需超过 95%。

CI 会将覆盖率报告给 Codecov，对于某些文件，Codecov 要求每一行被更改的代码都经过测试。在任何集成中，你的拉取请求（pull request）在这些文件中更改的行都需要 100% 的覆盖率，否则 Codecov 检查会失败：

- `backup.py`
- `config_flow.py`
- `device_action.py`
- `device_condition.py`
- `device_trigger.py`
- `diagnostics.py`
- `group.py`
- `intent.py`
- `logbook.py`
- `media_source.py`
- `recorder.py`
- `scene.py`

该列表位于 core 仓库的 [`codecov.yml`](https://github.com/home-assistant/core/blob/dev/codecov.yml) 中。

## 更新快照

快照测试会将你的代码运行结果与存储的 `.ambr` 文件进行比较。使用以下命令创建或更新某个集成的快照：

```shell
pytest tests/components/example --snapshot-update
```

将快照文件与你的更改一起提交，并仔细阅读它们的差异（diff）。参见[快照测试](https://www.hasscn.top/contributors/core/development/tests/#snapshot-tests)。

## 新的依赖

如果你修改了某个集成的依赖要求（requirements），请更新依赖文件并安装新的软件包：

```shell
python3 -m script.gen_requirements_all
uv pip install -r requirements_all.txt -r requirements_test.txt
```

## 在 Visual Studio Code 中

开发容器为以上所有操作都提供了任务。打开命令面板（Command Palette），选择 **Tasks: Run Task**，然后选择 **Pytest**、**Pytest (changed tests only)**、**Code Coverage** 或 **Update syrupy snapshots**。参见[任务](https://www.hasscn.top/contributors/core/development/environment/#tasks)。

## CI 运行哪些内容

CI 会在每个拉取请求上运行测试。当拉取请求只涉及集成时，它会运行这些集成的测试。当你修改了 core 文件，或者维护者添加了 `ci-full-run` 标签时，它会运行完整的测试套件。参见[linter、hassfest 和 CI](https://www.hasscn.top/contributors/core/development/checks/)。
