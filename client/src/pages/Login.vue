<template>
  <div class="login center">
    <el-card class="box-card">
    <el-form  label-width="80px" :model="user">
        <el-form-item label="用户名">
          <el-input v-model="user.account" :rules="[
              { required: true, message: '用户名不能为空'}
            ]"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="user.password" :rules="[
              { required: true, message: '密码不能为空'}
            ]" show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <div id="kigsawContainer">

          </div>
          <!-- <Verify @success="verify=true" @error="verify=false" :type="1"></Verify> -->
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="login">登录</el-button> -->
        </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script>
import md5 from 'js-md5'
import Verify from 'vue2-verify'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data () {
    return {
      user:{
        username:'',
        city:'',
        // verify:false
      },
       draggable: 'Drag Me'
    }
  },
  components:{
    Verify
  },
  methods:{
    login(){
      const form=this.user;
      const that=this;
      form.password=this.CalcuMD5(form.password);
      // if(this.verify===false){
      //    this.$message('验证码错误');
      // }
      this.$ajax.post('/api/login',form).then(function(res){
        if(res.data.code==0){
          Cookies.set('token',res.data.data.token,{ expires: 9999 })
          console.log(res.data.data.uid)
          localStorage.setItem('uid',res.data.data.uid)
          console.log(res.data.uid)
          that.$router.push('/welcome')
        }else{
          that.$message(res.data.message)
        }
      })
    },
     CalcuMD5(pwd) {
      pwd = pwd.toUpperCase();
      pwd = md5(pwd);
      return pwd;
    },
     handleDrop(data, event) {
      alert(`You dropped with data: ${JSON.stringify(data)}`);
    }
  },
  mounted(){
    const that=this;
    const login=this.login;
    jigsaw.init({
      el: document.getElementById('kigsawContainer'),
      width: 250, // 可选, 默认310
      height: 150, // 可选, 默认155
      onSuccess: function () {
        console.log("验证成功")
        login();
      },
      onFail: function () {
        that.$message("验证码错误")
      },
      onRefresh: function () {}
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
