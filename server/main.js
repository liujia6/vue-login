'use strict';

const express = require('express');
const app = express();
require('./db')
const session = require('express-session');
const cookieParser = require('cookie-parser'); 
const router =require('./routes.js');
const bodyParser = require('body-parser');

/* use中间件，对请求做一些处理的封装使用注册 */
/* bodyparser来对body的内容处理，使能获取到req.body对象 */
app.use(bodyParser.urlencoded({txtended: false}))
//parse application/json
app.use(bodyParser.json())
app.use(cookieParser());


//jwt
//redis和session模块
// var redis   = require('redis');
// var client  = redis.createClient('6379', '127.0.0.1');// 默认监听6379端口,'127.0.0.1'为你本地ip(默认不需要修改)
// var RedisStore = require('connect-redis')(session);
//路由

// redis 链接错误
// client.on("error", function(error) {
//     console.log(error);
// });

//配置 session


var identityKey = 'sid';//配置 sessionID会放在cookie中来判断用户
app.use(session({
    name: identityKey,
    secret: 'sessiontest',  // 用来对session id相关的cookie进行签名
    // store: new RedisStore(),  // (使用redis的存储session)
    saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 10*60 * 1000  // 有效期，单位是毫秒, 这里设置的是10分钟
    }
}));


// 检测 session是否正常
app.use(function (req, res, next) {
    if (!req.session) {
        return next(new Error('session错误'))
    }else {
        console.log('session正常')//正常打印当前session
    }
    next() // 正常 载入下一个中间件
})

router(app)
const server = app.listen(3000, function (err,data) {
    console.log('监听端口3000')
})
  
