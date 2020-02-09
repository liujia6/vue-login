const mongoose = require('mongoose')
const config = {
  address: 'localhost',
  // address: '10.95.48.81',
  port: 27017,
  username: 'admin',
  password: 'admin',
  database: 'admin'
}

console.log("??");
// mongoose.connect('mongodb://10.95.48.81:27017/login',{
// mongoose.connect('mongodb://localhost:27017/login',{
  mongoose.connect(`mongodb://${config.username}:${config.password}@${config.address}:${config.port}/${config.database}`,{
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