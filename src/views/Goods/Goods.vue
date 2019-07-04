<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain>添加商品</el-button>
    <el-table highlight-current-row style="width: 100%" :data="goodsData" ref="singleTable" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称" width="400"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsData: [],
      pagenum: 1,
      pagesize: 6,
      total: 0
    };
  },
  created() {
    this.getGoodsData();
  },
  methods: {
    async getGoodsData() {
      try {
        let res = await this.$http({
          url: "goods",
          params: {
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        });
        if (res.data.meta.status === 200) {
          console.log(res.data.data.total);
          this.goodsData = res.data.data.goods;
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
      this.currentpage = page;
      this.getGoodsData();
    }
  }
};
</script>

