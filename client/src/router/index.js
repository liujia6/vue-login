import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import welcome from '../pages/welcome'
import manage from '@/pages/manage'
import index from '@/pages/index'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path:'/',redirect:{name:'login'}
    // },
    {
      path: '/',
      name: 'login',
      component: login,
    },{
      path:'/index',
      name:'index',
      component:index,
    },{
      path:'/welcome',
      name:'welcome',
      component:welcome
    },{
      path:'/manage',
      component:manage,
      roleList:['admin'],
    }
  ]
})
