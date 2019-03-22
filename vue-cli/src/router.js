import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import Users1 from '@/views/Users1.vue'
import User1 from '@/views/User1.vue'
import Phones1 from '@/views/Phones1.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/users',
      name: 'users', // зачем нужен параметр Name если к тэгу м
      component: Users1
    },
    {
      path: '/phones',
      name: 'phones', // зачем нужен параметр Name если к тэгу м
      component: Phones1
    },
    {
      path: '/users/:idPath',
      name: 'userPut',
      component: User1
    },
    {
      path: '/users/new',
      name: 'userAdd',
      component: User1
    }
  ]
})
