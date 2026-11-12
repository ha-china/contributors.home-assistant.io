---
title: 编写测试
description: 集成的测试是如何组织的，如何通过 Home Assistant 而不是绕过它进行测试，以及如何使用 fixture、mock 和快照。
sidebarGroup: Write code
order: 4.5
---

core 中的每个集成都带有测试，对它的每次更改也都带有测试。测试证明你的更改有效，更重要的是，证明当明年有人更改其他内容时它仍然有效。本页面介绍如何编写这些测试。运行测试、检查覆盖率和更新快照的命令见[运行测试](/core/development/testing/)。

## 测试文件夹

测试位于 `tests/components/<domain>/`，与所有其他集成的测试放在一起。AirGradient 集成的测试如下所示：

```text
tests/components/airgradient/
├── __init__.py
├── conftest.py
├── fixtures/
├── snapshots/
├── test_button.py
├── test_config_flow.py
├── test_diagnostics.py
├── test_init.py
├── test_number.py
├── test_select.py
├── test_sensor.py
├── test_switch.py
└── test_update.py
```

| 文件 | 内容 |
| --- | --- |
| `__init__.py` | pytest 查找测试所必需的。一个 docstring 就够了，比如 `"""Tests for the AirGradient integration."""`。 |
| `conftest.py` | 该集成测试共享的 Pytest fixture，比如一个 mock 的库客户端和一个 `MockConfigEntry` |
| `fixtures/` | 来自设备或服务的示例数据，比如 JSON 响应 |
| `snapshots/` | 由测试生成的快照文件。不要手动编辑它们。 |
| `test_init.py` | `__init__.py` 的测试：设置、重新加载和卸载配置条目，以及设置失败 |
| `test_config_flow.py` | 配置流程、选项流程以及重新认证和重新配置的测试 |
| `test_<platform>.py` | 每个平台一个文件，比如 `test_sensor.py` |
| `test_<feature>.py` | 集成的其他部分每个一个文件，比如 `test_diagnostics.py` |

规则很简单：集成的每个文件对应一个测试文件，以其命名并在前面加上 `test_`。

## 通过 Home Assistant 进行测试

按照 Home Assistant 使用你的集成的方式来测试它：通过其公共接口，绝不要直接探查集成的内部。以这种方式工作的测试在集成被重构后仍然有效。

- 使用 `hass.config_entries.async_setup()` 设置集成，或者如果没有配置条目，则使用 `async_setup_component()`。
- 使用 `hass.states.get()` 从状态机读取实体的状态。
- 通过 `hass.services.async_call()` 调用服务。
- 在设备和实体注册表中检查设备和实体。
- 使用配置条目的 `state` 属性检查其状态。
- 使用 `pytest_homeassistant.common` 中的 `MockConfigEntry` 创建配置条目。

针对辅助函数或纯逻辑的聚焦单元测试可以直接调用该代码。这没有问题，只要集成的行为是通过 Home Assistant 测试的。

## Fixture 和 mock

测试在没有真实设备或服务的情况下运行。共享的设置放入 fixture，位于集成测试的 `conftest.py` 中。一个典型的集成有一个配置条目的 fixture、一个 mock 库的 fixture，以及一个完成所有设置的 fixture。

Mock 你的集成所使用的库，而不是 Home Assistant。在你的集成导入该库的位置 patch 库的客户端类，并为 mock 提供你需要的数据：

```python
@pytest.fixture
def mock_example_client() -> Generator[MagicMock]:
    """Return a mocked Example client."""
    with patch(
        "homeassistant.components.example.coordinator.ExampleClient",
        autospec=True,
    ) as client_mock:
        client = client_mock.return_value
        client.get_status.return_value = Status(temperature=21.5)
        yield client
```

Mock 协调器（coordinator）、`hass` 辅助函数或实体内部会使测试变得脆弱，并且跳过了你真正想要测试的代码。

将示例数据（比如设备的 JSON 响应）放在测试的 `fixtures/` 文件夹中，并使用 `pytest_homeassistant.common` 中的辅助函数加载它。`load_fixture("status.json", DOMAIN)` 返回 `tests/components/<domain>/fixtures/status.json` 的文本内容。`load_json_object_fixture` 和 `load_json_array_fixture` 将其解析为 JSON。在异步代码中，使用 `async_` 版本，比如 `await async_load_json_object_fixture(hass, "status.json", DOMAIN)`：它们会在事件循环之外读取文件。

Core 还为你经常需要的东西提供了 fixture，比如 `hass`、`entity_registry`、`device_registry`、用于 WebSocket API 的 `hass_ws_client`，以及 `issue_registry`。还有一些更多的约定：

- 给测试函数的每个参数加上类型注解，使用具体类型如 `HomeAssistant` 或 `MockConfigEntry`，而不是 `Any`。
- 对于需要但未在测试主体中使用的 fixture，使用 `@pytest.mark.usefixtures`。
- 当多个测试用不同的输入做同样的事情时，使用 `@pytest.mark.parametrize`。用 `pytest.param(..., id="name")` 为用例命名。
- 避免在测试中使用 `if` 语句。拆分测试，或者将其参数化。
- 对于任何与时间相关的事情，使用 `freezer` fixture。绝不要自己 patch `datetime` 或 `utcnow`。
- 硬编码的实体 ID 是可以的。如果重复使用同一个，就把它做成常量。
- 测试没有网络访问。Home Assistant 之外的一切都被 mock。

### 与其他集成共享 fixture

实体集成，比如 `light` 或 `sensor`，可以提供其他集成在其测试中使用的 fixture。例如，它可以将 fixture 存根添加到 `tests/components/conftest.py`，并将实现放在 `tests/components/<domain>/common.py` 中。

## 快照测试

快照测试将代码的结果与存储的参考（即快照）进行比较。这是检查大型输出的快捷方式，比如所有实体的状态、诊断转储或注册表中的条目。Core 使用 [Syrupy](https://github.com/syrupy-project/syrupy) 来实现这一点。

要一次测试一个平台的所有实体，使用 `snapshot_platform` 辅助函数：

```python
async def test_sensors(
    hass: HomeAssistant,
    mock_example_client: MagicMock,
    mock_config_entry: MockConfigEntry,
    entity_registry: er.EntityRegistry,
    snapshot: SnapshotAssertion,
) -> None:
    """Test the Example sensors."""
    with patch(
        "homeassistant.components.example.PLATFORMS", [Platform.SENSOR]
    ):
        await setup_integration(hass, mock_config_entry)

    await snapshot_platform(
        hass, entity_registry, snapshot, mock_config_entry.entry_id
    )
```

`snapshot_platform` 一次只适用于一个平台，因此有多个平台的集成会在测试中限制它们，如上所示。它也会在存在已禁用的实体时失败。如果你的某些实体默认被禁用，请在测试中添加 `entity_registry_enabled_by_default` fixture，这样它们就会被启用并出现在快照中。

第一次运行时测试会失败，因为还没有快照。[更新快照](/core/development/testing/#update-snapshots)后，它们会出现在 `tests/components/example/snapshots/` 中，是一个以测试文件命名的可读 `.ambr` 文件。将它们与你的更改一起提交，并阅读 diff：只有当你检查过快照是正确的，它才能证明什么。

快照不能替代功能测试。要测试设备故障时实体变为不可用，请精确断言这一点：

```python
assert hass.states.get("sensor.example_temperature").state == STATE_UNAVAILABLE
```

这说明了你的期望，并且会因正确的原因而失败。

## 测试什么

- **配置流程**：每一步和每一个错误，以及流程在出错后能够恢复并仍然创建条目。测试同一设备的第二次设置会中止。审阅者通常首先阅读这些测试。
- **设置**：集成能够加载和卸载，以及设置期间设备离线时会发生什么。
- **错误**：设备稍后离线、返回垃圾数据或凭据失效时会发生什么。这是审阅者最要求的测试。
- **Bug 修复**：一个在没有你的修复时失败、有修复时通过的测试。
- **避免脆弱的值**：不要依赖于库更新时会变化的数据，比如今年的节假日。

[集成质量分级](/core/quality-scale/)的 Bronze 级别要求配置流程有完整的测试覆盖，参见 [config-flow-test-coverage](/core/quality-scale/config-flow-test-coverage/)。从 Silver 级别开始，集成的每个模块需要超过 95% 的覆盖率，参见 [test-coverage](/core/quality-scale/test-coverage/)。

[教程](/core/integrations/tutorial/#9-write-the-tests)展示了一个小型集成的完整测试集。
