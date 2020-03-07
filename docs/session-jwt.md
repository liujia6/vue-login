## session-jwt
### 最普通的session实现登录的方式是
1. 用户向服务器发送用户名和密码。
2. 服务器验证通过后，在当前对话（session）里面保存相关数据，比如用户角色. 登录时间等等。
3. 服务器向用户返回一个 session_id，写入用户的 Cookie。
4. 用户随后的每一次请求，都会通过 Cookie，将 session_id 传回服务器。
5. 服务器收到 session_id，找到前期保存的数据，由此得知用户的身份。

这种方式的缺点在于
1. session依赖于cookie实现的
2. session会在一定时间内保存在服务器上。当访问增多，会比较占用你服务器的性能
3. 当应用采用集群部署的时候，会遇到多台web服务器之间如何做session共享的问题。因为session是由单个服务器创建的，但是处理用户请求的服务器不一定是那个创建session的服务器，这样他就拿不到之前已经放入到session中的登录凭证之类的信息了


## session的持久化存储
- 关闭浏览器，服务端的 session 是不会马上过期的。session 中间件自己实现了一套管理方式，当访问间隔超过 maxAge 的时候，session 便会失效
- session是如何存储在服务器的呢，session存储可以配置，我们可以用内存、也可以用文件，或者数据库，memcache，redis
- 默认php存储在配置文件中，java存储在内存当中
- 由于现在的网站很多采用分布式架构，多台服务器之间无法共享Session，比如用户在服务器A上已经登录了，但当负载均衡跳转到服务器B时，由于服务器B服务器并没有用户的登录信息，Session就失效了，所以我们需要将session进行持久化存储
- Redis
  - Redis运行在内存中但是可以持久化到磁盘，所以在对不同数据集进行高速读写时需要权衡内存，因为数据量不能大于硬件内存。在内存数据库方面的另一个优点是，相比在磁盘上相同的复杂的数据结构，在内存中操作起来非常简单，这样Redis可以做很多内部复杂性很强的事情
### token
1. 用户通过用户名和密码发送请求
2. 程序验证
3. 程序返回一个签名的token给客户端
4. 客户端储存token, 并且每次用每次发送请求
5. 服务端验证Token并返回数据

token验证由于不需要存储用户的登录信息所以


jwt称为json web token
jwt的原理在于
1. Header包含一些加密算法信息
```
{
  "alg": "HS256",
  "typ": "JWT"
}
```
2. Payload部分是你要保存的值
3. signature是签名，我们使用jwt的时候需要对以上内容加上一个我们自己指定的秘钥即一串字符，按照公式算出签名
4. 将以上部分拼成字符串用点号隔离发送给客户端


### jwt使用的具体逻辑方式
- 客户端登录的时候发送相关信息验证成功后，服务端通过指定秘钥和payload部分配置生成签名发送给前端
- 前端存储在localStorage或者cookie中，在每次请求加在url或者Authorization请求头上
- 后端在需要认证的接口上拦截判断是否需要jwt，服务端用jwt和之前的秘钥验证jwt是否有效


### jwt的优势以及特点
1. 由于jwt是将状态存储在了前端，减少服务端压力，而且很方便实现单点登录（一次登录实现多个相关系统的登录）。只需要另外设置不同服务器
2. jwt是payload是明文的，如果不对jwt加密，不能讲用户私密信息放在内
3. accessToken和refreshToken：
    - jwt一旦泄露，任何人都可以获得该令牌的所有权限。为了减少盗用，JWT 的有效期应该设置得比较短。对于一些比较重要的权限，使用时应该再次对用户进行认证
    - 我们可以用一个accessToken设置较短的有效期，如果在有效期内活跃，当Acesss Token由于过期而失效时，使用Refresh Token就可以获取到新的Token



## session和token比较
- session将信息存储在服务端，会影响服务端性能；cookie存储在客户端，较为轻量
- 不过Session和Token并不矛盾，如果你需要实现有状态的回话，仍然可以增加Session来在服务端保存一些状态。
- 由于移动端的cookie兼容性不好，所以基于cookie实现的session在移动端使用率不高，常基于token实现登录
- 一般需要实现单点登录的系统采用token
- jwt登录可以防止csrf.采用jwt并将其在请求头中发送， 由于一般浏览器有同源策略，一般非ajax请求不能发送跨域请求，所以csrf请求是通过表单，img等发送，不能够通过ajax请求发送，也不能对请求头配置改变，所以可以防止csrf，但是不能防御XSS
- 一个健全的系统必定要用到session，因为有些要求严格的场景例如将用户加入黑名单等需求，不可能单单通过token完成，还是需要后端进行控制，所以我们可以在有需要的时候将token存到后端，用session。

[参考](https://juejin.im/post/5d01f82cf265da1b67210869#heading-30)