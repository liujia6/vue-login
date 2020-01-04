const svgCaptcha = require('svg-captcha');

const jwt = require('../utils/jwt.js')
const User = require('./model')
const RSAKey = require('../utils/RSAKey.js')
// const crypto = require('crypto');
//采用hamc的hash算法，只存储一个秘钥，要想更加安全可以在每个用户信息中添加秘钥即盐

class Users{
    constructor(){
    }
    /* 注册---增 */
    async signup(req,res){
        try{
            if(!req.session['captcha']){
                res.send({code:1,message:'请刷新验证码'})
            }
            if(req.body.captcha==req.session['captcha']){
                const is=await User.find({account:req.body.account})
                if(!is.length){
                    //RSA解密
                    let pwd = RSAKey.privateDecrypt(req.body.password);
                    //hamc加密
                    pwd =   require('crypto').createHmac('sha256','secret-key').update(pwd).digest('hex'); 
                    req.body.password = pwd;
                    const add=await new User(req.body).save();
                    if(add){//添加成功会返回当前添加对象
                        res.send({code:0,message :'注册成功'})
                    }
                }else{
                    throw new Error('用户名已被注册');
                }
            }else{
                res.send({code:1,message :'验证码输入错误'})
            }
        }catch(err){
            res.send({code:1,message:err.message})
        }
    }
    /* 登录---查 */
    async login(req,res){
        try{
            if(!req.session['captcha']){
                res.send({code:1,message:'请刷新验证码'})
            }
            if(req.body.captcha==req.session['captcha']){
                const find=await User.find({account:req.body.account})
                if(find.length){
                    //RSA解密
                    let pwd = RSAKey.privateDecrypt(req.body.password);
                    //hamc加密
                    pwd =  require('crypto').createHmac('sha256', 'secret-key').update(pwd).digest('hex'); 
                    if(find[0].password!==pwd){
                        throw new Error("密码错误");
                    }else{
                        const token=jwt.generate({uid:find[0]._id});
                        // res.cookie("token",token,{maxAge: 900000, httpOnly: true});
                        res.send({code:0,message:'用户登录成功',data:{token:token,uid:find[0]._id}});
                    }
                }else{
                    throw new Error("账户不存在请注册");
                }
            }else{
                throw new Error('验证码输入错误');
            }
        }catch(err){
            res.send({code:1,message:err.message})
        }
    }
    /*返回个人信息-- 查 */
    async info(req,res){
        try{
            const find=await User.findById(req.query.uid);
            if(find){
                res.send({
                    code:0,
                    data:{ 
                        username:find.username?find.username:'',
                        city:find.city?find.city:''
                     }
                });
            }
        }catch(err){ 
            res.send({code:1,message:err.message});
        }
    }
    /* 退出登录  */
    async logout(req,res){
        try {
            // res.cookie('token', '', { expires: new Date(0)}); 
            res.send({code:0,message:'退出成功'})
        } catch (error) {
            res.send({code:1,message:err.message})
        }

    }
    /* 注销账号---删 */
    async logoff(req,res){
        try{
            const result=await User.findByIdAndDelete(req.query.uid);
            console.log(result);
            res.send({code:0,message:'注销成功！'})
        }catch(err){
            throw err;
            res.send({code:1,message:'注销失败'})
        }
    }
    /* 改信息---改 */
    async change(req,res){
        try{
            await User.findByIdAndUpdate(req.body.uid,{username:req.body.username,city:req.body.city})
            res.send({code:0,message:'修改成功！'})
        }catch(err){
            res.send({code:1,message:'修改失败！'})
        }
    }
    async getCaptcha(req,res,next){
        const captcha = svgCaptcha.create({ 
            inverse: false, // 翻转颜色 
            fontSize: 48, // 字体大小 
            noise: 2, // 噪声线条数 
            width: 100, // 宽度 
            height: 40, // 高度 
            size: 4,// 验证码长度
            ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        }); 
        // 保存到session,忽略大小写 
        req.session['captcha'] = captcha.text.toLowerCase();
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(String(captcha.data));
        res.end();
    }
    getRSAPubKey(req,res){
        res.send({
            code:0,
            pubKey:RSAKey.getPubKey()
        })
    }
}
module.exports =  new Users()