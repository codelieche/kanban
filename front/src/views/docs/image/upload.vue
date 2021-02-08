<template>
  <el-button type="primary" size="small" @click.prevent="handleUploadClick">
    <Icon type="upload">Add</Icon>
  </el-button>
  <UploadImageDialog
    title="上传图片"
    :visible="visibleDialog"
    :afterCloseHandle="afterCloseHandle"
    :tabs="['upload']" 
    :afterUploadHandle="afterUploadHandle"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Icon from '@/components/base/icon.vue'
import UploadImageDialog from '@/components/page/uploadImage/dialog.vue'

export default defineComponent({
  name: 'UploadImageButton',
  components: { Icon, UploadImageDialog },
  props: {
    reFreshData: Function,
  },
  setup(props) {
    const visibleDialog = ref(false)
    const handleUploadClick = () => {
      visibleDialog.value = !visibleDialog.value
    }
    const afterCloseHandle = () => {
      visibleDialog.value = false
    }
    const afterUploadHandle = () => {
      // 上传完之后，刷新
      if(props.reFreshData){
        props.reFreshData()
        // 关闭弹出框
        visibleDialog.value = false
      }
    }
    return {
      visibleDialog,
      handleUploadClick,
      afterCloseHandle,
      afterUploadHandle
    }
  },
})
</script>