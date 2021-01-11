<template>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="18" :md="16">
      <BaseForm
        :name="formName"
        :data="formData"
        :fields="formFields"
        :title="action === 'add' ? '添加' : '修改'"
        :handleSubmit="handleFormSubmit"
        class="min-width-600"
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
import { ChoiceItem, FormFieldItem } from '@/components/base/forms/types'
import { Group } from './types'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

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
        type: 'transfer',
        name: 'user_set',
        label: '',
        choices: [],
        props: {
          titles: ['所有用户', '组成员'],
          filterable: true
        },
      },
      {
        type: 'transfer',
        name: 'permissions',
        label: '',
        choices: [],
        props: {
          titles: ['所有权限', '组权限'],
          filterable: true
        },
      },
    ])
    // 修改user_set的选项
    // 所有用户
    const userChoicesFields = [
      { field: 'key', valueField: 'id' },
      { field: 'label', valueField: 'username' },
      { field: 'value', valueField: 'username' },
    ]
    const callback = (objs: Array<ChoiceItem>) => {
      formFields.value.forEach((item) => {
        if (item['name'] === 'user_set') {
          item['choices'] = objs
          return
        }
      })
    }

    useFetchChoices('/api/v1/account/user/all', userChoicesFields, callback)
     // 所有用户
    const permissionChoicesFields = [
      { field: 'key', valueField: 'id' },
      { field: 'label', valueField: 'name' },
      { field: 'value', valueField: 'username' },
    ]
    const callback2 = (objs: Array<ChoiceItem>) => {
      formFields.value.forEach((item) => {
        if (item['name'] === 'permissions') {
          item['choices'] = objs
          return
        }
      })
    }

    useFetchChoices('/api/v1/account/permission/all', permissionChoicesFields, callback2)
    
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