---
title: 仪表盘编辑器中的自定义分区策略
description: 自 Home Assistant 2026.11 起，可以注册自定义分区策略，用户可从仪表盘编辑器中添加它们，并带有实时预览。
date: 2026-10-28
authors:
  - Paul Bottein
areas:
  - frontend
---

自 Home Assistant 2026.11 起，可以注册自定义分区策略，就像自定义仪表盘策略一样。用户随后可在仪表盘编辑器中找到它们，无需编写任何 YAML 即可添加。

分区策略（section strategy）根据家中的内容生成分区视图中的一个分区，并保持其最新状态。

## 用户看到的内容

当用户在分区视图中创建分区时，Home Assistant 会询问他们想要手动分区、自动分区，还是复制的分区。**自动分区**列出内置的分区策略，以及注册在**社区分区**下的策略。每个策略都显示实时预览。选择其中一个会打开分区编辑器。

## 注册你的分区策略

向 `window.customStrategies` 推送一个条目，并设置 `strategyType: "section"`：

```js
window.customStrategies = window.customStrategies || [];
window.customStrategies.push({
  type: "my-domain",
  strategyType: "section",
  name: "My domain section",
  description: "Shows all the entities of one domain.",
});
```

## 显示预览

添加一个静态的 `getStubConfig(hass)`，返回你的分区初始配置。Home Assistant 使用它来渲染预览，并作为新分区的配置。如果没有它，磁贴将没有预览。

```js
class MyDomainSectionStrategy extends HTMLElement {
  static getStubConfig(hass) {
    return { type: "custom:my-domain", domain: "light" };
  }

  static async generate(config, hass) {
    // ...
  }
}

customElements.define(
  "ll-strategy-section-my-domain",
  MyDomainSectionStrategy
);
```

## 添加编辑器

选择你的分区后，用户会立即进入分区编辑器。添加一个静态的 `getConfigElement()`，以便他们获得你的选项的可视化编辑器。如果没有它，他们只能获得 YAML 编辑器。

请查看更新的 [自定义策略](/frontend/custom-ui/strategy/#a-section-strategy) 文档以了解更多详情。
