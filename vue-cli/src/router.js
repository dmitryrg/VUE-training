import Vue from 'vue'
import Router from 'vue-router'

const UserTop = () => import('@/views/UserTop.vue')

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue')
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersTop.vue')
    },
    {
      path: '/phones',
      name: 'phones',
      component: () => import('@/views/Phones.vue')
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
