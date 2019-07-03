export default {
  data() {
    return {
      tableData: [],
      currentpage: 1,
      pagesize: 3,
      total: 0,
      keyword: '',
      addUserDialog: false,
      editUserDialog: false,
      roleDialog: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserForm: {
        id: 0,
        username: '',
        email: '',
        mobile: ''
      },
      roleForm: {
        username: '',
        rid: ''
      },
      value: '',
      rolesList: {},
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 5,
            max: 12,
            message: '长度在 5 到 12 个字符',
            trigger: 'change'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱格式不正确',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            trigger: 'change'
          }
        ]
      },
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: '邮箱格式不正确',
            trigger: 'change'
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号码格式不正确',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      try {
        let res = await this.$http({
          url: 'users',
          params: {
            query: this.keyword,
            pagenum: this.currentpage,
            pagesize: this.pagesize
          }
        })
        if (res.data.meta.status === 200) {
          this.tableData = res.data.data.users
          this.total = res.data.data.total
          // console.log(res.data.data.total);
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 2000
          })
        }
      } catch (err) {
        // window.console.log("请求发送失败", err);
      }
    },
    async toggleStatus(val) {
      // console.log(val);
      try {
        let res = await this.$http({
          url: `users/${val.id}/state/${val.mg_state}`,
          method: 'put'
        })
        // console.log(res.data.meta);
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 2000
          })
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 2000
          })
        }
      } catch (err) {
        // window.console.log("请求失败", err);
      }
    },
    changePage(page) {
      this.currentpage = page
      this.getData()
    },
    search() {
      this.currentpage = 1
      this.getData()
    },
    async isDelete(id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.$http({
          url: `users/${id}`,
          method: 'delete'
        })
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.currentpage = 1
          this.getData()
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    async submitAddForm() {
      try {
        await this.$refs.addUserForm.validate()
        // if (valid) {
        let res = await this.$http({
          url: 'users',
          method: 'post',
          data: this.addUserForm
        })
        if (res.data.meta.status === 201) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 2000
          })
          this.getData()
          this.addUserDialog = false
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 2000
          })
        }
      } catch (err) {
        // window.console.log("请求发送失败", err);
      }
    },
    async showEditDialog(id) {
      this.editUserDialog = true
      try {
        let res = await this.$http({
          url: `users/${id}`
        })
        if (res.data.meta.status === 200) {
          this.editUserForm = res.data.data
        }
      } catch (err) {
        // window.console.log("请求发送失败", err);
      }
    },
    async submitEditForm() {
      let valid = await this.$refs.editUserForm.validate()
      if (valid) {
        try {
          let res = await this.$http({
            url: `users/${this.editUserForm.id}`,
            method: 'put',
            data: this.editUserForm
          })
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg,
              duration: 2000
            })
            this.getData()
            this.editUserDialog = false
          } else {
            this.$message({
              type: 'error',
              message: res.data.meta.msg,
              duration: 2000
            })
          }
        } catch (err) {
          // window.console.log("请求发送失败", err);
        }
      }
    },
    async showRoleDialog(id) {
      this.roleDialog = true
      try {
        // 获取用户信息
        let res = await this.$http({
          url: `users/${id}`
        })
        if (res.data.meta.status === 200) {
          this.roleForm = res.data.data
          // console.log('角色列表', this.roleForm)
          let res1 = await this.$http({
            url: 'roles'
          })
          if (res1.data.meta.status === 200) {
            this.rolesList = res1.data.data
            // console.log('角色名字', this.rolesList)
          } else {
            this.$message({
              type: 'error',
              message: re1s.data.meta.msg,
              duration: 2000
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 2000
          })
        }
        let res1 = await this.$http({
          url: 'roles'
        })
        if (res1.data.meta.status === 200) {
          this.roelsList.push(res1.data.data.roleName)
          // console.log(this.roelsList)
        } else {
          this.$message({
            type: 'error',
            message: res1.data.meta.msg,
            duration: 2000
          })
        }
      } catch (err) {}
    },
    async submitRoleForm() {
      try {
        let res = await this.$http({
          url: `users/${this.roleForm.id}/role`,
          method: 'put',
          data: {
            rid: this.roleForm.rid
          }
        })
        if (res.data.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.data.meta.msg,
            duration: 2000
          })
          this.roleDialog = false
        } else {
          this.$message({
            type: 'error',
            message: res.data.meta.msg,
            duration: 2000
          })
        }
      } catch (err) {}
    }
  }
}
