<template>
  <div class="login-container">
    <el-form
      ref="signUpForm"
      :model="signUpForm"
      class="login-form"
      label-position="left"
    >
      <el-card>
        <div class="title-container">
          <h3 class="title">{{ status }}</h3>
        </div>

        <div style="float: left">
          <el-button
            id="btnSignUp"
            size="medium"
            icon="el-icon-back"
            type="text"
            @click="onBackLogin"
          >
            <router-link to="/login"> Đăng nhập </router-link>
          </el-button>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script>
import {
  errAlert,
  ERROR,
  showAlert,
  SUCCESS,
} from "ff24-js/src/utils/AlertMessage";
import apiFactory from "ff24-js/src/api/apiFactory";
import ConstantAPI from "ff24-js/src/utils/ConstantAPI";
import { getUrlParameterLink } from "@/utils/ECustomsUtils";

export default {
  name: "VerifyAccount",
  components: {},
  data() {
    return {
      status: "",
      signUpForm: {
        address: "",
        bussDate: "",
        captchaKey: "",
        captchaSecret: "",
        code: "",
        email: "",
        name: "",
        password: "",
        tel: "",
        type: "",
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      otherQuery: {},
      isSignUp: false,
      listCompanyType: [],
      loadType: false,
      publicPath: process.env.BASE_URL,
    };
  },
  mounted() {
    this.onVerifyAccount();
  },
  methods: {
    onVerifyAccount() {
      const tokenParam = getUrlParameterLink(window.location.href, "token");
      const param = {
        token: tokenParam,
      };
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      //Convert Model
      const signupModel = {};

      apiFactory
        .callAPI(ConstantAPI.SIGNUP.VERIFY_ACCOUNT, {}, param)
        .then((rs) => {
          loading.close();
          this.status = "Xác minh tài khoản thành công";
        })
        .catch((err) => {
          loading.close();
          this.status = err.response.data.message;
          //errAlert(this, err);
        });
    },

    onBackLogin() {
      this.$emit("back", false);
    },

    resetForm() {
      this.$refs.signUpForm.resetFields();
    },
  },
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #1c1c1c;
$disableBg: #e5e5e5;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 50%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 15px 0px 0px 30px !important;
      color: #043244;
      height: 30px !important;
      caret-color: $cursor;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
        box-shadow: inset 0 0 0 1000px #e5e5e5 !important;
        -webkit-text-fill-color: #043244 !important;
      }
    }

    input:disabled {
      background: $disableBg;
      color: #043244;
    }
  }

  .el-form-item {
    border: 1px solid white;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    height: 45px !important;
    margin-bottom: 20px !important;

    .el-form-item__error--inline {
      top: -8px !important;
    }

    .el-select {
      width: 100%;
      position: absolute;

      .el-input__suffix {
        right: -42px !important;
      }
    }
  }
}
</style>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #1c1c1c;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0;
      -webkit-appearance: none;
      border-radius: 0;
      padding: 12px 5px 12px 15px;
      color: #043244;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
        box-shadow: inset 0 0 0 1000px #e5e5e5 !important;
        -webkit-text-fill-color: #043244 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid white;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>
  
  <style lang="scss" scoped>
$bg: #ffffff;
// $dark_gray: #1682e6;
// $light_gray: #043244;  #17f001;
$dark_gray: #67c23a;
$light_gray: #67c23a;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  // background-image: linear-gradient(#01aef0, #ffffff);
  background-image: linear-gradient(#67c23a, #ffffff);
  overflow: hidden;

  .login-form {
    position: relative;
    width: 750px;
    max-width: 100%;
    padding: 30px 30px 30px;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    text-align: center;
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      /* color: #01aef0; 
        background-color: #01aef0;*/
      color: #67c23a;
      background-color: #67c23a;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
