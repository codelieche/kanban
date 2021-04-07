<template>
  <!-- 右上角的菜单 -->
  <div class="tools" v-if="canEditor">
    <el-dropdown trigger="click" size="small">
      <div class="toogle">
        <Icon type="ellipsis-h" />
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :disabled="!canEditor" @click="handleEditorClick">
            <Icon type="edit" />编辑内容
          </el-dropdown-item>
          <el-dropdown-item
            @click.stop.prevent="
              copyTextFunc('Markdown', data.content ? data.content : '内容为空')
            "
          >
            <Icon type="copy">复制内容</Icon>
          </el-dropdown-item>
          <el-dropdown-item disabled>
            <Icon type="trash-o">删除文章</Icon>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
// 文章右上角的工具按钮

import { defineComponent, inject, onMounted, Ref } from 'vue'
import Icon from '@/components/base/icon.vue'
import { copyTextFunc } from '@/utils/copy'

export default defineComponent({
  name: 'ArticleDetailTools',
  props: {
    id: String,
    data: Object,
    canEditor: Boolean,
  },
  components: {
    Icon,
  },
  setup(props) {
    const showArticleEditor: Ref<boolean> | undefined = inject(
      'showArticleEditor'
    )
    const handleEditorClick = () => {
      if (props.canEditor && showArticleEditor) {
        showArticleEditor.value = true
      }
    }
    // 监控按键
    onMounted(() => {
      document.onkeydown = (e: KeyboardEvent) => {
        // console.log('e:', e, e['path'])
        // 比如是标题、描述等在修改的时候按了字母e是不需要弹出编辑框的
        if (
          e &&
          Array.isArray(e['path']) &&
          e['path'][0]['tagName'] === 'BODY'
        ) {
          if (props.canEditor) {
            const key = e.key
            if (key === 'e' || key === 'E') {
              // console.log(e)
              if (showArticleEditor) {
                showArticleEditor.value = true
              }
            }
          } else {
            return
          }
        }
      }
    })
    return {
      handleEditorClick,
      copyTextFunc,
    }
  },
})
</script>