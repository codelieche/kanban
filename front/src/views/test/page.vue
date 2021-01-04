<template>
    <div>
        Hello Page
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'

export default defineComponent({
  name: 'TestPagePage',
  components: {
  },
  setup() {
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '测试',
        link: '/test',
      },
      {
        title: 'page',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
  },
})
</script>