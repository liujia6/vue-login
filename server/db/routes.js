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
        if(req.url!=='/login'&&req.url!=='/signup'&&req.url !== '/getCaptcha'&&req.url !== '/logout'&&req.url !== '/logoff'&&req.url!=='/getRSAPubKey'){
            try{
                const token = req.headers.authorization
                if(token && !jwt.verify(token)){
                    next();
                }else{
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