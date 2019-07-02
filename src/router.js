import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue'
import Home from './views/Home/Home.vue'
import User from './views/User/user.vue'
import Role from './views/Role/role.vue'
import Rights from './views/Role/rights.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/user',
          component: User
        },
        {
          path: '/role',
          component: Role
        },
        {
          path: '/rights',
          component: Rights
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
