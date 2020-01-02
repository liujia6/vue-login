// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Cookie from 'js-cookie'
import './assets/jigsaw'
Vue.use(ElementUI);

const service = axios.create({
  // baseURL: 'http://192.168.17.96:8080', // api 的 base_url
  timeout: 5000 // 请求超时时间
})

service.interceptors.response.use(
  config => {
    // console.log(config.status)
    // debugger;
    if(config.status=='403'){
      vm.$message('token校验不成功')
    }
    // console.log(config)
    //   if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    //       config.headers.Authorization = `token ${store.state.token}`;
    //   }
      // return config;
  },
  err => {
      return Promise.reject(err);
  });
// router.beforeEach((to, from, next) => {
//   if(to.path!=='/login'&&to.path!=='/signup'){
//     if(Cookie.get('token'))
//   }
//   next()
// })

Vue.prototype.$ajax = axios;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
