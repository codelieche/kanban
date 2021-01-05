<template>
  <div>Base Table</div>
  {{ dataSource }}
  <hr />
  {{ url }}

  <el-divider></el-divider>
  <el-pagination
    background
    layout="prev, pager, next, sizes"
    :page-sizes="[3, 10, 20, 50, 100]"
    :page-size="pageSize"
    :total="count"
    :current-page="currentPage"
    @currentChange="handlePageChange"
    @sizeChange="handleSizeChange"
  >
  </el-pagination>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch, PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchListData } from '@/hooks/utils/useFetchData'
export default defineComponent({
  name: 'BaseTable',
  props: {
    apiUrlPrefix: String, // 获取数据的接口：/api/v1/account/group/list
    pageUrlPrefix: String, // 页面的前缀：eg：/user/group/list
    page: {
      type: Number,
      default: () => 1,
    }, // 数据页
    pageSize: {
      type: Number,
      default: () => 10,
    }, // 数据页
    paramsFields: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    dataType: Object,
  },
  setup(props) {
    // 获取的数据值
    const currentPage = ref(props.page)
    const pageSize = ref(props.pageSize)
    const router = useRouter()

    const getApiUrl = () => {
      const apiUrl = `${props.apiUrlPrefix}?page=${currentPage.value}&page_size=${pageSize.value}`
      return apiUrl
    }
    const apiUrl = ref<string>(getApiUrl())
    // 获取数据
    const { count, loading, dataSource } = useFetchListData(apiUrl)

    // console.log(props)
    const url = computed(() => {
      const apiUrl = `${props.apiUrlPrefix}?page=${currentPage.value}&page_size=${pageSize.value}`
      return apiUrl
    })
    // 页面变更了
    const changePageUrl = () => {
      // 更新页面url
      let pageUrl = `${props.pageUrlPrefix}?page=${currentPage.value}`
      pageUrl = `${pageUrl}&page_size=${pageSize.value}`
      // console.log(pageUrl)
      router.push(pageUrl).then(() => {
        // console.log("我跳转完毕了")
        // 跳转完毕后重新获取url
        apiUrl.value = getApiUrl()
      })
    }

    const handlePageChange = (val: number) => {
      //   console.log(`当前页: ${val}`)
      currentPage.value = val
      changePageUrl()
    }
    const handleSizeChange = (val: number) => {
      // console.log('handleSizeChange:', val)
      pageSize.value = val
      changePageUrl()
    }
    watch(props, (newValue, oldValue) => {
      console.log(newValue)
      console.log(oldValue)
      // console.log(T)
    })

    watch(url, (newValue, oldValue) => {
      console.log('url变更了:', newValue, oldValue)
    })

    return {
      currentPage,
      url,
      handlePageChange,
      handleSizeChange,
      count,
      dataSource,
      loading,
    }
  },
})
</script>