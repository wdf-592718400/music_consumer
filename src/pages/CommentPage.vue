<template>
  <div class="table">
    <div class="crumbs"><i class="el-icon-tickets" />评论信息</div>
    <div class="container">
      <div class="handle-box">
        <el-button type="denger" size="mini" @click="delAll1"
          >批量删除</el-button
        >
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="筛选关键词"
          class="handle-input"
        ></el-input>
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
      <el-table-column
        prop="name"
        label="用户名"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="content"
        label="评论内容"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)"
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
      title="删除评论"
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
  getCommentOfSongListId,
  deleteComment,
  getUserOfId,
} from "../api/index.js";
export default {
  mixins: [mixin],
  props: ["id"],
  data() {
    return {
      delDialogVisible: false, // 删除提示框是否显示
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, // 分页大小
      currentPage: 1, // 当前页
      idx: -1, // 当前选择项
      multipleSelection: [], // 被选中的选项
      allSongs: [], // 可供选择的歌曲信息
      selectId: "",
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
      getCommentOfSongListId(this.$route.query.id).then((res) => {
        for (let item of res) {
          this.getUsers(item);
        }
        this.currentPage = 1;
      });
    },
    // 根据歌曲 ID 查询歌曲对象
    getUsers(item) {
      getUserOfId(item.user_id)
        .then((res) => {
          let temp = item;
          temp.name = res.username;
          this.tableData.push(temp);
          this.tempData.push(temp);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 删除评论
    deleteRow() {
      deleteComment(this.idx.id)
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
    // 批量删除已经选择的项
    delAll1() {
      for (let item of this.multipleSelection) {
        this.idx = item;
        deleteComment(this.idx.id)
          .then((res) => {
            if (res) {
              this.notify("删除成功", "success");
            } else {
              this.notify("删除失败", "error");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.getData();
      this.multipleSelection = [];
    },
  },
};
</script>

<style lang="less" scoped>
.handle-box {
  margin-bottom: 20px;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
</style>