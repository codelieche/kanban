<template>
  <el-dialog
    title="编辑标签Key"
    v-model="visibleDialog"
    width="460px"
    @closed="handleDialogClose"
  >
    <UserEditorForm :data="data" :handleDialogClose="handleDialogClose" />
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import UserEditorForm from './editorForm.vue'
export default defineComponent({
  name: 'UserEditorDialog',
  components: { UserEditorForm },
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    data: Object,
    afterCloseHandle: Function,
  },
  setup(props) {
    const visibleDialog = ref(false)

    watch([props], () => {
      //   console.log("props.visible: ", props.visible)
      if (props.visible !== visibleDialog.value) {
        //   console.log('修改visibleDialog.value:', visibleDialog.value, props.visible)
        visibleDialog.value = props.visible
      }
    })

    // 关闭事件
    const handleDialogClose = (reFreshData=false) => {
      if (props.afterCloseHandle) {
        props.afterCloseHandle(reFreshData)
      }
    }

    return {
      visibleDialog,
      handleDialogClose,
    }
  },
})
</script>