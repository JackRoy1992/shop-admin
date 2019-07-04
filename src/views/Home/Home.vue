<template>
  <el-container>
    <el-header class="homeHeader">
      <el-row type="flex" class="row-bg" align="middle">
        <el-col :span="8">
          <div class="logo">
            <img src="../../assets/logo.png" alt />
          </div>
        </el-col>
        <el-col>
          <h1>品优购后台管理系统</h1>
        </el-col>
        <el-col :span="8" class="link">
          <div>
            欢迎上海39期心悦会员
            <a href="#" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu v-for="menu1 in menuData" :key="menu1.id" :index="menu1.id+''">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu1.authName}}</span>
            </template>
            <el-menu-item-group v-for="menu2 in menu1.children" :key="menu2.id">
              <el-menu-item :index="'/'+menu2.path">
                <i class="el-icon-menu"></i>
                <span slot="title">{{menu2.authName}}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuData: {}
    };
  },
  created() {
    this.getMenuData();
  },
  methods: {
    async getMenuData() {
      try {
        let res = await this.$http({
          url: "menus"
        });
        if (res.data.meta.status === 200) {
          this.menuData = res.data.data;
          // console.log(this.menuData);
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
      } catch (err) {}
    },
    logout() {
      localStorage.setItem("mytoken", "");
      this.$router.push("/login");
    }
  }
};
</script>

<style>
.el-header.homeHeader {
  background-color: skyblue;
  padding: 0;
}
.el-header .logo img {
  width: 200px;
}
.el-header h1 {
  text-align: center;
  color: #fff;
  font-size: 34px;
}
.el-header .link {
  text-align: right;
  font-weight: 700;
  padding-right: 20px;
}
.el-header .link a {
  color: goldenrod;
  text-decoration: none;
}
.el-container {
  height: 100%;
}
.el-menu-vertical-demo {
  height: 100%;
}
</style>
