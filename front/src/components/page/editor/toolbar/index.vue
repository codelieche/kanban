<template>
  <div class="tools">
    <el-row :style="{ width: '100%' }">
      <!-- 左侧的功能按钮 -->
      <el-col :xs="24" :sm="24" :md="20" class="left">
        <ButtonItem
          v-for="(item, index) in tools"
          :key="index"
          :icon="item.icon"
          :text="item.text"
          :type="item.type"
          :editor="editor"
        />
      </el-col>
      <!-- 右侧的按钮 -->
      <el-col :sm="24" :md="4" class="right">
        <!-- 是否显示html -->
        <div
          class="no-active"
          @click="setDisplay(display.markdown, !display.html)"
        >
          <Icon :type="display && display.html ? 'eye-slash' : 'eye'" />
        </div>
        <div
          class="no-active"
          @click="setDisplay(!display.markdown, true)"
        >
          <Icon type="desktop" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType, Ref } from 'vue'
import CodeMirror from 'codemirror'

import Icon from '@/components/base/icon.vue'
import ButtonItem from './buttonItem.vue'

export default defineComponent({
  name: 'EditorToolbar',
  components: { Icon, ButtonItem },
  props: {
    editor: Object as PropType<CodeMirror.Editor>,
  },
  setup() {
    // 从父级组件中获取display
    const display: Ref<object> | undefined = inject('display')

    const tools = [
      { type: 'undo', text: '撤销', icon: 'undo' },
      { type: 'redo', text: '重做', icon: 'repeat' },
      { type: 'bold', text: '粗体', icon: 'bold' },
      { type: 'italic', text: '斜体', icon: 'italic' },
      // {type: "underline", text: "下划线", icon: "underline"},
      { type: 'strikethrough', text: '删除线', icon: 'strikethrough' },
      { type: 'list-ul', text: '无序列表', icon: 'list-ul' },
      { type: 'list-ol', text: '有序列表', icon: 'list-ol' },
      { type: 'link', text: '链接', icon: 'link' },
      { type: 'quote', text: '引用', icon: 'quote-left' },
      { type: 'blockquote', title: '代码块', icon: 'code' },
      //   { type: 'table', title: '表格', icon: 'table' },
      { type: 'image', text: '图片', icon: 'image' },
    ]

    // 设置display
    const setDisplay = (markdown: boolean, html: boolean) => {
      if (display !== undefined) {
        display.value['markdown'] = markdown
        display.value['html'] = html
      }
    }
    return {
      tools,
      display,
      setDisplay,
    }
  },
})
</script>