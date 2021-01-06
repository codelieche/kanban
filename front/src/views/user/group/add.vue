<template>
    <div>Group Add Page</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
export default defineComponent({
    name: "UserGroupAdd",

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
        title: '添加'
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    }
})
</script>
