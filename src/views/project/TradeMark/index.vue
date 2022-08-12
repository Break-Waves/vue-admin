<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">
      添 加</el-button
    >

    <!-- 
      表格组件 
      data:表格组件将来需要展示的数据----数组类型
      border: 是给表格添加边框
      column属性
      label:显示标题
      width:对应列的宽度
      align:标题对齐的方式
      type=index:可以显示序号
      prop:对应列内容的字段名
    -->
    <el-table border style="width: 100%" class="table" :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" align="center">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌" align="center">
        <!-- row为每一条数据，$index为序号 并且这里使用作用域插槽插入图片 -->
        <template v-slot="{ row, $index }">
          <img :src="row.logoUrl" style="width: 60px; height: 50px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <el-button
          type="warning"
          icon="el-icon-edit"
          size="mini"
          @click="updateTrademark"
          >修改</el-button
        >
        <el-button type="danger" icon="el-icon-delete" size="mini"
          >删除</el-button
        >
      </el-table-column>
    </el-table>

    <!-- 
      分页器 
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @current-change="" 
      @size-change=""
      current-page:代表的是当前第几页
      total:代表分页器一共需要战术数据条数
      page-size:代表的是每一页需要展示多少条数据
      page-sizes:代表可以设置每一页展示多少条数据
      pager-count:按钮的数据 如果9 连续页码是7,如果是7 连续页码是5
      layout:可以实现分页器布局   
      ->位于最右边,跳转里面的sizes,tatal位置可以实现页面的改变
    -->

    <el-pagination
      style="margin-top: 20px; textAlign: center"
      background
      :current-page="current"
      :pager-count="7"
      layout="prev,pager,next,jumper,->,sizes,total"
      :page-size="size"
      :page-sizes="[3, 5, 7]"
      :total="total"
      @current-change="handleCurrentChange"
    >
    </el-pagination>

    <!-- 对话框 -->

    <!-- :visible.sync---设置对话框显示与隐藏用的 -->

    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- form表单

          model	表单数据对象
      -->
      <el-form style="width:80%" :model="tmForm">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px">
          <!-- 
          show-file-list	是否显示已上传文件列表
          action	必选参数，上传的地址
          on-success	文件上传成功时的钩子
          before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
          -->
          <el-upload
            class="avatar-uploader"
            action="dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload_tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "TradeMark",
  data() {
    return {
      //对话框设置显示与隐藏的属性
      dialogFormVisible: false,
      //上传图片使用的属性
      tmForm: {
        //收集品牌名和logo图片数据作为参数传至服务器，故此处的变量名应根据接口文档中的参数名来命名
        tmName: "心怡姐姐yyds",
        logoUrl: "",
      },
    };
  },
  mounted() {
    this.getBrandList({ page: "1", limit: "4" });
  },
  methods: {
    ...mapActions("product", ["getBrandList","addOrUpdateBanner"]),
    handleCurrentChange(pager) {
      //pager为你点击的页码数
      this.current = pager;
      this.getBrandList({ page: this.current, limit: "6" });
    },
    showDialog() {
      this.dialogFormVisible = true;
      //清空tmForm数据，避免下次点击添加时残留上次的添加品牌信息
      this.tmForm = {
        tmName:'',
        logoUrl:''
      }
    },
    updateTrademark() {
      this.dialogFormVisible = true;
    },
    //上传图片成功
    handleAvatarSuccess(res, file) {
      //上传成功后服务器返回前端数据
      // console.log(res,file);
      //收集品牌图片数据，将来需要带给服务器
      this.tmForm.logoUrl = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addOrUpdate(){
      this.dialogFormVisible = false
      this.addOrUpdateBanner(this.tmForm)
      this.getBrandList({ page: "1", limit: "4" })
      this.$message(this.tmForm.id?'修改品牌成功':'添加品牌成功');
    }
  },
  computed: {
    ...mapGetters("product", ["list", "total", "size"]),
    current: {
      get() {
        return this.$store.state.product.brandData.current;
      },
      set(value) {
        this.$store.state.product.brandData.current = value;
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  margin-top: 15px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
