# Ingress

> 一种让应用在 Home Assistant 内部、Home Assistant 登录之后展示其网页界面的方式，无需开放端口。

Source: https://www.hasscn.top/contributors/glossary/ingress/

- In code: `ingress`, `ingress_port`, `ingress_panel`

应用在其配置中通过 `ingress: true` 开启此功能，并在 ingress 端口上提供其网页界面，默认为 8099，除非它设置了其他端口。Supervisor 会将请求转发给应用，且仅限已登录 Home Assistant 的用户。通过 `ingress_panel`，应用还可以在侧边栏中获得自己的[面板（panel）](https://www.hasscn.top/contributors/glossary/panel/)。参见[使用 ingress 添加网页界面](https://www.hasscn.top/contributors/apps/guides/ingress/)。

## Related terms

- [应用（App）](https://www.hasscn.top/contributors/glossary/app/): 在 Home Assistant OS 上与 Home Assistant 一起运行的额外软件，例如 MQTT broker 或文件编辑器。
- [Supervisor](https://www.hasscn.top/contributors/glossary/supervisor/): Home Assistant OS 中运行 Home Assistant Core 和应用（app）的部分，每个都在各自的容器中运行，并负责它们的更新和备份。
- [面板（Panel）](https://www.hasscn.top/contributors/glossary/panel/): Home Assistant 中一个独立的页面，通常显示在侧边栏中，例如仪表盘、地图或设置。
