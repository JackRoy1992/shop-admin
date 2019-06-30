import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import Axios from "axios";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/css/base.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$http = Axios;
Axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
Axios.interceptors.request.use(function(config) {
  config.headers.Authorization = localStorage.getItem("mytoken");
  return config;
});

// 设置导航守卫，使未登录的都跳回到登录页
router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  if (to.path === "/login") {
    next();
    return;
  }
  if (localStorage.getItem("mytoken")) {
    next();
  } else {
    router.push("/login");
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
