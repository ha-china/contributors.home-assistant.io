# 使用 Ingress 添加网页界面

> 在 Home Assistant 中展示你的应用的网页界面，由 Home Assistant 负责身份验证。

Source: https://www.hasscn.top/contributors/apps/guides/ingress/

Ingress 会在 Home Assistant UI 中展示你的应用的网页界面，如果用户需要，还可以在侧边栏中添加一个入口。登录由 Home Assistant 处理，因此用户无需单独的密码，你也不需要在主机上开放端口。它还能让你的应用获得最高的[安全评级](https://www.hasscn.top/contributors/apps/reference/security-rating/)。

如果你的应用有网页界面，请使用 ingress。

## 工作原理

浏览器通过类似 `/api/hassio_ingress/<token>/` 的 URL 与 Home Assistant 通信。Home Assistant 检查用户的会话，并将请求传递给 Supervisor，再由 Supervisor 将其转发到内部网络中的你的应用。你的 Web 服务器只会看到来自 Supervisor（`172.30.32.2`）的请求。

该代理支持 HTTP/1.x、流式响应和 WebSockets。

## 设置方法

1. 在 `config.yaml` 中启用 ingress：

   ```yaml
   ingress: true
   ```

2. 在容器内的 8099 端口上运行你的 Web 服务器，或者将 `ingress_port` 设置为它使用的端口。
3. 只接受来自 `172.30.32.2` 的连接，拒绝其他所有连接。
4. 不要要求登录。用户已经登录了 Home Assistant。

安装后，应用页面会显示 **Open Web UI**，用户可以开启 **Show in sidebar**。使用 `panel_icon` 和 `panel_title` 设置该条目的图标和标题。设置 `panel_admin: false` 后，非管理员用户也能看到它。

## 处理相对 URL

你的网页界面会在一个随安装而变化的路径下提供服务，例如 `/api/hassio_ingress/Xs3V.../`。大多数 ingress 问题都源于此。绝对链接（如 `/static/app.js` 或重定向到 `/login`）会指向 Home Assistant 而不是你的应用，从而导致失败。

- 在所有地方都使用相对 URL：使用 `static/app.js`，而不是 `/static/app.js`。
- Home Assistant 会在每个请求中添加 `X-Ingress-Path` 标头，其值为你的应用所在的路径。当你需要构建绝对 URL，或在支持基础路径的软件中设置基础路径时，可以使用它。
- ingress URL 也可以通过 Supervisor API 获取，即 `GET /addons/self/info` 中的 `ingress_url` 和 `ingress_entry`。

如果你的应用的起始页不在 `/`，请将 `ingress_entry` 设置为它的路径。

## 了解访问者是谁

当 Home Assistant 为已登录用户打开 ingress 会话时，Supervisor 会在该会话的请求中添加标识该用户的标头：

| 标头 | 内容 |
| --- | --- |
| `X-Remote-User-Id` | 用户的 ID |
| `X-Remote-User-Name` | 用户名 |
| `X-Remote-User-Display-Name` | 显示名称 |

这些标头并不保证存在。Supervisor 只有在找到该会话的用户时才会设置它们，并且当用户没有用户名或显示名称时会省略相应标头。请显式处理没有这些标头的请求，尤其是当你的应用根据用户决定某人可以执行什么操作时：将其视为未知用户，而不是默认用户。

Supervisor 会从传入的请求中移除这些标头并自行设置，因此只要你的应用只接受来自 `172.30.32.2` 的连接，就可以信任它们。

## 大型上传

默认情况下，Supervisor 会在转发请求之前完整读取请求体。对于接收大型上传的应用，请设置 `ingress_stream: true`，以便将 POST 请求体以流的方式传输到你的应用。

## 使用主机网络的应用

使用主机网络的应用与主机以及该网络上的所有其他应用共享端口。此时固定的 `ingress_port` 可能会发生冲突。设置 `ingress_port: 0`，Supervisor 会在应用启动时选择 62000 到 65500 之间的一个空闲端口。在启动时使用 Bashio 读取它：

```bash
#!/command/with-contenv bashio

port=$(bashio::app.ingress_port)
exec my-web-server --port "${port}"
```

不要在 `ports` 中映射该范围内的任何端口；Supervisor 会拒绝该配置。

## nginx 示例

一个通过 nginx 提供页面的最小应用。`Dockerfile`：

```dockerfile
FROM ghcr.io/home-assistant/base:3.24

RUN apk add --no-cache nginx && mkdir -p /run/nginx

COPY ingress.conf /etc/nginx/http.d/

CMD [ "nginx", "-g", "daemon off; error_log /dev/stdout info;" ]
```

nginx 配置文件 `ingress.conf` 只允许 Supervisor 访问：

```nginx
server {
    listen 8099;
    allow  172.30.32.2;
    deny   all;
}
```

以及 `config.yaml`：

```yaml
name: "Ingress example"
version: "1.0.0"
slug: "ingress_example"
description: "Ingress testing"
arch:
  - aarch64
  - amd64
init: false
ingress: true
```

安装并启动它，然后在应用页面上选择 **Open Web UI**。

## 不使用 ingress

如果你的网页界面无法在不断变化的路径下工作，或者用户需要从 Home Assistant 之外访问它，可以使用 `ports` 暴露一个端口并设置 `webui`，这样应用页面就会出现一个直接打开它的 **Open Web UI** 按钮。此时你的应用必须自行处理身份验证。可以考虑使用 [`auth_api`](https://www.hasscn.top/contributors/apps/guides/security/#use-home-assistant-users) 来对照 Home Assistant 用户检查登录。
