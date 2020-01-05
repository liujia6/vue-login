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

// 请求拦截
axios.interceptors.request.use(function (config) {
    const token=window.localStorage.getItem('token');
　　//将token放在请求头中
　　if(token){
    //Bearer token是token的一种类型，规范的写法
      config.headers['Authorization'] = `Bearer `+token;
    }
  return config;
}, function (error) {
  return Promise.reject(error);
});

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
            path: '/',
          })
        case 404:
          console.log('404错误');
          return response;
      }
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
});

Vue.prototype.$ajax = axios;
//每次路由跳转的时候判断页面是否需要token，再检验是否有token，没有的话就跳转登录，有的话就继续；可根据不同业余需求更改
router.beforeEach((to, from, next) => {
  if(!to.meta.authDisable){
    if(!window.localStorage.getItem('token')){
      next('/')
    }
  }
  next()
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
