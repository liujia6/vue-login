// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/jigsaw'
Vue.use(ElementUI);

// 添加一个请求拦截器
axios.interceptors.request.use(function (config) {
    const token=window.localStorage.getItem('token');
　　//这里经常搭配token使用，将token值配置到tokenkey中，将tokenkey放在请求头中
　　if(token){
      config.headers['Authorization'] = token;
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });
//拦截器设置未授权响应跳转
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
            path: '/',
          })
          return response;
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  });

Vue.prototype.$ajax = axios;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
