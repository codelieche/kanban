<template>
  <div class="top-bar">
    <div class="title">
      <h4>Test2 Page</h4>
    </div>
  </div>
  <div>Hello Test2</div>
  <el-divider></el-divider>
  <ErrorPage :code="403" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import ErrorPage from '@/views/errors/index.vue'

export default defineComponent({
  name: 'Test2Page',
  components: {ErrorPage},
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
        title: 'test2',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
  },
})
</script>