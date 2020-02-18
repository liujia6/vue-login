import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import welcome from '../pages/welcome'
import manage from '@/pages/manage'
import index from '@/pages/index'
import unauthorized from '@/pages/403'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path:'/',redirect:{name:'index'}
    },
    {
      path: '/login',
      name: 'login',
      component: login,
    },{
      path:'/index',
      name:'index',
      component:index,
      meta:{
        btnPermission:[1]
      }
    },{
      path:'/welcome',
      name:'welcome',
      component:welcome
    },{
      path:'/manage',
      component:manage,
      meta:{
        roleList:[1],
      }
    },{
      path: '/403',
      name: '403',
      component: unauthorized,
    },{
      path:'*',
      redirect:{name:'index'}
    }
  ]
})
