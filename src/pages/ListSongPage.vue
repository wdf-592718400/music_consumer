<template>
  <div class="table">
    <div class="crumbs"><i class="el-icon-tickets" />歌曲信息</div>
    <div class="container">
      <div class="handle-box">
        <el-button type="denger" size="mini" @click="delAll"
          >批量删除</el-button
        >
        <el-input
          size="mini"
          v-model="select_word"
          placeholder="请输入歌曲名"
          class="handle-input"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          @click="centerDialogVisible = true"
          >添加歌曲</el-button
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
      <el-table-column
        prop="name"
        label="歌手-歌名"
        width="120"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="introduction"
        label="专辑"
        width="150"
        align="center"
      ></el-table-column>
      <el-table-column label="歌词" align="center">
        <template slot-scope="scope">
            <ul style="height: 100px; overflow-y: scroll;">
                <li v-for="(item, index) in parseLyrit(scope.row.lyric)" :key="index">
                    {{item}}
                </li>
            </ul>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
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
      title="添加歌曲"
      :visible.sync="centerDialogVisible"
      width="400px"
      open="addSongDialog"
      center
    >
      <el-form ref="registerForm" :model="registerForm" id="addForm">
        <el-form-item prop="singerName" label="" size="mini">
          <el-select v-model="registerForm.singerName" placeholder="请选择歌曲">
            <el-option
              v-for="item in allSongs"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false"
          >取消</el-button
        >
        <el-button size="mini" @click="getSongId">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="删除歌曲"
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
  listSongOfSongListId,
  songOfSongId,
  songOfSongName,
  listSongAdd,
  delListSong,
  allSongOfSelect,
} from "../api/index.js";
export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, // 添加弹窗是否显示
      delDialogVisible: false, // 删除提示框是否显示
      registerForm: {
        // 添加框
        singerName: "",
        songName: "",
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, // 分页大小
      currentPage: 1, // 当前页
      idx: -1, // 当前选择项
      multipleSelection: [], // 被选中的选项
      songListId: "", // 歌单 ID
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
    this.songListId = this.$route.query.id;
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
    // 查询所有歌曲
    addSongDialog(selectId) {
      this.allSongs = [];
      allSongOfSelect(selectId)
        .then((res) => {
          this.allSongs = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询所有歌手
    getData() {
      this.tableData = [];
      this.tempData = [];
      listSongOfSongListId(this.songListId).then((res) => {
        var selectId = "";
        for (let item of res) {
          selectId += item.song_id + ", ";
          this.getSong(item.song_id);
        }
        this.addSongDialog(selectId);
        this.currentPage = 1;
      });
    },
    // 根据歌曲 ID 查询歌曲对象
    getSong(id) {
      songOfSongId(id)
        .then((res) => {
          this.tableData.push(res);
          this.tempData.push(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取歌曲 ID
    getSongId() {
      songOfSongName(this.registerForm.singerName).then((res) => {
        this.addSong(res[0].id);
      });
      this.centerDialogVisible = false;
    },
    // 添加歌曲
    addSong(songId) {
      let params = new URLSearchParams();
      params.append("songId", songId);
      params.append("songListId", this.songListId);
      listSongAdd(params)
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
        this.registerForm.singerName = "";
      this.editDialogVisible = false;
    },
    // 删除歌曲
    deleteRow() {
      delListSong(this.idx, this.songListId)
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
    // 解析歌词
    parseLyrit(text){
        let lines = text.split("\n");
        let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
        let res = [];
        for(let item of lines){
            let value = item.replace(pattern, '');
            res.push(value);
        }
        return res;
    },
  },
};
</script>

<style lang="less" scoped>
.handle-box {
  margin-bottom: 20px;
}
.song-img {
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
.play {
  position: absolute;
  z-index: 100;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  top: 18px;
  left: 15px;
}
.icon {
  width: 2em;
  height: 2em;
  color: #fffce8;
  fill: currentColor;
  overflow: hidden;
}
</style>