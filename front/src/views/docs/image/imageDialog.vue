<template>
  <el-divider></el-divider>
  <el-dialog
    :fullscreen="true"
    :modal="false"
    custom-class="full-dialog"
    v-model="visibleDialog"
    :destroy-on-close="false"
    @closed="handleDialogClose"
  >
    <div class="show-image" v-if="data" @click="handleShowImageClick">
      <img
        :src="data.qiniu ? data.qiniu : data.file"
        @click="stopPropagation"
      />

      <!-- 信息 -->
      <div class="info info-property" v-if="showInfo" @click="stopPropagation">
        <div class="close" @click="showInfo = false">
          <span class="text">隐藏</span><Icon type="close" />
        </div>
        <dl>
          <dt>上传者:</dt>
          <dd>{{ data.user }}</dd>
        </dl>
        <dl>
          <dt>图片名:</dt>
          <dd>
            <EditableContent
              tagName="div"
              :spellCheck="false"
              :content="data.filename ? data.filename : '无文件名'"
              :handleContentUpdated="handleFilenameUpdate"
            />
          </dd>
        </dl>
        <dl>
          <dt>状态:</dt>
          <dd class="status">
            <Icon :type="data.is_active ? 'check' : 'close'" />
          </dd>
        </dl>
        <dl v-if="!!data.width && data.width > 0">
          <dt>尺寸:</dt>
          <dd>{{ `${data.width} x ${data.height}` }}</dd>
        </dl>
        <dl>
          <dt>标签:</dt>
          <dd>
            <ObjectTags
              appLabel="docs"
              model="image"
              :objectID="data.id"
              :canDelete="true"
            />
          </dd>
        </dl>
        <dl>
          <dt>操作:</dt>
          <dd>
            <el-button
              class="copy"
              type="text"
              size="small"
              @click.stop.prevent="
                copyTextFunc('图片链接', data.qiniu ? data.qiniu : data.file)
              "
            >
              <Icon type="copy">链接</Icon>
            </el-button>
            <el-button
              class="copy"
              type="text"
              size="small"
              @click.stop.prevent="
                copyTextFunc(
                  'Markdown',
                  `![${data.filename}](${data.qiniu ? data.qiniu : data.file})`
                )
              "
            >
              <Icon type="copy">Markdown</Icon>
            </el-button>
          </dd>
        </dl>

        <!-- 添加时间 -->
        <dl>
          <dt>添加时间:</dt>
          <dd>{{ data.time_added }}</dd>
        </dl>
        <!-- {{ data }} -->
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import patchUpdateObject from '@/utils/api/patchUpdateObject'
import Icon from '@/components/base/icon.vue'
import EditableContent from '@/components/base/editableContent.vue'
import ObjectTags from '@/components/page/objectTags.vue'
import copyTextFunc from '@/utils/copy'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'ImageDialog',
  components: { Icon, EditableContent, ObjectTags },
  props: {
    visible: Boolean,
    data: Object,
    reFreshData: Function,
    afterCloseHandle: Function,
  },
  setup(props) {
    //   显示对话框
    const visibleDialog = ref(false)
    // 显示图片信息
    const showInfo = ref(true)

    watch(
      [props],
      () => {
        //   console.log('props.visible: ', props.visible)
        if (props.visible !== visibleDialog.value) {
          //   console.log('修改visibleDialog.value:', visibleDialog.value, props.visible)
          visibleDialog.value = props.visible
        }
        if (props.visible && !showInfo.value) {
          showInfo.value = true
        }
      },
      { immediate: true }
    )

    // 修改文件名
    const handleFilenameUpdate = (html: HTMLElement, text: string) => {
      // console.log(html, text)
      if(text === null || text === undefined){
        return
      }
      patchUpdateObject(
        'docs',
        'image',
        props.data?.id,
        { filename: text },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (d: any) => {
          if (d && d?.id > 0) {
            ElMessage.success('修改图片名称成功')
            if (props.reFreshData) {
              props.reFreshData()
            }
          }
        }
      )
    }

    // 关闭事件
    const handleDialogClose = (reFreshData = false) => {
      if (props.afterCloseHandle) {
        props.afterCloseHandle(reFreshData)
      }
    }

    // 关闭窗口
    const handleShowImageClick = (evt: MouseEvent) => {
      // console.log('handleShowImageClick', evt.currentTarget)
      evt.stopPropagation()
      evt.preventDefault()
      handleDialogClose()
    }

    const stopPropagation = (evt: MouseEvent) => {
      evt.stopPropagation()
    }

    return {
      showInfo,
      visibleDialog,
      handleDialogClose,
      copyTextFunc,
      handleShowImageClick,
      stopPropagation,
      handleFilenameUpdate,
    }
  },
})
</script>