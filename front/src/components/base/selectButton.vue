<template>
  <el-select
    v-model="value"
    :placeholder="placeholder"
    @change="onChange"
    v-bind="props"
  >
    <el-option
      v-for="(item, index) in options"
      :key="`${index}-${item.value}`"
      :label="item.text || item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script lang="ts">
/**
 * 通过传递Url获取选项
 */
import { defineComponent, PropType, Ref, ref, watch } from 'vue'

import { ChoiceField, ChoiceItem } from '@/components/base/forms/types'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

export default defineComponent({
  name: 'SelectButton',
  props: {
    url: String,  // 获取选项的url
    optionFields: Array as PropType<Array<ChoiceField>>,  // 数组，选项的text,value,id等
    initValue: [String, Number],  // 初始化的值：字符或者数字
    handleValueChange: Function,  // 当选项值变更的时候触发
    placeholder: {
      type: String,
      default: () => '请选择',
    },
    props: {   // el-select的属性
      type: Object,
      default: () => {
        return { size: 'mini', clearable: true }
      },
    },
  },
  setup(props) {
    //  Select的值
    const value: Ref<string | number> = ref('')

    // 获取选项的url，当props.url变更的时候，修改url.value
    const url = ref('')

    // Select的选项
    const options: Ref<Array<ChoiceItem>> = ref([])

    // 获取选项列表的callback函数
    const callback = (objs: Array<ChoiceItem>) => {
      options.value = objs
    }

    useFetchChoices(url, props.optionFields as Array<ChoiceField>, callback)

    // 值变更的时候触发
    const onChange = (value: string | number) => {
      // console.log('select button on change')
      if (props.handleValueChange) {
        props.handleValueChange(value)
      }
    }

    // 监控url的变化
    watch(
      [props],
      () => {
        // console.log(props.url)
        // url的变更
        if (
          props.url &&
          Array.isArray(props.optionFields) &&
          props.optionFields.length > 0
        ) {
          url.value = props.url
        }
        // 初始值的变更
        if (
          props.initValue &&
          props.initValue !== value.value
        ) {
          value.value = props.initValue
        }
      },
      {
        immediate: true,
      }
    )

    return {
      value,
      options,
      onChange,
    }
  },
})
</script>
