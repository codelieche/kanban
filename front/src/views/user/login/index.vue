<template>
  <div class="container login">
    <!-- 登录盒子 -->
    <div class="login-box">
      <!-- 图片Logo -->
      <div class="header">
        <div class="logo">
          <img src="@/assets/logo.png" alt="codelieche" />
        </div>
      </div>

      <!-- 表单：用户名和密码 -->
      <div class="forms">
        <el-form ref="formRef" :rules="rules" :model="formData">
          <!-- 用户名 -->
          <el-form-item label-width="0" prop="username">
            <el-input
              v-model="formData['username']"
              name="username"
              prefix-icon="el-icon-user"
              placeholder="用户名"
            >
            </el-input>
          </el-form-item>

          <!-- 密码 -->
          <el-form-item label-width="0" prop="password">
            <el-input
              v-model="formData['password']"
              name="password"
              type="password"
              prefix-icon="el-icon-lock"
              placeholder="用户密码"
            ></el-input>
          </el-form-item>
        </el-form>

        <!-- 按钮 -->
        <div class="buttons">
          <el-button type="primary" @click="handleLogin" class="btn-login"
            >登录</el-button
          >
          <!-- <el-button @click="handleReset">重置</el-button> -->
          <div class="infos">
            <span>忘记密码?</span>
            <span @click="handleReset">重置</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'
import { defineComponent, Ref, ref } from 'vue'
// import { useRouter } from 'vue-router'
export default defineComponent({
  name: 'UserLogin',
  setup() {
    // eslint-disable-next-line
    const formRef: Ref<any> = ref(null)
    //   登录用户
    const formData: Ref<{ [key: string]: string }> = ref({
      //   username: 'codelieche',
      username: '',
      password: '',
    })

    // 验证规则:
    // 记得给el-form设置 :model="loginForm" :rules="rules"
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度是3-20位', trigger: 'change' },
      ],
      password: [
        { required: true, message: '请输入用户密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度是6-20位', trigger: 'change' },
      ],
    }

    // const router = useRouter()

    const handleLogin = () => {
      console.log('handleLogin', formRef.value)
      formRef.value.validate((valid: boolean) => {
        if (valid) {
          console.log(formData.value)
          // 登录地址
          const loginUrl = '/api/v1/account/login'
          fetchApi
            .post(
              loginUrl,
              formData.value,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
              }
            )
            .then(response => response.data)
            .then((data) => {
              // console.log(data);
              if (data.status === 'success' || data.status === true) {
                // 获取next的url
                // 首先获取search参数：?next=/
                const locationSearch = window.location.search
                const params = new URLSearchParams(locationSearch)
                // 获取next的值
                let next = params.get('next')
                // console.log(next);
                // 如果next为null或者next为/user/login那么就跳转到首页
                if (
                  !next ||
                  (typeof next === 'string' && next.indexOf('/user/login') >= 0)
                ) {
                  // 跳转去首页
                  next = '/'
                }

                // console.log('即将跳转', next);
                if (typeof next === 'string' && next.startsWith('http')) {
                  // http开头的就直接跳转这个页面即可
                  window.location.href = next
                } else {
                  // 跳转到当前域名的首页
                  let url = window.location.origin

                  if (typeof next === 'string') {
                    // next是字符类型的，就加上next后就是要跳转的url
                    url = window.location.origin + next
                  }
                  // 跳转
                  window.location.href = url
                }
              } else {
                ElMessage.error({
                    message: '登陆失败:' + data.message,
                    type: 'error'
                })
              }
            })
            .catch((err) => {
              console.log(err)
              if (err && (err.status === 400 || err.status === 403)) {
                if (err.data && err.data.message) {
                  ElMessage.error({
                    message: err.data.message,
                    type: 'error'
                })
                } else {
                  ElMessage.error({
                    message: JSON.stringify(err.data),
                    type: 'error'
                })
                }
              }
            })
        } else {
          return
        }
      })
    }
    const handleReset = () => {
      console.log('handleReset')
    }

    return {
      formRef,
      formData,
      rules,
      handleLogin,
      handleReset,
    }
  },
})
</script>

<style lang="less" scoped>
.container.login {
  height: 100vh;
  background-color: #eee;
  position: relative;

  // 登录盒子
  .login-box {
    width: 400px;
    height: 380px;
    border-radius: 5px;
    position: absolute;
    background-color: #fff;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    .header {
      border-radius: 5px 5px 0 0;
      background-color: #4a90e2;
      // background-color: #409EFF;
      width: 100%;
      height: 150px;
      position: relative;
    }
    // logo样式
    .logo {
      height: 100px;
      width: 100px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 0 0 10px #ddd;
      background-color: #ffffff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      // logo图片
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    // 表单
    .forms {
      width: 100%;
      padding: 10px 20px;
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      .buttons {
        text-align: right;
        .btn-login {
          width: 100%;
          height: 35px;
          font-size: 15px;
        }
        .infos {
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
          span {
            color: #999;
            font-size: 13px;
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
