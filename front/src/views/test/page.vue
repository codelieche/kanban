<template>
  <div class="top-bar">
    <div class="title">
      <h4>测试Page</h4>
    </div>
  </div>

  <!-- 测试表单 -->
  <TestBaseForm01 />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import TestBaseForm01 from './components/formDemo01.vue'

export default defineComponent({
  name: 'TestPagePage',
  components: { TestBaseForm01 },
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


    return {
    }
  },
})
</script>