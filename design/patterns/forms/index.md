# 表单与校验

> Home Assistant 如何收集输入、标明必填项并显示错误，以便用户进行修正。

Source: https://www.hasscn.top/contributors/design/patterns/forms/

表单在 Home Assistant 中无处不在：设置集成（integration）、编辑自动化（automation）、更改实体（entity）的设置。它们都遵循相同的模式，因此用户知道在哪里可以找到标签、提示和问题所在。

## 何时使用

每当需要用户输入一个或多个值时，都可以使用此模式。对于立即生效的单一设置，例如开启或关闭某个功能，单独使用一个[开关（switch）](https://www.hasscn.top/contributors/design/components/switch/)就足够了。

## 工作原理

前端的大多数表单都是使用 [form](https://www.hasscn.top/contributors/design/components/form/) 组件构建的。你只需描述字段，它会通过[选择器（selector）](https://www.hasscn.top/contributors/design/components/selector/)为每个值选择合适的控件：名称用文本框，实体用选择器，是或否用开关。集成的设置和选项对话框也以同样的方式渲染。这就是它们外观和行为都一致的原因。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Name", "required": true, "selector": {"text": {}}}, {"name": "Light", "selector": {"entity": {"filter": {"domain": "light"}}}}, {"name": "Notify me", "selector": {"boolean": {}}}], "data": {"Name": "Hallway"}}'></ha-form>
```

### 标签与辅助文本

- 每个字段都有一个可见的标签。占位符不是标签：一旦用户开始输入，它就会消失。
- 当某个字段需要解释时，请添加辅助文本。它位于字段下方。在 `ha-form` 中，它来自 `computeHelper`。
- 使用既定的字段布局和共享组件，而不是原始输入框或你自己构建的控件。

Do and don't, as live demos.

**Do:** 标签保持可见，字段下方有提示。

```html
<ha-input label="Host" hint="The IP address or hostname of the device"></ha-input>
```

**Don't:** 只有占位符。一旦用户输入，它就消失了。

```html
<ha-input placeholder="Host"></ha-input>
```

### 必填与可选

- 必填字段会在其标签后显示一个 `*`。
- 在合理的情况下，应将字段设为可选，并为它们提供合理的默认值。好的默认值会有所帮助，同时不会妨碍想要其他设置的用户。

### 校验

字段会在表单提交时进行检查。带有 `auto-validate` 的[文本输入框（text input）](https://www.hasscn.top/contributors/design/components/input/)则会在用户离开该字段时立即进行检查。

当某个值无效时：

- 该字段会被标记为无效，其校验消息会取代辅助文本。
- 在 `ha-form` 中，关于单个字段的错误会显示在该字段的正上方。关于整个表单的错误（例如连接失败）则显示在顶部。
- 焦点会移动到第一个有问题的字段，这样键盘和屏幕阅读器用户就能直接定位到它。

Live demo of `ha-form`, connected to a demo Home Assistant.

```html
<ha-form data-props='{"schema": [{"name": "Host", "required": true, "selector": {"text": {}}}, {"name": "Port", "selector": {"number": {"min": 1, "max": 65535, "mode": "box"}}}], "data": {"Host": "192.168.1.200", "Port": 8080}, "error": {"base": "Could not connect to the device.", "Host": "No device answers on this address."}}'></ha-form>
```

错误以[警告框（alert）](https://www.hasscn.top/contributors/design/components/alert/)的形式显示，因此它们带有图标和文本，而不仅仅是红色。关于如何措辞，请参阅[消息](https://www.hasscn.top/contributors/design/ui-text/messages/)。

### 对话框中的表单

- 对话框打开时表单会获得焦点：请为其添加 `autofocus` 属性。
- 主要操作（如**保存**）位于右下角，紧邻**取消**。
- 一旦用户进行了更改，对话框就不会因按 Escape 键或点击对话框外部而关闭。请参阅[确认与撤销](https://www.hasscn.top/contributors/design/patterns/confirmations/)。

### 密码

表单标记不应让密码管理器将某个字段误认为是其他类型的字段。

## 无障碍

- 字段的标签就是它的可访问名称（accessible name）。即使空间紧张，也要保留它。
- 无效的[文本输入框](https://www.hasscn.top/contributors/design/components/input/)会设置 `aria-invalid`，并且其校验消息会被播报。
- WCAG 相关内容请参阅[标签与可访问名称](https://www.hasscn.top/contributors/design/foundations/accessibility/#labels-and-accessible-names)。

## 组件

- [Form](https://www.hasscn.top/contributors/design/components/form/) 和 [selector](https://www.hasscn.top/contributors/design/components/selector/)
- [文本输入框](https://www.hasscn.top/contributors/design/components/input/) 和 [textarea](https://www.hasscn.top/contributors/design/components/textarea/)
- [开关](https://www.hasscn.top/contributors/design/components/switch/)、[选择框](https://www.hasscn.top/contributors/design/components/select-box/) 和 [下拉菜单](https://www.hasscn.top/contributors/design/components/select-menu/)
- [实体选择器](https://www.hasscn.top/contributors/design/components/entity-picker/)、[设备选择器](https://www.hasscn.top/contributors/design/components/device-picker/) 和 [区域选择器](https://www.hasscn.top/contributors/design/components/area-picker/)
- [警告框](https://www.hasscn.top/contributors/design/components/alert/)，用于错误和警告

## 代码实现

将 `ha-form` 与 schema 一起使用。`computeLabel`、`computeHelper` 和 `computeError` 会将名称和错误键转换为翻译后的文本。将 `error` 设置为一个以字段名为键的对象，其中 `base` 用于整个表单。`warning` 的工作方式相同，但没有 `base`。详情请参阅 [form](https://www.hasscn.top/contributors/design/components/form/) 页面。
