<template>
  <el-form
    :model="data"
    label-width="100px"
    ref="formRef"
    v-bind="props"
    class="base-form"
  >
    <el-form-item
      :label="item.label"
      v-for="(item, index) in fields"
      :key="index"
      :prop="item.name"
      :rules="item.rules"
    >
      <!-- Input类型的 -->
      <el-input
        v-model="data[item.name]"
        v-if="item.type === 'input'"
        v-bind="item.props"
      ></el-input>

      <!-- Input Number -->
      <el-input-number
        v-model="data[item.name]"
        v-else-if="item.type === 'number'"
        v-bind="item.props"
      ></el-input-number>

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

      <!-- 穿梭框 -->
      <el-transfer
        v-model="data[item.name]"
        :data="item.choices"
        v-else-if="item.type === 'transfer'"
        v-bind="item.props"
      >
      </el-transfer>

      <!-- 层级选择器 -->
      <el-cascader
        v-model="data[item.name]"
        v-else-if="item.type === 'cascader'"
        :options="item.choices"
        v-bind="item.props"
      >
      </el-cascader>

      <!-- 上传图片或者文件 -->
      <UploadItem
        v-else-if="item.type === 'upload'"
        :name="item.name"
        :value="data[item.name]"
        v-bind="item.props"
      >
      </UploadItem>
      <el-upload
        action=""
        v-else-if="item.type === 'upload2'"
        drag
        :auto-upload="false"
        v-bind="item.props"
        class="full"
      >
        <img
          :src="data[item.name]"
          v-if="data[item.name] && item.name == 'image'"
        />
        <div v-else>
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            {{ item.props.tips ? item.props.tips : '' }}
          </div>
        </template>
      </el-upload>
      <span v-else>
        {{ item }}
      </span>
    </el-form-item>
    <el-form-item class="buttons">
      <el-button type="primary" @click.stop.prevent="onSubmit" size="small">{{
        title
      }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, PropType, inject, ref, Ref } from 'vue'
import { FormFieldItem, ElementFormRef } from '@/components/base/forms/types'
import { ElMessage } from 'element-plus'
import UploadItem from './uploadItem.vue'

export default defineComponent({
  name: 'BaseForm',
  props: {
    name: String, // 表格的名字
    fields: Array as PropType<Array<FormFieldItem>>,
    title: {
      type: String,
      default: () => '提交',
    },
    props: Object,
    handleSubmit: Function,
  },
  components: { UploadItem },
  setup(props) {
    //   formRef
    const formRef: Ref<ElementFormRef | null> = ref(null)
    // 上级通过provide提供数据，当前组件通过inject获取数据
    const data = props.name && inject(props.name) ? inject(props.name) : ref({})

    // 提交函数: 注意上一级处理数据
    const onSubmit = () => {
      if (formRef.value) {
        //   console.log(formRef)
        formRef.value.validate((valid: boolean) => {
          if (valid) {
            if (props.handleSubmit) {
              props.handleSubmit()
            }
          } else {
            ElMessage.warning('请重新填写必要的信息')
          }
        })
      }
    }
    return { data, onSubmit, formRef }
  },
})
</script>