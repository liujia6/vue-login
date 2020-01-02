<template>
  <div class="signup center">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="注册" name="first">
            <el-form  label-width="80px" :model="form" :rules="rules" ref="form">
              <el-form-item label="用户名" prop="account">
                <el-input v-model="form.account"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="form.password"  show-password></el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="captcha">
                <el-col :span="16">
                  <el-input type="text" v-model="form.captcha"></el-input>
                </el-col>
                <el-col :span="2">
                  <div v-html="res" @click="refreshCaptcha"></div>
                </el-col>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="signup('form')">注册</el-button>
              </el-form-item>
            </el-form>

        </el-tab-pane>
        <el-tab-pane label="登录" name="second">
          <el-form  label-width="80px" :model="user" :rules="rules" ref="user">
            <el-form-item label="用户名" prop="account">
              <el-input v-model="user.account"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="user.password" show-password></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <el-col :span="16">
                  <el-input type="text" v-model="user.captcha"></el-input>
                </el-col>
                <el-col :span="2">
                  <div v-html="res" @click="refreshCaptcha"></div>
                </el-col>
              <!-- <div id="kigsawContainer">
              </div> -->
              <!-- <Verify @success="verify=true" @error="verify=false" :type="1"></Verify> -->
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login('user')">登录</el-button>
            </el-form-item>
        </el-form>
      </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import md5 from 'js-md5'

export default {
  name: 'Signup',
  data () {
    return {
      activeName:'second',
      form:{
        account:"",
        password:"",
        captcha:""
      },
      user:{
        account:"",
        password:"",
        captcha:""
      },
      res:"",
      rules:{
          account: [
            { required: true, message: '请输入用户名', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ],
          captcha:[
            {required:true,message:'请输入验证码',trigger:'change'}
          ]
      },
      res:''
    }
  },
  methods:{
    signup(formName){
      const that=this;
      this.$refs[formName].validate((valid) => {
          if (valid) {
            const form=this.form;
            form.captcha=form.captcha.toLowerCase()
            form.password=this.CalcuMD5(this.form.password);
            this.$ajax.post("/api/signup",form).then(res => {
              if(res.data.code==1){
                this.$message(res.data.message);
              }else if(res.data.code==0){
                this.$message(res.data.message);
                that.activeName="second"
              }
            });
          }
      });
    },
    login(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            const form=this.user;
            const that=this;
            form.password=this.CalcuMD5(form.password);
            form.captcha=form.captcha.toLowerCase();
            this.$ajax.post('/api/login',form).then(function(res){
              if(res.data.code==0){
                localStorage.setItem('uid',res.data.data.uid)
                that.$router.push('/welcome')
              }else{
                that.$message(res.data.message)
              }
            })
          }
      });

    },
    CalcuMD5(pwd) {
      pwd = pwd.toUpperCase();
      pwd = md5(pwd);
      return pwd;
    },
    refreshCaptcha(){
      this.$ajax.get('/api/getCaptcha').then((res)=>{
        this.res=res.data
      })
    }
  },
  created(){
    this.refreshCaptcha();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
