---
title: 将部分README内容排除在Marketplace之外
description: 标记README中仅适用于GitHub的部分，如安装步骤和安装徽章，Marketplace将不会显示这些内容。
date: 2026-11-25
authors:
  - Aidan Timson
areas:
  - marketplace
---

你的README承担两项工作。在GitHub上，它是人们找到你仓库的地方，因此它告诉他们如何安装，通常带有[My链接](/glossary/my-link/)徽章或安装徽章。在Marketplace中，它显示在你仓库页面上，位于安装按钮正下方。在那里，这些安装步骤反而碍事。

从Home Assistant 2026.12开始，一个README可以同时满足两种用途。将仅适用于GitHub的部分放在两个HTML注释之间，Marketplace将不会显示它们：

```markdown title="README.md"
# 3D printer dashboard

Keep an eye on every print: progress, temperatures, and the camera...

<!-- ha-marketplace:exclude-start -->
## Installation

Add this repository in the Marketplace, or install it through HACS.
<!-- ha-marketplace:exclude-end -->

...

## Configuration

...
```

GitHub不显示HTML注释，因此在那里你的README阅读起来和以前一样。

## 详细信息

- 一个区块从起始标记开始，到下一个结束标记结束。如果没有结束标记，则一直延伸到README末尾。
- 标记内的空格是可选的，因此`<!--ha-marketplace:exclude-start-->`同样有效。
- 代码块或行内代码中的标记被视为文本，而非标记。这样，模板README可以将它们作为示例展示。
- 你可以标记任意数量的区块。

## 生效时间

从Home Assistant 2026.12及其测试版开始，Marketplace将排除标记的区块。旧版本会像现在一样显示整个README，因此你现在就可以添加标记。

## 了解更多

- [将部分README内容排除在Marketplace之外](/marketplace/reference/repository-structure/#leave-part-of-your-readme-out-of-the-marketplace)：参考文档，与你的仓库所需的其他所有内容并列。
- [前端中的更改](https://github.com/home-assistant/frontend/pull/55571)：Marketplace如何找到这些标记。
