<template>
  <div class="top-bar">
    <div class="title">
      <h4>{{ title }}</h4>
    </div>
  </div>
  <div class="modellogs">
    <el-timeline v-if="Array.isArray(dataSource)">
      <!-- :color="item.action_flag !== 3 ? '#1890ff' : '#fc5531'" -->
      <el-timeline-item
        v-for="(item, index) in dataSource"
        :key="index"
        :class="`action-${item.action_flag}`"
      >
        <ModelLogItem :data="item" />
      </el-timeline-item>
    </el-timeline>
    <div class="more" v-if="next" @click="fetchNextPageData">点击加载更多</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch, ref, Ref } from 'vue'
import { useFetchListData } from '@/hooks/utils/useFetchData'
import { ModelLog } from './types'
import ModelLogItem from './item.vue'

export default defineComponent({
  name: 'ModelLogs',
  props: {
    title: {
      type: String,
      default: () => '操作记录',
    },
    showNoContent: {
      type: Boolean,
      default: () => true,
    },
    app: String,
    model: String,
    id: {
      type: String,
      default: () => '',
    },
  },
  components: { ModelLogItem },
  setup(props) {
    // /api/v1/modellog/auth/group/2/list?page=1
    const page = ref(1)
    const apiUrl = ref('')

    const dataSource: Ref<Array<ModelLog>> = ref([])
    // 获取数据后追加到dataSource中
    const callbackFunc = (arr: ModelLog[]) => {
      dataSource.value = [...dataSource.value, ...arr]
    }
    // 刷新数据
    const reFreshTimes = ref(0)
    // 获取列表数据
    const { loading, count, next } = useFetchListData<ModelLog>(
      apiUrl,
      reFreshTimes,
      callbackFunc
    )

    watch(
      props,
      () => {
        // console.log(newValue, oldValue)
        if (props.app && props.model && props.id) {
          // 初始化dataSource
          dataSource.value = []
          const newUrl = `/api/v1/modellog/${props.app}/${props.model}/${props.id}/list`
          apiUrl.value = newUrl
          page.value = 1
        }
      },
      { immediate: true }
    )

    const fetchNextPageData = () => {
      if (next) {
        page.value += 1
        const newUrl = `/api/v1/modellog/${props.app}/${props.model}/${props.id}/list?page=${page.value}`
        apiUrl.value = newUrl
      }
    }

    return {
      dataSource,
      next,
      loading,
      count,
      fetchNextPageData,
    }
  },
})
</script>