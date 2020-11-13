<template>
  <div>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="title-number">{{ consumerCount }}</div>
              <div>用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="title-number">{{ songCount }}</div>
              <div>歌曲总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="title-number">{{ singerCount }}</div>
              <div>歌手数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div class="grid-content-center">
              <div class="title-number">{{ songListCount }}</div>
              <div>歌单数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <h3 class="mgb20">用户性别比例</h3>
        <div style="background-color: white;">
          <ve-pie :data="consumerSex" :theme = "options" ></ve-pie>
        </div>
      </el-col>
      <el-col :span="12">
        <h3 class="mgb20">歌单风格图表</h3>
        <div style="background-color: white;">
          <ve-histogram :data="songStyle" ></ve-histogram>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mgb20">
      <el-col :span="12">
        <h3 class="mgb20">歌手性别比例</h3>
        <div style="background-color: white;">
          <ve-pie :data="singerSex" :theme = "options" ></ve-pie>
        </div>
      </el-col>
      <el-col :span="12">
        <h3 class="mgb20">歌手地区图表</h3>
        <div style="background-color: white;">
          <ve-histogram :data="singerLocation" ></ve-histogram>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mixin } from "../mixins/index";
import {
  getAllConsumer,
  getAllSong,
  getAllSinger,
  getAllSongList,
} from "../api/index.js";
export default {
  mixins: [mixin],
  data() {
    this.chartSetings = {

    }
    return {
      consumerCount: "", // 用户总数
      songCount: "", // 歌曲总数
      singerCount: "", // 歌手总数
      songListCount: "", // 歌单总数
      consumer:[],  // 所有用户
      consumerSex: {  // 按性别分类的用户数
        columns: ['性别', '总数'],
        rows: [
          { '性别': '女', '总数': "" },
          { '性别': '男', '总数': "" },
        ]
      },
      singerSex: {  // 按性别分类的歌手数
        columns: ['性别', '总数'],
        rows: [
          { '性别': '女', '总数': "" },
          { '性别': '男', '总数': "" },
          { '性别': '组合', '总数': "" },
          { '性别': '未知', '总数': "" },
        ]
      },
      songStyle: {  // 按歌单的风格分类
        columns: ['风格', '数量'],
        rows: []
      },
      singerLocation: {  // 按歌手地区分类
        columns: ['地区', '数量'],
        rows: []
      },
      options:{
        color:['#ffc0cb', '#87cefa', '#621ACE', '#FF0000']
      }
    };
  },
  created() {
    this.getAllNumbers();
  },
  mounted() {
    this.getAllNumbers();
  },
  methods: {
    setSex(sex, val){  // 根据性别获取数量
      let count = 0;
      for(let item of val){
        if(sex == item.sex){
          count++;
        }
      }
      return count;
    },
    getByStyle(style){  // 根据歌单风格获取数量
      let flag = true;
      for(let item of this.songStyle.rows){
        if(style == item['风格']){
          item['数量']++;
          flag = false;
        }
      }
      if(flag){
        let styleData = {"风格": style, "数量": 1};
        this.songStyle.rows.push(styleData);
      }
    },
    getByLocation(location){  // 根据歌手地区获取数量
      let flag = true;
      for(let item of this.singerLocation.rows){
        if(location == item['地区']){
          item['数量']++;
          flag = false;
        }
      }
      if(flag){
        let locationData = {"地区": location, "数量": 1};
        this.singerLocation.rows.push(locationData);
      }
    },
    getAllNumbers() {
      getAllConsumer().then((res) => {
        this.consumerCount = res.length;
        this.consumerSex.rows[0]['总数'] = this.setSex(0, this.consumer);
        this.consumerSex.rows[1]['总数'] = this.setSex(1, this.consumer);
      });
      getAllSong().then((res) => {
        this.songCount = res.length;
      });
      getAllSinger().then((res) => {
        this.singerCount = res.length;
        this.singerSex.rows[0]['总数'] = this.setSex(0, res);
        this.singerSex.rows[1]['总数'] = this.setSex(1, res);
        this.singerSex.rows[2]['总数'] = this.setSex(2, res);
        this.singerSex.rows[3]['总数'] = this.setSex(3, res);
        for(let item of res){
          this.getByLocation(item.location);
        }
      });
      getAllSongList().then((res) => {
        this.songListCount = res.length;
        for(let item of res){
          this.getByStyle(item.style);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.grid-content {
  display: flex;
  align-items: center;
  height: 80px;
}
.grid-content-center {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #ed6800;
}
.title-number {
  font-size: 40px;
  font-weight: 500;
}
</style>