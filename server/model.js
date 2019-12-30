'use strict';

const express = require('express');
/* 这里一定记得加bodyparser来对body的内容进行配置不然获取不到req。body对象 */
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded({txtended: false}))
//parse application/json
app.use(bodyParser.json())

const jwt=require('./jwt')
const router = express.Router()

// import mongoose from 'mongoose'
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/login',{useNewUrlParser: true ,useUnifiedTopology: true})
mongoose.Promise = global.Promise;

const cookieParser = require('cookie-parser'); 
app.use(cookieParser());
//创建表

const userSchema = mongoose.Schema({
    id: Number,
    account: {
        type: String,
        required: true //必须有值
    },
    username: String,
    password: {
        type: String,
        required: true //必须有值
    },
    code: {
        type:Number,
        default:2
    },//1：客户 2.管理员 
    city:String
});
const User = mongoose.model('User', userSchema);

class Admin{
    constructor(){
        // super()
    }
    /* 注册---增 */
    async signup(req,res){
        try{
            const is=await User.find({account:req.body.account})
            if(!is.length){
                const add=await new User(req.body).save();
                if(add.length){//添加成功会返回当前添加对象
                    res.send({code:0,message :'注册成功'})
                }
            }else{
                throw new Error('用户名已被注册')
            }
        }catch(err){
            console.log(err)
            res.send({code:1,message:err.message})
        }
        
    }
    /* 登录---查 */
    async login(req,res){
        try{
            const find=await User.find({account:req.body.account})
            if(find.length){
                if(find[0].password!==req.body.password){
                    throw new Error("密码错误")
                }
            }else{
                throw new Error("账户不存在请注册")
            }
            const is=await User.find({account:req.body.account})
            if(is.length){
                if(is[0].password===req.body.password){
                    console.log(is[0]._id);
                    const token=jwt.generate(req.body);
                    res.send({code:0,message:'用户登录成功',data:{token:token,uid:is[0]._id}})
                }
            }else{
                throw new Error("用户名已被注册")
                // res.send({code:1,message:'用户名已被注册'})
            }
        }catch(err){
            res.send({code:1,message:err.message})
        }
    }
    /*返回个人信息-- 查 */
    async info(req,res){
        try{
            console.log('infourl')
            const find=await User.findById(req.query.uid);
            console.log(find)
            res.send({
               code:0,
               data:{ 
                   username:find.username?find.username:'',
                   city:find.city?find.city:''
                }
            });
        }catch(err){ 
            res.send({code:1,message:err.message});
        }
    }
    /* 退出登录  */
    async logout(req,res){
        
    }
    /* 注销账号---删 */
    async logoff(req,res){
        try{
            await User.deleteOne({uid:req.body.uid});
            res.send({code:0,message:'注销成功！'})
        }catch(err){
            console.log(err.message)
            res.send({code:1,message:'注销失败'})
        }
    }
    /* 改信息---改 */
    async change(req,res){
        try{
            await User.findByIdAndUpdate(req.body.uid,{username:req.body.username,city:req.body.city})
            res.send({code:0,message:'修改成功！'})
        }catch(err){
            console.log(err.message);
            res.send({code:1,message:'修改失败！'})
        }
    }
    async check(req,res,next){

    }
}
const admin=new Admin();
 /* 路由！！！！ */

 app.get(/[\/^login]|[^\/signup]/,function(req,res,next){
    try{
        console.log(jwt.verify(req.cookies.token))
        if(!jwt.verify(req.cookies.token)){
            console.log("yes")
            next();
        }else{
            console.log("no")
            res.send({code:1,message:'token校验不成功'});
        }
    }catch(err){
        res.send(err.message)
    }
    
})

router.post('/login', admin.login);
router.post('/signup', admin.signup);
router.post('/change', admin.change);

router.get('/info', admin.info);
// router.get('/logout', admin.logout);
router.delete('/logoff', admin.logoff);
// /* 挂载路由 */
app.use('/',router)

const server = app.listen(3000, function (err,data) {
    const host = server.address().address
    const port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port,err,data)
})
  
