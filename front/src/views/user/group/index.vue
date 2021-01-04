<template>
  <div>分组页</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
export default defineComponent({
  name: 'GroupIndex',
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
        title: '分组'
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
  },
})
</script>