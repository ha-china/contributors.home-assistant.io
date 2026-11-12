---
title: 页面结构
description: 围绕读者想了解或想做的事情来组织文档，包括概念、任务、参考、教程和故障排除。
order: 1
---

每位读者都是带着问题而来的。这是什么？我该如何设置？这个设置有什么作用？为什么它不工作？好的文档应该围绕这些问题来组织，而不是围绕功能是如何构建的。

这种方法称为基于主题的写作（topic-based authoring）。一个主题回答一个主要问题。它可以是一整页，也可以是页面中的单个章节。你不需要为每个主题单独建一个页面。

集成（integration）、触发器（trigger）、条件（condition）和动作（action）页面有各自固定的结构，因此它们的阅读方式都是一致的。对于这些页面，请从[编写集成文档](/writing/guides/integration/)和[集成页面](/writing/reference/integration-page/)参考开始。本页的指导则适用于其中的每个章节。

## 从概述开始

每页都以简短的介绍开头：这一页讲什么，面向谁。然后从基础到复杂逐步展开。大多数读者需要的信息放在前面，少数读者需要的细节放在后面。将较长的页面拆分为带有清晰标题的章节，以便读者能直接跳转到他们需要的部分。

## 界面优先

当某件事可以在 Home Assistant 界面中完成时，界面（UI）就是标准方式，你应该首先描述它。这适用于所有类型的主题：任务、参考、教程和故障排除。

在受支持且有用的地方，欢迎提供 YAML 和命令行替代方案。将它们放在界面说明之后，放在各自的标题下，并说明什么情况下需要用到它们。当界面可以完成工作时，不要暗示编辑文件是设置过程的常规部分。

## 每个章节一个目的

文档中最常见的问题是，一个章节试图同时做所有事情：解释概念、逐步演示操作、并列出所有选项。这样读者就得费力去挖掘他们需要的部分。

为每个目的设置各自的标题。例如，一个关于区域（area）的页面可以包含三个主题：

```markdown
## Areas
<!-- Concept: what an area is, and why you would use one. -->

## Creating an area
<!-- Task: the steps to create one. -->

## Area settings
<!-- Reference: every setting, and what it means. -->
```

让每个主题聚焦于一个主题或目标：

- 概念解释一个想法。
- 任务完成一个目标。
- 参考描述一组相关的事实或选项。
- 故障排除主题处理一个问题。
- 教程可以组合多个任务，只要它们服务于同一个学习目标。

当你发现自己在描述第二个任务时，就为它单独设立一个主题。如果创建区域需要先创建楼层，那么楼层的步骤就应有自己的章节，可以在同一页上，也可以在另一页上。从区域步骤中链接过去。直接促成任务结果的步骤应放在一起。

并非每一句上下文说明都需要单独的章节。简短的介绍、前提条件，或解释某个步骤为何重要的一句话，就应该紧挨着该步骤放置。较长的背景说明和完整的选项列表才是应该移出去的内容。

一个父级标题可以通过子标题将多个主题归为一组。故障排除章节可以为每个问题设置一个详情折叠块。只需确保每个标题下的内容与该标题所承诺的一致。

## 选择主题类型

根据读者的需求来选择类型：

- [概念](#concept)：理解某事物是什么、为什么重要，或它如何工作。
- [任务](#task)：完成一个具体目标。
- [参考](#reference)：查找某个事实、设置、取值或行为。
- [教程](#tutorial)：通过跟随一个最终能得到可用结果的引导式练习来学习。
- [故障排除](#troubleshooting)：识别问题并解决它。

主题内容并不决定类型。区域可以同时是概念、任务和参考的主题，如上面的示例所示。界面和 YAML 也不是类型：它们是完成任务或描述配置的两种方式。

## 概念

概念解释某事物是什么，并帮助读者理解它。用于定义、事物之间的相互关系、设计选择，以及使用某项功能的理由。

### 概念的标题

- 使用名词或描述性短语："Areas"、"Parts of an automation" 或 "Wake word processing"。
- 当问题能更清楚地表达读者想了解的内容时，可以使用问句："What is data polling?"
- 避免使用 "Introduction" 或 "Overview"，除非你能直接说出主题的名称。

### 概念的内容

从平实的解释开始。添加一个具体的例子，并解释重要的关系或权衡。定义不熟悉的术语，或链接到其定义，例如使用[术语表提示](/writing/reference/liquid/#glossary-tooltips)。

```markdown
## Areas

An area groups devices and entities that belong to a room or another part of your home. For example, a living room area lets you target all the lights in that room with one action.
```

不要在概念中包含设置说明，而是链接到相应的任务。一个变成选项列表或一长串界面步骤的概念就不再是概念了：把选项放到参考主题中，并链接过去。

## 任务

任务帮助读者达成一个具体目标。读者想把事情做完，而不是上一堂课。

### 任务的标题

- Name the action and its object: "Creating an area", not "Task".
- An `-ing` phrase, like "Creating an area" or "Updating Home Assistant", matches what most existing pages use.
- An imperative works well for the stages of a longer procedure: "Write the image to your SD card". Number the stages when their order matters.
- Keep sibling headings parallel. If one starts with an `-ing` verb, they all do.
- Avoid vague headings like "Usage", "Configuration", or "Working with areas" when the task has a more specific outcome.

### 任务的内容

1. If the heading does not make it clear, say in a few sentences when or why you would do this, and link to relevant information.
2. List the prerequisites directly before the steps, under a `Prerequisites:` lead-in, like hardware, permissions, or setup that must be done first. Use a separate `## Prerequisites` section only when the requirements apply to the whole page. No prerequisites worth mentioning? Leave the list out.
3. Write the steps as a numbered list. Start each step with the instruction. Put explanations or the expected result below it.
4. End with the outcome and, when useful, a way to check that it worked.

```markdown
## Creating an area

1. Go to {% my areas title="**Settings** > **Areas, labels & zones**" %} and select **Create area**.
2. Enter a **Name** for the area.
3. Select **Create**.
   - Result: The new area appears in the list.
```

让步骤聚焦于目标。冗长的解释、对每个字段的描述以及其他流程应放在别处。改为链接到概念或参考。

## 参考

参考包含读者查阅的事实，无需遵循某个流程。用于设置、支持的取值、语法、响应数据以及其他已定义的行为。

### 参考的标题

- 写出信息的名称："Area settings"、"Blueprint inputs" 或 "Response data"。
- 当内容有更具体的主题时，避免使用 "Important information" 或 "Good to know" 这类大而全的标题。

### 参考的内容

- **每个条目使用相同的结构。** 对于设置，在适用的情况下给出名称、作用、可接受的取值和默认值。
- **清楚标明必填和可选。**
- **使用读者看到的名称。** 界面设置用界面标签，YAML 选项用确切的键名。
- **将约束条件放在其适用的设置旁边，** 而不是放在下面单独的列表中。
- **便于快速浏览。** 使用列表，或[集成页面](/writing/reference/integration-page/)中描述的配置块。避免使用表格，参见[风格指南](/writing/reference/style/#tables)。

```markdown
## Area settings

- **Name**: The name of the area. Required.
- **Alias**: Another name a voice assistant can use for the area.
```

简短的示例可以展示有效的取值或正确的语法。不要让它演变成教程，也不要把设置步骤藏在字段描述中。

## 教程

教程通过一个引导式的示例来教授一项技能。结束时，读者会得到一个可用的成果，可以保留或修改它。

教程与任务的区别在于目的，而不是难度。任务帮助读者完成他们自己的工作。教程给读者提供一个可以学习的练习。一个简单的流程并不自动就是教程，而教程也可以教授复杂的内容。

### 教程的标题

- 标题以 "Tutorial:" 开头，后接动作和结果："Tutorial: Create your first automation"。
- 按读者在每个阶段所做的事情来命名各阶段，并保持措辞一致。
- 当阶段的顺序很重要时，为阶段编号。

### 教程的内容

说明读者将构建什么、学到什么，以及开始之前需要什么。然后引导他们沿着一条选定的路径前进，每个阶段都足够小、便于跟随。在过程中展示预期结果，并以最终检查收尾。

```markdown
## What you will build
<!-- An automation that turns on a light before sunset. -->

## Prerequisites

## Step 1: Create the automation

## Step 2: Add the sunset trigger

## Step 3: Add the light action

## Step 4: Save and test the automation

## Next steps
```

- 让解释紧挨着它所辅助的步骤。
- 链接到概念和参考，而不是在练习中插入它们。
- 不要在过程中展示每个替代方案或可选功能。将扩展内容放在主练习之后，例如放在 "Next steps" 之下。
- 一堆代码示例不是教程。教程引导读者经历一个学习过程。

## 故障排除

A troubleshooting topic helps the reader recognize a problem and recover from it.

### Where troubleshooting goes

Keep the troubleshooting for a page in one place, so the reader knows where to look when something goes wrong:

- In a section of the page: put the problems in a `## Troubleshooting` section at the end of the page. On an integration page, the section goes in its place in the [section order](/writing/reference/integration-page/#sections).
- On a page of its own: when a feature has many problems, move them to a separate troubleshooting page. Link to it from the page of the feature.

Do not put troubleshooting next to the part of the page it relates to, like a troubleshooting subsection under one feature or setting.
Put the problem in the troubleshooting section of the page instead.
When it helps, link to the troubleshooting section from the part of the page it relates to.

### 故障排除的标题

- Put each problem in its own [collapsible details block](/writing/reference/liquid/#collapsible-details).
- Use the symptom or the exact error message as the title of the block, like `Can't access Home Assistant in my browser` or `Stuck at "Preparing Home Assistant"`.
- For a separate troubleshooting page, use "Troubleshooting" followed by the subject: "Troubleshooting Assist".
- Avoid titles that only make sense once you know the cause. The reader searches for what they see, not for what is wrong.

### 故障排除的内容

在每个块内，使用相同的三个部分：

1. **症状：** 读者看到的现象，用他们的话描述。如有错误消息，请包含确切的错误消息。
2. **描述：** 在有帮助时说明发生了什么。不要把可能的原因当作确定的原因来陈述。
3. **解决方法：** 该怎么做。把简单的检查放在复杂的检查之前，在读者执行某个操作之前解释它的作用，并告诉他们如何确认问题已解决。

当某个部分没有提供任何价值时可以省略，例如对于非常简短的主题可以省略描述。它在页面上的样子如下：

```liquid
## Troubleshooting

{% details "The device shows as unavailable" %}

### Symptom

All entities of the device show as unavailable.

#### Description

Home Assistant can't reach the device on your network. This often happens when the device gets a new IP address from your router.

#### Resolution

1. Check that the device is powered on and connected to your network.
2. Give the device a fixed IP address in your router.
3. Go to {% my integrations title="**Settings** > **Devices & services**" %}, select the integration, and reload it.

The entities become available again within a minute.

{% enddetails %}
```

如果这些检查没有解决问题，请链接到合适的求助渠道，并说明应提供哪些信息，例如日志或诊断信息。仅提供一个社区论坛链接并不算故障排除。

把常规的设置步骤保留在任务主题中。当遗漏某个设置步骤可能是问题的原因时，链接到那个任务，而不是重复它。
