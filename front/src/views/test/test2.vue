<template>
  <div class="top-bar">
    <div class="title">
      <h4>Test2 Page</h4>
    </div>
  </div>
  <div>Hello Test2</div>
  <el-divider></el-divider>
  <ErrorPage :code="404" />
  <el-divider></el-divider>

  <!-- 测试上传文件/图片 -->
  <el-upload
    drag
    action=""
    :auto-upload="false"
    :on-change="onUploadChange"
    list-type="picture"
  >
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
    </template>
  </el-upload>

  <!-- 拖拽 -->
  <Resizable :maxWidth="0" :minWidth="65" >
    <div class="box">
      Hello Resizable
    </div>
  </Resizable>
  <Resizable :maxWidth="0" :minWidth="65" :disabled="true">
    <div class="box">
      Hello Resizable22
    </div>
  </Resizable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useBreadcrumbItems from '@/hooks/store/useBreadcrumbItems'
import ErrorPage from '@/views/errors/index.vue'
import { UploadFile } from 'element-plus/lib/el-upload/src/upload.type'
import Resizable from '@/components/base/resizable.vue'

export default defineComponent({
  name: 'Test2Page',
  components: { ErrorPage, Resizable },
  setup() {
    const breadcrumbItems = [
      {
        title: '首页',
        icon: 'home',
        link: '/',
      },
      {
        title: '测试',
        link: '/test',
      },
      {
        title: 'test2',
      },
    ]
    useBreadcrumbItems(breadcrumbItems)

    const onUploadChange = (file: UploadFile, fileList: UploadFile[]) => {
      console.log(file)
      console.log(fileList)
    }
    return {
      onUploadChange,
    }
  },
})
</script>

<style lang="less" scoped>
.box {
  // background-color: #eee;
  padding: 10px;
  border: 1px dashed #444;
}
</style>