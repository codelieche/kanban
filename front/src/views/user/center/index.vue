<template>
  <div class="main">
    <!-- 左侧 -->
    <el-row :gutter="16">
      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <!-- 分组列表 -->
        <GroupList />

        <!-- 文章列表 -->
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        右侧区域
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'

// import TopBar from '@/components/page/topBar.vue'
import GroupList from './groupList.vue'

export default defineComponent({
  name: 'UserCenterIndex',
  components: {
    GroupList,
  },
  setup() {
        const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '用户',
        link: '/user',
      },
      {
        title: '用户中心'
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    // useBreadcrumbItems([])
  },
})
</script>