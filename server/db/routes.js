const express = require('express');
const router =express.Router();
const users = require('./Users')
const jwt = require('../utils/jwt')
router.post('/login', users.login);
router.post('/signup', users.signup);
router.post('/change', users.change);

router.get('/getCaptcha',users.getCaptcha)
router.get('/info', users.info);

router.get('/logout', users.logout);
router.delete('/logoff', users.logoff);

router.get('/getRSAPubKey',users.getRSAPubKey)
 /* 挂载路由 */
module.exports =  function(app){
    app.use('/',function(req,res,next){
        /* https://cnodejs.org/topic/5757e80a8316c7cb1ad35bab
        请求中的next在函数中运行之后并不会取消执行函数之后的语句，会继续执行，如果之后再出现next语句，会报错
        Error: Can't set headers after they are sent.
        而出现这个错误的原因是：将一个连接关闭（render/end等）之后仍然去输出（send/end/write等等），
        所以要记得用return next()，或者之后不再有next了
        */
       const token = req.headers.authorization;
       const verify = token && jwt.verify(token.split(' ')[1])
        
       if(req.url!=='/login'&&req.url!=='/signup'&&req.url !== '/getCaptcha'&&req.url !== '/logout'&&req.url !== '/logoff'&&req.url!=='/getRSAPubKey'){
            try{
                if(!token){
                    res.status(401).json({code:1,message:'请登录提供jwtToken'})
                }
                if(!verify){
                     next();
                }else if(verify.message===`jwt expired`){
                    res.status(401).json({code:1,message:'jwtToken过期了'})
                }else{
                    res.status(401).json({code:1,message:verify.message})
                }
            }catch(err){
                throw new Error(err)
                res.send(err.message)
            }
        }else{
            return next();
        }
    })
    app.use('/',router);
    
    
}