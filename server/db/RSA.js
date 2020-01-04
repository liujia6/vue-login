const RSA = require('../utils/RSAKey.js')
class{
    async getPubKey(req,res){
        res.send({
            code:0,
            data:{
                pubKey:RSA.getPubKey
            }
        })
    }
    async privateDecrypt(req,res){
        res.send({
            code:0,
            data:{
                private
            }
        })
    }
}