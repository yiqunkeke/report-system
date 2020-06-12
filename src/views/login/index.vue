<template>
  <div class="login-container">
    <h3 class="title">
      睿昂服务报告系统
    </h3>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span
          class="show-pwd"
          @click="showPwd"
        >
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        @click.native.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate';

export default {
  name: 'Login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能少于3位数'));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername}],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' });
            this.loading = false;
          }).catch(() => {
            this.loading = false;
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import '~@/assets/styles/modules/login.scss';
</style>
