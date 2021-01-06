<template>
    <div>Group Detail Page</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
export default defineComponent({
    name: "UserGroupDetail",
    setup(){
        const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '用户分组',
        link: '/user/group',
      },
      {
        title: '详情'
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    }
})
</script>