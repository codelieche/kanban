<template>
  <el-dialog
    custom-class="upload-dialog"
    :width="560"
    title=""
    v-model="visibleDialog"
    @closed="handleDialogClosed"
    :append-to-body="true"
    :destroy-on-close="true"
  >
    <UploadImage
      :tabs="tabs"
      :uploadUrl="uploadUrl"
      :uploadField="uploadField"
      :afterUploadHandle="afterUploadHandle"
    />
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import UploadImage from './uploadImage.vue'

export default defineComponent({
  name: 'UploadImageDialog',
  components: {
    UploadImage,
  },
  props: {
    visible: Boolean,
    title: String,
    afterCloseHandle: Function,
    tabs: {
      type: Array,
      default: () => ['upload', 'link'],
    },
    uploadUrl: {
      type: String,
      default: () => '/api/v1/docs/image/upload',
    },
    uploadField: {
      type: String,
      default: () => 'file',
    },
    afterUploadHandle: Function, // 上传完之后的操作
  },
  setup(props) {
    const visibleDialog = ref(false)

    watch(
      props,
      () => {
        if (props.visible != visibleDialog.value) {
          visibleDialog.value = props.visible
        }
      },
      { immediate: true }
    )

    const handleDialogClosed = () => {
      if (props.afterCloseHandle) {
        props.afterCloseHandle()
      }
    }
    return {
      visibleDialog,
      handleDialogClosed,
    }
  },
})
</script>

<style lang="less">
.upload-dialog {
  position: relative;
  .el-dialog__header {
    border-bottom: none;
    padding: 2px;
    // display: none;
    // .el-dialog__headerbtn {
    //   // 要不然点击无效果
    //   z-index: 100;
    // }
  }
  .upload {
    min-height: 140px;
  }
  .link {
    min-height: 60px;
    text-align: center;
    .show-image {
      margin: 10px 0;
      padding: 5px;
      border: 1px solid rgba(55, 55, 50, 0.1);
      img {
        max-width: 100%;
        max-height: 450px;
        overflow: scroll;
      }
    }
    .message {
      font-size: 13px;
      color: #777;
      padding: 15px;
      margin: 20px 0;
    }
  }
  .buttons {
    margin: 10px 0;
  }
}
</style>