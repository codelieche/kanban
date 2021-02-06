<template>
  <!-- Tools下面的表格 -->
  <BaseList
    v-bind="propsFields"
    :urlParams="urlParams"
  >
    <template v-slot:default="data">
      <el-table
        :data="data.dataSource"
        border
        style="width: 100%"
        :show-header="showHeader"
        @sort-change="handleSortChange"
        v-bind="props"
      >
        <slot name="default"></slot>
      </el-table>
    </template>

    <!-- 右侧的按钮，传递给BaseList -->
    <template v-slot:rightButtons>
      <slot name="rightButtons"></slot>
    </template>
  </BaseList>
  <!-- <el-empty :description="loading ? '数据加载...' : '无数据'" v-else></el-empty> -->
  <!-- 表格结束 -->
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, ref } from 'vue'
import BaseList from './baseList.vue'

export default defineComponent({
  name: 'BaseTable',
  components: { BaseList },
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
    props: Object,
  },
  setup(props) {
    // 列排序变化
    const urlParams: Ref<{[key: string]: string|number|boolean|null}> = ref({})
    const handleSortChange = (data: { [key: string]: string }) => {
      const ordering: string | null =
        data.order === 'descending' ? `-${data.prop}` : data.prop
      // console.log('当前排序方式为:', ordering)
      urlParams.value = {ordering: ordering != null ? ordering : ''}

    }
    return {
      propsFields: props,
      urlParams,
      handleSortChange,
    }
  },
})
</script>