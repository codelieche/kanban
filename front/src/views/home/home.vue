<template>
  <div class="main">
    <div>Hello Home Page</div>
    <el-row>
      <el-button size="small">默认按钮</el-button>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'

export default defineComponent({
  name: 'HomePage',

  setup() {
    // 右侧的导航
    const items = [{ title: '首页', link: '/', icon: 'home' }]
    useBreadcrumbItems(items)
  },
})
</script>