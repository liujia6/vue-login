//创建表

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
const User = mongoose.model('User', userSchema);
module.exports = User;