<template>
  <router-link to="/user/login" v-if="loading || !data"
    >请登录{{ data }}</router-link
  >
  <el-dropdown v-else class="header-dropdown"  trigger="hover">
    <Icon type="user-circle">Hi ~ {{ data.username }}</Icon>
    <template #dropdown>
      <el-dropdown-menu class="dropdown-menu">
        <router-link v-for="(item, index) in dropdowmItems" :key="index" :to="item.link">
          <el-dropdown-item >
            <Icon :type="item.icon">
              {{ item.title }}
            </Icon>
          </el-dropdown-item>
        </router-link>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'

import Icon from '@/components/base/icon.vue'

import { useFetchData } from '@/hooks/utils/useFetchData'
import UserInfo from '@/types/base/user'
import {setUserInfo} from '@/hooks/store/useUserInfo'

export default defineComponent({
  name: 'UserLoginOrInfo',
  components: { Icon },
  setup() {
    const { loading, data } = useFetchData<UserInfo>('/api/v1/account/login')

    watch([data], () => {
      if(data.value){
        setUserInfo(data.value)
      }
    })
    
    const dropdowmItems = [
      {
        icon: 'user-circle',
        title: '用户中心',
        link: '/user/center',
      },
      {
        icon: 'folder-o',
        title: '文档分组',
        link: '/docs/group/list',
      },
      {
        icon: 'file-text-o',
        title: '文章列表',
        link: '/docs/article/list',
      },
      {
        icon: 'cubes',
        title: '对象列表',
        link: '/storage/object/list',
      },
      {
        icon: 'envelope-o',
        title: '消息中心',
        link: '/user/message',
      },
      {
        icon: 'eye',
        title: '修改密码',
        link: '/user/password/change',
      },
      {
        icon: 'sign-out',
        title: '退出登录',
        link: '/user/logout',
      },
    ]
    return {
      loading,
      data,
      dropdowmItems,
    }
  },
})
</script>

<style lang="less" scoped>
.el-dropdown.header-dropdown span {
  color: #fff;
  display: inline-block;
}
.dropdown-menu {
  padding: 1px 0;
  li.el-dropdown-menu__item {
    &:hover {
      background-color: #eee;
    }
  }
  a, .el-dropdown-item {
    color: #595959;
    .el-dropdown-menu__item:hover {
      color: #555;
    }
  }

}
</style>