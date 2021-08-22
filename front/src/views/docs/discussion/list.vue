<template>
  <TopBar title="评论列表" />

  <BaseTable
    apiUrlPrefix="/api/v1/docs/discussion/list"
    pageUrlPrefix="/docs/discussion/list"
    :reFreshTimes="reFreshTimes"
    :showHeader="true"
    :props="tableProps"
  >
    <template v-slot:default>
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="category" label="类型" width="100">
      </el-table-column>
      <el-table-column prop="content" label="内容" width="260" />

      <el-table-column prop="user" label="用户" width="130" />

      <el-table-column
        prop="time_added"
        label="添加时间"
        width="170"
        align="center"
        sortable
      />

       <!-- 状态 -->
      <el-table-column
        prop="is_deleteed"
        label="状态"
        width="100"
        align="center"
      >
        <template #default="scope">
          <div class="status">
            <Icon :type="!scope.row.is_deleted ? 'check' : 'close'" />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <router-link
            v-if="scope.row.article > 0"
            :to="`/docs/article/${scope.row.article}`"
          >
            <Icon type="link"> 查看文章 </Icon>
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
        <!-- <router-link to="/docs/group/add">
          <el-button type="primary" size="small">
            <Icon type="plus">Add</Icon>
          </el-button>
        </router-link> -->
      </el-col>
    </template>
  </BaseTable>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseTable from '@/components/page/baseTable.vue'
import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
// import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import { ElMessage } from 'element-plus'
import fetchApi from '@/api/fetchApi'

export default defineComponent({
  name: 'UserGroupList',
  components: {
    BaseTable,
    Icon,
    TopBar,
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
        title: '文档评论',
        link: '/docs/discussion',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查编辑权限
    // const { havePermission } = usePermissionCheck('docs.change_discussion')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 删除确认事件
    const handleDeleteConfirm = (id: number, name: string): void => {
    //   if (!id || id < 0 || !havePermission.value) {
      if (!id || id < 0 ) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/docs/discussion/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除讨论(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除讨论(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除讨论(${name}:${id})失败`)
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

    // 表格的选项
    const tableProps = {
      //   'row-key': 'id',
      //   'default-expand-all': false,
      //   'tree-props': { children: 'children', hasChildren: 'hasChildren' },
    }

    return {
      tableProps,
      reFreshTimes,
    //   havePermission,
      handleDeleteCancel,
      handleDeleteConfirm,
      reFreshData,
    }
  },
})
</script>