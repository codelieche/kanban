<template>
  <UserForm action="add" :handleSubmit="handleSubmit" :data="{}" />
</template>

<script lang="ts">
/**
 * 添加用户
 * 属性：
 * 1. handleAfterCommit: 表单提交后处理函数
 */
import { defineComponent } from 'vue'
import { ElMessage } from 'element-plus'

import fetchApi from '@/api/fetchApi'
import UserForm from './form.vue'

export default defineComponent({
  name: 'EnvInstanceAdd',
  props: {
    handleAfterCommit: Function,
  },
  components: {
    UserForm,
  },
  setup(props) {
    const handleSubmit = (data: Record<string, unknown>) => {
      // console.log(data)
      const url = '/api/v1/account/user/'
      fetchApi
        .post(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '添加用户成功',
              type: 'success',
            })
            if (props.handleAfterCommit) {
              props.handleAfterCommit(true)
            }
          } else {
            console.log(responseData)
            ElMessage.error({
              message: JSON.stringify(responseData),
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

    return {
      handleSubmit,
    }
  },
})
</script>