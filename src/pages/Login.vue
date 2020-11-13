<template>
  <div class="login">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/logo.png" alt="" />
      </div>
      <div class="title">WDF-music 后台管理</div>
      <!-- 登陆表单区域 -->
      <el-form
        class="login_form"
        :model="ruleFrom"
        :rules="rules"
        ref="ruleFrom"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            prefix-icon="iconfont icon-user"
            v-model="ruleFrom.username"
          >
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="iconfont icon-3702mima"
            v-model="ruleFrom.password"
            type="password"
          >
          </el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitFrom">登录</el-button>
          <el-button type="info" @click="resetFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mixin } from "../mixins/index";
import { getLoginStatus } from "../api/index";
export default {
  mixins: [mixin],
  data: function () {
    return {
      ruleFrom: {
        username: "admin",
        password: "123",
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        username: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 点击登录按钮, 实现登录功能
    submitFrom() {
      let params = new URLSearchParams();
      params.append("name", this.ruleFrom.username);
      params.append("password", this.ruleFrom.password);
      getLoginStatus(params)
        .then((res) => {
          if (res.code == 1) {
            localStorage.setItem('userName', this.ruleFrom.username);
            this.$router.push("/Info");
            this.notify("登陆成功", "success");
          } else {
            this.notify("登陆失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击重置按钮, 重置登录表单
    resetFrom() {
      this.$refs.ruleFrom.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  position: relative;
  background: url("../assets/img/background.jpg");
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100%;
}
.title {
  margin-top: 15%;
  width: 100%;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
}
.login_box {
  position: absolute;
  width: 500px;
  height: 350px;
  background-color: #fff;
  border-radius: 5px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>