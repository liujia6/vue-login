常见的加密算法
-  对称加密: 算法 DES、3DES、AES 等，
- 非对称算法 : RSA、DSA 等
- 散列算法 : SHA-1、MD5 等。
- hamc算法实现了简易的哈希加盐

## 
- 采用RSA秘钥非对称加密，前端先发请求拿到公钥，后端用公钥加密用js-encrypt，后端使用node自带crypto模块RSA解密，再用hamc哈希处理放入数据库。（hamc加密相当于哈希加上可配置的盐）
- 也可以采用多次不同的hash加密存入数据库

登陆模块用RSA非对称加密或者使用多次不同的hash加密较为安全
- 用简单的hash加密容易被暴力破解，不能前端实现加密，且数据库私密数据不能明文存储。

详细参考以下内容
[参考](https://juejin.im/post/5b48b0d7e51d4519962ea383)
[node的crypt模块-廖雪峰](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025778520640)