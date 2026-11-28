# 开发检查清单

> 在提交之前，请对照此清单检查你的更改，以便你的拉取请求（pull request）可以进入评审。

Source: https://www.hasscn.top/contributors/core/development/checklist/

在提交之前请逐项检查此清单。拉取请求模板会要求你确认这些内容，评审人员也会进行检查。

## 代码

- [ ] 代码已使用 Ruff 格式化（`ruff format`），并且 [Git 钩子](https://www.hasscn.top/contributors/core/development/checks/) 通过。
- [ ] 测试通过，并且新代码有[测试](https://www.hasscn.top/contributors/core/development/tests/)。
- [ ] 没有被注释掉的代码。
- [ ] 你理解每一行代码，并且能够解释它。这也适用于由 AI 工具为你编写的代码。
- [ ] 如果一个模块是完全类型化的，它已被列入 `.strict-typing`。

## 库和依赖

所有与设备（device）和服务（service）的通信都通过发布在 [PyPI](https://pypi.org/) 上的 Python 库进行。集成（integration）本身不包含任何协议代码。

- [ ] 该库在 PyPI 上有源代码分发（source distribution），而不仅仅是预构建的 wheel 包。
- [ ] 该库的源代码是公开的，采用与 core 的许可证 Apache 2.0 兼容的 OSI 认可开源许可证。CI 会使用 [`script/licenses.py`](https://github.com/home-assistant/core/blob/dev/script/licenses.py) 检查依赖的许可证，如果发现没有 OSI 认可的许可证则会失败。少数软件包在其例外列表中，因此通过检查并不能证明每个依赖都没有问题。与 Apache 2.0 的兼容性由[评审人员](https://www.hasscn.top/contributors/core/development/reviewing/)检查。
- [ ] 该库的 issue 跟踪器已启用。
- [ ] 新增或更新的依赖已列入 `requirements_all.txt`。运行 `python3 -m script.gen_requirements_all` 来更新它。

如果你主要为 Home Assistant 维护该库并且你拥有该集成，请考虑添加一个 issue 模板选择器，将用户引导至 [core issue 跟踪器](https://github.com/home-assistant/core/issues)，就像 [zwave-js-server-python](https://github.com/home-assistant-libs/zwave-js-server-python/issues/new/choose) 所做的那样。

## 元数据

- [ ] `manifest.json` 完整且正确。
- [ ] 新的集成所有者已列入 `CODEOWNERS`。运行 `python3 -m script.hassfest` 来更新它。
- [ ] 用户看到的所有内容都在 `strings.json` 中，而不是在代码里。参见[使字符串可翻译](https://www.hasscn.top/contributors/translate/guides/developers/)。

## 用户

- [ ] 任何移除或更改现有行为的内容都遵循[弃用流程](https://www.hasscn.top/contributors/core/development/deprecating/)。
- [ ] 向后不兼容的更改已在拉取请求中描述，供使用 Home Assistant 的用户了解。
- [ ] 如果用户可以看到此更改，则 [home-assistant.io](https://www.home-assistant.io/) 上的文档已在单独的拉取请求中更新。参见[编写文档](https://www.hasscn.top/contributors/writing/)。
