<template>
  <div class="top-bar">
    <div class="title">
      <h4>测试Editor</h4>
    </div>
  </div>
  <el-divider></el-divider>
  <Editor :content="content" :onChange="handleEditorChange" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
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

    // 编辑器内容
    const content = ref(`# Hello World
> good`)
    
    const handleEditorChange = (value: string) => {
      console.log('编辑器新的值：', value)
    }

    setTimeout(() => {
      // console.log('content updated')
      content.value = "## goood"
    }, 1000)

    return {
      content,
      handleEditorChange,
    }
  },
})
</script>