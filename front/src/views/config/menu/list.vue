<template>
  <TopBar title="导航菜单列表" />
  <BaseTable
    apiUrlPrefix="/api/v1/config/menu/user?"
    pageUrlPrefix="/config/menu/list"
    :showPagination="false"
    :reFreshTimes="reFreshTimes"
    :showHeader="true"
    :props="tableProps"
  >
    <template v-slot:default>
      <el-table-column
        prop="id"
        label="ID"
        width="80"
        align="center"
        sortable
      />
      <!-- 图标 -->
      <el-table-column prop="icon" label="图标" width="160" align="left">
        <template #default="scope">
          <Icon :type="scope.row.icon">{{ scope.row.icon }}</Icon>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="120" />
      <el-table-column prop="slug" label="网址" width="150" />
      <el-table-column prop="target" label="打开方式" width="100" />
      <!-- 是否是站外链接 -->
      <el-table-column prop="is_link" label="站外" width="100">
        <template #default="scope">
          <div class="status">
            <Icon :type="scope.row.is_link ? 'check' : 'close'" />
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="order" label="排序" width="80" sortable />

      <!-- 状态 -->
      <el-table-column
        prop="is_deleted"
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
      <el-table-column label="操作" width="">
        <template #default="scope">
          <span>
            <!-- <a>
              <Icon type="edit">编辑</Icon>
            </a> -->
            <el-button type="text" @click="editorOnClick(scope.row)">
              <Icon type="edit">编辑</Icon>
            </el-button>
          </span>
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
        <el-button type="primary" @click="addOnClick" size="small">
              <Icon type="plus">Add</Icon>
            </el-button>
      </el-col>
    </template>
  </BaseTable>

  <TagEditorDialog
    :visible="showEditDialog"
    :data="currentTagKey"
    :afterCloseHandle="afterDialogClose"
    :isAdd="isAdd"
  ></TagEditorDialog>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import BaseTable from '@/components/page/baseTable.vue'
import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import { ElMessage } from 'element-plus'
import fetchApi from '@/api/fetchApi'
import TagEditorDialog from './editorDialog.vue'

export default defineComponent({
  name: 'UserGroupList',
  components: {
    BaseTable,
    Icon,
    TopBar,
    TagEditorDialog,
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
        title: '配置',
        link: '/config',
      },
      {
        title: '导航菜单',
        link: '/config/menu',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 是否是添加用户操作
    const isAdd = ref(false)

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('config.change_menu')

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // 删除确认事件
    const handleDeleteConfirm = (id: number, name: string): void => {
      if (!id || id < 0 || !havePermission.value) {
        return
      }
      // console.log('我将删除：', id, name)
      const url = `/api/v1/config/menu/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除菜单(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除菜单(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除菜单(${name}:${id})失败`)
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

    // 显示编辑对话框
    const showEditDialog = ref(false)
    const currentTagKey = ref({})
    // 编辑按钮点击

    const editorOnClick = (data: object) => {
      isAdd.value = false
      showEditDialog.value = true
      currentTagKey.value = data
    }

    const addOnClick = () => {
        isAdd.value = true
        showEditDialog.value = true
        currentTagKey.value = {
            'is_link': false,
            target: '_self',
            'is_deleted': false
        }
    }

    // 编辑对话框关闭
    const afterDialogClose = (freshData = false) => {
      if (freshData) {
        reFreshData()
      }
      showEditDialog.value = false
    }

    // 表格的选项
    const tableProps = {
      'row-key': 'id',
      'default-expand-all': false,
      'tree-props': { children: 'children', hasChildren: 'hasChildren' },
    }

    return {
      tableProps,
      reFreshTimes,
      havePermission,
      handleDeleteCancel,
      handleDeleteConfirm,
      reFreshData,
      currentTagKey,
      isAdd,
      editorOnClick,
      addOnClick,  // 添加按钮点击
      showEditDialog,
      afterDialogClose,
    }
  },
})
</script>