# vue-login
采用前后端分离架构，完成基本的注册登录
- 前端采用Vue、elementUI
- 后端采用Node用Express框架，数据库采用MongoDB的Mongoose实现
- 开发阶段用webpack代理，完成打包后用Nginx部署

## Build Setup

``` bash
# 前端
cd client 
npm install   //安装依赖
# serve with hot reload at localhost:8080
npm run dev
# build for production with minification
npm run build
# 后端起服务
cd ../server
npm install
node main
# serve  at localhost:3000
npm run dev   
```

登录逻辑如下图
![](https://note.youdao.com/yws/public/resource/c9f1b9f836ce443c9e328d9da17c3c84/xmlnote/653350EF682F4A5683C68F3213F028D5/14680)
## 登录逻辑
-  登录逻辑
    - 登录验证通过后，后端采用jwt配置数据库中id和过期时间1h的签名（这里可以加上refreshtoken，或调整过期时间），生成token加上id返回到前端
    - 前端用localstorage存储，用axios配置全局请求拦截，如果localstorage中有token那就将token放到请求头中，后端对需要进行身份验证的url用中间件拦截，如果没有返回401状态码
    - 前端再对需要跳转的路由加上路由拦截，如果是身份验证不对那就跳转到登录页面（这里也可根据需求调整，例如跳转到没有个人信息的首页）
- 验证码逻辑：防止暴力破解
    - 前端单独实现验证码是不可取的，JS完全是由客户端实现的，任何JS操作都可以被模拟，所以不能单纯用JS来实现验证码。
    - 验证码采用svg-capture对随机生成的字母处理生成svg图片，后端用session存储在内存中（暂时这样处理），发送的时候用对应的sessionid在cookie中区分用户。前端验证后发送用户填写的验证码，后端拿到请求后，对比session中的验证码再验证密码
- 密码加密逻辑：防止用户信息泄露
    - 采用RSA秘钥非对称加密，前端先发请求拿到公钥，后端用公钥加密用js-encrypt，后端使用node自带crypto模块RSA解密，再用hamc哈希处理放入数据库。（hamc加密相当于哈希加上可配置的盐）
    - 也可以采用多次不同的hash加密存入数据库
- web安全相关
    - csrf
        - 采用jwt并将其在请求头中发送， 由于一般浏览器有同源策略，一般非ajax请求不能发送跨域请求，所以csrf请求是通过表单，img等发送，不能够通过ajax请求发送，也不能对请求头配置改变，所以可以防止csrf，但是不能防御XSS
    - xss
        - vue对做了xss的处理封装，所以我们可以试验到，输入script标签到输入框，存放到数据库并读取到前端页面的时候并不会执行
        - 虽然前端做了一层过滤，但是后端也需采取措施
        - xss防御，可分析当前项目的xss漏洞来采取措施，比如可以用CSP
- 跨域
    - 前端开发时采用webpack设置proxy
    - 项目上线可以采用配置nginx代理解决跨域
- 其他
    - 项目上线后可以用pm2守护node服务进程，让服务一直在后台运行
    - nodemon工具可以让node在修改时实时更新

## node加上mongoDB上线流程

所谓部署上线，意思就是将代码放到服务器主机上(一般是linux主机)，并在服务器上安装相关服务端软件，在服务器上跑后端服务。

- 前端只需要将打包后的前端页面放到例如nginx的服务器上的配置root文件夹
- 通过服务器代理，让服务器端口ip和后端的接口一致；例如nginx主要要配置root为静态文件目录，和server服务中配置的listen为端口号和servername为主机名
- 配置数据库，这里后端数据库中连接应该是远程的，远程数据库实现只需要在服务器配置绑定ip：bindIp:0.0.0.0，意思是本机的ip，如果数据库服务开启的话，可以通过本机ip来访问到数据库服务

[markdown-it 库使用 ](https://juejin.im/post/5b4b2a226fb9a04fd16006ea)
