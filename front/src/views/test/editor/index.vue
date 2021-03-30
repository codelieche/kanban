<template>
  <div class="top-bar">
    <div class="title">
      <h4>测试Editor</h4>
    </div>
  </div>
  <el-divider></el-divider>
  <Editor />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
// import EditableContent from '@/components/base/editableContent.vue'
import Editor from '@/components/page/editor/index.vue'

export default defineComponent({
  name: 'TestEditorPage',
  components: {Editor},
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