# 排版

> Home Assistant 界面的字号比例和字重。

Source: https://www.hasscn.top/contributors/design/foundations/typography/

界面使用 Roboto。文本大小来自固定的比例（scale），因此整个界面的文本能够对齐并保持一致。

## 字号比例

每个大小都是一个令牌（token）。请使用令牌，而不是像素值：整个比例可以作为一个整体进行调整，例如让所有文本都稍微变大一点。

- `--ha-font-size-xs`: 10px
- `--ha-font-size-s`: 12px
- `--ha-font-size-m`: 14px
- `--ha-font-size-l`: 16px
- `--ha-font-size-xl`: 20px
- `--ha-font-size-2xl`: 24px
- `--ha-font-size-3xl`: 28px
- `--ha-font-size-4xl`: 32px
- `--ha-font-size-5xl`: 40px

## 字重

- **Normal**（`--ha-font-weight-normal`，400）用于正文文本。
- **Medium**（`--ha-font-weight-medium`，500）用于操作项，例如按钮标签。
- **Bold**（`--ha-font-weight-bold`，700）用于标题。
- **Light**（`--ha-font-weight-light`，300）可以使用，但在界面中很少是合适的选择。

## 行高

- **Condensed**（`--ha-line-height-condensed`，1.2）用于标题和单行文本。
- **Normal**（`--ha-line-height-normal`，1.6）用于连续文本。
- **Expanded**（`--ha-line-height-expanded`，2）用于需要额外空间的文本。

> [!NOTE]
> Home Assistant 的网站（包括本站）使用 Figtree。应用本身使用 Roboto。
