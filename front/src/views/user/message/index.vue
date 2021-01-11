<template>
  <div class="fullmain" :style="{display: 'flex', overflow: 'auto'}">
    <div class="right-nav">
        <div class="nav-title">
            <h3>消息中心</h3>
        </div>
        <ul class="right-nav-ul">
            <li>
                <router-link to="/user/message/all">全部消息</router-link>
                <router-link to="/user/message/unread?unread=true&page=1">未读消息</router-link>
                <router-link to="/user/message/read?unread=false&page=1">已读消息</router-link>
            </li>
        </ul>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'MessageIndexPage',
  setup() {
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '用户',
        link: '/user',
      },
      {
        title: '消息中心',
        link: '/user/message/list',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
  },
})
</script>