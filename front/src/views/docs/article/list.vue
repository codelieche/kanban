<template>
  <TopBar title="文章列表" />
  <ArticleGroupFilter />
  <BaseList
    apiUrlPrefix="/api/v1/docs/article/list"
    pageUrlPrefix="/docs/article/list"
    :paramsFields="[
      'search',
      'page',
      'page_size',
      'ordering',
      'group_id',
      'tag__keys',
      'tag__values',
    ]"
    :pageSize="20"
    :reFreshTimes="reFreshTimes"
  >
    <!-- 主体内容区域 -->
    <template v-slot:default="data">
      <div
        class="articles-list"
        ref="listRef"
        :style="{ columnCount: imagesColumnNumber }"
      >
        <!-- <div class="articles"> -->
        <ArticleItem
          v-for="(item, index) in data.dataSource"
          :key="`${item.id}-${index}`"
          :data="item"
        />
        <!-- </div> -->
      </div>
    </template>

    <!-- 右侧按钮区域 -->
    <template v-slot:rightButtons>
      <!-- 右侧的添加/刷新按钮 -->
      <el-col
        :sm="12"
        :xs="24"
        :style="{ 'text-align': 'right' }"
        class="right"
      >
        <ObjectTagFilterButton pageUrlPrefix="/docs/article/list" />
        <el-button type="default" @click="reFreshData" size="small">
          <Icon type="refresh">刷新</Icon>
        </el-button>
      </el-col>
    </template>
  </BaseList>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, watch } from 'vue'
import TopBar from '@/components/page/topBar.vue'
import Icon from '@/components/base/icon.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import BaseList from '@/components/page/baseList.vue'
import ArticleGroupFilter from './groupsFilter.vue'
import ArticleItem from './listItem.vue'
import ObjectTagFilterButton from '@/components/page/objectTag/filterButton.vue'

export default defineComponent({
  name: 'ArticleListPage',
  components: {
    TopBar,
    Icon,
    BaseList,
    ArticleGroupFilter,
    ArticleItem,
    ObjectTagFilterButton,
  },
  setup() {
    // 设置顶部导航
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '文章',
        link: '/docs/article',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('docs.change_article')

    // 控制刷新开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 列表div的Ref
    const listRef: Ref<HTMLElement | null> = ref(null)
    const imagesColumnNumber = ref(1)

    // 计算列数
    const calculateColumnNumber = () => {
      if (listRef.value) {
        const column = Math.ceil((listRef.value.clientWidth - 60) / 650)
        imagesColumnNumber.value = column > 1 ? column : 1
      }
    }

    // 监控listRef的变化
    watch([listRef], () => {
      if (listRef.value) {
        calculateColumnNumber()
      }
    })

    onMounted(() => {
      window.onresize = calculateColumnNumber
    })

    return {
      havePermission,
      reFreshTimes,
      reFreshData,
      imagesColumnNumber,
      listRef,
    }
  },
})
</script>