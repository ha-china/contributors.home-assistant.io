# 构建 Python 库

> 为什么集成需要通过独立的库与设备通信、该库必须满足哪些要求，以及如何设计身份验证和数据模型的结构。

Source: https://www.hasscn.top/contributors/core/integrations/api-library/

Home Assistant 本身不包含协议代码。集成（integration）从不自行构造 HTTP 请求或解析设备的数据包：它使用一个发布在 PyPI 上的 Python 库来完成这些工作。集成只负责在该库与 Home Assistant 之间进行转换，仅此而已。

这样可以使集成保持精简、更易于审查，也让其他人可以独立地使用和测试该库。本页介绍如何编写这样的库。示例是一个使用 JSON 的 REST API，这是最常见的情况，但该结构同样适用于其他协议。

> [!TIP]
> 在设计自己产品的 API？本地、基于推送（push）的 API 最适合 Home Assistant。您的用户能够即时收到更新，并且即使没有互联网也能继续正常工作。

## 要求

core 中的集成所使用的库必须：

- 以源代码分发（source distribution）的形式发布在 PyPI 上。仅有二进制包的库不会被接受。
- 从公开的代码仓库发布，且 PyPI 上的每个版本都与该仓库中对应的标签（tag）版本相匹配。
- 自动发布，例如通过 GitHub Actions 工作流发布，而不是手动发布。
- 拥有问题跟踪器（issue tracker），前提是该库与设备或服务通信。
- 使用 [OSI 批准的许可证](https://opensource.org/licenses)，包括该库及其所有依赖项，并在元数据中进行声明。

如果该库主要为 Home Assistant 而编写，并且您是该集成的所有者，可以考虑添加一个问题模板选择器，引导人们前往 [core 问题跟踪器](https://github.com/home-assistant/core/issues)，例如 [zwave-js-server-python 的选择器](https://github.com/home-assistant-libs/zwave-js-server-python/issues/new/choose)。

Home Assistant 更倾向于异步（async）库。同步库也能工作（通过 executor），但每次调用都要占用一个线程。请参阅 [Home Assistant 中的异步](https://www.hasscn.top/contributors/core/internals/asyncio/)。

## 结构

一个库包含两个部分：

- **身份验证**：发出经过身份验证的请求并返回响应。这是唯一直接与 API 通信的代码。
- **数据模型**：表示 API 的数据，并提供操作这些数据的方法。

## 身份验证

身份验证部分负责获取令牌（token）、在需要时刷新令牌，并将其添加到每个请求中。它并不了解请求的具体内容，也不会存储令牌：那是库使用者的职责。返回令牌时，请返回 JSON 可序列化的内容，例如由字符串和数字组成的 `dict`，以便 Home Assistant 能够将其存储在配置条目（config entry）中。

如果 API 可能位于不同的地址，例如本地网络中的设备，请让调用者传入主机地址。

请使用 `aiohttp`，并让调用者传入 `ClientSession`。Home Assistant 拥有一个共享会话，自行创建会话不仅会消耗资源，还会在加载证书时阻塞事件循环（event loop）。

```python
from aiohttp import ClientResponse, ClientSession


class Auth:
    """Make authenticated requests to the API."""

    def __init__(
        self, session: ClientSession, host: str, access_token: str
    ) -> None:
        """Initialize the auth."""
        self.session = session
        self.host = host
        self.access_token = access_token

    async def request(
        self, method: str, path: str, **kwargs
    ) -> ClientResponse:
        """Make a request."""
        headers = dict(kwargs.pop("headers", None) or {})
        headers["authorization"] = f"Bearer {self.access_token}"

        return await self.session.request(
            method, f"{self.host}/{path}", **kwargs, headers=headers
        )
```

在 Home Assistant 之外使用它：

```python
import asyncio

import aiohttp

from my_library import Auth


async def main() -> None:
    async with aiohttp.ClientSession() as session:
        auth = Auth(session, "http://example.com/api", "secret_token")

        response = await auth.request("get", "lights")
        print(response.status, await response.json())


asyncio.run(main())
```

### OAuth 2

使用 OAuth 2 时，访问令牌会在短时间内过期，此时需要用刷新令牌（refresh token）获取新的令牌。刷新需要客户端 ID 和密钥（secret），而这些信息可能完全存放在别处：Home Assistant 可以通过 Home Assistant Link 的账号关联服务刷新令牌，因此用户无需拥有自己的开发者账号。

因此，让调用者自行决定如何获取有效的令牌。使用抽象方法可以优雅地实现这一点：

```python
from abc import ABC, abstractmethod

from aiohttp import ClientResponse, ClientSession


class AbstractAuth(ABC):
    """Make authenticated requests to the API."""

    def __init__(self, session: ClientSession, host: str) -> None:
        """Initialize the auth."""
        self.session = session
        self.host = host

    @abstractmethod
    async def async_get_access_token(self) -> str:
        """Return a valid access token."""

    async def request(
        self, method: str, path: str, **kwargs
    ) -> ClientResponse:
        """Make a request."""
        headers = dict(kwargs.pop("headers", None) or {})
        access_token = await self.async_get_access_token()
        headers["authorization"] = f"Bearer {access_token}"

        return await self.session.request(
            method, f"{self.host}/{path}", **kwargs, headers=headers
        )
```

在集成中，子类从 Home Assistant 的 OAuth 2 辅助工具获取令牌，该工具会在需要时刷新令牌。请参阅[集成中的 OAuth 2](https://www.hasscn.top/contributors/core/integrations/oauth2/)。

## 数据模型

按照 API 本身的表示方式来表示数据。保留名称和结构，即使 API 的设计很奇怪或包含拼写错误。阅读 API 文档的人应该无需对照翻译表就能在您的库中轻松找到所需内容。

并且尽量少做事情。库只负责表示数据，而不负责解释数据。例如，不要进行摄氏度到华氏度的换算：这涉及舍入和精度的选择，而这些决定应该由库的使用者来做。

假设该 API 具有以下端点：

- `GET /lights`：所有灯，以列表形式返回。
- `GET /light/<id>`：单个灯，例如 `{"id": 1234, "name": "Desk", "is_on": true}`。
- `POST /light/<id>`：使用 `{"is_on": false}` 控制灯。返回新的状态。

一个表示灯的类：

```python
from typing import Any

from .auth import Auth


class Light:
    """A light of the ExampleHub API."""

    def __init__(self, raw_data: dict[str, Any], auth: Auth) -> None:
        """Initialize the light."""
        self.raw_data = raw_data
        self.auth = auth

    @property
    def id(self) -> int:
        """Return the ID of the light."""
        return self.raw_data["id"]

    @property
    def name(self) -> str:
        """Return the name of the light."""
        return self.raw_data["name"]

    @property
    def is_on(self) -> bool:
        """Return whether the light is on."""
        return self.raw_data["is_on"]

    async def async_control(self, is_on: bool) -> None:
        """Turn the light on or off."""
        response = await self.auth.request(
            "post", f"light/{self.id}", json={"is_on": is_on}
        )
        response.raise_for_status()
        self.raw_data = await response.json()

    async def async_update(self) -> None:
        """Fetch the latest data of the light."""
        response = await self.auth.request("get", f"light/{self.id}")
        response.raise_for_status()
        self.raw_data = await response.json()
```

以及 API 的入口点：

```python
from .auth import Auth
from .light import Light


class ExampleHubAPI:
    """Talk to the ExampleHub API."""

    def __init__(self, auth: Auth) -> None:
        """Initialize the API."""
        self.auth = auth

    async def async_get_lights(self) -> list[Light]:
        """Return all lights."""
        response = await self.auth.request("get", "lights")
        response.raise_for_status()
        return [Light(data, self.auth) for data in await response.json()]

    async def async_get_light(self, light_id: int) -> Light:
        """Return one light."""
        response = await self.auth.request("get", f"light/{light_id}")
        response.raise_for_status()
        return Light(await response.json(), self.auth)
```

针对错误抛出您自己的异常，例如 `ExampleHubAuthenticationError` 和 `ExampleHubConnectionError`，这样集成就能区分密码错误和设备离线这两种情况。集成需要这种区分，才能启动重新身份验证或稍后重试。

## 在 Home Assistant 中试用您的库

在发布之前，请在[开发环境](https://www.hasscn.top/contributors/core/development/environment/)的虚拟环境中以可编辑模式安装您的库。在您的 core 检出目录中运行以下命令，并将库放在旁边的文件夹中：

```shell
uv pip install -e ../my-library
```

该路径适用于手动搭建的环境。开发容器只挂载了您的 core 检出目录，因此需要在容器内克隆该库，例如克隆到 `~/my-library`，然后从那里安装。[教程](https://www.hasscn.top/contributors/core/integrations/tutorial/#1-start-with-the-library)展示了这两种环境搭建方式。

然后启动 Home Assistant，注意不要让它安装已发布的版本覆盖您的版本：

```shell
hass --skip-pip-packages my-library
```

一切正常后，发布一个版本，并在您集成的[清单文件（manifest）](https://www.hasscn.top/contributors/core/integrations/manifest/)的 `requirements` 中设置该版本。
