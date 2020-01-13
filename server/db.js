const mongoose = require('mongoose')
// cosnt mongodb = {
//   address: '10.95.48.81',
//   port: 27017,
//   username: 'admin',
//   password: '123456',
//   authSource: 'admin',
//   database: 'mtool_dev'
// }


mongoose
  .connect('mongodb://localhost:27017/login',{
  // .connect('mongodb://10.95.48.81:27017/login',{
      useNewUrlParser: true ,
      useUnifiedTopology: true,
      useCreateIndex:true
  })
  .then(() => {
    console.log("连接成功");
  })
  .catch(() => {
    console.log("连接失败");
  });
  mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise;

module.exports= mongoose;