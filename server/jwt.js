var jwt=require("jsonwebtoken");

/* 生成jwt签发 */  
class jwtToken{
    constructor(){
        this.secret='asdfsadfxxxx2cvers.234';
    }
    generate(obj){
        const token=jwt.sign(obj,this.secret,{})
        return token;
    }
    verify(token){
        return jwt.verify(token,this.secret,function(err,data){
            //校验成功err为null，data为当前jwt数据
            return err;
        })
    }
}  
module.exports = new jwtToken();
