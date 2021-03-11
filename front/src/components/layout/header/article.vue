<template>
  <div class="header">
    <!-- 左侧开关 -->
    <div
      class="toogle"
      v-if="!showLeftSider"
      @mouseenter="onMouseEnter"
      @mouseleave="() => (leftSiderToogleIcon = 'align-justify')"
      @click="() => (showLeftSider = !showLeftSider)"
    >
      <Icon :type="leftSiderToogleIcon" />
    </div>
    <!-- 面包屑导航 -->
    <Breadcrumb />

    <div class="right">
      <!-- 搜索按钮 -->
      <HeaderSearchButton />

      <!-- 用户登录信息 -->
      <div class="userinfo">
        <UserLoginOrInfo />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { showLeftSider } from '@/hooks/store/useArticleLeftSiderData'

import Icon from '@/components/base/icon.vue'
import Breadcrumb from '@/components/base/breadcrumb.vue'
import HeaderSearchButton from '@/components/layout/header/searchButton.vue'
import UserLoginOrInfo from '@/components/layout/header/userLoginOrInfo.vue'

export default defineComponent({
  name: 'ArticleRightHeader',
  components: {
    Icon,
    Breadcrumb,
    HeaderSearchButton,
    UserLoginOrInfo,
  },
  setup() {
    // 显示左侧按钮的开关
    const leftSiderToogleIcon = ref('align-justify')

    // 当鼠标移入toogle
    const onMouseEnter = () => {
      leftSiderToogleIcon.value = !showLeftSider.value
        ? 'angle-double-right'
        : 'angle-double-left'
    }

    return {
      showLeftSider, // 是否显示左侧的导航
      leftSiderToogleIcon, // 开关的图标
      onMouseEnter,
    }
  },
})
</script>