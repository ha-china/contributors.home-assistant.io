# 获取实例 URL

> 查找设备、服务或用户浏览器可用来访问 Home Assistant 的 URL。

Source: https://www.hasscn.top/contributors/core/integrations/instance-url/

有时，您的集成（integration）需要告诉其他事物如何访问 Home Assistant。设备会回传数据，云服务会调用 webhook，或者媒体播放器会获取生成的图像或声音文件。为此，您需要一个指向此 Home Assistant 实例的 URL。

这比听起来要难。用户可能拥有多个 URL：一个是为家庭网络设置的，一个是 Home Assistant 自动检测的，一个是为从互联网访问而设置的，还有一个来自 Home Assistant Link。它们可以使用非标准端口，可以带或不带 SSL。`get_url` 辅助元素（helper）会为您挑选合适的那个。

## get_url 辅助元素

```python
from homeassistant.helpers.network import NoURLAvailableError, get_url

try:
    url = get_url(hass, allow_internal=False, require_ssl=True)
except NoURLAvailableError as err:
    raise ConfigEntryNotReady(
        translation_domain=DOMAIN,
        translation_key="no_external_url",
    ) from err
```

如果没有符合您要求的 URL，它会抛出 `NoURLAvailableError`。请捕获该异常，并告知用户需要进行哪些设置。

| 参数 | 默认值 | 作用 |
| --- | --- | --- |
| `require_current_request` | `False` | URL 必须与用户当前在浏览器中打开的 URL 一致。如果没有当前请求，则会抛出异常。 |
| `require_ssl` | `False` | URL 必须使用 `https` |
| `require_standard_port` | `False` | URL 必须对 `http` 使用端口 80，或对 `https` 使用端口 443 |
| `require_cloud` | `False` | URL 必须是 Home Assistant Link URL |
| `allow_internal` | `True` | 允许使用用户设置的内部 URL，或网络中检测到的 URL。如果您需要外部 URL，请将其设置为 `False`。 |
| `allow_external` | `True` | 允许使用用户设置的外部 URL，或 Home Assistant Link URL。如果您需要内部 URL，请将其设置为 `False`。 |
| `allow_cloud` | `True` | 允许使用 Home Assistant Link URL |
| `allow_ip` | 视情况而定 | 允许使用 IP 地址作为主机。默认情况下允许，除非 Home Assistant 本身通过 SSL 提供服务。 |
| `prefer_external` | 视情况而定 | 优先尝试外部 URL，然后再尝试内部 URL。默认情况下，仅当 Home Assistant 本身通过 SSL 提供服务时才如此。 |
| `prefer_cloud` | `False` | 优先使用 Home Assistant Link URL，而非用户设置的外部 URL |

## 默认情况下返回的内容

在不带参数的情况下，`get_url(hass)` 允许任何 URL，并优先选择本地 URL：

1. 用户设置的内部 URL。如果没有，则使用从网络设置中检测到的 URL。
2. 如果没有内部 URL，则为用户设置的外部 URL。
3. 如果两者都没有，则为 Home Assistant Link URL（前提是用户拥有订阅）。

当 Home Assistant 本身通过 SSL 提供服务时，它会首先尝试外部 URL，并且不允许使用 IP 地址。

## 选择您的要求

只要求您的使用场景真正需要的内容，不要提出更多要求。每增加一项要求，没有可用 URL 的可能性就越大。

- 局域网中的设备进行回调：使用默认设置即可；如果设备无法访问互联网，则使用 `allow_external=False`。
- 云服务调用 webhook：使用 `allow_internal=False`。如果该服务仅接受 `https`，请添加 `require_ssl=True`。
- 仅在端口 443 上接受 `https` 并会检查证书的设备：使用 `allow_internal=False`、`allow_ip=False`、`require_ssl=True` 和 `require_standard_port=True`。
