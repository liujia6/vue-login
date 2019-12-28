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
      <el-button @click="logOut">退出</el-button>
     </el-card>
  </div>
</template>

<script>
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
}
</script>

<style scoped>

</style>
