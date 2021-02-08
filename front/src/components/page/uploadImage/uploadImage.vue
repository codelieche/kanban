<template>
  <el-tabs v-model="activeName">
    <el-tab-pane
      label="图片/文件"
      name="upload"
      v-if="tabs.indexOf('upload') >= 0"
    >
      <div class="upload">
        <UploadItem :name="uploadName" v-bind="uploadProps"> </UploadItem>
      </div>
    </el-tab-pane>
    <el-tab-pane label="使用链接" name="link" v-if="tabs.indexOf('link') >= 0">
      <div class="link">
        <el-input
          v-model="inputValue"
          placeholder="图片链接"
          size="small"
          clearable
        ></el-input>
        <!-- 展示图片 -->
        <div class="show-image" v-if="imageUrl">
          <img :src="imageUrl" />
        </div>
      </div>
    </el-tab-pane>
  </el-tabs>
  <div class="buttons">
    <el-button
      type="primary"
      size="small"
      :style="{ width: '100%' }"
      :disabled="buttonDisabled"
      @click.prevent.stop="handleSubmit"
      >提交</el-button
    >
  </div>

  <!-- {{ fileList }} -->
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, Ref, ref, watch } from 'vue'
import { UploadFile } from 'element-plus/lib/el-upload/src/upload.type'
import UploadItem from '@/components/base/forms/uploadItem.vue'
import { ElMessage } from 'element-plus'
import fetchApi from '@/plugins/fetchApi'

export default defineComponent({
  name: 'UploadImage',
  props: {
    tabs: {
      type: Array,
      default: () => ['upload', 'link'],
    },
    uploadImageUrl: {
      type: String,
      default: () => '/api/v1/docs/image/upload',
    },
    uploadImageField: {
      type: String,
      default: () => 'file',
    },
    afterUploadHandle: Function,
  },
  components: { UploadItem },
  setup(props) {
    const uploadName = 'upload-image'
    const imageUrl = ref('')
    const activeName = ref('')
    const buttonDisabled = ref(true) // 按钮是否禁用

    // 上传的图片数据
    const fileList: Ref<UploadFile[]> = ref([])
    // 传递给子组件: 用这个来处理
    provide('upload-' + uploadName, fileList)

    // 链接输入
    const inputValue = ref('')

    // 输入框值变化
    watch([inputValue], () => {
      //   console.log(inputValue.value)
      if (inputValue.value === '') {
        imageUrl.value = ''
      } else {
        // 正则判断是否是图片
        const checkImageUrlPattern = /\.(png)|(jpg)|(gif)|(jpeg)$/
        if (checkImageUrlPattern.test(inputValue.value)) {
          imageUrl.value = inputValue.value
        } else {
          imageUrl.value = ''
          //   ElMessage.warning('图片的地址需要以jpg/jpeg/png/gif结尾')
        }
      }
    })

    onMounted(() => {
      if (Array.isArray(props.tabs) && props.tabs.length > 0) {
        activeName.value = props.tabs[0]
      }
    })

    // 按钮是否禁用
    watch([fileList, activeName, imageUrl], () => {
      if (activeName.value === 'upload') {
        if (fileList.value.length > 0) {
          buttonDisabled.value = false
        } else {
          buttonDisabled.value = true
        }
      } else if (activeName.value === 'link') {
        if (imageUrl.value !== '') {
          buttonDisabled.value = false
        } else {
          buttonDisabled.value = true
        }
      } else {
        buttonDisabled.value = true
      }
    })

    // 上传图片Item的相关属性
    const uploadProps = {
      isImage: true,
      limit: 1,
    }

    // 操作上传图片函数
    const handleUploadImage = () => {
      // 上传图片
      // 1. 检查文件数据是否为空
      if (fileList.value.length < 1) {
        ElMessage.warning('图片数据为空')
        return
      }
      // 2. 构造FormData数据
      const formData = new FormData()
      for (let i = 0; i < fileList.value.length; i++) {
        const fileData = fileList.value[i]
        const fileType = fileData.raw.type
        formData.append(props.uploadImageField, fileData.raw)
        // 判断图片类型格式
        if (fileType.indexOf('image') >= 0) {
          formData.append('category', 'image')
        } else if (
          [
            'text/x-sh',
            'application/json',
            'text/javascript',
            'text/html',
            'text/css',
            'text/x-python-script',
          ].indexOf(fileType) >= 0
        ) {
          formData.append('category', 'code')
        } else if (fileType.indexOf('application') >= 0) {
          formData.append('category', 'file')
        }
        // 添加filename参数
        if (!formData.get('filename')) {
          formData.append('filename', fileData.raw.name)
        }
      }
      // 3. 发起请求
      fetchApi
        .post(props.uploadImageUrl, formData)
        .then((response) => {
          // if(response.status <= 200 && response.status < 300){
          //     return response.data
          // }
          return response.data
        })
        .then((responseData) => {
          //   console.log(responseData)
          // 如果有后续的处理函数，那么就执行它
          if (props.afterUploadHandle) {
            props.afterUploadHandle(responseData)
          }
        })
        .catch((err) => {
          console.log(err)
          ElMessage.error('上传失败')
        })
    }

    // 提交事件
    const handleSubmit = () => {
      if (activeName.value === 'upload') {
        handleUploadImage()
      } else if (activeName.value === 'link') {
        // console.log(imageUrl)
        // 执行得到图片链接后的：后续的操作
        if (props.afterUploadHandle) {
          props.afterUploadHandle(imageUrl.value)
        } else {
          console.log('未传递：afterUploadHandle')
        }
      }
    }

    return {
      uploadName,
      imageUrl,
      fileList,
      inputValue,
      activeName,
      uploadProps,
      buttonDisabled,
      handleSubmit,
    }
  },
})
</script>