<template>
  <div class="welcome">
     <el-card class="box-card center" style="width:500px">
        <el-form  label-width="80px" :model="user">
          <el-form-item label="用户名">
           asdfa
          </el-form-item>
      </el-form>
      <el-button @click="changePassword">修改密码</el-button>
      <el-button @click="logOff">注销</el-button>
      <el-button @click="logout">退出</el-button>
     </el-card>
  </div>
</template>

<script>
const Cookies=require('js-cookie')
export default {
  name: 'Welcome',
  data () {
    return {
      message: ''
    }
  },
  created(){
    this.$ajax.get('/api/welcome',function(res){
      console.log(res)
      this.message=res.data.data;
    })
  },
  methods:{
    logout(){
      Cookies.remove('token');
      this.$message('退出成功');
      this.$router.push('/login');
    },
    logoff(){
      const that=this;
      this.$confirm('确定要注销当前账号吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        that.$ajax.get('/logoff',{account:'ddd'}).then((res)=>{
          if(res.code===0){
            this.$message({
              type: 'success',
              message: '注销成功!'
            });
          }else{
            this.$message({
              type: 'info',
              message: '注销失败!'
            });
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消注销'
        });
      });
    }
  }
}
</script>

<style scoped>

</style>
