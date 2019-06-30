<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="14" :sm="12" :md="10" :lg="8" :xl="6" class="login">
      <el-form
        ref="Loginform"
        :model="form"
        label-width="80px"
        label-position="top"
        :rules="rules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('Loginform')"
            >登录</el-button
          >
          <el-button @click="resetForm('Loginform')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    async submitForm(formName) {
      let valid = await this.$refs[formName].validate();
      if (valid) {
        try {
          let res = await this.$http({
            url: "http://localhost:8888/api/private/v1/login",
            method: "post",
            data: this.form
          });
          if (res.data.meta.status === 200) {
            localStorage.setItem("mytoken", res.data.data.token);
            this.$router.push("/home");
          } else {
            this.$message({
              type: "error",
              message: res.data.meta.msg,
              duration: 2000
            });
          }
        } catch (err) {
          window.console.log("请求发送失败", err);
        }
        // .then(({ data: { data, meta } }) => {
        //   if (meta.status === 200) {
        //     // console.log(data.token);
        //     localStorage.setItem("mytoken", data.token);
        //     this.$router.push("/home");
        //   } else {
        //     alert(meta.msg);
        //   }
        // });
      } else {
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.row-bg {
  height: 100%;
  background-color: skyblue;
}
.login {
  background-color: #fff;
  padding: 30px 20px;
  border-radius: 10px;
  min-width: 320px;
}
</style>
