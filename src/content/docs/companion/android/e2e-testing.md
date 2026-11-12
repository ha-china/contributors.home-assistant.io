---
title: Android end-to-end tests
description: The nightly Maestro tests that run the Android app against a real Home Assistant on every API level, and how to debug a failure.
sidebarLabel: End-to-end tests
sidebarGroup: Test
order: 4
source: https://github.com/home-assistant/android/blob/main/.github/workflows/e2e.yml
lastVerified: 2026-11-05
---

All other tests fake the server. The end-to-end (E2E) tests don't: they run the real app against a real Home Assistant, the way a user does. That catches what nothing else can, like a change in Core or the frontend that breaks onboarding, or a web view problem on one specific Android version.

There are two: one onboards over plain HTTP, the other through a proxy that requires a client certificate, known as mutual TLS (mTLS).

## 运行时机

`e2e.yml` 工作流在以下情况运行：

- 每晚 05:00 UTC 在 `main` 分支上运行，针对 Home Assistant 的 `dev` 镜像（最新的开发构建版本）。
- 在任意分支上通过 **Run workflow** 手动运行。可选的 `home-assistant-version` 输入用于选择要测试的镜像标签。

它不属于拉取请求（pull request）检查的一部分。它需要为每个受支持的 API 级别启动一个模拟器，对每个拉取请求来说开销太大。

## 它做什么

1. Generates the certificates for the mTLS test. They only exist for the run.
2. Builds the `fullDebug` APK, with [StrictMode](/companion/android/debugging/#strictmode) off, and with the certificate authority (CA) of the run trusted.
3. Installs the [Maestro](https://maestro.dev/) CLI, and checks the download against its published checksum.
4. Starts Home Assistant from the configuration in `.github/e2e/homeassistant`, and checks that `mobile_app` is loaded.
5. Starts the mTLS proxy in front of Home Assistant, and checks that it refuses a request without the client certificate.
6. Starts one emulator per API level on Emulator.wtf, from API 29 to `androidSdk-target`, and installs the app.
7. Runs the plain flow on all emulators in parallel.
8. Opens the certificate installer on the emulators, and runs the mTLS flow. This only happens when the plain flow passed.
9. Uploads the files you need to debug, whatever the result.

设备列表从 API 29 开始，尽管应用支持更旧的版本。在更旧的镜像上，web view 会渲染前端，但其内容永远不会出现在 Maestro 能看到的内容中，因此其上的所有检查都会失败。拉取请求上的[插桩测试](/companion/android/instrumentation-testing/)仍然覆盖完整范围，直到应用的最低 API 级别。

The Home Assistant container and the proxy run on the GitHub runner, and the emulators on Emulator.wtf. A tunnel connects them, and inside the emulators `homeassistant.internal` resolves to the runner: port 8123 is Home Assistant, and port 8443 the proxy.

## How the mTLS test works

The proxy in `.github/e2e/mtls` is nginx in front of Home Assistant. It refuses every request without the client certificate, from the first page of onboarding on.

Its server certificate is signed by a CA that only exists for the run. To make the app trust it, the workflow builds with the Gradle property `debugExtraResDir`. That replaces the network security config of the app with the copy in `.github/e2e/mtls`, which trusts that CA in a debuggable build. A build without the property is unchanged.

The client certificate is installed the way a user does it: the workflow opens the system certificate installer, and the flow goes through it.

> [!IMPORTANT]
> `.github/e2e/mtls/network_security_config.xml` is a copy of `app/src/main/res/xml/network_security_config.xml` with one section added. When you change the config of the app, make the same change in the copy.

## The flows

The flows live in the `.maestro` folder at the root of the repository, and every step of the tests is written there:

- [`.maestro/onboarding.yaml`](https://github.com/home-assistant/android/blob/main/.maestro/onboarding.yaml) onboards over plain HTTP.
- [`.maestro/onboarding-mtls.yaml`](https://github.com/home-assistant/android/blob/main/.maestro/onboarding-mtls.yaml) installs the client certificate, then onboards through the proxy.

They share their steps through `.maestro/subflows`, and cover the most critical path of the app:

- **登录**：真实的登录页面，使用真实凭据，走完整个授权流程。
- **注册**：应用向 `mobile_app` 注册自己，其他一切都依赖于此。
- **前端渲染**：能够到达概览仪表盘（dashboard）证明 web view 在该 API 级别上正常工作。
- **外部总线双向工作**：只有在应用通过[外部总线](/frontend/reference/external-bus/)（external bus）宣告自己之后，前端才会在其设置中显示 **Companion app** 条目，而选中它会让前端请求应用打开其原生设置。

The flows take the instance to test against from three parameters: `HOME_ASSISTANT_URL`, `HOME_ASSISTANT_USERNAME`, and `HOME_ASSISTANT_PASSWORD`. The mTLS flow takes two more, `MTLS_P12_PASSWORD` and `MTLS_CERT_ALIAS`: the password of the certificate file, and the name to give the certificate.

When you change a flow:

- It drives the debug app, `io.homeassistant.companion.android.debug`. Don't change the `appId`.
- It runs on every API level, so anything version specific must be conditional, like the existing steps for permission dialogs.
- Steps match on text on screen. If you rename a label in the app, update the flow in the same pull request.
- Put a step that multiple flows need in a subflow.

[Maestro 文档](https://docs.maestro.dev/api-reference/commands)列出了所有命令。

## 本地运行

安装 [Maestro CLI](https://docs.maestro.dev/getting-started/installing-maestro)，启动一个模拟器或连接一台设备，然后运行：

```bash
./gradlew :app:installFullDebug
maestro test \
  -e HOME_ASSISTANT_URL=http://homeassistant.local:8123 \
  -e HOME_ASSISTANT_USERNAME=<username> \
  -e HOME_ASSISTANT_PASSWORD=<password> \
  .maestro/onboarding.yaml
```

该流程会先清除应用状态，因此总是从全新的引导流程开始。请使用一次性实例：每次运行都会在其上注册一台新设备。

### Run the mTLS flow

To run a test with mTLS, you'll need a reverse proxy requiring mTLS in front of Home Assistant and the certificate installer dialog open for your certificate file. The easiest way to get to this state is using the steps described below which also run on GitHub Actions. You will need to use an emulator, Docker, and Home Assistant on port 8123 of your machine. From the emulator, your machine is `10.0.2.2`.

1. Generate the certificates, with that address in the server certificate:

   ```bash
   OUT=/tmp/mtls
   .github/e2e/mtls/generate-certs.sh "$OUT" \
     "DNS:homeassistant.internal,IP:10.0.2.2"
   ```

2. Start the proxy. With Docker Desktop, `host.docker.internal` is your machine:

   ```bash
   TEMPLATE=/etc/nginx/templates/default.conf.template
   docker run -d --name e2e-mtls-proxy -p 8443:8443 \
     -e E2E_MTLS_UPSTREAM=host.docker.internal:8123 \
     -v "$OUT:/etc/nginx/certs:ro" \
     -v "$PWD/.github/e2e/mtls/nginx.conf.template:$TEMPLATE:ro" \
     nginx:stable-alpine
   ```

3. Install the app, built to trust the CA:

   ```bash
   ./gradlew :app:installFullDebug -PdebugExtraResDir="$OUT/res"
   ```

4. Open the certificate installer on the emulator:

   ```bash
   .github/e2e/mtls/open-cert-installer.sh emulator-5554 "$OUT/client.p12"
   ```

   On API 32 and below, the script installs `client_legacy.p12` from the same folder instead, because the certificate installer of those versions can't read `client.p12`. To use another legacy file, pass its path as an optional third argument.

5. Run the flow, with the default password and name of `generate-certs.sh`:

   ```bash
   maestro test \
     -e HOME_ASSISTANT_URL=https://10.0.2.2:8443 \
     -e HOME_ASSISTANT_USERNAME=<username> \
     -e HOME_ASSISTANT_PASSWORD=<password> \
     -e MTLS_P12_PASSWORD=e2ep12pass \
     -e MTLS_CERT_ALIAS=e2eclient \
     .maestro/onboarding-mtls.yaml
   ```

## Debug a failure

每次运行都会上传一个 `e2e-artifacts` 工件：

| 文件 | 内容 |
| --- | --- |
| `maestro-results/` | The command trace per flow and shard, `maestro.log`, and screenshots of failures |
| `logcat-*.txt` | The full logcat, one file per emulator |
| `mtls-proxy.log` | The log of the mTLS proxy, one line per request |
| `homeassistant.log` | The Home Assistant log |
| `homeassistant-config.json` | The `/api/config` response, with the version and loaded components |
| `homeassistant-container.json` | The container details, including the exact image |

Read them in that order, and stop at the first one that explains the failure. Most failures show in the failing Maestro command and its screenshot: that tells a broken screen apart from an element Maestro just couldn't see. Starting with the Home Assistant log usually wastes time. In the proxy log, a `400` is a request without the client certificate.

只有在排除了应用和流程之后，才去查看上游。`dev` 镜像每晚都会变化，因此请与上一次通过的运行进行比较：两份 `homeassistant-config.json` 文件给出了故障两侧的 Home Assistant 版本。然后查看在此期间 [Core](https://github.com/home-assistant/core) 或[前端](https://github.com/home-assistant/frontend)合入了什么。

## 自动化分诊

夜间运行失败会启动一个 `e2e-triage` 工作流。一个 AI 代理会下载失败运行和上一次成功运行的工件，并遵循 `.agents/skills/ha-android-e2e-debugging` 技能中的流程。它只做诊断：从不更改文件或打开拉取请求。它会在 Android 仓库中报告到一个单独的 `e2e-failure` issue 中，包括供维护者带到 Core 或前端的上游发现。下一次通过的运行会关闭该 issue。
