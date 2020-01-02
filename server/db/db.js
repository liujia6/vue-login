const mongoose = require('mongoose')
// const mongoose = require('mongoose')
mongoose
  .connect('mongodb://localhost:27017/login',{
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