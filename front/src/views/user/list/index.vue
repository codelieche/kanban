<template>
    <div>
        user list page
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
export default defineComponent({
    name: "UserListIndex",
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
        title: '列表'
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    }
})
</script>