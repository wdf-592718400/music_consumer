<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="denger" size="mini" @click="delAll"
          >批量删除</el-button
        >
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入用户名"
          class="handle-input"
        ></el-input>
        <el-button type="primary" size="mini" @click="openAddNewUser"
          >添加新用户</el-button
        >
      </div>
    </div>
    <el-table
      size="mini"
      border
      style="width: 100%"
      :data="data"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" />
      <el-table-column label="用户头像" width="110" align="center">
        <template slot-scope="scope">
          <div class="consumer-img">
            <img :src="getUrl(scope.row.avator)" style="width: 100%" />
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
        prop="username"
        label="用户"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column width="50" label="性别" align="center">
        <template slot-scope="scope">
          {{ changeSex(scope.row.sex) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="phoneNum"
        label="手机号"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="email"
        label="电子邮箱"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column width="120" label="生日" align="center">
        <template slot-scope="scope">
          {{ attachBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="introduction"
        label="签名"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="location"
        label="地区"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="收藏" width="80" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="getCollect(data[scope.$index].id)">收藏</el-button>
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
      title="添加新用户"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerForm"
        label-width="80px"
      >
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input
            v-model="registerForm.username"
            placeholder="输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input
            type="password"
            v-model="registerForm.password"
            placeholder="输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input
            v-model="registerForm.phoneNum"
            placeholder="输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮箱" size="mini">
          <el-input
            v-model="registerForm.email"
            placeholder="输入电子邮箱"
          ></el-input>
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
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input
            v-model="registerForm.introduction"
            placeholder="输入签名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input
            v-model="registerForm.location"
            placeholder="输入地区"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="addConsumer('registerForm')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="400px"
      center
    >
      <el-form :model="form" ref="form" :rules="rules" label-width="80px">
        <el-form-item prop="username" label="用户名" size="mini">
          <el-input v-model="form.username" placeholder="输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码" size="mini">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="phoneNum" label="手机号" size="mini">
          <el-input v-model="form.phoneNum" placeholder="输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="电子邮箱" size="mini">
          <el-input v-model="form.email" placeholder="输入电子邮箱"></el-input>
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
        <el-form-item prop="introduction" label="签名" size="mini">
          <el-input
            v-model="form.introduction"
            placeholder="输入签名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="form.location" placeholder="输入地区"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="editDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="editSave('form')">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="删除用户"
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
  getAllConsumer,
  setConsumer,
  updateConsumer,
  delConsumer,
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
        username: "",
        password: "",
        sex: "",
        phoneNum: "",
        email: "",
        birth: "",
        introduction: "",
        location: "",
      },
      form: {
        // 编辑框
        id: "",
        username: "",
        password: "",
        sex: "",
        phoneNum: "",
        email: "",
        birth: "",
        introduction: "",
        location: "",
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, // 分页大小
      currentPage: 1, // 当前页
      idx: -1, // 当前选择项
      multipleSelection: [], // 被选中的选项
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入电子邮箱", trigger: "blur" },
          { type: 'email', message: "请输入正确的电子邮箱", trigger: ["blur", "change"] },
        ],
        birth: [
          { required: true, message: "请选择生日", trigger: "blur" },
        ],
        introduction: [
          { required: true, message: "请输入签名", trigger: "blur" },
        ],
        location: [
          { required: true, message: "请输入地区", trigger: "blur" },
        ],
      },
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
          if (item.username.includes(this.select_word)) {
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
    // 查询所有用户
    getData() {
      this.tableData = [];
      this.tempData = [];
      getAllConsumer().then((res) => {
        this.tableData = res;
        this.tempData = res;
        this.currentPage = 1;
      });
    },
    // 添加用户
    addConsumer(registerForm) {
      this.$refs[registerForm].validate((valid) => {
        if (valid) {
          let params = new URLSearchParams();
          params.append("username", this.registerForm.username);
          params.append("password", this.registerForm.password);
          params.append("sex", this.registerForm.sex);
          params.append("phoneNum", this.registerForm.phoneNum);
          params.append("email", this.registerForm.email);
          params.append("avator", "/img/consumerPic/consumer.png");
          params.append("birth", this.registerForm.birth);
          params.append("introduction", this.registerForm.introduction);
          params.append("location", this.registerForm.location);
          setConsumer(params)
            .then((res) => {
              if (res.code == 1) {
                this.getData();
                this.notify("添加成功", "success");
              } else {
                this.notify("添加失败", "error");
              }
            })
            .catch((err) => {
                console.log(err)
            });
          this.centerDialogVisible = false;
        } else {
          return false;
        }
      });
    },
    // 弹出编辑页面
    handleEdit(row) {
      this.editDialogVisible = true;
      this.form = {
        id: row.id,
        username: row.username,
        password: row.password,
        sex: row.sex,
        phoneNum: row.phoneNum,
        email: row.email,
        birth: row.birth,
        introduction: row.introduction,
        location: row.location,
      };
    },
    // 保存编辑页面修改的数据
    editSave(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
            let params = new URLSearchParams();
            params.append("id", this.form.id);
            params.append("username", this.form.username);
            params.append("password", this.form.password);
            params.append("sex", this.form.sex);
            params.append("phoneNum", this.form.phoneNum);
            params.append("email", this.form.email);
            params.append("birth", this.form.birth);
            params.append("introduction", this.form.introduction);
            params.append("location", this.form.location);
            updateConsumer(params)
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
            } else {
          return false;
        }
      });
    },
    // 更新图片
    uploadUrl(id) {
      return `${this.$store.state.HOST}/consumer/updateConsumerPic?id=${id}`;
    },
    // 删除一名用户
    deleteRow() {
      delConsumer(this.idx)
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
    openAddNewUser() {
      this.registerForm.sex = 1;
      this.centerDialogVisible = true;
    },
    getCollect(id){
      this.$router.push({path: '/collect', query:{id}});
    },
  },
};
</script>

<style lang="less" scoped>
.handle-box {
  margin-bottom: 20px;
}
.consumer-img {
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