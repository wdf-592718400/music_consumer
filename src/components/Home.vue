<template>
  <div>
    <Header></Header>
    <Aside></Aside>
    <div class="content-box" :class="{'content-collapse': collapse}">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "./Header";
import Aside from "./Aside";
import bus from "../assets/js/bus";
export default {
  components: {
    Header,
    Aside,
  },
  data() {
    return {
      collapse: false,
    };
  },
  created() {
    // 通过 Bus 进行组件间的通信, 实现折叠侧边栏
    bus.$on("collapse", (msg) => {
      this.collapse = msg;
    });
  },
};
</script>