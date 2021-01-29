<template>
  <el-upload
    action=""
    :auto-upload="false"
    :on-change="onUploadChange"
    :on-remove="onUploadRemove"
    :on-exceed="onUploadExceed"
    :file-list="fileList"
    v-bind="attrs"
    class="upload-item"
  >
    <div class="upload">
      <img :src="imageUrl" v-if="imageUrl && isImage" />
      <div v-else>
        <i class="el-icon-upload"></i>
      </div>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        {{ tips ? tips : '' }}
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts">
import { ElMessage } from 'element-plus'
import { UploadFile } from 'element-plus/lib/el-upload/src/upload.type'
import { defineComponent, Ref, inject, ref, watch } from 'vue'
export default defineComponent({
  name: 'UploadItem',
  props: {
    name: String,
    value: String,
    isImage: Boolean,
    tips: String,
  },
  setup(props, attrs) {
    // 图片链接
    const imageUrl = ref('')
    // 从上级组件中获取值
    const fileList: Ref<UploadFile[]> =
      props.name && inject('upload-' + props.name) !== undefined
        ? (inject('upload-' + props.name) as Ref<UploadFile[]>)
        : ref([])

    const onUploadChange = (file: UploadFile, uploadFileList: UploadFile[]) => {
      // console.log(file, uploadFileList)
      fileList.value = uploadFileList
      if (uploadFileList.length > 0 && file.raw.type.indexOf('imag') >= 0) {
        const newImageUrl = URL.createObjectURL(file.raw)
        imageUrl.value = newImageUrl
        // console.log(formData.value)
      }
    }

    // 文件移除的时候
    const onUploadRemove = (file: UploadFile, uploadFileList: UploadFile[]) => {
      // console.log(file, uploadFileList)
      fileList.value = uploadFileList
      if (uploadFileList.length <= 0) {
        imageUrl.value = ''
      } else {
        const lastFile = uploadFileList[uploadFileList.length - 1]
        if (lastFile.raw.type.indexOf('imag') >= 0) {
          // 判断其是文件，才生成url
          imageUrl.value = URL.createObjectURL(
            uploadFileList[uploadFileList.length - 1].raw
          )
        }
      }
    }

    // 文件超出限制的时候
    const onUploadExceed = (file: UploadFile, uploadFileList: UploadFile[]) => {
      // console.log(file, uploadFileList)
      // console.log(uploadFileList.length)
      fileList.value = uploadFileList
      // 超出文件限制的时候，我们可把file，替换列表中的最后一个文件
      ElMessage.warning({
        message: '超出了文件限制, 请先移除前面的文件/图片',
        type: 'warning',
      })
    }

    watch(
      props,
      () => {
        imageUrl.value = props.value ? props.value : ''
      },
      { immediate: true }
    )

    return {
      attrs,
      imageUrl,
      fileList,
      onUploadChange,
      onUploadRemove,
      onUploadExceed,
    }
  },
})
</script>

<style lang="less">
.upload-item {
  width: 100%;
  .el-upload {
    width: 100%;
    img {
      max-width: 100%;
      height: auto;
      max-height: 300px;
      overflow: auto;
    }
  }

  .el-upload-dragger,
  .upload {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: auto;

    .el-upload__text {
      color: #999;
      font-size: 13px;
      text-align: center;
      em {
        color: #409eff;
        font-style: normal;
        font-size: 14px;
      }
    }
  }

  .el-icon-upload {
    font-size: 67px;
    color: #c0c4cc;
    margin: 20px 0 16px;
    line-height: 50px;
  }
}
</style>