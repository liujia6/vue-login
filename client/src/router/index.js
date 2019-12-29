import Vue from 'vue'
import Router from 'vue-router'
import Signup from '@/pages/Signup'
import Login from '@/pages/Login'
import Welcome from '../pages/Welcome'
import Cookie from 'js-cookie'
// import Welcome from '@pages/Welcome'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Signup',
      component: Signup,
    },{
      path:'/Login',
      name:'Login',
      component:Login,
    },{
      path:'/Welcome',
      name:'Welcome',
      component:Welcome
    }
  ]
})
