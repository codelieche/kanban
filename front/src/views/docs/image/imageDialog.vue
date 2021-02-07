<template>
  <el-divider></el-divider>
  <el-dialog
    title=""
    :fullscreen="true"
    :modal="false"
    custom-class="full-dialog"
    v-model="visibleDialog"
    :destroy-on-close="false"
    @closed="handleDialogClose"
  >
    <div class="show-image" v-if="data">
      <img :src="data.qiniu ? data.qiniu : data.file" />

      <!-- 信息 -->
      <div class="info info-property" v-if="showInfo">
        <div class="close" @click="showInfo = false">
          <span class="text">隐藏</span><Icon type="close" />
        </div>
        <dl>
          <dt>上传者:</dt>
          <dd>{{ data.user }}</dd>
        </dl>
        <dl>
          <dt>图片名:</dt>
          <dd>{{ data.filename }}</dd>
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
import Icon from '@/components/base/icon.vue'
import ObjectTags from '@/components/page/objectTags.vue'
import copyTextFunc from '@/utils/copy'

export default defineComponent({
  name: 'ImageDialog',
  components: { Icon, ObjectTags },
  props: {
    visible: Boolean,
    data: Object,
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

    // 关闭事件
    const handleDialogClose = (reFreshData = false) => {
      if (props.afterCloseHandle) {
        props.afterCloseHandle(reFreshData)
      }
    }

    return {
      showInfo,
      visibleDialog,
      handleDialogClose,
      copyTextFunc,
    }
  },
})
</script>