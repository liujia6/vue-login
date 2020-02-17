<template>
  <div class="index">
    <el-card class="box-card login-card">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">个人中心</el-menu-item>
        <el-menu-item index="1" v-permission>管理用户</el-menu-item>
      </el-menu>
      <div class="line"></div>
      <readme class="readme"></readme>
    </el-card>
  </div>
</template>

<script>
import auth from "../auth.js";
import readme from "../../docs/README.md";
export default {
  name: "welcome",
  components: {
    readme
  },
  data() {
    return {
      user: {
        username: "",
        city: ""
      }
    };
  },
  created() {
    const that = this;
    this.$ajax.get("/api/info?uid=" + auth.loginInfo.uid).then(function(res) {
      that.user.city = res.data.data.city;
      that.user.username = res.data.data.username;
    });
  },
  methods: {
    change() {
      const that = this;
      this.$ajax
        .post("api/change", Object.assign(this.user, { uid: auth.loginInfo.uid }))
        .then(res => {
          if (res.data.code === 0) {
            that.$message("修改成功！");
          }
        });
    },
    logout() {
      const that = this;
      this.$confirm("确定要退出当前账号吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功"
          });
          auth.logout();
          this.$router.replace("/");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消注销"
          });
        });
    },
    logoff() {
      // TODO 这里可以将数据库中的token去掉，这样避免注销后，token有效期没过，依然可以登录
      const that = this;
      this.$confirm("确定要注销当前账号吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.$ajax.delete("/api/logoff?uid=" + auth.loginInfo.uid).then(res => {
            if (res.data.code === 0) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              auth.logout();
              that.$router.push("/");
            } else {
              this.$message({
                type: "info",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消注销"
          });
        });
    }
  }
};
</script>

<style scoped>
.login-card {
  /* width:800px; */
  margin: 100px 200px;
}
</style>
