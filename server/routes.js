const express = require("express");
const router = express.Router();
const user = require("./controller/user.js");
const jwt = require("./utils/jwt");
/* 用户操作 */
router.post("/login", user.login);
router.post("/signup", user.signup);
router.post("/change", user.change);

router.get("/getCaptcha", user.getCaptcha);
router.get("/info", user.info);
router.get("/loginInfo",user.getLoginInfo)

// router.get("/logout", user.logout);
router.delete("/logoff", user.logoff);

router.get("/getRSAPubKey", user.getRSAPubKey);

/* 管理员操作 */
router.get("/getAllUsers", user.getAllUsers);
/* 路由拦截中间件，拦截没有token的路由 */
module.exports =  function(app){
    app.use('/',function(req,res,next){
        /* https://cnodejs.org/topic/5757e80a8316c7cb1ad35bab
        1.请求中的next在函数中运行之后并不会取消执行函数之后的语句，会继续执行，如果之后再出现next语句，会报错
        Error: Can't set headers after they are sent.
        而出现这个错误的原因是：将一个连接关闭（render/end等）之后仍然去输出（send/end/write等等），
        所以要记得用return next()，或者之后不再有next了
        2. 请求处理函数中如果没有next，那么在客户端请求时将一直处于挂起pending状态
        */
       const token = req.headers.authorization;
       const verify = token && jwt.verify(token.split(' ')[1])
       if(req.url!=='/login'&&req.url!=='/signup'&&req.url !== '/getCaptcha'&&req.url !== '/logout'&&req.url!=='/getRSAPubKey'){
            if(!token){
                return res.status(401).json({code:1,message:'请登录提供jwt'})
            }else if(verify.data){//如果verify有值
                req.loginInfo=verify.data;
                return next();
            }else{
                return res.status(401).json({code:1,message:verify.err.message})
            }
       }
       next();
    },router)
}


