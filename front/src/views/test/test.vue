<template>
  <div class="top-bar">
    <div class="title">
      <h4>测试页面</h4>
    </div>
  </div>

  <!-- <el-divider></el-divider> -->
  <Icon type="home" />
  <Icon type="home">首页</Icon>
  <Icon type="user">用户</Icon>
  <Icon type="refresh" :spin="true">Loading</Icon>
  <Icon type="cog" :spin="true" :danger="true" className="large">设置</Icon>

  <el-divider></el-divider>
  <loading></loading>

  <div class="modellogs">
    <ModelLogItem
      :data="{
        user: 'code',
        action_flag: 1,
        message: '删除',
        time_added: '2021-01-01',
      }"
    ></ModelLogItem>
    <ModelLogItem
      :data="{
        user: 'code',
        action_flag: 2,
        message: [
          { field: 'password', value_old: 'gggg', value_new: 'newnew' },
        ],
        time_added: '2021-01-01',
      }"
    ></ModelLogItem>
    <ModelLogItem
      :data="{
        user: 'code',
        action_flag: 3,
        message: '删除对象',
        time_added: '2021-01-01',
      }"
    ></ModelLogItem>
  </div>

  <!-- <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
    <template #append>
      <el-button icon="el-icon-search"></el-button>
    </template>
  </el-input> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Icon from '@/components/base/icon.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import Loading from '@/components/page/loading.vue'
import ModelLogItem from '@/components/page/modelLogs/item.vue'

export default defineComponent({
  name: 'TestPage',
  components: {
    Icon,
    Loading,
    ModelLogItem,
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