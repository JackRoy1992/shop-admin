<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rightsList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" width="180">
        <template v-slot="{row}">
          <span>{{row.level | levelFilter}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  filters: {
    levelFilter(value) {
      switch (value) {
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";
      }
    }
  },
  async created() {
    try {
      let res = await this.$http({
        url: "rights/list"
      });
      if (res.data.meta.status === 200) {
        this.rightsList = res.data.data;
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 2000
        });
      }
    } catch (err) {}
  }
};
</script>

