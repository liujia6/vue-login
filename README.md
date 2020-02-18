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
cd server
npm install
node main
# serve  at localhost:3000
npm run dev   
```

登录逻辑如下图
![](https://note.youdao.com/yws/public/resource/c9f1b9f836ce443c9e328d9da17c3c84/xmlnote/653350EF682F4A5683C68F3213F028D5/14680)
## 一、登录逻辑
-  登录逻辑
    - 登录验证通过后，后端采用jwt配置数据库中id和过期时间1h的签名（这里可以加上refreshtoken，或调整过期时间），（jwt中带有uid和用户角色等身份信息，我们以后每次请求带上jwt，后端验证再解出用户信息即可）生成token加上id返回到前端
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
        - [vue对做了xss的处理封装](https://cn.vuejs.org/v2/guide/security.html)，对模板和渲染函数做了转义，动态 attribute 绑定也会自动被转义等
- 跨域
    - 前端开发时采用webpack设置proxy
    - 项目上线可以采用配置nginx代理解决跨域
- 权限
    - 权限问题同样应该交由后端处理，前端只做展示，对每个涉权操作，都要进行鉴权后才响应
    - 权限控制跟前端相关的可以笼统的分成菜单权限控制和按钮权限控制，后端有路由控制。
    - 菜单权限控制
        - 在vue路由的beforeRouter钩子里校验当前即将跳转的路由地址是否有权访问，根据校验结果决定路由是否放行
            - 优点：简单，适用于路由不多的简单系统
            - 缺点：若不是按需加载，将大大增加首屏渲染的时间；
        - 前端保存完整路由，最初实例化的路由仅包括登录和404两个路径,等到用户登录拿到权限，请求后端拿到可用路由再实时挂载，初始化vue
            - 优势：较为严谨复杂的系统更适合，因为会根据用户权限动态加载路由，不会浪费资源，性能更好
    - 按钮级别权限控制
        - 在vue路由的meta中保存需要的按钮权限，用自定义指令的方式，在第一次binding的时候，判断有无权限显示
- 其他
    - 项目上线后可以用pm2守护node服务进程，让服务一直在后台运行
    - nodemon工具可以让node在修改时实时更新

## 二、node加上mongoDB上线流程

所谓部署上线，意思就是将代码放到服务器主机上(一般是linux主机)，并在服务器上安装相关服务端软件，在服务器上跑后端服务。

- 前端只需要将打包后的前端页面放到例如nginx的服务器上的配置root文件夹
- 通过服务器代理，让服务器端口ip和后端的接口一致；例如nginx主要要配置root为静态文件目录，和server服务中配置的listen为端口号和servername为主机名，配置proxy代理
- 配置数据库，这里后端数据库中连接应该是远程的，远程数据库实现只需要在服务器配置绑定ip：bindIp:0.0.0.0，意思是本机的ip，如果数据库服务开启的话，可以通过本机ip来访问到数据库服务

### 部署细节
- vue前端项目npm run build之后，要修改vue.config.js中assets变量从'/'到'./'
- 可以使用git直接下载写的代码，也可以使用winscp软件方便的将本机文件，连接上传到服务器，或者命令行直接使用
- [mongoDB的linux远程连接](https://juejin.im/post/5cbe73f86fb9a0320b40d687#heading-0)
- node可用 [pm2](https://juejin.im/post/5be406705188256dbb5176f9)守护进程，让node服务在后台一直运行


## 参考
[markdown-it 库使用 ](https://juejin.im/post/5b4b2a226fb9a04fd16006ea)
[基于Vue实现后台系统权限控制](https://refined-x.com/2017/08/29/%E5%9F%BA%E4%BA%8EVue%E5%AE%9E%E7%8E%B0%E5%90%8E%E5%8F%B0%E7%B3%BB%E7%BB%9F%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6/)
[加密](https://juejin.im/post/5b48b0d7e51d4519962ea383)
[node的crypt模块-廖雪峰](https://www.liaoxuefeng.com/wiki/1022910821149312/1023025778520640)
[mongoose](https://i.jakeyu.top/2017/02/28/mongoose%E5%8F%82%E8%80%83%E6%89%8B%E5%86%8C/)
[mongoose手册](http://www.mongoosejs.net/docs/api.html#findbyidandremove_findByIdAndRemove)
[session与jwt](https://juejin.im/post/5d01f82cf265da1b67210869#heading-30)