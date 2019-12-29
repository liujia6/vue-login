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
