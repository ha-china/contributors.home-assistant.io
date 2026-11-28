# 类型提示

> Home Assistant Core 如何使用类型提示和 mypy，以及如何让模块启用严格检查。

Source: https://www.hasscn.top/contributors/core/development/typing/

类型提示能让下一个人更容易理解代码，还能让 [mypy](https://mypy.readthedocs.io/) 在用户之前发现 bug。Core 在 Git 钩子和 CI 中使用 mypy 检查每个模块。

## 有什么要求

目前并非每个集成（integration）都要求类型提示，但强烈建议添加，目标是实现全覆盖。在测试中，审查者确实期望有类型提示：为测试函数的每个参数提供类型，并尽量使用具体类型（如 `HomeAssistant` 或 `MockConfigEntry`）而不是 `Any`。

```python
async def test_setup(
    hass: HomeAssistant,
    mock_config_entry: MockConfigEntry,
) -> None:
    """Test setting up the integration."""
```

Python 3.14 会延迟求值注解，因此你可以不加引号地引用文件中后面才定义的类。

## 为无类型代码添加提示

为一个完全没有提示的模块添加类型是一项很大的工作量。[MonkeyType](https://pypi.org/project/MonkeyType/) 可以完成第一遍处理：它会在测试运行时观察调用，并根据看到的类型建议提示。Core 为此提供了一个脚本。MonkeyType 默认不会安装，因此请先使用 `uv pip install monkeytype` 安装它。

1. 在 MonkeyType 下运行你模块的测试：

   ```shell
   script/monkeytype tests/components/example/test_sensor.py
   ```

2. 使用 `monkeytype stub homeassistant.components.example.sensor` 查看它建议的提示。
3. 如果这些提示看起来合理，使用 `monkeytype apply homeassistant.components.example.sensor` 应用它们。
4. 检查差异并修正它弄错的地方。它只知道测试恰好用到的类型。

这对没有任何提示的模块效果最好。将其应用于已有部分提示的模块可能会失败。

## 严格检查

默认情况下，mypy 接受只有部分类型标注的代码。完全类型化的模块可以选择启用严格检查，这也会在缺少提示或混入 `Any` 时导致失败。

要启用，请按字母顺序将该模块添加到仓库根目录的 `.strict-typing` 文件中。对于集成，就是类似 `homeassistant.components.example.*` 的一行。然后运行 hassfest 来更新 `mypy.ini`：

```shell
python3 -m script.hassfest -p mypy_config
```

提交这两个文件。[集成质量分级](https://www.hasscn.top/contributors/core/quality-scale/)中 Platinum 级别的集成必须进行严格类型检查。

## 帮助类型检查器

有时你比类型检查器知道得更多。例如，某个值在一般情况下可能为 `None`，但在代码中的这个位置绝不会是 `None`。可以在 `TYPE_CHECKING` 块内使用 `assert` 来收窄类型，这样它只对类型检查器存在，永远不会实际运行：

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    assert self.coordinator.data is not None
```

只有在无法直接修改注解或修改起来非常繁琐时才这样做。
