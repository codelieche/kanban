<template>
  <div class="main">
    <TopBar title="修改密码" />
    <el-row :gutter="20">
      <el-col :span="12" :offset="6">
        <BaseForm
          :name="formName"
          :fields="formFields.filter((i) => !i.hiddle)"
          title="修改"
          :handleSubmit="handleFormSubmit"
          :data="formData"
          :props="formProps"
        >
        </BaseForm>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref, Ref, watch } from 'vue'
import TopBar from '@/components/page/topBar.vue'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import { userInfo } from '@/hooks/store/useUserInfo'
import fetchApi from '@/plugins/fetchApi'

import BaseForm from '@/components/base/forms/baseForm.vue'
import { FormFieldItem } from '@/components/base/forms/types'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'UserChangePassword',
  components: {
    TopBar,
    BaseForm,
  },
  setup() {
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '用户',
        link: '/user',
      },
      {
        title: '修改密码',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 表单数据、名称、字段
    const defaultValue = {
      username: '',
    }
    const formName = 'userForm'
    const formData: Ref<Record<string, unknown>> = ref({})
    provide(formName, formData)

    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'username',
        type: 'input',
        label: '用户名:',
        props: {
          size: 'small',
          disabled: true,
          placeholder: '用户账号',
        },
      },
      {
        name: 'old_password',
        type: 'input',
        label: '用户密码:',
        rules: [
          {
            required: true,
            message: '请输入原来的密码',
          },
        ],
        props: {
          size: 'small',
          disabled: false,
          placeholder: '原密码',
          'show-password': true,
        },
      },
      {
        name: 'password',
        type: 'input',
        label: '修改密码:',
        rules: [
          {
            required: true,
            message: '请输入新的密码',
          },
        ],
        props: {
          size: 'small',
          disabled: false,
          placeholder: '新的密码',
          'show-password': true,
        },
      },
      {
        name: 're_password',
        type: 'input',
        label: '确认密码:',
        rules: [
          {
            required: true,
            message: '请输入确认密码',
          },
        ],
        props: {
          size: 'small',
          disabled: false,
          placeholder: '新的密码(重复)',
          'show-password': true,
        },
      },
    ])

    // 表单提交函数
    const handleFormSubmit = () => {
      if (formData.value['password'] !== formData.value['re_password']) {
        ElMessage.warning('密码和确认密码不相同')
        return
      }

      // 开始提交修改
      const url = '/api/v1/account/user/password/change'
      const data = formData.value
      fetchApi
        .put(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData && responseData.status) {
            ElMessage.success({
              message: '修改密码成功',
              type: 'success',
            })
          } else {
            console.log(responseData)
            ElMessage.error({
              message: responseData.message
                ? responseData.message
                : '修改密码失败',
              type: 'error',
            })
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error({
            message: JSON.stringify(err.data),
            type: 'error',
          })
        })
    }

    // 表单属性
    const formProps = {
      'label-width': '120px',
      size: 'mini',
    }

    watch(
      [userInfo],
      () => {
        if (userInfo && userInfo.value) {
          if (userInfo.value['username']) {
            formData.value['username'] = userInfo.value['username']
          }
        } else {
          formData.value = defaultValue
        }
      },
      { immediate: true }
    )

    return {
      formName,
      formData,
      formFields,
      handleFormSubmit,
      formProps,
    }
  },
})
</script>
