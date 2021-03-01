<template>
  <el-row :gutter="16">
    <el-col :xs="24" :sm="18" :md="16">
      <BaseForm
        :name="formName"
        :fields="formFields"
        :title="action === 'add' ? '添加' : '修改'"
        :handleSubmit="handleFormSubmit"
        :data="formData"
        class="min-width-600"
      >
      </BaseForm>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent, provide, Ref, ref, watch } from 'vue'

import BaseForm from '@/components/base/forms/baseForm.vue'
import { ChoiceItem, FormFieldItem } from '@/components/base/forms/types'
import useFetchChoices from '@/hooks/utils/useFetchChoices'

export default defineComponent({
  name: 'AccountForm',
  props: {
    action: {
      type: String,
      default: () => 'add',
    },
    data: Object,
    handleSubmit: Function,
  },
  components: {
    BaseForm,
  },
  setup(props) {
    // 表单数据、名字、字段
    const defaultValue = {
      user: '',
      account: '',
      'is_active': true,
      'is_default': false,
      'is_https': false,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formData: Ref<Record<string, any>> = ref(defaultValue)
    const formName = 'accountForm'
    provide(formName, formData)

    const formFields: Ref<Array<FormFieldItem>> = ref([
      {
        name: 'user',
        type: 'select',
        label: '用户',
        rules: [
          {
            required: true,
            message: '请选择用户',
          },
        ],
        props: {
          size: 'small',
          filterable: true,
        },
        choices: [],
      },
      {
        type: 'radio-button',
        name: 'platform',
        label: '平台',
        rules: [{ required: true, message: '请选择平台' }],
        choices: [
          { text: '七牛云', value: 'qiniu' },
          { text: '阿里云', value: 'aliyun' },
          { text: '腾讯云', value: 'tencent' },
          { text: '亚马逊', value: 'aws' },
        ],
        props: { size: 'small' },
      },
      {
        name: 'account',
        type: 'input',
        label: '账号',
        rules: [
          {
            required: true,
            message: '请输入存储账号名',
          },
        ],
        props: {
          placeholder: '账号名',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'bucket',
        type: 'input',
        label: 'Bucket',
        rules: [
          {
            required: true,
            message: '请输入Bucket',
          },
        ],
        props: {
          placeholder: 'Bucket',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'domain',
        type: 'input',
        label: '域名',
        rules: [
          {
            required: true,
            message: '请输入域名',
          },
        ],
        props: {
          placeholder: '域名',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'access_key',
        type: 'input',
        label: 'Access Key',
        rules: [
          {
            required: true,
            message: '请输入Access Key',
          },
        ],
        props: {
          placeholder: 'Access Key',
          size: 'small',
          clearable: true,
        },
      },
      {
        name: 'secret_key',
        type: 'input',
        label: 'Secret Key',
        rules: [
          {
            required: true,
            message: '请输入Access Secret Key',
          },
        ],
        props: {
          placeholder: 'Access Secret Key',
          size: 'small',
          clearable: true,
          'show-password': false,
        },
      },
      {
        type: 'radio-button',
        name: 'is_https',
        label: '是否HTTPS',
        rules: [{ required: false, message: '请选择是否采用HTTPS' }],
        choices: [
          { text: 'HTTP', value: false },
          { text: 'HTTPS', value: true },
        ],
        props: { size: 'small' },
      },
      {
        type: 'radio-button',
        name: 'is_default',
        label: '是否默认',
        rules: [{ required: false, message: '请选择是否默认' }],
        choices: [
          { text: '是', value: true },
          { text: '否', value: false },
        ],
        props: { size: 'small' },
      },
      {
        type: 'radio-button',
        name: 'is_active',
        label: '状态',
        rules: [{ required: false, message: '请选择是否启用' }],
        choices: [
          { text: '启用', value: true },
          { text: '禁用', value: false },
        ],
        props: { size: 'small' },
      },
      {
        name: 'description',
        type: 'input',
        label: '描述',
        rules: [
          {
            required: false,
            message: '请输入描述',
          },
        ],
        props: {
          placeholder: '描述一下',
          size: 'small',
          type: 'textarea',
        },
      },
    ])

    // 所有用户
    const userChoicesFields = [
      { field: 'key', valueField: 'username' },
      { field: 'label', valueField: 'username' },
      { field: 'value', valueField: 'username' },
    ]
    const callback = (objs: Array<ChoiceItem>) => {
      formFields.value.forEach((item) => {
        if (item['name'] === 'user') {
          item['choices'] = objs
          return
        }
      })
    }
    useFetchChoices('/api/v1/account/user/all', userChoicesFields, callback)

    // 表单提交函数
    const handleFormSubmit = () => {
      if (props.handleSubmit) {
        props.handleSubmit(formData.value)
      }
    }

    // 监控属性的变化
    watch(
      [props],
      () => {
        // console.log('props变更了', props)
        if (props.action === 'add') {
          formData.value = defaultValue
        } else {
          if (props.data) {
            formData.value = props.data
          }
        }
      },
      { immediate: true }
    )

    return {
      formName,
      formData,
      formFields,
      handleFormSubmit,
    }
  },
})
</script>