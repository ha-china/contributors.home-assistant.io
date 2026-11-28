# 使用透明的依赖项

> 铜级（Bronze）规则 dependency-transparency：依赖项必须是开源的、发布在 PyPI 上，并通过公开的 CI 构建和发布。

Source: https://www.hasscn.top/contributors/core/quality-scale/dependency-transparency/

这是一条铜级（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `dependency-transparency`。

集成所依赖的每个 Python 软件包，即其[依赖项（requirements）](https://www.hasscn.top/contributors/glossary/requirement/)，都必须满足以下要求：

- 源代码以 OSI 认可的许可证提供。
- 该软件包已发布在 PyPI 上。
- PyPI 上的软件包是通过公开的 CI 流水线构建和发布的。
- PyPI 上的每个版本都对应公开仓库中一个带有标签（tag）的发布版本。

## 为什么这很重要

Home Assistant 会在每次发布时，将每个集成的依赖项一同分发给每一位用户。因此项目必须能够信任这些依赖项。当源代码公开、构建过程公开、每个发布版本都带有标签时，任何人都可以看到最终运行在数百万个系统上的是哪些代码，以及它们是如何到达那里的。而在某人的笔记本电脑上构建、再手动上传的软件包无法提供这样的保障。

## 该怎么做

通常，这个依赖项是一个与设备或服务通信的库，你可以自己编写，也可以为现有的库做贡献：

- 在公开仓库中发布源代码，并使用 OSI 认可的许可证，例如 MIT 或 Apache 2.0。
- 通过 CI 发布，例如使用一个 GitHub Actions 工作流，在你发布（release）时构建软件包并将其发布到 PyPI。PyPI 的受信任发布（trusted publishing）功能让这件事变得非常简单。
- 在仓库中为每个发布版本打上标签，标签版本与 PyPI 上的版本保持一致。

然后在 `manifest.json` 的 `requirements` 中固定确切版本，例如 `"requirements": ["mylibrary==1.2.3"]`。

## 如何检查

- Hassfest 要求核心集成的每个依赖项都必须使用 `==` 固定到确切版本。
- CI 会审查所有依赖项的许可证，当找不到 OSI 认可的许可证时会判定失败，除非该软件包在 core 仓库 [`script/licenses.py`](https://github.com/home-assistant/core/blob/dev/script/licenses.py) 的已知例外清单中。
- 软件包是否在公开 CI 中构建并对应带有标签的发布版本，会在代码审查中检查。请在你的 pull request 中附上发布工作流和标签的链接。

## 例外情况

如果集成没有任何外部依赖项，则此规则不适用。

## 相关规则

- [async-dependency](https://www.hasscn.top/contributors/core/quality-scale/async-dependency/)：使用异步依赖项。
