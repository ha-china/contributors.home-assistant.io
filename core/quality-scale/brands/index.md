# 提供品牌资产

> 铜牌规则 brands：该集成在 brands 仓库中拥有 logo 和图标。

Source: https://www.hasscn.top/contributors/core/quality-scale/brands/

这是一条铜牌（Bronze）规则。在 `quality_scale.yaml` 中，它被称为 `brands`。

该集成在 [brands 仓库](https://github.com/home-assistant/brands) 中拥有其品牌资产，例如图标和 logo。

## 为什么重要

用户在阅读集成名称之前很久，就能通过其 logo 认出该集成：无论是在集成列表中、设置对话框中，还是在文档的集成页面上。遵循相同要求的资产能让所有集成保持外观一致，并使每个集成都易于辨认。

## 需要做什么

在 brands 仓库上创建一个 pull request，在 [`core_integrations/`](https://github.com/home-assistant/brands/tree/master/core_integrations) 中以集成域（domain）命名的文件夹内添加集成所需的图片。[brands 仓库的 README](https://github.com/home-assistant/brands/blob/master/README.md) 列出了所需的文件、它们的尺寸以及图片要求。请尽早完成这项工作：当品牌资产已经就位时，core 中的集成 pull request 会更容易通过审核。

## 如何检查

在审核（review）时检查。

## 例外情况

此规则没有例外情况。
