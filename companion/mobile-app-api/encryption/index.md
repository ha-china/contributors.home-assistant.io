# 加密

> 使用 libsodium 对称密钥加密来加密 mobile_app webhook 请求和响应。

Source: https://www.hasscn.top/contributors/companion/mobile-app-api/encryption/

Webhook 请求通常通过家庭网络中的明文 HTTP 传输，并且携带位置和传感器数据。`mobile_app` 可以使用 [libsodium](https://doc.libsodium.org/) 对它们进行双向加密。只要有可能，请始终启用加密。

## 开启加密

有两种方式：

- **注册时**：将 `supports_encryption` 设置为 `true`。响应中会包含一个 `secret`。
- **之后**：发送 [`enable_encryption`](https://www.hasscn.top/contributors/companion/mobile-app-api/encryption/#enable-it-later) 请求。

`secret` 就是你的密钥。请安全地存储它，并在该注册存在期间一直保留。没有办法找回它：用户无法在 UI 中查看它，你也不应该要求他们去翻找隐藏的存储文件。如果你丢失了密钥，或者加密一直失败，请创建一个新的注册并告知用户。

一旦开启加密，Home Assistant 将拒绝来自该注册的未加密请求，返回 `400` 和错误代码 `encryption_required`。

## 工作原理

该 webhook 使用 libsodium 的[对称密钥认证加密](https://doc.libsodium.org/secret-key_cryptography/secretbox)，即 `crypto_secretbox`（XSalsa20 配合 Poly1305）。

- **密钥**是 `secret`，一个由 64 个十六进制字符组成的字符串。将其从十六进制解码为 32 字节的密钥。
- **明文**是原本会放在 `data` 中的 JSON。如果请求类型没有 `data`，例如 `get_config`，则加密一个空对象 `{}`。
- **密文**是随机数（nonce）后跟加密的消息，使用原始字母表和填充进行 Base64 编码。也就是 `sodium_base64_VARIANT_ORIGINAL`。

将其放入请求中以代替 `data`：

```json
{
  "type": "update_location",
  "encrypted": true,
  "encrypted_data": "<Base64 nonce and ciphertext>"
}
```

带有内容的响应会以相同的格式返回，即 `{"encrypted": true, "encrypted_data": "..."}`，并使用相同的密钥加密。用同样的方式解密它们。少数响应永远不会被加密，例如空的 `{}` 和 `encryption_required` 错误：[响应](https://www.hasscn.top/contributors/companion/mobile-app-api/sending-data/#the-response)中列出了它们。在解密之前，请先检查响应体是否设置了 `encrypted`。

> [!NOTE]
> 旧版本的应用以不同的方式使用该 secret：将其前 32 个字符作为原始密钥字节。对于从未使用十六进制密钥发送过请求的注册，Home Assistant 仍然接受这种方式。第一个使用十六进制密钥成功解密的请求会将该注册永久切换过来，响应也会随之改变。新的应用应只使用十六进制解码后的密钥。

## 选择一个库

Libsodium 为大多数语言提供了绑定。对于 Swift，官方的 [swift-sodium](https://github.com/jedisct1/swift-sodium) 是一个不错的选择。对于其他语言，请参阅[绑定列表](https://doc.libsodium.org/bindings_for_other_languages)。当有多个选择时，请挑选一个积极维护且广泛使用的库。

## 之后开启加密

一个注册可能没有开启加密，例如因为它是由旧版本的应用创建的。可以通过以下请求开启：

```json
{
  "type": "enable_encryption"
}
```

响应中包含新的 secret：

```json
{
  "secret": "<64 hexadecimal characters>"
}
```

此请求不会被加密，其响应也不会。如果加密已经开启，未加密的请求会收到通常的 `encryption_required` 错误，而加密的请求会收到 `400` 和错误代码 `encryption_already_enabled`。
