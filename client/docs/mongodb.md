[参考](https://i.jakeyu.top/2017/02/28/mongoose%E5%8F%82%E8%80%83%E6%89%8B%E5%86%8C/)
[mongoose手册](http://www.mongoosejs.net/docs/api.html#findbyidandremove_findByIdAndRemove)
## mongoose
mongoose 是一个mongodb的库，方便操作
## mongoose连接
```
const mongoose = require('mongoose')
const config = {
  address: 'localhost',
  // address: '10.95.48.81',
  port: 27017,
  username: 'admin',
  password: 'admin',
  database: 'login'
}


mongoose
  .connect(`mongodb://${config.username}:${config.password}@${config.address}:${config.port}/${config.database}`,{
  // .connect('mongodb://10.95.48.81:27017/login',{
      useNewUrlParser: true ,
      useUnifiedTopology: true,
      useCreateIndex:true
  })
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch(() => {
    console.log("数据库连接失败");
  });
  mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;

module.exports= mongoose;
```
| SQL术语/概念 | MongoDB术语/概念 | 解释/说明                           |
| ------------ | ---------------- | ----------------------------------- |
| database     | database         | 数据库                              |
| table        | collection       | 数据库表/集合                       |
| row          | document         | 数据记录行/文档                     |
| column       | field            | 数据字段/域                         |
| index        | index            | 索引                                |
| table joins  |                  | 表连接,MongoDB不支持                |
| primary key  | primary key      | 主键,MongoDB自动将_id字段设置为主键 |
Mongoose 的一切始于 Schema。每个 schema 都会映射到一个 MongoDB collection ，并定义这个collection里的文档的构成。



```
const mongoose = require('mongoose')

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
//创建document（collotion，也即表的类型约束）

const User = mongoose.model('User', userSchema);
增
```
new User(req.body).save()//添加成功会返回当前添加对象
```
查
```
User.find() 会返回所有表中的数据数组
User.find({account:req.body.account}) 会返回带有此属性的对象
User.findById(req.query.uid)会返回此_id的对象

//查询文档可以用 model 的 find, findById, findOne, 和 where 这些静态方法。
//Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
```
删
```
User.findByIdAndDelete(req.query.uid)
```
改

```
User.findByIdAndUpdate(uid,{
    username:req.body.username,
    city:req.body.city,
    password:req.body.password,
})
Model.update(conditions, update, function(error){})

```

