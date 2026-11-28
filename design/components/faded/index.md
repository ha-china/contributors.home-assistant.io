# 渐隐（Faded）

> 渐隐内容显示长文本的开头，其余部分淡出，直到用户选择它为止。

Source: https://www.hasscn.top/contributors/design/components/faded/

Live demo of `ha-faded`.

```html
<ha-faded>
  <div>
    <p>本次发布带来了新的能源仪表盘、更快的启动速度，以及一长串修复。自动化编辑器现在会显示最后触发了哪些触发器，让你一眼就能看出自动化为什么运行。</p>
    <p>多个集成新增了实体，一些较旧的选项从 YAML 迁移到了用户界面。更新前请查看不向后兼容的变更，尤其是当你为仪表盘使用自定义模板时。</p>
    <p>感谢所有测试 beta 版、报告问题并翻译新字符串的人。</p>
  </div>
</ha-faded>
```

## 概述

渐隐内容显示长文本的前几行，其余部分在底部淡出。点击文本的任意位置即可显示全部内容。前几行能让用户判断是否想继续阅读。

## 何时使用

在以下情况使用渐隐内容：

- 可选阅读的文本，例如发行说明或较长的描述

不要在以下情况使用渐隐内容：

- 用户需要的任何内容，例如警告或操作。请将其放在渐隐区域之外。
- 所有人（包括键盘用户）都需要展开和收起的内容。请使用[展开面板（expansion panel）](https://www.hasscn.top/contributors/design/components/expansion-panel/)。
- 单行过长的文本。请使用[跑马灯文本（marquee text）](https://www.hasscn.top/contributors/design/components/marquee-text/)，或让其换行。

## 结构

1. **容器（Container）**：在渐隐高度处裁剪内容，并接收打开它的选择操作
2. **内容（Content）**：默认插槽中的元素
3. **渐隐（Fade）**：覆盖在容器上的遮罩，从完全可见渐变到底部透明

## 变体

### 高度

默认情况下，内容在 102 像素处被裁剪。高度可以更改。

Live demo of `ha-faded`.

```html
<ha-faded faded-height="48">
  <div>
    <p>前门传感器报告门的开合状态和电池电量。它在门移动后一秒内更新，并在没有动静时每小时签到一次。</p>
    <p>将其安装在门框上，磁铁安装在门本身上，两者间距不超过一厘米。</p>
    <p>电池续航约两年，其电量显示为一个单独的传感器。</p>
  </div>
</ha-faded>
```

## 行为

- **渐隐（Faded）**：内容在渐隐高度处被裁剪，底部淡出，指针变为手形。
- **展开（Open）**：点击内容的任意位置即可显示全部内容。一旦展开，就会保持展开状态。无法再次收起。
- **短内容（Short content）**：当内容比渐隐高度高出不超过 50 像素时，会直接完整显示。只隐藏一两行会让用户多点击一次，却几乎不节省空间。

Live demo of `ha-faded`. 短内容会完整显示。

```html
<ha-faded>
  <div>本次更新只修复了几个小 bug。</div>
</ha-faded>
```

## 规格

| 属性 | 值 |
| --- | --- |
| 渐隐高度 | 默认 102px |
| 内容最多高出多少时完整显示 | 渐隐高度加 50px |
| 渐隐 | 自上而下的线性渐变：到高度 25% 处完全可见，然后在底部渐变为透明 |
| 渐隐时的指针 | `pointer` |
| 展开时的指针 | `default` |

该组件自身不设置任何颜色、间距或字体。内容保留其周围页面的样式。

## 指南

Do and don't, as live demos.

**Do:** 将可选阅读的内容放在渐隐区域之后。

```html
<ha-faded faded-height="48">
    <div>
      <p>本次发布带来了新的能源仪表盘、更快的启动速度，以及一长串修复。</p>
      <p>多个集成新增了实体，一些较旧的选项从 YAML 迁移到了用户界面。</p>
      <p>感谢所有测试 beta 版、报告问题并翻译新字符串的人。</p>
    </div>
  </ha-faded>
```

**Don't:** 将用户需要的警告或操作隐藏在渐隐区域之后。

```html
<ha-faded faded-height="48">
    <div>
      <p>本次发布带来了新的能源仪表盘、更快的启动速度，以及一长串修复。</p>
      <p>多个集成新增了实体，一些较旧的选项从 YAML 迁移到了用户界面。</p>
      <p>更新前请备份你的配置。本次更新无法撤销。</p>
    </div>
  </ha-faded>
```

## 无障碍

### 键盘

渐隐内容没有键盘交互。它只能通过指针或触摸打开，因此键盘用户无法打开它。这是将用户需要的内容放在渐隐区域之外的另一个原因。

### 屏幕阅读器

屏幕阅读器可以读取完整文本，即使它处于渐隐状态。它们不会听到还有更多内容，也不会听到它可以被展开。

### 在代码中

- 容器没有 role，不可聚焦，也没有展开或收起状态。
- 隐藏部分只是被裁剪和遮罩。它仍保留在页面中。

## 相关内容

- [展开面板（Expansion panel）](https://www.hasscn.top/contributors/design/components/expansion-panel/)：所有人都可以展开和收起的内容
- [跑马灯文本（Marquee text）](https://www.hasscn.top/contributors/design/components/marquee-text/)：单行过长无法容纳的文本

## 代码中

该元素是 `<ha-faded>`。

```html
<ha-faded faded-height="80">
  <div>A long text...</div>
</ha-faded>
```

将内容包裹在一个元素中。高度是根据插槽中的元素测量的，而纯文本没有可供测量的元素。直接放在 `<ha-faded>` 中的纯文本总是会渐隐，即使内容很短。

高度只在组件首次渲染时测量一次。对于稍后渲染的内容（例如 markdown），`ha-markdown` 会在完成后触发 `content-resize` 事件，组件会再次测量。

### 属性

- `faded-height`：内容被裁剪处的高度（像素）。默认为 `102`。

### 插槽

- 默认：内容。

来源：[`src/components/ha-faded.ts`](https://github.com/home-assistant/frontend/blob/dev/src/components/ha-faded.ts)
