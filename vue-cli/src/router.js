import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import UsersTop from '@/views/UsersTop.vue'
import UserTop from '@/views/UserTop.vue'
import Phones from '@/views/Phones.vue'

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
      component: UsersTop
    },
    {
      path: '/phones',
      name: 'phones', // зачем нужен параметр Name если к тэгу м
      component: Phones
    },
    {
      path: '/users/:idPath',
      name: 'userPut',
      component: UserTop
    },
    {
      path: '/users/new',
      name: 'userAdd',
      component: UserTop
    }
  ]
})
