<template>
  <div class="welcome">
     <el-card class="box-card center" style="width:500px">
        <el-form  label-width="80px" :model="user">
          <el-form-item label="用户名">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="user.city"></el-input>
          </el-form-item>
          </el-form>
          <el-button @click="change">确定更改</el-button>
          <!-- <el-button @click="logOff">注销</el-button> -->
          <el-button @click="logout">退出</el-button>
          <el-button @click="logoff">注销</el-button>
     </el-card>
  </div>
</template>

<script>
const Cookies=require('js-cookie')
export default {
  name: 'Welcome',
  data () {
    return {
      user: {
        username:'',
        city:''
      }
    }
  },
  created(){
    const that=this;
    this.$ajax.get('/api/info?uid='+localStorage.uid).then(function(res){
      console.log(res.data,that.user)
      that.user.city=res.data.data.city;
      that.user.username=res.data.data.username;
    })
  },
  methods:{
    change(){
      const that=this;
      this.$ajax.post('api/change',Object.assign(this.user,{uid:localStorage.getItem('uid')})).then((res)=>{
          if(res.data.code===0){
            that.$message('修改成功！')
          }
      })
    },
    logout(){
      Cookies.remove('token');
      localStorage.removeItem('uid')
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
        that.$ajax.delete('/api/logoff',{uid:localStorage.getItem('uid')}).then((res)=>{
          if(res.code===0){
            this.$message({
              type: 'success',
              message: '注销成功!'
            });
            localStorage.removeItem('uid')
            Cookies.remove('token')
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
