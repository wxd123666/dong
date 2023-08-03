import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Detail from '@/components/detail'
import Login from '@/components/login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/detail/:id/:type/',
      name: 'detail',
      component: Detail,
    },
    {
      path: '/login/:type/',
      name: 'login',
      component: Login,
    }
  ]
})
