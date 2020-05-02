## PGP in Browser

## PGP Authencation 认证流程

为什么使用 PGP 进行认证, 因为邮箱认证依赖于第三方, 而第三方的邮箱的免费用量不足以支撑认证邮件的发送, 还有一个是第三方会泄露你的踪迹,
而采用 PGP 签名认证就只有网站和你的好友知道你访问了网站, 当然了还有浏览器

使用 PGP 登录的示例: <https://simple-pgpauth-server.herokuapp.com>

### 事先准备

1. 网站生成 PGP 密钥对
1. 用户生成 PGP 密钥对
1. 用户和网站交换公钥, 如果网站没有用户公钥则认证失败

### `web+pgpauth` protocol 介绍

示例:

`web+pgpauth:login?auth=http://127.0.0.1:3001/api/auth&mid=magic_id&fingerprint=eeeeeeeeeeeeee`

字段详解

| 块                                     | 详解                                                                 |
| -------------------------------------- | -------------------------------------------------------------------- |
| `web+pgpauth:`                         | 注册的自定义协议名                                                   |
| `login`                                | 路径, 目前只有该路径                                                 |
| `auth==http://127.0.0.1:3001/api/auth` | 加密后的签名内容将要发往的网站地址                                   |
| `mid=magic_id`                         | 登录请求的唯一 id                                                    |
| `fingerprint=eeeeeeeeeeeeee`           | 应用公钥指纹, 如果找不到对应指纹的应用公钥的话会提示用户导入应用公钥 |

1. `加密后的签名内容` 步骤详解
   1. 用户选择要登录的帐号(该帐号包含公钥和私钥)
   1. 生成指定内容的 JSON `{"mid":"pgpauth中 的mid字段","auth":"pgpauth中 的 auth 字段","fingerprint":"登录帐号的公钥指纹"}` (服务端根据 `fingerprint` 查找用户公钥, 所以如果服务端没有用户公钥的话就会认证失败)
   1. 使用登录帐号的私钥对该内容的 JSON 字符串进行签名 (服务端根据签名匹配公钥进行认证)
   1. 使用应用公钥对签名内容进行加密 (避免签名被盗用, 只能被特定应用的服务端使用)
1. `发送签名内容` 将上一步得到的加密文本作为 `content` 字段通过 `POST` 表单的方式发到 `auth` 指定的链接中
1. 之后的事就属于应用方的事情了

### 网站处理用户认证登录

假设服务端登录页面是: http://example.com/login

1. 用户打开网页 http://example.com/login , 页面上有一个网站的公钥, 用户需要将这个公钥导入自己 PGP 地址簿中, 在接下来的步骤中会用到
1. 用户点击第三方登录按钮跳到上方的登录网站, 登录网站处理好把加密内容发回本网站
1. 服务端解密内容得到签名内容
1. 使用 mid 查找生成时的时间戳, 如果找不到则返回 mid 已过期的错误
1. 验证 mid 生成时的时间戳与当前服务器时间戳的差值是否超过了 60s , 如果超过了 60s 则认证失败 (这个过期时间由服务端自行决定, 推荐 60s)
1. 服务端根据指纹查找符合的公钥(可能会找到多个)
1. 使用公钥匹配签名是否正确, 如果匹配成功的个数不为 `1` 则认证失败, 返回用户未被邀请的错误
1. 网站应用可以设置 `cookie` 或者返回 `token` 给用户保存使用
