## PGP in Browser

## PGP Authencation 认证流程

为什么使用 PGP 进行认证, 因为邮箱认证依赖于第三方, 而第三方的邮箱的免费用量不足以支撑认证邮件的发送, 还有一个是第三方会泄露你的踪迹,
而采用 PGP 签名认证就只有网站和你的好友知道你访问了网站, 当然了还有浏览器

为什么不采用帐号+密码的认证方式? 当你看过公司或同事设置的密码后你就会为什么了, 他们的密码如此简单, 只要简单爆破一下就能拿到密码

### 事先准备

1. 用户生成 PGP 密钥对
1. 用户将公钥和暗号(类似用户名)发给服务端保存, 如果暗号重复率过高(10 次以上)的话, 服务端可以拒绝这次保存, 暗号后续可以更改

### 用户认证

假设服务端登录页面是: http://example.com/login

1. 用户进入登录页面 http://example.com/login
1. 登录页面有一个输入框, 要填的内容是对暗号的签名, 暗号是`暗号示例`, 对应的签名示例如下(输入框内容有三种方式填充):

   ```txt
   -----BEGIN PGP SIGNED MESSAGE-----
   Hash: SHA512

   暗号示例
   -----BEGIN PGP SIGNATURE-----

   iQEzBAEBCgAdFiEEbguszZ+xLtdag/ntiScQmfT4PvgFAl58tTkACgkQiScQmfT4
   PvgGtwf+OKDs1fxAp0GNJskT/dOLJmVn1WsN5Fty+PLeA94btXDK/aEOR1jy9NHq
   BpJW/qZ8UdNzmIYV9YuanhVaOzBK9vfJaWU2FdMAnPKmz00uZnf0ofLqZFwk2KIN
   wCpLor0qtVTimLHMEDe6Rd7bkSAKKXfGIcW9m2Xdr815XLRd6K/7GKk94ASLZmpq
   hVNvpbPWwezvuj5V1WqZd3plsyL91M8NavwGnIZ8mCgE03d0pkr3/Eb48ZEt8OsS
   xPW1zoWAkwfUgOnMSt4fuhlSJG8Om2UazflyE4og/yCh+Uh+XjXKCs9ZRUHbmM4B
   zYvqyXSDKw9Gwc8Z7eS5m6sjJT/pbg==
   =bCgj
   -----END PGP SIGNATURE-----

   ```

   - 从 url query 中的 signature 中获取, 这种方式可以让用户跳到像这个项目一样的 PGP 密钥管理网站进行快速登录
   - 用户直接粘贴, 用户也可以在其他地方完成签名然后复制粘贴, 这可以在客户端中进行
   - (尝试) 使用摄像头扫猫二维码进行认证

1. 服务根据暗号获取用户公钥, 用这些公钥进行签名认证来确定用户, 确定用户之后发给用户一个 token 或者其他认证凭据用以后续操作
