<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="roleList" stripe style="width: 100%">
      <!-- 下拉列表 -->
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row type="flex" v-for="level1 in row.children" :key="level1.id" class="row">
            <el-col :span="4">
              <el-tag
                closable
                type="primary"
                class="tag"
                @close="delRights(row,level1.id)"
              >{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row type="flex" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success"
                    class="tag"
                    @close="delRights(row,level2.id)"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    closable
                    type="warning"
                    class="tag"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    @close="delRights(row,level3.id)"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作" v-slot="{ row }">
        <template>
          <el-button type="primary" plain icon="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="small"></el-button>
          <el-button
            type="success"
            plain
            icon="el-icon-check"
            size="small"
            @click="showRoleDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限模态框 -->
    <el-dialog title="分配权限" :visible.sync="editRoleDialog">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-expand-all="true"
        :default-checked-keys="checkedRights"
        ref="rightTree"
      ></el-tree>
      <!-- :default-checked-keys="checkedRights"表示选中的权限 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      roleList: [],
      editRoleDialog: false,
      currentRoleId: -1,
      checkedRights: [],
      rightsList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      }
    };
  },
  methods: {
    async getRoleData() {
      try {
        let res = await this.$http({
          url: "roles"
        });
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.roleList = res.data.data;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
      } catch (err) {}
    },
    async showRoleDialog(row) {
      this.editRoleDialog = true;
      this.currentRoleId = row.id;
      try {
        let res = await this.$http({
          url: "rights/tree"
        });
        if (res.data.meta.status === 200) {
          // 将所有的权限显示在tree
          this.rightsList = res.data.data;
          // 将三个等级的id放到各自的对应的数组
          let level1Id = [];
          let level2Id = [];
          let level3Id = [];
          row.children.forEach(level1 => {
            level1Id.push(level1.id);
            level1.children.forEach(level2 => {
              level2Id.push(level2.id);
              level2.children.forEach(level3 => {
                level3Id.push(level3.id);
              });
            });
          });
          // 将三个数组结构，数据放到一个代表选中的数组中
          // this.checkedRights = [...level1Id, ...level2Id, ...level3Id];
          this.checkedRights = [...level3Id];
        }
      } catch (err) {}
    },
    async submitRoleForm() {
      let rids = [
        ...this.$refs.rightTree.getCheckedKeys(),
        ...this.$refs.rightTree.getHalfCheckedKeys()
      ].join(",");
      try {
        let res = await this.$http({
          url: `roles/${this.currentRoleId}/rights`,
          method: "post",
          data: {
            rids
          }
        });
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 2000
          });
          this.getRoleData();
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
        this.editRoleDialog = false;
      } catch (err) {}
    },
    async delRights(row, id) {
      // console.log(id);
      // 将三个等级的id放到各自的对应的数组
      let level1Id = [];
      let level2Id = [];
      let level3Id = [];
      row.children.forEach(level1 => {
        level1Id.push(level1.id);
        level1.children.forEach(level2 => {
          level2Id.push(level2.id);
          level2.children.forEach(level3 => {
            level3Id.push(level3.id);
          });
        });
      });
      // 将三个数组结构，数据放到一个代表选中的数组中
      let result = [...level1Id, ...level2Id, ...level3Id];
      //从显示的权限中过滤掉删除的权限
      let rids = result.filter(v => v !== id).join(",");
      // console.log(result, rids);
      let res = await this.$http({
        url: `roles/${row.id}/rights`,
        method: "post",
        data: { rids }
      });
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 2000
        });
        this.getRoleData();
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 2000
        });
      }
    }
  },
  created() {
    this.getRoleData();
  }
};
</script>

<style>
.row {
  border-bottom: 1px dashed #ccc;
}
.tag {
  margin: 10px;
}
</style>


