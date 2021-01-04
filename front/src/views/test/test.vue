<template>
  <div>
    Hello Test
    <el-divider></el-divider>
    <Icon type="home" />
    <Icon type="home">首页</Icon>
    <Icon type="user">用户</Icon>
    <Icon type="refresh" :spin="true">Loading</Icon>
    <Icon type="cog" :spin="true" :danger="true" className="large">设置</Icon>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/base/icon.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'

export default defineComponent({
  name: 'TestPage',
  components: {
    Icon,
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
        title: 'test',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
  },
})
</script>

<style lang="less" scoped>
.large {
  font-size: 26px;
}
</style>