import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

import Index from '../view/index'
import code from '../components/code'
export default new Router({
  //base: '/tool/WaykiMix/',
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/index',
      component: Index
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/code',
      name: 'code',
      component: code
    }
  ]
})

