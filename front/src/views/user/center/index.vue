<template>
    <div>User Center Index Page</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
export default defineComponent({
    name: "UserCenterIndex",
    setup(){
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
    }
})
</script>