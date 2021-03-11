<template>
  <!-- 直接展示用户中心页 -->
  <UserCenterIndex />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'

import UserCenterIndex from '@/views/user/center/index.vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    UserCenterIndex,
  },

  setup() {
    // 右侧的导航
    // const items = [{ title: '首页', link: '/', icon: 'home' }]
    useBreadcrumbItems([])
  },
})
</script>