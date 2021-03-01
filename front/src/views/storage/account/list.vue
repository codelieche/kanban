<template>
  <TopBar title="账号列表" />

  <!-- 列表开始 -->
  <BaseList
    apiUrlPrefix="/api/v1/storage/account/"
    pageUrlPrefix="/storage/account/list"
    :pageSize="10"
    :reFreshTimes="reFreshTimes"
  >
    <!-- 列表主体内容 -->
    <template v-slot:default="data">
      <!-- 用ColumnWrap包裹 -->
      <ColumnWrap class="" :width="400" :border="true">
        <AccountItem
          v-for="item in data.dataSource"
          :key="item.id"
          :data="item"
          :canEditor="havePermission"
        />
      </ColumnWrap>
    </template>

    <!-- 右侧的添加/刷新按钮 -->
    <template v-slot:rightButtons>
      <el-col
        :sm="12"
        :xs="24"
        :style="{ 'text-align': 'right' }"
        class="right"
      >
        <!-- 刷新按钮 -->
        <el-button type="default" @click="reFreshData" size="small">
          <Icon type="refresh">刷新</Icon>
        </el-button>
        <!-- 添加按钮 -->
        <router-link to="/storage/account/add" v-if="havePermission">
          <el-button type="primary" @click="reFreshData" size="small">
            <Icon type="plus">Add</Icon>
          </el-button>
        </router-link>
      </el-col>
    </template>
    <!-- 右侧按钮结束 -->
  </BaseList>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'

import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import BaseList from '@/components/page/baseList.vue'
import ColumnWrap from '@/components/page/base/columnWrap.vue'
import AccountItem from './listItem.vue'

export default defineComponent({
  name: 'StorageAccountPage',
  components: { Icon, TopBar, BaseList, ColumnWrap, AccountItem },
  setup() {
    // 设置顶部导航
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '存储账号',
        link: '/storage/account',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查权限
    const { havePermission } = usePermissionCheck('storage.change_account')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    return {
      havePermission,
      reFreshTimes,
      reFreshData,
    }
  },
})
</script>