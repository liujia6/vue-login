// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import auth from "./auth.js";
Vue.use(ElementUI);

// 请求拦截
axios.interceptors.request.use(
  function(config) {
    const token = window.localStorage.getItem("token"); //将token放在请求头中
    if (token) {
      //Bearer token是token的一种类型，规范的写法
      config.headers["Authorization"] = `Bearer ` + token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

//设置未授权响应拦截器
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          router.replace({
            path: "/login"
          });
        case 404:
          console.log("404错误");
          return response;
      }
    }
    return Promise.reject(error.response.data); // 返回接口返回的错误信息
  }
);

Vue.prototype.$ajax = axios;
/*
 如果页面是需要权限的，那么我们就去拉取登录权限信息，从meta中判断所需权限是否一致，不一致就返回403
 TODO 如果系统比较复杂可以采用动态拉取权限路由信息
*/

router.beforeEach((to, from, next) => {
  if (to.meta.roleList && auth.token) {
    axios.get("/api/loginInfo").then(res => {
      if (to.meta.roleList.includes(res.data.data.data.role)) {
        next();
      } else {
        next("/403");
      }
    });
  }
  next();
});

// Vue.prototype.$_permission = function(value) {
//   let isExist = false;
//   let btnPermissionsStr = sessionStorage.getItem("btnPermissions");
//   if (btnPermissionsStr == undefined || btnPermissionsStr == null) {
//     return false;
//   }
//   if (value.indexOf(btnPermissionsStr) > -1) {
//     isExist = true;
//   }
//   return isExist;
// };

// Vue.directive("permission", {
//   bind: function(el, binding, vnode) {
//     // 获取按钮权限
//     let btnPermissions = vnode.context.$route.meta.btnPermissions.split(",");
//     if (!Vue.prototype.$_has(btnPermissions)) {
//       el.parentNode.removeChild(el);
//     }
//   }
// });

Vue.directive("permission", {
  bind: function(el, binding, vnode) {
    // 获取按钮权限
    let btnPermission = vnode.context.$route.meta.btnPermission;
    console.log(vnode,el);
    axios.get("/api/loginInfo").then(res => {
      if (!btnPermission.includes(res.data.data.data.role)) {
        el.parentNode.removeChild(el);
      }
    });
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});
