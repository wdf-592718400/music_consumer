<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="denger" size="mini" @click="delAll">批量删除</el-button>
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入歌手名"
          class="handle-input"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          @click="centerDialogVisible = true"
          >添加歌手</el-button
        >
      </div>
    </div>
    <el-table size="mini" border style="width: 100%" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40"/>
      <el-table-column label="歌手图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="singer-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%" />
          </div>
          <el-upload
            :action="uploadUrl(scope.row.id)"
            :on-success="handleAvatorSuccess"
            :before-upload="beforeAvatorUpload"
          >
            <el-button size="mini"> 更新头像 </el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="歌手"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column width="50" label="性别" align="center">
        <template slot-scope="scope">
          {{ changeSex(scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column width="120" label="生日" align="center">
        <template slot-scope="scope">
          {{ attachBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="location"
        label="地区"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="introduction"
        label="简介"
        align="center"
      ></el-table-column>
      <el-table-column
        width="110"
        label="歌曲管理"
        align="center"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="songEdit(scope.row.id, scope.row.name)">歌曲管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        :page-sizes="[3, 5, 10]"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></el-pagination>
    </div>

    <el-dialog
      title="添加歌手"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input
            v-model="registerForm.name"
            placeholder="输入歌手名"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="registerForm.birth"
            placeholder="选择日期"
            type="date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input
            v-model="registerForm.location"
            placeholder="输入地区"
          ></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input
            v-model="registerForm.introduction"
            placeholder="输入简介"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="addSinger">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改歌手信息"
      :visible.sync="editDialogVisible"
      width="400px"
      center
    >
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input v-model="form.name" placeholder="输入歌手名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">未知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="form.birth"
            placeholder="选择日期"
            type="date"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="form.location" placeholder="输入地区"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input
            v-model="form.introduction"
            placeholder="输入简介"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="删除歌手"
      :visible.sync="delDialogVisible"
      width="300px"
      center
    >
      <div align="center">删除后不可恢复, 是否确定删除?</div>
      <span slot="footer">
        <el-button size="mini" @click="delDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mixin } from "../mixins/index";
import {
  getAllSinger,
  setSinger,
  updateSinger,
  delSinger,
} from "../api/index.js";
export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      editDialogVisible: false, // 编辑弹窗是否显示
      delDialogVisible: false, // 删除提示框是否显示
      registerForm: {
        // 添加框
        name: "",
        sex: "",
        birth: "",
        location: "",
        introduction: "",
      },
      form: {
        // 编辑框
        id: "",
        name: "",
        sex: "",
        birth: "",
        location: "",
        introduction: "",
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, // 分页大小
      currentPage: 1, // 当前页
      idx: -1, // 当前选择项
      multipleSelection: [] // 被选中的选项
    };
  },
  computed: {
    // 计算当前搜索结果表里面的数据
    data() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
  },
  watch: {
    // 搜索框内容发生变化时, 表格内容跟随变化
    select_word: function () {
      if (this.select_word == "") {
        this.tableData = this.tempData;
      } else {
        this.tableData = [];
        for (let item of this.tempData) {
          if (item.name.includes(this.select_word)) {
            this.tableData.push(item);
          }
        }
      }
    },
  },
  created() {
    this.getData();
  },
  methods: {
    // 获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    // 查询所有歌手
    getData() {
      this.tableData = [];
      this.tempData = [];
      getAllSinger().then((res) => {
        this.tableData = res;
        this.tempData = res;
        this.currentPage = 1;
      });
    },
    // 添加歌手
    addSinger() {
      let params = new URLSearchParams();
      params.append("name", this.registerForm.name);
      params.append("sex", this.registerForm.sex);
      params.append("pic", "/img/singerPic/singer.png");
      params.append("birth", this.registerForm.birth);
      params.append("location", this.registerForm.location);
      params.append("introduction", this.registerForm.introduction);
      setSinger(params)
        .then((res) => {
          if (res.code == 1) {
            this.getData();
            this.notify("添加成功", "success");
          } else {
            this.notify("添加失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.centerDialogVisible = false;
    },
    // 弹出编辑页面
    handleEdit(row) {
      this.editDialogVisible = true;
      this.form = {
        id: row.id,
        name: row.name,
        sex: row.sex,
        birth: row.birth,
        location: row.location,
        introduction: row.introduction,
      };
    },
    // 保存编辑页面修改的数据
    editSave() {
      let params = new URLSearchParams();
      params.append("id", this.form.id);
      params.append("name", this.form.name);
      params.append("sex", this.form.sex);
      params.append("birth", this.form.birth);
      params.append("location", this.form.location);
      params.append("introduction", this.form.introduction);
      updateSinger(params)
        .then((res) => {
          if (res.code == 1) {
            this.getData();
            this.notify("修改成功", "success");
          } else {
            this.notify("修改失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.editDialogVisible = false;
    },
    // 更新图片
    uploadUrl(id) {
      return `${this.$store.state.HOST}/singer/updateSingerPic?id=${id}`;
    },
    // 删除一名歌手
    deleteRow() {
      delSinger(this.idx)
        .then((res) => {
          if (res) {
            this.getData();
            this.notify("删除成功", "success");
          } else {
            this.notify("删除失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.delDialogVisible = false;
    },
    // 跳转至歌曲管理页面
    songEdit(id, name){
      this.$router.push({path:`Song`, query:{id, name}})
    }
  },
};
</script>

<style lang="less" scoped>
.handle-box {
  margin-bottom: 20px;
}
.singer-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.pagination {
  display: flex;
  justify-content: center;
}
</style>