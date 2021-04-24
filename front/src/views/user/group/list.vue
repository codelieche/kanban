<template>
  <div class="main">
    <TopBar title="分组列表" />

    <BaseTable
      apiUrlPrefix="/api/v1/account/group/list"
      pageUrlPrefix="/user/group/list"
      :reFreshTimes="reFreshTimes"
      :showHeader="true"
    >
      <template v-slot:default>
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column prop="name" label="名称" width="120" sortable>
        </el-table-column>
        <el-table-column label="用户" width="">
          <template #default="scope">
            <span v-if="scope.row.user_set.length < 10">
              <el-tag
                v-for="(item, index) in scope.row.user_set"
                :key="index"
                size="small"
                >{{ item }}</el-tag
              >
            </span>
            <span v-else>
              总共有{{ scope.row.user_set.length }}个用户，
              <router-link :to="`/user/group/${scope.row.id}`">
                <Icon type="link">去详情页查看</Icon>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="权限" width="">
          <template #default="scope">
            <span v-if="scope.row.permissions.length < 10">
              <el-tag
                v-for="(item, index) in scope.row.permissions"
                :key="index"
                type="info"
                size="small"
                >{{ item.name }}</el-tag
              >
            </span>
            <span v-else>
              总共有{{ scope.row.permissions.length }}条权限，
              <router-link :to="`/user/group/${scope.row.id}`">
                <Icon type="link">去详情页查看</Icon>
              </router-link>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="">
          <template #default="scope">
            <!-- 有编辑Group权限的用户可看到的按钮 -->
            <span v-if="havePermission">
              <router-link :to="`/user/group/${scope.row.id}`">
                <Icon type="link">详情</Icon>
              </router-link>

              <!-- <el-button
                @click="handleShowDrawer(scope.row.id, 'detail')"
                size="mini"
                icon="el-icon-link"
              >
                查看
              </el-button> -->

              <el-divider direction="vertical"></el-divider>
              <router-link :to="`/user/group/${scope.row.id}/editor`">
                <Icon type="edit">编辑</Icon>
              </router-link>
              <el-divider direction="vertical"></el-divider>

              <el-popconfirm
                :title="`确定删除: ${scope.row.name}(id: ${scope.row.id})？`"
                confirmButtonText="确认"
                cancelButtonText="取消"
                cancelButtonType="default"
                @cancel="handleDeleteCancel"
                @confirm="handleDeleteConfirm(scope.row.id, scope.row.name)"
              >
                <template #reference>
                  <a>
                    <Icon type="trash-o" danger>删除</Icon>
                  </a>
                </template>
              </el-popconfirm>
            </span>

            <!-- 没权限编辑的用户只看到查看详情 -->
            <router-link :to="`/user/group/${scope.row.id}`" v-else>
              <Icon type="link"> 查看详情 </Icon>
            </router-link>
          </template>
        </el-table-column>
      </template>

      <!-- 右侧按钮区域 -->
      <template v-slot:rightButtons>
        <!-- 右侧的添加/刷新按钮 -->
        <el-col
          :sm="12"
          :xs="24"
          :style="{ 'text-align': 'right' }"
          class="right"
        >
          <el-button type="default" @click="reFreshData" size="small">
            <Icon type="refresh">刷新</Icon>
          </el-button>
          <router-link to="/user/group/add">
            <el-button type="primary" size="small">
              <Icon type="plus">Add</Icon>
            </el-button>
          </router-link>
        </el-col>
      </template>
    </BaseTable>

    <!-- 抽屉开始 -->
    <BaseDrawer
      :title="drawerTitle"
      :visible="showDrawer"
      :handleDrawBeforeClose="handleDrawBeforeClose"
    >
      <div>goodddd</div>
    </BaseDrawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'

import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import BaseTable from '@/components/page/baseTable.vue'
import BaseDrawer from '@/components/page/baseDrawer/index.vue'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import fetchApi from '@/plugins/fetchApi'

export default defineComponent({
  name: 'UserGroupList',
  components: {
    BaseTable,
    Icon,
    TopBar,
    BaseDrawer,
  },
  setup() {
    // 设置顶部导航
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '用户分组',
        link: '/user/group',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('account.chang_group')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 显示抽屉
    const showDrawer = ref(false)
    const drawerTitle = ref('')
    const currentAction = ref('')
    const currentID = ref(0)

    // 抽底关闭之前操作
    const handleDrawBeforeClose = () => {
      showDrawer.value = false
    }

    // 显示抽屉函数
    const handleShowDrawer = (id: number, action: string) => {
      showDrawer.value = true
      currentAction.value = action
      currentID.value = id

      if (action === 'detail') {
        drawerTitle.value = '分组详情'
      } else if (action === 'editor') {
        drawerTitle.value = '编辑分组'
      } else if (action === 'add') {
        drawerTitle.value = '添加分组'
      } else {
        drawerTitle.value = ''
      }
    }

    // 删除确认事件
    const handleDeleteConfirm = (id: number, name: string): void => {
      if (!id || id < 0 || !havePermission.value) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/account/group/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除分组(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除分组(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除分组(${name}:${id})失败`)
        })
    }

    // 取消删除
    const handleDeleteCancel = (): void => {
      // ElMessage.warning("取消哦删除")
      ElMessage({
        message: '取消删除',
        type: 'warning',
        center: true,
      })
    }

    return {
      reFreshTimes,
      havePermission,
      handleDeleteCancel,
      handleDeleteConfirm,
      reFreshData,
      // 抽屉相关
      showDrawer,
      drawerTitle,
      handleShowDrawer,
      handleDrawBeforeClose,
      currentAction,
      currentID,
    }
  },
})
</script>