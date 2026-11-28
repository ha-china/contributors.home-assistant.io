# 主题变量

> 主题可以设置的每个变量，及其在浅色和深色模式下的默认值。

Source: https://www.hasscn.top/contributors/marketplace/reference/theme-variables/

<!-- 由 `pnpm theme-variables` 从 scripts/theme-variables/ 生成。请编辑那些文件，而不是此文件。 -->

[主题](https://www.hasscn.top/contributors/glossary/theme/)设置前端的变量。此页面列出了主题可以设置的变量及其默认值。有关如何编写主题以及大多数主题设置哪些变量的信息，请从[发布主题](https://www.hasscn.top/contributors/marketplace/guides/themes/)开始。

此页面上的表格是从前端源代码生成的，位于 `dev` 分支的 [`afcf7d4e08`](https://github.com/home-assistant/frontend/commit/afcf7d4e080b86bc2bf01e32070099e60dc74dab) 提交。变量可以在任何版本中重命名或删除，因此请在每个测试版中测试您的主题。

在主题文件中，变量前面没有 `--`，就像此页面显示的那样。在前端源代码和 CSS 中，它有：您主题中的 `primary-color` 在代码中是 `--primary-color`。

许多默认值指向另一个变量，例如 `var(--primary-color)`。这些变量会跟随该变量：更改 `primary-color`，所有默认值指向它的变量都会随之更改。因此，请先设置链条顶部的变量，并且只在需要不同效果的地方设置其下方的变量。

**深色**列显示前端在深色模式下使用的值（当它与浅色模式不同时）。**未设置**表示前端在该模式下未设置任何值，读取该变量的组件会使用它们自己的默认值。

## 设计令牌

较新的组件使用[设计令牌](https://www.hasscn.top/contributors/glossary/design-token/)，其名称以 `ha-` 开头。主题也可以设置它们。设计区域显示了其中几个及其用途，因此此处不再重复：

- [颜色](https://www.hasscn.top/contributors/design/foundations/color/)：调色板，如 `ha-color-primary-40`。设置主调色板以将您的颜色应用于较新的组件，如[发布主题](https://www.hasscn.top/contributors/marketplace/guides/themes/#the-design-tokens)所述。
- [间距](https://www.hasscn.top/contributors/design/foundations/spacing/)：间距比例，`ha-space-1` 到 `ha-space-20`，以及圆角比例，`ha-border-radius-*`。
- [排版](https://www.hasscn.top/contributors/design/foundations/typography/)：字体大小，`ha-font-size-*`。

其他令牌如下，按定义它们的前端文件分组，以及在同一文件中设置的一些较旧变量，如 `header-height`。

### 边框、圆角和动画

来自 [`src/resources/theme/core.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/core.globals.ts)。

| 变量 | 默认值 |
| --- | --- |
| `ha-border-width-sm` | `1px` |
| `ha-border-width-md` | `2px` |
| `ha-border-width-lg` | `3px` |
| `ha-picture-border-radius` | `var(--ha-border-radius-lg)` |
| `ha-picture-border-radius-sm` | `var(--ha-border-radius-sm)` |
| `ha-content-width-narrow` | `720px` |
| `ha-content-width-wide` | `1280px` |
| `ha-content-gutter` | `var(--ha-space-4)` |
| `ha-animation-duration-none` | `1ms` |
| `ha-animation-duration-instant` | `75ms` |
| `ha-animation-duration-fast` | `150ms` |
| `ha-animation-duration-normal` | `250ms` |
| `ha-animation-duration-slow` | `350ms` |

### 页眉和对话框

来自 [`src/resources/theme/main.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/main.globals.ts)。

| 变量 | 默认值 |
| --- | --- |
| `header-height` | `56px` |
| `ha-dialog-scrim-backdrop-filter` | `brightness(68%)` |

### 排版

来自 [`src/resources/theme/typography.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/typography.globals.ts)。

| 变量 | 默认值 |
| --- | --- |
| `ha-font-family-body` | `Roboto, Noto, sans-serif` |
| `ha-font-family-code` | `monospace` |
| `ha-font-family-longform` | `ui-sans-serif, system-ui, sans-serif` |
| `ha-font-size-scale` | `1` |
| `ha-font-weight-light` | `300` |
| `ha-font-weight-normal` | `400` |
| `ha-font-weight-medium` | `500` |
| `ha-font-weight-bold` | `700` |
| `ha-font-family-heading` | `var(--ha-font-family-body)` |
| `ha-font-weight-body` | `var(--ha-font-weight-normal)` |
| `ha-font-weight-heading` | `var(--ha-font-weight-bold)` |
| `ha-font-weight-action` | `var(--ha-font-weight-medium)` |
| `ha-line-height-condensed` | `1.2` |
| `ha-line-height-normal` | `1.6` |
| `ha-line-height-expanded` | `2` |
| `ha-font-smoothing` | `antialiased` |
| `ha-moz-osx-font-smoothing` | `grayscale` |

### 阴影

来自 [`src/resources/theme/semantic.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/semantic.globals.ts)。

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `ha-box-shadow-s` | `0 1px 2px 0 rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.12)` | `0 1px 2px 0 rgba(0, 0, 0, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.5)` |
| `ha-box-shadow-m` | `0 3px 6px -1px rgba(0, 0, 0, 0.1), 0 8px 16px -2px rgba(0, 0, 0, 0.15)` | `0 3px 6px -1px rgba(0, 0, 0, 0.35), 0 8px 16px -2px rgba(0, 0, 0, 0.45)` |
| `ha-box-shadow-l` | `0 6px 12px -3px rgba(0, 0, 0, 0.12), 0 16px 32px -6px rgba(0, 0, 0, 0.2)` | `0 6px 12px -3px rgba(0, 0, 0, 0.4), 0 16px 32px -6px rgba(0, 0, 0, 0.55)` |

### 纯色

来自 [`src/resources/theme/color/core.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/color/core.globals.ts)。

| 变量 | 默认值 |
| --- | --- |
| `ha-color-black` | `#000000` |
| `ha-color-white` | `#ffffff` |

### 语义颜色

来自 [`src/resources/theme/color/semantic.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/color/semantic.globals.ts)。

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `ha-color-focus` | `var(--ha-color-neutral-60)` | 相同 |
| `ha-color-text-primary` | `var(--ha-color-neutral-05)` | `var(--white-color)` |
| `ha-color-text-secondary` | `var(--ha-color-neutral-40)` | `var(--ha-color-neutral-80)` |
| `ha-color-text-disabled` | `var(--ha-color-neutral-60)` | 相同 |
| `ha-color-text-link` | `var(--ha-color-primary-40)` | `var(--ha-color-primary-60)` |
| `ha-color-text-primary-inverted` | `var(--ha-color-white)` | `var(--ha-color-black)` |
| `ha-color-text-secondary-inverted` | `var(--ha-color-neutral-20)` | `var(--ha-color-neutral-40)` |
| `ha-color-border-primary-quiet` | `var(--ha-color-primary-90)` | 相同 |
| `ha-color-border-primary-normal` | `var(--ha-color-primary-70)` | 相同 |
| `ha-color-border-primary-loud` | `var(--ha-color-primary-40)` | 相同 |
| `ha-color-border-neutral-quiet` | `var(--ha-color-neutral-90)` | `var(--ha-color-neutral-40)` |
| `ha-color-border-neutral-normal` | `var(--ha-color-neutral-60)` | `var(--ha-color-neutral-50)` |
| `ha-color-border-neutral-loud` | `var(--ha-color-neutral-40)` | `var(--ha-color-neutral-70)` |
| `ha-color-border-danger-quiet` | `var(--ha-color-red-90)` | 相同 |
| `ha-color-border-danger-normal` | `var(--ha-color-red-70)` | `var(--ha-color-red-50)` |
| `ha-color-border-danger-loud` | `var(--ha-color-red-40)` | `var(--ha-color-red-50)` |
| `ha-color-border-warning-quiet` | `var(--ha-color-orange-90)` | 相同 |
| `ha-color-border-warning-normal` | `var(--ha-color-orange-70)` | `var(--ha-color-orange-50)` |
| `ha-color-border-warning-loud` | `var(--ha-color-orange-40)` | `var(--ha-color-orange-50)` |
| `ha-color-border-success-quiet` | `var(--ha-color-green-90)` | 相同 |
| `ha-color-border-success-normal` | `var(--ha-color-green-70)` | 相同 |
| `ha-color-border-success-loud` | `var(--ha-color-green-40)` | 相同 |
| `ha-color-fill-primary-quiet-resting` | `var(--ha-color-primary-95)` | `var(--ha-color-primary-05)` |
| `ha-color-fill-primary-quiet-hover` | `var(--ha-color-primary-90)` | `var(--ha-color-primary-10)` |
| `ha-color-fill-primary-quiet-active` | `var(--ha-color-primary-95)` | `var(--ha-color-primary-05)` |
| `ha-color-fill-primary-normal-resting` | `var(--ha-color-primary-90)` | `var(--ha-color-primary-10)` |
| `ha-color-fill-primary-normal-hover` | `var(--ha-color-primary-80)` | `var(--ha-color-primary-20)` |
| `ha-color-fill-primary-normal-active` | `var(--ha-color-primary-90)` | `var(--ha-color-primary-10)` |
| `ha-color-fill-primary-loud-resting` | `var(--ha-color-primary-40)` | 相同 |
| `ha-color-fill-primary-loud-hover` | `var(--ha-color-primary-30)` | 相同 |
| `ha-color-fill-primary-loud-active` | `var(--ha-color-primary-40)` | 相同 |
| `ha-color-fill-neutral-quiet-resting` | `var(--ha-color-neutral-95)` | `var(--ha-color-neutral-05)` |
| `ha-color-fill-neutral-quiet-hover` | `var(--ha-color-neutral-90)` | `var(--ha-color-neutral-10)` |
| `ha-color-fill-neutral-quiet-active` | `var(--ha-color-neutral-95)` | `var(--ha-color-neutral-00)` |
| `ha-color-fill-neutral-normal-resting` | `var(--ha-color-neutral-90)` | `var(--ha-color-neutral-10)` |
| `ha-color-fill-neutral-normal-hover` | `var(--ha-color-neutral-80)` | `var(--ha-color-neutral-20)` |
| `ha-color-fill-neutral-normal-active` | `var(--ha-color-neutral-90)` | `var(--ha-color-neutral-10)` |
| `ha-color-fill-neutral-loud-resting` | `var(--ha-color-neutral-40)` | `var(--ha-color-neutral-60)` |
| `ha-color-fill-neutral-loud-hover` | `var(--ha-color-neutral-30)` | `var(--ha-color-neutral-70)` |
| `ha-color-fill-neutral-loud-active` | `var(--ha-color-neutral-40)` | `var(--ha-color-neutral-60)` |
| `ha-color-fill-disabled-quiet-resting` | `var(--ha-color-neutral-95)` | `var(--ha-color-neutral-10)` |
| `ha-color-fill-disabled-quiet-hover` | `var(--ha-color-neutral-90)` | `var(--ha-color-neutral-20)` |
| `ha-color-fill-disabled-normal-resting` | `var(--ha-color-neutral-95)` | `var(--ha-color-neutral-20)` |
| `ha-color-fill-disabled-normal-hover` | `var(--ha-color-neutral-90)` | `var(--ha-color-neutral-30)` |
| `ha-color-fill-disabled-loud-resting` | `var(--ha-color-neutral-80)` | `var(--ha-color-neutral-30)` |
| `ha-color-fill-disabled-loud-hover` | `var(--ha-color-neutral-70)` | `var(--ha-color-neutral-40)` |
| `ha-color-fill-danger-quiet-resting` | `var(--ha-color-red-95)` | `var(--ha-color-red-05)` |
| `ha-color-fill-danger-quiet-hover` | `var(--ha-color-red-90)` | `var(--ha-color-red-10)` |
| `ha-color-fill-danger-quiet-active` | `var(--ha-color-red-95)` | `var(--ha-color-red-05)` |
| `ha-color-fill-danger-normal-resting` | `var(--ha-color-red-90)` | `var(--ha-color-red-10)` |
| `ha-color-fill-danger-normal-hover` | `var(--ha-color-red-80)` | `var(--ha-color-red-20)` |
| `ha-color-fill-danger-normal-active` | `var(--ha-color-red-90)` | `var(--ha-color-red-10)` |
| `ha-color-fill-danger-loud-resting` | `var(--ha-color-red-50)` | `var(--ha-color-red-40)` |
| `ha-color-fill-danger-loud-hover` | `var(--ha-color-red-40)` | `var(--ha-color-red-30)` |
| `ha-color-fill-danger-loud-active` | `var(--ha-color-red-50)` | `var(--ha-color-red-40)` |
| `ha-color-fill-warning-quiet-resting` | `var(--ha-color-orange-95)` | `var(--ha-color-orange-05)` |
| `ha-color-fill-warning-quiet-hover` | `var(--ha-color-orange-90)` | `var(--ha-color-orange-10)` |
| `ha-color-fill-warning-quiet-active` | `var(--ha-color-orange-95)` | `var(--ha-color-orange-05)` |
| `ha-color-fill-warning-normal-resting` | `var(--ha-color-orange-90)` | `var(--ha-color-orange-10)` |
| `ha-color-fill-warning-normal-hover` | `var(--ha-color-orange-80)` | `var(--ha-color-orange-20)` |
| `ha-color-fill-warning-normal-active` | `var(--ha-color-orange-90)` | `var(--ha-color-orange-10)` |
| `ha-color-fill-warning-loud-resting` | `var(--ha-color-orange-70)` | `var(--ha-color-orange-40)` |
| `ha-color-fill-warning-loud-hover` | `var(--ha-color-orange-50)` | `var(--ha-color-orange-30)` |
| `ha-color-fill-warning-loud-active` | `var(--ha-color-orange-70)` | `var(--ha-color-orange-40)` |
| `ha-color-fill-success-quiet-resting` | `var(--ha-color-green-95)` | `var(--ha-color-green-05)` |
| `ha-color-fill-success-quiet-hover` | `var(--ha-color-green-90)` | `var(--ha-color-green-10)` |
| `ha-color-fill-success-quiet-active` | `var(--ha-color-green-95)` | `var(--ha-color-green-05)` |
| `ha-color-fill-success-normal-resting` | `var(--ha-color-green-90)` | `var(--ha-color-green-10)` |
| `ha-color-fill-success-normal-hover` | `var(--ha-color-green-80)` | `var(--ha-color-green-20)` |
| `ha-color-fill-success-normal-active` | `var(--ha-color-green-90)` | `var(--ha-color-green-10)` |
| `ha-color-fill-success-loud-resting` | `var(--ha-color-green-50)` | `var(--ha-color-green-40)` |
| `ha-color-fill-success-loud-hover` | `var(--ha-color-green-40)` | `var(--ha-color-green-30)` |
| `ha-color-fill-success-loud-active` | `var(--ha-color-green-50)` | `var(--ha-color-green-40)` |
| `ha-color-on-primary-quiet` | `var(--ha-color-primary-50)` | `var(--ha-color-primary-70)` |
| `ha-color-on-primary-normal` | `var(--ha-color-primary-40)` | `var(--ha-color-primary-60)` |
| `ha-color-on-primary-loud` | `var(--white-color)` | 相同 |
| `ha-color-on-neutral-quiet` | `var(--ha-color-neutral-50)` | `var(--ha-color-neutral-70)` |
| `ha-color-on-neutral-normal` | `var(--ha-color-neutral-40)` | `var(--ha-color-neutral-60)` |
| `ha-color-on-neutral-loud` | `var(--white-color)` | 相同 |
| `ha-color-on-disabled-quiet` | `var(--ha-color-neutral-80)` | `var(--ha-color-neutral-40)` |
| `ha-color-on-disabled-normal` | `var(--ha-color-neutral-70)` | `var(--ha-color-neutral-50)` |
| `ha-color-on-disabled-loud` | `var(--ha-color-neutral-95)` | `var(--ha-color-neutral-50)` |
| `ha-color-on-danger-quiet` | `var(--ha-color-red-50)` | `var(--ha-color-red-70)` |
| `ha-color-on-danger-normal` | `var(--ha-color-red-40)` | `var(--ha-color-red-60)` |
| `ha-color-on-danger-loud` | `var(--white-color)` | 相同 |
| `ha-color-on-warning-quiet` | `var(--ha-color-orange-50)` | `var(--ha-color-orange-70)` |
| `ha-color-on-warning-normal` | `var(--ha-color-orange-40)` | `var(--ha-color-orange-60)` |
| `ha-color-on-warning-loud` | `var(--white-color)` | 相同 |
| `ha-color-on-success-quiet` | `var(--ha-color-green-50)` | `var(--ha-color-green-70)` |
| `ha-color-on-success-normal` | `var(--ha-color-green-40)` | `var(--ha-color-green-60)` |
| `ha-color-on-success-loud` | `var(--white-color)` | 相同 |
| `ha-color-surface-default` | `var(--ha-color-white)` | `var(--ha-color-neutral-10)` |
| `ha-color-surface-low` | `var(--ha-color-neutral-95)` | `var(--ha-color-neutral-05)` |
| `ha-color-surface-lower` | `var(--ha-color-neutral-90)` | `var(--ha-color-black)` |
| `ha-color-surface-default-inverted` | `var(--ha-color-neutral-10)` | `var(--ha-color-white)` |
| `ha-color-surface-low-inverted` | `var(--ha-color-neutral-05)` | `var(--ha-color-neutral-95)` |
| `ha-color-surface-lower-inverted` | `var(--ha-color-black)` | `var(--ha-color-90)` |
| `ha-color-on-surface-default` | `var(--ha-color-neutral-05)` | `var(--ha-color-neutral-95)` |
| `ha-color-form-background` | `var(--ha-color-neutral-95)` | `var(--ha-color-neutral-20)` |
| `ha-color-form-background-hover` | `var(--ha-color-neutral-90)` | `var(--ha-color-neutral-30)` |
| `ha-color-form-background-disabled` | `var(--ha-color-neutral-80)` | `var(--ha-color-neutral-20)` |
| `ha-color-shadow-scrollable-fade` | `rgba(0, 0, 0, 0.08)` | 相同 |
| `ha-color-border-normal` | 未设置 | `var(--ha-color-primary-50)` |

## 组件变量

某些组件会读取它们自己的变量，并在组件本身中具有默认值。这些是专为主题设计的变量。当主题未设置某个变量时，组件将使用表中的默认值。

### 卡片

| 变量 | 默认值 | 更改内容 |
| --- | --- | --- |
| `ha-card-background` | `var(--card-background-color, white)` | 卡片的背景。 |
| `ha-card-backdrop-filter` | `none` | 卡片后面的背景滤镜，例如模糊。 |
| `ha-card-border-radius` | `var(--ha-border-radius-lg)` | 卡片角落的圆度。许多其他表面（如磁贴和扩展面板）都遵循它。 |
| `ha-card-border-width` | `1px` | 卡片边框的宽度。 |
| `ha-card-border-color` | `var(--divider-color, #e0e0e0)` | 卡片边框的颜色。 |
| `ha-card-box-shadow` | `none` | 卡片的阴影。 |
| `ha-card-header-color` | `var(--primary-text-color)` | 卡片标题的颜色。 |
| `ha-card-header-font-family` | `inherit` | 卡片标题的字体。 |
| `ha-card-header-font-size` | `var(--ha-font-size-2xl)` | 卡片标题的大小。 |
| `ha-card-feature-gap` | `12px` | 卡片功能之间的空间。 |

### 仪表盘布局

| 变量 | 默认值 | 更改内容 |
| --- | --- | --- |
| `masonry-view-card-margin` | `4px 4px 8px` | 瀑布流和侧边栏视图中卡片周围的边距。 |
| `ha-view-sections-column-min-width` | `320px` | 分区视图列的最窄宽度。 |
| `ha-view-sections-column-max-width` | `500px` | 分区视图列的最宽宽度。 |
| `ha-view-sections-column-gap` | `32px` | 分区视图列之间的空间。 |
| `ha-view-sections-narrow-column-gap` | `8px` | 窄屏幕上分区视图列之间的空间。 |
| `ha-view-sections-row-gap` | `24px` | 分区视图行之间的空间。 |
| `ha-view-sections-row-height` | `56px` | 分区视图行的高度。 |
| `ha-view-sections-extra-top-margin` | `80px` | 分区视图上方的空间。 |
| `ha-section-grid-column-gap` | `8px` | 分区中并排卡片之间的空间。 |
| `ha-section-grid-row-gap` | `8px` | 分区中卡片行之间的空间。 |
| `ha-section-grid-row-height` | `56px` | 分区中卡片行的高度。 |
| `ha-section-background-color` | `var(--secondary-background-color)` | 已启用背景的分区的背景。 |
| `ha-section-border-radius` | `var(--ha-border-radius-xl)` | 分区角落的圆度。 |
| `grid-card-gap` | `8px` | 网格卡片中卡片之间的空间。 |
| `stack-card-gap` | `8px` | 水平或垂直堆叠卡片中卡片之间的空间。 |
| `horizontal-stack-card-gap` | `var(--stack-card-gap, 8px)` | 水平堆叠卡片中卡片之间的空间。 |
| `vertical-stack-card-gap` | `var(--stack-card-gap, 8px)` | 垂直堆叠卡片中卡片之间的空间。 |

### 卡片和行

| 变量 | 默认值 | 更改内容 |
| --- | --- | --- |
| `ha-heading-card-title-color` | `var(--primary-text-color)` | 标题卡片标题的颜色。 |
| `ha-heading-card-title-font-size` | `var(--ha-font-size-l)` | 标题卡片标题的大小。 |
| `ha-heading-card-subtitle-color` | `var(--secondary-text-color)` | 标题卡片副标题的颜色。 |
| `ha-picture-card-text-color` | `white` | 图片实体和图片概览卡片图片顶部的文本。 |
| `ha-picture-icon-button-color` | `#a9a9a9` | 图片概览卡片的图标，用于关闭的实体。 |
| `ha-picture-icon-button-on-color` | `white` | 图片概览卡片的图标，用于开启的实体。 |
| `section-header-text-color` | `var(--primary-text-color)` | 实体卡片中分区行的标签。 |
| `entities-divider-color` | `var(--divider-color)` | 实体卡片中分隔线或分区行的线条。 |

### 徽章

| 变量 | 默认值 | 更改内容 |
| --- | --- | --- |
| `ha-heading-badge-text-color` | `var(--secondary-text-color)` | 标题卡片徽章的文本。 |
| `ha-heading-badge-font-size` | `var(--ha-font-size-m)` | 标题卡片徽章文本的大小。 |
| `ha-heading-badge-font-weight` | `400` | 标题卡片徽章文本的粗细。 |
| `ha-heading-badge-line-height` | `20px` | 标题卡片徽章的行高。 |
| `ha-heading-badge-size` | `26px` | 标题卡片按钮徽章的高度。 |
| `ha-heading-badge-icon-size` | `16px` | 标题卡片按钮徽章图标的大小。 |
| `ha-label-badge-color` | `var(--primary-color)` | 标签徽章的环和标签背景。 |
| `ha-label-badge-label-color` | `white` | 标签徽章标签的文本。 |
| `ha-label-badge-label-text-transform` | `uppercase` | 标签徽章标签的大写。 |
| `ha-label-badge-size` | `2.5em` | 标签徽章的大小。 |
| `ha-label-badge-font-size` | `1.5em` | 标签徽章中值的大小。 |
| `ha-label-badge-border-radius` | `50%` | 标签徽章的圆度。 |
| `ha-label-badge-padding` | `0 0 0 0` | 标签徽章周围的填充。 |
| `ha-label-badge-title-font-size` | `0.9em` | 标签徽章下方标题的大小。 |
| `ha-label-badge-title-width` | `5em` | 标签徽章下方标题的宽度。 |

### 仪表盘页眉

| 变量 | 默认值 | 更改内容 |
| --- | --- | --- |
| `app-header-backdrop-filter` | `none` | 仪表盘页眉后面的背景滤镜，例如模糊。 |
| `app-header-edit-background-color` | `#455a64` | 编辑仪表盘时的页眉。 |
| `app-header-edit-text-color` | `white` | 编辑仪表盘时页眉中的文本和图标。 |

### Markdown

| 变量 | 默认值 | 更改内容 |
| --- | --- | --- |
| `markdown-link-color` | `var(--primary-color)` | Markdown 中的链接，例如 Markdown 卡片中的链接。 |
| `markdown-code-text-color` | `inherit` | Markdown 中代码的文本。 |
| `markdown-list-indent` | `revert` | Markdown 中列表的缩进。 |
| `markdown-table-border-color` | `var(--divider-color)` | Markdown 中表格边框的颜色。 |
| `markdown-table-border-width` | `1px` | Markdown 中表格边框的宽度。 |
| `markdown-table-border-style` | `solid` | Markdown 中表格边框的样式。 |
| `markdown-table-padding-inline` | `0.5em` | Markdown 表格单元格中左右的空间。 |
| `markdown-table-padding-block` | `0.25em` | Markdown 表格单元格中上下的空间。 |
| `markdown-table-text-align` | `start` | Markdown 中表格文本的对齐方式。 |

### 代码编辑器

| 变量 | 默认值 | 更改内容 |
| --- | --- | --- |
| `code-editor-background-color` | `var(--card-background-color)` | 代码编辑器的背景。 |
| `code-editor-gutter-color` | `var(--secondary-background-color, whitesmoke)` | 代码编辑器的装订线，带有行号。 |

## 经典变量

较旧的变量，来自 [`src/resources/theme/color/color.globals.ts`](https://github.com/home-assistant/frontend/blob/dev/src/resources/theme/color/color.globals.ts)。大多数主题仍然设置它们，许多组件仍然使用它们。

同一文件中以 `mdc-` 开头的变量被省略：它们将这些变量传递给较旧的组件，并自行跟随它们。

您不需要设置 `rgb-` 变量。当主题将变量设置为十六进制颜色（如 `primary-color: "#03a9f4"`）时，前端会从中设置 `rgb-primary-color`。仅当颜色不是十六进制值（如 `rgb()` 或 `var()`）时，才自行设置 `rgb-` 变量。

### 主要颜色

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `primary-color` | `var(--ha-color-primary-40)` | 相同 |
| `dark-primary-color` | `#0288d1` | 相同 |
| `darker-primary-color` | `#016194` | 相同 |
| `light-primary-color` | `#b3e5fc` | 相同 |
| `accent-color` | `#ff9800` | 相同 |
| `divider-color` | `rgba(0, 0, 0, 0.12)` | `rgba(225, 225, 225, 0.12)` |
| `outline-color` | `rgba(0, 0, 0, 0.12)` | `rgba(225, 225, 225, 0.12)` |
| `outline-hover-color` | `rgba(0, 0, 0, 0.24)` | `rgba(225, 225, 225, 0.24)` |
| `shadow-color` | `rgba(0, 0, 0, 0.16)` | `rgba(0, 0, 0, 0.48)` |
| `scrollbar-thumb-color` | `rgb(194, 194, 194)` | `rgb(110, 110, 110)` |
| `error-color` | `#db4437` | 相同 |
| `warning-color` | `#ffa600` | 相同 |
| `success-color` | `#43a047` | 相同 |
| `info-color` | `#039be5` | 相同 |
| `disabled-color` | `#bdbdbd` | `#464646` |

### 文本

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `primary-text-color` | `var(--ha-color-text-primary)` | `#e1e1e1` |
| `secondary-text-color` | `var(--ha-color-text-secondary)` | `#9b9b9b` |
| `text-primary-color` | `#ffffff` | 相同 |
| `text-light-primary-color` | `#212121` | 相同 |
| `disabled-text-color` | `#bdbdbd` | `#6f6f6f` |

### 背景

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `card-background-color` | `#ffffff` | `#1c1c1c` |
| `primary-background-color` | `#fafafa` | `#111111` |
| `secondary-background-color` | `#e5e5e5` | `#282828` |
| `clear-background-color` | `#ffffff` | `#111111` |

### RGB 变体

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `rgb-primary-color` | `0, 154, 199` | 相同 |
| `rgb-accent-color` | `255, 152, 0` | 相同 |
| `rgb-primary-text-color` | `33, 33, 33` | `225, 225, 225` |
| `rgb-secondary-text-color` | `114, 114, 114` | `155, 155, 155` |
| `rgb-text-primary-color` | `255, 255, 255` | 相同 |
| `rgb-card-background-color` | `255, 255, 255` | `28, 28, 28` |
| `rgb-warning-color` | `255, 166, 0` | 相同 |
| `rgb-error-color` | `219, 68, 55` | 相同 |
| `rgb-success-color` | `67, 160, 71` | 相同 |
| `rgb-info-color` | `3, 155, 229` | 相同 |

### 侧边栏

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `sidebar-text-color` | `var(--primary-text-color)` | 相同 |
| `sidebar-background-color` | `var(--card-background-color)` | 相同 |
| `sidebar-selected-text-color` | `var(--primary-color)` | 相同 |
| `sidebar-selected-icon-color` | `var(--primary-color)` | 相同 |
| `sidebar-icon-color` | `rgba(var(--rgb-primary-text-color), 0.6)` | 相同 |

### 页眉

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `app-header-text-color` | `var(--sidebar-text-color)` | 相同 |
| `app-header-background-color` | `var(--sidebar-background-color)` | 相同 |
| `app-header-border-bottom` | `1px solid var(--divider-color)` | 相同 |
| `app-theme-color` | `var(--app-header-background-color)` | 相同 |

### 实体状态

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `state-icon-color` | `#44739e` | 相同 |
| `state-active-color` | `var(--amber-color)` | 相同 |
| `state-inactive-color` | `var(--grey-color)` | 相同 |
| `state-unavailable-color` | `var(--state-icon-unavailable-color, var(--disabled-text-color))` | 相同 |
| `state-alarm_control_panel-armed_away-color` | `var(--green-color)` | 相同 |
| `state-alarm_control_panel-armed_custom_bypass-color` | `var(--green-color)` | 相同 |
| `state-alarm_control_panel-armed_home-color` | `var(--green-color)` | 相同 |
| `state-alarm_control_panel-armed_night-color` | `var(--green-color)` | 相同 |
| `state-alarm_control_panel-armed_vacation-color` | `var(--green-color)` | 相同 |
| `state-alarm_control_panel-arming-color` | `var(--orange-color)` | 相同 |
| `state-alarm_control_panel-disarming-color` | `var(--orange-color)` | 相同 |
| `state-alarm_control_panel-pending-color` | `var(--orange-color)` | 相同 |
| `state-alarm_control_panel-triggered-color` | `var(--red-color)` | 相同 |
| `state-alert-off-color` | `var(--orange-color)` | 相同 |
| `state-alert-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-active-color` | `var(--amber-color)` | 相同 |
| `state-binary_sensor-battery-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-carbon_monoxide-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-gas-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-glass_break-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-heat-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-lock-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-moisture-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-problem-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-safety-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-smoke-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-sound-on-color` | `var(--red-color)` | 相同 |
| `state-binary_sensor-tamper-on-color` | `var(--red-color)` | 相同 |
| `state-climate-auto-color` | `var(--green-color)` | 相同 |
| `state-climate-cool-color` | `var(--blue-color)` | 相同 |
| `state-climate-dry-color` | `var(--orange-color)` | 相同 |
| `state-climate-fan_only-color` | `var(--cyan-color)` | 相同 |
| `state-climate-heat-color` | `var(--deep-orange-color)` | 相同 |
| `state-climate-heat-cool-color` | `var(--amber-color)` | 相同 |
| `state-cover-active-color` | `var(--purple-color)` | 相同 |
| `state-device_tracker-active-color` | `var(--blue-color)` | 相同 |
| `state-device_tracker-home-color` | `var(--green-color)` | 相同 |
| `state-fan-active-color` | `var(--cyan-color)` | 相同 |
| `state-humidifier-on-color` | `var(--blue-color)` | 相同 |
| `state-lawn_mower-active-color` | `var(--teal-color)` | 相同 |
| `state-lawn_mower-error-color` | `var(--red-color)` | 相同 |
| `state-light-active-color` | `var(--amber-color)` | 相同 |
| `state-lock-jammed-color` | `var(--red-color)` | 相同 |
| `state-lock-locked-color` | `var(--green-color)` | 相同 |
| `state-lock-locking-color` | `var(--orange-color)` | 相同 |
| `state-lock-unlocked-color` | `var(--red-color)` | 相同 |
| `state-lock-unlocking-color` | `var(--orange-color)` | 相同 |
| `state-lock-open-color` | `var(--red-color)` | 相同 |
| `state-lock-opening-color` | `var(--orange-color)` | 相同 |
| `state-media_player-active-color` | `var(--light-blue-color)` | 相同 |
| `state-person-active-color` | `var(--blue-color)` | 相同 |
| `state-person-home-color` | `var(--green-color)` | 相同 |
| `state-plant-active-color` | `var(--red-color)` | 相同 |
| `state-siren-active-color` | `var(--red-color)` | 相同 |
| `state-sun-above_horizon-color` | `var(--amber-color)` | 相同 |
| `state-sun-below_horizon-color` | `var(--indigo-color)` | 相同 |
| `state-switch-active-color` | `var(--amber-color)` | 相同 |
| `state-update-active-color` | `var(--orange-color)` | 相同 |
| `state-vacuum-active-color` | `var(--teal-color)` | 相同 |
| `state-vacuum-error-color` | `var(--red-color)` | 相同 |
| `state-valve-active-color` | `var(--blue-color)` | 相同 |
| `state-sensor-battery-high-color` | `var(--green-color)` | 相同 |
| `state-sensor-battery-low-color` | `var(--red-color)` | 相同 |
| `state-sensor-battery-medium-color` | `var(--orange-color)` | 相同 |
| `state-water_heater-eco-color` | `var(--green-color)` | 相同 |
| `state-water_heater-electric-color` | `var(--orange-color)` | 相同 |
| `state-water_heater-gas-color` | `var(--orange-color)` | 相同 |
| `state-water_heater-heat_pump-color` | `var(--orange-color)` | 相同 |
| `state-water_heater-high_demand-color` | `var(--deep-orange-color)` | 相同 |
| `state-water_heater-performance-color` | `var(--deep-orange-color)` | 相同 |
| `state-weather-clear_night-color` | `var(--deep-purple-color)` | 相同 |
| `state-weather-cloudy-color` | `var(--light-grey-color)` | 相同 |
| `state-weather-exceptional-color` | `var(--red-color)` | 相同 |
| `state-weather-fog-color` | `var(--grey-color)` | 相同 |
| `state-weather-hail-color` | `var(--cyan-color)` | 相同 |
| `state-weather-lightning_rainy-color` | `var(--lime-color)` | 相同 |
| `state-weather-lightning-color` | `var(--yellow-color)` | 相同 |
| `state-weather-partlycloudy-color` | `var(--blue-grey-color)` | 相同 |
| `state-weather-pouring-color` | `var(--indigo-color)` | 相同 |
| `state-weather-rainy-color` | `var(--blue-color)` | 相同 |
| `state-weather-snowy_rainy-color` | `var(--light-blue-color)` | 相同 |
| `state-weather-snowy-color` | `#c0e0ff` | 相同 |
| `state-weather-sunny-color` | `var(--amber-color)` | 相同 |
| `state-weather-windy_variant-color` | `var(--green-color)` | 相同 |
| `state-weather-windy-color` | `var(--green-color)` | 相同 |
| `state-icon-error-color` | `var(--error-state-color, var(--error-color))` | 相同 |

### 能源

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `energy-grid-consumption-color` | `#488fc2` | 相同 |
| `energy-grid-return-color` | `#8353d1` | `#a280db` |
| `energy-solar-color` | `#ff9800` | 相同 |
| `energy-non-fossil-color` | `#0f9d58` | 相同 |
| `energy-battery-out-color` | `#4db6ac` | 相同 |
| `energy-battery-in-color` | `#f06292` | 相同 |
| `energy-gas-color` | `#8e021b` | 相同 |
| `energy-water-color` | `#00bcd4` | 相同 |

### 历史记录

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `history-unavailable-color` | `transparent` | 相同 |
| `history-unknown-color` | `var(--dark-grey-color)` | 相同 |

### 输入

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `input-idle-line-color` | `rgba(0, 0, 0, 0.42)` | `rgba(255, 255, 255, 0.42)` |
| `input-hover-line-color` | `rgba(0, 0, 0, 0.87)` | `rgba(255, 255, 255, 0.87)` |
| `input-disabled-line-color` | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.06)` |
| `input-outlined-idle-border-color` | `rgba(0, 0, 0, 0.38)` | `rgba(255, 255, 255, 0.38)` |
| `input-outlined-hover-border-color` | `rgba(0, 0, 0, 0.87)` | `rgba(255, 255, 255, 0.87)` |
| `input-outlined-disabled-border-color` | `rgba(0, 0, 0, 0.06)` | `rgba(255, 255, 255, 0.06)` |
| `input-fill-color` | `rgb(245, 245, 245)` | `rgba(255, 255, 255, 0.05)` |
| `input-disabled-fill-color` | `rgb(250, 250, 250)` | `rgba(255, 255, 255, 0.02)` |
| `input-ink-color` | `rgba(0, 0, 0, 0.87)` | `rgba(255, 255, 255, 0.87)` |
| `input-label-ink-color` | `rgba(0, 0, 0, 0.6)` | `rgba(255, 255, 255, 0.6)` |
| `input-disabled-ink-color` | `rgba(0, 0, 0, 0.37)` | `rgba(255, 255, 255, 0.37)` |
| `input-dropdown-icon-color` | `rgba(0, 0, 0, 0.54)` | `rgba(255, 255, 255, 0.54)` |

### 滑块

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `slider-color` | `var(--primary-color)` | 相同 |
| `slider-secondary-color` | `var(--light-primary-color)` | 相同 |
| `slider-track-color` | `var(--scrollbar-thumb-color)` | 相同 |

### 表格

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `table-header-background-color` | `var(--input-fill-color)` | 相同 |
| `table-row-background-color` | `var(--primary-background-color)` | 相同 |
| `table-row-alternative-background-color` | `var(--secondary-background-color)` | 相同 |
| `data-table-background-color` | `var(--card-background-color)` | 相同 |

### 标签徽章

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `label-badge-grey` | `#9e9e9e` | 相同 |
| `label-badge-red` | `var(--error-color)` | 相同 |
| `label-badge-blue` | `var(--info-color)` | 相同 |
| `label-badge-green` | `var(--success-color)` | 相同 |
| `label-badge-yellow` | `var(--warning-color)` | 相同 |
| `label-badge-background-color` | `var(--card-background-color)` | 相同 |
| `label-badge-text-color` | `rgba(var(--rgb-primary-text-color), 0.8)` | 相同 |

### Markdown

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `markdown-code-background-color` | `var(--primary-background-color)` | 相同 |

### 按钮和芯片

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `ha-assist-chip-filled-container-color` | `rgba(var(--rgb-primary-text-color), 0.15)` | 相同 |
| `ha-assist-chip-active-container-color` | `rgba(var(--rgb-primary-color), 0.15)` | 相同 |
| `chip-background-color` | `rgba(var(--rgb-primary-text-color), 0.15)` | 相同 |
| `ha-button-primary-light-color` | 未设置 | `#4082a040` |
| `ha-button-warning-light-color` | 未设置 | `#917b54c1` |
| `ha-button-neutral-color` | 未设置 | `#d9dae0` |
| `ha-button-neutral-light-color` | 未设置 | `#6a7081` |

### 图表颜色

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `color-1` | `#4269d0` | 相同 |
| `color-2` | `#f4bd4a` | 相同 |
| `color-3` | `#ff725c` | 相同 |
| `color-4` | `#6cc5b0` | 相同 |
| `color-5` | `#a463f2` | 相同 |
| `color-6` | `#ff8ab7` | 相同 |
| `color-7` | `#9c6b4e` | 相同 |
| `color-8` | `#97bbf5` | 相同 |
| `color-9` | `#01ab63` | 相同 |
| `color-10` | `#094bad` | 相同 |
| `color-11` | `#c99000` | 相同 |
| `color-12` | `#d84f3e` | 相同 |
| `color-13` | `#49a28f` | 相同 |
| `color-14` | `#048732` | 相同 |
| `color-15` | `#d96895` | 相同 |
| `color-16` | `#8043ce` | 相同 |
| `color-17` | `#7599d1` | 相同 |
| `color-18` | `#7a4c31` | 相同 |
| `color-19` | `#6989f4` | 相同 |
| `color-20` | `#ffd444` | 相同 |
| `color-21` | `#ff957c` | 相同 |
| `color-22` | `#8fe9d3` | 相同 |
| `color-23` | `#62cc71` | 相同 |
| `color-24` | `#ffadda` | 相同 |
| `color-25` | `#c884ff` | 相同 |
| `color-26` | `#badeff` | 相同 |
| `color-27` | `#bf8b6d` | 相同 |
| `color-28` | `#927acc` | 相同 |
| `color-29` | `#97ee3f` | 相同 |
| `color-30` | `#bf3947` | 相同 |
| `color-31` | `#9f5b00` | 相同 |
| `color-32` | `#f48758` | 相同 |
| `color-33` | `#8caed6` | 相同 |
| `color-34` | `#f2b94f` | 相同 |
| `color-35` | `#eff26e` | 相同 |
| `color-36` | `#e43872` | 相同 |
| `color-37` | `#d9b100` | 相同 |
| `color-38` | `#9d7a00` | 相同 |
| `color-39` | `#698cff` | 相同 |
| `color-40` | `#00d27e` | 相同 |
| `color-41` | `#d06800` | 相同 |
| `color-42` | `#009f82` | 相同 |
| `color-43` | `#c49200` | 相同 |
| `color-44` | `#cbe8ff` | 相同 |
| `color-45` | `#fecddf` | 相同 |
| `color-46` | `#c27eb6` | 相同 |
| `color-47` | `#8cd2ce` | 相同 |
| `color-48` | `#c4b8d9` | 相同 |
| `color-49` | `#f883b0` | 相同 |
| `color-50` | `#a49100` | 相同 |
| `color-51` | `#f48800` | 相同 |
| `color-52` | `#27d0df` | 相同 |
| `color-53` | `#a04a9b` | 相同 |
| `color-54` | `#4269d0` | 相同 |

### 代码编辑器语法

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `codemirror-keyword` | 未设置 | `#c792ea` |
| `codemirror-operator` | 未设置 | `#89ddff` |
| `codemirror-variable` | 未设置 | `#f07178` |
| `codemirror-variable-2` | 未设置 | `#eeffff` |
| `codemirror-variable-3` | 未设置 | `#decb6b` |
| `codemirror-builtin` | 未设置 | `#ffcb6b` |
| `codemirror-atom` | 未设置 | `#f78c6c` |
| `codemirror-number` | 未设置 | `#ff5370` |
| `codemirror-def` | 未设置 | `#82aaff` |
| `codemirror-string` | 未设置 | `#c3e88d` |
| `codemirror-string-2` | 未设置 | `#f07178` |
| `codemirror-comment` | 未设置 | `#545454` |
| `codemirror-tag` | 未设置 | `#ff5370` |
| `codemirror-meta` | 未设置 | `#ffcb6b` |
| `codemirror-attribute` | 未设置 | `#c792ea` |
| `codemirror-property` | 未设置 | `#c792ea` |
| `codemirror-qualifier` | 未设置 | `#decb6b` |
| `codemirror-type` | 未设置 | `#decb6b` |

### 命名颜色

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `red-color` | `#f44336` | 相同 |
| `pink-color` | `#e91e63` | 相同 |
| `purple-color` | `#926bc7` | 相同 |
| `deep-purple-color` | `#6e41ab` | 相同 |
| `indigo-color` | `#3f51b5` | 相同 |
| `blue-color` | `#2196f3` | 相同 |
| `light-blue-color` | `#03a9f4` | 相同 |
| `cyan-color` | `#00bcd4` | 相同 |
| `teal-color` | `#009688` | 相同 |
| `green-color` | `#4caf50` | 相同 |
| `light-green-color` | `#8bc34a` | 相同 |
| `lime-color` | `#cddc39` | 相同 |
| `yellow-color` | `#ffeb3b` | 相同 |
| `amber-color` | `#ffc107` | 相同 |
| `orange-color` | `#ff9800` | 相同 |
| `deep-orange-color` | `#ff6f22` | 相同 |
| `brown-color` | `#795548` | 相同 |
| `light-grey-color` | `#bdbdbd` | 相同 |
| `grey-color` | `#9e9e9e` | 相同 |
| `dark-grey-color` | `#606060` | 相同 |
| `blue-grey-color` | `#607d8b` | 相同 |
| `black-color` | `#000000` | 相同 |
| `white-color` | `#ffffff` | 相同 |

### 其他

| 变量 | 浅色 | 深色 |
| --- | --- | --- |
| `bar-box-shadow` | `0 2px 12px var(--shadow-color)` | 相同 |
| `map-filter` | 未设置 | `invert(0.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(0.3)` |
