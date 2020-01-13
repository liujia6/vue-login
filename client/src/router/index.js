import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Welcome from '../pages/welcome'
import manage from '@/pages/manage'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path:'/',redirect:{name:'Login'}
    // },
    {
      path: '/',
      name: 'Login',
      component: Login,
      meta:{
        authDisable:true
      }
    },{
      path:'/Index',
      name:'Index',
      redirect:to =>{
        
      }
    },{
      path:'/Welcome',
      name:'Welcome',
      component:Welcome
    },{
      path:'/manage',
      component:manage
    }
  ]
})
