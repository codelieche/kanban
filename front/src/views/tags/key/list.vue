<template>
  <TopBar title="标签Key列表" />
  <BaseTable
    apiUrlPrefix="/api/v1/tags/key/list"
    pageUrlPrefix="/tags/key/list"
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
      />
      <el-table-column
        prop="key"
        label="Key"
        width="100"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="120"
        align="center"
        sortable
      >
      </el-table-column>
      <!-- 状态 -->
      <el-table-column prop="is_hot" label="热门" width="100" align="center">
        <template #default="scope">
          <div class="status">
            <Icon :type="scope.row.is_hot ? 'check' : 'close'" />
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="time_added"
        label="添加时间"
        width="180"
        align="center"
        sortable
      />

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
       <el-table-column
        prop="description"
        label="描述"
        width=""
        align=""
      />
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <span>
            <!-- <a>
              <Icon type="edit">编辑</Icon>
            </a> -->
            <span type="link">
              <el-button type="text" @click="handleShowDialog(scope.row.id, 'editor')">
                <Icon type="edit">编辑</Icon>
              </el-button>
            </span>
            <el-divider direction="vertical"></el-divider>
            <router-link
              :to="`/tags/value/list?key=${scope.row.id}`"
              v-if="scope.row.id > 0"
            >
              <Icon type="tags">Value列表</Icon>
            </router-link>

            <el-divider direction="vertical"></el-divider>

            <router-link
              :to="`/tags/objecttag/list?tagvalue__key_id=${scope.row.id}`"
              v-if="scope.row.id > 0"
            >
              <Icon type="link">对象列表</Icon>
            </router-link>
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

        <!-- 添加按钮 -->
        <el-button type="primary" @click="handleShowDialog(0, 'add')" size="small">
          <Icon type="plus">Add</Icon>
        </el-button>

      </el-col>
    </template>
  </BaseTable>

    <!-- 对话框开始 -->
    <BaseDialog
      :title="dialogTitle"
      :visible="showDialog"
      width="460px"
      :handleDialogClose="handleDialogClose"
    >
      <TagAdd
        :handleAfterCommit="handleDialogClose"
        v-if="currentAction === 'add'"
      />
      <TagEditor
        :id="currentID"
        :handleAfterCommit="handleDialogClose"
        v-else-if="currentAction === 'editor'"
      />
    </BaseDialog>
    <!-- 对话框结束 -->

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { ElMessage } from 'element-plus'

import Icon from '@/components/base/icon.vue'
import TopBar from '@/components/page/topBar.vue'
import BaseTable from '@/components/page/baseTable.vue'
import BaseDialog from '@/components/page/baseDialog/index.vue'

import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import usePermissionCheck from '@/hooks/utils/usePermissionCheck'
import fetchApi from '@/api/fetchApi'
// import TagEditorDialog from './editorDialog.vue'

import TagAdd from './add.vue'
import TagEditor from './editor.vue'

export default defineComponent({
  name: 'UserGroupList',
  components: {
    BaseTable,
    Icon,
    TopBar,
    // TagEditorDialog,
    BaseDialog,
    TagAdd,
    TagEditor,
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
        title: '标签Key',
        link: '/tags/key',
      },
      {
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    // 检查编辑权限
    const { havePermission } = usePermissionCheck('tags.change_key')

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
      const url = `/api/v1/tags/key/${id}`
      // 发起删除请求
      fetchApi
        .delete(url)
        .then((response) => {
          if (response.status === 204) {
            ElMessage.success(`删除标签Key(${name}:${id})成功`)
            // 刷新数据
            reFreshData()
          } else {
            const result = response.data
            // console.log(result)
            if (result.message) {
              ElMessage.error(`删除失败: ${result.message}`)
            } else {
              ElMessage.error(`删除标签Key(${name}:${id})失败`)
            }
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error(`删除标签Key(${name}:${id})失败`)
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

    // 显示对话框开关：add or editor
    const showDialog = ref(false)
    const dialogTitle = ref('')
    const currentID = ref(0)
    const currentAction = ref('')

    // 对话框关闭操作
    const handleDialogClose = (freshData = false) => {
      showDialog.value = false
      // 刷新数据
      if (freshData) {
        reFreshData()
      }
    }

    // 显示对话框
    const handleShowDialog = (id: number, action: string) => {
      showDialog.value = true
      currentID.value = id
      currentAction.value = action
      if (action === 'add') {
        dialogTitle.value = '添加标签'
      } else if (action === 'editor') {
        dialogTitle.value = '编辑标签'
      }
    }

    return {
      reFreshTimes,
      havePermission,
      handleDeleteCancel,
      handleDeleteConfirm,
      reFreshData,
      
      // 对话框相关
      currentAction,
      showDialog,
      dialogTitle,
      currentID,
      handleDialogClose,
      handleShowDialog,
    }
  },
})
</script>