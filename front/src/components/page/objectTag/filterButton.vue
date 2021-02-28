<template>
  <!-- <el-dropdown trigger="click">
    <el-button type="default" size="small" :class="{ active: activeTagKeys }">
      <Icon type="filter"></Icon> Filter
    </el-button>
    <template v-slot:dropdown>
      <el-dropdown-menu>
        <ObjectTagFilter
          :activeTagKeys="activeTagKeys"
          :activeTagValues="activeTagValues"
          :handleTagSelected="handleTagSelected"
          :handleFilterClear="handleFilterClear"
        />
      </el-dropdown-menu>
    </template>
  </el-dropdown> -->

  <div class="filter-button" :class="{ show: showFilter }">
    <el-button type="default" size="small" 
    :class="{ active: activeTagKeys }"
    @click.stop="showFilter = !showFilter">
      <Icon type="filter"></Icon> Filter
    </el-button>
    <div class="content">
      <ObjectTagFilter
        :activeTagKeys="activeTagKeys"
        :activeTagValues="activeTagValues"
        :handleTagSelected="handleTagSelected"
        :handleFilterClear="handleFilterClear"
        :handleCloseFilter="() => showFilter = false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Icon from '@/components/base/icon.vue'
import { useRouter } from 'vue-router'
import ObjectTagFilter from './filter.vue'

export default defineComponent({
  name: 'ObjectTagFilterButton',
  components: { Icon, ObjectTagFilter },
  props: {
    // 页面Url的前缀
    pageUrlPrefix: { type: String, default: () => '' },
  },
  setup() {
    // 路由获取到当前选中的tag__keys, tag__values
    const activeTagKeys = ref('')
    const activeTagValues = ref('')

    // 是否显示Filter: 当按钮点击的时候显示filter
    const showFilter = ref(false)

    // 路由
    const router = useRouter()

    // 监控路由的变化
    watch(
      [router.currentRoute],
      () => {
        const query = router.currentRoute.value.query
        // console.log(query)
        if (query['tag__keys']) {
          activeTagKeys.value = query['tag__keys'] as string
        } else {
          activeTagKeys.value = ''
        }
        if (query['tag__values']) {
          activeTagValues.value = query['tag__values'] as string
        } else {
          activeTagKeys.value = ''
        }
      },
      { immediate: true }
    )

    // 处理标签值选中事件
    const handleTagSelected = (key: string, value: string) => {
      // console.log(key, value)
      router.push({
        path: router.currentRoute.value.path,
        query: {
          'tag__keys': key,
          'tag__values': value,
        },
      })
      // 隐藏filter
      showFilter.value = false
    }

    // 处理清空Tag
    const handleFilterClear = () => {
      showFilter.value = false
      activeTagKeys.value = ''
      activeTagValues.value = ''
      // 跳转新的页面
      const query = router.currentRoute.value.query
      const newQuery = {}
      for (const key in query) {
        if (['tag__keys', 'tag__values'].indexOf(key) < 0) {
          newQuery[key] = query[key]
        }
      }
      router.push({
        path: router.currentRoute.value.path,
        query: newQuery,
      })
    }

    return {
      showFilter,
      activeTagKeys,
      activeTagValues,
      handleTagSelected,
      handleFilterClear,
    }
  },
})
</script>

<style lang="less" scoped>
.active {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #fff;
}

.filter-button {
  display: inline-block;
  position: relative;

  &.show {
    .content {
      display: block;
    }
  }

  .content {
    min-width: 300px;
    display: none;
    position: absolute;
    z-index: 99;
    // padding: 10px;
    border: 1px solid #999;
    text-align: left;
    // top: 35px;
    // right: 0;
    transform: translateX(-40%);
    // float: right;
    background-color: #fff;
    border: 1px solid rgba(55, 55, 50, 0.1);
    margin-top: 5px;
    box-shadow: 0 0 0 1px rgb(15 15 15 / 5%), 0 3px 6px rgb(15 15 15 / 10%),
      0 9px 24px rgb(15 15 15 / 20%);
  }
}
</style>