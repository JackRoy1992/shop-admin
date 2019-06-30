import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import User from "./views/user.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/user",
          component: User
        }
      ]
    },
    {
      path: "/",
      redirect: "/home"
    }
  ]
});
