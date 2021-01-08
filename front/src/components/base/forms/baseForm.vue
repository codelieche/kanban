<template>
  <el-form :model="data" label-width="100px">
    <el-form-item
      :label="item.label"
      v-for="(item, index) in fields"
      :key="index"
      :rules="item.rules"
    >
      <!-- Input类型的 -->
      <el-input
        v-model="data[item.name]"
        v-if="item.type === 'input'"
        v-bind="item.props"
      ></el-input>
      <!-- 选择Switch -->
      <el-switch
        v-model="data[item.name]"
        v-else-if="item.type === 'switch'"
        v-bind="item.props"
      ></el-switch>

      <!-- 单选框 -->
      <el-radio-group
        v-model="data[item.name]"
        v-else-if="item.type === 'radio'"
        v-bind="item.props"
      >
        <el-radio
          :label="choice.value"
          v-for="(choice, index) in item.choices"
          :key="index"
          >{{ choice.text }}</el-radio
        >
      </el-radio-group>
      <!-- 单选按钮 -->
      <!-- 单选框 -->
      <el-radio-group
        v-model="data[item.name]"
        v-else-if="item.type === 'radio-button'"
        v-bind="item.props"
      >
        <el-radio-button
          :label="choice.value"
          v-for="(choice, index) in item.choices"
          :key="index"
          >{{ choice.text }}</el-radio-button
        >
      </el-radio-group>
      <!-- 多选框 -->
      <el-checkbox-group
        v-model="data[item.name]"
        v-else-if="item.type === 'checkbox'"
        v-bind="item.props"
      >
        <el-checkbox
          :label="choice.value"
          v-for="(choice, index) in item.choices"
          :name="item.name"
          :key="index"
          >{{ choice.text }}</el-checkbox
        >
      </el-checkbox-group>
      <!-- Select:选择器 -->
      <el-select
        v-model="data[item.name]"
        v-else-if="item.type === 'select'"
        v-bind="item.props"
      >
        <el-option
          :label="choice.text"
          :value="choice.value"
          v-for="(choice, index) in item.choices"
          :key="index"
        ></el-option>
      </el-select>
      <span v-else>
        {{ item }}
      </span>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click.stop.prevent="onSubmit" size="small">{{ title }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, inject } from 'vue'
import { FormFieldItem } from '@/components/base/forms/types'
export default defineComponent({
  name: 'BaseForm',
  props: {
    name: String, // 表格的名字
    fields: Array as PropType<Array<FormFieldItem>>,
    title: {
        type: String,
        default: () => "提交"
    },
    handleSubmit: Function,
  },
  setup(props) {
    // 上级通过provide提供数据，当前组件通过inject获取数据
    const data =
      props.name && inject(props.name) ? inject(props.name) : reactive({})

    // 提交函数: 注意上一级处理数据
    const onSubmit = () => {
        if(props.handleSubmit){
            props.handleSubmit()
        }
    }
    return { data, onSubmit }
  },
})
</script>