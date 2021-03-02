<template>
  <!-- 顶部导航条 -->
  <TopBar title="工作区" class="position-relative">
    <div class="right">
      <router-link to="/docs/group/list">
        more<Icon type="angle-double-right" />
      </router-link>
    </div>
  </TopBar>

  <div class="position-relative usercenter">
    <!-- 分组列表 -->
    <loading v-if="loading" />
    <el-row class="groups" :gutter="16" v-else>
      <GroupListItem v-for="item in dataSource" :key="item.id" :data="item" />
    </el-row>
    <el-tooltip content="添加工作组" placement="bottom">
      <div class="add bottom-right">
        <router-link to="/docs/group/add">
          <Icon type="plus" />
        </router-link>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useFetchListData } from '@/hooks/utils/useFetchData'

import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import Loading from '@/components/page/loading.vue'
import GroupListItem from './groupListItem.vue'

export default defineComponent({
  name: 'GroupList',
  components: { Icon, TopBar, Loading, GroupListItem },
  setup() {
    const apiUrl = ref('/api/v1/docs/group/list')

    // 获取数据
    const { loading, dataSource } = useFetchListData(apiUrl)
    // 返回的数据
    return {
      loading,
      dataSource,
    }
  },
})
</script>

<style lang="less" scoped>
.groups {
  min-height: 100px;
}
</style>