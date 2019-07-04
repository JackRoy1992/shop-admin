<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps finish-status="success" align-center :active="active">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <el-tabs tab-position="left" style="height: 500px;" @tab-click="tabClick" :value="activeName">
      <el-tab-pane label="基本信息" name="proInfo">
        <!-- <el-form ref="form" :model="form" label-width="80px"> -->
        <el-form label-width="80px" :model="infoData">
          <el-form-item label="商品名称">
            <el-input v-model="infoData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model.number="infoData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model.number="infoData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model.number="infoData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              :options="cateOptions"
              :props="defaultProps"
              v-model="proForm.parentArr"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="infoData.is_promote" label="1">是</el-radio>
            <el-radio v-model="infoData.is_promote" label="2">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1,'proPic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="proPic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="uploadPic"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2,'proDrc')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="proDrc" :model="infoData">
        <quill-editor class="quill-editor" v-model="infoData.goods_introduce"></quill-editor>
        <el-button type="primary" style="margin-top:20px" @click="submitAddPro">提交</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: 0,
      infoData: {
        goods_name: "",
        goods_price: "",
        goods_weight: "",
        goods_number: "",
        goods_cat: "",
        is_promote: "",
        pics: [],
        goods_introduce: ""
      },
      proForm: {
        cat_name: "",
        parentArr: []
      },
      cateOptions: [],
      defaultProps: {
        label: "cat_name",
        value: "cat_id"
      },
      activeName: "proInfo",
      headers: {
        Authorization: localStorage.getItem("mytoken")
      }
    };
  },
  created() {
    this.getProForm();
  },
  methods: {
    tabClick(value) {
      this.active = +value.index;
      this.activeName = value.name;
    },
    async getProForm() {
      try {
        let res = await this.$http({
          url: "categories",
          params: {
            type: 3
          }
        });
        if (res.data.meta.status === 200) {
          this.cateOptions = res.data.data;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 2000
          });
        }
      } catch (err) {}
    },
    next(num, value) {
      this.active = num;
      this.activeName = value;
      // console.log(this.infoData, this.proForm);
    },
    uploadPic(res) {
      // console.log(res);
      if (res.meta.status === 200) {
        this.infoData.pics.push(res.data.tmp_path);
        this.$message({
          type: "success",
          message: res.meta.msg,
          duration: 2000
        });
      } else {
        this.$message({
          type: "error",
          message: res.meta.msg,
          duration: 2000
        });
      }
    },
    async submitAddPro() {
      this.infoData.goods_cat = this.proForm.parentArr.join();
      // console.log(this.infoData);
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: this.infoData
      });
      if (res.data.meta.status === 201) {
        this.$router.push("/goods");
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
    }
  }
};
</script>

<style>
.ql-container {
  height: 300px;
}
</style>

