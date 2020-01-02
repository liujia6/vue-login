const svgCaptcha = require('svg-captcha');

const jwt = require('../jwt.js')
const User = require('./model')
class Users{
    constructor(){
        // super()
    }
    /* 注册---增 */
    async signup(req,res){
        try{
            console.log(req.body.captcha,req.session)
            // req.session['captcha'] = captcha.text.toLowerCase();
            if(!req.session['captcha']){
                res.send({code:1,message:'请刷新验证码'})
            }
            if(req.body.captcha==req.session['captcha']){
                const is=await User.find({account:req.body.account})
                if(!is.length){
                    const add=await new User(req.body).save();
                    if(add){//添加成功会返回当前添加对象
                        res.send({code:0,message :'注册成功'})
                    }
                }else{
                    throw new Error('用户名已被注册')
                }
            }else{
                res.send({code:1,message :'验证码输入错误'})
            }
            
        }catch(err){
            console.log(err.message)
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
                    if(find[0].password!==req.body.password){
                        throw new Error("密码错误")
                    }
                }else{
                    throw new Error("账户不存在请注册")
                }
                const is=await User.find({account:req.body.account})
                if(is.length){
                    if(is[0].password===req.body.password){
                        const token=jwt.generate({account:req.body.account});
                        res.cookie("token",token,{maxAge: 900000, httpOnly: true});
                        res.send({code:0,message:'用户登录成功',data:{token:token,uid:is[0]._id}})
                    }
                }else{
                    throw new Error("用户名已被注册")
                    // res.send({code:1,message:'用户名已被注册'})
                }
            }else{
                res.send({code:1,message :'验证码输入错误'})
            }
        }catch(err){
            res.send({code:1,message:err.message})
        }
    }
    /*返回个人信息-- 查 */
    async info(req,res){
        try{
            const find=await User.findById(req.query.uid);
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
            const result=await User.findByIdAndDelete(req.query.uid);
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
    async getCaptcha(req,res,next){
        var captcha = svgCaptcha.create({ 
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
        console.log(req.session) 
        console.log(req.session['captcha']); //0xtg 生成的验证码
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(String(captcha.data));
        res.end();
    }
}
module.exports =  new Users()