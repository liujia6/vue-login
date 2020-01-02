const express = require('express');
const router =express.Router();
const users = require('./Users')
router.post('/login', users.login);
router.post('/signup', users.signup);
router.post('/change', users.change);

router.get('/getCaptcha',users.getCaptcha)
router.get('/info', users.info);

router.get('/logout', users.logout);
router.delete('/logoff', users.logoff);
 /* 挂载路由 */
module.exports =  function(app){
    app.use('/',router);
    
    app.use(/[\/^login]|[^\/signup]|[^\/getCaptcha]/,function(req,res,next){
        console.log(req.url)
        try{
            console.log(jwt.verify(req.cookies.token))
            if(req.cookies.token&&!jwt.verify(req.cookies.token)){
                console.log("yes")
                next();
            }else{
                console.log("no")
                res.status(403).json({code: '1', error: '没有权限'})
            }
        }catch(err){
            res.send(err.message)
        }
    })
}