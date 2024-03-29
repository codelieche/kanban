<template>
  <div class="main">
    <TopBar title="用户列表" />
    <!-- 基础表格 -->
    <BaseTable
      apiUrlPrefix="/api/v1/account/user/"
      pageUrlPrefix="/user/list"
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
        <el-table-column prop="username" label="用户名" width="120" sortable />
        <!-- 状态 -->
        <el-table-column
          prop="is_active"
          label="状态"
          width="100"
          align="center"
        >
          <template #default="scope">
            <div class="status">
              <Icon :type="scope.row.is_active ? 'check' : 'close'" />
            </div>
          </template>
        </el-table-column>
        <!-- 能否访问本站 -->
        <el-table-column
          prop="can_view"
          label="访问本站"
          width="100"
          align="center"
        >
          <template #default="scope">
            <div class="status">
              <Icon :type="scope.row.can_view ? 'check' : 'close'" />
            </div>
          </template>
        </el-table-column>
        <!-- 超级用户 -->
        <el-table-column
          prop="is_superuser"
          label="超级用户"
          width="100"
          align="center"
        >
          <template #default="scope">
            <div class="status">
              <Icon :type="scope.row.is_superuser ? 'check' : 'close'" />
            </div>
          </template>
        </el-table-column>
        <!-- 手机号 -->
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="手机号" />
        <!-- 加入时间 -->
        <el-table-column prop="date_joined" label="加入时间" sortable />
        <!-- 操作 -->
        <el-table-column label="操作">
          <template #default="scope">
            <span type="link">
              <!-- <el-button type="text" @click="editorOnClick(scope.row)"> -->
              <el-button type="text" @click="handleShowDialog(scope.row.id, 'editor')">
                <Icon type="edit">编辑</Icon>
              </el-button>
            </span>
            <el-divider
              direction="vertical"
              v-if="!scope.row.is_active || showDelete"
            ></el-divider>
            <span v-if="scope.row.is_active">
              <el-popconfirm
                :title="`确定删除: ${scope.row.username}(id: ${scope.row.id})？`"
                confirmButtonText="确认"
                cancelButtonText="取消"
                cancelButtonType="default"
                @cancel="handleDeleteCancel"
                @confirm="handleDeleteConfirm(scope.row.id, scope.row.username)"
                v-if="showDelete"
              >
                <template #reference>
                  <el-button type="text">
                    <Icon type="trash-o" danger>删除</Icon>
                  </el-button>
                </template>
              </el-popconfirm>
            </span>
            <span v-else>
              <el-button type="text" disabled> 已禁用 </el-button>
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
          <el-button type="danger" size="small" @click="changeShowDelete" plain>
            <Icon type="trash-o">{{
              showDelete ? '隐藏删除' : '显示删除'
            }}</Icon>
          </el-button>

          <el-button type="default" @click="reFreshData" size="small">
            <Icon type="refresh">刷新</Icon>
          </el-button>

          <!-- 添加按钮 -->
          <el-button
            type="primary"
            @click="handleShowDialog(0, 'add')"
            size="small"
          >
            <Icon type="plus">Add</Icon>
          </el-button>
        </el-col>
      </template>
    </BaseTable>

    <!-- 老的编辑对话框 -->
    <!-- <UserEditorDialog
      :visible="showEditDialog"
      :data="currentUser"
      :afterCloseHandle="afterDialogClose"
    ></UserEditorDialog> -->

    <!-- 对话框开始：v1 -->
    <!-- <UserDialog
      :visible="showDialog"
      :title="dialogTitle"
      :afterCloseHandle="handleDialogClose"
    >
    </UserDialog> -->
    <!-- 对话框结束 -->

    <!-- 对话框v2 -->
    <BaseDialog
      :title="dialogTitle"
      :visible="showDialog"
      width="460px"
      :handleDialogClose="handleDialogClose"
    >
      <UserAdd
        :handleAfterCommit="handleDialogClose"
        v-if="currentAction === 'add'"
      />
      <UserEditor
        :id="currentID"
        :handleAfterCommit="handleDialogClose"
        v-else-if="currentAction === 'editor'"
      />
    </BaseDialog>
  </div>
</template>

<script lang="ts">
/**
 * 这个页面用户编辑和用户添加分别有两种写法
 * 最终都偏向于使用后面一种：BaseDialog的写法
 */
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import TopBar from '@/components/page/topBar.vue'
import Icon from '@/components/base/icon.vue'
import BaseTable from '@/components/page/baseTable.vue'
import BaseDialog from '@/components/page/baseDialog/index.vue'

import fetchApi from '@/api/fetchApi'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import { usePermissionCheck } from '@/hooks/utils/usePermissionCheck'

import UserAdd from './userAdd.vue'
import UserEditor from './userEditor.vue'

export default defineComponent({
  name: 'UserListIndex',
  components: {
    TopBar,
    Icon,
    BaseTable,
    BaseDialog,
    UserAdd,
    UserEditor,
  },
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
        title: '列表',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)
    const router = useRouter()
    // 检查修改用户权限
    const { havePermission } = usePermissionCheck(
      'account.chang_userprofile',
      router
    )

    // // 显示编辑对话框
    // const showEditDialog = ref(false)
    // const currentUser = ref({})
    // // 编辑按钮点击
    // const editorOnClick = (data: object) => {
    //   showEditDialog.value = true
    //   currentUser.value = data
    // }

    // 控制刷新的开关
    const reFreshTimes = ref(0)
    // 增加刷新次数的值，然后就会刷新数据
    const reFreshData = () => {
      reFreshTimes.value += 1
    }

    // // 对话框关闭
    // const afterDialogClose = (freshData = false) => {
    //   if (freshData) {
    //     reFreshData()
    //   }
    //   showEditDialog.value = false
    // }

    // 显示对话框开关：add or editor
    const showDialog = ref(false)
    const dialogTitle = ref('对话框')
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
        dialogTitle.value = '添加用户'
      } else if (action === 'editor') {
        dialogTitle.value = '编辑用户'
      }
    }

    // 显示删除
    const showDelete = ref(false)
    const changeShowDelete = () => {
      showDelete.value = !showDelete.value
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
    // 删除操作
    const handleDeleteConfirm = (id: number, username: string) => {
      // 开始删除
      const url = `/api/v1/account/user/${id}/`
      // 通过delete删除用户
      fetchApi
        .delete(url)
        .then((response) => {
          //   查看status状态码
          if (response.status === 204) {
            ElMessage.success({
              message: '删除' + username + '成功！',
              type: 'success',
            })
            // 刷新数据
            reFreshData()
          } else if (response.status === 200) {
            return response.data.json()
          } else {
            ElMessage.error({
              message: '删除' + username + '失败！',
              type: 'error',
            })
            return response.data.json()
          }
        })
        .then((data) => {
          if (data) {
            if (data.message) {
              ElMessage.warning({
                message: data.message,
                type: 'warning',
              })
            } else {
              ElMessage.error({
                message: JSON.stringify(data),
                type: 'error',
              })
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // 返回
    return {
      // currentUser,
      // showEditDialog,
      // afterDialogClose,
      // editorOnClick,

      havePermission,
      reFreshTimes,
      reFreshData,
      showDelete,
      changeShowDelete,
      handleDeleteCancel,
      handleDeleteConfirm,
      // 用户对话框
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