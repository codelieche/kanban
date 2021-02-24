<template>
  <el-tag
    class="hover-show-close"
    v-for="(item, index) in dataSource"
    :key="index"
    size="small"
    :type="type"
    :closable="canDelete"
    @close.stop="deleteObjectTag(item.id, refreshData)"
    >{{ item.value }}</el-tag
  >
</template>

<script lang="ts">
import { useFetchListData } from '@/hooks/utils/useFetchData'
import fetchApi from '@/plugins/fetchApi'
import { ElMessage } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'
export default defineComponent({
  name: 'ObjectTags',
  props: {
    appLabel: String,
    model: String,
    objectID: Number,
    canDelete: {
      type: Boolean,
      default: () => false,
    },
    type: String,
    callback: Function,
    reFreshTimes: {
      type: Number,
      default: () => 0,
    },
  },
  setup(props) {
    //  获取列表数据
    const apiUrl = ref('')
    const reFreshTimes = ref(0)
    // 获取数据
    const { dataSource } = useFetchListData(apiUrl, reFreshTimes)

    // 监控变化
    watch(
      props,
      () => {
        // console.log("props.reFreshTimes:", props.reFreshTimes, props.objectID)
        if (props.objectID) {
          apiUrl.value = `/api/v1/tags/objecttag/list?app_label=${props.appLabel}&model=${props.model}&object_id=${props.objectID}&page=1`
          reFreshTimes.value += 1
        } else {
          apiUrl.value = ''
        }
      },
      { immediate: true }
    )

    // 删除标签
    const deleteObjectTag = (objectID: number, callback: Function) => {
      const url = `/api/v1/tags/objecttag/${objectID}`
      // 发起删除请求
      fetchApi
        .delete(url, {})
        .then((responseData) => {
          if (responseData.status === 204) {
            ElMessage.info('删除标签成功')
            if (callback) {
              callback()
            }
          } else {
            console.log(responseData)
            ElMessage.warning(JSON.stringify(responseData.data))
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    // 刷新数据
    const refreshData = () => {
      reFreshTimes.value += 1
    }

    return {
      dataSource,
      deleteObjectTag,
      refreshData,
    }
  },
})
</script>