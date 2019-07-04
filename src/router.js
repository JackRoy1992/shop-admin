import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login/Login.vue'
import Home from './views/Home/Home.vue'
import User from './views/User/user.vue'
import Role from './views/Role/role.vue'
import Rights from './views/Role/rights.vue'
import Goods from './views/Goods/Goods.vue'
import Categories from './views/Goods/Categories.vue'
import GoodsAdd from './views/Goods/Goods-add.vue'

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
          path: '/users',
          component: User
        },
        {
          path: '/roles',
          component: Role
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        }
      ]
    },
    {
      path: '/',
      redirect: '/home'
    }
  ]
})
