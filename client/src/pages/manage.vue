<template>
  <div class="manage center">
    <el-card class="box-card">
      <el-form  label-width="80px" :model="form" :rules="rules" ref="form">
         <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import md5 from 'js-md5'

export default {
  name: 'Signup',
  data() {
        return {
          tableData: []
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
    created(){
      this.$ajax.get('/api/alluser').then((res)=>{
          console.log(res);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
