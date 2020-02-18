<template>
  <div class="manage center">
    <el-card class="box-card">
         <el-table
          :data="list"
          >
          <el-table-column
            prop="account"
            label="账户名"
            width="140">
          </el-table-column>
          <el-table-column
            prop="_id"
            label="uid"
            width="140">
          </el-table-column>
          <el-table-column
            prop="username"
            label="用户名"
            width="140">
          </el-table-column>
          <el-table-column
            prop="password"
            label="密码"
            width="140">
          </el-table-column>
          <el-table-column
            prop="code"
            label="身份"
            width="140">
          </el-table-column>
          <el-table-column
            prop="city"
            label="城市">
          </el-table-column>
          <el-table-column
            label="操作"
            fixed="right"
          >
            <template slot-scope="scope">
              <!-- <el-button @click="get(scope.row)" type="text" size="small">查看</el-button> -->
              <el-button type="text" size="small" @click="handleClick(scope.row)">编辑</el-button>
              <el-button
                @click.native.prevent="deleteRow(scope.row)"
                type="text"
                size="small">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
  <el-dialog title="编辑" :visible.sync="dialogEdit">
    <el-form :model="row" label-width="100px">
      <el-form-item label="用户名">
        <el-input v-model="row.username"></el-input>
      </el-form-item>
      <el-form-item label="账户">
        <span>{{row.account}}</span>
      </el-form-item>
      <el-form-item label="密码">
        <span>{{row.password}}</span>
      </el-form-item>
      <el-form-item label="城市">
        <el-input v-model="row.city"></el-input>
      </el-form-item>
      <el-form-item label="uid">
        <el-input v-model="row._id"></el-input>
      </el-form-item>
      <el-form-item label="身份">
        <el-select v-model="row.code" placeholder="身份">
          <el-option label="管理员" value="2"></el-option>
          <el-option label="普通用户" value="1"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data() {
        return {
          list: [],
          dialogEdit:false,
          form:{},
          row:{}
        }
  },
  methods:{
    handleClick(row){
      this.dialogEdit=true;
      this.row=Object.assign({},row);
      switch(this.row.code){
          case 2:
            this.row.code = '普通用户';
            break;
          case 1:
            this.row.code =  '管理员';
            break;
      }
    },
    edit(data){
      this.form=data
    },
    cancel(){
      this.dialogEdit=false;
    },
    async confirm(){
      console.log(this.row._id);
      let res = await this.$ajax.post('/api/change?uid='+this.row._id,this.row)
      this.getAllUsers();
      this.dialogEdit=false;
      console.log(res);
    },
    async deleteRow($row){
      const res = await this.$ajax.delete('/api/logoff?uid='+$row._id);
      if(res.data.code===0){
        this.getAllUsers();
      }
      this.$message(res.data.message)

    },
    async getAllUsers(){
      const res = await this.$ajax.get('/api/getAllUsers');
      this.list = res.data.data;
      console.log(this.list,res.data.data);
    }
  },
  async mounted(){
      this.getAllUsers();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.manage{
  width:1000px;
}
</style>
