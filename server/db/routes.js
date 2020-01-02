const express = require('express');
const router =express.Router();
const users = require('./Users')
const jwt = require('../jwt')
router.post('/login', users.login);
router.post('/signup', users.signup);
router.post('/change', users.change);

router.get('/getCaptcha',users.getCaptcha)
router.get('/info', users.info);

router.get('/logout', users.logout);
router.delete('/logoff', users.logoff);
 /* 挂载路由 */
module.exports =  function(app){
    app.use('/',function(req,res,next){
        if(req.url!=='/login'&&req.url!=='/signup'&&req.url !== '/getCaptcha'){
            try{
                if(req.cookies.token && !jwt.verify(req.cookies.token)){
                    console.log("yes")
                    next();
                }else{
                    console.log("no")
                    res.status(401).json({code: '1', error: '没有认证请登录'})
                }
            }catch(err){
                res.send(err.message)
            }
        }else{
            next();
        }
    })
    app.use('/',router);
    
    
}