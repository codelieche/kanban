<template>
    <div>Group Detail Editor Page</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
export default defineComponent({
    name: "UserGroupEditor",

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
        title: '编辑'
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    }
})
</script>