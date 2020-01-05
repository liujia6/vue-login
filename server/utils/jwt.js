var jwt=require("jsonwebtoken");

/* 生成jwt签发 */  
class jwtToken{
    constructor(){
        this.secret='sdfjn.../sdf';
    }
    generate(obj){
        const token=jwt.sign(obj,this.secret,{
             expiresIn: '1h' 

        })
        return token;
    }
    verify(token){
        try{
            return jwt.verify(token,this.secret,function(err,data){
                //校验成功err为null，data为当前jwt数据
                // console.log(data,'data');
                // console.log(err&&err.message,'err');
                return err;
            })
        }catch(err){
            return err.message
        }
        
    }
}  
module.exports = new jwtToken();
