<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="addProDialog">添加分类</el-button>
    <el-table
      highlight-current-row
      style="width: 100%"
      :data="categoriesData"
      ref="singleTable"
      stripe
    >
      <el-table-tree-column
        file-icon="el-icon-coin"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        parent-key="cat_pid"
        tree-key="cat_id"
        level-key="cat_level"
        :indent-size="50"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="120">
        <template v-slot="{row}">{{row.cat_deleted? "否":"是"}}</template>
      </el-table-column>
      <el-table-column property="cat_level" label="层级"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="changePage"
    ></el-pagination>
    <!-- 添加分类模态框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="showAddProDialog"
      @close="$refs.addProForm.resetFields()"
    >
      <el-form :model="addProForm" label-width="80px" ref="addProForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input autocomplete="off" v-model="addProForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            :options="cateOptions"
            :props="defaultProps"
            v-model="addProForm.parentArr"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddProDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitAddProData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const ElTreeGrid = require("element-tree-grid");
// Vue.component([ElTreeGrid.name]:ElTreeGrid);
export default {
  data() {
    return {
      addProForm: {
        cat_name: "",
        parentArr: []
      },
      categoriesData: [],
      pagenum: 1,
      pagesize: 6,
      total: 0,
      showAddProDialog: false,
      cateOptions: {},
      defaultProps: {
        checkStrictly: true,
        label: "cat_name",
        value: "cat_id"
      }
    };
  },
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  created() {
    this.getCategoriesData();
  },
  methods: {
    async getCategoriesData() {
      try {
        let res = await this.$http({
          url: "categories",
          params: {
            type: 3,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        });
        if (res.data.meta.status === 200) {
          // console.log(res.data);
          this.categoriesData = res.data.data.result;
          this.total = res.data.data.total;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
      } catch (err) {}
    },
    changePage(page) {
      this.pagenum = page;
      this.getCategoriesData();
    },
    async addProDialog() {
      try {
        let res = await this.$http({
          url: "categories",
          params: {
            type: 2
          }
        });
        if (res.data.meta.status === 200) {
          this.cateOptions = res.data.data;
          this.showAddProDialog = true;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
      } catch (err) {}
    },
    async submitAddProData() {
      let cat_name = this.addProForm.cat_name;
      let cat_level = this.addProForm.parentArr.length;
      let cat_pid = this.addProForm.parentArr.pop() || 0;
      try {
        let res = await this.$http({
          url: "categories",
          method: "post",
          data: {
            cat_name,
            cat_pid,
            cat_level
          }
        });
        if (res.data.meta.status === 201) {
          this.showAddProDialog = false;
          this.getCategoriesData();
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
      } catch (err) {}
    }
  }
};
</script>
