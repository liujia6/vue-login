module.exports = function (){
    function transCodeToId(code){
        switch(code){
            case 0: return '普通用户';
            case 1: return '管理员';
        }
    }
}