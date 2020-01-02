import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Welcome from '../pages/Welcome'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',redirect:{name:'Login'}
    },
    {
      path: 'Login',
      name: 'Login',
      component: Login,
    },{
      path:'/Welcome',
      name:'Welcome',
      component:Welcome
    }
  ]
})
