var jwt=require("jsonwebtoken");

/* 生成jwt签发 */  
class jwtToken{
    constructor(){
        this.secret='sdfjn.../sdf';
    }
    /* 产生jwt */
    generate(obj){
        const token=jwt.sign(obj,this.secret,{
             expiresIn: '1h' 

        })
        return token;
    }
    /* 验证前端传过来的jwt */
    verify(token){
        //TODO 这里可以在数据库查询一下是否有改tokn
        try{
            return jwt.verify(token,this.secret,function(err,data){
                //校验成功err为null，data为当前jwt数据
                return{ err,data};
            })
        }catch(err){
            return err.message
        }
        
    }
}  
module.exports = new jwtToken();
