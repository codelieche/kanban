<template>
  <Loading v-if="loading" />
  <TagForm action="editor" :handleSubmit="handleSubmit" :data="data" v-else />
</template>

<script lang="ts">
/**
 * 编辑标签
 * 属性：
 * 1. id: ID
 * 2. handleAfterCommit: 表单提交后处理函数
 */
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'

import Loading from '@/components/page/loading.vue'

import fetchApi from '@/plugins/fetchApi'
import useFetchData from '@/hooks/utils/useFetchData'

import TagForm from './form.vue'

export default defineComponent({
  name: 'TagEditor',
  props: {
    id: Number,
    handleAfterCommit: Function,
  },
  components: {
    Loading,
    TagForm,
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
          apiUrl.value = `/api/v1/tags/key/${props.id}`
        }
      },
      { immediate: true }
    )

    const handleSubmit = (data: Record<string, unknown>) => {
      //   console.log(data)
      const url = `/api/v1/tags/key/${props.id}`
      fetchApi
        .put(url, data, {})
        .then((response) => {
          return response.data
        })
        .then((responseData) => {
          // console.log(responseData)
          if (responseData.id && responseData.id > 0) {
            ElMessage.success({
              message: '修改标签成功',
              type: 'success',
            })
            // 当data中有id字段，就表示编辑成功了，跳转去详情页
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
      loading,
      data,
      error,
      handleSubmit,
    }
  },
})
</script>