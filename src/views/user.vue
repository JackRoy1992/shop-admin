<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="keyword"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="addUserDialog = true">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleStatus(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-slot="{row}">
        <template>
          <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            size="small"
            @click="showEditDialog(row.id)"
          ></el-button>
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            @click="isDelete(row.id)"
          ></el-button>
          <el-button type="success" plain icon="el-icon-check" size="small">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="changePage"
    ></el-pagination>

    <!-- 添加用户的模态框 -->
    <el-dialog
      title="添加用户信息"
      :visible.sync="addUserDialog"
      @close="$refs.addUserForm.resetFields()"
    >
      <el-form :model="addUserForm" label-width="80px" :rules="addUserRules" ref="addUserForm">
        <el-form-item label="用户名" prop="username">
          <el-input autocomplete="off" v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input autocomplete="off" type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input autocomplete="off" v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户的模态框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editUserDialog"
      @close="$refs.editUserForm.resetFields()"
    >
      <el-form :model="editUserForm" label-width="80px" :rules="editUserRules" ref="editUserForm">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editUserForm.username"></el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input autocomplete="off" v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentpage: 1,
      pagesize: 3,
      total: 0,
      keyword: "",
      addUserDialog: false,
      editUserDialog: false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editUserForm: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      addUserRules: {
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
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      },
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        let res = await this.$http({
          url: "users",
          params: {
            query: this.keyword,
            pagenum: this.currentpage,
            pagesize: this.pagesize
          }
        });
        if (res.data.meta.status === 200) {
          this.tableData = res.data.data.users;
          this.total = res.data.data.total;
          // console.log(res.data.data.total);
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
    },
    async toggleStatus(val) {
      // console.log(val);
      try {
        let res = await this.$http({
          url: `users/${val.id}/state/${val.mg_state}`,
          method: "put"
        });
        // console.log(res.data.meta);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 2000
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
      } catch (err) {
        window.console.log("请求失败", err);
      }
    },
    changePage(page) {
      this.currentpage = page;
      this.getData();
    },
    search() {
      this.getData();
    },
    async isDelete(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.currentpage = 1;
          this.getData();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    async submitAddForm() {
      let valid = await this.$refs.addUserForm.validate();
      if (valid) {
        try {
          let res = await this.$http({
            url: "users",
            method: "post",
            data: this.addUserForm
          });
          if (res.data.meta.status === 201) {
            this.$message({
              type: "success",
              message: res.data.meta.msg,
              duration: 2000
            });
            this.getData();
            this.addUserDialog = false;
          } else {
            this.$message({
              type: "error",
              message: res.data.meta.msg,
              duration: 2000
            });
          }
        } catch (err) {
          console.log("请求发送失败", err);
        }
      }
    },
    async showEditDialog(id) {
      this.editUserDialog = true;
      try {
        let res = await this.$http({
          url: `users/${id}`
        });
        if (res.data.meta.status === 200) {
          this.editUserForm = res.data.data;
        }
      } catch (err) {
        console.log("请求发送失败", err);
      }
    },
    async submitEditForm() {
      let valid = await this.$refs.editUserForm.validate();
      if (valid) {
        try {
          let res = await this.$http({
            url: `users/${this.editUserForm.id}`,
            method: "put",
            data: this.editUserForm
          });
          if (res.data.meta.status === 200) {
            this.$message({
              type: "success",
              message: res.data.meta.msg,
              duration: 2000
            });
            this.getData();
            this.editUserDialog = false;
          } else {
            this.$message({
              type: "error",
              message: res.data.meta.msg,
              duration: 2000
            });
          }
        } catch (err) {
          console.log("请求发送失败", err);
        }
      }
    }
  }
};
</script>
<style>
.el-main .el-breadcrumb {
  background-color: #0c8680;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  margin-bottom: 5px;
}
.el-breadcrumb .el-breadcrumb__inner,
.el-breadcrumb .el-breadcrumb__inner.is-link,
.el-breadcrumb .el-breadcrumb__separator,
.el-breadcrumb .el-breadcrumb__inner.is-link:hover,
.el-breadcrumb .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #fff;
  font-size: 18px;
  /* line-height: 50px; */
}
</style>
