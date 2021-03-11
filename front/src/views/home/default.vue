<template>
  <!-- 采用基础布局 -->
  <base-layout v-bind="layoutDisplay">
    <template v-slot:header>
      <HeaderDefault></HeaderDefault>
      <!-- <Header001></Header001> -->
    </template>

    <!-- 左侧内容 -->
    <template v-slot:left-sider>
      <LeftSiderDefault :items="data"></LeftSiderDefault>
    </template>

    <!-- 主体内容 -->
    <template v-slot:right>
      <!-- <keep-alive> -->
      <div class="right">
        <!-- 路由各个区域重点编写的代码 -->
        <div class="header">
          <!-- 面包屑导航 -->
          <Breadcrumb />
        </div>
        <!-- 右侧主体内容 -->
        <div class="content">
          <router-view></router-view>
        </div>
        <!-- 路由各个区域重点编写的代码 -->
      </div>
      <!-- </keep-alive> -->
    </template>

    <!-- 底部内容 -->
    <template v-slot:footer>
      <FooterDefault></FooterDefault>
    </template>
  </base-layout>
</template>

<script lang="ts">
/**
 * 默认页面的入口
 * 1. 上下布局：有Header和Body
 * 2. 左右布局：Body有left sider和Right区域
 * 3. Body中的底部Footer不显示
 */
import { defineComponent, ref } from 'vue'
import BaseLayout from '@/components/layout/layout.vue'
import HeaderDefault from '@/components/layout/header/default.vue'
import LeftSiderDefault from '@/components/layout/leftSider/default.vue'
import FooterDefault from '@/components/layout/footer/default.vue'
import Breadcrumb from '@/components/base/breadcrumb.vue'
import { LeftSiderMenu } from '@/types/base/nav'
import useFetchData from '@/hooks/utils/useFetchData'

export default defineComponent({
  name: 'DefaultHomeIndex',
  components: {
    BaseLayout,
    HeaderDefault,
    LeftSiderDefault,
    FooterDefault,
    Breadcrumb,
  },
  props: {
    layoutDisplay: {
      type: Object,
      default() {
        return {
          showHeader: true,
          showLeft: true,
          showBody: true,
          showRight: true,
          showFooter: false,
        }
      },
    },
    // navItems: {
    //   type: Array,
    //   default() {
    //     return []
    //   },
    // },
  },
  setup() {
    const navUrl = ref('/api/v1/account/user/nav/list')
    const { loading, data } = useFetchData<Array<LeftSiderMenu>>(navUrl)
    //  使用hooks，加载这个页面后，设置顶部的导航选中/, 组件卸载的时候，重新设置为/
    // useHeaderSlug('/', '/')

    return {
      loading,
      data,
    }
  },
})
</script>
<style lang="less">
body {
  height: 100vh;
}
</style>