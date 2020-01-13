const User = require('../model/Users')

class admin{
    async getAllUsers(req,res){
       res.send(await User.find());
    }
    async deleteUser(req,res){
        
    }
    async changeUserInfo(req,res){
        // await User.
    }
}
module.exports =new admin();