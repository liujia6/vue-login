<template>
  <div class="signup center">
    <el-card class="box-card">
    <el-form  label-width="80px" :model="form" :rules="rules" ref="form">
          <el-form-item
            label="用户名"
            prop="account"
          >
            <el-input v-model="form.account"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password"  show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="signup('form')">注册</el-button>
            <el-button type="primary" @click="login">跳转登录</el-button>
          </el-form-item>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import md5 from 'js-md5'

export default {
  name: 'Signup',
  data () {
    return {
      form:{
        account:"",
        password:"",
      },
      rules:{
          account: [
            { required: true, message: '请输入用户名', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ]
      }
    }
  },
  methods:{
    signup(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            const form=this.form;
            form.password=this.CalcuMD5(this.form.password);
            this.$ajax.post("/api/signup",form).then(res => {
              if(res.data.code==1){
                this.$message(res.data.message);
              }else if(res.data.code==0){
                this.$message(res.data.message);
                this.$router.push("/login");
              }
            });
          }
        });

    },
    login(){
      this.$router.push('/login')
    },
    CalcuMD5(pwd) {
      pwd = pwd.toUpperCase();
      pwd = md5(pwd);
      return pwd;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
