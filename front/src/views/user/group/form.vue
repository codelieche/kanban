<template>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="18" :md="16">
      <BaseForm
        :name="formName"
        :data="formData"
        :fields="formFields"
        :title="action === 'add' ? '添加' : '修改'"
        :handleSubmit="handleFormSubmit"
      ></BaseForm>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  provide,
  Ref,
  ref,
  watch,
} from 'vue'
import BaseForm from '@/components/base/forms/baseForm.vue'
import { FormFieldItem } from '@/components/base/forms/types'
import { Group } from './types'

export default defineComponent({
  name: 'GroupForm',
  props: {
    action: {
      type: String,
      default: () => 'add',
    },
    data: Object as PropType<Group>,
    handleSubmit: Function,
  },
  components: { BaseForm },

  setup(props) {
    //   表单数据、名字、字段
    // eslint-disable-next-line @typescript-eslint/camelcase
    const defaultValue = { name: '', user_set: [], permissions: [] }
    const formData: Ref<Group> = ref(defaultValue)
    const formName = 'groupForm'
    provide(formName, formData)
    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'name',
        type: 'input',
        label: '名字',
        rules: [
          {
            required: true,
            message: '请输入分组名',
          },
        ],
        props: {
          placeholder: '分组名',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'user_set',
        type: 'checkbox',
        label: '用户',
        rules: [
          {
            required: true,
            message: '请选择用户',
          },
        ],
        choices: [
          { text: '男', value: 1 },
          { text: '女', value: 2 },
        ],
        props: {
          placeholder: '分组名',
          size: 'small',
          clearable: true,
        },
      },
    ])
    // 表单提交函数
    const handleFormSubmit = () => {
      if (props.handleSubmit) {
        props.handleSubmit(formData.value)
      }
    }

    onMounted(() => {
      if (props.data) {
        formData.value = props.data
      }
    })
    watch([props], () => {
      // console.log('props变更了', props)
      if (props.action === 'add') {
        formData.value = defaultValue
      } else {
        if (props.data) {
          formData.value = props.data
        }
      }
    })

    return {
      formName,
      formData,
      formFields,
      handleFormSubmit,
    }
  },
})
</script>