<template>
  <TagForm action="add" :handleSubmit="handleSubmit" :data="{}" />
</template>

<script lang="ts">
/**
 * 编辑标签
 * 属性：
 * 1. id: ID
 * 2. handleAfterCommit: 表单提交后处理函数
 */
import { defineComponent } from 'vue'

import { ElMessage } from 'element-plus'

import fetchApi from '@/api/fetchApi'

import TagForm from './form.vue'

export default defineComponent({
  name: 'TagAdd',
  props: {
    id: Number,
    handleAfterCommit: Function,
  },
  components: {
    TagForm,
  },
  setup(props) {
    const handleSubmit = (data: Record<string, unknown>) => {
      //   console.log(data)
      const url = '/api/v1/tags/key/create'
      fetchApi
        .post(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '添加标签成功',
              type: 'success',
            })
            // 当data中有id字段，就表示添加成功了，跳转去详情页
            // router.push('/front/page/' + responseData.id)
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