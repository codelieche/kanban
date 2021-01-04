<template>
  <div>Hello Home Page</div>
  <el-row>
    <el-button>默认按钮</el-button>
    <el-button type="primary">主要按钮</el-button>
    <el-button type="success">成功按钮</el-button>
    <el-button type="info">信息按钮</el-button>
    <el-button type="warning">警告按钮</el-button>
    <el-button type="danger">危险按钮</el-button>
  </el-row>
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