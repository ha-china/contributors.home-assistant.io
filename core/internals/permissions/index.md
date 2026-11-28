# 权限

> 权限策略的结构与合并方式，以及如何在动作、HTTP 视图和 WebSocket 命令中检查权限。

Source: https://www.hasscn.top/contributors/core/internals/permissions/

权限限制了用户能够查看和控制的内容。权限附加在群组（group）上，用户会获得其所有群组权限的合并结果。所有者（owner）是例外：权限从不适用于所有者，所有者始终可以做任何事情。

权限只有在你的代码进行检查时才会生效，而且前提是代码能追踪是*谁*发起了请求。人们往往忘记的正是第二点。

## 策略

策略（policy）是一个字典。它的顶层存放类别。目前，策略只使用 `entities`。

```python
{
    "entities": {
        "domains": {"switch": True},
        "entity_ids": {
            "light.kitchen": {"read": True, "control": True},
        },
    }
}
```

在策略的任何位置，值可以是 `True`（允许）或 `None`（使用默认值，即拒绝）。缺失的类别将被拒绝。

`entities` 类别包含子类别 `entity_ids`、`device_ids`、`area_ids`、`domains` 和 `all`。Home Assistant 按此顺序检查它们，并使用第一个匹配的项。每一项都可以通过 `True` 授予访问权限，或者通过 `read`、`control` 和 `edit` 键按具体权限授予。

三个内置群组具有以下策略：

| 群组 | 策略 |
| --- | --- |
| 管理员 | `{"entities": True}` |
| 用户 | `{"entities": True}` |
| 只读 | `{"entities": {"all": {"read": True}}}` |

用户和管理员可以控制相同的实体（entity）。管理员的特殊之处在于 `user.is_admin`，代码会对任何更改配置的操作单独检查该项。

### 合并策略

当用户属于多个群组时，其策略会逐级合并：

1. 如果任何一个值是 `True`，则结果为 `True`。
2. 如果任何一个值是字典，则结果为字典，并按同样的规则合并。
3. 如果所有值都是 `None`，则结果为 `None`。

因此，`{"entities": {"entity_ids": {"light.kitchen": True}}}` 与 `{"entities": {"entity_ids": True}}` 合并的结果是 `{"entities": {"entity_ids": True}}`。

## 上下文携带用户信息

每个动作（action）调用、事件和状态（state）都有一个 `Context`，并且上下文（context）中包含 `user_id`。Home Assistant 就是这样知道是谁做了某件事的，日志簿（logbook）和权限检查都依赖于此。

- 在动作处理函数中，将 `call.context` 传递给你后续执行的任何操作。
- 在 HTTP 视图或 WebSocket 命令中，为请求的用户创建上下文。两者都有相应的辅助方法：视图中使用 `self.context(request)`，WebSocket 命令中使用 `connection.context(msg)`。

```python
await hass.services.async_call(
    "homeassistant",
    "restart",
    context=connection.context(msg),
    blocking=True,
)
```

## 检查权限

拿到用户对象后，检查只需一行代码：

```python
from homeassistant.auth.permissions.const import POLICY_CONTROL
from homeassistant.exceptions import Unauthorized

if not user.is_admin:
    raise Unauthorized()

if not user.permissions.check_entity(entity_id, POLICY_CONTROL):
    raise Unauthorized(entity_id=entity_id, permission=POLICY_CONTROL)
```

权限常量为 `POLICY_READ`、`POLICY_CONTROL` 和 `POLICY_EDIT`。

当检查失败时，从 `homeassistant.exceptions` 中抛出 `Unauthorized`。它会停止你正在进行的操作，并告知用户其无权执行该操作。它的所有参数都是可选的，用于说明是什么失败了：`context`、`user_id`、`entity_id`、`config_entry_id`、`perm_category`（在没有对象 ID 时使用，例如创建配置条目时）和 `permission`。

有些 API 对所有用户开放，但会限制其返回的内容，例如 WebSocket API 中的 `get_states`，它只返回用户有权读取的实体。

## 在动作中

使用 `async_register_platform_entity_service` 为实体注册的动作，以及实体组件（entity component）的动作，都会为你检查实体权限。对于仅管理员可调用的动作，请使用 `async_register_admin_service` 注册。参见[动作](https://www.hasscn.top/contributors/core/internals/actions/)。

如果你注册的是直接操作实体的普通动作，则需要自己逐一检查：

```python
from homeassistant.auth.permissions.const import POLICY_CONTROL
from homeassistant.exceptions import Unauthorized, UnknownUser


async def async_handle_reset(call: ServiceCall) -> None:
    """Reset the given entities."""
    if call.context.user_id:
        user = await call.hass.auth.async_get_user(call.context.user_id)
        if user is None:
            raise UnknownUser(context=call.context)

        for entity_id in call.data["entity_id"]:
            if not user.permissions.check_entity(
                entity_id, POLICY_CONTROL
            ):
                raise Unauthorized(
                    context=call.context,
                    entity_id=entity_id,
                    permission=POLICY_CONTROL,
                )

    ...
```

没有 `user_id` 意味着该调用并非来自用户，而是来自 Home Assistant 本身，例如自动化（automation）。

## 在 HTTP 视图中

请求的用户位于 `request["hass_user"]` 中：

```python
from aiohttp import web

from homeassistant.helpers.http import KEY_HASS, HomeAssistantView
from homeassistant.exceptions import Unauthorized


class MyResetView(HomeAssistantView):
    """Reset everything, for admins only."""

    url = "/api/my_integration/reset"
    name = "api:my_integration:reset"

    async def post(self, request: web.Request) -> web.Response:
        """Handle the reset."""
        hass = request.app[KEY_HASS]
        user = request["hass_user"]
        if not user.is_admin:
            raise Unauthorized()

        hass.bus.async_fire(
            "my_integration_reset", context=self.context(request)
        )
        return self.json_message("Done.")
```

## 在 WebSocket 命令中

用户是 `connection.user`。对于仅管理员可用的命令，请使用 `require_admin` 装饰器。参见 WebSocket API 中的[添加你自己的命令](https://www.hasscn.top/contributors/core/internals/websocket-api/#add-your-own-command)。
