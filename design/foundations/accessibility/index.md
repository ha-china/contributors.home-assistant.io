# 无障碍

> 如何设计并构建一个人人都能使用的界面。适用的 WCAG 要求，以及 Home Assistant 前端在实践中如何满足这些要求。

Source: https://www.hasscn.top/contributors/design/foundations/accessibility/

Home Assistant 运行着许多人的家，他们以各种不同的方式看、听、移动和思考。有些人使用屏幕阅读器，有些人只用键盘，有些人使用大字体的手机，还有些人使用房间另一头的壁挂平板。无障碍（accessibility）正是让界面对所有人都可用的关键，它是每个设计和每个拉取请求（pull request）的一部分，而不是最后单独的一个步骤。

本页面以 [Web 内容无障碍指南（WCAG）2.2](https://www.w3.org/TR/WCAG22/) 为标准，并展示前端如何满足它。每个部分都区分两件事：

- **WCAG**：标准要求什么，并附上成功标准的编号以便查阅。A 级是最低要求，AA 级是应达到的水平，AAA 级则更进一步。
- **在前端中**：Home Assistant 代码目前做了什么，让你的设计或代码可以在其基础上构建，而不是绕过它。

前端审查清单要求界面对屏幕阅读器和键盘用户是无障碍的，前端样式指南要求为文本和基本 UI 元素保持 WCAG AA 级对比度。

## 对比度

**WCAG**

- 文本与其背景的对比度至少需要 4.5:1。大号文本，即 18 磅（24 CSS 像素）以上，或 14 磅（约 18.7 CSS 像素）的粗体文本，需要 3:1。（1.4.3 Contrast (Minimum)，AA）
- 控件中为使用它而必须看清的部分，例如文本输入框的边框或开关的滑块，以及有意义的图形（如图标），与相邻内容之间需要 3:1 的对比度。（1.4.11 Non-text Contrast，AA）
- 禁用的控件和纯装饰性元素可豁免。
- 颜色永远不能是区分某事的唯一方式。错误是红色的，同时它也会说明这是一个错误。（1.4.1 Use of Color，A）

**在前端中**

颜色来自[颜色令牌（color tokens）](https://www.hasscn.top/contributors/design/foundations/color/)。以下是常见文本与填充配对的对比度，由前端中默认亮色和暗色主题的令牌值计算得出：

| 配对 | 亮色 | 暗色 |
| --- | --- | --- |
| `--primary-text-color` on `--card-background-color` | 18.42:1 | 13.03:1 |
| `--primary-text-color` on `--primary-background-color` | 17.65:1 | 14.44:1 |
| `--secondary-text-color` on `--card-background-color` | 6.48:1 | 6.13:1 |
| `--ha-color-text-link` on `--card-background-color` | 3.26:1 | 8.80:1 |
| White text on `--ha-color-fill-primary-loud-resting` | 3.26:1 | 3.26:1 |
| White text on `--ha-color-fill-danger-loud-resting` | 4.59:1 | 7.04:1 |
| White text on `--ha-color-fill-success-loud-resting` | 4.58:1 | 7.03:1 |
| White text on `--ha-color-fill-warning-loud-resting` | 2.21:1 | 7.00:1 |
| `--ha-color-on-primary-normal` on `--ha-color-fill-primary-normal-resting` | 2.85:1 | 7.42:1 |
| `--ha-color-on-danger-normal` on `--ha-color-fill-danger-normal-resting` | 5.61:1 | 5.56:1 |
| `--ha-color-focus`（焦点环）on `--card-background-color` | 2.88:1 | 5.91:1 |

在将某个配对用于新用途之前，请将其与上面的 WCAG 数值进行比较。安静（quiet）或普通（normal）填充上的文本使用对应的 `on` 令牌：例如 `--ha-color-fill-danger-normal-resting` 上使用 `--ha-color-on-danger-normal`，而不是任意你喜欢的红色。令牌系统中不存在的组合完全没有对比度保证，因此请自行检查，并在两种主题中都检查。

[警告（alert）](https://www.hasscn.top/contributors/design/components/alert/)是一个不单纯依赖颜色的好例子：每种类型在颜色旁边都有自己的图标。

## 焦点

**WCAG**

- 使用键盘时，你始终能看到哪个元素拥有焦点。（2.4.7 Focus Visible，AA）
- 获得焦点的元素不会被其他东西遮挡，例如粘性页脚或 toast。（2.4.11 Focus Not Obscured (Minimum)，AA）
- 焦点按合理的顺序移动。（2.4.3 Focus Order，A）
- 仅仅获得焦点绝不会触发更改，例如提交表单。（3.2.1 On Focus，A）
- 在 AAA 级，焦点指示器至少 2 CSS 像素粗，聚焦与未聚焦外观之间有 3:1 的对比度。（2.4.13 Focus Appearance，AAA）

**在前端中**

- 基于 Web Awesome 构建的组件，例如[按钮](https://www.hasscn.top/contributors/design/components/button/)、[文本输入框](https://www.hasscn.top/contributors/design/components/input/)和[开关](https://www.hasscn.top/contributors/design/components/switch/)，共享同一个焦点环：一条 2 像素的实线，距元素 2 像素，颜色为 `--ha-color-focus`。相关令牌是 `--wa-focus-ring-style`、`--wa-focus-ring-width`、`--wa-focus-ring-offset` 和 `--wa-focus-ring-color`。
- 大型设备[控件](https://www.hasscn.top/contributors/design/components/controls/)，例如控制按钮、开关和滑块，在 `:focus-visible` 上用盒阴影绘制自己的 2 像素环，颜色与控件一致。
- 焦点样式使用 `:focus-visible`，因此焦点环对键盘用户显示，而对触摸和鼠标用户不碍事。
- 对话框打开时，会将焦点移到带有 `autofocus` 属性的元素上。[表单](https://www.hasscn.top/contributors/design/components/form/)等组件会将该焦点传递给它们的第一个字段。
- 当表单被校验且某个字段无效时，焦点会移到第一个有问题的字段。

绝不要在移除焦点环时不放置一个可见的替代品。

## 键盘

**WCAG**

- 凡是能用指针完成的事，都能用键盘完成。（2.1.1 Keyboard，A）
- 焦点绝不会卡在某个组件中。（2.1.2 No Keyboard Trap，A）
- 单字符快捷键可以被关闭或重新映射。（2.1.4 Character Key Shortcuts，A）
- 悬停或聚焦时显示的内容，例如工具提示（tooltip），可以被关闭、本身可被悬停，并且在你移开之前保持显示。（1.4.13 Content on Hover or Focus，AA）

**在前端中**

- 使用原生元素和 `ha-*` 组件，而不是自己构建控件。带有 `click` 监听器的 `<div>` 完全无法用键盘访问。
- 选择器（picker）有完整的键盘模型：方向键在列表中移动，<kbd>Home</kbd> 和 <kbd>End</kbd> 跳到第一项和最后一项，<kbd>Page Up</kbd> 和 <kbd>Page Down</kbd> 翻页，<kbd>Enter</kbd> 选中。当你在列表中移动时，焦点保持在搜索框中。参见[实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)。
- Home Assistant 有全局快捷键，例如 <kbd>e</kbd> 搜索实体，<kbd>Shift</kbd> + <kbd>?</kbd> 显示快捷键列表。用户可以在其个人资料中的**键盘快捷键**下关闭它们。在代码中，快捷键通过 `ShortcutManager` 处理，当你在字段中输入时它会被忽略。
- [工具提示](https://www.hasscn.top/contributors/design/components/tooltip/)在悬停和聚焦时都会显示，因此键盘用户也能得到同样的提示。

## 标签与无障碍名称

**WCAG**

- 每个控件都有一个辅助技术（assistive technology）可以读出的名称，并暴露其角色和状态，例如“开关，开启”。（4.1.2 Name, Role, Value，A）
- 字段有可见的标签或说明。（3.3.2 Labels or Instructions，A）
- 当控件有可见文本时，其无障碍名称（accessible name）包含该文本，这样使用语音控制的人可以说出他们看到的内容。（2.5.3 Label in Name，A）
- 你看到的结构，例如标题和列表，也存在于标记（markup）中。（1.3.1 Info and Relationships，A）

**在前端中**

- 为每个字段提供 `label`。[文本输入框](https://www.hasscn.top/contributors/design/components/input/)、[多行文本框](https://www.hasscn.top/contributors/design/components/textarea/)以及[表单](https://www.hasscn.top/contributors/design/components/form/)中的字段会将其渲染为真正的标签。占位符（placeholder）不是标签：一旦有人开始输入它就消失了。
- 图标按钮没有可见文本，因此它的 `label` 是它唯一的名称。`ha-icon-button` 将其用作无障碍名称和工具提示，并对屏幕阅读器隐藏图标本身。
- 必填字段在标签后显示 `*`。辅助文本位于字段下方。
- 对话框需要标题。`ha-dialog` 使用其 `header-title` 作为对话框的无障碍名称。当标题是插槽（slot）中的自定义内容时，请改为设置 `accessibleLabel`。
- 所有可见文本，包括无障碍名称，都经过翻译系统。参见 [UI 文本](https://www.hasscn.top/contributors/design/ui-text/)。

## 目标尺寸

**WCAG**

- 指针目标至少为 24×24 CSS 像素，或者周围有足够的空间，使得围绕每个目标的 24 像素圆不会与另一个重叠。（2.5.8 Target Size (Minimum)，AA）
- 在 AAA 级，目标至少为 44×44 CSS 像素。（2.5.5 Target Size (Enhanced)，AAA）

**在前端中**

- [按钮](https://www.hasscn.top/contributors/design/components/button/)默认高度为 40 像素。尺寸从 24 像素的 `xs`，到 32 像素的 `s`，再到 48 像素的 `l`。
- 图标按钮默认为 48×48 像素。
- 前端审查指南要求交互区域足够大以便触摸，因此请将 24 像素视为底线，而不是目标。

## 动效

**WCAG**

- 任何自动移动、闪烁或滚动超过五秒的内容，都可以被暂停、停止或隐藏。（2.2.2 Pause, Stop, Hide，A）
- 在 AAA 级，由交互触发的动效可以被关闭，除非它是必需的。（2.3.3 Animation from Interactions，AAA）

**在前端中**

当操作系统请求减少动效（`prefers-reduced-motion: reduce`）时，前端将所有动画时长令牌设置为 1 毫秒。对话框、骨架加载器、波纹效果、侧边栏以及若干卡片也会关闭自己的动画。使用时长令牌，动效就会自动遵循该设置。参见[动效](https://www.hasscn.top/contributors/design/foundations/motion/)。

## 屏幕阅读器与状态消息

**WCAG**

- 关于状态更改的消息，例如“已保存”或错误，无需移动焦点即可传达给屏幕阅读器用户。（4.1.3 Status Messages，AA）
- 错误以文本说明哪个字段有误以及错在哪里。（3.3.1 Error Identification，A）
- 当已知修复方法时，错误会给出建议。（3.3.3 Error Suggestion，AA）

**在前端中**

- [警告（alert）](https://www.hasscn.top/contributors/design/components/alert/)具有 `role="alert"`。大多数屏幕阅读器会在警告出现时立即播报。页面加载时已经存在的警告通常不会被播报，因此不要依赖它来传达人们必须听到的内容。
- toast，即屏幕底部的短消息，具有 `role="status"`，会以不打断的方式礼貌地播报。
- 当[文本输入框](https://www.hasscn.top/contributors/design/components/input/)无效时，它会设置 `aria-invalid`，其校验消息会替换辅助文本并被播报。
- [加载指示器（spinner）](https://www.hasscn.top/contributors/design/components/spinner/)基于 Web Awesome 的 spinner 构建，它具有进度条的角色和一个已翻译的“加载中”标签。

## 检查你的工作

在你分享设计或打开拉取请求之前：

1. 只用键盘使用它。你能到达所有地方、看到焦点在哪里，并能退出来吗？
2. 检查每个新颜色配对的对比度，在亮色和暗色主题下都要检查。
3. 在操作系统中开启减少动效，检查没有重要的东西依赖于动画。
4. 用屏幕阅读器试用它，例如 VoiceOver、TalkBack 或 NVDA。每个控件都能说出它是什么吗？
5. 将浏览器缩放到 200%，并在手机上试用。

## 相关内容

- [颜色](https://www.hasscn.top/contributors/design/foundations/color/)：对比度表格背后的令牌。
- [模式](https://www.hasscn.top/contributors/design/patterns/)：表单、错误和加载，以及它们的无障碍细节。
- [UX 设计讨论](https://github.com/OpenHomeFoundation/ux-design/discussions)中的 **Accessibility** 分类，以及[前端仓库](https://github.com/home-assistant/frontend/labels/Accessibility)中的 `Accessibility` 标签。
