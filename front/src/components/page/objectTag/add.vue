<template>
  <el-input
    ref="elementRef"
    v-model="inputValue"
    placeholder="标签名"
    v-if="inputVisible"
    size="mini"
    :clearable="true"
    @change="handleInputConfirm"
    @blur="handleInputBlur"
    class="tag-input"
  >
  </el-input>
  <el-tag type="info" size="small" @click="handleShowInput" v-else>
    <Icon type="plus" />添加标签
  </el-tag>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import Icon from '@/components/base/icon.vue'
import { handleObjectTagAdd } from './operation'

export default defineComponent({
  name: 'AddObjectTag', // 添加对象标签
  components: { Icon },
  props: {
    tagKey: { type: String, default: () => 'tag' },
    appLabel: { type: String, default: () => '' },
    model: { type: String, default: () => '' },
    objectID: Number,
    callback: Function,
  },
  setup(props) {
    // 显示添加标签的输入框
    const inputVisible = ref(false)
    const inputValue = ref('')
    const elementRef: Ref<HTMLElement | null> = ref(null)

    // 显示输入框
    const handleShowInput = () => {
      inputVisible.value = true
    }

    // 提交后处理函数
    const afterSubmit = () => {
      inputValue.value = ''
      //   console.log('afterSubmit')
      if (props.callback) {
        props.callback()
      }
    }

    // 失去焦点
    const handleInputBlur = () => {
      inputVisible.value = false
      //   inputValue.value = ''
      //   afterSubmit()
    }

    // 按下回车键
    const handleInputConfirm = () => {
      if (inputValue.value === '') {
        return
      }
      // DOMTokenList
      const classNamesList = document.activeElement?.parentElement?.classList
      if (classNamesList && classNamesList.value.length > 0) {
        if (classNamesList.value.indexOf('el-input--mini') >= 0) {
          // 可以添加标签了
          if (props.model && props.objectID) {
            handleObjectTagAdd(
              props.appLabel,
              props.model,
              props.objectID,
              props.tagKey,
              inputValue.value,
              afterSubmit
            )
          }
        }
      }
    }
    return {
      elementRef,
      inputVisible,
      inputValue,
      handleShowInput,
      handleInputConfirm,
      handleInputBlur,
    }
  },
})
</script>