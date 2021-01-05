<template>
  <div class="top-bar">
    <div class="title">
      <h4>测试Editor</h4>
    </div>
  </div>
  <div>Hello Editor Index.page</div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'

export default defineComponent({
  name: 'TestEditorPage',
  components: {},
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
        title: 'editor',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
  },
})
</script>