<template>
  <!-- Tools开始 -->
  <el-row class="tools" v-if="showTools">
    <!-- 左侧搜索输入框 -->
    <el-col :sm="12" :xs="24">
      <el-input
        class="search primary"
        v-model="searchInputValue"
        placeholder="search"
        size="small"
        clearable
        @change="handleSearchChange"
      >
        <template #append>
          <el-button icon="el-icon-search" type="primary"></el-button>
        </template>
      </el-input>
    </el-col>
    <slot name="rightButtons"></slot>
  </el-row>

  <!-- Tools下面的表格 -->
  <!-- <el-table
    :data="dataSource"
    border
    style="width: 100%"
    :show-header="showHeader"
    @sort-change="handleSortChange"
    v-bind="props"
  >
    <slot name="default"></slot>
  </el-table> -->
  <slot name="default" :dataSource="dataSource"> </slot>
  <!-- <el-empty :description="loading ? '数据加载...' : '无数据'" v-else></el-empty> -->
  <!-- 表格结束 -->

  <!-- 分页开始 -->
  <el-pagination
    background
    layout="prev, pager, next, sizes"
    :page-size="pageInfo.pageSize"
    :page-sizes="[5, 10, 20, 50]"
    :page-count="pageCount"
    :total="count"
    :current-page="pageInfo.currentPage"
    @currentChange="handlePageChange"
    @sizeChange="handleSizeChange"
    :hide-on-single-page="false"
    v-if="showPagination"
  >
  </el-pagination>
  <el-divider v-else></el-divider>
  <!-- 分页结束 -->
  <!-- {{ urlParams }} -->
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchListData } from '@/hooks/utils/useFetchData'
import { getParamsFromLocationSearch } from '@/utils/urlParam'
export default defineComponent({
  name: 'BaseList',
  props: {
    apiUrlPrefix: String, // 获取数据的接口：/api/v1/account/group/list
    // apiUrlSuffix: String,  // 获取数据的接口追加的内容，比如： type=default
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
      default: () => ['page', 'page_size', 'ordering', 'search'],
    },
    reFreshTimes: {
      type: Number,
      default: () => 0,
    },
    showHeader: {
      type: Boolean,
      default: () => true,
    },
    showTools: {
      type: Boolean,
      default: () => true,
    },
    showPagination: {
      type: Boolean,
      default: () => true,
    },
    // 当调用BaseList的上级组件，想要修改params的时候，就传递这个
    urlParams: Object as PropType<{
      [key: string]: string | number | boolean | null
    }>,
    rowKey: String,
    props: Object,
  },
  setup(props) {
    // 获取的数据值
    const pageInfo = reactive({
      pageSize: props.pageSize,
      currentPage: props.page,
    })
    // 路由
    const router = useRouter()

    // url传递的参数
    let params: { [key: string]: string | null } = {}

    // 搜索
    const searchInputValue = ref('')
    const searchValue = ref('')

    const getApiUrl = () => {
      // console.log(window.location.search)
      // locationSearch: 这里是有差异的，
      // 当路由使用的是createWebHashHistory那么获取不到location.search
      // 当路由使用的是createWebHistory window.location.search是可以获取到正确的值
      let locationSearch = window.location.search
      if (window.location.href.indexOf('/#/') > 0) {
        locationSearch = router.currentRoute.value.fullPath
          .toString()
          .replace(router.currentRoute.value.path, '')
      }
      // console.log(router.currentRoute.value.fullPath.toString().replace(router.currentRoute.value.path, ''))
      params = getParamsFromLocationSearch(props.paramsFields, locationSearch)
      // 设置搜索框的值
      if (params['search'] && params['search'] !== searchInputValue.value) {
        searchInputValue.value = params['search']
      }
      //   console.log(params)
      if (params['page'] && isNaN(Number(params['page'])) === false) {
        pageInfo.currentPage = Number(params['page'])
      } else {
        pageInfo.currentPage = props.page
      }

      // 有个bug：pageSize、pageCount都不可以用变量设置，刷新页面变成默认的值了, 用reactive是可以的
      if (params['page_size'] && isNaN(Number(params['page_size'])) === false) {
        // console.log('从url中获取到了page_size', Number(params['page_size']), pageInfo.pageSize)
        pageInfo.pageSize = Number(params['page_size'])
      } else {
        pageInfo.pageSize = props.pageSize
      }

      // 从url中获取相关字段的信息
      if (!props.apiUrlPrefix) {
        return ''
      }
      let apiUrl = `${props.apiUrlPrefix}`
      if (props.apiUrlPrefix.indexOf('?') > 0) {
        apiUrl = `${apiUrl}&page=${pageInfo.currentPage}&page_size=${pageInfo.pageSize}`
      } else {
        apiUrl = `${apiUrl}?page=${pageInfo.currentPage}&page_size=${pageInfo.pageSize}`
      }

      // 从url中处理字段
      props.paramsFields.forEach((item) => {
        const value = params[item]
        if (
          value !== null &&
          value !== undefined &&
          ['page', 'page_size'].indexOf(item) < 0
        ) {
          apiUrl = `${apiUrl}&${item}=${value}`
        }
      })

      // 尾部内容
      // if(props.apiUrlSuffix){
      //   apiUrl = `${apiUrl}&${props.apiUrlSuffix}`
      // }

      return apiUrl
    }

    const apiUrl = ref<string>(getApiUrl())
    // 获取数据
    const reFreshTimes = ref(props.reFreshTimes)
    const { count, loading, dataSource } = useFetchListData(
      apiUrl,
      reFreshTimes
    )

    // const url = computed(() => {
    //   const apiUrl = `${props.apiUrlPrefix}`
    //   return apiUrl
    // })

    // 页面变更了
    const changePageUrl = () => {
      // 更新页面url
      let pageUrl = `${props.pageUrlPrefix}?page=${pageInfo.currentPage}`
      pageUrl = `${pageUrl}&page_size=${pageInfo.pageSize}`

      // 从url中处理字段
      props.paramsFields.forEach((item) => {
        const value = params[item]
        if (
          value !== null &&
          value !== undefined &&
          ['page', 'page_size'].indexOf(item) < 0
        ) {
          pageUrl = `${pageUrl}&${item}=${value}`
        }
      })

      //   console.log('pageUrl:', pageUrl)
      router.push(pageUrl).then(() => {
        // console.log("我跳转完毕了")
        // 跳转完毕后重新获取url
        apiUrl.value = getApiUrl()
      })
    }

    watch([props], () => {
      // 看是否需要更新params
      if (props.urlParams) {
        let needRedirect = false
        for (const key in props.urlParams) {
          // console.log(key, props.urlParams[key])
          if (params[key] !== (props.urlParams[key] as string)) {
            if (apiUrl.value !== '') {
              needRedirect = true
            }
            if (key == 'page') {
              pageInfo['currentPage'] = props.urlParams['page'] as number
            }
            params[key] = props.urlParams[key] as string
            if (props.urlParams[key] === '' || props.urlParams[key] === null) {
              // console.log('移除key:', key)
              delete params[key]
            }
          }
          // 是否需要跳转页面
          if (needRedirect) {
            changePageUrl()
          }
        }
      }

      // 需要刷新数据
      if (props.reFreshTimes != reFreshTimes.value) {
        apiUrl.value = getApiUrl()
        reFreshTimes.value = props.reFreshTimes
      }

      // console.log(props)
    })

    // watch([props.apiUrlPrefix], () => {
    //   // apiUrlPrefix变更了
    //   if (props.apiUrlPrefix) {
    //     console.log(props.apiUrlPrefix)
    //   }
    // })

    watch([router.currentRoute], () => {
      // 获取新的apiUrl
      if (apiUrl.value !== getApiUrl()) {
        apiUrl.value = getApiUrl()
        // console.log("baseTable里监控到router变化: 修改新的apiUrl", apiUrl.value)
      } else {
        // console.log(apiUrl.value)
        // console.log(getApiUrl())
      }
    })

    // 搜索的值变更了
    const handleSearchChange = (value: string) => {
      if (searchValue.value !== value) {
        searchValue.value = value
        params['page'] = '1'
        params['search'] = value
        // 跳转页面
        // console.log(router.currentRoute.value.path, params)
        for (const key in params) {
          // console.log(key)
          if (params[key] === undefined) {
            delete params[key]
          }
        }
        router
          .push({
            path: router.currentRoute.value.path,
            query: params,
          })
          .then((err) => {
            if (err) {
              console.log(err)
            }
          })
      }
    }
    // 当输入框的值被删除了后，没按回车，也需要粗发一下重新获取数据
    watch([searchInputValue], () => {
      if (searchInputValue.value === '' && searchValue.value !== '') {
        handleSearchChange('')
      }
    })

    const pageCount = computed(() => {
      if (count.value > 0 && pageInfo.pageSize > 0) {
        return Math.ceil(count.value / pageInfo.pageSize)
      }
    })

    const handlePageChange = (val: number) => {
      //   console.log(`当前页: ${val}`)
      if ((val - 1) * pageInfo.pageSize > count.value) {
        //   console.log("val * pageInfo.pageSize > count.value:", val * pageInfo.pageSize, count.value)
        return
      } else {
        pageInfo.currentPage = val
      }
      changePageUrl()
    }
    const handleSizeChange = (val: number) => {
      //   console.log('handleSizeChange:', val)
      if (val > pageInfo.pageSize) {
        // console.log('需要设置当前页为1')
        pageInfo.currentPage = 1
        count.value = 1
      }
      pageInfo.pageSize = val

      changePageUrl()
    }

    // 列排序变化：其实BaseTable中才会用到，后面改成了监控urlParams的变化来处理
    const handleSortChange = (data: { [key: string]: string }) => {
      const ordering: string | null =
        data.order === 'descending' ? `-${data.prop}` : data.prop
      // console.log('当前排序方式为:', ordering)
      params['ordering'] = ordering
      changePageUrl()
    }

    return {
      handlePageChange,
      handleSizeChange,
      searchInputValue,
      handleSearchChange,
      count,
      pageCount,
      dataSource,
      loading,
      pageInfo,
      handleSortChange,
    }
  },
})
</script>