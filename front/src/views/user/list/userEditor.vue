<template>
  <Loading v-if="loading" />
  <UserForm action="editor" :handleSubmit="handleSubmit" :data="data" v-else />
</template>

<script lang="ts">
/**
 * 添加用户
 * 属性：
 * 1. id: 用户的ID号
 * 2. handleAfterCommit: 表单提交后处理函数
 */
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'

import Loading from '@/components/page/loading.vue'

import fetchApi from '@/api/fetchApi'
import UserForm from './form.vue'
import useFetchData from '@/hooks/utils/useFetchData'

export default defineComponent({
  name: 'UserEditor',
  props: {
    id: Number,
    handleAfterCommit: Function,
  },
  components: {
    Loading,
    UserForm,
  },
  setup(props) {
    // 获取路由中的参数
    const router = useRouter()

    const apiUrl = ref<string | null>(null)
    const reFreshTimes = ref(0)
    // 获取详情数据
    const { loading, data, error } = useFetchData(apiUrl, router, reFreshTimes)

    // 监控id的变化
    watch(
      [props],
      () => {
        if (props.id && props.id > 0) {
          apiUrl.value = `/api/v1/account/user/${props.id}/`
        }
      },
      { immediate: true }
    )

    const handleSubmit = (data: Record<string, unknown>) => {
      //   console.log(data)
      const url = `/api/v1/account/user/${props.id}/`
      fetchApi
        .put(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '修改用户成功',
              type: 'success',
            })
            // 当data中有id字段，就表示添加成功了，跳转去group的详情页
            // router.push('/storage/account/' + responseData.id)
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
      loading,
      data,
      error,
      handleSubmit,
    }
  },
})
</script>