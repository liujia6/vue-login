
var express = require('express');
/* 这里一定记得加bodyparser来对body的内容进行配置不然获取不到req。body对象 */
var bodyParser = require('body-parser')
var app = express();

var jwt=require("jsonwebtoken");


app.use(bodyParser.urlencoded({txtended: false}))
//parse application/json
app.use(bodyParser.json())

const cookieParser = require('cookie-parser');
app.use(cookieParser('123456')); //使用cookie中间件，传入签名123456进行加密


var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/login';


const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/login')

 /*监听端口，起服务 */
var server = app.listen(3000, function (err,data) {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port,err,data)
})
/* 创建数据库和集合即表 */
MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
  if (err) throw err;
  var dbase = db.db("login");//创建数据库
  //创建表
  dbase.createCollection('user', function (err, res) {
      if (err) throw err;
      console.log("创建集合!");
      db.close();
  });
});

/* 注册接口 */
app.post('/signup', function (req, res) {
    var data={
        success:true,
        message:'注册成功',
    }
    /* 增 */
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("login");
        var whereStr = {'account':req.body.account};
        dbo.collection("user").find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            if(!result.length){
                dbo.collection('user').insertOne(req.body,(error,result)=>{
                    if(error){
                        throw err;
                    }
                })
                console.log(data);
                res.send(JSON.stringify(data));
            }else{
                console.log("账户已被注册")
                //账户已被注册
                res.send(JSON.stringify({
                    message:"账户已被注册",
                    success:false
                }));
            }
            db.close();
        });
    });
 })

/* 登录接口 */
app.post("/login",function(req,res){
    const data={
        message:'success',
    }
    /* 登录验证 */
    
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("login");
        //查询
        dbo.collection("user"). find({'account':req.body.account}).toArray(function(err, result) { // 返回集合中所有数据
            if (err) throw err;
            if(result.length){
                if(result[0].password!==req.body.password){
                    data.message="密码错误"
                }
            }else{
                data.message="账户不存在请注册"
            }
            db.close();
        });
    });

    /* 生成jwt签发 */    
    var token=jwt.sign(req.body,'asdfsadfxcvers.234');
    data.token=token;
    res.cookie('jwt',token,{ maxAge:800000*92, httpOnly: true })
    res.json(data)
    console.log(token);
    // jwt.verify(token,'asdadfxcvers.234',function(err,data){
    //     if(!err){	//正确就是null
    //         console.log(data)
    //     }else{
    //         data.message="token不正确"
    //     }			
    // })
})


app.get('/welcome',function(req,res){
    jwt.verify(req.headers.cookie.split('=')[1],'asdadfxcvers.234',function(err,data){
        if(err){
            return res.status(403).send({
                success: false,
                message: 'token不正确.',
                data:data+'12'
            });
        }else{
            res.send({
                success:true,
                data:data
            });
        }			
    })
    
})

app.post('/logoff',function(req,res){

})

