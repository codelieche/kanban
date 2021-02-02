<template>
  <el-tag
    type="info"
    v-if="canAddUser"
    size="small"
    class="add-button"
    @click="addUserButtonClick"
    ><Icon type="plus" />Add User</el-tag
  >
  <AddUserDialog
    :visible="showDialog"
    :data="{ group: id, permission: 'R', user: '' }"
    :afterCloseHandle="handleDialogClose"
  />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import { useFetchData } from '@/hooks/utils/useFetchData'
import Icon from '@/components/base/icon.vue'
import AddUserDialog from './addUserDialog.vue'

export default defineComponent({
  name: 'AddGroupUserButton',
  components: { Icon, AddUserDialog },
  props: {
    id: String,
    checkPermission: Function,
    reFreshData: Function,
  },
  setup(props) {
    // 获取权限的数据
    const groupPermissionApiUrl = ref<string | null>(null)
    // 获取详情数据
    const permissions = useFetchData(groupPermissionApiUrl)
    // 能否添加用户
    const canAddUser = ref(false)
    // 显示对话框
    const showDialog = ref(false)
    // 点击按钮
    const addUserButtonClick = () => {
      showDialog.value = !showDialog.value
    }
    // 关闭对话框事件
    const handleDialogClose = () => {
      showDialog.value = false
      if (props.reFreshData) {
        props.reFreshData()
      }
    }

    // 监听id的变化
    watch(
      [props],
      () => {
        if (props.id) {
          groupPermissionApiUrl.value = `/api/v1/docs/group/${props.id}/permissions`
        }
      },
      { immediate: true }
    )

    // 监听权限数据的变化
    watch([permissions.data], () => {
      //   console.log(permissions.data.value)
      if (permissions.data.value && Array.isArray(permissions.data.value)) {
        if (permissions.data.value.indexOf('add_user') >= 0) {
          canAddUser.value = true
        } else {
          canAddUser.value = false
        }
        if (props.checkPermission) {
          props.checkPermission(permissions.data.value)
        }
      }
    })

    return {
      canAddUser,
      showDialog,
      addUserButtonClick,
      handleDialogClose,
    }
  },
})
</script>

<style lang="less" scoped>
.add-button {
  cursor: pointer;
  border-style: dashed;
}
</style>